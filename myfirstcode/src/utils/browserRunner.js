// Hybrid in-browser code execution for JavaScript (Web Worker) and Python (Pyodide WASM).
// Compiled languages (Java, C, C++) are handled by the backend Piston/Wandbox runner.

const PYODIDE_INDEX_URL = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";
const PYODIDE_SCRIPT_URL = `${PYODIDE_INDEX_URL}pyodide.js`;
const JS_TIMEOUT_MS = 5000;

let pyodideReadyPromise = null;

export const BROWSER_LANGUAGES = new Set(["javascript", "python"]);

export function isBrowserLanguage(language) {
  return BROWSER_LANGUAGES.has(String(language || "").toLowerCase());
}

/**
 * Execute JavaScript safely inside an isolated Web Worker with a 5-second timeout.
 * Supports console.log/error/warn, input()/prompt() reading from stdin, and basic fs.readFileSync(0).
 */
export function runJavaScriptInBrowser(code, stdin = "") {
  return new Promise((resolve) => {
    const startTime = performance.now();

    const workerScript = `
      self.onmessage = async function(e) {
        const { code, stdin } = e.data;
        const stdoutParts = [];
        const stderrParts = [];
        const stdinLines = String(stdin || "").replace(/\\r\\n/g, "\\n").split("\\n");
        let stdinIndex = 0;

        const formatArg = (val) => {
          if (typeof val === "string") return val;
          if (val === undefined) return "undefined";
          if (val === null) return "null";
          if (val instanceof Error) return val.stack || val.message || String(val);
          try {
            return JSON.stringify(val);
          } catch {
            return String(val);
          }
        };

        const customConsole = {
          log: (...args) => stdoutParts.push(args.map(formatArg).join(" ") + "\\n"),
          info: (...args) => stdoutParts.push(args.map(formatArg).join(" ") + "\\n"),
          warn: (...args) => stdoutParts.push(args.map(formatArg).join(" ") + "\\n"),
          error: (...args) => stderrParts.push(args.map(formatArg).join(" ") + "\\n"),
        };

        const readLine = () => {
          if (stdinIndex < stdinLines.length) {
            return stdinLines[stdinIndex++];
          }
          return "";
        };

        const customRequire = (mod) => {
          if (mod === "fs") {
            return {
              readFileSync: () => String(stdin || ""),
            };
          }
          throw new Error("Module '" + mod + "' is not available in browser sandbox.");
        };

        try {
          const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
          const fn = new AsyncFunction(
            "console",
            "input",
            "prompt",
            "readline",
            "require",
            code
          );
          await fn(customConsole, readLine, readLine, readLine, customRequire);
          self.postMessage({
            ok: true,
            stdout: stdoutParts.join(""),
            stderr: stderrParts.join(""),
            compile_output: "",
          });
        } catch (err) {
          const isSyntax = err instanceof SyntaxError;
          const msg = err && err.stack ? err.stack : String(err);
          self.postMessage({
            ok: false,
            stdout: stdoutParts.join(""),
            stderr: isSyntax ? "" : (stderrParts.join("") + msg + "\\n"),
            compile_output: isSyntax ? msg : "",
            status: isSyntax ? "Syntax Error" : "Runtime Error",
          });
        }
      };
    `;

    const blob = new Blob([workerScript], { type: "application/javascript" });
    const workerUrl = URL.createObjectURL(blob);
    const worker = new Worker(workerUrl);

    const timer = setTimeout(() => {
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
      resolve({
        success: true,
        engine: "browser-js",
        stdout: "",
        stderr: `Execution timed out after ${JS_TIMEOUT_MS / 1000} seconds. Check your code for infinite loops.`,
        compile_output: "",
        status: "Time Limit Exceeded",
        executionTime: `${(JS_TIMEOUT_MS / 1000).toFixed(2)}s`,
      });
    }, JS_TIMEOUT_MS);

    worker.onmessage = (e) => {
      clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
      const elapsed = ((performance.now() - startTime) / 1000).toFixed(3);
      const data = e.data || {};
      resolve({
        success: true,
        engine: "browser-js",
        stdout: data.stdout || "",
        stderr: data.stderr || "",
        compile_output: data.compile_output || "",
        status: data.ok ? "Accepted (Browser)" : data.status || "Runtime Error",
        executionTime: `${elapsed}s`,
      });
    };

    worker.onerror = (err) => {
      clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
      const elapsed = ((performance.now() - startTime) / 1000).toFixed(3);
      resolve({
        success: true,
        engine: "browser-js",
        stdout: "",
        stderr: err?.message || "Runtime Error in JavaScript Worker",
        compile_output: "",
        status: "Runtime Error",
        executionTime: `${elapsed}s`,
      });
    };

    worker.postMessage({ code, stdin });
  });
}

/**
 * Load Pyodide once from jsDelivr CDN and cache the instance in memory.
 */
function loadPyodideInstance(onStatus) {
  if (pyodideReadyPromise) return pyodideReadyPromise;

  pyodideReadyPromise = new Promise((resolve, reject) => {
    const init = async () => {
      try {
        if (onStatus) onStatus("Initializing Python runtime...");
        const pyodide = await window.loadPyodide({
          indexURL: PYODIDE_INDEX_URL,
        });
        resolve(pyodide);
      } catch (err) {
        pyodideReadyPromise = null;
        reject(err);
      }
    };

    if (typeof window.loadPyodide === "function") {
      init();
      return;
    }

    if (onStatus) onStatus("Downloading Python runtime (first run only)...");
    const existingScript = document.querySelector(`script[src="${PYODIDE_SCRIPT_URL}"]`);
    if (existingScript) {
      existingScript.addEventListener("load", init, { once: true });
      existingScript.addEventListener(
        "error",
        () => {
          pyodideReadyPromise = null;
          reject(new Error("Failed to load Pyodide script from CDN"));
        },
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.src = PYODIDE_SCRIPT_URL;
    script.async = true;
    script.onload = init;
    script.onerror = () => {
      pyodideReadyPromise = null;
      reject(new Error("Failed to load Pyodide script from CDN"));
    };
    document.head.appendChild(script);
  });

  return pyodideReadyPromise;
}

/**
 * Execute Python 3 code in the browser via Pyodide.
 * Captures stdout/stderr and supports input() from stdin (or interactive browser prompt if stdin is empty).
 */
export async function runPythonInBrowser(code, stdin = "", onStatus) {
  const pyodide = await loadPyodideInstance(onStatus);
  if (onStatus) onStatus("Running Python code...");

  const startTime = performance.now();

  pyodide.globals.set("__user_code__", String(code || ""));
  pyodide.globals.set("__user_stdin__", String(stdin || ""));

  const runnerWrapper = `
import sys, io, builtins, traceback

__stdout_buf = io.StringIO()
__stderr_buf = io.StringIO()
__stdin_lines = __user_stdin__.replace("\\r\\n", "\\n").split("\\n") if __user_stdin__ != "" else []
__stdin_idx = 0

def __custom_input(prompt=""):
    global __stdin_idx
    if __stdin_idx < len(__stdin_lines):
        line = __stdin_lines[__stdin_idx]
        __stdin_idx += 1
        return line
    try:
        import js
        ans = js.prompt(str(prompt) if prompt else "Enter input:")
        return ans if ans is not None else ""
    except Exception:
        raise EOFError("EOF when reading a line (provide input in the stdin box below)")

sys.stdout = __stdout_buf
sys.stderr = __stderr_buf
sys.stdin = io.StringIO(__user_stdin__)
builtins.input = __custom_input

__status = "Accepted (Browser)"
__compile_err = ""

try:
    __compiled = compile(__user_code__, "<playground>", "exec")
    exec(__compiled, {"__name__": "__main__"})
except SyntaxError:
    __status = "Syntax Error"
    __compile_err = traceback.format_exc(limit=1)
except Exception as e:
    __status = f"Runtime Error ({type(e).__name__})"
    tb_lines = traceback.format_exception(type(e), e, e.__traceback__)
    filtered = [line for line in tb_lines if "_pyodide" not in line and "<exec>" not in line]
    __stderr_buf.write("".join(filtered))
finally:
    sys.stdout = sys.__stdout__
    sys.stderr = sys.__stderr__

{
    "stdout": __stdout_buf.getvalue(),
    "stderr": __stderr_buf.getvalue(),
    "compile_output": __compile_err,
    "status": __status,
}
`;

  const pyResult = await pyodide.runPythonAsync(runnerWrapper);
  const res = pyResult.toJs({ dict_converter: Object.fromEntries });
  pyResult.destroy?.();

  const elapsed = ((performance.now() - startTime) / 1000).toFixed(3);

  return {
    success: true,
    engine: "browser-python",
    stdout: res.stdout || "",
    stderr: res.stderr || "",
    compile_output: res.compile_output || "",
    status: res.status || "Accepted (Browser)",
    executionTime: `${elapsed}s`,
  };
}


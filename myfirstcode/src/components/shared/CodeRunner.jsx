import { useState, useEffect } from "react";
import { Play, Loader2, Cpu, Cloud } from "lucide-react";
import api from "../../api/axios.js";
import { ENDPOINTS } from "../../api/endpoints.js";
import {
  isBrowserLanguage,
  runJavaScriptInBrowser,
  runPythonInBrowser,
} from "../../utils/browserRunner.js";

const LANGUAGES = ["javascript", "python", "java", "c", "cpp"];

const DEFAULT_TEMPLATES = {
  python: `print("Hello, myFirstCode!")`,
  javascript: `console.log("Hello, myFirstCode!");`,
  java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, myFirstCode!");\n    }\n}`,
  c: `#include <stdio.h>\n\nint main() {\n    printf("Hello, myFirstCode!\\n");\n    return 0;\n}`,
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, myFirstCode!" << endl;\n    return 0;\n}`,
};

const TEMPLATE_SET = new Set(Object.values(DEFAULT_TEMPLATES).map((s) => s.trim()));

export default function CodeRunner({ initialCode = "", initialLanguage = "python", height = "h-64" }) {
  const normalizedInitLang = (initialLanguage || "python").toLowerCase();
  const [language, setLanguage] = useState(normalizedInitLang);
  const [code, setCode] = useState(
    initialCode || DEFAULT_TEMPLATES[normalizedInitLang] || ""
  );
  const [stdin, setStdin] = useState("");
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const nextLang = (initialLanguage || "python").toLowerCase();
    setLanguage(nextLang);
    setCode(initialCode || DEFAULT_TEMPLATES[nextLang] || "");
    setResult(null);
    setError("");
  }, [initialCode, initialLanguage]);

  const handleLanguageChange = (e) => {
    const nextLang = e.target.value;
    const trimmed = code.trim();
    if (!trimmed || TEMPLATE_SET.has(trimmed)) {
      setCode(DEFAULT_TEMPLATES[nextLang] || "");
    }
    setLanguage(nextLang);
    setResult(null);
    setError("");
  };

  const runOnBackend = async () => {
    const { data } = await api.post(ENDPOINTS.runCode, {
      code,
      sourceCode: code,
      language,
      stdin,
    });
    return {
      ...data,
      stdout: data.stdout ?? data.output ?? "",
      stderr: data.stderr ?? data.error ?? "",
      compile_output: data.compile_output ?? "",
      status:
        data.status ||
        (data.isExecutionSuccess === false ? "Execution Error" : "Accepted (Piston)"),
    };
  };

  const run = async () => {
    if (!code.trim()) {
      setError("Please write some code before running.");
      return;
    }

    setRunning(true);
    setError("");
    setResult(null);
    setStatusText("");

    try {
      const lang = language.toLowerCase();

      if (lang === "javascript") {
        setStatusText("Running in browser...");
        const res = await runJavaScriptInBrowser(code, stdin);
        setResult(res);
      } else if (lang === "python") {
        try {
          const res = await runPythonInBrowser(code, stdin, setStatusText);
          setResult(res);
        } catch (pyErr) {
          console.warn("Pyodide browser execution unavailable, falling back to backend:", pyErr);
          setStatusText("Running on server...");
          const res = await runOnBackend();
          setResult(res);
        }
      } else {
        setStatusText("Compiling & running via Piston...");
        const res = await runOnBackend();
        setResult(res);
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Couldn't reach the code runner. Try again."
      );
    } finally {
      setRunning(false);
      setStatusText("");
    }
  };

  const runsInBrowser = isBrowserLanguage(language);

  return (
    <div className="overflow-hidden rounded-xl border border-ink/10">
      <div className="flex items-center justify-between gap-2 bg-ink px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-coral" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber" />
          <span className="h-2.5 w-2.5 rounded-full bg-mint" />
          <select
            value={language}
            onChange={handleLanguageChange}
            className="ml-3 rounded-md border-none bg-white/10 px-2 py-1 font-mono text-xs text-white outline-none"
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l} className="text-ink">
                {l}
              </option>
            ))}
          </select>
          <span
            className="hidden items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 font-mono text-[10px] text-white/70 sm:inline-flex"
            title={
              runsInBrowser
                ? "Executes directly in your browser (WebAssembly / Web Worker)"
                : "Compiled & executed via Piston API"
            }
          >
            {runsInBrowser ? <Cpu size={11} className="text-mint" /> : <Cloud size={11} className="text-amber" />}
            {runsInBrowser ? "Browser Runner" : "Piston Compiler"}
          </span>
        </div>
        <button onClick={run} disabled={running} className="btn-primary btn-sm">
          {running ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
          {running ? statusText || "Running..." : "Run code"}
        </button>
      </div>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
        className={`w-full resize-none bg-[#0D0E23] px-4 py-3 font-mono text-[13px] leading-relaxed text-white/90 outline-none ${height}`}
        placeholder="// write your code here"
      />

      <div className="grid grid-cols-1 divide-y divide-ink/10 border-t border-ink/10 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        <div>
          <p className="bg-ink/[0.03] px-4 py-1.5 font-mono text-[10px] uppercase tracking-wide text-slate-muted">stdin</p>
          <textarea
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            className="h-24 w-full resize-none bg-white px-4 py-2 font-mono text-xs text-ink outline-none"
            placeholder="optional input (one value per line)"
          />
        </div>
        <div>
          <div className="flex items-center justify-between bg-ink/[0.03] px-4 py-1.5 font-mono text-[10px] uppercase tracking-wide text-slate-muted">
            <span>output</span>
            {result?.executionTime && <span>time: {result.executionTime}</span>}
          </div>
          <div className="h-24 overflow-y-auto bg-white px-4 py-2 font-mono text-xs">
            {error && <p className="text-coral">{error}</p>}
            {result && (
              <>
                {result.stdout && <pre className="whitespace-pre-wrap text-mint-dark">{result.stdout}</pre>}
                {result.stderr && <pre className="whitespace-pre-wrap text-coral">{result.stderr}</pre>}
                {result.compile_output && <pre className="whitespace-pre-wrap text-amber-dark">{result.compile_output}</pre>}
                {!result.stdout && !result.stderr && !result.compile_output && (
                  <p className="italic text-slate-faint">(program finished with no output)</p>
                )}
                <p className="mt-1 text-slate-muted">status: {result.status}</p>
              </>
            )}
            {!error && !result && (
              <p className="text-slate-faint">
                {running ? statusText || "executing..." : "run your code to see output here"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

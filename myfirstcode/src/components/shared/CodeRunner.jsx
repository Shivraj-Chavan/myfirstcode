import { useState } from "react";
import { Play, Loader2 } from "lucide-react";
import api from "../../api/axios.js";
import { ENDPOINTS } from "../../api/endpoints.js";

const LANGUAGES = ["javascript", "python", "java", "c", "cpp"];

export default function CodeRunner({ initialCode = "", initialLanguage = "python", height = "h-64" }) {
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState(initialLanguage);
  const [stdin, setStdin] = useState("");
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");

  const run = async () => {
    setRunning(true);
    setError("");
    setResult(null);
    try {
      const { data } = await api.post(ENDPOINTS.runCode, { code, language, stdin });
      setResult(data);
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't reach the code runner. Try again.");
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-ink/10">
      <div className="flex items-center justify-between gap-2 bg-ink px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-coral" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber" />
          <span className="h-2.5 w-2.5 rounded-full bg-mint" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="ml-3 rounded-md border-none bg-white/10 px-2 py-1 font-mono text-xs text-white outline-none"
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l} className="text-ink">
                {l}
              </option>
            ))}
          </select>
        </div>
        <button onClick={run} disabled={running} className="btn-primary btn-sm">
          {running ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
          {running ? "Running..." : "Run code"}
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
            className="h-20 w-full resize-none bg-white px-4 py-2 font-mono text-xs text-ink outline-none"
            placeholder="optional input"
          />
        </div>
        <div>
          <p className="bg-ink/[0.03] px-4 py-1.5 font-mono text-[10px] uppercase tracking-wide text-slate-muted">output</p>
          <div className="h-20 overflow-y-auto bg-white px-4 py-2 font-mono text-xs">
            {error && <p className="text-coral">{error}</p>}
            {result && (
              <>
                {result.stdout && <pre className="whitespace-pre-wrap text-mint-dark">{result.stdout}</pre>}
                {result.stderr && <pre className="whitespace-pre-wrap text-coral">{result.stderr}</pre>}
                {result.compile_output && <pre className="whitespace-pre-wrap text-amber-dark">{result.compile_output}</pre>}
                <p className="mt-1 text-slate-muted">status: {result.status}</p>
              </>
            )}
            {!error && !result && <p className="text-slate-faint">run your code to see output here</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

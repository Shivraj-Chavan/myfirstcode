import { useEffect, useState } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";
import {
  Play, Send, RotateCcw, Lightbulb, Trophy, ChevronDown, ChevronUp,
  FileCode2, Hash, Layers, AlertCircle, CheckCircle2, XCircle,
  Terminal, BookOpen, Star
} from "lucide-react";
import ENDPOINT from "../../lib/endpoints";

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

// DB returns snake_case columns — normalise to one consistent shape
function normalise(a) {
  return {
    ...a,
    starterCode:    a.starter_code    ?? a.starterCode    ?? "",
    solutionCode:   a.solution_code   ?? a.solutionCode   ?? "",
    expectedOutput: a.expected_output ?? a.expectedOutput ?? "",
    hints:          safeArray(a.hints),
    testCases:      safeArray(a.test_cases ?? a.testCases),
  };
}

function safeArray(val) {
  if (Array.isArray(val)) return val;
  if (typeof val === "string") { try { return JSON.parse(val); } catch { return []; } }
  return [];
}

function normaliseCode(str = "") {
  return str.replace(/\r\n/g, "\n").trim();
}

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

const DIFF = {
  easy:   { label: "Easy",   color: "#22c55e", bg: "rgba(34,197,94,0.12)"  },
  medium: { label: "Medium", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  hard:   { label: "Hard",   color: "#ef4444", bg: "rgba(239,68,68,0.12)"  },
};

const LANG_ICON = {
  python: "🐍", javascript: "⚡", java: "☕",
  c: "🔧", cpp: "⚙️", html: "🌐", css: "🎨",
};

// ─────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────

function SidebarItem({ assignment, isSelected, onClick, status }) {
  const diff = DIFF[(assignment.difficulty || "easy").toLowerCase()] || DIFF.easy;
  return (
    <button
      onClick={onClick}
      style={{
        background: isSelected ? "rgba(255,255,255,0.08)" : "transparent",
        borderLeft: isSelected ? "3px solid #fff" : "3px solid transparent",
      }}
      className="w-full text-left px-4 py-3.5 transition-all duration-150 hover:bg-white/5 flex items-start gap-3 group"
    >
      <div className="flex-shrink-0 mt-0.5">
        {status === "completed" ? (
          <CheckCircle2 size={14} className="text-emerald-400" />
        ) : status === "attempted" ? (
          <div className="w-3.5 h-3.5 rounded-full border-2 border-amber-400/60" />
        ) : (
          <div className="w-3.5 h-3.5 rounded-full border border-white/20 group-hover:border-white/50 transition-colors" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium leading-snug truncate ${isSelected ? "text-white" : "text-white/70"}`}>
          {assignment.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px]">{LANG_ICON[assignment.language] || "💻"}</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: diff.color }}>
            {diff.label}
          </span>
          <span className="text-[10px] text-white/30">{assignment.marks}pts</span>
        </div>
      </div>
    </button>
  );
}

function OutputConsole({ lines, submitStatus }) {
  return (
    <div className="h-full flex flex-col font-mono text-sm">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5 flex-shrink-0">
        <Terminal size={12} className="text-white/40" />
        <span className="text-[11px] font-semibold uppercase tracking-widest text-white/40">Output</span>
        {submitStatus === "correct" && (
          <span className="ml-auto flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
            <CheckCircle2 size={10} /> Accepted
          </span>
        )}
        {submitStatus === "wrong" && (
          <span className="ml-auto flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-400/10 px-2 py-0.5 rounded-full">
            <XCircle size={10} /> Wrong Answer
          </span>
        )}
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-0.5">
        {lines.length === 0 ? (
          <p className="text-white/20 text-xs italic">Run your code to see output here…</p>
        ) : (
          lines.map((line, i) => (
            <div key={i} className="flex gap-3 leading-relaxed">
              <span className="text-white/20 select-none text-[10px] w-5 text-right flex-shrink-0">{i + 1}</span>
              <span className={
                line.startsWith("❌") || line.toLowerCase().startsWith("error") ? "text-rose-400" :
                line.startsWith("✅") || line.startsWith("🎉")                  ? "text-emerald-400" :
                line.startsWith("💡")                                            ? "text-amber-400" :
                line.startsWith(">")                                             ? "text-white/40" :
                "text-green-300"
              }>{line}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────

export default function StudentAssignments() {
  const [assignments,  setAssignments]  = useState([]);
  const [selected,     setSelected]     = useState(null);
  const [code,         setCode]         = useState("");
  const [outputLines,  setOutputLines]  = useState([]);
  const [submitStatus, setSubmitStatus] = useState("");  
  const [loading,      setLoading]      = useState(true);
  const [loadError,    setLoadError]    = useState("");
  const [reloadKey,    setReloadKey]    = useState(0);
  const [hintIndex,    setHintIndex]    = useState(0);
  const [statusMap,    setStatusMap]    = useState({});   
  const [running,      setRunning]      = useState(false);
  const [submitting,   setSubmitting]   = useState(false);
  const [showDesc,     setShowDesc]     = useState(true);
  const [showTests,    setShowTests]    = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  // ── Load assignments ───────────────────────
  useEffect(() => {

    const load = async () => {
  
      try {
  
        setLoadError("");
  
        const token =
          localStorage.getItem("token");
  
        const res =
          await axios.get(
            ENDPOINT.GET_ASSIGNMENTS,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );
  
        console.log(
          "ASSIGNMENTS RESPONSE:",
          res.data
        );
  
        // FIXED RESPONSE PARSING
  
        const raw =
  
          Array.isArray(res.data)
            ? res.data
  
            : Array.isArray(
                res.data.assignments
              )
            ? res.data.assignments
  
            : Array.isArray(
                res.data.data
              )
            ? res.data.data
  
            : [];
  
        const data =
          raw.map(normalise);
  
        console.log(
          "NORMALISED:",
          data
        );
  
        setAssignments(data);
  
      } catch (err) {
  
        console.log(
          "LOAD ERROR:",
          err?.response?.data ||
          err.message
        );
  
        setLoadError(
          err?.response?.data
            ?.message ||
  
          "Failed to load assignments"
        );
  
      } finally {
  
        setLoading(false);
  
      }
    };
  
    load();
  
  }, [reloadKey]);

  // ── Open ──────────────────────────────────
  const openAssignment = (a) => {

    setSelected(a);
  
    setCode(a.starterCode);
  
    setOutputLines([]);
  
    setSubmitStatus("");
  
    setHintIndex(0);
  
    setShowDesc(true);
  
    setShowTests(false);
  
    setShowSolution(false);
  };

  // ── Reset ─────────────────────────────────
  const handleReset = () => {
    if (!selected) return;
    setCode(selected.starterCode);
    setOutputLines([]);
    setSubmitStatus("");
  };

  // ── Hint ──────────────────────────────────
  const hints = selected?.hints ?? [];
  const handleHint = () => {
    if (!hints.length) return;
    if (hintIndex < hints.length) {
      setOutputLines([`💡 Hint ${hintIndex + 1}/${hints.length}: ${hints[hintIndex]}`]);
      setSubmitStatus("");
      setHintIndex(h => h + 1);
    } else {
      setOutputLines(["💡 No more hints available."]);
    }
  };

  // ── Run (simulated) ───────────────────────
// const handleRun = async () => {

//   if (!selected || running)
//     return;

//   try {

//     setRunning(true);

//     console.log("========== RUN START ==========");
//     console.log("Selected Assignment:", selected);
//     console.log("Language:", selected.language);
//     console.log("Code:", code);

//     setOutputLines([
//       "> Running code..."
//     ]);

//     const token =
//       localStorage.getItem("token");

//     console.log("TOKEN:", token);

//     // FIRST TEST CASE INPUT

//     const stdin =
//       selected?.testCases?.[0]?.input || "";

//     console.log("STDIN:", stdin);

//     const payload = {

//       code,
//       language:
//         selected.language,
//       stdin,
//     };

//     console.log("RUN PAYLOAD:", payload);

//     const res =
//       await axios.post(

//         ENDPOINT.RUN_CODE,

//         payload,

//         {
//           headers: {
//             Authorization:
//               `Bearer ${token}`,
//           },
//         }
//       );

//     console.log("RUN RESPONSE:", res.data);

//     const data = res.data;

//     if (data.stderr) {

//       console.log("RUNTIME ERROR");

//       setOutputLines([
//         "❌ Runtime Error",
//         "",
//         data.stderr,
//       ]);

//       setSubmitStatus("wrong");

//     }

//     else if (
//       data.compile_output
//     ) {

//       console.log("COMPILATION ERROR");

//       setOutputLines([
//         "❌ Compilation Error",
//         "",
//         data.compile_output,
//       ]);

//       setSubmitStatus("wrong");

//     }

//     else {

//       console.log("SUCCESS OUTPUT:", data.stdout);

//       setOutputLines([

//         "✅ Execution Successful",
//         "",
//         ...(data.stdout
//           ? data.stdout.split("\n")
//           : ["No output"])

//       ]);

//       setSubmitStatus("");
//     }

//   } catch (err) {

//     console.log("RUN ERROR:", err);

//     console.log(
//       "RUN ERROR RESPONSE:",
//       err?.response?.data
//     );

//     setOutputLines([
//       "❌ Execution failed"
//     ]);

//   } finally {

//     console.log("========== RUN END ==========");

//     setRunning(false);
//   }
// };


const handleRun = async () => {
  if (!selected || running) return;

  try {
    setRunning(true);
    setOutputLines(["> Running code..."]);

    const token = localStorage.getItem("token");

    const stdin =
      selected?.testCases?.[0]?.input || "";

    const { data } = await axios.post(
      ENDPOINT.RUN_CODE,
      {
        sourceCode: code,
        language: selected.language,
        input: stdin,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!data.success) {
      setOutputLines([
        `❌ ${data.message}`,
      ]);
      return;
    }

    if (data.compile_output) {
      setOutputLines([
        "❌ Compilation Error",
        "",
        data.compile_output,
      ]);
      return;
    }

    if (data.stderr) {
      setOutputLines([
        "❌ Runtime Error",
        "",
        data.stderr,
      ]);
      return;
    }

    setOutputLines([
      "✅ Execution Successful",
      "",
      ...(data.stdout
        ? data.stdout.split("\n")
        : ["No Output"]),
    ]);

  } catch (err) {

    setOutputLines([
      "❌ Execution Failed",
      err.response?.data?.message ||
      err.message,
    ]);

  } finally {
    setRunning(false);
  }
};

  // ── Submit — ONLY mark complete on correct code ────────────
 // ── Submit ─────────────────────────────

 const handleSubmit = async () => {

  if (!selected || submitting || running)
    return;

  const id =
    selected.id || selected._id;

  if (
    statusMap[id] === "completed"
  ) return;

  setSubmitting(true);

  setOutputLines([
    "> Evaluating submission..."
  ]);

  setSubmitStatus("");

  try {

    const token =
      localStorage.getItem("token");

      const testCases =
      Array.isArray(selected?.testCases)
        ? selected.testCases
        : [];

    // ===============================
    // NO TEST CASES
    // ===============================

    if (testCases.length === 0) {

      setOutputLines([
        "❌ No test cases found"
      ]);

      setSubmitStatus("wrong");

      setSubmitting(false);

      return;
    }

    let passedAll = true;

    let failedCase = null;

    // ===============================
    // RUN ALL TEST CASES
    // ===============================

    for (const tc of testCases) {

      const runRes =
        await axios.post(

          ENDPOINT.RUN_CODE,

          {
            sourceCode: code,
            language: selected.language,
            input: tc.input,
          },

          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const data = runRes.data;

      console.log("RUN RESULT:", data);

      // ===============================
      // RUNTIME ERROR
      // ===============================

      if (data.stderr) {

        setOutputLines([
          "❌ Runtime Error",
          "",
          data.stderr,
        ]);

        setSubmitStatus("wrong");

        setSubmitting(false);

        return;
      }

      // ===============================
      // COMPILATION ERROR
      // ===============================

      if (data.compile_output) {

        setOutputLines([
          "❌ Compilation Error",
          "",
          data.compile_output,
        ]);

        setSubmitStatus("wrong");

        setSubmitting(false);

        return;
      }

      // ===============================
      // NORMALISE OUTPUT
      // ===============================

      const actualOutput =
        String(data.stdout || "")
          .replace(/\r\n/g, "\n")
          .trim();

      const expectedOutput =
        String(tc.output || "")
          .replace(/\r\n/g, "\n")
          .trim();

      console.log({
        input: tc.input,
        expected: expectedOutput,
        actual: actualOutput,
      });

      // ===============================
      // COMPARE OUTPUT
      // ===============================

      if (actualOutput !== expectedOutput) {

        passedAll = false;

        failedCase = {
          input: tc.input,
          expected: expectedOutput,
          actual: actualOutput,
        };

        break;
      }
    }

    // ===============================
    // FINAL RESULT
    // ===============================

    if (passedAll) {

      try {

        await axios.post(

          ENDPOINT.SUBMIT_ASSIGNMENT
            ? ENDPOINT.SUBMIT_ASSIGNMENT
            : `${ENDPOINT.GET_ASSIGNMENTS}/${id}/submit`,

          {
            assignmentId: id,
            code,
            status: "completed",
          },

          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      } catch (e) {

        console.log(
          "SUBMIT API ERROR:",
          e?.response?.data || e.message
        );
      }

      // ===============================
      // UPDATE STATUS
      // ===============================

      setStatusMap(prev => ({
        ...prev,
        [id]: "completed",
      }));

      setSubmitStatus("correct");

      setOutputLines([
        `🎉 Correct Solution! +${selected.marks} marks earned`,
        "",
        "✅ All test cases passed",
        "",
        "🏆 Assignment marked as completed",
      ]);

    } else {

      // ===============================
      // WRONG ANSWER
      // ===============================

      setStatusMap(prev => ({
        ...prev,
        [id]:
          prev[id] === "completed"
            ? "completed"
            : "attempted",
      }));

      setSubmitStatus("wrong");

      setOutputLines([
        "❌ Wrong Answer",
        "",
        failedCase
          ? `Input: ${failedCase.input}`
          : "",

        failedCase
          ? `Expected: ${failedCase.expected}`
          : "",

        failedCase
          ? `Your Output: ${failedCase.actual}`
          : "",

        "",

        hints.length > hintIndex
          ? `💡 Hint available — ${hints.length - hintIndex} left`
          : "💡 No hints left",
      ].filter(Boolean));
    }

  } catch (err) {

    console.log(
      "SUBMIT ERROR:",
      err?.response?.data || err
    );

    setOutputLines([
      "❌ Submission failed",
      "",
      err?.response?.data?.message ||
      "Please try again",
    ]);

    setSubmitStatus("wrong");

  } finally {

    setSubmitting(false);
  }
};

  // ── Derived ───────────────────────────────
  const testCases =
  Array.isArray(selected?.testCases)
    ? selected.testCases
    : [];
  const completedCnt = Object.values(statusMap).filter(v => v === "completed").length;
  const diff         = selected
    ? DIFF[(selected.difficulty || "easy").toLowerCase()] || DIFF.easy
    : null;
  const selectedId   = selected ? (selected.id || selected._id) : null;

  // ─────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────
  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{ height: "100vh", background: "#0d0d0d", fontFamily: "'JetBrains Mono','Fira Code',monospace" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:2px}
        ::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,0.2)}
        @keyframes pulse-dot{0%,100%{opacity:1}50%{opacity:.3}}
        .pulse-dot{animation:pulse-dot 1.2s ease-in-out infinite}
        @keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        .fade-up{animation:fadeUp .25s ease-out forwards}
        .btn-run{background:linear-gradient(135deg,#3b82f6,#2563eb)}
        .btn-run:hover:not(:disabled){background:linear-gradient(135deg,#60a5fa,#3b82f6)}
        .btn-submit{background:linear-gradient(135deg,#10b981,#059669)}
        .btn-submit:hover:not(:disabled){background:linear-gradient(135deg,#34d399,#10b981)}
        .btn-done{background:rgba(16,185,129,0.15);color:#34d399;border:1px solid rgba(16,185,129,0.3);cursor:not-allowed}
      `}</style>

      {/* ── Topbar ── */}
      <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-b border-white/5"
        style={{ background: "#111" }}>
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/70" />
            <div className="w-3 h-3 rounded-full bg-amber-500/70" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
          </div>
          <span className="text-white/30 text-xs mx-1">|</span>
          <span className="text-white/60 text-[11px] font-bold tracking-widest uppercase"
            style={{ fontFamily: "'Syne',sans-serif" }}>
            CodeLab
          </span>
        </div>
        <div className="flex items-center gap-5">
          {completedCnt > 0 && (
            <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold">
              <Trophy size={12} />{completedCnt} completed
            </div>
          )}
          <div className="flex items-center gap-1.5 text-white/40 text-xs">
            <Layers size={12} />{assignments.length} problems
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* ── LEFT SIDEBAR ── */}
        <div className="w-64 flex-shrink-0 flex flex-col border-r border-white/5"
          style={{ background: "#111" }}>
          <div className="px-4 py-3 border-b border-white/5 flex-shrink-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Problems</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="space-y-1 p-3">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="h-14 rounded-lg animate-pulse"
                    style={{ background: "rgba(255,255,255,0.04)" }} />
                ))}
              </div>
            ) : loadError ? (
              <div className="flex flex-col items-center justify-center h-48 text-center px-4 gap-3">
                <AlertCircle size={24} className="text-rose-400/60" />
                <p className="text-rose-400/70 text-xs leading-relaxed">{loadError}</p>
                <button
                  onClick={() => { setLoading(true); setLoadError(""); setReloadKey(k => k + 1); }}
                  className="text-[11px] text-white/40 underline hover:text-white/70">
                  Retry
                </button>
              </div>
            ) : assignments.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-center px-4 gap-2">
                <BookOpen size={28} className="text-white/10" />
                <p className="text-white/20 text-xs">No assignments available</p>
              </div>
            ) : (
              assignments.map(a => (
                <SidebarItem
                  key={a.id || a._id}
                  assignment={a}
                  isSelected={selectedId === (a.id || a._id)}
                  onClick={() => openAssignment(a)}
                  status={statusMap[a.id || a._id] || ""}
                />
              ))
            )}
          </div>
        </div>

        {/* ── CENTER: Editor + Console ── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selected ? (
            <>
              {/* Toolbar */}
              <div className="flex-shrink-0 flex items-center justify-between px-4 py-2.5 border-b border-white/5"
                style={{ background: "#0d0d0d" }}>
                <div className="flex items-center gap-3">
                  <span className="text-base">{LANG_ICON[selected.language] || "💻"}</span>
                  <div>
                    <p className="text-white text-sm font-semibold leading-none">{selected.title}</p>
                    <p className="text-white/30 text-[10px] mt-0.5 uppercase tracking-wider">{selected.language}</p>
                  </div>
                  {statusMap[selectedId] === "completed" && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded-full">
                      <CheckCircle2 size={9} /> Completed
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={handleRun} disabled={running || submitting}
                    className="btn-run flex items-center gap-1.5 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all disabled:opacity-50">
                    {running
                      ? <><span className="pulse-dot w-1.5 h-1.5 bg-white rounded-full" />Running…</>
                      : <><Play size={11} fill="white" />Run</>}
                  </button>

                  {statusMap[selectedId] === "completed" ? (
                    <button disabled className="btn-done flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg">
                      <CheckCircle2 size={11} /> Completed
                    </button>
                  ) : (
                    <button onClick={handleSubmit} disabled={running || submitting}
                      className="btn-submit flex items-center gap-1.5 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all disabled:opacity-50">
                      {submitting
                        ? <><span className="pulse-dot w-1.5 h-1.5 bg-white rounded-full" />Checking…</>
                        : <><Send size={11} />Submit</>}
                    </button>
                  )}

                  <button onClick={handleHint} disabled={!hints.length}
                    title={hints.length ? `${hints.length - hintIndex} hint(s) left` : "No hints"}
                    className="flex items-center gap-1.5 text-amber-400 text-xs font-bold px-3 py-2 rounded-lg border border-amber-400/20 hover:bg-amber-400/10 transition-all disabled:opacity-30">
                    <Lightbulb size={12} />
                    {hints.length > 0 && (
                      <span className="text-amber-400/60 text-[10px]">{hints.length - hintIndex}</span>
                    )}
                  </button>

                  <button

  onClick={() =>
    setShowSolution(true)
  }

  disabled={
    hintIndex < hints.length
  }

  className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg border transition-all

  ${
    hintIndex < hints.length

      ? "border-white/10 text-white/20 cursor-not-allowed"

      : "border-cyan-400/20 text-cyan-400 hover:bg-cyan-400/10"
  }`}
>

  <BookOpen size={12} />

  Solution

</button>

                  <button onClick={handleReset}
                    className="text-white/40 text-xs px-3 py-2 rounded-lg border border-white/10 hover:bg-white/5 hover:text-white/70 transition-all">
                    <RotateCcw size={11} />
                  </button>
                </div>
              </div>

              {/* Monaco Editor */}
              <div className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
                <Editor
                  height="100%"
                  language={selected.language}
                  value={code}
                  onChange={v => setCode(v || "")}
                  theme="vs-dark"
                  options={{
                    fontSize: 14,
                    fontFamily: "'JetBrains Mono','Fira Code',monospace",
                    fontLigatures: true,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    lineNumbers: "on",
                    renderLineHighlight: "line",
                    padding: { top: 16, bottom: 16 },
                    cursorBlinking: "phase",
                    smoothScrolling: true,
                    tabSize: 2,
                    wordWrap: "on",
                    // Lock editor once completed so student can't change accepted code
                    readOnly: statusMap[selectedId] === "completed",
                  }}
                />
              </div>

              {/* Output console */}
              <div className="flex-shrink-0 border-t border-white/5 overflow-hidden"
                style={{ height: "160px", background: "#0a0a0a" }}>
                <OutputConsole lines={outputLines} submitStatus={submitStatus} />
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-8 gap-4">
              <div className="w-16 h-16 rounded-2xl border border-white/10 flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.02)" }}>
                <FileCode2 size={28} className="text-white/20" />
              </div>
              <div>
                <h2 className="text-white/50 font-bold text-base" style={{ fontFamily: "'Syne',sans-serif" }}>
                  Select a Problem
                </h2>
                <p className="text-white/20 text-xs mt-1.5 max-w-xs leading-relaxed">
                  Pick an assignment from the sidebar to open it in the editor.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: Problem Details ── */}
        {selected && (
          <div className="w-80 flex-shrink-0 flex flex-col border-l border-white/5 overflow-y-auto"
            style={{ background: "#111" }}>

            {/* Header */}
            <div className="p-5 border-b border-white/5 flex-shrink-0">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h2 className="text-white font-bold text-[15px] leading-snug flex-1"
                  style={{ fontFamily: "'Syne',sans-serif" }}>
                  {selected.title}
                </h2>
                <span className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                  style={{ background: diff.bg, color: diff.color }}>
                  {diff.label}
                </span>
              </div>
            <div>
              <h2
                className="text-white font-bold text-[15px]"
                style={{
                  fontFamily: "'Syne',sans-serif"
                }}
              >
                {selected.title}
              </h2>

              <p className="text-xs text-white/40 mt-1">
                Uploaded by {selected.teacherName || "Teacher"}
              </p>
            </div>
              <div className="flex flex-wrap gap-2">
                {selected.categoryName && (
                  <span className="text-[10px] text-white/40 bg-white/5 px-2.5 py-1 rounded-full">
                    {selected.categoryName}
                  </span>
                )}
                <span className="text-[10px] text-white/40 bg-white/5 px-2.5 py-1 rounded-full uppercase">
                  {selected.language}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full">
                  <Star size={9} fill="currentColor" />{selected.marks} pts
                </span>
                {statusMap[selectedId] === "completed" && (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full">
                    <CheckCircle2 size={9} />Completed
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="border-b border-white/5">
              <button onClick={() => setShowDesc(v => !v)}
                className="w-full flex items-center justify-between px-5 py-3 text-white/50 hover:text-white/80 text-[11px] font-bold uppercase tracking-widest transition-colors">
                <span className="flex items-center gap-2"><BookOpen size={11} />Description</span>
                {showDesc ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
              {showDesc && (
                <div className="px-5 pb-5 fade-up">
                  <p className="text-white/55 text-xs leading-relaxed">
                    {selected.description || "No description provided."}
                  </p>
                </div>
              )}
            </div>

            {/* Expected Output */}
            {selected.expectedOutput && (
              <div className="px-5 py-4 border-b border-white/5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2 flex items-center gap-2">
                  <Terminal size={10} />Expected Output
                </p>
                <pre className="text-green-400 text-xs leading-relaxed bg-black/30 rounded-xl p-3 overflow-x-auto">
                  {selected.expectedOutput}
                </pre>
              </div>
            )}

            {/* Solution */}

{showSolution && selected.solutionCode && (

<div className="px-5 py-4 border-b border-white/5">

  <p
    className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 mb-2 flex items-center gap-2"
  >
    <BookOpen size={10} />
    Solution
  </p>

  <pre
    className="text-cyan-300 text-xs leading-relaxed bg-black/30 rounded-xl p-3 overflow-x-auto"
  >
    {selected.solutionCode}
  </pre>

</div>
)}

            {/* Test Cases */}
            {testCases.length > 0 && (
              <div className="border-b border-white/5">
                <button onClick={() => setShowTests(v => !v)}
                  className="w-full flex items-center justify-between px-5 py-3 text-white/50 hover:text-white/80 text-[11px] font-bold uppercase tracking-widest transition-colors">
                  <span className="flex items-center gap-2">
                    <Hash size={11} />Test Cases
                    <span className="text-[9px] text-white/20 bg-white/5 px-1.5 py-0.5 rounded">{testCases.length}</span>
                  </span>
                  {showTests ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
                {showTests && (
                  <div className="px-5 pb-4 space-y-3 fade-up">
                    {testCases.map((tc, i) => (
                      <div key={i} className="rounded-xl border border-white/5 overflow-hidden">
                        <div className="px-3 py-1.5 border-b border-white/5"
                          style={{ background: "rgba(255,255,255,0.02)" }}>
                          <span className="text-[10px] text-white/30 font-semibold">Case {i + 1}</span>
                        </div>
                        <div className="p-3 space-y-2">
                          {tc.input != null && tc.input !== "" && (
                            <div>
                              <p className="text-[9px] text-white/20 uppercase tracking-widest mb-1">Input</p>
                              <code className="text-blue-300 text-xs font-mono">{tc.input}</code>
                            </div>
                          )}
                          <div>
                            <p className="text-[9px] text-white/20 uppercase tracking-widest mb-1">Output</p>
                            <code className="text-emerald-300 text-xs font-mono">{tc.output}</code>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Hints tracker */}
            {hints.length > 0 && (
              <div className="px-5 py-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3 flex items-center gap-2">
                  <Lightbulb size={10} className="text-amber-400" />Hints
                </p>
                <div className="flex gap-1.5 mb-2.5">
                  {hints.map((_, i) => (
                    <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
                      style={{ background: i < hintIndex ? "#f59e0b" : "rgba(255,255,255,0.08)" }} />
                  ))}
                </div>
                <p className="text-white/25 text-[11px]">
                  {hintIndex === 0
                    ? `${hints.length} hint${hints.length > 1 ? "s" : ""} available`
                    : hintIndex >= hints.length
                    ? "All hints revealed"
                    : `${hints.length - hintIndex} of ${hints.length} remaining`}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
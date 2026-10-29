import { useEffect, useState } from "react";
import { ClipboardList, Award, Code2, Lightbulb, Eye } from "lucide-react";
import api from "../../api/axios.js";
import { ENDPOINTS } from "../../api/endpoints.js";
import PageHeader from "../../components/shared/PageHeader.jsx";
import Loader from "../../components/ui/Loader.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Modal from "../../components/ui/Modal.jsx";
import CodeRunner from "../../components/shared/CodeRunner.jsx";

const diffTone = { easy: "mint", medium: "amber", hard: "coral" };
const diffDots = { easy: 1, medium: 2, hard: 3 };
const langExt = { python: "py", javascript: "js", java: "java", c: "c", cpp: "cpp" };

// Handles both shapes the backend might send: an already-parsed array,
// or a JSON-encoded string. JSON.parse() throws if given a non-string
// (like an array), so check the type first instead of parsing blindly.
const parseMaybeJson = (raw) => {
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const parseTestCases = parseMaybeJson;

const PAGE_SIZE = 10;

export default function StudentAssignments() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);
  const [hintsRevealed, setHintsRevealed] = useState(0);
   const [showSolution, setShowSolution] = useState(false);
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState(null); // "hints" | "solution" | "tests" | null
    // Computed once per render, in component scope — safe to use anywhere in the JSX below.
  const hints = parseMaybeJson(active?.hints);
  const testCases = parseTestCases(active?.test_cases);
  const allRevealed = hintsRevealed >= hints.length;

useEffect(() => {
    api
      .get(ENDPOINTS.assignments)
      .then((res) => setRows(res.data?.assignments || res.data?.data || []))
      .finally(() => setLoading(false));
  }, []);
  if (loading) return <Loader label="Loading assignments" />;

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = rows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div>
      <PageHeader eyebrow="student/assignments" title="Assignments" subtitle="Everything your teacher has assigned for your standard." />

      {rows.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No assignments yet" subtitle="Check back once your teacher posts one." />
      ) : (
                       <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paged.map((a) => {
            const dots = diffDots[a.difficulty?.toLowerCase()] || 1;
            const ext = langExt[a.language?.toLowerCase()] || "txt";
            return (
              <button
                key={a.id}
                onClick={() => setActive(a)}
                className="group overflow-hidden rounded-xl2 border border-ink/[0.06] bg-white text-left shadow-card transition-all hover:-translate-y-1 hover:shadow-pop"
              >
                {/* terminal chrome */}
                <div className="flex items-center gap-2 bg-ink px-4 py-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-coral/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-mint/80" />
                  <span className="ml-2 truncate font-mono text-[11px] text-white/50">
                    {a.title?.toLowerCase().replace(/\s+/g, "_").slice(0, 20) || "task"}.{ext}
                  </span>
                </div>

                <div className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-1" title={a.difficulty}>
                      {[1, 2, 3].map((n) => (
                        <span
                          key={n}
                          className={`h-1.5 w-5 rounded-full ${n <= dots ? `bg-${diffTone[a.difficulty?.toLowerCase()] || "brand"}` : "bg-ink/10"}`}
                          style={n <= dots ? { backgroundColor: "currentColor" } : undefined}
                        />
                      ))}
                    </div>
                    <span className="rounded-full bg-brand-light px-2.5 py-1 font-mono text-[10px] font-bold text-brand">
                      +{a.marks} XP
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-ink transition-colors group-hover:text-brand">{a.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-muted">{a.description}</p>

                  <div className="mt-4 flex items-center justify-between border-t border-dashed border-ink/10 pt-3 text-xs text-slate-muted">
                    <Badge tone={diffTone[a.difficulty?.toLowerCase()] || "neutral"}>{a.difficulty || "—"}</Badge>
                    <span className="font-mono">{a.categoryName || "general"}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {rows.length > PAGE_SIZE && (
        <div className="mt-5 flex items-center justify-between text-sm">
          <p className="text-slate-muted">Page {currentPage} of {totalPages} · {rows.length} assignments</p>
          <div className="flex gap-1.5">
            <button className="btn-secondary btn-sm" disabled={currentPage === 1} onClick={() => setPage((p) => p - 1)}>← Prev</button>
            <button className="btn-secondary btn-sm" disabled={currentPage === totalPages} onClick={() => setPage((p) => p + 1)}>Next →</button>
          </div>
        </div>
      )}

        <Modal
        open={!!active}
   onClose={() => { setActive(null); setHintsRevealed(0); setShowSolution(false); setActiveTab(null); }}
        title={null}
        width="max-w-6xl"
      >
                {active && (
          <div className="-m-6 space-y-5">
            {/* terminal-style modal header, replaces the default Modal title */}
            <div className="flex items-center gap-2 rounded-t-xl2 bg-ink px-6 py-4">
              <span className="h-2.5 w-2.5 rounded-full bg-coral/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-mint/80" />
              <span className="ml-2 truncate font-mono text-xs text-white/50">
                {active.title?.toLowerCase().replace(/\s+/g, "_").slice(0, 28) || "task"}.{langExt[active.language?.toLowerCase()] || "txt"}
              </span>
            </div>

            <div className="space-y-5 px-6 pb-6">
              <div>
                <p className="eyebrow mb-1">mission_brief</p>
                <h2 className="font-display text-xl font-bold text-ink">{active.title}</h2>
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1 rounded-full bg-ink/5 px-3 py-1">
                  {[1, 2, 3].map((n) => (
                    <span key={n} className={`h-1.5 w-4 rounded-full ${n <= (diffDots[active.difficulty?.toLowerCase()] || 1) ? "bg-brand" : "bg-ink/15"}`} />
                  ))}
                  <span className="ml-1.5 text-xs font-semibold capitalize text-ink">{active.difficulty}</span>
                </div>
                <Badge tone="brand">{active.language}</Badge>
                <span className="rounded-full bg-amber-light px-2.5 py-1 font-mono text-[11px] font-bold text-amber-dark">+{active.marks} XP</span>
                {active.teacherName && <Badge tone="neutral">by {active.teacherName}</Badge>}
              </div>
              <div className="flex items-start justify-between gap-4">
                <p className="flex-1 text-sm leading-relaxed text-ink/80">{active.description}</p>

                {/* Hint / Solution / Test Cases — tab buttons, top right, one line */}
                <div className="flex shrink-0 gap-1.5">
                  {hints.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveTab((t) => (t === "hints" ? null : "hints"))}
                      className={`btn-sm flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                        activeTab === "hints" ? "border-amber bg-amber-light text-amber-dark" : "border-slate-faint/60 text-slate-muted hover:border-amber/50"
                      }`}
                    >
                      <Lightbulb size={13} /> Hints
                    </button>
                  )}
                  {active.solution_code && (
                    <button
                      type="button"
                      onClick={() => setActiveTab((t) => (t === "solution" ? null : "solution"))}
                      className={`btn-sm flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                        activeTab === "solution" ? "border-ink bg-ink text-white" : "border-slate-faint/60 text-slate-muted hover:border-ink/50"
                      }`}
                    >
                      <Eye size={13} /> Solution
                    </button>
                  )}
                  {testCases.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveTab((t) => (t === "tests" ? null : "tests"))}
                      className={`btn-sm flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                        activeTab === "tests" ? "border-brand bg-brand-light text-brand" : "border-slate-faint/60 text-slate-muted hover:border-brand/50"
                      }`}
                    >
                      Tests
                    </button>
                  )}
                </div>
              </div>

              {activeTab === "hints" && (
                <div className="rounded-xl border border-dashed border-amber/40 bg-amber-light/40 p-4">
                  <div className="flex items-center justify-between">
                    <p className="flex items-center gap-1.5 font-mono text-xs font-semibold text-amber-dark">
                      <Lightbulb size={13} /> hints [{hintsRevealed}/{hints.length}]
                    </p>
                    <button
                      type="button"
                      disabled={allRevealed}
                      onClick={() => setHintsRevealed((n) => Math.min(n + 1, hints.length))}
                      className="btn-secondary btn-sm !border-amber !text-amber-dark hover:!bg-amber-light"
                    >
                      {allRevealed ? "All unlocked" : hintsRevealed === 0 ? "Unlock hint" : "Unlock next"}
                    </button>
                  </div>
                  {hintsRevealed > 0 && (
                    <ol className="mt-3 space-y-2">
                      {hints.slice(0, hintsRevealed).map((h, i) => (
                        <li key={i} className="flex items-start gap-2 rounded-lg bg-white/70 px-3 py-2 text-sm text-ink/80">
                          <span className="font-mono text-xs font-bold text-amber-dark">{String(i + 1).padStart(2, "0")}</span>
                          {h}
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              )}

              {activeTab === "solution" && (
                <div className="overflow-hidden rounded-xl border border-ink/10">
                  <div className="flex items-center justify-between bg-ink/[0.03] px-4 py-2.5">
                    <p className="flex items-center gap-1.5 font-mono text-xs font-semibold text-ink">
                      <Eye size={13} /> solution.{langExt[active.language?.toLowerCase()] || "txt"}
                    </p>
                    <button type="button" onClick={() => setShowSolution((s) => !s)} className="btn-ghost btn-sm">
                      {showSolution ? "Hide" : "Reveal"}
                    </button>
                  </div>
                  <div className="relative">
                    <pre className={`max-h-64 overflow-auto bg-ink px-4 py-3 font-mono text-xs text-white/90 transition-all ${showSolution ? "" : "blur-md select-none"}`}>
                      {active.solution_code}
                    </pre>
                    {!showSolution && (
                      <button
                        type="button"
                        onClick={() => setShowSolution(true)}
                        className="absolute inset-0 flex items-center justify-center bg-ink/40 text-xs font-semibold text-white"
                      >
                        Try it yourself first — click to peek
                      </button>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "tests" && testCases.length > 0 && (
                <div>
                  <p className="eyebrow mb-1.5 text-[11px]">sample_test_cases [{testCases.length}]</p>
                  <div className="space-y-1.5">
                    {testCases.map((tc, i) => (
                      <div key={i} className="grid grid-cols-2 divide-x divide-ink/10 overflow-hidden rounded-lg border border-ink/10 text-[11px]">
                        <div className="px-2.5 py-1.5">
                          <p className="mb-0.5 font-mono text-[9px] uppercase tracking-wide text-slate-muted">input</p>
                          <pre className="whitespace-pre-wrap font-mono leading-tight text-ink">{tc.input ?? tc.stdin ?? "—"}</pre>
                        </div>
                        <div className="px-2.5 py-1.5">
                          <p className="mb-0.5 font-mono text-[9px] uppercase tracking-wide text-slate-muted">output</p>
                          <pre className="whitespace-pre-wrap font-mono leading-tight text-ink">{tc.output ?? tc.expected ?? tc.expected_output ?? "—"}</pre>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="eyebrow mb-2 flex items-center gap-1.5"><Code2 size={14} className="text-brand" /> your_workspace</p>
                <CodeRunner initialCode={active.starter_code || ""} initialLanguage={active.language || "python"} />
              </div>

              {/* <p className="rounded-lg bg-brand-light px-3.5 py-2.5 text-xs font-medium text-brand">
                Run and test your code here freely. Formal submission-for-grading needs one more backend route
                (a POST endpoint for assignment submissions) — this workspace is ready to wire up to it.
              </p> */}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
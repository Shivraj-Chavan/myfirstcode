import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Plus, Pencil, Trash2, Eye, BarChart2, Users, BookOpen,
  CheckCircle2, Clock, XCircle, Search, Filter, ChevronDown,
  TrendingUp, Award, AlertTriangle, X, Star, Code2,
  ArrowUpDown, RefreshCw, Shield, Layers, FileText
} from "lucide-react";
import AssignmentForm from "../../components/assignments/assignmentFormModal";
import ENDPOINT from "../../lib/endpoints";

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function safeArray(val) {
  if (Array.isArray(val)) return val;
  if (typeof val === "string") { try { return JSON.parse(val); } catch { return []; } }
  return [];
}

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

const DIFF_STYLE = {
  easy:   { bg: "#dcfce7", text: "#16a34a", dot: "#22c55e" },
  medium: { bg: "#fef9c3", text: "#ca8a04", dot: "#eab308" },
  hard:   { bg: "#fee2e2", text: "#dc2626", dot: "#ef4444" },
};

const LANG_COLOR = {
  javascript: { bg: "#fef9c3", text: "#854d0e" },
  python:     { bg: "#dbeafe", text: "#1d4ed8" },
  java:       { bg: "#ffedd5", text: "#c2410c" },
  c:          { bg: "#f1f5f9", text: "#475569" },
  cpp:        { bg: "#ede9fe", text: "#7c3aed" },
  html:       { bg: "#fee2e2", text: "#b91c1c" },
  css:        { bg: "#dbeafe", text: "#2563eb" },
};

function toast(msg, type = "success") {
  const el = document.createElement("div");
  el.className = `fixed bottom-6 right-6 z-[9999] px-5 py-3 rounded-2xl text-sm font-semibold shadow-2xl text-white transition-all`;
  el.style.background = type === "success" ? "#16a34a" : "#dc2626";
  el.style.animation = "slideUp .3s ease-out";
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

// ─────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────
function StatCard({ label, value, sub, icon: Icon, color, bg }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: bg }}>
          <Icon size={18} style={{ color }} />
        </div>
      </div>
      <p className="text-3xl font-black text-gray-900 tracking-tight" style={{ fontFamily: "'Clash Display',sans-serif" }}>
        {value}
      </p>
      <p className="text-sm font-semibold text-gray-700 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────
// ASSIGNMENT ROW
// ─────────────────────────────────────────────
function AssignmentRow({ assignment, onEdit, onDelete, onViewAttempts, index }) {
  const diff = DIFF_STYLE[(assignment.difficulty || "easy").toLowerCase()] || DIFF_STYLE.easy;
  const lang = LANG_COLOR[(assignment.language || "").toLowerCase()] || { bg: "#f1f5f9", text: "#475569" };
  const hints = safeArray(assignment.hints);
  const tests = safeArray(assignment.test_cases ?? assignment.testCases);

  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors group">
      <td className="px-5 py-4">
        <span className="text-xs font-bold text-gray-300">{String(index + 1).padStart(2, "0")}</span>
      </td>
      <td className="px-4 py-4 max-w-[220px]">
        <p className="text-sm font-bold text-gray-900 truncate">{assignment.title}</p>
        {assignment.categoryName && (
          <p className="text-[11px] text-gray-400 mt-0.5">{assignment.categoryName}</p>
        )}
      </td>
      <td className="px-4 py-4">
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide"
          style={{ background: lang.bg, color: lang.text }}>
          {assignment.language}
        </span>
      </td>
      <td className="px-4 py-4">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full"
          style={{ background: diff.bg, color: diff.text }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: diff.dot }} />
          {assignment.difficulty || "easy"}
        </span>
      </td>
      <td className="px-4 py-4 text-center">
        <span className="text-sm font-bold text-gray-700">{assignment.standard || "—"}</span>
      </td>
      <td className="px-4 py-4 text-center">
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
          <Star size={11} fill="currentColor" />{assignment.marks}
        </span>
      </td>
      <td className="px-4 py-4 text-center">
        <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
          <span title="Hints">{hints.length}💡</span>
          <span title="Tests">{tests.length}🧪</span>
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onViewAttempts(assignment)}
            className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
            title="View Attempts">
            <BarChart2 size={13} />
          </button>
          <button onClick={() => onEdit(assignment)}
            className="p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            title="Edit">
            <Pencil size={13} />
          </button>
          <button onClick={() => onDelete(assignment.id || assignment._id)}
            className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
            title="Delete">
            <Trash2 size={13} />
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─────────────────────────────────────────────
// ATTEMPT MODAL
// ─────────────────────────────────────────────
function AttemptModal({ assignment, onClose }) {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem("token");
        const id    = assignment.id || assignment._id;
        const res   = await axios.get(
          `${ENDPOINT.GET_ASSIGNMENTS}/${id}/attempts`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAttempts(res.data.data || res.data || []);
      } catch { setAttempts([]); }
      finally  { setLoading(false); }
    };
    fetch();
  }, [assignment]);

  const completed   = attempts.filter(a => a.status === "completed");
  const attempted   = attempts.filter(a => a.status === "attempted");
  const notStarted  = attempts.filter(a => !a.status || a.status === "not_started");
  const rate        = attempts.length ? Math.round((completed.length / attempts.length) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.4)" }}>
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Attempt Status</p>
            <h3 className="font-black text-gray-900 text-lg leading-tight" style={{ fontFamily: "'Clash Display',sans-serif" }}>
              {assignment.title}
            </h3>
          </div>
          <button onClick={onClose} className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-4 border-b border-gray-100">
          {[
            { label: "Total",     value: attempts.length,  color: "text-gray-700",    bg: "bg-gray-50"     },
            { label: "Completed", value: completed.length,  color: "text-emerald-600", bg: "bg-emerald-50"  },
            { label: "Attempted", value: attempted.length,  color: "text-amber-600",   bg: "bg-amber-50"    },
            { label: "Rate",      value: `${rate}%`,        color: "text-blue-600",    bg: "bg-blue-50"     },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className={`flex flex-col items-center py-4 border-r last:border-r-0 border-gray-100 ${bg}`}>
              <p className={`text-2xl font-black ${color}`}>{value}</p>
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="px-6 py-3 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                style={{ width: `${rate}%` }} />
            </div>
            <span className="text-xs font-bold text-gray-500">{rate}% completion</span>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading ? (
            <div className="space-y-2">
              {[1,2,3,4].map(i => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}
            </div>
          ) : attempts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center gap-2">
              <Users size={36} className="text-gray-200" />
              <p className="text-gray-400 text-sm">No student data yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {attempts.map((s, i) => {
                const statusCfg = s.status === "completed"
                  ? { icon: CheckCircle2, cls: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" }
                  : s.status === "attempted"
                  ? { icon: Clock,        cls: "text-amber-600",   bg: "bg-amber-50 border-amber-100"   }
                  : { icon: XCircle,      cls: "text-gray-400",    bg: "bg-gray-50 border-gray-100"     };
                const Icon = statusCfg.icon;
                return (
                  <div key={i} className={`flex items-center justify-between rounded-xl px-4 py-3 border ${statusCfg.bg}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs font-black text-gray-600">
                        {(s.studentName || s.name || "S")[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{s.studentName || s.name || `Student ${i + 1}`}</p>
                        {s.submittedAt && (
                          <p className="text-[11px] text-gray-400">{new Date(s.submittedAt).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {s.score != null && (
                        <span className="text-sm font-bold text-gray-700">{s.score}/{assignment.marks}</span>
                      )}
                      <Icon size={16} className={statusCfg.cls} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// STUDENT PERFORMANCE TAB
// ─────────────────────────────────────────────
function StudentPerformance({ assignments }) {
  const [students,  setStudents]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState("");
  const [sortBy,    setSortBy]    = useState("name"); // name | score | completed
  const [sortDir,   setSortDir]   = useState("asc");

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const res   = await axios.get(
          ENDPOINT.GET_STUDENTS || `${ENDPOINT.GET_ASSIGNMENTS.replace("/assignments", "")}/students`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const raw = res.data?.data ?? res.data;
        setStudents(Array.isArray(raw) ? raw : []);
      } catch { setStudents([]); }
      finally  { setLoading(false); }
    };
    load();
  }, []);

  const sorted = [...students]
    .filter(s => (s.name || s.username || "").toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      let va, vb;
      if (sortBy === "name")      { va = a.name || ""; vb = b.name || ""; }
      else if (sortBy === "score"){ va = a.totalScore || 0; vb = b.totalScore || 0; }
      else                        { va = a.completedCount || 0; vb = b.completedCount || 0; }
      if (typeof va === "string") return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      return sortDir === "asc" ? va - vb : vb - va;
    });

  const toggleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortBy(col); setSortDir("desc"); }
  };

  const maxScore = Math.max(...students.map(s => s.totalScore || 0), 1);

  return (
    <div className="space-y-6">
      {/* Top performers */}
      {students.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...students]
            .sort((a, b) => (b.completedCount || 0) - (a.completedCount || 0))
            .slice(0, 3)
            .map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 flex items-center gap-4">
                <div className="relative">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black text-white
                    ${i === 0 ? "bg-amber-400" : i === 1 ? "bg-slate-400" : "bg-orange-400"}`}>
                    {(s.name || s.username || "S")[0].toUpperCase()}
                  </div>
                  <div className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white
                    ${i === 0 ? "bg-amber-500" : i === 1 ? "bg-slate-500" : "bg-orange-500"}`}>
                    {i + 1}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-gray-900 truncate text-sm">{s.name || s.username}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Std {s.standard} · {s.completedCount || 0} completed</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-gray-900">{s.totalScore || 0}</p>
                  <p className="text-[10px] text-gray-400">pts</p>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-black text-gray-900 text-sm" style={{ fontFamily: "'Clash Display',sans-serif" }}>
            All Students
          </h3>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search students…"
              className="pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-gray-900 w-48" />
          </div>
        </div>

        {loading ? (
          <div className="p-5 space-y-3">
            {[1,2,3,4,5].map(i => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center gap-2">
            <Users size={36} className="text-gray-200" />
            <p className="text-gray-400 text-sm">
              {students.length === 0 ? "No student data available" : "No matching students"}
            </p>
            {students.length === 0 && (
              <p className="text-gray-300 text-xs max-w-xs">
                Add a <code className="bg-gray-100 px-1 rounded">GET /students</code> endpoint that returns student performance data
              </p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {[
                    { label: "Student",   col: "name"      },
                    { label: "Standard",  col: null         },
                    { label: "Completed", col: "completed"  },
                    { label: "Score",     col: "score"      },
                    { label: "Progress",  col: null         },
                  ].map(({ label, col }) => (
                    <th key={label}
                      className={`text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 ${col ? "cursor-pointer hover:text-gray-600" : ""}`}
                      onClick={() => col && toggleSort(col)}>
                      <span className="flex items-center gap-1">
                        {label}
                        {col && <ArrowUpDown size={10} className={sortBy === col ? "text-gray-700" : "text-gray-300"} />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((s, i) => {
                  const pct = assignments.length
                    ? Math.round(((s.completedCount || 0) / assignments.length) * 100)
                    : 0;
                  const scorePct = Math.round(((s.totalScore || 0) / maxScore) * 100);
                  return (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-xs font-black text-gray-600">
                            {(s.name || s.username || "S")[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{s.name || s.username}</p>
                            <p className="text-[11px] text-gray-400">{s.email || ""}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                          Std {s.standard || "—"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={13} className="text-emerald-500" />
                          <span className="text-sm font-bold text-gray-800">{s.completedCount || 0}</span>
                          <span className="text-xs text-gray-400">/ {assignments.length}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-black text-gray-900">{s.totalScore || 0}</span>
                        <span className="text-xs text-gray-400 ml-1">pts</span>
                      </td>
                      <td className="px-5 py-4 min-w-[140px]">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${pct}%`,
                                background: pct >= 80 ? "#22c55e" : pct >= 50 ? "#eab308" : "#f97316"
                              }} />
                          </div>
                          <span className="text-[10px] font-bold text-gray-400 w-7 text-right">{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN ADMIN PANEL
// ─────────────────────────────────────────────
export default function AdminAssignments() {
  const [assignments,    setAssignments]    = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [search,         setSearch]         = useState("");
  const [diffFilter,     setDiffFilter]     = useState("all");
  const [langFilter,     setLangFilter]     = useState("all");
  const [stdFilter,      setStdFilter]      = useState("all");
  const [formOpen,       setFormOpen]       = useState(false);
  const [editData,       setEditData]       = useState(null);
  const [attemptModal,   setAttemptModal]   = useState(null);
  const [activeTab,      setActiveTab]      = useState("assignments"); // assignments | performance | overview
  const [reloadKey,      setReloadKey]      = useState(0);

  const token = localStorage.getItem("token");
  const auth  = useCallback(() => ({ headers: { Authorization: `Bearer ${token}` } }), [token]);

  // ── Load ──
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res  = await axios.get(ENDPOINT.GET_ASSIGNMENTS, auth());
        const raw =
  res.data?.data?.assignments ||
  res.data?.assignments ||
  res.data?.data ||
  res.data;

const data = Array.isArray(raw)
  ? raw.map(normalise)
  : [];
        setAssignments(data);
      } catch (err) {
        toast(err?.response?.data?.message || "Failed to load", "error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [reloadKey]);

  // ── CRUD ──
  const handleCreate = async (formData) => {
    await axios.post(ENDPOINT.CREATE_ASSIGNMENT, formData, auth());
    toast("Assignment created");
    setFormOpen(false);
    setReloadKey(k => k + 1);
  };

  const handleEdit = async (formData) => {
    const id = editData.id || editData._id;
    await axios.put(ENDPOINT.UPDATE_ASSIGNMENT(id), formData, auth());
    toast("Assignment updated");
    setEditData(null);
    setFormOpen(false);
    setReloadKey(k => k + 1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this assignment permanently?")) return;
    try {
      await axios.delete(ENDPOINT.DELETE_ASSIGNMENT(id), auth());
      toast("Assignment deleted");
      setReloadKey(k => k + 1);
    } catch { toast("Failed to delete", "error"); }
  };

  // ── Filter ──
  const languages  = [...new Set(assignments.map(a => a.language).filter(Boolean))];
  const standards  = [...new Set(assignments.map(a => a.standard).filter(Boolean))];

  const filtered = assignments.filter(a => {
    const ms = a.title?.toLowerCase().includes(search.toLowerCase());
    const md = diffFilter === "all" || (a.difficulty || "").toLowerCase() === diffFilter;
    const ml = langFilter === "all" || (a.language || "").toLowerCase() === langFilter;
    const mst= stdFilter  === "all" || String(a.standard) === stdFilter;
    return ms && md && ml && mst;
  });

  // ── Stats ──
  const totalMarks     = assignments.reduce((s, a) => s + (Number(a.marks) || 0), 0);
  const byDiff = (d)  => assignments.filter(a => (a.difficulty || "").toLowerCase() === d).length;

  const TABS = [
    { id: "assignments",  label: "Assignments", icon: BookOpen  },
    { id: "performance",  label: "Performance", icon: TrendingUp },
    { id: "overview",     label: "Overview",    icon: BarChart2  },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#f8f8f6", fontFamily: "'DM Sans','system-ui',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Clash+Display:wght@600;700;800&display=swap');
        @keyframes slideUp{from{transform:translateY(8px);opacity:0}to{transform:translateY(0);opacity:1}}
        .row-enter{animation:slideUp .2s ease-out}
      `}</style>

      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-xl bg-gray-900 flex items-center justify-center">
              <Shield size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-gray-900 leading-none"
                style={{ fontFamily: "'Clash Display',sans-serif" }}>
                Admin Panel
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">Assignment Management System</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setReloadKey(k => k + 1)}
              className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
              <RefreshCw size={14} />
            </button>
            <button
              onClick={() => { setEditData(null); setFormOpen(true); }}
              className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
              <Plus size={15} /> New Assignment
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-6 flex gap-0 border-t border-gray-100">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === id
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-400 hover:text-gray-700"
              }`}>
              <Icon size={14} />{label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-7">

        {/* ══ ASSIGNMENTS TAB ══ */}
        {activeTab === "assignments" && (
          <div className="space-y-5">
            {/* Quick stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Total Assignments" value={assignments.length}
                sub={`${totalMarks} total marks`}
                icon={BookOpen} color="#6366f1" bg="#eef2ff" />
              <StatCard label="Easy" value={byDiff("easy")}
                sub="Beginner level"
                icon={CheckCircle2} color="#16a34a" bg="#dcfce7" />
              <StatCard label="Medium" value={byDiff("medium")}
                sub="Intermediate"
                icon={Clock} color="#ca8a04" bg="#fef9c3" />
              <StatCard label="Hard" value={byDiff("hard")}
                sub="Advanced level"
                icon={AlertTriangle} color="#dc2626" bg="#fee2e2" />
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search assignments…"
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-gray-900" />
                </div>
                <select value={diffFilter} onChange={e => setDiffFilter(e.target.value)}
                  className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-900 bg-white">
                  <option value="all">All Levels</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                {languages.length > 0 && (
                  <select value={langFilter} onChange={e => setLangFilter(e.target.value)}
                    className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-900 bg-white">
                    <option value="all">All Languages</option>
                    {languages.map(l => <option key={l} value={l.toLowerCase()}>{l}</option>)}
                  </select>
                )}
                {standards.length > 0 && (
                  <select value={stdFilter} onChange={e => setStdFilter(e.target.value)}
                    className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-900 bg-white">
                    <option value="all">All Standards</option>
                    {standards.map(s => <option key={s} value={s}>Std {s}</option>)}
                  </select>
                )}
                {(search || diffFilter !== "all" || langFilter !== "all" || stdFilter !== "all") && (
                  <button onClick={() => { setSearch(""); setDiffFilter("all"); setLangFilter("all"); setStdFilter("all"); }}
                    className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 border border-gray-200 px-3 py-2.5 rounded-xl transition-colors">
                    <X size={12} /> Clear
                  </button>
                )}
                <span className="ml-auto self-center text-xs font-semibold text-gray-400">
                  {filtered.length} of {assignments.length}
                </span>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {loading ? (
                <div className="p-5 space-y-3">
                  {[1,2,3,4,5].map(i => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-56 text-center gap-3">
                  <FileText size={40} className="text-gray-200" />
                  <p className="text-gray-500 font-semibold">
                    {assignments.length === 0 ? "No assignments yet" : "No matching assignments"}
                  </p>
                  {assignments.length === 0 && (
                    <button onClick={() => setFormOpen(true)}
                      className="flex items-center gap-2 bg-gray-900 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-700 transition-colors">
                      <Plus size={14} /> Create first assignment
                    </button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/50">
                        {["#", "Title", "Language", "Difficulty", "Std", "Marks", "Details", "Actions"].map(h => (
                          <th key={h} className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((a, i) => (
                        <AssignmentRow
                          key={a.id || a._id}
                          assignment={a}
                          index={i}
                          onEdit={data => { setEditData(data); setFormOpen(true); }}
                          onDelete={handleDelete}
                          onViewAttempts={setAttemptModal}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ PERFORMANCE TAB ══ */}
        {activeTab === "performance" && (
          <StudentPerformance assignments={assignments} />
        )}

        {/* ══ OVERVIEW TAB ══ */}
        {activeTab === "overview" && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Total Assignments" value={assignments.length} icon={BookOpen}    color="#6366f1" bg="#eef2ff" />
              <StatCard label="Total Marks"        value={totalMarks}         icon={Star}        color="#ca8a04" bg="#fef9c3" />
              <StatCard label="Languages"          value={languages.length}   icon={Code2}       color="#0284c7" bg="#e0f2fe" />
              <StatCard label="Standards"          value={standards.length}   icon={Layers}      color="#16a34a" bg="#dcfce7" />
            </div>

            {/* Difficulty breakdown */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-black text-gray-900 mb-5 text-sm" style={{ fontFamily: "'Clash Display',sans-serif" }}>
                Difficulty Breakdown
              </h3>
              <div className="space-y-4">
                {["easy","medium","hard"].map(d => {
                  const count = byDiff(d);
                  const pct   = assignments.length ? Math.round((count / assignments.length) * 100) : 0;
                  const s     = DIFF_STYLE[d];
                  return (
                    <div key={d} className="flex items-center gap-4">
                      <span className="w-16 text-xs font-bold capitalize" style={{ color: s.text }}>{d}</span>
                      <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, background: s.dot }} />
                      </div>
                      <span className="text-sm font-black text-gray-700 w-8 text-right">{count}</span>
                      <span className="text-xs text-gray-400 w-8">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Language breakdown */}
            {languages.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-black text-gray-900 mb-5 text-sm" style={{ fontFamily: "'Clash Display',sans-serif" }}>
                  Language Distribution
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {languages.map(lang => {
                    const count = assignments.filter(a => (a.language||"").toLowerCase() === lang.toLowerCase()).length;
                    const pct   = Math.round((count / assignments.length) * 100);
                    const lc    = LANG_COLOR[lang.toLowerCase()] || { bg: "#f1f5f9", text: "#475569" };
                    return (
                      <div key={lang} className="rounded-2xl p-4 border border-gray-100"
                        style={{ background: lc.bg }}>
                        <p className="text-2xl font-black" style={{ color: lc.text }}>{count}</p>
                        <p className="text-xs font-bold uppercase tracking-wide mt-1" style={{ color: lc.text }}>{lang}</p>
                        <p className="text-xs mt-1" style={{ color: lc.text, opacity: 0.6 }}>{pct}% of total</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Per-standard */}
            {standards.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="font-black text-gray-900 mb-5 text-sm" style={{ fontFamily: "'Clash Display',sans-serif" }}>
                  Assignments per Standard
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {standards.map(std => {
                    const count = assignments.filter(a => String(a.standard) === String(std)).length;
                    const marks = assignments.filter(a => String(a.standard) === String(std))
                      .reduce((s, a) => s + (Number(a.marks) || 0), 0);
                    return (
                      <div key={std} className="rounded-2xl p-4 bg-gray-50 border border-gray-100 text-center">
                        <p className="text-2xl font-black text-gray-900">{count}</p>
                        <p className="text-xs font-bold text-gray-500 mt-0.5">Std {std}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{marks} marks</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Assignment Form Modal ── */}
      {formOpen && (
        <AssignmentForm
          onClose={() => { setFormOpen(false); setEditData(null); }}
          onSubmit={editData ? handleEdit : handleCreate}
          initialData={editData}
        />
      )}

      {/* ── Attempt Modal ── */}
      {attemptModal && (
        <AttemptModal
          assignment={attemptModal}
          onClose={() => setAttemptModal(null)}
        />
      )}
    </div>
  );
}
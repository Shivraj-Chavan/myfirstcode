import { useEffect, useState } from "react";
import axios from "axios";
import {
  Plus, Code2, Search, BookOpen, AlertCircle, Trash2, Edit3,
  Users, ChevronRight, X, Eye, CheckCircle2, Clock, BarChart2,
  Lightbulb, FileCode2, Terminal, TestTube2, Star, BookMarked,
  Filter, SlidersHorizontal, ArrowUpDown
} from "lucide-react";
import { toast } from "react-hot-toast";
import ENDPOINT from "../../lib/endpoints";
import AssignmentForm from "../../components/assignments/assignmentFormModal";

// ─── tiny helpers ───────────────────────────────────────────────
const DIFF_META = {
  easy:   { color: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  medium: { color: "bg-amber-100 text-amber-700",     dot: "bg-amber-500"   },
  hard:   { color: "bg-rose-100 text-rose-700",       dot: "bg-rose-500"    },
};

const LANG_COLOR = {
  python:     "bg-blue-100 text-blue-700",
  javascript: "bg-yellow-100 text-yellow-800",
  java:       "bg-orange-100 text-orange-700",
  cpp:        "bg-purple-100 text-purple-700",
  c:          "bg-slate-100 text-slate-700",
};

function Badge({ label, colorClass }) {
  return (
    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${colorClass}`}>
      {label}
    </span>
  );
}


// ─── Attempt Drawer ─────────────────────────────────────────────

function AttemptDrawer({
  assignment,
  onClose
}) {

  const [students, setStudents] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [selectedSubmission, setSelectedSubmission] =
    useState(null);

  const token =
    localStorage.getItem("token");

    useEffect(() => {
      document.body.style.overflow = "hidden";
    
      return () => {
        document.body.style.overflow = "auto";
      };
    }, []);

  useEffect(() => {

    const fetchAttempts =
      async () => {

        try {

          setLoading(true);

          const id =
            assignment.id ||
            assignment._id;

          const res =
            await axios.get(

              ENDPOINT.GET_ASSIGNMENT_ATTEMPTS(id),

              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );
          console.log("attempts",res.data);
          
          setStudents(
            res.data.data || []
          );

        } catch (err) {

          console.log(
            "ATTEMPTS ERROR",
            err
          );
   
          toast.error(
            "Failed to load attempts"
          );

          setStudents([]);

        } finally {

          setLoading(false);
        }
      };

    if (assignment) {

      fetchAttempts();
    }

  }, [assignment,token]);

  return (

    <>

      {/* OVERLAY */}

      <div
        className="
        fixed inset-0 z-50
        bg-black/40
        flex justify-end
      "
      >

        {/* SIDEBAR */}

        <div
          className="
          w-full max-w-2xl
          bg-white
          h-full
          overflow-y-auto
          shadow-2xl
          animate-slide-in
        "
        >

          {/* HEADER */}

          <div
            className="
            sticky top-0 z-10
            bg-white
            border-b
            p-5
            flex items-center
            justify-between
          "
          >

            <div>

              <h2
                className="
                text-2xl font-bold
              "
              >
                Assignment Attempts
              </h2>

              <p
                className="
                text-sm text-gray-500 mt-1
              "
              >
                {assignment.title}
              </p>

            </div>

            <button
              onClick={onClose}
              className="
              p-2 rounded-xl
              hover:bg-gray-100
            "
            >
              <X size={20} />
            </button>

          </div>

          {/* BODY */}

          <div className="p-5">

            {
              loading ? (

                <div
                  className="
                  text-center py-20
                  text-gray-500
                "
                >
                  Loading attempts...
                </div>

              ) : students.length === 0 ? (

                <div
                  className="
                  text-center py-20
                  text-gray-500
                "
                >
                  No students found
                </div>

              ) : (

                <div className="space-y-4">

                  {
                    students?.map((student) => (

                      <div
                      key={student.student_id}
                        className="
                        border border-gray-200
                        rounded-2xl
                        p-5
                        bg-white
                        hover:shadow-md
                        transition-all
                      "
                      >

                        {/* TOP */}

                        <div
                          className="
                          flex items-start
                          justify-between
                          gap-4
                        "
                        >

                          {/* LEFT */}

                          <div>

                            <h3
                              className="
                              text-lg
                              font-bold
                              text-gray-900
                            "
                            >
                              {student.studentName}
                            </h3>

                            <p
                              className="
                              text-sm
                              text-gray-500
                            "
                            >
                              {student.email}
                            </p>

                          </div>

                          {/* RIGHT */}

                          <div
                            className="
                            flex flex-col
                            items-end
                            gap-2
                          "
                          >

                            {
                              student.attempted ? (

                                <span
                                  className="
                                  flex items-center gap-1
                                  text-xs font-semibold
                                  px-3 py-1 rounded-full
                                  bg-emerald-100
                                  text-emerald-700
                                "
                                >
                                  <CheckCircle2 size={14} />
                                  Attempted
                                </span>

                              ) : (

                                <span
                                  className="
                                  flex items-center gap-1
                                  text-xs font-semibold
                                  px-3 py-1 rounded-full
                                  bg-rose-100
                                  text-rose-700
                                "
                                >
                                  <Clock size={14} />
                                  Not Attempted
                                </span>

                              )
                            }

                            <span
                              className="
                              text-xs text-gray-500
                            "
                            >
                              Attempts:
                              {" "}
                              {student.totalAttempts}
                            </span>

                          </div>

                        </div>

                        {/* SUBMISSIONS */}

                        {
                          student.attempted &&
                          student.submissions?.length > 0 && (

                            <div className="mt-5 space-y-3">

                              {
                                student.submissions.map(
                                  (sub, index) => (

                                    <div
                                    key={sub.submission_id || index}
                                      className="
                                      bg-gray-50
                                      border
                                      rounded-2xl
                                      p-4
                                      flex items-center
                                      justify-between
                                    "
                                    >

                                      {/* LEFT */}

                                      <div>

                                        <h4
                                          className="
                                          text-sm font-bold
                                          text-gray-800
                                        "
                                        >
                                          Submission #{index + 1}
                                        </h4>

                                        <p
                                          className="
                                          text-xs text-gray-500
                                          mt-1
                                        "
                                        >
                                          {
                                            new Date(
                                              sub.submittedAt
                                            ).toLocaleString()
                                          }
                                        </p>

                                      </div>

                                      {/* RIGHT */}

                                      <div
                                        className="
                                        flex items-center
                                        gap-3
                                      "
                                      >

                                        <div
                                          className="
                                          text-right
                                        "
                                        >

                                          <p
                                            className="
                                            text-xs text-gray-500
                                          "
                                          >
                                            Score
                                          </p>

                                          <p
                                            className="
                                            text-sm font-bold
                                          "
                                          >
                                            {sub.score ?? 0}
                                          </p>

                                        </div>

                                        <button
                                          onClick={() =>
                                            setSelectedSubmission(sub)
                                          }
                                          className="
                                          flex items-center gap-2
                                          bg-gray-900
                                          text-white
                                          px-4 py-2
                                          rounded-xl
                                          text-sm
                                          font-semibold
                                          hover:bg-gray-700
                                          transition-colors
                                        "
                                        >
                                          <Eye size={14} />
                                          View
                                        </button>

                                      </div>

                                    </div>
                                  )
                                )
                              }

                            </div>

                          )
                        }

                      </div>
                    ))
                  }

                </div>
              )
            }

          </div>

        </div>

      </div>

      {/* ===================================================== */}
      {/* SUBMISSION VIEW MODAL */}
      {/* ===================================================== */}

      {
        selectedSubmission && (

          <div
            className="
            fixed inset-0 z-[60]
            bg-black/50
            flex items-center
            justify-center
            p-5
          "
          >

            <div
              className="
              bg-white
              w-full
              max-w-5xl
              rounded-3xl
              shadow-2xl
              overflow-hidden
              max-h-[90vh]
              overflow-y-auto
            "
            >

              {/* HEADER */}

              <div
                className="
                p-5 border-b
                flex items-center
                justify-between
              "
              >

                <div>

                  <h2
                    className="
                    text-2xl
                    font-bold
                  "
                  >
                    Submission Details
                  </h2>

                  <p
                    className="
                    text-sm
                    text-gray-500 mt-1
                  "
                  >
                    {
                      new Date(
                        selectedSubmission.submittedAt
                      ).toLocaleString()
                    }
                  </p>

                </div>

                <button
                  onClick={() =>
                    setSelectedSubmission(null)
                  }
                  className="
                  p-2 rounded-xl
                  hover:bg-gray-100
                "
                >
                  <X size={20} />
                </button>

              </div>

              {/* CONTENT */}

              <div className="p-5">

                {/* STATS */}

                <div
                  className="
                  grid grid-cols-1
                  md:grid-cols-3
                  gap-4 mb-6
                "
                >

                  <div
                    className="
                    bg-gray-50
                    rounded-2xl
                    p-4
                  "
                  >
                    <p className="text-xs text-gray-500">
                      Score
                    </p>

                    <h3
                      className="
                      text-2xl
                      font-bold
                    "
                    >
                      {selectedSubmission.score ?? 0}
                    </h3>
                  </div>

                  <div
                    className="
                    bg-gray-50
                    rounded-2xl
                    p-4
                  "
                  >
                    <p className="text-xs text-gray-500">
                      Status
                    </p>

                    <div
                    className={`
                      inline-flex items-center gap-2
                      px-3 py-1 rounded-full text-sm font-semibold capitalize

                      ${
                        selectedSubmission.status === "reviewed"
                          ? "bg-emerald-100 text-emerald-700"
                          : selectedSubmission.status === "pending"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-blue-100 text-blue-700"
                      }
                    `}
                  >
                    {selectedSubmission.status}
                  </div>
                  </div>

                  <div
                    className="
                    bg-gray-50
                    rounded-2xl
                    p-4
                  "
                  >
                    <p className="text-xs text-gray-500">
                      Language
                    </p>

                    <h3
                      className="
                      text-lg
                      font-bold
                      uppercase
                    "
                    >
                      {
                        selectedSubmission.language ||
                        "N/A"
                      }
                    </h3>
                  </div>

                </div>

                {/* CODE */}

                <div>

                  <div
                    className="
                    flex items-center gap-2
                    mb-3
                  "
                  >

                    <Terminal size={18} />

                    <h3
                      className="
                      text-lg font-bold
                    "
                    >
                      Submitted Code
                    </h3>

                  </div>

                  <pre
                    className="
                    bg-black
                    text-green-400
                    rounded-2xl
                    p-5
                    overflow-x-auto
                    text-sm
                    leading-relaxed
                  "
                  >
                    {selectedSubmission.code}
                  </pre>

                </div>

              </div>

            </div>

          </div>

        )
      }

    </>
  );
}



// ─── Assignment Card ─────────────────────────────────────────────
function TeacherCard({ data, onDelete, onEdit, onViewAttempts }) {
  const diff     = DIFF_META[(data.difficulty || "easy").toLowerCase()] || DIFF_META.easy;
  const langCls  = LANG_COLOR[(data.language || "").toLowerCase()] || "bg-gray-100 text-gray-600";
  const safeParse = (value) => {
    try {
      if (Array.isArray(value)) return value;
      if (typeof value === "string") {
        return JSON.parse(value || "[]");
      }
      return [];
    } catch {
      return [];
    }
  };
  
  const hints = safeParse(data.hints);
  const test_case = safeParse(data.test_cases);

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden">
      {/* Top accent */}
      <div className={`h-1 w-full ${diff.dot}`} />

      <div className="p-5 flex-1 flex flex-col">
        {/* Row 1: badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge label={data.language || "code"} colorClass={langCls} />
          <Badge label={data.difficulty || "easy"} colorClass={diff.color} />
          {data.standard && <Badge label={`Std ${data.standard}`} colorClass="bg-slate-100 text-slate-600" />}
          {data.categoryName && <Badge label={data.categoryName} colorClass="bg-violet-100 text-violet-700" />}
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-2 leading-snug">{data.title}</h3>

        {/* Description */}
        {data.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">{data.description}</p>
        )}

        {/* Meta pills */}
        <div className="flex flex-wrap gap-3 mt-auto mb-4">
          {data.marks != null && (
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <Star size={12} className="text-amber-400" />
              {data.marks} marks
            </span>
          )}
          {hints.length > 0 && (
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <Lightbulb size={12} className="text-yellow-500" />
              {hints.length} hint{hints.length !== 1 ? "s" : ""}
            </span>
          )}
          {test_case.length > 0 && (
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <TestTube2 size={12} className="text-violet-500" />
              {test_case.length} test case{test_case.length !== 1 ? "s" : ""}
            </span>
          )}
          {data.starter_code && (
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <FileCode2 size={12} className="text-blue-400" />
              Starter code
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-gray-50">
          <button
            onClick={() => onViewAttempts(data)}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 rounded-xl bg-gray-900 text-white hover:bg-gray-700 transition-colors"
          >
            <BarChart2 size={13} />
            Attempts
          </button>
          <button
            onClick={() => onEdit(data)}
            className="flex items-center justify-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Edit3 size={13} />
            Edit
          </button>
          <button
            onClick={() => onDelete(data.id || data._id)}
            className="flex items-center justify-center px-3 py-2.5 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Student Card ────────────────────────────────────────────────
function StudentCard({ data }) {

  const [submitting, setSubmitting] =
    useState(false);

  const diff =
    DIFF_META[
      (data.difficulty || "easy").toLowerCase()
    ] || DIFF_META.easy;

  const langCls =
    LANG_COLOR[
      (data.language || "").toLowerCase()
    ] || "bg-gray-100 text-gray-600";

  const handleStart = async () => {

    try {

      setSubmitting(true);

      const token =
        localStorage.getItem("token");

      // DEMO PAYLOAD
      // replace with actual code editor data later

      const payload = {
        code: data.starter_code || "// my solution",
        assignmentId:
          data.id || data._id,
      };

      await axios.post(
        ENDPOINT.SUBMIT_ASSIGNMENT(
          data.id || data._id
        ),
        payload,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "Assignment submitted successfully"
      );

    } catch (err) {

      console.log(err);

      toast.error(
        err?.response?.data?.message ||
        "Submission failed"
      );

    } finally {

      setSubmitting(false);

    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden">

      <div className={`h-1 w-full ${diff.dot}`} />

      <div className="p-5 flex-1 flex flex-col">

        <div className="flex flex-wrap gap-2 mb-3">
          <Badge
            label={data.language || "code"}
            colorClass={langCls}
          />

          <Badge
            label={data.difficulty || "easy"}
            colorClass={diff.color}
          />
        </div>

        <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-2">
          {data.title}
        </h3>

        {data.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
            {data.description}
          </p>
        )}

        <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-50">

          {data.marks != null && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Star
                size={12}
                className="text-amber-400"
              />
              {data.marks} marks
            </span>
          )}

          <button
            onClick={handleStart}
            disabled={submitting}
            className="ml-auto flex items-center gap-1.5 text-xs font-semibold bg-gray-900 text-white px-4 py-2.5 rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-50"
          >

            {submitting
              ? "Submitting..."
              : "Submit"}

            <ChevronRight size={13} />

          </button>

        </div>

      </div>

    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────
export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [search, setSearch]           = useState("");
  const [open, setOpen]               = useState(false);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [editData, setEditData]       = useState(null);
  const [drawerAssignment, setDrawerAssignment] = useState(null);
  const [diffFilter, setDiffFilter]   = useState("all");
  const [langFilter, setLangFilter]   = useState("all");

  let user = {};
  try { user = JSON.parse(localStorage.getItem("user")) || {}; } catch { user = {}; }

  const token = localStorage.getItem("token");
  const authConfig = { headers: { Authorization: `Bearer ${token}` } };

  // ── load ──
  const loadAssignments = async () => {

    try {
  
      setLoading(true);
      setError("");
  
      const res = await axios.get(
        ENDPOINT.GET_ASSIGNMENTS,
        authConfig
      );
  
      console.log("ASSIGNMENT API", res.data);
  
      const rawData =
        res.data.data ||
        res.data.assignments ||
        res.data ||
        [];
  
      const data = Array.isArray(rawData)
        ? rawData
        : [];
  
      let filtered = data;
  
      if (user?.role === "student") {
  
        filtered = data.filter(
          (a) =>
            String(a.standard) ===
            String(user.standard)
        );
      }
  
      console.log("USER", user);
      console.log("FILTERED", filtered);
  
      setAssignments(filtered);
  
    } catch (err) {
  
      console.log(err);
  
      setError("Failed to load assignments");
  
      toast.error(
        "Failed to load assignments"
      );
  
      setAssignments([]);
  
    } finally {
  
      setLoading(false);
  
    }
  };

  const userData =
  JSON.parse(localStorage.getItem("user") || "{}");

const userRole = userData?.role;
const userStandard = userData?.standard;

  useEffect(() => {
    loadAssignments();
  }, [userStandard]);

  // ── create ──
  const handleCreate = async (formData) => {
    try {
      await axios.post(ENDPOINT.CREATE_ASSIGNMENT, formData, authConfig);
      toast.success("Assignment Created");
      setOpen(false);
      loadAssignments();
    } catch { toast.error("Failed to create assignment"); }
  };

  // ── edit ──
  const handleEdit = async (formData) => {
    try {
      const id = editData.id || editData._id;
      await axios.put(ENDPOINT.UPDATE_ASSIGNMENT(id), formData, authConfig);
      toast.success("Assignment Updated");
      setEditData(null);
      loadAssignments();
    } catch { toast.error("Failed to update assignment"); }
  };

  // ── delete ──
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this assignment?")) return;
    try {
      await axios.delete(ENDPOINT.DELETE_ASSIGNMENT(id), authConfig);
      toast.success("Assignment Deleted");
      loadAssignments();
    } catch { toast.error("Failed to delete assignment"); }
  };

  // ── filter ──
  const languages = [...new Set(assignments.map(a => a.language).filter(Boolean))];

  const filtered = assignments.filter(a => {
    const matchSearch =
  (a.title || "")
    .toLowerCase()
    .includes(search.toLowerCase());
    const matchDiff   = diffFilter === "all" || (a.difficulty || "").toLowerCase() === diffFilter;
    const matchLang   = langFilter === "all" || (a.language || "").toLowerCase() === langFilter;
    return matchSearch && matchDiff && matchLang;
  });

  const isTeacher = user?.role !== "student";

  // ── totals ──
  const statsByDiff = {
    easy:   assignments.filter(a => (a.difficulty||"").toLowerCase() === "easy").length,
    medium: assignments.filter(a => (a.difficulty||"").toLowerCase() === "medium").length,
    hard:   assignments.filter(a => (a.difficulty||"").toLowerCase() === "hard").length,
  };

  return (
    <div className="min-h-screen bg-[#f5f5f4] p-5 md:p-8">
      <style>{`
        @keyframes slide-in { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .animate-slide-in { animation: slide-in 0.25s ease-out; }
      `}</style>

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {isTeacher ? "Assignments" : "My Assignments"}
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            {isTeacher
              ? "Create, manage, and track student progress on coding tasks"
              : "Complete your coding tasks and improve your skills"}
          </p>
        </div>

        {/* Stat cards */}
        <div className="flex gap-3">
          {[
            { label: "Total",  value: assignments.length, bg: "bg-gray-900",      text: "text-white" },
            { label: "Easy",   value: statsByDiff.easy,   bg: "bg-emerald-100",   text: "text-emerald-700" },
            { label: "Medium", value: statsByDiff.medium, bg: "bg-amber-100",     text: "text-amber-700" },
            { label: "Hard",   value: statsByDiff.hard,   bg: "bg-rose-100",      text: "text-rose-700" },
          ].map(({ label, value, bg, text }) => (
            <div key={label} className={`${bg} ${text} px-3 py-2 rounded-xl text-center min-w-[56px]`}>
              <p className="text-xl font-bold leading-none">{value}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wide opacity-80 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by title…"
              className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={diffFilter}
              onChange={e => setDiffFilter(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-900 bg-white"
            >
              <option value="all">All Levels</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            {languages.length > 0 && (
              <select
                value={langFilter}
                onChange={e => setLangFilter(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-900 bg-white"
              >
                <option value="all">All Languages</option>
                {languages.map(l => <option key={l} value={l.toLowerCase()}>{l}</option>)}
              </select>
            )}
            {isTeacher && (
              <button
                onClick={() => { setEditData(null); setOpen(true); }}
                className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap"
              >
                <Plus size={16} /> New Assignment
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <AlertCircle size={18} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* ── Content ── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-white rounded-2xl p-5 animate-pulse border border-gray-100">
              <div className="flex gap-2 mb-3">
                <div className="h-5 w-16 bg-gray-100 rounded-full" />
                <div className="h-5 w-12 bg-gray-100 rounded-full" />
              </div>
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-100 rounded mb-1" />
              <div className="h-3 bg-gray-100 rounded w-5/6 mb-6" />
              <div className="h-9 bg-gray-100 rounded-xl" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-16 flex flex-col items-center justify-center text-center min-h-[380px]">
          <BookOpen size={60} className="text-gray-200 mb-5" />
          <h2 className="text-xl font-bold text-gray-700">No Assignments Found</h2>
          <p className="text-gray-400 mt-2 max-w-sm text-sm">
            {search || diffFilter !== "all" || langFilter !== "all"
              ? "Try adjusting your search or filters."
              : isTeacher
              ? "Create your first assignment to get started."
              : "No assignments available right now."}
          </p>
          {isTeacher && !search && diffFilter === "all" && langFilter === "all" && (
            <button
              onClick={() => setOpen(true)}
              className="mt-6 flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-700 transition-colors"
            >
              <Plus size={15} /> Create Assignment
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(a =>
            isTeacher ? (
              <TeacherCard
                key={a.id || a._id}
                data={a}
                onDelete={handleDelete}
                onEdit={d => { setEditData(d); setOpen(true); }}
                onViewAttempts={setDrawerAssignment}
              />
            ) : (
              <StudentCard key={a.id || a._id} data={a} />
            )
          )}
        </div>
      )}

      {/* ── Modal ── */}
      {open && (
        <AssignmentForm
          onClose={() => { setOpen(false); setEditData(null); }}
          onSubmit={editData ? handleEdit : handleCreate}
          initialData={editData}
        />
      )}

      {/* ── Attempt Drawer ── */}
      {drawerAssignment && (
        <AttemptDrawer
          assignment={drawerAssignment}
          onClose={() => setDrawerAssignment(null)}
        />
      )}
    </div>
  );
}
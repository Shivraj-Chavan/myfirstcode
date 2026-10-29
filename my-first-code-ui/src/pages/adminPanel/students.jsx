// src/pages/admin/Students.jsx

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import ENDPOINT from "../../lib/endpoints";
import {
  Search, Users, Trash2, Pencil, Plus,
  UserCheck, Eye, X, BookOpen, Trophy,
  ClipboardCheck, Layers3, ChevronDown,
  BookOpenCheck,
} from "lucide-react";

const STANDARDS = ["6th","7th","8th","9th","10th","11th","12th"];

const badge = (condition, yes, no) =>
  condition
    ? `bg-green-100 text-green-700 ${yes}`
    : `bg-red-100 text-red-700 ${no}`;

export default function Students() {

  const [students,           setStudents]           = useState([]);
  const [teachers,           setTeachers]           = useState([]);
  const [search,             setSearch]             = useState("");
  const [loading,            setLoading]            = useState(false);

  const [showModal,          setShowModal]          = useState(false);
  const [showAssignModal,    setShowAssignModal]    = useState(false);
  const [showProgressModal,  setShowProgressModal]  = useState(false);

  const [editingId,          setEditingId]          = useState(null);
  const [selectedStudent,    setSelectedStudent]    = useState(null);
  const [progress,           setProgress]           = useState(null);
  const [showLevelModal, setShowLevelModal] = useState(false);
const [levels, setLevels] = useState([]);
const [selectedLevels, setSelectedLevels] = useState([]);
const [alreadyAssignedLevels, setAlreadyAssignedLevels] = useState([]);

  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    standard: "6th", course: "", status: "Active",
  });

  const [assignForm, setAssignForm] = useState({ teacher_id: "", batch_name: "" });

  // ── fetch ──────────────────────────────────────────
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(ENDPOINT.GET_ALL_STUDENTS);
      setStudents(res.data.students || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchTeachers = async () => {
    try {
  
      const res = await axios.get(
        ENDPOINT.GET_TEACHERS
      );
  
      console.log(
        "Teachers API Response:",
        res.data
      );
  
      // support multiple response formats
      const teacherList =
        res.data?.teachers ||
        res.data?.data ||
        res.data ||
        [];
  
      setTeachers(
        Array.isArray(teacherList)
          ? teacherList
          : []
      );
  
    } catch (e) {
      console.error(e);
      setTeachers([]);
    }
  };

  useEffect(() => { fetchStudents(); fetchTeachers();  fetchLevel(); }, []);

  const fetchLevel = async () => {
    try {
      const res = await axios.get(ENDPOINT.GET_LEVELS);
  
      console.log("LEVELS API:", res.data);
  
      setLevels(
        Array.isArray(res.data?.levels)
          ? res.data.levels
          : Array.isArray(res.data?.data)
          ? res.data.data
          : []
      );
  
    } catch (err) {
      console.error(err);
      setLevels([]);
    }
  };

  const openLevelModal = async (student) => {
    try {
      setSelectedStudent(student);
  
      const res = await axios.get(
        ENDPOINT.GET_STUDENT_LEVELS(student.id)
      );
  
      const assigned =
        (res.data.levels || []).map(
          (item) => item.level_id
        );
  
      setAlreadyAssignedLevels(assigned);
  
      setSelectedLevels(assigned);
  
      setShowLevelModal(true);
  
    } catch (err) {
      console.error(err);
    }
  };

  const assignLevels = async () => {
    try {
  
      const newLevels = selectedLevels.filter(
        (id) => !alreadyAssignedLevels.includes(id)
      );
  
      if (newLevels.length === 0) {
        alert("All selected levels are already assigned");
        return;
      }
  
      const admin = JSON.parse(
        localStorage.getItem("user")
      );
  
      await axios.post(
        ENDPOINT.ASSIGN_LEVELS,
        {
          student_id: selectedStudent.id,
          level_ids: newLevels,
          assigned_by: admin?.id,
        }
      );
  
      alert("Levels assigned successfully");
  
      setShowLevelModal(false);
  
      fetchStudents();
  
    } catch (err) {
      console.error(err);
  
      alert(
        err?.response?.data?.message ||
        "Failed to assign levels"
      );
    }
  };

  // ── CRUD ───────────────────────────────────────────
  const createStudent = async () => {
    try {
      await axios.post(ENDPOINT.CREATE_STUDENT, form);
      closeModal(); fetchStudents();
    } catch (e) { alert(e?.response?.data?.message || "Error"); }
  };

  const updateStudent = async () => {
    try {
      await axios.put(ENDPOINT.UPDATE_STUDENT(editingId), form);
      closeModal(); fetchStudents();
    } catch (e) { alert(e?.response?.data?.message || "Error"); }
  };

  const deleteStudent = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try { await axios.delete(ENDPOINT.DELETE_STUDENT(id)); fetchStudents(); }
    catch (e) { console.error(e); }
  };

  const editStudent = (s) => {
    setEditingId(s.id);
    setForm({ name: s.name, email: s.email, phone: s.phone, standard: s.standard, course: s.course, status: s.status });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false); setEditingId(null);
    setForm({ name:"", email:"", phone:"", standard:"6th", course:"", status:"Active" });
  };

  // ── assign ─────────────────────────────────────────
  const openAssignModal = (s) => {
    setSelectedStudent(s);
    setAssignForm({ teacher_id: s.teacher_id || "", batch_name: s.batch_name || "" });
    setShowAssignModal(true);
  };

  const assignStudent = async () => {
    try {
      const admin = JSON.parse(
        localStorage.getItem("user")
      );
      
      await axios.put(
        ENDPOINT.ASSIGN_STUDENT(selectedStudent.id),
        {
          ...assignForm,
          assigned_by: admin?.id,
        }
      );
      setShowAssignModal(false); fetchStudents();
    } catch (e) { alert(e?.response?.data?.message || "Error"); }
  };

  // ── progress ────────────────────────────────────────
  const viewProgress = async (s) => {
    setSelectedStudent(s); setProgress(null); setShowProgressModal(true);
    try {
      const res = await axios.get(ENDPOINT.GET_STUDENT_PROGRESS(s.id));
      setProgress(res.data);
    } catch (e) { console.error(e); }
  };

  // ── filter ──────────────────────────────────────────
  const filtered = useMemo(() =>
    students.filter((s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase())
    ), [students, search]);

  // ── shared input style ───────────────────────────────
  const inp = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900/10 bg-white";

  // ════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-gray-50 p-5">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Users size={20} /> Students
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage students, assign teachers &amp; track progress
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-white border border-gray-200 text-sm text-gray-600 px-3 py-1.5 rounded-lg font-medium">
            {students.length} total
          </span>
          <button
            onClick={() => { setEditingId(null); setShowModal(true); }}
            className="flex items-center gap-1.5 bg-gray-900 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={15} /> Add Student
          </button>
        </div>
      </div>

      {/* ── Search ── */}
      <div className="relative mb-4">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-900/10"
        />
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Name","Email","Phone","Std","Course","Teacher","Batch","Reg.","Status","Assigned Levels","Actions"].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
  {loading ? (
    <tr>
      <td
        colSpan={11}
        className="py-10 text-center text-sm text-gray-400"
      >
        Loading...
      </td>
    </tr>
  ) : filtered.length === 0 ? (
    <tr>
      <td
        colSpan={11}
        className="py-10 text-center text-sm text-gray-400"
      >
        No students found
      </td>
    </tr>
  ) : (
    filtered.map((s) => (
      <tr
        key={s.id}
        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
      >
        <td className="px-3 py-2.5 font-medium text-gray-900">
          {s.name}
        </td>

        <td className="px-3 py-2.5 text-gray-500">
          {s.email}
        </td>

        <td className="px-3 py-2.5 text-gray-500">
          {s.phone || "—"}
        </td>

        <td className="px-3 py-2.5 text-gray-500">
          {s.standard}
        </td>

        <td className="px-3 py-2.5 text-gray-500">
          {s.course || "—"}
        </td>

        <td className="px-3 py-2.5 text-gray-500">
          {s.teacher_name || "—"}
        </td>

        <td className="px-3 py-2.5 text-gray-500">
          {s.batch_name || "—"}
        </td>

        <td className="px-3 py-2.5">
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              s.registration_status === "ASSIGNED"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {s.registration_status || "PENDING"}
          </span>
        </td>

        <td className="px-3 py-2.5">
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              s.status === "Active"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {s.status}
          </span>
        </td>

        {/* Assigned Levels */}
        <td className="px-3 py-2.5">
          <div className="flex flex-wrap gap-1">
            {s.levels?.length ? (
              s.levels.map((level) => (
                <span
                  key={level.id}
                  className="px-2 py-1 rounded bg-purple-100 text-purple-700 text-xs"
                >
                  {level.level_name}
                </span>
              ))
            ) : (
              <span className="text-gray-400 text-xs">
                No Levels
              </span>
            )}
          </div>
        </td>

        {/* Actions */}
        <td className="px-3 py-2.5">
          <div className="flex items-center gap-1">
            <button
              onClick={() => viewProgress(s)}
              title="View Progress"
              className="p-1.5 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100"
            >
              <Eye size={14} />
            </button>

            <button
              onClick={() => openAssignModal(s)}
              title="Assign Teacher"
              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
            >
              <UserCheck size={14} />
            </button>

            <button
              onClick={() => editStudent(s)}
              title="Edit Student"
              className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
            >
              <Pencil size={14} />
            </button>

            <button
              onClick={() => deleteStudent(s.id)}
              title="Delete Student"
              className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
            >
              <Trash2 size={14} />
            </button>

            <button
              onClick={() => openLevelModal(s)}
              title="Assign Levels"
              className="p-1.5 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100"
            >
              <BookOpenCheck size={14} />
            </button>
          </div>
        </td>
      </tr>
    ))
  )}
</tbody>
          </table>
        </div>
      </div>

      {/* ════════════════════════════════
           ADD / EDIT STUDENT MODAL
          ════════════════════════════════ */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl">

            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">{editingId ? "Edit Student" : "Add Student"}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>

            <div className="p-5 space-y-3">
              <input placeholder="Full Name"      value={form.name}     onChange={(e) => setForm({...form, name: e.target.value})}     className={inp} />
              <input placeholder="Email"          type="email" value={form.email}    onChange={(e) => setForm({...form, email: e.target.value})}    className={inp} />
              <input placeholder="Phone"          value={form.phone}    onChange={(e) => setForm({...form, phone: e.target.value})}    className={inp} />
              <input placeholder="Course"         value={form.course}   onChange={(e) => setForm({...form, course: e.target.value})}   className={inp} />

              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <select value={form.standard} onChange={(e) => setForm({...form, standard: e.target.value})}
                    className={`${inp} appearance-none`}>
                    {STANDARDS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                  <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                <div className="relative">
                  <select value={form.status} onChange={(e) => setForm({...form, status: e.target.value})}
                    className={`${inp} appearance-none`}>
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                  <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-100">
              <button onClick={closeModal} className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2">Cancel</button>
              <button onClick={editingId ? updateStudent : createStudent}
                className="bg-gray-900 text-white text-sm px-5 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                {editingId ? "Update" : "Add Student"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ════════════════════════════════
           ASSIGN TEACHER MODAL
          ════════════════════════════════ */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl">

            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <h2 className="font-semibold text-gray-900">Assign Teacher</h2>
                <p className="text-xs text-gray-400 mt-0.5">{selectedStudent?.name}</p>
              </div>
              <button onClick={() => setShowAssignModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <div className="relative">
              <select
                value={assignForm.teacher_id}
                onChange={(e) =>
                  setAssignForm({
                    ...assignForm,
                    teacher_id: e.target.value
                  })
                }
                className={`${inp} appearance-none`}
              >
                <option value="">
                  Select Teacher
                </option>

                {Array.isArray(teachers) &&
                  teachers.map((t, index) => (
                    <option
                      key={t.id || index}
                      value={t.id}
                    >
                      {t.name}
                    </option>
                  ))}
              </select>
                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              <input placeholder="Batch Name" value={assignForm.batch_name}
                onChange={(e) => setAssignForm({...assignForm, batch_name: e.target.value})}
                className={inp} />
            </div>

            <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-100">
              <button onClick={() => setShowAssignModal(false)} className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2">Cancel</button>
              <button onClick={assignStudent}
                className="bg-emerald-600 text-white text-sm px-5 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                Assign
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ════════════════════════════════
           PROGRESS MODAL
          ════════════════════════════════ */}
      {showProgressModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl my-8">

            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <h2 className="font-semibold text-gray-900">Student Progress</h2>
                <p className="text-xs text-gray-400 mt-0.5">{selectedStudent?.name} · {selectedStudent?.email} · {selectedStudent?.standard}std </p>
              </div>
              <button onClick={() => { setShowProgressModal(false); setProgress(null); }}
                className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>

            <div className="p-5">
              {!progress ? (
                <p className="text-center text-sm text-gray-400 py-12">Loading progress…</p>
              ) : (
                <div className="space-y-6">

                  {/* stat cards */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label:"Levels Completed", val: progress.levelsCompleted,       icon: <Layers3 size={20} />,       color:"bg-indigo-50 text-indigo-600" },
                      { label:"Assignments",       val: progress.assignments?.length,   icon: <ClipboardCheck size={20} />, color:"bg-emerald-50 text-emerald-600" },
                      { label:"Quizzes",           val: progress.quizzes?.length,       icon: <Trophy size={20} />,        color:"bg-amber-50 text-amber-600" },
                    ].map(({ label, val, icon, color }) => (
                      <div key={label} className={`${color} rounded-xl p-4`}>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-medium opacity-70">{label}</p>
                          {icon}
                        </div>
                        <p className="text-2xl font-bold">{val ?? 0}</p>
                      </div>
                    ))}
                  </div>

                  {/* assignment history */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 mb-3">
                      <BookOpen size={15} /> Assignment History
                    </h3>
                    {!progress.assignments?.length ? (
                      <p className="text-xs text-gray-400 text-center py-4 bg-gray-50 rounded-xl">No assignments yet</p>
                    ) : (
                      <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                              <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500">Title</th>
                              <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500">Marks</th>
                              <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500">Submitted</th>
                            </tr>
                          </thead>
                          <tbody>
                            {progress.assignments.map((item, i) => (
                              <tr key={i} className="border-b border-gray-100 last:border-0">
                                <td className="px-4 py-2.5 text-gray-800">{item.title}</td>
                                <td className="px-4 py-2.5 text-gray-600">{item.marks}</td>
                                <td className="px-4 py-2.5 text-gray-400 text-xs">
                                  {item.submitted_at ? new Date(item.submitted_at).toLocaleString() : "—"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* quiz history */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 mb-3">
                      <Trophy size={15} /> Quiz History
                    </h3>
                    {!progress.quizzes?.length ? (
                      <p className="text-xs text-gray-400 text-center py-4 bg-gray-50 rounded-xl">No quizzes yet</p>
                    ) : (
                      <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                              <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500">Quiz</th>
                              <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500">Score</th>
                              <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500">Status</th>
                              <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500">Attempted</th>
                            </tr>
                          </thead>
                          <tbody>
                            {progress.quizzes.map((item, i) => (
                              <tr key={i} className="border-b border-gray-100 last:border-0">
                                <td className="px-4 py-2.5 text-gray-800">{item.title}</td>
                                <td className="px-4 py-2.5 text-gray-600">{item.marks}</td>
                                <td className="px-4 py-2.5">
                                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                    item.status === "Passed" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                                  }`}>
                                    {item.status}
                                  </span>
                                </td>
                                <td className="px-4 py-2.5 text-gray-400 text-xs">
                                  {item.attempted_at ? new Date(item.attempted_at).toLocaleString() : "—"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>

          </div>
        </div>
      )}


{/* Levels Modal */}
{showLevelModal && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">

    <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">

        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Assign Levels
          </h2>

          <p className="text-sm text-gray-500">
            Student: {selectedStudent?.name}
          </p>
        </div>

        <button
          onClick={() => setShowLevelModal(false)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <X size={18} />
        </button>

      </div>

      {/* Selected Levels Summary */}
      {selectedLevels.length > 0 && (
        <div className="px-6 py-4 bg-purple-50 border-b">

          <h4 className="font-semibold text-purple-700 mb-2">
            Selected Levels ({selectedLevels.length})
          </h4>

          <div className="flex flex-wrap gap-2">

            {levels
              .filter((level) =>
                selectedLevels.includes(level.id)
              )
              .map((level) => (
                <span
                  key={level.id}
                  className="px-3 py-1 rounded-full bg-purple-600 text-white text-xs"
                >
                  {level.level_name}
                </span>
              ))}

          </div>

        </div>
      )}

      {/* Levels List */}
      <div className="p-6 max-h-[500px] overflow-y-auto">

        {levels.length === 0 ? (

          <div className="text-center text-gray-500 py-10">
            No levels found
          </div>

        ) : (

          <div className="grid gap-3">

            {levels.map((level) => {

              const checked =
                selectedLevels.includes(level.id);

              const alreadyAssigned =
                alreadyAssignedLevels.includes(level.id);

              return (
                <div
                  key={level.id}
                  onClick={() => {

                    if (alreadyAssigned) {
                      alert(
                        `${level.level_name} is already assigned`
                      );
                      return;
                    }

                    if (checked) {
                      setSelectedLevels(
                        selectedLevels.filter(
                          (id) => id !== level.id
                        )
                      );
                    } else {
                      setSelectedLevels([
                        ...selectedLevels,
                        level.id,
                      ]);
                    }
                  }}
                  className={`border rounded-xl p-4 transition-all
                    ${
                      alreadyAssigned
                        ? "bg-gray-100 border-gray-300 opacity-80 cursor-not-allowed"
                        : checked
                        ? "border-purple-500 bg-purple-50 shadow-sm cursor-pointer"
                        : "border-gray-200 hover:border-purple-300 hover:shadow-sm cursor-pointer"
                    }
                  `}
                >

                  <div className="flex justify-between items-start">

                    <div className="flex-1">

                      <h4 className="font-semibold text-gray-800">
                        {level.level_name}
                      </h4>

                      <p className="text-sm text-gray-500 mt-1">
                        {level.description ||
                          level.objective ||
                          "No description"}
                      </p>

                    </div>

                    <input
                      type="checkbox"
                      checked={checked}
                      readOnly
                      className="h-5 w-5 accent-purple-600"
                    />

                  </div>

                  <div className="flex items-center justify-between mt-4">

                    <div className="flex flex-wrap gap-2">

                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        Level #{level.level_number}
                      </span>

                      {alreadyAssigned && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          Already Assigned
                        </span>
                      )}

                      {!alreadyAssigned && checked && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          Selected
                        </span>
                      )}

                    </div>

                    <span className="font-semibold text-green-600">
                      ₹{level.price || 0}
                    </span>

                  </div>

                </div>
              );
            })} 

          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">

        <button
          onClick={() => setShowLevelModal(false)}
          className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          onClick={assignLevels}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg"
        >
          Save Levels
        </button>

      </div>

    </div>

  </div>
)}

    </div>
  );
}


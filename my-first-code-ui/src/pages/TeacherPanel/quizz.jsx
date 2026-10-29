// src/pages/teacher/Quizzes.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Plus, Trash2, BookOpen, Clock3, Trophy,
  Search, Pencil, Users, X, ChevronDown,
} from "lucide-react";
import ENDPOINT from "../../lib/endpoints";

const STANDARDS = ["6th", "7th", "8th", "9th", "10th", "11th", "12th"];
const ANSWERS   = ["A", "B", "C", "D"];

const BLANK_QUESTION = {
  question: "", option_a: "", option_b: "",
  option_c: "", option_d: "", correct_answer: "A", marks: 1,
};

const INITIAL_FORM = {
  title: "", description: "", standard: "6th",
  category: "", duration: 10,
  questions: [{ ...BLANK_QUESTION }],
};

export default function Quizzes() {

  // ── state ──────────────────────────────────────────────
  const [quizzes,            setQuizzes]            = useState([]);
  const [loading,            setLoading]            = useState(true);
  const [search,             setSearch]             = useState("");

  const [openModal,          setOpenModal]          = useState(false);
  const [editMode,           setEditMode]           = useState(false);
  const [editingId,          setEditingId]          = useState(null);
  const [submitting,         setSubmitting]         = useState(false);

  const [perfOpen,           setPerfOpen]           = useState(false);
  const [perfData,           setPerfData]           = useState([]);
  const [perfLoading,        setPerfLoading]        = useState(false);
  const [perfQuizTitle,      setPerfQuizTitle]      = useState("");

  const [form,               setForm]               = useState(INITIAL_FORM);

  // ── auth ────────────────────────────────────────────────
  const token      = localStorage.getItem("token");
  const authConfig = { headers: { Authorization: `Bearer ${token}` } };

  // ── load all quizzes ────────────────────────────────────
  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const res = await axios.get(ENDPOINT.GET_QUIZZES, authConfig);
      setQuizzes(res.data.data || []);
    } catch (err) {
      console.error("LOAD QUIZZES", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadQuizzes(); }, []);

  // ── form helpers ────────────────────────────────────────
  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleQuestionChange = (idx, field, value) =>
    setForm((f) => {
      const qs = [...f.questions];
      qs[idx] = { ...qs[idx], [field]: value };
      return { ...f, questions: qs };
    });

  const addQuestion = () =>
    setForm((f) => ({ ...f, questions: [...f.questions, { ...BLANK_QUESTION }] }));

  const deleteQuestion = (idx) => {
    if (form.questions.length === 1) return alert("At least one question is required.");
    setForm((f) => ({ ...f, questions: f.questions.filter((_, i) => i !== idx) }));
  };

  const totalMarks = form.questions.reduce((acc, q) => acc + Number(q.marks || 0), 0);

  // ── open create modal ───────────────────────────────────
  const handleOpenCreate = () => {
    setEditMode(false);
    setEditingId(null);
    setForm(INITIAL_FORM);
    setOpenModal(true);
  };

  // ── open edit modal ─────────────────────────────────────
  const handleEdit = async (id) => {
    try {
      const res  = await axios.get(ENDPOINT.GET_SINGLE_QUIZ(id), authConfig);
      const data = res.data;
      setForm({
        title:       data.quiz.title,
        description: data.quiz.description,
        standard:    data.quiz.standard,
        category:    data.quiz.category,
        duration:    data.quiz.duration,
        questions:   data.questions || [],
      });
      setEditingId(id);
      setEditMode(true);
      setOpenModal(true);
    } catch (err) {
      console.error("EDIT LOAD", err);
      alert("Failed to load quiz details.");
    }
  };

  // ── create / update ─────────────────────────────────────
  const handleSubmit = async () => {
    if (!form.title.trim())          return alert("Quiz title is required.");
    if (form.questions.length === 0) return alert("Add at least 1 question.");

    for (let i = 0; i < form.questions.length; i++) {
      const q = form.questions[i];
      if (!q.question || !q.option_a || !q.option_b || !q.option_c || !q.option_d)
        return alert(`Fill all fields in Question ${i + 1}.`);
    }

    const payload = {
      title:       form.title,
      description: form.description,
      standard:    form.standard,
      category:    form.category,
      duration:    Number(form.duration),
      total_marks: totalMarks,
      questions:   form.questions.map((q) => ({
        question:       q.question,
        option_a:       q.option_a,
        option_b:       q.option_b,
        option_c:       q.option_c,
        option_d:       q.option_d,
        correct_answer: q.correct_answer,
        marks:          Number(q.marks),
      })),
    };

    try {
      setSubmitting(true);
      if (editMode) {
        await axios.put(ENDPOINT.UPDATE_QUIZ(editingId), payload, authConfig);
        alert("Quiz updated successfully.");
      } else {
        await axios.post(ENDPOINT.CREATE_QUIZ, payload, authConfig);
        alert("Quiz created successfully.");
      }
      setOpenModal(false);
      setForm(INITIAL_FORM);
      setEditingId(null);
      setEditMode(false);
      loadQuizzes();
    } catch (err) {
      console.error("SUBMIT", err);
      alert(err.response?.data?.message || "Operation failed.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── delete ───────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this quiz? This cannot be undone.")) return;
    try {
      await axios.delete(ENDPOINT.DELETE_QUIZ(id), authConfig);
      loadQuizzes();
    } catch (err) {
      console.error("DELETE", err);
      alert("Failed to delete quiz.");
    }
  };

  // ── student performance ──────────────────────────────────
  const handlePerformance = async (quiz) => {
    setPerfQuizTitle(quiz.title);
    setPerfOpen(true);
    setPerfLoading(true);
    setPerfData([]);
    try {
      const res = await axios.get(ENDPOINT.GET_QUIZ_RESULTS(quiz.id), authConfig);
      setPerfData(res.data.data || []);
    } catch (err) {
      console.error("PERFORMANCE", err);
      alert(err.response?.data?.message || "Failed to load performance data.");
    } finally {
      setPerfLoading(false);
    }
  };

  const closePerfModal = () => {
    setPerfOpen(false);
    setPerfData([]);
    setPerfQuizTitle("");
  };

  // ── filter ───────────────────────────────────────────────
  const filtered = quizzes.filter((q) =>
    q.title?.toLowerCase().includes(search.toLowerCase())
  );

  // ════════════════════════════════════════════════════════
  //  RENDER
  // ════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quizzes</h1>
          <p className="text-sm text-gray-500 mt-0.5">Create, edit and manage quizzes</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          <Plus size={16} />
          Add Quiz
        </button>
      </div>

      {/* ── Search ── */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search quizzes…"
          className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-900/10"
        />
      </div>

      {/* ── Loading / empty ── */}
      {loading && (
        <div className="bg-white rounded-2xl p-12 text-center text-gray-400 text-sm">Loading quizzes…</div>
      )}
      {!loading && filtered.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center text-gray-400 text-sm">No quizzes found.</div>
      )}

      {/* ── Quiz Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((quiz) => (
          <div key={quiz.id} className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-4">

            {/* title row */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-gray-900 truncate">{quiz.title}</h2>
                <span className="inline-block mt-1 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                  {quiz.standard}
                </span>
              </div>
              <BookOpen size={18} className="text-gray-300 shrink-0 mt-0.5" />
            </div>

            {/* description */}
            {quiz.description && (
              <p className="text-sm text-gray-500 line-clamp-2">{quiz.description}</p>
            )}

            {/* stats */}
            <div className="flex gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <Clock3 size={14} /> {quiz.duration} min
              </span>
              <span className="flex items-center gap-1.5">
                <Trophy size={14} /> {quiz.total_marks} marks
              </span>
            </div>

            {/* actions */}
            <div className="flex flex-col gap-2 pt-1 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleEdit(quiz.id)}
                  className="flex items-center justify-center gap-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 py-2 rounded-xl text-sm font-medium transition-colors"
                >
                  <Pencil size={14} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(quiz.id)}
                  className="flex items-center justify-center gap-1.5 bg-red-50 text-red-500 hover:bg-red-100 py-2 rounded-xl text-sm font-medium transition-colors"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
              <button
                onClick={() => handlePerformance(quiz)}
                className="flex items-center justify-center gap-1.5 bg-gray-900 text-white hover:bg-gray-700 py-2 rounded-xl text-sm font-medium transition-colors"
              >
                <Users size={14} /> Student Performance
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* ════════════════════════════════════════════════
           CREATE / EDIT MODAL
          ════════════════════════════════════════════════ */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl my-8 shadow-xl">

            {/* modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">{editMode ? "Edit Quiz" : "Create Quiz"}</h2>
              <button onClick={() => setOpenModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">

              {/* ── Quiz details ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Title *</label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. Chapter 3 – Science"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-900/10"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Brief description…"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-900/10 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Standard</label>
                  <div className="relative">
                    <select
                      name="standard"
                      value={form.standard}
                      onChange={handleChange}
                      className="w-full appearance-none border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-900/10 bg-white"
                    >
                      {STANDARDS.map((s) => <option key={s}>{s}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
                  <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="e.g. Science, Maths"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-900/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Duration (minutes)</label>
                  <input
                    name="duration"
                    type="number"
                    min={1}
                    value={form.duration}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-900/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Total Marks</label>
                  <div className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-400 bg-gray-50">
                    {totalMarks} (auto-calculated)
                  </div>
                </div>
              </div>

              {/* ── Questions ── */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700">
                    Questions ({form.questions.length})
                  </h3>
                  <button
                    onClick={addQuestion}
                    className="flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Plus size={13} /> Add Question
                  </button>
                </div>

                <div className="space-y-4">
                  {form.questions.map((q, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-xl p-4 space-y-3">

                      {/* question header */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Q{idx + 1}
                        </span>
                        <button
                          onClick={() => deleteQuestion(idx)}
                          className="text-red-400 hover:text-red-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* question text */}
                      <textarea
                        value={q.question}
                        onChange={(e) => handleQuestionChange(idx, "question", e.target.value)}
                        placeholder="Enter question…"
                        rows={2}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900/10 resize-none"
                      />

                      {/* options grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {["A", "B", "C", "D"].map((letter) => {
                          const field = `option_${letter.toLowerCase()}`;
                          return (
                            <div key={letter} className="flex items-center gap-2">
                              <span className="text-xs font-bold text-gray-400 w-4 shrink-0">{letter}</span>
                              <input
                                value={q[field]}
                                onChange={(e) => handleQuestionChange(idx, field, e.target.value)}
                                placeholder={`Option ${letter}`}
                                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900/10"
                              />
                            </div>
                          );
                        })}
                      </div>

                      {/* correct answer + marks */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-gray-500">Correct</label>
                          <div className="relative">
                            <select
                              value={q.correct_answer}
                              onChange={(e) => handleQuestionChange(idx, "correct_answer", e.target.value)}
                              className="appearance-none border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none bg-white focus:ring-2 focus:ring-gray-900/10 pr-7"
                            >
                              {ANSWERS.map((a) => <option key={a}>{a}</option>)}
                            </select>
                            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="text-xs text-gray-500">Marks</label>
                          <input
                            type="number"
                            min={1}
                            value={q.marks}
                            onChange={(e) => handleQuestionChange(idx, "marks", e.target.value)}
                            className="w-16 border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-gray-900/10 text-center"
                          />
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* modal footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => setOpenModal(false)}
                className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-gray-900 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-gray-700 disabled:opacity-50 transition-colors"
              >
                {submitting ? "Saving…" : editMode ? "Update Quiz" : "Create Quiz"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════
           PERFORMANCE MODAL
          ════════════════════════════════════════════════ */}
      {perfOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl my-8 shadow-xl">

            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="font-semibold text-gray-900">Student Performance</h2>
                {perfQuizTitle && (
                  <p className="text-xs text-gray-400 mt-0.5">{perfQuizTitle}</p>
                )}
              </div>
              <button onClick={closePerfModal} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {perfLoading && (
                <p className="text-center text-sm text-gray-400 py-12">Loading…</p>
              )}

              {!perfLoading && perfData.length === 0 && (
                <p className="text-center text-sm text-gray-400 py-12">No attempts yet for this quiz.</p>
              )}

              {!perfLoading && perfData.length > 0 && (
                <div className="space-y-3">
                  {perfData.map((item, i) => (
                    <div
                      key={i}
                      className={`rounded-xl border p-4 flex items-start justify-between gap-4 ${
                        item.attempted
                          ? "bg-green-50 border-green-200"
                          : "bg-red-50 border-red-200"
                      }`}
                    >
                      {/* left */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-900 truncate">{item.student_name}</p>
                        <p className="text-xs text-gray-500 truncate">{item.student_email}</p>
                        <p className="text-xs text-gray-500 mt-1">Standard: {item.standard}</p>
                        <div className="flex gap-3 mt-2 text-xs text-gray-600 flex-wrap">
                          <span>Attempted: {item.questions_attempted}/{item.total_questions}</span>
                          <span className="text-green-600">✓ {item.right_answers}</span>
                          <span className="text-red-500">✗ {item.wrong_answers}</span>
                        </div>
                      </div>

                      {/* right */}
                      <div className="text-right shrink-0">
                        <p className="text-lg font-bold text-gray-900">{item.score}/{item.total_marks}</p>
                        <p className="text-xs text-gray-500">{item.percentage}%</p>
                        <p className={`text-xs font-semibold mt-1 ${
                          item.status === "Passed" ? "text-green-600" :
                          item.status === "Failed" ? "text-red-500" : "text-gray-400"
                        }`}>
                          {item.status}
                        </p>
                        <p className="text-xs text-gray-400">Attempt #{item.attempt_no}</p>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
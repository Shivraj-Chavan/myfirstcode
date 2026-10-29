import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, BarChart3, X } from "lucide-react";
import api from "../../api/axios.js";
import { ENDPOINTS } from "../../api/endpoints.js";
import PageHeader from "../../components/shared/PageHeader.jsx";
import Loader from "../../components/ui/Loader.jsx";
import DataTable from "../../components/ui/DataTable.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Modal from "../../components/ui/Modal.jsx";

const EMPTY_Q = () => ({ question: "", option_a: "", option_b: "", option_c: "", option_d: "", correct_answer: "a", marks: 1 });
const EMPTY = { title: "", description: "", standard: "6", category: "", duration: 15, questions: [EMPTY_Q()] };

export default function TeacherQuizzes() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    api.get(ENDPOINTS.quizzes).then((res) => setRows(res.data?.data || [])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setError(""); setModalOpen(true); };

  const openEdit = async (q) => {
    setEditing(q);
    setError("");
    const { data } = await api.get(ENDPOINTS.quiz(q.id));
    setForm({
      title: data.quiz.title,
      description: data.quiz.description || "",
      standard: String(data.quiz.standard),
      category: data.quiz.category || "",
      duration: data.quiz.duration || 15,
      questions: data.questions.length ? data.questions.map((qq) => ({ ...qq })) : [EMPTY_Q()],
    });
    setModalOpen(true);
  };

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const updateQ = (i, k) => (e) => {
    const questions = [...form.questions];
    questions[i] = { ...questions[i], [k]: e.target.value };
    setForm((f) => ({ ...f, questions }));
  };
  const addQ = () => setForm((f) => ({ ...f, questions: [...f.questions, EMPTY_Q()] }));
  const removeQ = (i) => setForm((f) => ({ ...f, questions: f.questions.filter((_, idx) => idx !== i) }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editing) await api.put(ENDPOINTS.quiz(editing.id), form);
      else await api.post(ENDPOINTS.quizzes, form);
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't save quiz.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (q) => {
    if (!confirm(`Delete "${q.title}"?`)) return;
    await api.delete(ENDPOINTS.quiz(q.id));
    load();
  };

  if (loading) return <Loader label="Loading quizzes" />;

  return (
    <div>
      <PageHeader
        eyebrow="teacher/quizzes"
        title="Quizzes"
        subtitle="Build multiple-choice quizzes for your students."
        action={<button className="btn-primary" onClick={openCreate}><Plus size={16} /> New quiz</button>}
      />

      <DataTable
        emptyTitle="No quizzes yet"
        rows={rows}
        columns={[
          { key: "title", header: "Title" },
          { key: "standard", header: "Std", render: (r) => <Badge tone="brand">Std {r.standard}</Badge> },
          { key: "duration", header: "Duration", render: (r) => `${r.duration}m` },
          { key: "total_marks", header: "Total marks" },
          {
            key: "actions",
            header: "",
            render: (r) => (
              <div className="flex items-center gap-1.5">
                <Link to={`/teacher/quizzes/${r.id}/results`} className="btn-ghost btn-sm"><BarChart3 size={13} /> Results</Link>
                <button className="btn-ghost btn-sm" onClick={() => openEdit(r)}><Pencil size={13} /></button>
                <button className="btn-ghost btn-sm text-coral hover:bg-coral-light" onClick={() => remove(r)}><Trash2 size={13} /></button>
              </div>
            ),
          },
        ]}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit quiz" : "New quiz"} width="max-w-2xl">
        <form onSubmit={save} className="space-y-5">
          <div>
            <label className="label">Title</label>
            <input required className="input" value={form.title} onChange={update("title")} />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input min-h-16" value={form.description} onChange={update("description")} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="label">Standard</label>
              <select className="input" value={form.standard} onChange={update("standard")}>
                {["6", "7", "8", "9", "10"].map((s) => <option key={s} value={s}>Std {s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Category</label>
              <input className="input" value={form.category} onChange={update("category")} placeholder="e.g. Loops" />
            </div>
            <div>
              <label className="label">Duration (min)</label>
              <input type="number" className="input" value={form.duration} onChange={update("duration")} />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="label mb-0">Questions</label>
              <button type="button" onClick={addQ} className="btn-secondary btn-sm"><Plus size={13} /> Add question</button>
            </div>
            <div className="space-y-4">
              {form.questions.map((q, i) => (
                <div key={i} className="rounded-xl border border-ink/10 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-mono text-xs text-slate-muted">Q{i + 1}</span>
                    {form.questions.length > 1 && (
                      <button type="button" onClick={() => removeQ(i)} className="text-coral hover:text-coral-dark"><X size={14} /></button>
                    )}
                  </div>
                  <input required placeholder="Question" className="input mb-2" value={q.question} onChange={updateQ(i, "question")} />
                  <div className="grid grid-cols-2 gap-2">
                    {["a", "b", "c", "d"].map((opt) => (
                      <input key={opt} required placeholder={`Option ${opt.toUpperCase()}`} className="input" value={q[`option_${opt}`]} onChange={updateQ(i, `option_${opt}`)} />
                    ))}
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <select className="input" value={q.correct_answer} onChange={updateQ(i, "correct_answer")}>
                      {["a", "b", "c", "d"].map((opt) => <option key={opt} value={opt}>Correct: {opt.toUpperCase()}</option>)}
                    </select>
                    <input type="number" className="input" placeholder="Marks" value={q.marks} onChange={updateQ(i, "marks")} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && <p className="rounded-lg bg-coral-light px-3.5 py-2.5 text-xs font-medium text-coral-dark">{error}</p>}

          <button className="btn-primary w-full" disabled={saving}>
            {saving ? "Saving..." : editing ? "Save changes" : "Create quiz"}
          </button>
        </form>
      </Modal>
    </div>
  );
}

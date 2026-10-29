import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Users2, ClipboardList } from "lucide-react";
import api from "../../api/axios.js";
import { ENDPOINTS } from "../../api/endpoints.js";
import PageHeader from "../../components/shared/PageHeader.jsx";
import Loader from "../../components/ui/Loader.jsx";
import DataTable from "../../components/ui/DataTable.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Modal from "../../components/ui/Modal.jsx";

const EMPTY = {
  title: "",
  description: "",
  standard: "6",
  language: "python",
  categoryId: "",
  difficulty: "easy",
  starter_code: "",
  solution_code: "",
  expected_output: "",
  hints: "",
  testCases: "[]",
  marks: 10,
};

const diffTone = { easy: "mint", medium: "amber", hard: "coral" };

export default function TeacherAssignments() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    api
      .get(ENDPOINTS.assignments)
      .then((res) => setRows(res.data?.assignments || res.data?.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    setError("");
    setModalOpen(true);
  };

  const openEdit = (a) => {
    setEditing(a);
    setForm({
      title: a.title || "",
      description: a.description || "",
      standard: String(a.standard || "6"),
      language: a.language || "python",
      categoryId: a.category || "",
      difficulty: a.difficulty || "easy",
      starter_code: a.starter_code || "",
      solution_code: a.solution_code || "",
      expected_output: a.expected_output || "",
      hints: (() => { try { return JSON.parse(a.hints || "[]").join(", "); } catch { return ""; } })(),
      testCases: a.test_cases || "[]",
      marks: a.marks || 10,
    });
    setError("");
    setModalOpen(true);
  };

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      let testCases;
      try {
        testCases = JSON.parse(form.testCases || "[]");
      } catch {
        throw new Error("Test cases must be valid JSON, e.g. [{\"input\":\"\",\"output\":\"\"}]");
      }
      const payload = {
        ...form,
        hints: form.hints.split(",").map((h) => h.trim()).filter(Boolean),
        testCases,
      };
      if (editing) {
        await api.put(ENDPOINTS.assignment(editing.id), payload);
      } else {
        await api.post(ENDPOINTS.assignments, payload);
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err?.message || err?.response?.data?.message || "Couldn't save assignment.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (a) => {
    if (!confirm(`Delete "${a.title}"?`)) return;
    await api.delete(ENDPOINTS.assignment(a.id));
    load();
  };

  if (loading) return <Loader label="Loading assignments" />;

  return (
    <div>
      <PageHeader
        eyebrow="teacher/assignments"
        title="Assignments"
        subtitle="Create and manage coding assignments for your students."
        action={<button className="btn-primary" onClick={openCreate}><Plus size={16} /> New assignment</button>}
      />

      <DataTable
        emptyTitle="No assignments yet"
        emptySubtitle="Create your first assignment to get students building."
        rows={rows}
        columns={[
          { key: "title", header: "Title" },
          { key: "standard", header: "Std", render: (r) => <Badge tone="brand">Std {r.standard}</Badge> },
          { key: "difficulty", header: "Difficulty", render: (r) => <Badge tone={diffTone[r.difficulty?.toLowerCase()] || "neutral"}>{r.difficulty}</Badge> },
          { key: "language", header: "Language" },
          { key: "marks", header: "Marks" },
          {
            key: "actions",
            header: "",
            render: (r) => (
              <div className="flex items-center gap-1.5">
                <Link to={`/teacher/assignments/${r.id}/attempts`} className="btn-ghost btn-sm"><Users2 size={13} /> Attempts</Link>
                <button className="btn-ghost btn-sm" onClick={() => openEdit(r)}><Pencil size={13} /></button>
                <button className="btn-ghost btn-sm text-coral hover:bg-coral-light" onClick={() => remove(r)}><Trash2 size={13} /></button>
              </div>
            ),
          },
        ]}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit assignment" : "New assignment"} width="max-w-2xl">
        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="label">Title</label>
            <input required className="input" value={form.title} onChange={update("title")} />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea required className="input min-h-20" value={form.description} onChange={update("description")} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="label">Standard</label>
              <select className="input" value={form.standard} onChange={update("standard")}>
                {["6", "7", "8", "9", "10"].map((s) => <option key={s} value={s}>Std {s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Language</label>
              <select className="input" value={form.language} onChange={update("language")}>
                {["python", "javascript", "java", "c", "cpp"].map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Difficulty</label>
              <select className="input" value={form.difficulty} onChange={update("difficulty")}>
                {["easy", "medium", "hard"].map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Marks</label>
              <input type="number" className="input" value={form.marks} onChange={update("marks")} />
            </div>
            <div>
              <label className="label">Category ID (optional)</label>
              <input className="input" value={form.categoryId} onChange={update("categoryId")} placeholder="e.g. 1" />
            </div>
          </div>

          <div>
            <label className="label">Starter code</label>
            <textarea className="input min-h-24 font-mono text-xs" value={form.starter_code} onChange={update("starter_code")} />
          </div>
          <div>
            <label className="label">Solution code (not shown to students)</label>
            <textarea className="input min-h-24 font-mono text-xs" value={form.solution_code} onChange={update("solution_code")} />
          </div>
          <div>
            <label className="label">Expected output</label>
            <textarea className="input min-h-16 font-mono text-xs" value={form.expected_output} onChange={update("expected_output")} />
          </div>
          <div>
            <label className="label">Hints (comma separated)</label>
            <input className="input" value={form.hints} onChange={update("hints")} placeholder="Think about loops, Try edge cases" />
          </div>
          <div>
            <label className="label">Test cases (JSON array)</label>
            <textarea className="input min-h-16 font-mono text-xs" value={form.testCases} onChange={update("testCases")} />
          </div>

          {error && <p className="rounded-lg bg-coral-light px-3.5 py-2.5 text-xs font-medium text-coral-dark">{error}</p>}

          <button className="btn-primary w-full" disabled={saving}>
            {saving ? "Saving..." : editing ? "Save changes" : "Create assignment"}
          </button>
        </form>
      </Modal>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, UserCog } from "lucide-react";
import api from "../../api/axios.js";
import { ENDPOINTS } from "../../api/endpoints.js";
import { useAuth } from "../../context/AuthContext.jsx";
import PageHeader from "../../components/shared/PageHeader.jsx";
import Loader from "../../components/ui/Loader.jsx";
import DataTable from "../../components/ui/DataTable.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Modal from "../../components/ui/Modal.jsx";

const EMPTY = { name: "", email: "", phone: "", standard: "6", course: "" };
const EMPTY_ASSIGN = { teacher_id: "", batch_name: "" };

export default function AdminStudents() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [assignTarget, setAssignTarget] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [assignForm, setAssignForm] = useState(EMPTY_ASSIGN);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    Promise.all([api.get(ENDPOINTS.students), api.get(ENDPOINTS.teachers)])
      .then(([s, t]) => {
        setRows(s.data?.students || []);
        setTeachers((t.data?.data || []).filter((tt) => tt.status === "APPROVED"));
      })
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const create = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.post(ENDPOINTS.createStudent, form);
      setCreateOpen(false);
      setForm(EMPTY);
      load();
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't add student.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (s) => {
    if (!confirm(`Delete "${s.name}"?`)) return;
    await api.delete(ENDPOINTS.deleteStudent(s.id));
    load();
  };

  const openAssign = (s) => {
    setAssignTarget(s);
    setAssignForm({ teacher_id: s.teacher_id || "", batch_name: s.batch_name || "" });
    setError("");
  };

  const saveAssign = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.put(ENDPOINTS.assignStudent(assignTarget.id), { ...assignForm, assigned_by: user.id });
      setAssignTarget(null);
      load();
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't assign student.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader label="Loading students" />;

  return (
    <div>
      <PageHeader
        eyebrow="admin/students"
        title="Students"
        subtitle="Manage every student and assign them to a teacher's batch."
        action={<button className="btn-primary" onClick={() => { setForm(EMPTY); setError(""); setCreateOpen(true); }}><Plus size={16} /> Add student</button>}
      />

      <p className="mb-4 rounded-lg bg-brand-light px-3.5 py-2.5 text-xs font-medium text-brand">
        Note: this list manages the standalone <code>students</code> registration table. Actual login accounts for
        students live in the <code>users</code> table (created via sign-up) — the two aren't linked yet on the backend.
      </p>

      <DataTable
        emptyTitle="No students yet"
        rows={rows}
        columns={[
          { key: "name", header: "Name" },
          { key: "email", header: "Email" },
          { key: "standard", header: "Std", render: (r) => <Badge tone="brand">Std {r.standard}</Badge> },
          { key: "course", header: "Course" },
          { key: "status", header: "Status", render: (r) => <Badge tone={r.status === "Active" ? "mint" : "neutral"}>{r.status}</Badge> },
          {
            key: "teacher",
            header: "Assigned",
            render: (r) =>
              r.teacher_id ? (
                <Badge tone="amber">{r.batch_name || "Batch set"}</Badge>
              ) : (
                <Badge tone="coral">Unassigned</Badge>
              ),
          },
          {
            key: "actions",
            header: "",
            render: (r) => (
              <div className="flex items-center gap-1.5">
                <button className="btn-ghost btn-sm" onClick={() => openAssign(r)}><UserCog size={13} /> Assign</button>
                <button className="btn-ghost btn-sm text-coral hover:bg-coral-light" onClick={() => remove(r)}><Trash2 size={13} /></button>
              </div>
            ),
          },
        ]}
      />

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Add student">
        <form onSubmit={create} className="space-y-4">
          <div><label className="label">Name</label><input required className="input" value={form.name} onChange={update("name")} /></div>
          <div><label className="label">Email</label><input type="email" required className="input" value={form.email} onChange={update("email")} /></div>
          <div><label className="label">Phone</label><input required className="input" value={form.phone} onChange={update("phone")} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Standard</label>
              <select className="input" value={form.standard} onChange={update("standard")}>
                {["6", "7", "8", "9", "10"].map((s) => <option key={s} value={s}>Std {s}</option>)}
              </select>
            </div>
            <div><label className="label">Course</label><input required className="input" value={form.course} onChange={update("course")} /></div>
          </div>
          {error && <p className="rounded-lg bg-coral-light px-3.5 py-2.5 text-xs font-medium text-coral-dark">{error}</p>}
          <button className="btn-primary w-full" disabled={saving}>{saving ? "Saving..." : "Add student"}</button>
        </form>
      </Modal>

      <Modal open={!!assignTarget} onClose={() => setAssignTarget(null)} title={`Assign ${assignTarget?.name || ""}`}>
        <form onSubmit={saveAssign} className="space-y-4">
          <div>
            <label className="label">Teacher</label>
            <select required className="input" value={assignForm.teacher_id} onChange={(e) => setAssignForm((f) => ({ ...f, teacher_id: e.target.value }))}>
              <option value="">Select a teacher</option>
              {teachers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Batch name</label>
            <input required className="input" value={assignForm.batch_name} onChange={(e) => setAssignForm((f) => ({ ...f, batch_name: e.target.value }))} placeholder="e.g. Morning Batch A" />
          </div>
          {error && <p className="rounded-lg bg-coral-light px-3.5 py-2.5 text-xs font-medium text-coral-dark">{error}</p>}
          <button className="btn-primary w-full" disabled={saving}>{saving ? "Saving..." : "Assign student"}</button>
        </form>
      </Modal>
    </div>
  );
}

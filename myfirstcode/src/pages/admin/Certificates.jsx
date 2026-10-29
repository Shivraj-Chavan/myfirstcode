import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import api from "../../api/axios.js";
import { ENDPOINTS } from "../../api/endpoints.js";
import PageHeader from "../../components/shared/PageHeader.jsx";
import Loader from "../../components/ui/Loader.jsx";
import DataTable from "../../components/ui/DataTable.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Modal from "../../components/ui/Modal.jsx";

const TYPES = ["Course Completion", "Assignment Excellence", "Quiz Champion", "Perfect Attendance", "Coding Star"];
const GRADES = ["A+", "A", "B+", "B", "C"];
const EMPTY = { student: "", studentId: "", std: "", teacher: "", course: "", type: TYPES[0], grade: "A", status: "Active", message: "" };

export default function AdminCertificates() {
  const [rows, setRows] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    Promise.all([api.get(ENDPOINTS.certificates), api.get(ENDPOINTS.students), api.get(ENDPOINTS.teachers)])
      .then(([c, s, t]) => {
        setRows(c.data?.certificates || []);
        setStudents(s.data?.students || []);
        setTeachers((t.data?.data || []).filter((tt) => tt.status === "APPROVED"));
      })
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setError(""); setModalOpen(true); };
  const openEdit = (c) => {
    setEditing(c);
    setForm({
      student: c.student, studentId: c.studentId, std: c.std || "", teacher: c.teacher || "",
      course: c.course, type: c.type, grade: c.grade, status: c.status || "Active", message: c.message || "",
    });
    setError("");
    setModalOpen(true);
  };

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const pickStudent = (e) => {
    const s = students.find((st) => String(st.id) === e.target.value);
    setForm((f) => ({ ...f, studentId: s?.id || "", student: s?.name || "", std: s?.standard || "" }));
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editing) await api.put(ENDPOINTS.updateCertificate(editing.id), form);
      else await api.post(ENDPOINTS.issueCertificate, form);
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't save certificate.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (c) => {
    if (!confirm(`Delete certificate for "${c.student}"?`)) return;
    await api.delete(ENDPOINTS.deleteCertificate(c.id));
    load();
  };

  if (loading) return <Loader label="Loading certificates" />;

  return (
    <div>
      <PageHeader
        eyebrow="admin/certificates"
        title="Certificates"
        subtitle="Issue certificates to any student, on behalf of any teacher."
        action={<button className="btn-primary" onClick={openCreate}><Plus size={16} /> Issue certificate</button>}
      />

      <DataTable
        emptyTitle="No certificates issued yet"
        rows={rows}
        columns={[
          { key: "student", header: "Student" },
          { key: "teacher", header: "Teacher", render: (r) => r.teacher || "—" },
          { key: "course", header: "Course" },
          { key: "type", header: "Type" },
          { key: "grade", header: "Grade", render: (r) => <Badge tone="amber">{r.grade}</Badge> },
          { key: "status", header: "Status", render: (r) => <Badge tone={r.status === "Active" ? "mint" : "neutral"}>{r.status}</Badge> },
          {
            key: "actions",
            header: "",
            render: (r) => (
              <div className="flex items-center gap-1.5">
                <button className="btn-ghost btn-sm" onClick={() => openEdit(r)}><Pencil size={13} /></button>
                <button className="btn-ghost btn-sm text-coral hover:bg-coral-light" onClick={() => remove(r)}><Trash2 size={13} /></button>
              </div>
            ),
          },
        ]}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit certificate" : "Issue certificate"}>
        <form onSubmit={save} className="space-y-4">
          {!editing && (
            <div>
              <label className="label">Student</label>
              <select required className="input" value={form.studentId} onChange={pickStudent}>
                <option value="">Select a student</option>
                {students.map((s) => <option key={s.id} value={s.id}>{s.name} (Std {s.standard})</option>)}
              </select>
            </div>
          )}
          <div>
            <label className="label">Teacher (credited on certificate)</label>
            <select className="input" value={form.teacher} onChange={update("teacher")}>
              <option value="">— Admin issued —</option>
              {teachers.map((t) => <option key={t.id} value={t.name}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Course</label>
            <input required className="input" value={form.course} onChange={update("course")} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Type</label>
              <select className="input" value={form.type} onChange={update("type")}>
                {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Grade</label>
              <select className="input" value={form.grade} onChange={update("grade")}>
                {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Message (optional)</label>
            <textarea className="input min-h-20" value={form.message} onChange={update("message")} />
          </div>
          <div>
            <label className="label">Status</label>
            <select className="input" value={form.status} onChange={update("status")}>
              <option value="Active">Active</option>
              <option value="Revoked">Revoked</option>
            </select>
          </div>

          {error && <p className="rounded-lg bg-coral-light px-3.5 py-2.5 text-xs font-medium text-coral-dark">{error}</p>}

          <button className="btn-primary w-full" disabled={saving}>
            {saving ? "Saving..." : editing ? "Save changes" : "Issue certificate"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
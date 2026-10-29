import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, CalendarDays, Video } from "lucide-react";
import api from "../../api/axios.js";
import { ENDPOINTS } from "../../api/endpoints.js";
import PageHeader from "../../components/shared/PageHeader.jsx";
import Loader from "../../components/ui/Loader.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Modal from "../../components/ui/Modal.jsx";

const TYPES = ["LIVE_CLASS", "RECORDED_SESSION", "ASSIGNMENT", "QUIZ", "EXAM", "PARENT_MEETING", "NOTICE"];
const STANDARDS = ["6", "7", "8", "9", "10"];
const toLocalInput = (v) => (v ? new Date(v).toISOString().slice(0, 16) : "");
const EMPTY = { title: "", description: "", event_type: "LIVE_CLASS", standard: "6", start_datetime: "", end_datetime: "", meeting_link: "", recording_url: "", visibility: "ALL" };

export default function TeacherCalendar() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    api.get(ENDPOINTS.events).then((res) => setRows(res.data?.data || [])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setError(""); setModalOpen(true); };
const openEdit = (ev) => {
    setEditing(ev);
    setForm({
      title: ev.title,
      description: ev.description || "",
      event_type: ev.event_type || "LIVE_CLASS",
      standard: String(ev.standard || "6"),
      start_datetime: toLocalInput(ev.start_datetime),
      end_datetime: toLocalInput(ev.end_datetime),
      meeting_link: ev.meeting_link || "",
      recording_url: ev.recording_url || "",
      visibility: ev.visibility || "ALL",
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
      if (editing) await api.put(ENDPOINTS.updateEvent(editing.id), form);
      else await api.post(ENDPOINTS.createEvent, form);
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't save event.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (ev) => {
    if (!confirm(`Delete "${ev.title}"?`)) return;
    await api.delete(ENDPOINTS.deleteEvent(ev.id));
    load();
  };

  if (loading) return <Loader label="Loading calendar" />;

  return (
    <div>
      <PageHeader
        eyebrow="teacher/calendar"
        title="Calendar"
        subtitle="Schedule live classes, exams and notices."
        action={<button className="btn-primary" onClick={openCreate}><Plus size={16} /> New event</button>}
      />

      {rows.length === 0 ? (
        <EmptyState icon={CalendarDays} title="No events yet" subtitle="Schedule your first live class or exam." />
      ) : (
        <div className="space-y-3">
          {rows.map((ev) => (
            <div key={ev.id} className="card flex flex-wrap items-center gap-4 p-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-light text-brand"><CalendarDays size={18} /></div>
       <div className="min-w-0 flex-1">
                <p className="font-semibold text-ink">{ev.title}</p>
                <p className="text-xs text-slate-muted">{new Date(ev.start_datetime).toLocaleString()} → {new Date(ev.end_datetime).toLocaleString()}</p>
              </div>
              <Badge tone="brand">{ev.event_type}  ·  Std {ev.standard}</Badge>
              <Badge tone={ev.status === "COMPLETED" ? "mint" : ev.status === "CANCELLED" ? "coral" : "amber"}>{ev.status}</Badge>
              {ev.meeting_link && <a href={ev.meeting_link} target="_blank" rel="noreferrer" className="btn-ghost btn-sm"><Video size={13} /></a>}
              <button className="btn-ghost btn-sm" onClick={() => openEdit(ev)}><Pencil size={13} /></button>
              <button className="btn-ghost btn-sm text-coral hover:bg-coral-light" onClick={() => remove(ev)}><Trash2 size={13} /></button>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit event" : "New event"}>
        <form onSubmit={save} className="space-y-4">
      <div>
            <label className="label">Title</label>
            <input required className="input" value={form.title} onChange={update("title")} />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input min-h-16" value={form.description} onChange={update("description")} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Type</label>
              <select className="input" value={form.event_type} onChange={update("event_type")}>
                {TYPES.map((t) => <option key={t} value={t}>{t.replace("_", " ")}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Standard</label>
              <select className="input" value={form.standard} onChange={update("standard")}>
                {STANDARDS.map((s) => <option key={s} value={s}>Std {s}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Starts</label>
              <input type="datetime-local" required className="input" value={form.start_datetime} onChange={update("start_datetime")} />
            </div>
            <div>
              <label className="label">Ends</label>
              <input type="datetime-local" required className="input" value={form.end_datetime} onChange={update("end_datetime")} />
            </div>
          </div>
          <div>
            <label className="label">Meeting link (optional)</label>
            <input className="input" value={form.meeting_link} onChange={update("meeting_link")} placeholder="https://meet.google.com/..." />
          </div>
          <div>
            <label className="label">Recording URL (optional)</label>
            <input className="input" value={form.recording_url} onChange={update("recording_url")} />
          </div>

          {error && <p className="rounded-lg bg-coral-light px-3.5 py-2.5 text-xs font-medium text-coral-dark">{error}</p>}

          <button className="btn-primary w-full" disabled={saving}>{saving ? "Saving..." : "Save event"}</button>
        </form>
   </Modal>
  </div>
  );
}

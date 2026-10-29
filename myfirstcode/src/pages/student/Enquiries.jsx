import { useEffect, useState } from "react";
import { MessageCircle, Send, CheckCircle2, Clock3 } from "lucide-react";
import api from "../../api/axios.js";
import { ENDPOINTS } from "../../api/endpoints.js";
import PageHeader from "../../components/shared/PageHeader.jsx";
import Loader from "../../components/ui/Loader.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Badge from "../../components/ui/Badge.jsx";

const EMPTY = { teacher_id: "", subject: "", message: "" };

export default function StudentEnquiries() {
  const [rows, setRows] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    Promise.all([api.get(ENDPOINTS.studentEnquiries), api.get(ENDPOINTS.teachers)])
      .then(([e, t]) => {
        setRows(e.data?.enquiries || []);
        setTeachers((t.data?.data || []).filter((tt) => tt.status === "APPROVED"));
      })
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      await api.post(ENDPOINTS.sendEnquiry, form);
      setForm(EMPTY);
      load();
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't send enquiry.");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <Loader label="Loading enquiries" />;

  return (
    <div>
      <PageHeader eyebrow="student/enquiries" title="Ask a Teacher" subtitle="Send a question straight to your teacher." />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <form onSubmit={submit} className="card h-fit space-y-4 p-5">
          <p className="eyebrow mb-0">new enquiry</p>
          <div>
            <label className="label">Teacher</label>
            <select required className="input" value={form.teacher_id} onChange={update("teacher_id")}>
              <option value="">Select a teacher</option>
              {teachers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Subject</label>
            <input required className="input" value={form.subject} onChange={update("subject")} placeholder="Question about..." />
          </div>
          <div>
            <label className="label">Message</label>
            <textarea required className="input min-h-28" value={form.message} onChange={update("message")} />
          </div>
          {error && <p className="rounded-lg bg-coral-light px-3.5 py-2.5 text-xs font-medium text-coral-dark">{error}</p>}
          <button className="btn-primary w-full" disabled={sending}>
            {sending ? "Sending..." : "Send enquiry"} <Send size={14} />
          </button>
        </form>

        <div>
          <p className="eyebrow mb-3">your enquiries</p>
          {rows.length === 0 ? (
            <EmptyState icon={MessageCircle} title="No enquiries yet" subtitle="Ask your teacher a question using the form." />
          ) : (
            <div className="space-y-3">
              {rows.map((r) => (
                <div key={r.id} className="card p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="font-semibold text-ink">{r.subject}</p>
                    <Badge tone={r.status === "replied" ? "mint" : "amber"}>
                      {r.status === "replied" ? <CheckCircle2 size={12} className="mr-1 inline" /> : <Clock3 size={12} className="mr-1 inline" />}
                      {r.status === "replied" ? "Replied" : "Pending"}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-muted">to {r.teacherName}</p>
                  <p className="mt-2 text-sm text-ink/80">{r.message}</p>
                  {r.reply && (
                    <div className="mt-3 rounded-lg bg-brand-light p-3 text-sm text-brand">
                      <p className="mb-1 font-mono text-[10px] uppercase tracking-wide text-brand/70">Teacher's reply</p>
                      {r.reply}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
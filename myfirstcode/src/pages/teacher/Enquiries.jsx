import { useEffect, useState } from "react";
import { MessageCircle, CheckCircle2, Clock3, Reply } from "lucide-react";
import api from "../../api/axios.js";
import { ENDPOINTS } from "../../api/endpoints.js";
import PageHeader from "../../components/shared/PageHeader.jsx";
import Loader from "../../components/ui/Loader.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Modal from "../../components/ui/Modal.jsx";

export default function TeacherEnquiries() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);
  const [reply, setReply] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    api.get(ENDPOINTS.teacherEnquiries).then((res) => setRows(res.data?.enquiries || [])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openReply = (r) => {
    setActive(r);
    setReply(r.reply || "");
    setError("");
  };

  const submitReply = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.put(ENDPOINTS.replyEnquiry(active.id), { reply });
      setActive(null);
      load();
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't send reply.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader label="Loading enquiries" />;

  const pending = rows.filter((r) => r.status !== "replied").length;

  return (
    <div>
      <PageHeader eyebrow="teacher/enquiries" title="Enquiries" subtitle={`${pending} question${pending === 1 ? "" : "s"} waiting on a reply.`} />

      {rows.length === 0 ? (
        <EmptyState icon={MessageCircle} title="No enquiries yet" subtitle="Questions from your students will show up here." />
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.id} className="card p-4">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-ink">{r.subject}</p>
                  <p className="text-xs text-slate-muted">from {r.studentName}</p>
                </div>
                <Badge tone={r.status === "replied" ? "mint" : "amber"}>
                  {r.status === "replied" ? <CheckCircle2 size={12} className="mr-1 inline" /> : <Clock3 size={12} className="mr-1 inline" />}
                  {r.status === "replied" ? "Replied" : "Pending"}
                </Badge>
              </div>
              <p className="text-sm text-ink/80">{r.message}</p>
              {r.reply && (
                <div className="mt-3 rounded-lg bg-brand-light p-3 text-sm text-brand">
                  <p className="mb-1 font-mono text-[10px] uppercase tracking-wide text-brand/70">Your reply</p>
                  {r.reply}
                </div>
              )}
              <button className="btn-ghost btn-sm mt-3" onClick={() => openReply(r)}>
                <Reply size={13} /> {r.reply ? "Edit reply" : "Reply"}
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!active} onClose={() => setActive(null)} title={`Reply to ${active?.studentName || ""}`}>
        <form onSubmit={submitReply} className="space-y-4">
          <div className="rounded-lg bg-ink/[0.03] p-3 text-sm text-slate-muted">{active?.message}</div>
          <div>
            <label className="label">Your reply</label>
            <textarea required className="input min-h-28" value={reply} onChange={(e) => setReply(e.target.value)} />
          </div>
          {error && <p className="rounded-lg bg-coral-light px-3.5 py-2.5 text-xs font-medium text-coral-dark">{error}</p>}
          <button className="btn-primary w-full" disabled={saving}>{saving ? "Sending..." : "Send reply"}</button>
        </form>
      </Modal>
    </div>
  );
}
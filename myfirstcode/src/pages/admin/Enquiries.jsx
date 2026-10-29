import { useEffect, useState } from "react";
import { MessageCircle, CheckCircle2, Clock3 } from "lucide-react";
import api from "../../api/axios.js";
import { ENDPOINTS } from "../../api/endpoints.js";
import PageHeader from "../../components/shared/PageHeader.jsx";
import Loader from "../../components/ui/Loader.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Badge from "../../components/ui/Badge.jsx";

export default function AdminEnquiries() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(ENDPOINTS.allEnquiries).then((res) => setRows(res.data?.enquiries || [])).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading enquiries" />;

  const pending = rows.filter((r) => r.status !== "replied").length;

  return (
    <div>
      <PageHeader eyebrow="admin/enquiries" title="Enquiries" subtitle={`${pending} question${pending === 1 ? "" : "s"} across all students, waiting on a reply.`} />

      {rows.length === 0 ? (
        <EmptyState icon={MessageCircle} title="No enquiries yet" />
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.id} className="card p-4">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-ink">{r.subject}</p>
                  <p className="text-xs text-slate-muted">{r.studentName} → {r.teacherName}</p>
                </div>
                <Badge tone={r.status === "replied" ? "mint" : "amber"}>
                  {r.status === "replied" ? <CheckCircle2 size={12} className="mr-1 inline" /> : <Clock3 size={12} className="mr-1 inline" />}
                  {r.status === "replied" ? "Replied" : "Pending"}
                </Badge>
              </div>
              <p className="text-sm text-ink/80">{r.message}</p>
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
  );
}
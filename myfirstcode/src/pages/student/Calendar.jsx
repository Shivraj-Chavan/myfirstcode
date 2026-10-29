import { useEffect, useState } from "react";
import { CalendarDays, Video, Link as LinkIcon } from "lucide-react";
import api from "../../api/axios.js";
import { ENDPOINTS } from "../../api/endpoints.js";
import { useAuth } from "../../context/AuthContext.jsx";
import PageHeader from "../../components/shared/PageHeader.jsx";
import Loader from "../../components/ui/Loader.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Badge from "../../components/ui/Badge.jsx";

export default function StudentCalendar() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(ENDPOINTS.eventsByStandard(user.standard))
      .then((res) => setRows(res.data?.data || []))
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, [user.standard]);

  if (loading) return <Loader label="Loading calendar" />;

  return (
    <div>
      <PageHeader eyebrow="student/calendar" title="Calendar" subtitle="Live classes, exams and notices from your teachers." />

      {rows.length === 0 ? (
      <EmptyState
          icon={CalendarDays}
          title="No events yet"
          subtitle="Your teacher hasn't scheduled anything for your standard yet."
        />
      ) : (
        <div className="space-y-3">
          {rows.map((ev) => (
            <div key={ev.id} className="card flex items-center gap-4 p-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-light text-brand">
                <CalendarDays size={18} />
              </div>
             <div className="min-w-0 flex-1">
                <p className="font-semibold text-ink">{ev.title}</p>
                {ev.description && <p className="text-xs text-slate-muted">{ev.description}</p>}
                <p className="text-xs text-slate-muted">{new Date(ev.start_datetime).toLocaleString()}</p>
              </div>
              <Badge tone="brand">{ev.event_type}</Badge>
              <Badge tone={ev.status === "COMPLETED" ? "mint" : ev.status === "CANCELLED" ? "coral" : "amber"}>{ev.status}</Badge>
              {ev.meeting_link && (
                <a href={ev.meeting_link} target="_blank" rel="noreferrer" className="btn-secondary btn-sm">
                  <Video size={13} /> Join
                </a>
              )}
              {ev.recording_url && (
                <a href={ev.recording_url} target="_blank" rel="noreferrer" className="btn-ghost btn-sm">
                  <LinkIcon size={13} /> Recording
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { Award, Sparkles, X } from "lucide-react";
import api from "../../api/axios.js";
import { ENDPOINTS } from "../../api/endpoints.js";
import { useAuth } from "../../context/AuthContext.jsx";
import PageHeader from "../../components/shared/PageHeader.jsx";
import Loader from "../../components/ui/Loader.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Confetti from "../../components/shared/Confetti.jsx";

export default function StudentCertificates() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);

  useEffect(() => {
    api
      .get(ENDPOINTS.studentCertificates(user.id))
      .then((res) => setRows(res.data?.certificates || []))
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, [user.id]);

  if (loading) return <Loader label="Loading certificates" />;

  return (
    <div>
      <PageHeader eyebrow="student/certificates" title="Certificates" subtitle="Achievements your teacher has awarded you." />

      {rows.length === 0 ? (
        <EmptyState icon={Award} title="No certificates yet" subtitle="Keep learning — your first certificate will show up here." />
      ) : (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((c) => (
            <button key={c.id} onClick={() => setActive(c)} className="card overflow-hidden text-left transition-all hover:-translate-y-0.5 hover:shadow-pop">
              <div className="flex items-center justify-between bg-gradient-to-br from-brand to-brand-dark p-4 text-white">
                <Sparkles size={20} />
                <Badge tone="amber">{c.grade}</Badge>
              </div>
              <div className="p-4">
                <p className="font-mono text-[11px] uppercase tracking-wide text-brand">{c.type}</p>
                <h3 className="mt-1 font-display font-bold text-ink">{c.course}</h3>
                {c.message && <p className="mt-1 text-sm text-slate-muted">{c.message}</p>}
                <div className="mt-3 flex items-center justify-between text-xs text-slate-muted">
                  <span>{c.teacher ? `by ${c.teacher}` : ""}</span>
                  <Badge tone={c.status === "Active" ? "mint" : "neutral"}>{c.status}</Badge>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

    {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={() => setActive(null)} />

          {/* Full-screen confetti layer — sits above the backdrop, spans the whole viewport
              so pieces genuinely fall from the top of the screen, not just the card's edge. */}
          <div className="pointer-events-none fixed inset-0 z-10">
            <Confetti />
          </div>

          <div className="relative z-20 w-full max-w-xl">
            <button
              onClick={() => setActive(null)}
              className="absolute -top-3 -right-3 z-20 grid h-9 w-9 place-items-center rounded-full bg-white text-ink shadow-card hover:bg-ink/5"
            >
              <X size={18} />
            </button>

            <div className="relative overflow-hidden rounded-2xl border-[3px] border-amber bg-white p-1 shadow-pop">
              <div className="rounded-xl border-2 border-dashed border-amber/50 bg-gradient-to-br from-brand-light via-white to-amber-light px-8 py-10 text-center">
                <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-amber text-white shadow-pop">
                  <Award size={26} />
                </div>

                <p className="eyebrow justify-center">certificate of achievement</p>
                <h2 className="mt-2 font-display text-3xl font-bold text-ink">{active.student}</h2>
                <p className="mt-1 text-sm text-slate-muted">has successfully earned</p>

                <h3 className="mt-3 font-display text-xl font-bold text-brand">{active.course}</h3>
                <p className="mt-1 font-mono text-xs uppercase tracking-wide text-slate-muted">{active.type}</p>

                {active.message && <p className="mx-auto mt-4 max-w-sm text-sm italic text-ink/70">"{active.message}"</p>}

                <div className="mx-auto mt-6 flex max-w-xs items-center justify-between border-t border-ink/10 pt-4 text-left">
                  <div>
                    <p className="font-display text-sm font-bold text-ink">{active.teacher || "myFirstCode"}</p>
                    <p className="font-mono text-[10px] uppercase tracking-wide text-slate-muted">Instructor</p>
                  </div>
                  <Badge tone="amber">Grade {active.grade}</Badge>
                </div>

                <p className="mt-5 font-mono text-[10px] text-slate-faint">{active.certificateId}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
   
import { useEffect, useState } from "react";
import { Users, Eye } from "lucide-react";
import api from "../../api/axios.js";
import { ENDPOINTS } from "../../api/endpoints.js";
import { useAuth } from "../../context/AuthContext.jsx";
import PageHeader from "../../components/shared/PageHeader.jsx";
import Loader from "../../components/ui/Loader.jsx";
import DataTable from "../../components/ui/DataTable.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Modal from "../../components/ui/Modal.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";

export default function TeacherStudents() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);
  const [progress, setProgress] = useState(null);
  const [progressLoading, setProgressLoading] = useState(false);
  const [assignedIds, setAssignedIds] = useState([]);
  useEffect(() => {
    const loadStudents = async () => {
      try {
        console.log("1. logged-in user:", user);
        console.log("2. user.id:", user?.id, "| type:", typeof user?.id);
  
        const res = await api.get(ENDPOINTS.students);
        console.log("3. RAW response:", res.data);
  
        const all = res.data?.students || [];
        console.log("4. total students:", all.length);
        console.log("5. first student:", all[0]);
        console.log("6. teacher_ids in data:", all.map((s) => s.teacher_id));
  
        const mine = all.filter((s) => Number(s.teacher_id) === Number(user.id));
        console.log("7. matched to me:", mine.length);
        setAssignedIds([...new Set(all.map((s) => s.teacher_id).filter(Boolean))]);
        setRows(mine);
      } catch (err) {
        console.error("students load failed:", err.response?.status, err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
  
    loadStudents();
  }, [user.id]);

  const openStudent = async (s) => {
    setActive(s);
    setProgressLoading(true);
    setProgress(null);
    try {
      const { data } = await api.get(ENDPOINTS.studentProgress(s.id));
      setProgress(data);
    } catch (err) {
      setProgress({
        loadError: err?.response?.data?.message || "Couldn't load progress.",
        assignments: [],
        quizzes: [],
        levelsCompleted: 0,
      });
    } finally {
      setProgressLoading(false);
    }
  };

  if (loading) return <Loader label="Loading your students" />;

  return (
    <div>
      <PageHeader eyebrow="teacher/students" title="My Students" subtitle="Students assigned to your batch by the admin." />

      <DataTable
        emptyTitle="No students assigned to you yet"
        emptySubtitle={`You're logged in as teacher ID ${user.id}. Students are currently assigned to teacher ID(s): ${assignedIds.join(", ") || "none"}. Ask your admin to assign students to you.`}
        rows={rows}
        columns={[
          { key: "name", header: "Name" },
          { key: "email", header: "Email" },
          { key: "standard", header: "Standard", render: (r) => <Badge tone="brand">Std {r.standard}</Badge> },
          { key: "batch_name", header: "Batch", render: (r) => r.batch_name || "—" },
          { key: "status", header: "Status", render: (r) => <Badge tone={r.status === "Active" ? "mint" : "neutral"}>{r.status}</Badge> },
          {
            key: "actions",
            header: "",
            render: (r) => (
              <button onClick={() => openStudent(r)} className="btn-ghost btn-sm">
                <Eye size={14} /> View progress
              </button>
            ),
          },
        ]}
      />

      <Modal open={!!active} onClose={() => { setActive(null); setProgress(null); }} title={active?.name} width="max-w-2xl">
        {progressLoading ? (
          <Loader label="Loading progress" />
        ) : progress ? (
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-brand-light p-3">
                <p className="font-display text-xl font-bold text-brand">{progress.levelsCompleted}</p>
                <p className="text-xs text-slate-muted">Levels done</p>
              </div>
              <div className="rounded-xl bg-mint-light p-3">
                <p className="font-display text-xl font-bold text-mint-dark">{progress.assignments?.length ?? 0}</p>
                <p className="text-xs text-slate-muted">Assignments</p>
              </div>
              <div className="rounded-xl bg-amber-light p-3">
                <p className="font-display text-xl font-bold text-amber-dark">{progress.quizzes?.length ?? 0}</p>
                <p className="text-xs text-slate-muted">Quizzes</p>
              </div>
            </div>

            {progress.loadError && (
              <p className="rounded-lg bg-coral-light px-3.5 py-2.5 text-xs font-medium text-coral-dark">{progress.loadError}</p>
            )}
            {progress.noLoginAccount && (
              <p className="rounded-lg bg-amber-light px-3.5 py-2.5 text-xs font-medium text-amber-dark">
                No login account matches this student's email yet, so assignment and quiz activity can't be tracked.
              </p>
            )}

            <div>
              <p className="label">Assignments</p>
              {progress.assignments?.length ? (
                <ul className="divide-y divide-ink/5 rounded-xl border border-ink/5">
                  {progress.assignments.map((a, i) => (
                    <li key={i} className="flex items-center justify-between gap-3 px-3.5 py-2.5 text-sm">
                      <div className="min-w-0">
                        <p className="truncate text-ink">{a.title}</p>
                        <p className="text-xs text-slate-muted">
                          {a.attempts} attempt{a.attempts === 1 ? "" : "s"} · last {a.last_attempt ? new Date(a.last_attempt).toLocaleDateString() : "—"}
                        </p>
                      </div>
                      <Badge tone="mint">{a.best_score ?? 0}/{a.total_marks ?? "—"}</Badge>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState title="No assignment activity yet" />
              )}
            </div>

            <div>
              <p className="label">Quizzes</p>
              {progress.quizzes?.length ? (
                <ul className="divide-y divide-ink/5 rounded-xl border border-ink/5">
                  {progress.quizzes.map((q, i) => (
                    <li key={i} className="flex items-center justify-between gap-3 px-3.5 py-2.5 text-sm">
                      <div className="min-w-0">
                        <p className="truncate text-ink">{q.title}</p>
                        <p className="text-xs text-slate-muted">
                          {q.attempts} attempt{q.attempts === 1 ? "" : "s"} · best {q.best_percentage ?? 0}%
                        </p>
                      </div>
                      <Badge tone={Number(q.best_percentage) >= 35 ? "mint" : "coral"}>
                        {q.best_score ?? 0}/{q.total_marks ?? "—"} · {Number(q.best_percentage) >= 35 ? "Passed" : "Failed"}
                      </Badge>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState title="No quiz activity yet" />
              )}
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}

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

  useEffect(() => {
    api
      .get(ENDPOINTS.students)
      .then((res) => {
        const all = res.data?.students || [];
        setRows(all.filter((s) => Number(s.teacher_id) === Number(user.id)));
      })
      .finally(() => setLoading(false));
  }, [user.id]);

  const openStudent = async (s) => {
    setActive(s);
    setProgressLoading(true);
    try {
      const { data } = await api.get(ENDPOINTS.studentProgress(s.id));
      setProgress(data);
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
        emptySubtitle="Ask your admin to assign students to your batch from the Admin panel."
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

            <div>
              <p className="label">Assignments</p>
              {progress.assignments?.length ? (
                <ul className="divide-y divide-ink/5 rounded-xl border border-ink/5">
                  {progress.assignments.map((a, i) => (
                    <li key={i} className="flex items-center justify-between px-3.5 py-2.5 text-sm">
                      <span className="text-ink">{a.title}</span>
                      <span className="font-mono text-xs text-slate-muted">{a.marks ?? "—"} marks</span>
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
                    <li key={i} className="flex items-center justify-between px-3.5 py-2.5 text-sm">
                      <span className="text-ink">{q.title}</span>
                      <Badge tone={q.status === "COMPLETED" ? "mint" : "neutral"}>{q.status}</Badge>
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

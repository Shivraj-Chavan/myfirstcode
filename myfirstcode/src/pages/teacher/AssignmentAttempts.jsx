import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import api from "../../api/axios.js";
import { ENDPOINTS } from "../../api/endpoints.js";
import PageHeader from "../../components/shared/PageHeader.jsx";
import Loader from "../../components/ui/Loader.jsx";
import DataTable from "../../components/ui/DataTable.jsx";
import Badge from "../../components/ui/Badge.jsx";

export default function AssignmentAttempts() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .get(ENDPOINTS.assignmentAttempts(id), { timeout: 8000 })
      .then((res) => !cancelled && setData(res.data))
      .catch(() => {
        if (!cancelled) {
          setError(
            "This route isn't responding — its middleware calls authorizeRoles without invoking it (and skips verifyToken), so the request never resolves. Fix: router.get('/:id/attempts', verifyToken, authorizeRoles('teacher','admin'), getAssignmentAttempts) in assignmentsRoutes.js."
          );
        }
      })
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [id]);

  return (
    <div>
      <Link to="/teacher/assignments" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-muted hover:text-brand">
        <ArrowLeft size={15} /> Back to assignments
      </Link>
      <PageHeader eyebrow="teacher/assignments/attempts" title={data?.assignment?.title || "Attempts"} subtitle="Who's completed this assignment and their scores." />

      {loading && <Loader label="Loading attempts" />}

      {!loading && error && (
        <div className="card p-6">
          <p className="rounded-lg bg-coral-light px-4 py-3 text-sm font-medium text-coral-dark">{error}</p>
        </div>
      )}

      {!loading && !error && data && (
        <>
          <div className="mb-5 grid grid-cols-3 gap-3">
            <div className="card p-4 text-center">
              <p className="font-display text-xl font-bold text-ink">{data.total_students}</p>
              <p className="text-xs text-slate-muted">Total students</p>
            </div>
            <div className="card p-4 text-center">
              <p className="font-display text-xl font-bold text-mint-dark">{data.attempted}</p>
              <p className="text-xs text-slate-muted">Attempted</p>
            </div>
            <div className="card p-4 text-center">
              <p className="font-display text-xl font-bold text-coral-dark">{data.not_attempted}</p>
              <p className="text-xs text-slate-muted">Not attempted</p>
            </div>
          </div>

          <DataTable
            rows={data.data}
            rowKey="student_id"
            emptyTitle="No students in this standard"
            columns={[
              { key: "studentName", header: "Student" },
              { key: "email", header: "Email" },
              {
                key: "attempted",
                header: "Status",
                render: (r) =>
                  r.attempted ? (
                    <Badge tone="mint"><CheckCircle2 size={12} className="mr-1 inline" /> Attempted ({r.totalAttempts})</Badge>
                  ) : (
                    <Badge tone="coral"><XCircle size={12} className="mr-1 inline" /> Not attempted</Badge>
                  ),
              },
              { key: "score", header: "Latest score", render: (r) => r.latestSubmission?.score ?? "—" },
            ]}
          />
        </>
      )}
    </div>
  );
}

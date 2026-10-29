import { useEffect, useState } from "react";
import { HelpCircle, Clock, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";
import { ENDPOINTS } from "../../api/endpoints.js";
import PageHeader from "../../components/shared/PageHeader.jsx";
import Loader from "../../components/ui/Loader.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Badge from "../../components/ui/Badge.jsx";

export default function StudentQuizzes() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(ENDPOINTS.quizzes)
      .then((res) => setRows(res.data?.data || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading quizzes" />;

  return (
    <div>
      <PageHeader eyebrow="student/quizzes" title="Quizzes" subtitle="Test what you've learned and track your score." />

      {rows.length === 0 ? (
        <EmptyState icon={HelpCircle} title="No quizzes yet" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((q) => {
            const done = q.result_status;
            return (
              <div key={q.id} className="card flex flex-col p-5">
                <div className="mb-3 flex items-center justify-between">
                  <Badge tone="brand">{q.category || "General"}</Badge>
                  <span className="flex items-center gap-1 font-mono text-xs text-slate-muted">
                    <Clock size={12} /> {q.duration ? `${q.duration}m` : "—"}
                  </span>
                </div>
                <h3 className="font-display font-bold text-ink">{q.title}</h3>
                <p className="mt-1 line-clamp-2 flex-1 text-sm text-slate-muted">{q.description}</p>

                {done ? (
                  <div className="mt-4 flex items-center justify-between rounded-lg bg-mint-light px-3 py-2 text-xs font-semibold text-mint-dark">
                    <span className="flex items-center gap-1"><CheckCircle2 size={14} /> {q.result_status}</span>
                    <span>{q.percentage}%</span>
                  </div>
                ) : (
                  <Link to={`/student/quizzes/${q.id}`} className="btn-primary mt-4 w-full">
                    Start quiz
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

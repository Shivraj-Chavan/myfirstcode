import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import api from "../../api/axios.js";
import { ENDPOINTS } from "../../api/endpoints.js";
import PageHeader from "../../components/shared/PageHeader.jsx";
import Loader from "../../components/ui/Loader.jsx";
import DataTable from "../../components/ui/DataTable.jsx";
import Badge from "../../components/ui/Badge.jsx";

export default function QuizResults() {
  const { id } = useParams();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(ENDPOINTS.quizResults(id)).then((res) => setRows(res.data?.data || [])).finally(() => setLoading(false));
  }, [id]);

  return (
    <div>
      <Link to="/teacher/quizzes" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-muted hover:text-brand">
        <ArrowLeft size={15} /> Back to quizzes
      </Link>
      <PageHeader eyebrow="teacher/quizzes/results" title="Quiz results" subtitle="Ranked by score." />

      {loading ? (
        <Loader label="Loading results" />
      ) : (
        <DataTable
          rows={rows}
          emptyTitle="No attempts yet"
          columns={[
            { key: "student_name", header: "Student" },
            { key: "student_email", header: "Email" },
            { key: "score", header: "Score", render: (r) => `${r.score}/${r.total_marks}` },
            { key: "percentage", header: "%", render: (r) => `${r.percentage}%` },
            { key: "status", header: "Result", render: (r) => <Badge tone={r.status === "Passed" ? "mint" : "coral"}>{r.status}</Badge> },
            { key: "attempt_no", header: "Attempt #" },
          ]}
        />
      )}
    </div>
  );
}

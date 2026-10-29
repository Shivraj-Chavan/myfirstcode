import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle2, PartyPopper } from "lucide-react";
import api from "../../api/axios.js";
import { ENDPOINTS } from "../../api/endpoints.js";
import PageHeader from "../../components/shared/PageHeader.jsx";
import Loader from "../../components/ui/Loader.jsx";

export default function QuizAttempt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    api.get(ENDPOINTS.quiz(id)).then((res) => {
      setQuiz(res.data.quiz);
      setQuestions(res.data.questions || []);
      setLoading(false);
    });
  }, [id]);

  const choose = (qid, option) => setAnswers((a) => ({ ...a, [qid]: option }));

  const submit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        answers: Object.entries(answers).map(([question_id, answer]) => ({
          question_id: Number(question_id),
          answer,
        })),
      };
      const { data } = await api.post(ENDPOINTS.submitQuiz(id), payload);
      setResult(data.data);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader label="Loading quiz" />;

  if (result) {
    return (
      <div className="mx-auto max-w-lg">
        <div className="card flex flex-col items-center gap-4 p-10 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-mint-light text-mint-dark">
            <PartyPopper size={28} />
          </div>
          <h2 className="font-display text-2xl font-bold text-ink">{result.status}!</h2>
          <p className="text-slate-muted">You scored</p>
          <p className="font-display text-4xl font-bold text-brand">
            {result.score}/{result.total_marks}
          </p>
          <p className="font-mono text-sm text-slate-muted">{result.percentage}% · attempt #{result.attempt_no}</p>
          <button className="btn-primary mt-2" onClick={() => navigate("/student/quizzes")}>
            Back to quizzes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader eyebrow="student/quiz" title={quiz?.title} subtitle={quiz?.description} />

      <div className="space-y-4">
        {questions.map((q, idx) => (
          <div key={q.id} className="card p-5">
            <p className="mb-3 font-semibold text-ink">
              {idx + 1}. {q.question} <span className="ml-1 font-mono text-xs text-slate-muted">({q.marks} marks)</span>
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {["a", "b", "c", "d"].map((opt) => {
                const text = q[`option_${opt}`];
                if (!text) return null;
                const selected = answers[q.id] === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => choose(q.id, opt)}
                    className={`flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-left text-sm transition-all ${
                      selected ? "border-brand bg-brand-light text-brand font-semibold" : "border-slate-faint/70 hover:border-brand/50"
                    }`}
                  >
                    <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[10px] font-bold ${selected ? "border-brand bg-brand text-white" : "border-slate-faint"}`}>
                      {selected ? <CheckCircle2 size={12} /> : opt.toUpperCase()}
                    </span>
                    {text}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        className="btn-primary mt-6 w-full"
        disabled={submitting || Object.keys(answers).length === 0}
        onClick={submit}
      >
        {submitting ? "Submitting..." : "Submit quiz"}
      </button>
    </div>
  );
}

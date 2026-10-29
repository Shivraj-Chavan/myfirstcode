import { useEffect, useState } from "react";
import { Trophy, Medal, Crown, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import api from "../../api/axios.js";
import { ENDPOINTS } from "../../api/endpoints.js";
import { useAuth } from "../../context/AuthContext.jsx";
import PageHeader from "../../components/shared/PageHeader.jsx";
import Loader from "../../components/ui/Loader.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Modal from "../../components/ui/Modal.jsx";

const PODIUM_STYLE = [
  { tone: "bg-amber text-white", icon: Crown, label: "1st" },
  { tone: "bg-slate-faint text-white", icon: Medal, label: "2nd" },
  { tone: "bg-[#C58940] text-white", icon: Medal, label: "3rd" },
];

export default function Leaderboard() {
  const { user } = useAuth();
 const [scope, setScope] = useState("standard"); // "standard" | "all"
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [growthFor, setGrowthFor] = useState(null); // the student row whose growth modal is open
  const [growth, setGrowth] = useState([]);
  const [growthLoading, setGrowthLoading] = useState(false);

    const openGrowth = (student) => {
    setGrowthFor(student);
    setGrowthLoading(true);
    api
      .get(ENDPOINTS.studentGrowth(student.student_id))
      .then((res) => setGrowth(res.data?.data || []))
      .catch(() => setGrowth([]))
      .finally(() => setGrowthLoading(false));
  };


  useEffect(() => {
    setLoading(true);
    const req = scope === "standard"
      ? api.get(ENDPOINTS.leaderboardByStandard(user.standard))
      : api.get(ENDPOINTS.leaderboard);

    req
      .then((res) => setRows(res.data?.data || []))
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, [scope, user.standard]);

  const top3 = rows.slice(0, 3);
  const rest = rows.slice(3);

  return (
    <div>
      <PageHeader
        eyebrow="student/leaderboard"
        title="Leaderboard"
        subtitle="Ranked by total quiz score."
        action={
          <div className="flex rounded-xl border border-slate-faint/60 bg-white p-1">
            {[{ k: "standard", label: `Std ${user.standard}` }, { k: "all", label: "All students" }].map((o) => (
              <button
                key={o.k}
                onClick={() => setScope(o.k)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  scope === o.k ? "bg-brand text-white" : "text-slate-muted hover:text-ink"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        }
      />

      {loading ? (
        <Loader label="Loading rankings" />
      ) : rows.length === 0 ? (
        <EmptyState icon={Trophy} title="No rankings yet" subtitle="Scores show up here once quizzes have been attempted." />
      ) : (
        <>
          {/* Podium — top 3 */}
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            {top3.map((r, i) => {
              const style = PODIUM_STYLE[i];
              const Icon = style.icon;
              const isMe = Number(r.student_id) === Number(user.id);
         return (
                <button
                  key={r.student_id}
                  onClick={() => openGrowth(r)}
                  className={`card p-5 text-center transition-all hover:-translate-y-0.5 hover:shadow-pop ${isMe ? "ring-2 ring-brand" : ""}`}
                >
                  <div className={`mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full ${style.tone}`}>
                    <Icon size={20} />
                  </div>
                  <p className="font-mono text-[11px] uppercase tracking-wide text-slate-muted">{style.label}</p>
                  <p className="mt-1 font-display font-bold text-ink">{r.name}{isMe && <span className="text-brand"> (You)</span>}</p>
                  <p className="mt-1 text-2xl font-display font-bold text-brand">{r.totalScore}</p>
                  <p className="text-xs text-slate-muted">{r.quizzesTaken} quizzes · {r.avgPercentage || 0}% avg</p>
                </button>
              );
            })}
          </div>

          {/* Rest of the ranking */}
          {rest.length > 0 && (
            <div className="card overflow-hidden">
              {rest.map((r, i) => {
                const rank = i + 4;
                const isMe = Number(r.student_id) === Number(user.id);
             return (
                  <button
                    key={r.student_id}
                    onClick={() => openGrowth(r)}
                    className={`flex w-full items-center gap-4 border-b border-ink/5 px-5 py-3 text-left last:border-0 hover:bg-ink/[0.02] ${isMe ? "bg-brand-light/50" : ""}`}
                  >
                    <span className="w-6 shrink-0 font-mono text-sm font-semibold text-slate-muted">#{rank}</span>
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink/5 font-display text-xs font-bold text-slate-muted">
                      {r.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink">{r.name}{isMe && <span className="text-brand"> (You)</span>}</p>
                      <p className="text-xs text-slate-muted">{r.quizzesTaken} quizzes · {r.avgPercentage || 0}% avg</p>
                    </div>
                    <Badge tone="brand">{r.totalScore} pts</Badge>
                  </button>
                );
              })}
            </div>
)}
        </>
      )}

      <Modal open={!!growthFor} onClose={() => setGrowthFor(null)} title={growthFor ? `${growthFor.name}'s growth` : ""} width="max-w-2xl">
        {growthLoading ? (
          <Loader label="Loading growth" />
        ) : growth.length === 0 ? (
          <EmptyState icon={TrendingUp} title="No quiz history yet" subtitle="This student hasn't attempted any quizzes." />
        ) : (
          <div>
            <p className="eyebrow mb-1">cumulative score over time</p>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={growth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EDEEFF" vertical={false} />
                <XAxis
                  dataKey="created_at"
                  tickFormatter={(v) => new Date(v).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  tick={{ fontSize: 11, fill: "#8B8DAE" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#8B8DAE" }} axisLine={false} tickLine={false} />
                <Tooltip
                  labelFormatter={(v) => new Date(v).toLocaleDateString()}
                  contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 24px -6px rgba(18,19,43,0.15)" }}
                />
                <Line type="monotone" dataKey="cumulativeScore" stroke="#5B5FEF" strokeWidth={3} dot={{ r: 3, fill: "#5B5FEF" }} />
              </LineChart>
            </ResponsiveContainer>

            <div className="mt-4 space-y-2">
              <p className="label">Quiz history</p>
              {growth.slice().reverse().map((g) => (
                <div key={g.id} className="flex items-center justify-between rounded-lg bg-ink/[0.03] px-3.5 py-2.5 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink">{g.quizTitle}</p>
                    <p className="text-xs text-slate-muted">{new Date(g.created_at).toLocaleDateString()} · attempt #{g.attempt_no}</p>
                  </div>
                  <Badge tone={g.status === "Passed" ? "mint" : "coral"}>{g.score}/{g.total_marks}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
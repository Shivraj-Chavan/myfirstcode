import { useEffect, useState } from "react";
import { BookOpen, HelpCircle, ClipboardList, CheckCircle2, CalendarDays, ArrowUpRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";
import { ENDPOINTS } from "../../api/endpoints.js";
import { useAuth } from "../../context/AuthContext.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import Loader from "../../components/ui/Loader.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import PageHeader from "../../components/shared/PageHeader.jsx";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(ENDPOINTS.studentDashboard)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading your dashboard" />;

  const stats = data?.stats || {};

  return (
    <div>
      <PageHeader
        eyebrow="student/dashboard"
        title={`Hey ${user?.name?.split(" ")[0] || "there"}, ready to build something? 🚀`}
        subtitle={`Std ${user?.standard || "-"} · Let's see what's on today's build queue.`}
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={BookOpen} label="Courses" value={stats.totalCourses ?? 0} tone="brand" />
        <StatCard icon={HelpCircle} label="Quizzes" value={stats.totalQuizzes ?? 0} tone="amber" />
        <StatCard icon={ClipboardList} label="Assignments" value={stats.totalAssignments ?? 0} tone="coral" />
        <StatCard icon={CheckCircle2} label="Courses completed" value={stats.completedCourses ?? 0} tone="mint" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <p className="eyebrow mb-1">activity/monthly</p>
          <h3 className="mb-4 font-display font-bold text-ink">Assignments posted this year</h3>
          {data?.analytics?.length ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={data.analytics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EDEEFF" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#8B8DAE" }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#8B8DAE" }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: "#EDEEFF" }} contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 24px -6px rgba(18,19,43,0.15)" }} />
                <Bar dataKey="total" fill="#5B5FEF" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState title="No activity yet" subtitle="Charts fill in as assignments get posted." />
          )}
        </div>

        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="eyebrow mb-1">calendar/upcoming</p>
              <h3 className="font-display font-bold text-ink">Upcoming events</h3>
            </div>
            <Link to="/student/calendar" className="text-slate-muted hover:text-brand">
              <ArrowUpRight size={16} />
            </Link>
          </div>
          {data?.events?.length ? (
            <ul className="space-y-3">
              {data.events.map((ev) => (
                <li key={ev.id} className="flex items-start gap-3 rounded-lg bg-ink/[0.03] p-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-light text-brand">
                    <CalendarDays size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{ev.title}</p>
                    <p className="text-xs text-slate-muted">{ev.event_type} · {new Date(ev.start_datetime).toLocaleString()}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState icon={CalendarDays} title="No events yet" subtitle="Your teacher's schedule will show up here." />
          )}
        </div>
      </div>

      <div className="mt-6 card p-5">
        <p className="eyebrow mb-1">quizzes/recent</p>
        <h3 className="mb-4 font-display font-bold text-ink">Recently added quizzes</h3>
        {data?.recentQuizzes?.length ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.recentQuizzes.map((q) => (
              <Link
                key={q.id}
                to="/student/quizzes"
                className="rounded-xl border border-ink/5 p-4 transition-colors hover:border-brand hover:bg-brand-light/40"
              >
                <p className="font-semibold text-ink">{q.title}</p>
                <p className="mt-1 text-xs text-slate-muted">Added {new Date(q.created_at).toLocaleDateString()}</p>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState icon={HelpCircle} title="No quizzes yet" />
        )}
      </div>
    </div>
  );
}

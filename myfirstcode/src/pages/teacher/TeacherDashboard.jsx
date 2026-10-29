import { useEffect, useState } from "react";
import { BookOpen, ClipboardList, HelpCircle, Users, CalendarDays, ArrowUpRight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";
import { ENDPOINTS } from "../../api/endpoints.js";
import { useAuth } from "../../context/AuthContext.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import Loader from "../../components/ui/Loader.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import PageHeader from "../../components/shared/PageHeader.jsx";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(ENDPOINTS.teacherDashboard)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading your dashboard" />;
  const stats = data?.stats || {};

  return (
    <div>
      <PageHeader
        eyebrow="teacher/dashboard"
        title={`Welcome back, ${user?.name?.split(" ")[0] || "Teacher"}`}
        subtitle="Here's how your classroom is doing."
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Users} label="Students" value={stats.totalStudents ?? 0} tone="brand" />
        <StatCard icon={ClipboardList} label="Assignments" value={stats.totalAssignments ?? 0} tone="coral" />
        <StatCard icon={HelpCircle} label="Quizzes" value={stats.totalQuizzes ?? 0} tone="amber" />
        <StatCard icon={BookOpen} label="Courses" value={stats.totalCourses ?? 0} tone="mint" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <p className="eyebrow mb-1">quizzes/monthly</p>
          <h3 className="mb-4 font-display font-bold text-ink">Quizzes created this year</h3>
          {data?.analytics?.length ? (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={data.analytics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EDEEFF" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#8B8DAE" }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#8B8DAE" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 24px -6px rgba(18,19,43,0.15)" }} />
                <Line type="monotone" dataKey="total" stroke="#5B5FEF" strokeWidth={3} dot={{ r: 4, fill: "#5B5FEF" }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState title="No activity yet" />
          )}
        </div>

        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="eyebrow mb-1">calendar/upcoming</p>
              <h3 className="font-display font-bold text-ink">Upcoming events</h3>
            </div>
            <Link to="/teacher/calendar" className="text-slate-muted hover:text-brand"><ArrowUpRight size={16} /></Link>
          </div>
          {data?.events?.length ? (
            <ul className="space-y-3">
              {data.events.map((ev) => (
                <li key={ev.id} className="flex items-start gap-3 rounded-lg bg-ink/[0.03] p-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-light text-brand"><CalendarDays size={16} /></div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{ev.title}</p>
                    <p className="text-xs text-slate-muted">{new Date(ev.start_datetime).toLocaleString()}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState icon={CalendarDays} title="No events yet" action={<Link to="/teacher/calendar" className="btn-primary btn-sm mt-2">Schedule one</Link>} />
          )}
        </div>
      </div>

      <div className="mt-6 card p-5">
        <p className="eyebrow mb-1">assignments/recent</p>
        <h3 className="mb-4 font-display font-bold text-ink">Recently posted assignments</h3>
        {data?.submissions?.length ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.submissions.map((a) => (
              <Link key={a.id} to="/teacher/assignments" className="rounded-xl border border-ink/5 p-4 hover:border-brand hover:bg-brand-light/40">
                <p className="font-semibold text-ink">{a.title}</p>
                <p className="mt-1 text-xs text-slate-muted">{new Date(a.created_at).toLocaleDateString()}</p>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState icon={ClipboardList} title="No assignments yet" />
        )}
      </div>
    </div>
  );
}

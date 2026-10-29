import { useEffect, useState } from "react";
import axios from "axios";

import {
  Users,
  GraduationCap,
  BookOpen,
  Video,
  FileText,
  Bell,
  TrendingUp,
  CalendarDays,
  Activity,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import ENDPOINT from "../../lib/endpoints";

const AdminDashboard = () => {

  // ================= STATES =================

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalCourses: 0,
    totalLiveClasses: 0,
    totalPendingAssignments: 0,
  });

  const [activities, setActivities] = useState([]);

  const [events, setEvents] = useState([]);

  const [analytics, setAnalytics] = useState([]);

  // ================= FETCH DASHBOARD =================

  const fetchDashboard = async () => {
    try {

      const { data } = await axios.get(
        ENDPOINT.ADMIN_DASHBOARD
      );

      setStats(data.stats);

      setActivities(data.activities);

      setEvents(data.events);

      setAnalytics(data.analytics);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-3xl font-bold text-slate-700 animate-pulse">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  // ================= STATS CARD =================

  const statsCards = [
    {
      title: "Students",
      value: stats.totalStudents,
      icon: <Users size={34} />,
      gradient: "from-blue-500 to-blue-700",
    },
    {
      title: "Teachers",
      value: stats.totalTeachers,
      icon: <GraduationCap size={34} />,
      gradient: "from-purple-500 to-purple-700",
    },
    {
      title: "Courses",
      value: stats.totalCourses,
      icon: <BookOpen size={34} />,
      gradient: "from-emerald-500 to-emerald-700",
    },
    {
      title: "Live Classes",
      value: stats.totalquizzes,
      icon: <Video size={34} />,
      gradient: "from-orange-500 to-orange-700",
    },
    {
      title: "Assignments",
      value: stats.totalPendingAssignments,
      icon: <FileText size={34} />,
      gradient: "from-pink-500 to-pink-700",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">

      {/* ================= HEADER ================= */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">

        <div>
          <h1 className="text-4xl font-bold text-slate-800">
            Admin Dashboard
          </h1>

          <p className="text-slate-500 mt-2">
            Monitor your entire platform from one place 🚀
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex items-center gap-3">

          <button className="relative bg-white p-3 rounded-2xl shadow hover:shadow-lg transition">

            <Bell className="text-slate-700" />

            <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full"></span>

          </button>

          <div className="bg-white px-5 py-3 rounded-2xl shadow">
            <p className="text-sm text-slate-500">
              Today
            </p>

            <h3 className="font-bold text-slate-800">
              {new Date().toDateString()}
            </h3>
          </div>

        </div>

      </div>

      {/* ================= STATS ================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">

        {statsCards.map((item, index) => (
          <div
            key={index}
            className={`
              bg-gradient-to-br
              ${item.gradient}
              rounded-3xl
              p-6
              shadow-xl
              text-white
              relative
              overflow-hidden
              hover:scale-[1.02]
              transition
              duration-300
            `}
          >

            <div className="absolute right-[-15px] top-[-15px] opacity-10">
              <Activity size={120} />
            </div>

            <div className="flex items-center justify-between relative z-10">

              <div>

                <p className="text-sm opacity-80">
                  {item.title}
                </p>

                <h2 className="text-4xl font-bold mt-2">
                  {item.value}
                </h2>

                <div className="flex items-center gap-1 mt-3 text-sm">

                  <TrendingUp size={16} />

                  <span>+12% this month</span>

                </div>

              </div>

              <div className="bg-white/20 p-4 rounded-2xl">
                {item.icon}
              </div>

            </div>

          </div>
        ))}

      </div>

      {/* ================= CHART + EVENTS ================= */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">

        {/* ================= CHART ================= */}

        <div className="xl:col-span-2 bg-white rounded-3xl shadow-lg p-6">

          <div className="flex items-center justify-between mb-6">

            <div>

              <h2 className="text-2xl font-bold text-slate-800">
                Student Growth Analytics
              </h2>

              <p className="text-slate-500 mt-1">
                Monthly student registrations
              </p>

            </div>

            <div className="bg-blue-100 p-3 rounded-xl">
              <TrendingUp className="text-blue-600" />
            </div>

          </div>

          <ResponsiveContainer width="100%" height={350}>

            <AreaChart data={analytics}>

              <defs>

                <linearGradient
                  id="studentGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#3b82f6"
                    stopOpacity={0.8}
                  />

                  <stop
                    offset="95%"
                    stopColor="#3b82f6"
                    stopOpacity={0}
                  />

                </linearGradient>

              </defs>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="total"
                stroke="#2563eb"
                fillOpacity={1}
                fill="url(#studentGradient)"
              />

            </AreaChart>

          </ResponsiveContainer>

        </div>

        {/* ================= EVENTS ================= */}

        <div className="bg-white rounded-3xl shadow-lg p-6">

          <div className="flex items-center justify-between mb-6">

            <div>

              <h2 className="text-2xl font-bold text-slate-800">
                Upcoming Events
              </h2>

              <p className="text-slate-500 mt-1">
                Scheduled platform events
              </p>

            </div>

            <div className="bg-orange-100 p-3 rounded-xl">
              <CalendarDays className="text-orange-600" />
            </div>

          </div>

          <div className="space-y-4">

            {events.length > 0 ? (
              events.map((event) => (
                <div
                  key={event.id}
                  className="
                    border
                    border-slate-200
                    rounded-2xl
                    p-4
                    hover:shadow-md
                    transition
                  "
                >

                  <h3 className="font-semibold text-slate-800">
                    {event.title}
                  </h3>

                  <p className="text-sm text-slate-500 mt-2">
                    {new Date(event.start_date).toLocaleDateString()}
                  </p>

                </div>
              ))
            ) : (
              <div className="text-slate-500">
                No upcoming events
              </div>
            )}

          </div>

        </div>

      </div>

      {/* ================= ACTIVITIES ================= */}

      <div className="mt-8 bg-white rounded-3xl shadow-lg p-6">

        <div className="flex items-center justify-between mb-6">

          <div>

            <h2 className="text-2xl font-bold text-slate-800">
              Recent Activities
            </h2>

            <p className="text-slate-500 mt-1">
              Latest platform activities
            </p>

          </div>

          <div className="bg-emerald-100 p-3 rounded-xl">
            <Activity className="text-emerald-600" />
          </div>

        </div>

        <div className="space-y-4">

          {activities.length > 0 ? (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="
                  flex
                  items-start
                  justify-between
                  border-b
                  border-slate-100
                  pb-4
                "
              >

                <div>

                  <h3 className="font-medium text-slate-800">
                    {activity.message}
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    {new Date(activity.created_at).toLocaleString()}
                  </p>

                </div>

                <div className="h-3 w-3 rounded-full bg-emerald-500 mt-2 animate-pulse"></div>

              </div>
            ))
          ) : (
            <div className="text-slate-500">
              No recent activities
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
import { useEffect, useState } from "react";

import axios from "axios";

import ENDPOINT from "../../lib/endpoints";

import {
  BookOpen,
  ClipboardCheck,
  FileText,
  Trophy,
  Calendar,
  TrendingUp,
  ClipboardList,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const StudentDashboard = () => {

  const [loading, setLoading] =
    useState(true);

  const [stats, setStats] =
    useState({
      totalCourses: 0,
      totalQuizzes: 0,
      totalAssignments: 0,
      completedCourses: 0,
    });

  const [recentQuizzes, setRecentQuizzes] =
    useState([]);

  const [events, setEvents] =
    useState([]);

  const [analytics, setAnalytics] =
    useState([]);

  // ================= FETCH =================

  const fetchDashboard = async () => {
    try {

      const { data } = await axios.get(
        ENDPOINT.STUDENT_DASHBOARD
      );

      console.log(data);

      if (data?.success) {

        setStats(data.stats || {});

        setRecentQuizzes(
          data.recentQuizzes || []
        );

        setEvents(data.events || []);

        setAnalytics(
          data.analytics || []
        );
      }

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="
        min-h-screen
        flex
        items-center
        justify-center
      ">
        Loading Student Dashboard...
      </div>
    );
  }

  const cards = [
    {
      title: "Courses",
      value: stats?.totalCourses || 0,
      icon: <BookOpen />,
      color: "from-blue-500 to-blue-700",
    },

    {
      title: "Quizzes",
      value: stats?.totalQuizzes || 0,
      icon: <ClipboardCheck />,
      color: "from-pink-500 to-pink-700",
    },

    {
      title: "Assignments",
      value: stats?.totalAssignments || 0,
      icon: <FileText />,
      color: "from-orange-500 to-orange-700",
    },

    {
      title: "Calender",
      value: stats?.completedCalender || 0,
      icon: <Trophy />,
      color: "from-emerald-500 to-emerald-700",
    },
  ];

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="
      min-h-screen
      bg-slate-100
      p-6
    ">

      {/* HEADER */}

      <div className="mb-8">

        <h1 className="
          text-4xl
          font-bold
          text-slate-800
        ">
          Welcome, {user?.name || "Student"} !
        </h1>

        <p className="
          text-slate-500
          mt-2
        ">
          Track your learning progress 🚀
        </p>

      </div>

      {/* STATS */}

      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-4
        gap-6
      ">

        {cards.map((item, index) => (

          <div
            key={index}
            className={`
              bg-gradient-to-br
              ${item.color}
              rounded-3xl
              p-6
              text-white
              shadow-xl
            `}
          >

            <div className="
              flex
              items-center
              justify-between
            ">

              <div>

                <p className="opacity-80">
                  {item.title}
                </p>

                <h2 className="
                  text-4xl
                  font-bold
                  mt-3
                ">
                  {item.value}
                </h2>

              </div>

              <div className="
                bg-white/20
                p-4
                rounded-2xl
              ">
                {item.icon}
              </div>

            </div>

          </div>
        ))}

      </div>

      {/* CHART + EVENTS */}

      <div className="
        grid
        grid-cols-1
        xl:grid-cols-3
        gap-6
        mt-8
      ">

        {/* ANALYTICS */}

        <div className="
          xl:col-span-2
          bg-white
          rounded-3xl
          p-6
          shadow-lg
        ">

          <div className="
            flex
            items-center
            justify-between
            mb-6
          ">

            <div>

              <h2 className="
                text-2xl
                font-bold
              ">
                Assignment Analytics
              </h2>

              <p className="text-slate-500">
                Monthly assignment stats
              </p>

            </div>

            <div className="
              bg-blue-100
              p-3
              rounded-xl
            ">
              <TrendingUp
                className="text-blue-600"
              />
            </div>

          </div>

          <ResponsiveContainer
            width="100%"
            height={320}
          >

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

              <CartesianGrid
                strokeDasharray="3 3"
              />

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

        {/* EVENTS */}

        <div className="bg-white rounded-2xl shadow-lg p-5 h-auto flex flex-col">

{/* Header */}
<div className="flex items-center justify-between mb-5">
  <div>
    <h2 className="text-xl font-bold">Upcoming Events</h2>
    <p className="text-sm text-slate-500">
      {events.length} Upcoming Events
    </p>
  </div>

  <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center">
    <Calendar className="w-5 h-5 text-orange-600" />
  </div>
</div>

{/* Event List */}
<div className="flex-1 overflow-y-auto space-y-3 pr-1">

  {events.length === 0 ? (
    <div className="flex items-center justify-center h-full text-slate-400">
      No upcoming events
    </div>
  ) : (
    events.map((event) => (
      <div
        key={event.id}
        className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition"
      >
        {/* Color Indicator */}
        <div
          className={`w-3 h-3 rounded-full flex-shrink-0
            ${
              event.event_type === "LIVE_CLASS"
                ? "bg-cyan-500"
                : event.event_type === "ASSIGNMENT"
                ? "bg-amber-500"
                : event.event_type === "QUIZ"
                ? "bg-red-500"
                : event.event_type === "EXAM"
                ? "bg-red-700"
                : event.event_type === "RECORDED_SESSION"
                ? "bg-green-500"
                : "bg-indigo-500"
            }`}
        />

        {/* Event Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">
            {event.title}
          </h3>

          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 flex-wrap">
            <span className="bg-slate-100 px-2 py-0.5 rounded-full">
              {event.event_type.replace("_", " ")}
            </span>

            <span>
              {new Date(event.start_datetime).toLocaleDateString()}
            </span>

            <span>
              {new Date(event.start_datetime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>
    ))
  )}
</div>
</div>

      </div>

      {/* RECENT QUIZZES */}
      <div className="mt-8 bg-white rounded-2xl shadow-lg p-5 h-auto flex flex-col">

{/* Header */}
<div className="flex items-center justify-between mb-5">
  <div>
    <h2 className="text-xl font-bold">Recent Quizzes</h2>
    <p className="text-sm text-slate-500">
      {recentQuizzes.length} Quiz{recentQuizzes.length !== 1 ? "zes" : ""}
    </p>
  </div>

  <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center">
    <ClipboardList className="w-5 h-5 text-emerald-600" />
  </div>
</div>

{/* Quiz List */}
<div className="flex-1 overflow-y-auto space-y-3 pr-1">

  {recentQuizzes.length === 0 ? (
    <div className="flex items-center justify-center h-full text-slate-400">
      No quizzes available
    </div>
  ) : (
    recentQuizzes.map((quiz) => (
      <div
        key={quiz.id}
        className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition"
      >
        {/* Status */}
        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse flex-shrink-0"></div>

        {/* Quiz Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">
            {quiz.title}
          </h3>

          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 flex-wrap">
            <span>
              {new Date(quiz.created_at).toLocaleDateString()}
            </span>

            <span>•</span>

            <span>
              {new Date(quiz.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>
    ))
  )}

</div>
</div>

    </div>
  );
};

export default StudentDashboard;
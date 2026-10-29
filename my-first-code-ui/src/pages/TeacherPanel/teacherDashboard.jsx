import { useEffect, useState } from "react";

import axios from "axios";

import ENDPOINT from "../../lib/endpoints";

import {
  BookOpen,
  FileText,
  ClipboardCheck,
  Users,
  Calendar,
  TrendingUp,
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

const TeacherDashboard = () => {

  const [loading, setLoading] =
    useState(true);

  const [stats, setStats] = useState({
  totalCourses: 0,
  totalAssignments: 0,
  totalQuizzes: 0,
  totalStudents: 0,
});

  const [submissions, setSubmissions] =
    useState([]);

  const [events, setEvents] =
    useState([]);

  const [analytics, setAnalytics] =
    useState([]);

  // ================= FETCH =================

const fetchDashboard = async () => {
  try {

    const { data } = await axios.get(
      ENDPOINT.TEACHER_DASHBOARD
    );

    console.log(data);

    if (data?.success) {

      setStats(data.stats);

      setSubmissions(data.submissions || []);

      setEvents(data.events || []);

      setAnalytics(data.analytics || []);

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
        Loading...
      </div>
    );
  }

  const cards = [
    {
      title: "Courses",
      value: stats.totalCourses,
      icon: <BookOpen />,
      color: "from-blue-500 to-blue-700",
    },

    {
      title: "Assignments",
      value: stats.totalAssignments || 0,
      icon: <FileText />,
      color: "from-purple-500 to-purple-700",
    },

    {
      title: "Quizzes",
      value: stats.totalQuizzes || 0,
      icon: <ClipboardCheck />,
      color: "from-pink-500 to-pink-700",
    },

    {
      title: "Students",
      value: stats.totalStudents || 0,
      icon: <Users />,
      color: "from-emerald-500 to-emerald-700",
    },
  ];

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
          Teacher Dashboard
        </h1>

        <p className="
          text-slate-500
          mt-2
        ">
          Manage your classroom efficiently ✨
        </p>

      </div>

      {/* CARDS */}

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

        {/* CHART */}

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
                Quiz Analytics
              </h2>

              <p className="text-slate-500">
                Monthly quiz creation stats
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
                  id="quizGradient"
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
                fill="url(#quizGradient)"
              />

            </AreaChart>

          </ResponsiveContainer>

        </div>

        {/* EVENTS */}

        <div className="
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
                Upcoming Events
              </h2>

              <p className="text-slate-500">
                Scheduled activities
              </p>

            </div>

            <div className="
              bg-orange-100
              p-3
              rounded-xl
            ">
              <Calendar
                className="text-orange-600"
              />
            </div>

          </div>

          <div className="space-y-4">

            {events.map((event) => (

              <div
                key={event.id}
                className="
                  border
                  rounded-2xl
                  p-4
                "
              >

                <h3 className="font-semibold">
                  {event.title}
                </h3>

                <p className="
                  text-sm
                  text-slate-500
                  mt-2
                ">
                  {event.event_type}
                </p>

                <p className="
                  text-sm
                  text-slate-400
                  mt-1
                ">
                  {
                    new Date(
                      event.start_datetime
                    ).toLocaleDateString()
                  }
                </p>

              </div>
            ))}

          </div>

        </div>

      </div>

      {/* RECENT SUBMISSIONS */}

      <div className="
        mt-8
        bg-white
        rounded-3xl
        p-6
        shadow-lg
      ">

        <h2 className="
          text-2xl
          font-bold
          mb-6
        ">
          Recent Assignments
        </h2>

        <div className="space-y-4">

          {submissions.map((item) => (

            <div
              key={item.id}
              className="
                border-b
                pb-4
                flex
                items-center
                justify-between
              "
            >

              <div>

                <h3 className="font-semibold">
                  {item.title}
                </h3>

                <p className="
                  text-sm
                  text-slate-500
                  mt-1
                ">
                  {
                    new Date(
                      item.created_at
                    ).toLocaleString()
                  }
                </p>

              </div>

              <div className="
                h-3
                w-3
                rounded-full
                bg-emerald-500
                animate-pulse
              "></div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
};

export default TeacherDashboard;
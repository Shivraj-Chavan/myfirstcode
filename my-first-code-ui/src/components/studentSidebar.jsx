import {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  Code2,
  FileText,
  HelpCircle,
  Award,
  Trophy,
  User,
  Settings,
  PenBox,
} from "lucide-react";

const StudentSidebar = ({
  activePage,
  setActivePage,
}) => {

  const menus = [
    {
      id: "dashboard",
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },

    {
      id: "courses",
      name: "My Courses",
      icon: <BookOpen size={20} />,
    },

    {
      id: "calendar",
      name: "Calendar",
      icon: <CalendarDays size={20} />,
    },

    {
      id: "playground",
      name: "Playground",
      icon: <Code2 size={20} />,
    },

    {
      id: "assignment",
      name: "Assignment",
      icon: <FileText size={20} />,
    },

    {
      id: "quizzes",
      name: "Quizzes",
      icon: <HelpCircle size={20} />,
    },

    {
      id: "certificates",
      name: "Certificates",
      icon: <Award size={20} />,
    },

    {
      id: "leaderboard",
      name: "Leaderboard",
      icon: <Trophy size={20} />,
    },

    {
      id: "enquiry",
      name: "Enquiry",
      icon: <PenBox size={20} />,
    },

    {
      id: "profile",
      name: "Profile",
      icon: <User size={20} />,
    },

    {
      id: "settings",
      name: "Settings",
      icon: <Settings size={20} />,
    },
  ];

  return (
    <div className="w-[280px] bg-white shadow-xl border-r border-slate-200 p-5 min-h-screen">

      {/* LOGO */}

      <div className="mb-10">

        <h1 className="text-3xl font-bold text-indigo-600">
          Student Panel
        </h1>

        <p className="text-slate-500 mt-1">
          Learning never stops.
        </p>

      </div>

      {/* MENU */}

      <div className="space-y-2">

        {menus.map((menu) => (

          <button
            key={menu.id}

            onClick={() =>
              setActivePage(menu.id)
            }

            className={`
              w-full
              flex
              items-center
              gap-3
              px-4
              py-3
              rounded-xl
              transition-all
              duration-300

              ${
                activePage === menu.id
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-slate-100 text-slate-700"
              }
            `}
          >

            {menu.icon}

            <span className="font-medium">
              {menu.name}
            </span>

          </button>

        ))}

      </div>

    </div>
  );
};

export default StudentSidebar;
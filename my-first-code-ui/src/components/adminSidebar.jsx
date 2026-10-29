import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  FolderKanban,
  CreditCard,
  Award,
  FileBarChart,
  FileText,
  Bell,
  Settings,
  ArrowUpAZIcon,
} from "lucide-react";

const AdminSidebar = ({
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
      id: "students",
      name: "Students",
      icon: <Users size={20} />,
    },

    {
      id: "teachers",
      name: "Teachers",
      icon: <GraduationCap size={20} />,
    },

    // {
    //   id: "courses",
    //   name: "Courses",
    //   icon: <BookOpen size={20} />,
    // },

    {
      id: "levels",
      name: "Levels",
      icon: <ArrowUpAZIcon size={20} />,
    },

     {
      id: "asssignment",
      name: "Assignments",
      icon: <FileText size={20} />,
    },

    {
      id: "calendar",
      name: "Calendar",
      icon: <FileText size={20} />,
    },

     {
      id: "quizzes",
      name: "Quizzes",
      icon: <FileText size={20} />,
    },

    // {
    //   id: "categories",
    //   name: "Categories",
    //   icon: <FolderKanban size={20} />,
    // },

    {
      id: "payments",
      name: "Payments",
      icon: <CreditCard size={20} />,
    },

    {
      id: "certificates",
      name: "Certificates",
      icon: <Award size={20} />,
    },

    // {
    //   id: "reports",
    //   name: "Reports",
    //   icon: <FileBarChart size={20} />,
    // },

    // {
    //   id: "cms",
    //   name: "CMS",
    //   icon: <FileText size={20} />,
    // },

    // {
    //   id: "notifications",
    //   name: "Notifications",
    //   icon: <Bell size={20} />,
    // },

    // {
    //   id: "settings",
    //   name: "Settings",
    //   icon: <Settings size={20} />,
    // },
  ];

  return (
    <div className="w-[280px] min-h-screen bg-white border-r border-slate-200 shadow-xl p-5">

      {/* HEADER */}

      <div className="mb-10">

        <h1 className="text-3xl font-bold text-indigo-600">
          Admin Panel
        </h1>

        <p className="text-slate-500 mt-1">
          Control the kingdom.
        </p>

      </div>

      {/* MENUS */}

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

export default AdminSidebar;
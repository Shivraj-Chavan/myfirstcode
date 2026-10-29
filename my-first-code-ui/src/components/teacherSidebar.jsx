import {
  LayoutDashboard,
  BookOpen,
  Users,
  CalendarDays,
  FileText,
  HelpCircle,
  ClipboardCheck,
  Video,
  Bell,
  BarChart3,
  Settings,
  MailCheck,
  AwardIcon,
} from "lucide-react";

const TeacherSidebar = ({ activePage, onNavigate }) => {
  const menus = [
    { id: "dashboard", name: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { id: "courses", name: "My Course", icon: <BookOpen size={20} /> },
    { id: "students", name: "Students", icon: <Users size={20} /> },
    { id: "calendar", name: "Schedule Calendar", icon: <CalendarDays size={20} /> },
    { id: "assignments", name: "Assignments", icon: <FileText size={20} /> },
    { id: "quizz", name: "Quizz", icon: <HelpCircle size={20} /> },
    { id: "certificate", name: "Certificate", icon: <AwardIcon size={20} /> },
    { id: "liveclasses", name: "Live Classes", icon: <Video size={20} /> },
    { id: "enquiries", name: "Enquiries", icon: <MailCheck size={20} /> },
    // { id: "announcements", name: "Announcements", icon: <Bell size={20} /> },
    // { id: "analytics", name: "Analytics",  icon: <BarChart3 size={20} /> },
    // { id: "settings", name: "Settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="w-[280px] bg-white border-r border-slate-200 shadow-xl p-5 min-h-screen">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-indigo-600">
          Teacher Panel
        </h1>
        <p className="text-slate-500 mt-1">
          Teach. Inspire. Lead.
        </p>
      </div>

      {/* MENU */}
      <div className="space-y-2">
        {menus.map((menu) => (
          <button
            key={menu.id}
            onClick={() => onNavigate(menu.id)} 
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
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

export default TeacherSidebar;
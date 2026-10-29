// src/layouts/StudentLayout.jsx

import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard, BookOpen, CalendarDays, Code2,
  FileText, HelpCircle, Award, Trophy, MessageSquare,
  User, ChevronLeft, Menu, X, Bell, Search,
  LogOut, Settings,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard",    path: "dashboard",    icon: LayoutDashboard, color: "text-violet-500",  bg: "bg-violet-50"  },
  { label: "My Courses",   path: "courses",      icon: BookOpen,        color: "text-blue-500",    bg: "bg-blue-50"    },
  { label: "Calendar",     path: "calendar",     icon: CalendarDays,    color: "text-cyan-500",    bg: "bg-cyan-50"    },
  { label: "Playground",   path: "playground",   icon: Code2,           color: "text-emerald-500", bg: "bg-emerald-50" },
  { label: "Assignments",  path: "assignments",  icon: FileText,        color: "text-orange-500",  bg: "bg-orange-50"  },
  { label: "Quizzes",      path: "quizzes",      icon: HelpCircle,      color: "text-pink-500",    bg: "bg-pink-50"    },
  { label: "Certificates", path: "certificates", icon: Award,           color: "text-amber-500",   bg: "bg-amber-50"   },
  { label: "Leaderboard",  path: "leaderboard",  icon: Trophy,          color: "text-yellow-500",  bg: "bg-yellow-50"  },
  { label: "Enquiry",      path: "enquiry",      icon: MessageSquare,   color: "text-indigo-500",  bg: "bg-indigo-50"  },
  { label: "Profile",      path: "profile",      icon: User,            color: "text-rose-500",    bg: "bg-rose-50"    },
];

// ── sidebar label groups ─────────────────────────────
const MAIN_NAV   = NAV_ITEMS.slice(0, 8);
const BOTTOM_NAV = NAV_ITEMS.slice(8);

// ════════════════════════════════════════════════════
//  SIDEBAR
// ════════════════════════════════════════════════════
const Sidebar = ({ navigate, location, collapsed, setCollapsed, mobile, onClose }) => {
  const isActive = (path) => location.pathname.includes(path);

  const NavBtn = ({ item }) => {
    const Icon   = item.icon;
    const active = isActive(item.path);

    return (
      <button
        onClick={() => { navigate(item.path); onClose?.(); }}
        title={collapsed && !mobile ? item.label : undefined}
        className={`
          w-full flex items-center gap-3 rounded-xl text-sm font-medium
          transition-all duration-150 group relative
          ${collapsed && !mobile ? "px-0 py-2.5 justify-center" : "px-3 py-2.5"}
          ${active
            ? "bg-gradient-to-r from-violet-600 to-violet-500 text-white shadow-sm shadow-violet-200"
            : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
          }
        `}
      >
        {/* icon container */}
        <span className={`
          flex items-center justify-center shrink-0 rounded-lg transition-all
          ${active
            ? "text-white"
            : item.color
          }
          ${collapsed && !mobile ? "w-8 h-8" : "w-7 h-7"}
          ${!active && `${item.bg} group-hover:bg-transparent`}
        `}>
          <Icon size={16} />
        </span>

        {/* label */}
        {(!collapsed || mobile) && (
          <span className="truncate">{item.label}</span>
        )}

        {/* tooltip on collapsed */}
        {collapsed && !mobile && (
          <span className="
            absolute left-full ml-3 px-2.5 py-1.5 bg-gray-900 text-white
            text-xs rounded-lg whitespace-nowrap opacity-0 pointer-events-none
            group-hover:opacity-100 transition-opacity z-50 shadow-lg
          ">
            {item.label}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="flex flex-col h-full select-none">


      {/* ── Main nav ── */}
      <nav className="flex-1 overflow-y-auto space-y-0.5 pr-0.5">
        {(!collapsed || mobile) && (
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 pb-1.5">
            Learn
          </p>
        )}
        {MAIN_NAV.map((item) => <NavBtn key={item.path} item={item} />)}

        <div className="my-3 border-t border-dashed border-gray-200" />

        {(!collapsed || mobile) && (
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 pb-1.5">
            Account
          </p>
        )}
        {BOTTOM_NAV.map((item) => <NavBtn key={item.path} item={item} />)}
      </nav>

      {/* ── User card ── */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        {(!collapsed || mobile) ? (
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-400 flex items-center justify-center shrink-0 shadow-sm">
              <span className="text-xs font-bold text-white">S</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-gray-900 truncate">Student Name</p>
              <p className="text-[10px] text-gray-400 truncate">student@edu.com</p>
            </div>
            <button className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
              <LogOut size={13} />
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-400 flex items-center justify-center shadow-sm">
              <span className="text-xs font-bold text-white">S</span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

// ════════════════════════════════════════════════════
//  NAVBAR
// ════════════════════════════════════════════════════
const Navbar = ({ location, onMenuClick }) => {
  const current    = NAV_ITEMS.find((i) => location.pathname.includes(i.path));
  const pageTitle  = current?.label  || "Dashboard";
  const Icon       = current?.icon   || LayoutDashboard;
  const colorClass = current?.color  || "text-violet-500";
  const bgClass    = current?.bg     || "bg-violet-50";

  return (
    <header className="h-1 bg-white border-b border-gray-200 px-5 flex items-center justify-between shrink-0">

      {/* left: hamburger (mobile) + breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <Menu size={18} />
        </button>
      </div>    
    </header>
  );
};

// ════════════════════════════════════════════════════
//  LAYOUT
// ════════════════════════════════════════════════════
const StudentLayout = () => {
  const navigate   = useNavigate();
  const location   = useLocation();
  const [collapsed,  setCollapsed]  = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">

      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile drawer ── */}
      <div className={`
        lg:hidden fixed top-0 left-0 h-full w-64 bg-white z-50
        border-r border-gray-200 p-4 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <Sidebar
          navigate={navigate}
          location={location}
          collapsed={false}
          setCollapsed={() => {}}
          mobile
          onClose={() => setMobileOpen(false)}
        />
      </div>

      {/* ── Desktop sidebar ── */}
      <aside className={`
        hidden lg:flex flex-col h-full bg-white border-r border-gray-200
        transition-all duration-300 ease-in-out shrink-0 p-4
        ${collapsed ? "w-[72px]" : "w-[220px]"}
      `}>
        <Sidebar
          navigate={navigate}
          location={location}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      </aside>

      {/* ── Main content ── */}
      <div className="flex flex-col flex-1 min-w-0 h-full">
        <Navbar
          location={location}
          onMenuClick={() => setMobileOpen(true)}
        />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default StudentLayout;
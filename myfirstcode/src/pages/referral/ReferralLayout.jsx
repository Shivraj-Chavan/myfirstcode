import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Users, LogOut, Building2 } from "lucide-react";
import { useReferralAuth } from "../../context/ReferralAuthContext.jsx";

const NAV = [
  { to: "/referral/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/referral/students", label: "My Students", icon: Users },
];

export default function ReferralLayout() {
  const { partner, logout } = useReferralAuth();

  return (
    <div className="min-h-screen bg-cloud lg:flex">
      <aside className="flex w-full flex-col bg-ink text-white lg:w-64 lg:shrink-0">
        <div className="flex items-center gap-2.5 px-6 py-6">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand text-white"><Building2 size={18} /></div>
          <div>
            <p className="font-display text-sm font-bold leading-none">Referral Portal</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-white/40">{partner?.instituteName}</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium ${isActive ? "bg-brand text-white" : "text-white/60 hover:bg-white/5 hover:text-white"}`}
            >
              <Icon size={17} /> {label}
            </NavLink>
          ))}
        </nav>
        <button onClick={logout} className="mx-3 mb-5 flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white">
          <LogOut size={17} /> Log out
        </button>
      </aside>
      <main className="flex-1 px-5 py-6 lg:px-8 lg:py-8">
        <Outlet />
      </main>
    </div>
  );
}
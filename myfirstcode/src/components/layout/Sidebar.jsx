import { NavLink } from "react-router-dom";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import logo from "../../assets/myfirstcode_logo.jpg";

export default function Sidebar({ items, roleLabel, collapsed = false, onToggle }) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 hidden flex-col bg-ink text-white transition-[width] duration-200 lg:flex ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className={`flex items-center gap-2.5 py-6 ${collapsed ? "justify-center px-0" : "px-6"}`}>
      <div className="grid h-8 w-8 place-items-center">
  <img
    src={logo}
    alt="Logo"
    className="h-full w-full object-contain"
  />
</div>
{!collapsed && (
          <div>
            <p className="font-display text-[15px] font-bold leading-none">
              myFirstCode<span className="text-mint animate-pulse">_</span>
            </p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-white/40">{roleLabel}</p>
          </div>
        )}
      </div>

      <button
        onClick={onToggle}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className={`mx-3 mb-2 flex items-center rounded-lg py-2 text-xs font-medium text-white/50 transition-colors hover:bg-white/5 hover:text-white ${
          collapsed ? "justify-center px-0" : "gap-3 px-3.5"
        }`}
      >
        {collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
        {!collapsed && "Collapse"}
      </button>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `flex items-center rounded-lg py-2.5 text-sm font-medium transition-colors ${
                collapsed ? "justify-center px-0" : "gap-3 px-3.5"
              } ${
                isActive
                  ? "bg-brand text-white shadow-pop"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <Icon size={17} />
            {!collapsed && label}
          </NavLink>
        ))}
      </nav>

      {!collapsed && (
        <div className="mx-3 mb-5 rounded-xl bg-white/5 p-3 font-mono text-[11px] text-white/40">
          <span className="text-mint">●</span> v1.0 — built for 6th–10th grade coders
        </div>
      )}
    </aside>
  );
}

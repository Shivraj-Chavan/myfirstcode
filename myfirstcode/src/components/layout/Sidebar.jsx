import { NavLink } from "react-router-dom";

export default function Sidebar({ items, roleLabel }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-ink text-white lg:flex">
      <div className="flex items-center gap-2.5 px-6 py-6">
      <div className="grid h-8 w-8 place-items-center">
  <img
    src="src/assets/myfirstcode_logo.jpg"
    alt="Logo"
    className="h-full w-full object-contain"
  />
</div>
        <div>
          <p className="font-display text-[15px] font-bold leading-none">
            myFirstCode<span className="text-mint animate-pulse">_</span>
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-white/40">{roleLabel}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand text-white shadow-pop"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mx-3 mb-5 rounded-xl bg-white/5 p-3 font-mono text-[11px] text-white/40">
        <span className="text-mint">●</span> v1.0 — built for 6th–10th grade coders
      </div>
    </aside>
  );
}

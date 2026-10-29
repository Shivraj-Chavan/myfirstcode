import { useState } from "react";
import { LogOut, Menu, X, Flame } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Topbar({ title, items, streak }) {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = (user?.name || "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <>
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-ink/5 bg-cloud/80 px-5 py-4 backdrop-blur lg:px-8">
        <div className="flex items-center gap-3">
          <button className="grid h-9 w-9 place-items-center rounded-lg hover:bg-ink/5 lg:hidden" onClick={() => setMobileOpen(true)}>
            <Menu size={20} />
          </button>
          <h1 className="font-display text-lg font-bold text-ink lg:text-xl">{title}</h1>
        </div>

        <div className="flex items-center gap-3">
          {typeof streak === "number" && (
            <div className="hidden items-center gap-1.5 rounded-full bg-amber-light px-3 py-1.5 text-xs font-semibold text-amber-dark sm:flex">
              <Flame size={14} className="fill-amber text-amber" />
              {streak} day streak
            </div>
          )}
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold leading-none text-ink">{user?.name}</p>
            <p className="mt-1 text-[11px] capitalize leading-none text-slate-muted">{user?.role}</p>
          </div>
          <div className="grid h-9 w-9 place-items-center rounded-full bg-brand font-display text-xs font-bold text-white">
            {initials}
          </div>
          <button onClick={logout} className="grid h-9 w-9 place-items-center rounded-lg text-slate-muted hover:bg-coral-light hover:text-coral-dark" title="Log out">
            <LogOut size={17} />
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-64 bg-ink p-4 text-white">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-display font-bold">myFirstCode_</span>
              <button onClick={() => setMobileOpen(false)}><X size={20} /></button>
            </div>
            <nav className="space-y-1">
              {items.map(({ to, label, icon: Icon }) => (
                <a key={to} href={to} className="flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white">
                  <Icon size={17} />
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

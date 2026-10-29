

import logo from "../../assets/myfirstcode_logo.jpg";
const LINES = [
  { p: "npm create student", c: "text-mint" },
  { p: "Welcome, future engineer 👋", c: "text-white/70" },
  { p: "loading curriculum: std 6–10", c: "text-white/70" },
  { p: "status: ready_", c: "text-amber" },
];

export default function AuthShell({ children, eyebrow, title, subtitle }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left — brand / console panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-ink px-12 py-10 text-white lg:flex">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-mint/10 blur-3xl" />

        <div className="relative flex items-center gap-2.5">
        <div className="grid h-10 w-12 place-items-center">
  <img
    src={logo}
    alt="Logo"
    className="h-full w-full object-contain"
  />
</div>
          <span className="font-display text-xl font-bold">
            myFirstCode<span className="text-mint animate-pulse">_</span>
          </span>
        </div>

        <div className="relative">
          <p className="eyebrow mb-3 text-white/50">learning_platform.init()</p>
          <h2 className="font-display text-4xl font-bold leading-tight">
            Where 6th–10th graders <br /> learn to <span className="text-mint">code for real.</span>
          </h2>
          <p className="mt-4 max-w-sm text-sm text-white/60">
            Assignments, quizzes, live classes and a real code editor —
            all in one playful classroom built for young coders.
          </p>

          <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-4 font-mono text-xs leading-relaxed">
            {LINES.map((l, i) => (
              <p key={i} className={l.c}>
                <span className="text-white/30">{i + 1}</span>&nbsp;&nbsp;{l.p}
              </p>
            ))}
          </div>
        </div>

        <p className="relative font-mono text-[11px] text-white/30">
          © {new Date().getFullYear()} myFirstCode — build. break. learn.
        </p>
      </div>

      {/* Right — form panel */}
      <div className="flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
          <div className="grid h-8 w-8 place-items-center">
  <img
    src={logo}
    alt="Logo"
    className="h-full w-full object-contain"
  />
</div>
            <span className="font-display text-lg font-bold text-ink">myFirstCode_</span>
          </div>

          {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
          <h1 className="font-display text-2xl font-bold text-ink">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-slate-muted">{subtitle}</p>}

          <div className="mt-7">{children}</div>
        </div>
      </div>
    </div>
  );
}

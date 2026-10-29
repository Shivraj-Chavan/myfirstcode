import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
 Menu, X, ChevronDown, Building2, ArrowRight,
  Code2, ClipboardList, HelpCircle, Trophy, CalendarDays, Award,
  Users, GraduationCap, CheckCircle2, Mail, MapPin,
} from "lucide-react";

const NAV_LINKS = [
  { href: "#why", label: "Why myFirstCode" },
  { href: "#about", label: "About Us" },
  { href: "#programs", label: "Programs" },
];

const FEATURES = [
  { icon: Code2, title: "Real code, real playground", desc: "Students write and run actual code across Python, JavaScript, Java, C and C++ — not just watch videos." },
  { icon: ClipboardList, title: "Structured assignments", desc: "Teachers assign coding problems with hints, starter code and expected output — students build, don't just copy." },
  { icon: HelpCircle, title: "Quizzes that track progress", desc: "Every quiz result feeds into a student's growth chart, so parents and teachers see real improvement over time." },
  { icon: Trophy, title: "Leaderboard & motivation", desc: "Friendly competition keeps students engaged, with growth tracking that rewards consistency, not just talent." },
  { icon: CalendarDays, title: "Live classes & calendar", desc: "Teachers schedule live sessions, exams and notices — students always know what's next." },
  { icon: Award, title: "Certificates that matter", desc: "Real achievements get real certificates, issued by teachers or admins for course completion and excellence." },
];

const AUDIENCE = [
  { icon: Users, title: "For Students", desc: "A guided, level-by-level path from your first line of code to real applications — with video lessons, practice, and a teacher who actually checks your work." },
  { icon: GraduationCap, title: "For Teachers", desc: "One dashboard to manage your batch: assignments, quizzes, live classes, student progress and certificates — no spreadsheets required." },
  { icon: Building2, title: "For Institutes", desc: "Referral partners can onboard students directly, track admissions end-to-end, and manage payments — all from a dedicated partner portal." },
];

const STATS = [
  { value: "6th–10th", label: "Grades supported" },
  { value: "5", label: "Programming languages" },
  { value: "5", label: "Structured curriculum levels" },
  { value: "3", label: "Role-based dashboards" },
];

const PROGRAMS = [
  { level: "Level 1", name: "Beginner Programming", desc: "Python + web basics. Logic building, variables, control structures.", tone: "bg-mint-light text-mint-dark" },
  { level: "Level 2", name: "Intermediate Programming", desc: "Advanced Python, data structures, OOP, and interactive web design.", tone: "bg-brand-light text-brand" },
  { level: "Level 3", name: "Advanced Python + Mobile", desc: "APIs, databases, and mobile app development fundamentals.", tone: "bg-amber-light text-amber-dark" },
  { level: "Level 4", name: "AI/ML + Game Dev", desc: "Intro to AI, machine learning basics, and creative game development.", tone: "bg-coral-light text-coral-dark" },
  { level: "Level 5", name: "Real-World Projects", desc: "Full-stack development, deployment, and industry-ready skills.", tone: "bg-ink/10 text-ink" },
];

export default function Landing() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginMenuOpen, setLoginMenuOpen] = useState(false);
  const loginMenuRef = useRef(null);

  useEffect(() => {
    if (!loginMenuOpen) return;
    const handleClickOutside = (e) => {
      if (loginMenuRef.current && !loginMenuRef.current.contains(e.target)) {
        setLoginMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [loginMenuOpen]);

  return (
    <div className="bg-cloud">
      {/* ==================== NAVBAR ==================== */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-ink/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-2 py-4 lg:px-4">
          <Link to="/" className="flex items-center gap-2.5">
            {/* <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand text-white">
              <TerminalSquare size={18} />
            </div> */}

<div className="grid h-10 w-12 place-items-center">
  <img
    src="src/assets/myfirstcode_logo.jpg"
    alt="Logo"
    className="h-full w-full object-contain"
  />
</div>
            <span className="font-display text-lg font-bold text-white">
              myFirstCode<span className="text-mint animate-pulse">_</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="text-sm font-medium text-white/70 hover:text-white">
                {l.label}
              </a>
            ))}
          </nav>

       <div className="hidden items-center gap-3 lg:flex">
            <div className="relative" ref={loginMenuRef}>
              <button
                onClick={() => setLoginMenuOpen((o) => !o)}
                className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-white/80 hover:text-white"
              >
                Log in <ChevronDown size={14} className={`transition-transform ${loginMenuOpen ? "rotate-180" : ""}`} />
              </button>
              {loginMenuOpen && (
      <div className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-xl border border-ink/10 bg-white shadow-card">
                <Link
                    to="/login"
                    onClick={() => console.log("[Landing] navigating to /login")}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-brand-light"
                  >
                  <div className="grid h-10 w-12 place-items-center">
  <img
    src="src/assets/myfirstcode_logo.jpg"
    alt="Logo"
    className="h-full w-full object-contain"
  />
</div>
                    <div>
                      <p className="text-sm font-semibold text-ink">Student / Teacher </p>
                      <p className="text-xs text-slate-muted">Log in to your classroom</p>
                    </div>
                  </Link>
                  <Link
                    to="/referral/login"
                    onClick={() => console.log("[Landing] navigating to /referral/login")}
                    className="flex w-full items-center gap-3 border-t border-ink/5 px-4 py-3 text-left hover:bg-brand-light"
                  >
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-amber-light text-amber-dark"><Building2 size={15} /></div>
                    <div>
                      <p className="text-sm font-semibold text-ink">Referral Partner</p>
                      <p className="text-xs text-slate-muted">Institutes & consultants</p>
                    </div>
                  </Link>
                </div>
              )}
            </div>
            <Link to="/register" className="btn-primary">Get started</Link>
          </div>

          <button className="grid h-9 w-9 place-items-center rounded-lg text-white lg:hidden" onClick={() => setMobileOpen(true)}>
            <Menu size={22} />
          </button>
        </div>

        {mobileOpen && (
          <div className="fixed inset-0 z-50 bg-ink lg:hidden">
            <div className="flex items-center justify-between px-5 py-4">
              <span className="font-display text-lg font-bold text-white">myFirstCode_</span>
              <button onClick={() => setMobileOpen(false)}><X size={22} className="text-white" /></button>
            </div>
            <div className="flex flex-col gap-1 px-5 py-4">
              {NAV_LINKS.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-3 text-sm font-medium text-white/80 hover:bg-white/5">
                  {l.label}
                </a>
              ))}
              <div className="my-3 h-px bg-white/10" />
             <Link to="/login" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-3 text-left text-sm font-semibold text-white hover:bg-white/5">
                Log in — Student / Teacher
              </Link>
              
              <Link to="/referral/login" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-3 text-left text-sm font-semibold text-white hover:bg-white/5">
                Log in — Referral Partner
              </Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary mt-2 w-full text-center">Get started</Link>
            </div>
          </div>
        )}
      </header>

      {/* ==================== HERO ==================== */}
      <section className="relative overflow-hidden bg-ink px-5 pb-20 pt-16 text-white lg:px-8 lg:pb-28 lg:pt-24">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-mint/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl text-center">
          <p className="eyebrow mb-4 justify-center text-white/50">std_6_to_10.learn_to_code()</p>
          <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Where young minds <br className="hidden sm:block" />
            learn to <span className="text-mint">code for real.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-white/60 sm:text-lg">
            Assignments, quizzes, live classes, and a real code editor — everything a student
            from Std 6 to 10 needs to go from curious to capable.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button onClick={() => navigate("/register")} className="btn-primary w-full sm:w-auto">
              Start learning <ArrowRight size={16} />
            </button>
            <button onClick={() => navigate("/login")} className="btn-secondary w-full !border-white/20 !bg-white/5 !text-white hover:!border-white sm:w-auto">
              I already have an account
            </button>
          </div>

          <div className="mx-auto mt-10 grid max-w-7xl grid-cols-2 gap-4 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                <p className="font-display text-xl font-bold text-mint sm:text-2xl">{s.value}</p>
                <p className="mt-1 text-[11px] text-white/50">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== WHY MYFIRSTCODE ==================== */}
      <section id="why" className="px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-7xl text-center">
            <p className="eyebrow mb-2 justify-center">why_myfirstcode</p>
            <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">Built for how kids actually learn to code</h2>
            <p className="mt-3 text-slate-muted">
              Not just video lessons — a full classroom with real practice, real feedback, and real progress tracking.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="card p-6 transition-all hover:-translate-y-0.5 hover:shadow-pop">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-light text-brand">
                  <f.icon size={20} />
                </div>
                <h3 className="mt-4 font-display font-bold text-ink">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== ABOUT US ==================== */}
      <section id="about" className="bg-ink/[0.03] px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow mb-2">about_us</p>
            <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
              We believe every student can build something real.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-muted sm:text-base">
              myFirstCode started with a simple idea: coding education for young students shouldn't stop
              at watching tutorials. It should mean writing real code, solving real problems, and getting
              real feedback from real teachers — with progress that parents and mentors can actually see.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-muted sm:text-base">
              Our platform brings together a structured, level-by-level curriculum, a live code execution
              environment, and role-based dashboards for students, teachers, and admins — so every part of
              the learning journey, from the first "Hello World" to a full-stack project, happens in one place.
            </p>
            <ul className="mt-5 space-y-2.5">
              {["Curriculum designed for grades 6–10", "Teachers who track every submission", "Progress parents can actually see"].map((t) => (
                <li key={t} className="flex items-center gap-2.5 text-sm font-medium text-ink">
                  <CheckCircle2 size={16} className="shrink-0 text-mint-dark" /> {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {AUDIENCE.map((a) => (
              <div key={a.title} className={`card p-6 ${a.title === "For Institutes" ? "sm:col-span-2" : ""}`}>
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-amber-light text-amber-dark">
                  <a.icon size={20} />
                </div>
                <h3 className="mt-4 font-display font-bold text-ink">{a.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-muted">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== PROGRAMS ==================== */}
      <section id="programs" className="px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow mb-2 justify-center">programs</p>
            <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">Five levels, one clear path forward</h2>
            <p className="mt-3 text-slate-muted">Each level builds on the last — from first logic puzzles to deployed full-stack projects.</p>
          </div>

          <div className="mt-12 space-y-3">
            {PROGRAMS.map((p) => (
              <div key={p.level} className="card flex flex-col items-start gap-4 p-5 sm:flex-row sm:items-center">
                <span className={`shrink-0 rounded-lg px-3 py-1.5 font-mono text-xs font-bold ${p.tone}`}>{p.level}</span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display font-bold text-ink">{p.name}</h3>
                  <p className="mt-1 text-sm text-slate-muted">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="px-5 pb-16 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-7xl rounded-2xl bg-gradient-to-br from-brand to-brand-dark px-6 py-12 text-center text-white sm:px-12">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Ready to write your first line of code?</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/80">
            Join as a student, start teaching, or bring your institute on board as a referral partner.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button onClick={() => navigate("/register")} className="btn-primary !bg-white !text-brand hover:!bg-white/90 w-full sm:w-auto">
              Create free account <ArrowRight size={16} />
            </button>
            <button onClick={() => navigate("/referral/register")} className="btn-secondary !border-white/30 !bg-transparent !text-white hover:!border-white w-full sm:w-auto">
              <Building2 size={16} /> Register as a partner
            </button>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t border-white/5 bg-ink px-5 py-12 text-white/60 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
            <div className="grid h-10 w-12 place-items-center">
  <img
    src="src/assets/myfirstcode_logo.jpg"
    alt="Logo"
    className="h-full w-full object-contain"
  />
</div>
              <span className="font-display text-base font-bold text-white">myFirstCode_</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed">
              A coding platform for Std 6–10 students to learn, build, and grow — with real teachers and real code.
            </p>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-wide text-white/40">Platform</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href="#why" className="hover:text-white">Why myFirstCode</a></li>
              <li><a href="#about" className="hover:text-white">About Us</a></li>
              <li><a href="#programs" className="hover:text-white">Programs</a></li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-wide text-white/40">Get started</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/register" className="hover:text-white">Create an account</Link></li>
              <li><Link to="/login" className="hover:text-white">Student / Teacher </Link></li>
              <li><Link to="/referral/login" className="hover:text-white">Referral partner login</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-wide text-white/40">Contact</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex items-center gap-2"><Mail size={14} /> hello@myfirstcode.com</li>
              <li className="flex items-center gap-2"><MapPin size={14} /> Mumbai, India</li>
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-6xl border-t border-white/10 pt-6 text-center font-mono text-xs text-white/30">
          © {new Date().getFullYear()} myFirstCode — build. break. learn.
        </div>
      </footer>
    </div>
  );
}
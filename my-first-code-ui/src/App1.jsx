import { useState } from "react";

// ─── confetti helper ───────────────────────────────────────────────────────
function launchConfetti() {
  const colors = ["#4F46E5", "#F59E0B", "#22C55E", "#EC4899", "#06B6D4"];
  for (let i = 0; i < 80; i++) {
    const el = document.createElement("div");
    el.style.cssText = `
      position:fixed;pointer-events:none;z-index:9999;
      width:${6 + Math.random() * 8}px;height:${6 + Math.random() * 8}px;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      border-radius:${Math.random() > 0.5 ? "50%" : "2px"};
      left:${Math.random() * 100}vw;top:-10px;
      opacity:1;transform:rotate(${Math.random() * 360}deg);
    `;
    document.body.appendChild(el);
    const tx = (Math.random() - 0.5) * 200;
    el.animate(
      [
        { transform: `translate(0,0) rotate(0deg)`, opacity: 1 },
        { transform: `translate(${tx}px,${60 + Math.random() * 60}vh) rotate(${Math.random() * 720}deg)`, opacity: 0 },
      ],
      { duration: 1200 + Math.random() * 800, easing: "ease-out" }
    ).onfinish = () => el.remove();
  }
}

// ─── shared tiny components ────────────────────────────────────────────────
const GradientText = ({ children }) => (
  <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">{children}</span>
);

const SectionLabel = ({ children }) => (
  <div className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-3">{children}</div>
);

// ─── background blobs ──────────────────────────────────────────────────────
function BgBlobs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-3xl -top-32 -left-32 bg-gradient-to-br from-indigo-500 to-purple-500 animate-pulse" />
      <div className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-3xl top-1/2 -right-40 bg-gradient-to-br from-pink-400 to-rose-500 animate-pulse" style={{ animationDelay: "2s" }} />
      <div className="absolute w-[400px] h-[400px] rounded-full opacity-10 blur-3xl bottom-0 left-1/3 bg-gradient-to-br from-cyan-400 to-blue-500 animate-pulse" style={{ animationDelay: "4s" }} />
      <div className="absolute w-[300px] h-[300px] rounded-full opacity-10 blur-2xl top-1/3 left-1/2 bg-gradient-to-br from-amber-400 to-orange-400 animate-pulse" style={{ animationDelay: "1s" }} />
    </div>
  );
}

// ─── navbar ────────────────────────────────────────────────────────────────
function Navbar({ showPage, activePage }) {
  const links = [
    { id: "home", label: "Home" },
    { id: "courses", label: "Courses" },
    { id: "live", label: "Live Classes" },
    { id: "playground", label: "Playground" },
    { id: "dashboard", label: "Dashboard" },
    { id: "login", label: "Login" },
  ];
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-xl border-b border-white/60 shadow-sm">
      <div className="flex items-center gap-2 font-bold text-xl text-indigo-700 font-['Poppins']">
        <span></span> MyFirstCode
      </div>
      <ul className="hidden md:flex gap-1">
        {links.map((l) => (
          <li key={l.id}>
            <button
              onClick={() => showPage(l.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activePage === l.id
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
              }`}
            >
              {l.label}
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={() => showPage("login")}
        className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-5 py-2 rounded-full text-sm font-bold shadow hover:shadow-lg hover:scale-105 transition-all"
      >
        ✨ Start Learning
      </button>
    </nav>
  );
}

// ─── home page ─────────────────────────────────────────────────────────────
function HomePage({ showPage }) {
  return (
    <div>
      {/* HERO */}
      <section className="min-h-screen flex items-center justify-center pt-24 pb-16 px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold px-4 py-2 rounded-full mb-6">
              🎉 Trusted by 50,000+ Young Coders
            </div>
            <h1 className="font-['Poppins'] text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-6">
              Learn Coding<br />the <GradientText>Fun Way</GradientText> 🚀
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-lg">
              Join thousands of students from Class 6–10 mastering programming through games, challenges, and live classes. Level up your skills, earn XP, and build real projects!
            </p>
            <div className="flex gap-4 flex-wrap mb-10">
              <button
                onClick={() => { showPage("courses"); launchConfetti(); }}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                🎮 Start Learning
              </button>
              <button
                onClick={() => showPage("live")}
                className="bg-white/70 backdrop-blur border border-white/80 text-indigo-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-white transition-all shadow"
              >
                ▶ Watch Demo
              </button>
            </div>
            <div className="flex gap-8">
              {[["50K+", "Students"], ["120+", "Courses"], ["98%", "Love It!"]].map(([num, label]) => (
                <div key={label}>
                  <div className="font-['Poppins'] text-3xl font-black text-indigo-600">{num}</div>
                  <div className="text-gray-500 text-sm">{label}</div>
                </div>
              ))}
            </div>
          </div>
          {/* HERO VISUAL */}
          <div className="relative flex justify-center">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 shadow-2xl w-80">
              <div className="text-5xl text-center mb-4">🤖</div>
              <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm mb-4">
                <div><span className="text-purple-400">def</span> <span className="text-blue-300">say_hello</span>():</div>
                <div>&nbsp;&nbsp;name = <span className="text-green-400">"Arjun"</span></div>
                <div>&nbsp;&nbsp;<span className="text-purple-400">print</span>(<span className="text-green-400">"Hi,"</span>, name)</div>
                <div>&nbsp;&nbsp;<span className="text-purple-400">return</span> <span className="text-yellow-400">100</span> + <span className="text-yellow-400">1</span></div>
              </div>
              <div className="bg-green-500/10 rounded-xl p-3 font-mono text-sm text-green-600">
                ✅ Output: Hi, Arjun
              </div>
            </div>
            <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 text-center">
              <div className="text-xs font-bold text-indigo-500 mb-1">🏆 XP Earned!</div>
              <div className="font-['Poppins'] text-3xl font-black text-amber-500">+250</div>
              <div className="text-xs text-gray-400">Python Basics</div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4">
              <div className="text-xs font-semibold text-gray-500 mb-2">🔥 Daily Streak</div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                <div>
                  <div className="font-['Poppins'] text-xl font-black text-orange-500">12 Days!</div>
                  <div className="text-xs text-gray-400">Keep going!</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COURSES BY CLASS */}
      <section className="py-20 px-8 bg-white/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>📚 Explore Courses</SectionLabel>
            <h2 className="font-['Poppins'] text-4xl font-black text-gray-900 mb-3">Courses by Your Class</h2>
            <p className="text-gray-500 text-lg">Pick your grade and start your coding adventure today!</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { emoji: "🌱", grade: "Class 6", title: "Scratch & Logic", desc: "Start your coding journey with fun games!", xp: "500", color: "indigo" },
              { emoji: "🌿", grade: "Class 7", title: "Python Basics", desc: "Learn Python with friendly examples!", xp: "750", color: "green" },
              { emoji: "🌳", grade: "Class 8", title: "Web Dev 101", desc: "Build websites with HTML & CSS magic!", xp: "1000", color: "amber" },
              { emoji: "🌲", grade: "Class 9", title: "JavaScript", desc: "Make interactive websites and games!", xp: "1250", color: "pink" },
              { emoji: "🏔️", grade: "Class 10", title: "AI & Projects", desc: "Build real apps with AI & data science!", xp: "2000", color: "cyan" },
            ].map((c) => (
              <div
                key={c.grade}
                onClick={() => showPage("courses")}
                className="bg-white/80 backdrop-blur border border-white/80 rounded-2xl p-5 text-center cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className="text-4xl mb-3">{c.emoji}</div>
                <div className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-2 ${
                  c.color === "indigo" ? "bg-indigo-100 text-indigo-700" :
                  c.color === "green" ? "bg-green-100 text-green-700" :
                  c.color === "amber" ? "bg-amber-100 text-amber-700" :
                  c.color === "pink" ? "bg-pink-100 text-pink-700" :
                  "bg-cyan-100 text-cyan-700"
                }`}>{c.grade}</div>
                <div className="font-['Poppins'] font-bold text-gray-800 text-sm mb-1">{c.title}</div>
                <div className="text-gray-500 text-xs mb-3">{c.desc}</div>
                <div className="text-xs font-semibold text-amber-600">⭐ {c.xp} XP</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>⚡ What You Get</SectionLabel>
            <h2 className="font-['Poppins'] text-4xl font-black text-gray-900 mb-3">Everything You Need to Succeed</h2>
            <p className="text-gray-500 text-lg">A complete learning ecosystem built just for young coders like you!</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "🎬", title: "Recorded Videos", desc: "Watch at your own pace. Rewind, replay, and master every concept with crystal-clear video lessons." },
              { icon: "🎙️", title: "Live Classes", desc: "Join expert teachers live! Ask questions in real-time and code together with friends." },
              { icon: "💻", title: "Coding Practice", desc: "100+ challenges with instant feedback. Our AI tutor helps when you're stuck!" },
              { icon: "🏅", title: "Certificates", desc: "Earn real certificates to show off your skills! Share on social media or add to your portfolio." },
            ].map((f) => (
              <div key={f.title} className="bg-white/70 backdrop-blur border border-white/80 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all">
                <div className="text-4xl mb-4">{f.icon}</div>
                <div className="font-['Poppins'] font-bold text-gray-800 text-lg mb-2">{f.title}</div>
                <div className="text-gray-500 text-sm leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GAMIFICATION */}
      <section className="py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 rounded-3xl p-10 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,white,transparent)]" />
            <div className="relative z-10">
              <div className="text-center mb-12">
                <div className="text-xs font-bold uppercase tracking-widest text-indigo-300 mb-3">🎮 GAMIFICATION</div>
                <h2 className="font-['Poppins'] text-4xl font-black text-white mb-3">Learn. Earn. Level Up! 🚀</h2>
                <p className="text-indigo-200 text-lg">Coding becomes an adventure with XP points, badges, and epic rewards!</p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {/* XP Card */}
                <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6">
                  <div className="text-4xl mb-4">⚡</div>
                  <div className="font-['Poppins'] text-xl font-black text-amber-400 mb-2">XP Points</div>
                  <div className="text-indigo-200 text-sm mb-5">Earn XP for every lesson, quiz, and challenge you complete!</div>
                  <div className="flex justify-between text-xs text-indigo-300 mb-2"><span>Level 7</span><span>2450 / 3000 XP</span></div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full w-[82%] bg-gradient-to-r from-amber-400 to-orange-400 rounded-full" />
                  </div>
                </div>
                {/* Badges */}
                <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6">
                  <div className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-4">🏅 YOUR BADGES</div>
                  {[["🔥", "7-Day Streak", "Code every day!"], ["🐍", "Python Pro", "Basics mastered"], ["⚡", "Speed Coder", "Fast finisher!"]].map(([e, t, s]) => (
                    <div key={t} className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-xl">{e}</div>
                      <div>
                        <div className="text-white font-bold text-sm">{t}</div>
                        <div className="text-indigo-300 text-xs">{s}</div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Leaderboard */}
                <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6">
                  <div className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-4">🏆 LEADERBOARD</div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 bg-amber-500/20 border border-amber-500/30 rounded-xl px-3 py-2">
                      <span className="text-lg">🥇</span><span className="text-white font-semibold text-sm flex-1">Priya S.</span><span className="text-amber-400 font-bold text-xs">8420 XP</span>
                    </div>
                    <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                      <span className="text-lg">🥈</span><span className="text-white/80 text-sm flex-1">Rahul K.</span><span className="text-white/60 text-xs">7890 XP</span>
                    </div>
                    <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                      <span className="text-lg">🥉</span><span className="text-white/80 text-sm flex-1">Aarav M.</span><span className="text-white/60 text-xs">7240 XP</span>
                    </div>
                    <div className="flex items-center gap-3 bg-indigo-500/30 border border-indigo-400/40 rounded-xl px-3 py-2">
                      <span className="text-lg">✨</span><span className="text-white font-semibold text-sm flex-1">You</span><span className="text-indigo-300 text-xs">2450 XP</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>💬 Student Love</SectionLabel>
            <h2 className="font-['Poppins'] text-4xl font-black text-gray-900">Kids & Parents Love It!</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { emoji: "😊", name: "Arjun Sharma", label: "Class 8, Pune", text: '"MyFirstCode made learning Python super fun! I built my first game in just 2 weeks. The XP system keeps me motivated every day!"', bg: "bg-indigo-100" },
              { emoji: "👩", name: "Meera Patel", label: "Parent, Mumbai", text: '"My daughter went from zero to building websites! The live classes are amazing and teachers are so patient with kids. 10/10!"', bg: "bg-green-100" },
              { emoji: "🧒", name: "Ishaan Gupta", label: "Class 9, Delhi", text: '"I earned 3 badges this month and I\'m on a 14-day coding streak! The challenges are hard but I feel awesome when I solve them!"', bg: "bg-amber-100" },
            ].map((t) => (
              <div key={t.name} className="bg-white/80 backdrop-blur border border-white/80 rounded-2xl p-6 shadow hover:shadow-xl transition-all">
                <div className="text-amber-400 text-xl mb-3">★★★★★</div>
                <p className="text-gray-600 leading-relaxed mb-5 text-sm">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${t.bg} flex items-center justify-center text-xl`}>{t.emoji}</div>
                  <div>
                    <div className="font-bold text-gray-800 text-sm">{t.name}</div>
                    <div className="text-gray-400 text-xs">{t.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white pt-16 pb-8 px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="font-['Poppins'] font-bold text-xl mb-3">🚀 MyFirstCode</div>
            <p className="text-gray-400 text-sm leading-relaxed">Empowering India's next generation of coders, one line of code at a time. Join 50,000+ young programmers on their journey!</p>
            <div className="flex gap-3 mt-5">
              {["📘", "🐦", "📷", "▶️"].map((s) => (
                <div key={s} className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center cursor-pointer hover:bg-white/20 transition">{s}</div>
              ))}
            </div>
          </div>
          {[
            { title: "Courses", links: ["Class 6 - Scratch", "Class 7 - Python", "Class 8 - Web Dev", "Class 9 - JavaScript", "Class 10 - AI"] },
            { title: "Company", links: ["About Us", "Careers", "Blog", "Press Kit"] },
            { title: "Support", links: ["Help Center", "Contact Us", "Privacy Policy", "Terms of Use"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-bold text-white mb-4">{col.title}</h4>
              <div className="flex flex-col gap-2">
                {col.links.map((l) => <a key={l} href="#" className="text-gray-400 hover:text-white text-sm transition">{l}</a>)}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-800 pt-6 flex justify-between items-center flex-wrap gap-2">
          <div className="text-gray-500 text-sm">© 2025 MyFirstCode. Made with ❤️ for young coders in India.</div>
          <div className="text-gray-600 text-sm">🚀 Keep Coding!</div>
        </div>
      </footer>
    </div>
  );
}

// ─── courses page ──────────────────────────────────────────────────────────
function CoursesPage({ showPage }) {
  const courses = [
    { icon: "🐍", grade: "Class 7 • Beginner", title: "Python for Beginners", desc: "Your first steps into the magical world of Python programming. Fun projects included!", xp: "750", vids: "24", progress: 65, color: "indigo" },
    { icon: "🌐", grade: "Class 8 • Beginner", title: "HTML & CSS Magic", desc: "Build beautiful websites from scratch! Learn the language of the web.", xp: "1000", vids: "32", progress: 30, color: "green" },
    { icon: "⚡", grade: "Class 9 • Intermediate", title: "JavaScript Adventures", desc: "Make your websites come alive! Add animations, games, and interactivity.", xp: "1250", vids: "40", progress: 0, color: "amber" },
    { icon: "🤖", grade: "Class 10 • Advanced", title: "AI & Machine Learning", desc: "Build intelligent apps! Learn how AI thinks and create your own smart projects.", xp: "2000", vids: "48", progress: 10, color: "pink" },
    { icon: "🎨", grade: "Class 6 • Beginner", title: "Scratch Game Design", desc: "Create your first game with Scratch! Drag, drop, and make amazing things!", xp: "500", vids: "18", progress: 100, color: "cyan" },
    { icon: "📊", grade: "Class 10 • Intermediate", title: "Data Science Basics", desc: "Analyze data like a scientist! Learn pandas, charts, and insights from data.", xp: "1500", vids: "36", progress: 45, color: "indigo" },
  ];
  const barColor = { indigo: "bg-gradient-to-r from-indigo-500 to-purple-500", green: "bg-gradient-to-r from-green-500 to-emerald-400", amber: "bg-gradient-to-r from-amber-400 to-yellow-300", pink: "bg-gradient-to-r from-pink-500 to-rose-400", cyan: "bg-gradient-to-r from-cyan-500 to-blue-400" };
  const badgeColor = { indigo: "bg-indigo-100 text-indigo-700", green: "bg-green-100 text-green-700", amber: "bg-amber-100 text-amber-700", pink: "bg-pink-100 text-pink-700", cyan: "bg-cyan-100 text-cyan-700" };

  return (
    <div>
      <div className="pt-28 pb-10 px-8 bg-linear-to-br from-indigo-600 to-purple-700 text-white text-center">
        <h1 className="font-['Poppins'] text-4xl font-black mb-2">📚 All Courses</h1>
        <p className="text-indigo-200 text-lg">120+ courses designed for Class 6-10 students. Learn at your own pace!</p>
      </div>
      <div className="max-w-7xl mx-auto px-8 py-10 flex gap-8">
        {/* sidebar */}
        <div className="hidden lg:block w-60 shrink-0">
          <div className="bg-white/80 backdrop-blur border border-white/80 rounded-2xl p-5 sticky top-24">
            <h3 className="font-['Poppins'] font-bold text-gray-800 mb-4">🔍 Filter Courses</h3>
            <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mb-4 focus:outline-none focus:border-indigo-400" type="text" placeholder="Search courses..." />
            {[
              { title: "By Class", chips: ["📗 All Classes", "🌱 Class 6", "🌿 Class 7", "🌳 Class 8", "🌲 Class 9", "🏔️ Class 10"] },
              { title: "By Level", chips: ["🎮 All Levels", "🟢 Beginner", "🟡 Intermediate", "🔴 Advanced"] },
              { title: "By Topic", chips: ["🐍 Python", "🌐 Web Dev", "🎨 Scratch", "⚡ JavaScript", "🤖 AI & ML"] },
            ].map((g) => (
              <div key={g.title} className="mb-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{g.title}</h4>
                <div className="flex flex-wrap gap-1">
                  {g.chips.map((c, i) => (
                    <div key={c} className={`text-xs px-3 py-1 rounded-full cursor-pointer transition ${i === 0 ? "bg-indigo-100 text-indigo-700 font-semibold" : "bg-gray-100 text-gray-600 hover:bg-indigo-50"}`}>{c}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* main */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-['Poppins'] font-bold text-gray-800 text-xl">120 Courses Found</h2>
            <select className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400">
              <option>Sort: Most Popular</option>
              <option>Newest First</option>
              <option>Highest XP</option>
            </select>
          </div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {courses.map((c) => (
              <div key={c.title} onClick={() => showPage("detail")} className="bg-white/80 backdrop-blur border border-white/80 rounded-2xl p-5 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3 ${
                  c.color === "indigo" ? "bg-indigo-100" : c.color === "green" ? "bg-green-100" : c.color === "amber" ? "bg-amber-100" : c.color === "pink" ? "bg-pink-100" : "bg-cyan-100"
                }`}>{c.icon}</div>
                <div className={`inline-block text-xs font-bold px-2 py-1 rounded-full mb-2 ${badgeColor[c.color]}`}>{c.grade}</div>
                <div className="font-['Poppins'] font-bold text-gray-800 mb-1">{c.title}</div>
                <div className="text-gray-500 text-sm mb-3">{c.desc}</div>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-semibold text-amber-600">⭐ {c.xp} XP</div>
                  <span className="text-xs text-gray-400">📹 {c.vids} videos</span>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1"><span>Progress</span><span>{c.progress}%</span></div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${barColor[c.color]}`} style={{ width: `${c.progress}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── course detail page ────────────────────────────────────────────────────
function DetailPage({ showPage }) {
  const lessons = [
    { num: 1, title: "What is Python?", dur: "10 min", status: "done" },
    { num: 2, title: "Your First Program", dur: "15 min", status: "done" },
    { num: 3, title: "Print & Input", dur: "12 min", status: "done" },
    { num: 4, title: "Math Operations", dur: "14 min", status: "done" },
    { num: 5, title: "Strings Basics", dur: "16 min", status: "done" },
    { num: 6, title: "Variables & Types", dur: "18 min", status: "active" },
    { num: 7, title: "If/Else Conditions", dur: "20 min", status: "lock" },
    { num: 8, title: "For Loops", dur: "22 min", status: "lock" },
    { num: 9, title: "While Loops", dur: "18 min", status: "lock" },
    { num: 10, title: "Functions", dur: "25 min", status: "lock" },
  ];
  return (
    <div>
      <div className="pt-24 pb-20 px-8 bg-linear-to-br from-indigo-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => showPage("courses")} className="bg-white/20 border border-white/30 text-white px-4 py-2 rounded-full text-sm cursor-pointer hover:bg-white/30 transition">← Back</button>
            <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-semibold">Class 7 • Beginner</span>
          </div>
          <h1 className="font-['Poppins'] text-4xl font-black mb-2">🐍 Python for Beginners</h1>
          <p className="text-indigo-200 text-lg mb-4">Master Python from scratch with 24 video lessons and 50+ coding challenges!</p>
          <div className="flex gap-5 flex-wrap text-indigo-100 text-sm">
            <span>⭐ 750 XP</span><span>📹 24 Lessons</span><span>⏱️ 12 hours</span><span>👥 8,420 Students</span>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-8 py-10 flex gap-8">
        <div className="flex-1">
          <div className="bg-gray-900 rounded-2xl overflow-hidden mb-6">
            <div className="aspect-video flex items-center justify-center bg-linear-to-br from-indigo-800 to-purple-900">
              <div className="text-center text-white">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl mx-auto mb-3 cursor-pointer hover:bg-white/30 transition">▶</div>
                <div className="font-['Poppins'] font-bold text-lg">Lesson 6: Variables & Data Types</div>
                <div className="text-indigo-300 text-sm mt-1">Duration: 18 minutes</div>
              </div>
            </div>
            <div className="bg-gray-900 px-6 py-4 flex items-center justify-between">
              <div className="flex gap-3">
                <button className="bg-white/10 text-white px-4 py-2 rounded-full text-sm">⏮ Previous</button>
                <button className="bg-indigo-500 text-white px-5 py-2 rounded-full text-sm font-bold">Next ⏭</button>
              </div>
              <div className="text-gray-400 text-sm">6 / 24 Lessons</div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur border border-white/80 rounded-2xl p-7">
            <h3 className="font-['Poppins'] font-bold text-xl text-gray-800 mb-3">📋 About This Lesson</h3>
            <p className="text-gray-600 leading-relaxed">In this lesson, we'll explore Python variables and how to store different types of data. You'll learn about strings, numbers, booleans, and how to use them in your programs. By the end, you'll be able to write programs that remember information!</p>
            <div className="flex gap-3 mt-5 flex-wrap">
              <button className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-5 py-2 rounded-full text-sm font-semibold hover:bg-indigo-100 transition">📝 Download Notes</button>
              <button onClick={() => showPage("playground")} className="bg-green-50 text-green-700 border border-green-200 px-5 py-2 rounded-full text-sm font-semibold hover:bg-green-100 transition">💻 Practice Now</button>
              <button className="bg-amber-50 text-amber-700 border border-amber-200 px-5 py-2 rounded-full text-sm font-semibold hover:bg-amber-100 transition">📂 Resources</button>
            </div>
          </div>
        </div>
        <div className="hidden lg:block w-72 shrink-0">
          <div className="bg-white/80 backdrop-blur border border-white/80 rounded-2xl overflow-hidden sticky top-24">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-['Poppins'] font-bold text-gray-800 mb-3">Course Lessons</h3>
              <div className="flex justify-between text-xs text-gray-500 mb-1"><span>Your progress</span><span>25%</span></div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-1/4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
              </div>
            </div>
            <div className="max-h-[500px] overflow-y-auto">
              {lessons.map((l) => (
                <div key={l.num} className={`flex items-center gap-3 px-4 py-3 border-b border-gray-50 ${l.status === "active" ? "bg-indigo-50" : "hover:bg-gray-50"} cursor-pointer transition`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${
                    l.status === "done" ? "bg-green-100 text-green-600" :
                    l.status === "active" ? "bg-indigo-100 text-indigo-600" :
                    "bg-gray-100 text-gray-400"
                  }`}>
                    {l.status === "done" ? "✅" : l.status === "active" ? "▶" : "🔒"}
                  </div>
                  <div>
                    <div className={`text-sm font-semibold ${l.status === "active" ? "text-indigo-700" : l.status === "lock" ? "text-gray-400" : "text-gray-700"}`}>{l.num}. {l.title}</div>
                    <div className={`text-xs ${l.status === "active" ? "text-indigo-400" : "text-gray-400"}`}>{l.dur}{l.status === "done" ? " • Completed" : l.status === "active" ? " • In Progress" : ""}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── dashboard page ────────────────────────────────────────────────────────
function DashboardPage({ showPage }) {
  const achievements = [
    { icon: "🔥", name: "7-Day Streak", locked: false },
    { icon: "🐍", name: "Python Pro", locked: false },
    { icon: "⚡", name: "Speed Coder", locked: false },
    { icon: "🌐", name: "Web Builder", locked: false },
    { icon: "🤖", name: "AI Wizard", locked: true },
    { icon: "🏆", name: "Champion", locked: true },
  ];
  return (
    <div className="flex min-h-screen pt-16">
      {/* sidebar */}
      <div className="w-60 flex-shrink-0 bg-gradient-to-b from-indigo-700 to-purple-800 text-white p-6 flex flex-col">
        <div className="mb-7">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl mb-2">😊</div>
          <div className="font-['Poppins'] font-bold">Arjun Sharma</div>
          <div className="text-xs text-indigo-300">Class 8 • Level 7</div>
        </div>
        {[
          { icon: "🏠", label: "Dashboard", page: null, active: true },
          { icon: "📚", label: "My Courses", page: "courses" },
          { icon: "🎙️", label: "Live Classes", page: "live" },
          { icon: "💻", label: "Playground", page: "playground" },
          { icon: "🏅", label: "Achievements", page: null },
          { icon: "📊", label: "Progress", page: null },
          { icon: "⚙️", label: "Settings", page: null },
        ].map((item) => (
          <div
            key={item.label}
            onClick={() => item.page && showPage(item.page)}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl mb-1 cursor-pointer transition ${item.active ? "bg-white/20 font-semibold" : "hover:bg-white/10"}`}
          >
            <span>{item.icon}</span><span className="text-sm">{item.label}</span>
          </div>
        ))}
        <div className="mt-auto pt-8">
          <div className="bg-amber-500/20 border border-amber-400/30 rounded-2xl p-4 text-center">
            <div className="text-2xl mb-1">🔥</div>
            <div className="font-['Poppins'] text-2xl font-black text-amber-400">12</div>
            <div className="text-xs text-indigo-200">Day Streak!</div>
          </div>
        </div>
      </div>
      {/* main */}
      <div className="flex-1 p-8 overflow-auto">
        {/* welcome */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-7 text-white flex items-center justify-between mb-8">
          <div>
            <div className="font-['Poppins'] text-2xl font-black mb-1">Hey Arjun! 👋</div>
            <div className="text-indigo-100 mb-4">You're on fire! Keep up your 12-day streak! 🔥</div>
            <button onClick={() => showPage("courses")} className="bg-white text-indigo-700 px-6 py-2 rounded-full font-bold text-sm hover:shadow-lg transition">Continue Learning →</button>
          </div>
          <div className="text-center">
            <div className="font-['Poppins'] text-4xl font-black">🔥 12</div>
            <div className="text-xs text-indigo-200 mt-1">Day Streak</div>
          </div>
        </div>
        {/* stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: "⚡", val: "2,450", label: "Total XP Earned", sub: "+250 this week", subColor: "text-green-500" },
            { icon: "📚", val: "4", label: "Courses Enrolled", sub: "2 in progress", subColor: "text-gray-400" },
            { icon: "✅", val: "67", label: "Challenges Done", sub: "Top 15% this month!", subColor: "text-green-500" },
            { icon: "🏅", val: "8", label: "Badges Earned", sub: "3 more to unlock", subColor: "text-amber-500" },
          ].map((s) => (
            <div key={s.label} className="bg-white/80 backdrop-blur border border-white/80 rounded-2xl p-5 text-center hover:shadow-lg transition">
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className="font-['Poppins'] text-2xl font-black text-gray-800">{s.val}</div>
              <div className="text-gray-500 text-xs mb-1">{s.label}</div>
              <div className={`text-xs font-semibold ${s.subColor}`}>{s.sub}</div>
            </div>
          ))}
        </div>
        {/* enrolled */}
        <div className="font-['Poppins'] font-bold text-gray-800 text-lg mb-4">📚 Enrolled Courses</div>
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: "🐍", title: "Python for Beginners", grade: "Class 7", pct: 65, done: "6/24", bar: "from-indigo-500 to-purple-500" },
            { icon: "🌐", title: "HTML & CSS Magic", grade: "Class 8", pct: 30, done: "10/32", bar: "from-green-500 to-emerald-400" },
            { icon: "🎨", title: "Scratch Game Design", grade: "Class 6", pct: 100, done: "18/18", bar: "from-cyan-500 to-blue-400" },
          ].map((c) => (
            <div key={c.title} onClick={() => showPage("detail")} className="bg-white/80 backdrop-blur border border-white/80 rounded-2xl p-5 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="text-3xl mb-2">{c.icon}</div>
              <div className="font-bold text-gray-800 text-sm mb-1">{c.title}</div>
              <div className="text-gray-400 text-xs mb-3">{c.grade}</div>
              <div className="flex justify-between text-xs text-gray-500 mb-1"><span>{c.pct}% done</span><span>{c.done}</span></div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${c.bar} rounded-full`} style={{ width: `${c.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
        {/* achievements */}
        <div className="font-['Poppins'] font-bold text-gray-800 text-lg mb-4">🏅 Achievements</div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {achievements.map((a) => (
            <div
              key={a.name}
              onClick={() => !a.locked && launchConfetti()}
              className={`rounded-2xl p-4 text-center cursor-pointer transition ${a.locked ? "bg-gray-100 opacity-60" : "bg-white/80 backdrop-blur border border-white/80 hover:shadow-lg hover:-translate-y-1"}`}
            >
              <div className="text-3xl mb-2">{a.icon}</div>
              <div className="text-xs font-bold text-gray-700">{a.name}</div>
              <div className="text-xs text-gray-400 mt-1">{a.locked ? "Locked 🔒" : "Earned!"}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── playground page ───────────────────────────────────────────────────────
function PlaygroundPage() {
  const [output, setOutput] = useState(null);
  const runCode = () => {
    setOutput(
      <>
        <div className="text-green-400">Hello, Arjun! 🎉</div>
        <div className="text-white">Your greeting has 16 characters!</div>
        <div className="text-yellow-400">⭐</div>
        <div className="text-yellow-400">⭐⭐</div>
        <div className="text-yellow-400">⭐⭐⭐</div>
      </>
    );
  };
  const codeLines = [
    { n: 1, html: <><span className="text-gray-500"># Welcome to MyFirstCode Playground! 🚀</span></> },
    { n: 2, html: <><span className="text-gray-500"># Write your Python code below</span></> },
    { n: 3, html: null },
    { n: 4, html: <><span className="text-purple-400">def</span> <span className="text-blue-300">greet_coder</span>(name):</> },
    { n: 5, html: <>&nbsp;&nbsp;&nbsp;&nbsp;message = <span className="text-green-400">"Hello, "</span> + name + <span className="text-green-400">"! 🎉"</span></> },
    { n: 6, html: <>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">print</span>(message)</> },
    { n: 7, html: <>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">return</span> <span className="text-purple-400">len</span>(message)</> },
    { n: 8, html: null },
    { n: 9, html: <><span className="text-gray-500"># Your name goes here!</span></> },
    { n: 10, html: <>your_name = <span className="text-green-400">"Arjun"</span></> },
    { n: 11, html: <>chars = <span className="text-blue-300">greet_coder</span>(your_name)</> },
    { n: 12, html: null },
    { n: 13, html: <><span className="text-purple-400">print</span>(<span className="text-green-400">"Your greeting has"</span>, chars, <span className="text-green-400">"characters!"</span>)</> },
    { n: 14, html: null },
    { n: 15, html: <><span className="text-gray-500"># Try changing your name above and run again! ⚡</span></> },
    { n: 16, html: <><span className="text-purple-400">for</span> i <span className="text-purple-400">in</span> <span className="text-blue-300">range</span>(<span className="text-yellow-400">3</span>):</> },
    { n: 17, html: <>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">print</span>(<span className="text-green-400">"⭐"</span> * (i+<span className="text-yellow-400">1</span>))</> },
  ];
  return (
    <div className="flex h-screen pt-16">
      {/* editor */}
      <div className="flex-1 flex flex-col bg-gray-950">
        <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-sm">💻</span>
            {["Python", "JavaScript", "HTML"].map((t, i) => (
              <div key={t} className={`text-xs px-4 py-1.5 rounded-full cursor-pointer ${i === 0 ? "bg-indigo-500 text-white font-bold" : "text-gray-400 hover:text-white"}`}>{t}</div>
            ))}
          </div>
          <div className="flex gap-2">
            <button className="bg-white/10 text-gray-300 px-4 py-1.5 rounded-full text-xs hover:bg-white/20 transition">🔄 Reset</button>
            <button onClick={runCode} className="bg-gradient-to-r from-green-500 to-emerald-400 text-white px-5 py-1.5 rounded-full text-xs font-bold hover:shadow-lg hover:scale-105 transition">▶ Run Code</button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4 font-mono text-sm text-gray-200">
          {codeLines.map((l) => (
            <div key={l.n} className="flex gap-4 leading-7">
              <span className="text-gray-600 select-none w-5 text-right flex-shrink-0">{l.n}</span>
              <span>{l.html}</span>
            </div>
          ))}
        </div>
        <div className="px-4 py-3 bg-gray-900 border-t border-gray-800 flex flex-wrap gap-2">
          <div className="text-gray-500 text-xs font-semibold uppercase tracking-wider mr-2">🎯 Challenges</div>
          {[
            { label: "✅ Hello World", done: true },
            { label: "✅ Variables", done: true },
            { label: "▶ Functions", active: true },
            { label: "Loops" }, { label: "Lists" }, { label: "Dicts" }, { label: "Classes" },
          ].map((c) => (
            <div key={c.label} className={`text-xs px-3 py-1 rounded-full cursor-pointer border ${
              c.done ? "bg-green-500/20 border-green-500/40 text-green-400" :
              c.active ? "bg-indigo-500/20 border-indigo-400/40 text-indigo-300" :
              "bg-white/5 border-white/10 text-gray-500"
            }`}>{c.label}</div>
          ))}
        </div>
      </div>
      {/* output */}
      <div className="w-80 flex-shrink-0 flex flex-col bg-gray-900 border-l border-gray-800">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-gray-400 text-xs ml-2">Output</span>
        </div>
        <div className="flex-1 p-4 font-mono text-sm overflow-auto">
          {output ? (
            <div className="flex flex-col gap-1">{output}</div>
          ) : (
            <>
              <div className="text-gray-500 text-xs mb-4 flex items-center gap-2"><span>🕐</span> Press Run to execute your code</div>
              <div className="bg-indigo-50 rounded-xl p-4 mb-4">
                <div className="text-xs font-bold text-indigo-600 mb-1">💡 HINT</div>
                <div className="text-xs text-gray-600 leading-relaxed">Try changing <code className="bg-indigo-100 px-1 py-0.5 rounded text-indigo-700">your_name</code> to your own name and press Run!</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-500 mb-2">🎯 This Challenge</div>
                <div className="text-xs text-gray-600 leading-relaxed">Create a function that takes a name and prints a custom greeting. Then call it 3 times with different names!</div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── live classes page ─────────────────────────────────────────────────────
function LivePage() {
  return (
    <div>
      <div className="pt-24 pb-12 px-8 bg-gradient-to-br from-indigo-600 to-purple-700 text-white text-center">
        <h1 className="font-['Poppins'] text-4xl font-black mb-2">🎙️ Live Classes</h1>
        <p className="text-indigo-200 text-lg">Join live sessions with expert teachers and code together in real-time!</p>
      </div>
      <div className="max-w-7xl mx-auto px-8 py-10">
        {/* live now */}
        <SectionLabel>🔴 HAPPENING NOW</SectionLabel>
        <h2 className="font-['Poppins'] font-bold text-2xl text-gray-800 mb-5">Live Sessions</h2>
        <div className="grid sm:grid-cols-2 gap-5 mb-10">
          {[
            { emoji: "🐍", grad: "from-indigo-500 to-purple-600", time: "🕐 Started 20 min ago • 342 watching", title: "Python Functions Deep Dive", teacher: "👩‍💻 Ms. Kavita Sharma", badge: "● LIVE", btnLabel: "Join Live Class 🚀", live: true },
            { emoji: "🌐", grad: "from-green-500 to-emerald-600", time: "🕑 Started 5 min ago • 128 watching", title: "CSS Animations Workshop", teacher: "👨‍💻 Mr. Rajan Mehta", badge: "● LIVE", btnLabel: "Join Live Class 🚀", live: true },
          ].map((s) => (
            <div key={s.title} className="bg-white/80 backdrop-blur border border-white/80 rounded-2xl overflow-hidden hover:shadow-xl transition">
              <div className={`h-36 bg-gradient-to-br ${s.grad} flex items-center justify-center text-5xl relative`}>
                {s.emoji}
                <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold animate-pulse">{s.badge}</div>
              </div>
              <div className="p-5">
                <div className="text-gray-400 text-xs mb-1">{s.time}</div>
                <div className="font-['Poppins'] font-bold text-gray-800 text-lg mb-1">{s.title}</div>
                <div className="text-gray-500 text-sm mb-4">{s.teacher}</div>
                <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2.5 rounded-xl font-bold text-sm hover:shadow-lg hover:scale-105 transition">{s.btnLabel}</button>
              </div>
            </div>
          ))}
        </div>
        {/* upcoming */}
        <SectionLabel>📅 UPCOMING SESSIONS</SectionLabel>
        <h2 className="font-['Poppins'] font-bold text-2xl text-gray-800 mb-5">Upcoming Classes</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {[
            { emoji: "⚡", grad: "from-amber-400 to-orange-500", badge: "Tomorrow 4PM", time: "📅 Wed, Jun 12 • 4:00 PM IST", title: "JavaScript: Build a Quiz Game", teacher: "👩‍💻 Ms. Pooja Singh" },
            { emoji: "🤖", grad: "from-pink-500 to-rose-600", badge: "Thu 5PM", time: "📅 Thu, Jun 13 • 5:00 PM IST", title: "Intro to AI & Machine Learning", teacher: "👨‍💻 Mr. Ankit Joshi" },
            { emoji: "📊", grad: "from-cyan-400 to-blue-600", badge: "Fri 3PM", time: "📅 Fri, Jun 14 • 3:00 PM IST", title: "Data Visualization with Python", teacher: "👩‍💻 Ms. Nisha Patel" },
          ].map((s) => (
            <div key={s.title} className="bg-white/80 backdrop-blur border border-white/80 rounded-2xl overflow-hidden hover:shadow-xl transition">
              <div className={`h-36 bg-gradient-to-br ${s.grad} flex items-center justify-center text-5xl relative`}>
                {s.emoji}
                <div className="absolute top-3 right-3 bg-white/20 text-white text-xs px-3 py-1 rounded-full font-bold">{s.badge}</div>
              </div>
              <div className="p-5">
                <div className="text-gray-400 text-xs mb-1">{s.time}</div>
                <div className="font-['Poppins'] font-bold text-gray-800 mb-1">{s.title}</div>
                <div className="text-gray-500 text-sm mb-4">{s.teacher}</div>
                <button className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white py-2.5 rounded-xl font-bold text-sm hover:shadow-lg hover:scale-105 transition">Set Reminder 🔔</button>
              </div>
            </div>
          ))}
        </div>
        {/* recordings */}
        <SectionLabel>📹 RECORDINGS</SectionLabel>
        <h2 className="font-['Poppins'] font-bold text-2xl text-gray-800 mb-5">Past Recordings</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {[
            { emoji: "🎨", time: "📹 Recorded • 1h 12min • 2.3k views", title: "Scratch: Build Your First Game", teacher: "👨‍💻 Mr. Vikram Das" },
            { emoji: "🐍", time: "📹 Recorded • 58min • 4.1k views", title: "Python Lists & Dictionaries", teacher: "👩‍💻 Ms. Kavita Sharma" },
          ].map((s) => (
            <div key={s.title} className="bg-white/80 backdrop-blur border border-white/80 rounded-2xl overflow-hidden hover:shadow-xl transition">
              <div className="h-36 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-5xl">{s.emoji}</div>
              <div className="p-5">
                <div className="text-gray-400 text-xs mb-1">{s.time}</div>
                <div className="font-['Poppins'] font-bold text-gray-800 mb-1">{s.title}</div>
                <div className="text-gray-500 text-sm mb-4">{s.teacher}</div>
                <button className="w-full bg-gray-800 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-gray-700 transition">▶ Watch Recording</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── login page ────────────────────────────────────────────────────────────
function LoginPage({ showPage }) {
  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="w-full max-w-md bg-white/80 backdrop-blur border border-white/80 rounded-3xl p-10 shadow-2xl">
        <div className="text-center text-6xl mb-4">🚀</div>
        <h2 className="font-['Poppins'] text-2xl font-black text-gray-800 text-center mb-1">Welcome Back!</h2>
        <p className="text-gray-500 text-sm text-center mb-7">Login to continue your coding adventure</p>
        <div className="mb-4">
          <label className="block text-xs font-bold text-gray-600 mb-2">Email Address</label>
          <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400 bg-white/80" type="email" placeholder="arjun@school.com" />
        </div>
        <div className="mb-6">
          <label className="block text-xs font-bold text-gray-600 mb-2">Password</label>
          <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400 bg-white/80" type="password" placeholder="••••••••" />
          <div className="text-right mt-2"><a href="#" className="text-xs text-indigo-600 font-semibold">Forgot Password?</a></div>
        </div>
        <button
          onClick={() => { showPage("dashboard"); launchConfetti(); }}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3.5 rounded-xl font-bold text-sm shadow hover:shadow-lg hover:scale-[1.02] transition mb-5"
        >
          Login & Start Coding! 🎮
        </button>
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-medium">or continue with</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <button className="w-full flex items-center justify-center gap-3 border border-gray-200 bg-white rounded-xl py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition mb-5">
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>
        <div className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <a onClick={launchConfetti} className="text-indigo-600 font-bold cursor-pointer hover:underline">Sign up FREE →</a>
        </div>
      </div>
    </div>
  );
}

// ─── app root ──────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");

  const showPage = (p) => {
    setPage(p);
    window.scrollTo(0, 0);
  };

  const noNavPages = ["playground", "dashboard"];
  const showNavbar = !noNavPages.includes(page);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 font-['Plus_Jakarta_Sans',sans-serif]">
      <BgBlobs />
      {showNavbar && <Navbar showPage={showPage} activePage={page} />}
      <div className="relative z-10">
        {page === "home" && <HomePage showPage={showPage} />}
        {page === "courses" && <CoursesPage showPage={showPage} />}
        {page === "detail" && <DetailPage showPage={showPage} />}
        {page === "dashboard" && <DashboardPage showPage={showPage} />}
        {page === "playground" && <PlaygroundPage />}
        {page === "live" && <LivePage />}
        {page === "login" && <LoginPage showPage={showPage} />}
      </div>
    </div>
  );
}
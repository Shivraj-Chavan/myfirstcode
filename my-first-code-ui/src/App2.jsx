// import { useState, useEffect } from "react";

// // ============================================================
// // GLOBAL STYLES (injected via style tag)
// // ============================================================
// const GlobalStyles = () => (
//   <style>{`
//     @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');

//     *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//     :root {
//       --indigo: #4F46E5;
//       --indigo-light: #818CF8;
//       --indigo-dark: #3730A3;
//       --green: #22C55E;
//       --green-light: #86EFAC;
//       --yellow: #F59E0B;
//       --pink: #EC4899;
//       --cyan: #06B6D4;
//       --purple: #A855F7;
//       --glass: rgba(255,255,255,0.12);
//       --glass-border: rgba(255,255,255,0.25);
//       --glass-dark: rgba(255,255,255,0.06);
//     }

//     html { scroll-behavior: smooth; }

//     body {
//       font-family: 'DM Sans', sans-serif;
//       background: linear-gradient(135deg, #0F0C29 0%, #1a1560 40%, #24243e 100%);
//       min-height: 100vh;
//       color: #fff;
//       overflow-x: hidden;
//     }

//     h1,h2,h3,h4,h5,h6 { font-family: 'Poppins', sans-serif; }

//     .glass {
//       background: rgba(255,255,255,0.08);
//       backdrop-filter: blur(20px);
//       -webkit-backdrop-filter: blur(20px);
//       border: 1px solid rgba(255,255,255,0.18);
//     }

//     .glass-card {
//       background: rgba(255,255,255,0.07);
//       backdrop-filter: blur(24px);
//       -webkit-backdrop-filter: blur(24px);
//       border: 1px solid rgba(255,255,255,0.15);
//       border-radius: 20px;
//       transition: all 0.3s ease;
//     }

//     .glass-card:hover {
//       background: rgba(255,255,255,0.12);
//       border-color: rgba(255,255,255,0.3);
//       transform: translateY(-4px);
//       box-shadow: 0 20px 60px rgba(79,70,229,0.3);
//     }

//     .btn-primary {
//       background: linear-gradient(135deg, #4F46E5, #7C3AED);
//       border: none;
//       border-radius: 14px;
//       color: white;
//       font-family: 'Poppins', sans-serif;
//       font-weight: 600;
//       cursor: pointer;
//       position: relative;
//       overflow: hidden;
//       transition: all 0.3s ease;
//       box-shadow: 0 4px 20px rgba(79,70,229,0.5);
//     }

//     .btn-primary:hover {
//       transform: translateY(-2px) scale(1.02);
//       box-shadow: 0 8px 30px rgba(79,70,229,0.7);
//     }

//     .btn-primary::after {
//       content: '';
//       position: absolute;
//       inset: 0;
//       background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent);
//       border-radius: inherit;
//     }

//     .btn-glass {
//       background: rgba(255,255,255,0.1);
//       backdrop-filter: blur(12px);
//       border: 1px solid rgba(255,255,255,0.25);
//       border-radius: 14px;
//       color: white;
//       font-family: 'Poppins', sans-serif;
//       font-weight: 600;
//       cursor: pointer;
//       transition: all 0.3s ease;
//     }

//     .btn-glass:hover {
//       background: rgba(255,255,255,0.2);
//       border-color: rgba(255,255,255,0.4);
//       transform: translateY(-2px);
//     }

//     .btn-green {
//       background: linear-gradient(135deg, #22C55E, #16A34A);
//       border: none;
//       border-radius: 14px;
//       color: white;
//       font-family: 'Poppins', sans-serif;
//       font-weight: 600;
//       cursor: pointer;
//       transition: all 0.3s ease;
//       box-shadow: 0 4px 20px rgba(34,197,94,0.4);
//     }

//     .btn-green:hover {
//       transform: translateY(-2px) scale(1.02);
//       box-shadow: 0 8px 30px rgba(34,197,94,0.6);
//     }

//     .progress-bar {
//       height: 8px;
//       background: rgba(255,255,255,0.1);
//       border-radius: 100px;
//       overflow: hidden;
//     }

//     .progress-fill {
//       height: 100%;
//       border-radius: 100px;
//       background: linear-gradient(90deg, #4F46E5, #22C55E);
//       transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1);
//       position: relative;
//     }

//     .progress-fill::after {
//       content: '';
//       position: absolute;
//       right: 0;
//       top: 50%;
//       transform: translateY(-50%);
//       width: 12px;
//       height: 12px;
//       background: white;
//       border-radius: 50%;
//       box-shadow: 0 0 8px rgba(79,70,229,0.8);
//     }

//     .glow-text {
//       text-shadow: 0 0 30px rgba(79,70,229,0.8), 0 0 60px rgba(79,70,229,0.4);
//     }

//     .badge {
//       display: inline-flex;
//       align-items: center;
//       gap: 4px;
//       padding: 4px 10px;
//       border-radius: 100px;
//       font-size: 11px;
//       font-weight: 600;
//       font-family: 'Poppins', sans-serif;
//     }

//     .badge-indigo { background: rgba(79,70,229,0.25); color: #818CF8; border: 1px solid rgba(79,70,229,0.4); }
//     .badge-green { background: rgba(34,197,94,0.2); color: #86EFAC; border: 1px solid rgba(34,197,94,0.35); }
//     .badge-yellow { background: rgba(245,158,11,0.2); color: #FCD34D; border: 1px solid rgba(245,158,11,0.35); }
//     .badge-pink { background: rgba(236,72,153,0.2); color: #F9A8D4; border: 1px solid rgba(236,72,153,0.35); }
//     .badge-cyan { background: rgba(6,182,212,0.2); color: #67E8F9; border: 1px solid rgba(6,182,212,0.35); }

//     .sidebar-item {
//       display: flex;
//       align-items: center;
//       gap: 10px;
//       padding: 10px 14px;
//       border-radius: 12px;
//       cursor: pointer;
//       transition: all 0.2s ease;
//       font-family: 'Poppins', sans-serif;
//       font-weight: 500;
//       font-size: 14px;
//       color: rgba(255,255,255,0.65);
//     }

//     .sidebar-item:hover {
//       background: rgba(255,255,255,0.08);
//       color: white;
//     }

//     .sidebar-item.active {
//       background: rgba(79,70,229,0.3);
//       color: white;
//       border: 1px solid rgba(79,70,229,0.5);
//     }

//     .course-card {
//       border-radius: 20px;
//       overflow: hidden;
//       position: relative;
//       transition: all 0.35s ease;
//       cursor: pointer;
//     }

//     .course-card:hover {
//       transform: translateY(-6px) scale(1.01);
//       box-shadow: 0 24px 60px rgba(0,0,0,0.4);
//     }

//     .floating { animation: floating 3s ease-in-out infinite; }
//     .floating-slow { animation: floating 5s ease-in-out infinite; }
//     .floating-alt { animation: floating 3s ease-in-out infinite 1.5s; }

//     @keyframes floating {
//       0%, 100% { transform: translateY(0px); }
//       50% { transform: translateY(-12px); }
//     }

//     @keyframes pulse-glow {
//       0%, 100% { box-shadow: 0 0 20px rgba(79,70,229,0.4); }
//       50% { box-shadow: 0 0 40px rgba(79,70,229,0.8), 0 0 80px rgba(79,70,229,0.3); }
//     }

//     @keyframes slideIn {
//       from { opacity: 0; transform: translateY(20px); }
//       to { opacity: 1; transform: translateY(0); }
//     }

//     @keyframes fadeIn {
//       from { opacity: 0; }
//       to { opacity: 1; }
//     }

//     @keyframes scaleIn {
//       from { opacity: 0; transform: scale(0.95); }
//       to { opacity: 1; transform: scale(1); }
//     }

//     @keyframes confettiFall {
//       0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
//       100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
//     }

//     @keyframes streakPulse {
//       0%, 100% { filter: brightness(1); }
//       50% { filter: brightness(1.3) drop-shadow(0 0 8px #F59E0B); }
//     }

//     @keyframes typewriter {
//       from { width: 0; }
//       to { width: 100%; }
//     }

//     @keyframes blink {
//       0%, 100% { border-color: transparent; }
//       50% { border-color: #4F46E5; }
//     }

//     @keyframes orbitSpin {
//       from { transform: rotate(0deg) translateX(60px) rotate(0deg); }
//       to { transform: rotate(360deg) translateX(60px) rotate(-360deg); }
//     }

//     @keyframes bgPulse {
//       0%, 100% { opacity: 0.4; transform: scale(1); }
//       50% { opacity: 0.7; transform: scale(1.05); }
//     }

//     @keyframes shimmer {
//       0% { background-position: -200% center; }
//       100% { background-position: 200% center; }
//     }

//     .shimmer-text {
//       background: linear-gradient(90deg, #818CF8, #ffffff, #22C55E, #F59E0B, #818CF8);
//       background-size: 200% auto;
//       -webkit-background-clip: text;
//       -webkit-text-fill-color: transparent;
//       background-clip: text;
//       animation: shimmer 4s linear infinite;
//     }

//     .page-enter { animation: slideIn 0.4s ease forwards; }

//     .stat-card {
//       border-radius: 20px;
//       padding: 20px;
//       position: relative;
//       overflow: hidden;
//       transition: all 0.3s ease;
//     }

//     .stat-card:hover {
//       transform: translateY(-4px);
//     }

//     .stat-card::before {
//       content: '';
//       position: absolute;
//       top: -50%;
//       right: -20%;
//       width: 120px;
//       height: 120px;
//       border-radius: 50%;
//       background: rgba(255,255,255,0.05);
//     }

//     .input-glass {
//       background: rgba(255,255,255,0.06);
//       border: 1px solid rgba(255,255,255,0.15);
//       border-radius: 14px;
//       color: white;
//       font-family: 'DM Sans', sans-serif;
//       font-size: 14px;
//       padding: 12px 16px;
//       width: 100%;
//       transition: all 0.3s ease;
//       outline: none;
//     }

//     .input-glass::placeholder { color: rgba(255,255,255,0.35); }

//     .input-glass:focus {
//       border-color: rgba(79,70,229,0.6);
//       background: rgba(255,255,255,0.1);
//       box-shadow: 0 0 0 3px rgba(79,70,229,0.15);
//     }

//     .code-editor {
//       font-family: 'JetBrains Mono', monospace;
//       font-size: 13px;
//       line-height: 1.7;
//       background: #0D0D1A;
//       border-radius: 16px;
//       padding: 20px;
//       border: 1px solid rgba(79,70,229,0.3);
//       resize: none;
//       outline: none;
//       color: #E2E8F0;
//       width: 100%;
//       height: 100%;
//     }

//     .scrollbar-hide::-webkit-scrollbar { display: none; }
//     .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

//     ::-webkit-scrollbar { width: 6px; }
//     ::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); }
//     ::-webkit-scrollbar-thumb { background: rgba(79,70,229,0.4); border-radius: 10px; }
//     ::-webkit-scrollbar-thumb:hover { background: rgba(79,70,229,0.7); }

//     .nav-blur {
//       background: rgba(15,12,41,0.75);
//       backdrop-filter: blur(24px);
//       -webkit-backdrop-filter: blur(24px);
//       border-bottom: 1px solid rgba(255,255,255,0.08);
//     }

//     .hero-glow {
//       position: absolute;
//       border-radius: 50%;
//       filter: blur(80px);
//       animation: bgPulse 4s ease-in-out infinite;
//     }

//     .tab-active {
//       background: rgba(79,70,229,0.3);
//       color: white;
//       border: 1px solid rgba(79,70,229,0.5);
//     }

//     .accordion-content {
//       max-height: 0;
//       overflow: hidden;
//       transition: max-height 0.4s ease;
//     }

//     .accordion-content.open {
//       max-height: 1000px;
//     }

//     .xp-bar {
//       height: 6px;
//       background: rgba(255,255,255,0.08);
//       border-radius: 100px;
//       overflow: hidden;
//     }

//     .xp-fill {
//       height: 100%;
//       background: linear-gradient(90deg, #F59E0B, #EC4899);
//       border-radius: 100px;
//       transition: width 1.5s ease;
//     }

//     select.input-glass option { background: #1a1560; color: white; }

//     .trophy-glow { animation: pulse-glow 2s ease-in-out infinite; }

//     .confetti-piece {
//       position: fixed;
//       width: 10px;
//       height: 10px;
//       border-radius: 2px;
//       animation: confettiFall linear forwards;
//       pointer-events: none;
//       z-index: 9999;
//     }

//     .streak-icon { animation: streakPulse 1.5s ease-in-out infinite; }

//     .orbit-dot {
//       position: absolute;
//       width: 10px;
//       height: 10px;
//       border-radius: 50%;
//       animation: orbitSpin 4s linear infinite;
//     }
//   `}</style>
// );

// // ============================================================
// // CONFETTI
// // ============================================================
// const Confetti = ({ active }) => {
//   if (!active) return null;
//   const pieces = Array.from({ length: 40 }, (_, i) => ({
//     id: i,
//     left: Math.random() * 100,
//     color: ['#4F46E5','#22C55E','#F59E0B','#EC4899','#06B6D4','#A855F7'][Math.floor(Math.random()*6)],
//     delay: Math.random() * 0.8,
//     duration: 1.5 + Math.random() * 1.5,
//     size: 6 + Math.random() * 8,
//   }));
//   return (
//     <>
//       {pieces.map(p => (
//         <div key={p.id} className="confetti-piece" style={{
//           left: `${p.left}%`,
//           top: -20,
//           background: p.color,
//           width: p.size,
//           height: p.size,
//           animationDuration: `${p.duration}s`,
//           animationDelay: `${p.delay}s`,
//         }} />
//       ))}
//     </>
//   );
// };

// // ============================================================
// // NAVBAR
// // ============================================================
// const Navbar = ({ page, setPage, user, setShowAuth }) => {
// //   const [scrolled, setScrolled] = useState(false);
// //   const [menuOpen, setMenuOpen] = useState(false);

//   useEffect(() => {
//     const handler = () => setScrolled(window.scrollY > 20);
//     window.addEventListener('scroll', handler);
//     return () => window.removeEventListener('scroll', handler);
//   }, []);

//   const navItems = ['Home', 'Courses', 'Playground', 'Live Classes'];

//   return (
//     <nav className="nav-blur" style={{ position: 'sticky', top: 0, zIndex: 100, padding: '0 24px' }}>
//       <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', height: 64, gap: 8 }}>
//         {/* Logo */}
//         <div onClick={() => setPage('home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, marginRight: 32 }}>
//           <div style={{
//             width: 36, height: 36, borderRadius: 12,
//             background: 'linear-gradient(135deg, #4F46E5, #A855F7)',
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//             fontSize: 18, boxShadow: '0 4px 15px rgba(79,70,229,0.5)'
//           }}>🚀</div>
//           <span style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 18 }}>
//             My<span style={{ color: '#818CF8' }}>First</span>Code
//           </span>
//         </div>

//         {/* Nav Items */}
//         <div style={{ display: 'flex', gap: 4, flex: 1 }}>
//           {navItems.map(item => (
//             <button key={item} onClick={() => setPage(item.toLowerCase().replace(' ', '-'))}
//               className="btn-glass"
//               style={{
//                 padding: '7px 14px',
//                 fontSize: 13,
//                 background: page === item.toLowerCase().replace(' ', '-') ? 'rgba(79,70,229,0.3)' : 'transparent',
//                 border: page === item.toLowerCase().replace(' ', '-') ? '1px solid rgba(79,70,229,0.5)' : '1px solid transparent',
//               }}>
//               {item}
//             </button>
//           ))}
//         </div>

//         {/* Right */}
//         <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
//           {user ? (
//             <>
//               <button onClick={() => setPage('dashboard')} className="btn-glass" style={{ padding: '7px 14px', fontSize: 13 }}>
//                 📊 Dashboard
//               </button>
//               <div onClick={() => setPage('dashboard')} style={{
//                 width: 36, height: 36, borderRadius: 50,
//                 background: 'linear-gradient(135deg, #4F46E5, #22C55E)',
//                 display: 'flex', alignItems: 'center', justifyContent: 'center',
//                 fontSize: 15, cursor: 'pointer', border: '2px solid rgba(255,255,255,0.3)'
//               }}>
//                 {user.avatar}
//               </div>
//             </>
//           ) : (
//             <>
//               <button onClick={() => setShowAuth('login')} className="btn-glass" style={{ padding: '7px 16px', fontSize: 13 }}>Login</button>
//               <button onClick={() => setShowAuth('signup')} className="btn-primary" style={{ padding: '7px 16px', fontSize: 13 }}>
//                 Start Free
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// // ============================================================
// // AUTH MODAL
// // ============================================================
// const AuthModal = ({ mode, onClose, onAuth }) => {
//   const [tab, setTab] = useState(mode);
//   const [role, setRole] = useState('student');
//   const [form, setForm] = useState({ name: '', email: '', password: '' });
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = () => {
//     if (!form.email || !form.password) return;
//     setLoading(true);
//     setTimeout(() => {
//       setLoading(false);
//       onAuth({
//         name: form.name || form.email.split('@')[0],
//         email: form.email,
//         role,
//         avatar: role === 'teacher' ? '👩‍🏫' : '🧑‍💻',
//         xp: 1250, streak: 7, progress: 68, level: 5,
//         badges: ['🌟','🔥','💎','⚡'],
//       });
//       onClose();
//     }, 1200);
//   };

//   return (
//     <div style={{
//       position: 'fixed', inset: 0, zIndex: 999,
//       background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
//       display: 'flex', alignItems: 'center', justifyContent: 'center',
//       animation: 'fadeIn 0.2s ease'
//     }} onClick={onClose}>
//       <div className="glass-card" style={{ width: 420, padding: 36, animation: 'scaleIn 0.3s ease' }}
//         onClick={e => e.stopPropagation()}>

//         {/* Header */}
//         <div style={{ textAlign: 'center', marginBottom: 28 }}>
//           <div style={{ fontSize: 40, marginBottom: 8 }}>{tab === 'login' ? '🔐' : '🎉'}</div>
//           <h2 style={{ fontSize: 24, fontWeight: 800 }}>
//             {tab === 'login' ? 'Welcome Back!' : 'Join MyFirstCode'}
//           </h2>
//           <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 4 }}>
//             {tab === 'login' ? 'Continue your coding journey' : 'Start learning to code today '}
//           </p>
//         </div>

//         {/* Tabs */}
//         <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'rgba(255,255,255,0.05)', borderRadius: 14, padding: 4 }}>
//           {['login','signup'].map(t => (
//             <button key={t} onClick={() => setTab(t)} style={{
//               flex: 1, padding: '8px', borderRadius: 10, border: 'none',
//               background: tab === t ? 'rgba(79,70,229,0.5)' : 'transparent',
//               color: 'white', fontFamily: 'Poppins', fontWeight: 600, fontSize: 13,
//               cursor: 'pointer', transition: 'all 0.2s ease',
//             }}>{t === 'login' ? 'Login' : 'Sign Up'}</button>
//           ))}
//         </div>

//         {/* Role selector */}
//         <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
//           {[['student','🧑‍💻','Student'],['teacher','👩‍🏫','Teacher']].map(([r, em, label]) => (
//             <button key={r} onClick={() => setRole(r)} style={{
//               flex: 1, padding: '10px', borderRadius: 14,
//               border: role === r ? '2px solid rgba(79,70,229,0.6)' : '1px solid rgba(255,255,255,0.1)',
//               background: role === r ? 'rgba(79,70,229,0.2)' : 'rgba(255,255,255,0.04)',
//               color: 'white', cursor: 'pointer', transition: 'all 0.2s ease',
//               fontFamily: 'Poppins', fontWeight: 600, fontSize: 13,
//             }}>{em} {label}</button>
//           ))}
//         </div>

//         {/* Fields */}
//         <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
//           {tab === 'signup' && (
//             <input className="input-glass" placeholder="👤 Your Name" value={form.name}
//               onChange={e => setForm({...form, name: e.target.value})} />
//           )}
//           <input className="input-glass" placeholder="📧 Email address" type="email" value={form.email}
//             onChange={e => setForm({...form, email: e.target.value})} />
//           <input className="input-glass" placeholder="🔒 Password" type="password" value={form.password}
//             onChange={e => setForm({...form, password: e.target.value})} />
//         </div>

//         <button onClick={handleSubmit} className="btn-primary" style={{
//           width: '100%', padding: '13px', fontSize: 15, marginTop: 20,
//           opacity: loading ? 0.7 : 1,
//         }}>
//           {loading ? '⏳ Loading...' : tab === 'login' ? ' Login' : ' Create Account'}
//         </button>

//         {/* Divider */}
//         <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' }}>
//           <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
//           <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>or continue with</span>
//           <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
//         </div>

//         <button onClick={handleSubmit} className="btn-glass" style={{
//           width: '100%', padding: '11px', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
//         }}>
//           <span style={{ fontSize: 18 }}>🌐</span> Continue with Google
//         </button>

//         <button onClick={onClose} style={{
//           display: 'block', margin: '16px auto 0', background: 'none', border: 'none',
//           color: 'rgba(255,255,255,0.35)', cursor: 'pointer', fontSize: 12,
//         }}>Close</button>
//       </div>
//     </div>
//   );
// };

// // ============================================================
// // HOME PAGE
// // ============================================================
// const HomePage = ({ setPage, setShowAuth, user }) => {
//   const courses = [
//     { grade: '6th', icon: '🌱', color: '#22C55E', label: 'Scratch & Basics', students: '2.4k' },
//     { grade: '7th', icon: '🐍', color: '#06B6D4', label: 'Python Intro', students: '3.1k' },
//     { grade: '8th', icon: '🌐', color: '#4F46E5', label: 'Web Dev Basics', students: '2.8k' },
//     { grade: '9th', icon: '⚙️', color: '#A855F7', label: 'JS & Logic', students: '1.9k' },
//     { grade: '10th', icon: '🤖', color: '#F59E0B', label: 'AI & Projects', students: '1.5k' },
//   ];

//   const features = [
//     { icon: '🎥', title: 'Recorded Videos', desc: '500+ HD video lessons at your pace', color: '#4F46E5' },
//     { icon: '📡', title: 'Live Classes', desc: 'Weekly live sessions with expert teachers', color: '#22C55E' },
//     { icon: '💻', title: 'Code Practice', desc: 'Built-in playground with 200+ challenges', color: '#F59E0B' },
//     { icon: '🏆', title: 'Certificates', desc: 'Earn verified certificates to share', color: '#EC4899' },
//   ];

//   const testimonials = [
//     { name: 'Priya S.', grade: '8th Grade', text: 'I built my first website in just 3 weeks! The gamification keeps me going every day 🔥', avatar: '👧', stars: 5 },
//     { name: 'Arjun K.', grade: '9th Grade', text: 'Best coding platform for students. The live classes are super interactive and fun!', avatar: '👦', stars: 5 },
//     { name: 'Meera P.', grade: '7th Grade', text: 'I earned 5 badges this week! The challenges are addictive and I actually learn a lot.', avatar: '👩', stars: 5 },
//   ];

//   return (
//     <div style={{ animation: 'slideIn 0.4s ease' }}>
//       {/* Hero */}
//       <div style={{ position: 'relative', padding: '80px 24px 100px', textAlign: 'center', overflow: 'hidden', maxWidth: 1200, margin: '0 auto' }}>
//         {/* BG Glows */}
//         <div className="hero-glow" style={{ width: 500, height: 500, background: 'rgba(79,70,229,0.2)', top: -100, left: '10%' }} />
//         <div className="hero-glow" style={{ width: 400, height: 400, background: 'rgba(34,197,94,0.15)', top: 0, right: '5%', animationDelay: '2s' }} />

//         <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px',
//           background: 'rgba(79,70,229,0.2)', border: '1px solid rgba(79,70,229,0.4)',
//           borderRadius: 100, fontSize: 13, marginBottom: 24, fontFamily: 'Poppins', fontWeight: 600 }}>
//           <span>⚡</span> 50,000+ students coding with us
//         </div>

//         <h1 className="shimmer-text" style={{ fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 900, lineHeight: 1.1, marginBottom: 20 }}>
//           Learn Coding<br />the Fun Way 🚀
//         </h1>

//         <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.65)', maxWidth: 540, margin: '0 auto 36px', lineHeight: 1.7 }}>
//           Gamified coding lessons for grades 6–10. Earn XP, unlock badges, and build real projects while having fun! 🎮
//         </p>

//         <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
//           <button onClick={() => user ? setPage('courses') : setShowAuth('signup')}
//             className="btn-primary" style={{ padding: '14px 32px', fontSize: 16, animation: 'pulse-glow 2.5s ease-in-out infinite' }}>
//              Start Learning Free
//           </button>
//           <button className="btn-glass" style={{ padding: '14px 28px', fontSize: 16 }}>
//             ▶ Watch Demo
//           </button>
//         </div>

//         {/* Floating stats */}
//         <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 56, flexWrap: 'wrap' }}>
//           {[['50K+','Students'],['500+','Lessons'],['200+','Challenges'],['98%','Pass Rate']].map(([num, label]) => (
//             <div key={label} className="glass-card" style={{ padding: '16px 28px', textAlign: 'center', minWidth: 110 }}>
//               <div style={{ fontSize: 24, fontWeight: 800, fontFamily: 'Poppins', color: '#818CF8' }}>{num}</div>
//               <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{label}</div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Courses by grade */}
//       <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 80px' }}>
//         <div style={{ textAlign: 'center', marginBottom: 40 }}>
//           <span className="badge badge-indigo" style={{ marginBottom: 12 }}>🎓 By Grade</span>
//           <h2 style={{ fontSize: 36, fontWeight: 800 }}>Choose Your Grade</h2>
//           <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 8 }}>Age-appropriate content designed for every level</p>
//         </div>

//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
//           {courses.map(c => (
//             <div key={c.grade} className="glass-card" onClick={() => setPage('courses')} style={{ padding: 24, cursor: 'pointer', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
//               <div style={{
//                 position: 'absolute', top: -20, right: -20,
//                 width: 80, height: 80, borderRadius: 50,
//                 background: `${c.color}20`,
//               }} />
//               <div style={{ fontSize: 40, marginBottom: 12 }}>{c.icon}</div>
//               <div style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 20, color: c.color }}>{c.grade}</div>
//               <div style={{ fontSize: 14, fontWeight: 600, fontFamily: 'Poppins', marginTop: 4 }}>{c.label}</div>
//               <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 6 }}>{c.students} students</div>
//               <div style={{ marginTop: 14, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 100, overflow: 'hidden' }}>
//                 <div style={{ height: '100%', width: '65%', background: `linear-gradient(90deg, ${c.color}, ${c.color}aa)`, borderRadius: 100 }} />
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Features */}
//       <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 80px' }}>
//         <div style={{ textAlign: 'center', marginBottom: 40 }}>
//           <span className="badge badge-green" style={{ marginBottom: 12 }}>⚡ Features</span>
//           <h2 style={{ fontSize: 36, fontWeight: 800 }}>Everything You Need</h2>
//         </div>

//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
//           {features.map(f => (
//             <div key={f.title} className="glass-card" style={{ padding: 28 }}>
//               <div style={{
//                 width: 56, height: 56, borderRadius: 16, marginBottom: 16,
//                 background: `${f.color}22`,
//                 display: 'flex', alignItems: 'center', justifyContent: 'center',
//                 fontSize: 28, border: `1px solid ${f.color}44`,
//               }}>{f.icon}</div>
//               <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>{f.title}</h3>
//               <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* XP / Gamification preview */}
//       <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 80px' }}>
//         <div className="glass-card" style={{ padding: 40, background: 'linear-gradient(135deg, rgba(79,70,229,0.15), rgba(168,85,247,0.1))', position: 'relative', overflow: 'hidden' }}>
//           <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: 50, background: 'rgba(79,70,229,0.1)', filter: 'blur(40px)' }} />

//           <div style={{ display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
//             <div style={{ flex: 1, minWidth: 260 }}>
//               <span className="badge badge-yellow" style={{ marginBottom: 16 }}>🏆 Gamification</span>
//               <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>Level Up While Learning! 🎮</h2>
//               <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: 24 }}>
//                 Earn XP for every lesson, maintain streaks, unlock badges, and compete on leaderboards with friends!
//               </p>
//               <button onClick={() => setShowAuth('signup')} className="btn-primary" style={{ padding: '12px 24px', fontSize: 14 }}>
//                 🚀 Start Earning XP
//               </button>
//             </div>

//             <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
//               {[
//                 { label: 'XP Points', val: '1,250', icon: '⚡', color: '#F59E0B' },
//                 { label: 'Streak', val: '7 days', icon: '🔥', color: '#EC4899' },
//                 { label: 'Level', val: 'Level 5', icon: '💎', color: '#818CF8' },
//                 { label: 'Badges', val: '12 earned', icon: '🏅', color: '#22C55E' },
//               ].map(s => (
//                 <div key={s.label} className="stat-card glass" style={{ padding: '18px 22px', minWidth: 130, textAlign: 'center' }}>
//                   <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
//                   <div style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 18, color: s.color }}>{s.val}</div>
//                   <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{s.label}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Testimonials */}
//       <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 80px' }}>
//         <div style={{ textAlign: 'center', marginBottom: 40 }}>
//           <span className="badge badge-pink" style={{ marginBottom: 12 }}>💬 Reviews</span>
//           <h2 style={{ fontSize: 36, fontWeight: 800 }}>Students Love It! ❤️</h2>
//         </div>

//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
//           {testimonials.map(t => (
//             <div key={t.name} className="glass-card" style={{ padding: 28 }}>
//               <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
//                 <div style={{
//                   width: 44, height: 44, borderRadius: 50, fontSize: 22,
//                   background: 'rgba(79,70,229,0.2)',
//                   display: 'flex', alignItems: 'center', justifyContent: 'center',
//                   border: '2px solid rgba(79,70,229,0.4)'
//                 }}>{t.avatar}</div>
//                 <div>
//                   <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 15 }}>{t.name}</div>
//                   <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{t.grade}</div>
//                 </div>
//                 <div style={{ marginLeft: 'auto', color: '#F59E0B', fontSize: 14 }}>{'⭐'.repeat(t.stars)}</div>
//               </div>
//               <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1.7, fontStyle: 'italic' }}>"{t.text}"</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* CTA Banner */}
//       <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 100px' }}>
//         <div style={{
//           borderRadius: 28, padding: '60px 40px', textAlign: 'center',
//           background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #A855F7 100%)',
//           position: 'relative', overflow: 'hidden',
//           boxShadow: '0 30px 80px rgba(79,70,229,0.4)'
//         }}>
//           <div style={{ position: 'absolute', top: -60, left: -60, width: 200, height: 200, borderRadius: 50, background: 'rgba(255,255,255,0.1)' }} />
//           <div style={{ position: 'absolute', bottom: -40, right: -40, width: 160, height: 160, borderRadius: 50, background: 'rgba(255,255,255,0.08)' }} />
//           <div style={{ position: 'relative', zIndex: 1 }}>
//             <h2 style={{ fontSize: 40, fontWeight: 900, marginBottom: 16 }}>Ready to Start Coding? 🚀</h2>
//             <p style={{ fontSize: 18, opacity: 0.85, marginBottom: 32 }}>Join 50,000+ students building their future today!</p>
//             <button onClick={() => setShowAuth('signup')} className="btn-glass" style={{ padding: '14px 36px', fontSize: 16, border: '2px solid rgba(255,255,255,0.5)' }}>
//               🎉 Join for Free – It's Fun!
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ============================================================
// // COURSES PAGE
// // ============================================================
// const CoursesPage = ({ setPage, setCourse }) => {
//   const [gradeFilter, setGradeFilter] = useState('All');
//   const [levelFilter, setLevelFilter] = useState('All');

//   const allCourses = [
//     { id:1, title:'Scratch Programming', grade:'6th', level:'Beginner', icon:'🎨', color:'#22C55E', lessons:24, xp:500, duration:'4 weeks', progress:0, enrolled:2400 },
//     { id:2, title:'Python Basics', grade:'7th', level:'Beginner', icon:'🐍', color:'#06B6D4', lessons:32, xp:750, duration:'6 weeks', progress:65, enrolled:3100 },
//     { id:3, title:'HTML & CSS Intro', grade:'8th', level:'Beginner', icon:'🌐', color:'#4F46E5', lessons:28, xp:600, duration:'5 weeks', progress:30, enrolled:2800 },
//     { id:4, title:'JavaScript Fundamentals', grade:'9th', level:'Intermediate', icon:'⚡', color:'#F59E0B', lessons:40, xp:1000, duration:'8 weeks', progress:0, enrolled:1900 },
//     { id:5, title:'Intro to AI & ML', grade:'10th', level:'Intermediate', icon:'🤖', color:'#A855F7', lessons:36, xp:1200, duration:'7 weeks', progress:0, enrolled:1500 },
//     { id:6, title:'Data Structures', grade:'10th', level:'Advanced', icon:'🧮', color:'#EC4899', lessons:44, xp:1500, duration:'9 weeks', progress:0, enrolled:900 },
//     { id:7, title:'Web Projects with React', grade:'9th', level:'Advanced', icon:'⚛️', color:'#818CF8', lessons:38, xp:1100, duration:'7 weeks', progress:15, enrolled:1200 },
//     { id:8, title:'Python Games', grade:'8th', level:'Intermediate', icon:'🎮', color:'#F97316', lessons:30, xp:800, duration:'6 weeks', progress:0, enrolled:1700 },
//   ];

//   const grades = ['All','6th','7th','8th','9th','10th'];
//   const levels = ['All','Beginner','Intermediate','Advanced'];

//   const filtered = allCourses.filter(c =>
//     (gradeFilter === 'All' || c.grade === gradeFilter) &&
//     (levelFilter === 'All' || c.level === levelFilter)
//   );

//   return (
//     <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)', animation: 'slideIn 0.4s ease' }}>
//       {/* Sidebar */}
//       <div className="glass" style={{ width: 220, padding: 20, borderRight: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
//         <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 12, letterSpacing: '0.08em' }}>BY GRADE</div>
//         {grades.map(g => (
//           <div key={g} className={`sidebar-item ${gradeFilter === g ? 'active' : ''}`}
//             onClick={() => setGradeFilter(g)}>
//             {g === 'All' ? '🌍' : g === '6th' ? '🌱' : g === '7th' ? '🐍' : g === '8th' ? '🌐' : g === '9th' ? '⚡' : '🤖'} Grade {g}
//           </div>
//         ))}

//         <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '20px 0 12px', letterSpacing: '0.08em' }}>BY LEVEL</div>
//         {levels.map(l => (
//           <div key={l} className={`sidebar-item ${levelFilter === l ? 'active' : ''}`}
//             onClick={() => setLevelFilter(l)}>
//             {l === 'All' ? '📚' : l === 'Beginner' ? '🌟' : l === 'Intermediate' ? '🔥' : '💎'} {l}
//           </div>
//         ))}
//       </div>

//       {/* Content */}
//       <div style={{ flex: 1, padding: 28 }}>
//         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
//           <div>
//             <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Poppins' }}>All Courses</h1>
//             <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 4 }}>{filtered.length} courses available</p>
//           </div>
//           <div style={{ display: 'flex', gap: 8 }}>
//             <span className="badge badge-indigo">🔍 Filter Active</span>
//           </div>
//         </div>

//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
//           {filtered.map(c => (
//             <div key={c.id} className="course-card glass-card" onClick={() => { setCourse(c); setPage('course-detail'); }}
//               style={{ padding: 0, overflow: 'hidden' }}>
//               <div style={{ padding: 20, background: `linear-gradient(135deg, ${c.color}22, ${c.color}11)`, borderBottom: `1px solid ${c.color}33` }}>
//                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
//                   <div style={{ fontSize: 36 }}>{c.icon}</div>
//                   <div style={{ display: 'flex', gap: 6 }}>
//                     <span className="badge badge-indigo">{c.grade}</span>
//                     <span className={`badge ${c.level === 'Beginner' ? 'badge-green' : c.level === 'Intermediate' ? 'badge-yellow' : 'badge-pink'}`}>{c.level}</span>
//                   </div>
//                 </div>
//                 <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 17 }}>{c.title}</h3>
//               </div>

//               <div style={{ padding: 20 }}>
//                 <div style={{ display: 'flex', gap: 16, marginBottom: 14, fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
//                   <span>📖 {c.lessons} lessons</span>
//                   <span>⏱ {c.duration}</span>
//                   <span>👥 {(c.enrolled/1000).toFixed(1)}k</span>
//                 </div>

//                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
//                   <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Progress</span>
//                   <span style={{ fontSize: 12, fontWeight: 600, color: c.color }}>{c.progress}%</span>
//                 </div>
//                 <div className="progress-bar"><div className="progress-fill" style={{ width: `${c.progress}%` }} /></div>

//                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
//                   <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#F59E0B', fontFamily: 'Poppins', fontWeight: 700, fontSize: 14 }}>
//                     ⚡ {c.xp} XP
//                   </div>
//                   <button className="btn-primary" style={{ padding: '7px 16px', fontSize: 12 }}>
//                     {c.progress > 0 ? '▶ Continue' : '🚀 Start'}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// // ============================================================
// // COURSE DETAIL PAGE
// // ============================================================
// const CourseDetailPage = ({ course, setPage }) => {
//   const [openLesson, setOpenLesson] = useState(0);
//   if (!course) { setPage('courses'); return null; }

//   const lessons = [
//     { title: 'Introduction & Setup', duration: '12 min', done: true },
//     { title: 'Core Concepts', duration: '18 min', done: true },
//     { title: 'Your First Program', duration: '22 min', done: false },
//     { title: 'Variables & Data Types', duration: '25 min', done: false },
//     { title: 'Control Flow', duration: '30 min', done: false },
//     { title: 'Functions', duration: '28 min', done: false },
//     { title: 'Practice Project', duration: '45 min', done: false },
//   ];

//   return (
//     <div style={{ maxWidth: 1200, margin: '0 auto', padding: 28, animation: 'slideIn 0.4s ease' }}>
//       <button onClick={() => setPage('courses')} className="btn-glass" style={{ padding: '8px 16px', fontSize: 13, marginBottom: 24 }}>← Back to Courses</button>

//       <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
//         {/* Left */}
//         <div>
//           {/* Video Player */}
//           <div style={{
//             borderRadius: 20, overflow: 'hidden', background: '#0D0D1A',
//             aspectRatio: '16/9', position: 'relative', marginBottom: 24,
//             border: `1px solid ${course.color}44`,
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//             boxShadow: `0 20px 60px ${course.color}33`,
//           }}>
//             <div style={{ textAlign: 'center' }}>
//               <div style={{ fontSize: 64, marginBottom: 12 }}>{course.icon}</div>
//               <div style={{
//                 width: 64, height: 64, borderRadius: 50, background: 'rgba(79,70,229,0.8)',
//                 display: 'flex', alignItems: 'center', justifyContent: 'center',
//                 fontSize: 24, cursor: 'pointer', margin: '0 auto',
//                 boxShadow: '0 8px 24px rgba(79,70,229,0.5)',
//                 transition: 'all 0.3s ease',
//               }}>▶</div>
//               <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 12 }}>Click to play: Lesson 3 – Your First Program</p>
//             </div>
//           </div>

//           {/* Info */}
//           <div className="glass-card" style={{ padding: 24, marginBottom: 16 }}>
//             <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
//               <div>
//                 <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
//                   <span className="badge badge-indigo">{course.grade}</span>
//                   <span className="badge badge-yellow">⚡ {course.xp} XP</span>
//                 </div>
//                 <h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: 'Poppins' }}>{course.title}</h1>
//                 <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 8, fontSize: 14, lineHeight: 1.7 }}>
//                   A comprehensive course designed to take you from zero to hero. Learn through hands-on projects, quizzes, and interactive challenges.
//                 </p>
//               </div>
//               <button className="btn-primary" style={{ padding: '12px 24px', flexShrink: 0 }}>🚀 Continue Learning</button>
//             </div>

//             <div style={{ display: 'flex', gap: 20, marginTop: 20, flexWrap: 'wrap' }}>
//               {[['📖',`${course.lessons} Lessons`],['⏱',course.duration],['👥',`${(course.enrolled/1000).toFixed(1)}k students`],['🏆','Certificate']].map(([icon, text]) => (
//                 <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>
//                   <span>{icon}</span><span>{text}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Downloads */}
//           <div className="glass-card" style={{ padding: 20 }}>
//             <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 16, marginBottom: 14 }}>📎 Resources</h3>
//             <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
//               {['📄 Course Notes.pdf', '💾 Starter Code.zip', '📊 Cheatsheet.pdf'].map(r => (
//                 <button key={r} className="btn-glass" style={{ padding: '8px 14px', fontSize: 12 }}>{r}</button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Right: Lesson list */}
//         <div>
//           <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
//             <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
//               <h3 style={{ fontFamily: 'Poppins', fontWeight: 700 }}>📚 Lessons ({lessons.length})</h3>
//               <div style={{ marginTop: 10 }}>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>
//                   <span>Progress</span><span>2/7</span>
//                 </div>
//                 <div className="progress-bar"><div className="progress-fill" style={{ width: '28%' }} /></div>
//               </div>
//             </div>

//             {lessons.map((l, i) => (
//               <div key={i} onClick={() => setOpenLesson(i)} style={{
//                 padding: '14px 20px', cursor: 'pointer',
//                 borderBottom: '1px solid rgba(255,255,255,0.05)',
//                 background: openLesson === i ? 'rgba(79,70,229,0.15)' : 'transparent',
//                 transition: 'all 0.2s ease',
//                 display: 'flex', alignItems: 'center', gap: 12,
//               }}>
//                 <div style={{
//                   width: 28, height: 28, borderRadius: 50, flexShrink: 0,
//                   background: l.done ? 'rgba(34,197,94,0.2)' : openLesson === i ? 'rgba(79,70,229,0.3)' : 'rgba(255,255,255,0.06)',
//                   border: `1px solid ${l.done ? 'rgba(34,197,94,0.4)' : openLesson === i ? 'rgba(79,70,229,0.5)' : 'rgba(255,255,255,0.1)'}`,
//                   display: 'flex', alignItems: 'center', justifyContent: 'center',
//                   fontSize: 12, fontWeight: 700, fontFamily: 'Poppins',
//                   color: l.done ? '#86EFAC' : openLesson === i ? '#818CF8' : 'rgba(255,255,255,0.5)',
//                 }}>{l.done ? '✓' : i + 1}</div>
//                 <div style={{ flex: 1 }}>
//                   <div style={{ fontSize: 13, fontWeight: 600, fontFamily: 'Poppins', color: l.done ? 'rgba(255,255,255,0.5)' : 'white' }}>{l.title}</div>
//                   <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{l.duration}</div>
//                 </div>
//                 {openLesson === i && <span style={{ color: '#818CF8', fontSize: 12 }}>▶</span>}
//               </div>
//             ))}
//           </div>

//           <button onClick={() => setPage('playground')} className="btn-green" style={{ width: '100%', padding: '13px', marginTop: 14, fontSize: 14 }}>
//             💻 Practice in Playground
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ============================================================
// // DASHBOARD PAGE
// // ============================================================
// const Dashboard = ({ user, setPage }) => {
//   const [showConfetti, setShowConfetti] = useState(false);
//   const enrolledCourses = [
//     { title: 'Python Basics', icon: '🐍', progress: 65, color: '#06B6D4', xp: 487 },
//     { title: 'HTML & CSS', icon: '🌐', progress: 30, color: '#4F46E5', xp: 180 },
//     { title: 'JS Fundamentals', icon: '⚡', progress: 15, color: '#F59E0B', xp: 150 },
//   ];

//   const liveSessions = [
//     { title: 'Python Q&A Session', teacher: 'Mr. Patel', time: 'Today 4:00 PM', spots: 8 },
//     { title: 'Web Dev Live', teacher: 'Ms. Sharma', time: 'Tomorrow 5:00 PM', spots: 15 },
//   ];

//   const achievements = [
//     { icon: '🌟', title: 'First Lesson', earned: true },
//     { icon: '🔥', title: '7-Day Streak', earned: true },
//     { icon: '💎', title: 'Level 5', earned: true },
//     { icon: '🏆', title: 'Top Scorer', earned: true },
//     { icon: '⚡', title: '1000 XP', earned: true },
//     { icon: '🎯', title: 'Perfect Score', earned: false },
//     { icon: '🚀', title: 'Speed Coder', earned: false },
//     { icon: '🌈', title: 'All Courses', earned: false },
//   ];

//   return (
//     <div style={{ maxWidth: 1200, margin: '0 auto', padding: 28, animation: 'slideIn 0.4s ease' }}>
//       <Confetti active={showConfetti} />

//       {/* Welcome banner */}
//       <div className="glass-card" style={{
//         padding: '24px 32px', marginBottom: 24,
//         background: 'linear-gradient(135deg, rgba(79,70,229,0.2), rgba(168,85,247,0.15))',
//         display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
//       }}>
//         <div>
//           <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Welcome back!</div>
//           <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Poppins' }}>
//             Hey {user?.name} {user?.avatar} 👋
//           </h1>
//           <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginTop: 4 }}>
//             You're on a <span style={{ color: '#F59E0B', fontWeight: 700 }}>🔥 {user?.streak}-day streak!</span> Keep it up!
//           </p>
//         </div>
//         <button onClick={() => { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 3000); }}
//           className="btn-primary" style={{ padding: '11px 22px', fontSize: 14 }}>
//           🎉 Claim Daily Reward
//         </button>
//       </div>

//       {/* Stats */}
//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
//         {[
//           { icon: '⚡', label: 'Total XP', val: user?.xp?.toLocaleString(), color: '#F59E0B', bg: 'rgba(245,158,11,0.15)' },
//           { icon: '🔥', label: 'Day Streak', val: `${user?.streak} days`, color: '#EC4899', bg: 'rgba(236,72,153,0.12)' },
//           { icon: '📊', label: 'Progress', val: `${user?.progress}%`, color: '#22C55E', bg: 'rgba(34,197,94,0.12)' },
//           { icon: '💎', label: 'Level', val: `Level ${user?.level}`, color: '#818CF8', bg: 'rgba(129,140,248,0.15)' },
//         ].map(s => (
//           <div key={s.label} className="stat-card" style={{ background: s.bg, border: `1px solid ${s.color}33` }}>
//             <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
//             <div style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 24, color: s.color }}>{s.val}</div>
//             <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>{s.label}</div>
//           </div>
//         ))}
//       </div>

//       <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24 }}>
//         <div>
//           {/* Enrolled Courses */}
//           <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
//               <h2 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 18 }}>📚 My Courses</h2>
//               <button onClick={() => setPage('courses')} className="btn-glass" style={{ padding: '6px 14px', fontSize: 12 }}>Browse More</button>
//             </div>
//             <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
//               {enrolledCourses.map(c => (
//                 <div key={c.title} onClick={() => setPage('course-detail')} style={{
//                   padding: '16px 18px', borderRadius: 16, cursor: 'pointer',
//                   background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
//                   transition: 'all 0.2s ease',
//                   display: 'flex', alignItems: 'center', gap: 14,
//                 }}
//                   onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
//                   onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
//                 >
//                   <div style={{ width: 44, height: 44, borderRadius: 14, background: `${c.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{c.icon}</div>
//                   <div style={{ flex: 1 }}>
//                     <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 15, marginBottom: 6 }}>{c.title}</div>
//                     <div className="progress-bar"><div className="progress-fill" style={{ width: `${c.progress}%` }} /></div>
//                     <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 12 }}>
//                       <span style={{ color: 'rgba(255,255,255,0.4)' }}>{c.progress}% complete</span>
//                       <span style={{ color: '#F59E0B', fontWeight: 600 }}>⚡ {c.xp} XP</span>
//                     </div>
//                   </div>
//                   <button className="btn-primary" style={{ padding: '7px 14px', fontSize: 12 }}>▶</button>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Upcoming Live Classes */}
//           <div className="glass-card" style={{ padding: 24 }}>
//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
//               <h2 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 18 }}>📡 Live Classes</h2>
//               <button onClick={() => setPage('live-classes')} className="btn-glass" style={{ padding: '6px 14px', fontSize: 12 }}>View All</button>
//             </div>
//             <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
//               {liveSessions.map(s => (
//                 <div key={s.title} style={{
//                   padding: '14px 16px', borderRadius: 14,
//                   background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
//                   display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
//                 }}>
//                   <div>
//                     <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 14 }}>{s.title}</div>
//                     <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>👨‍🏫 {s.teacher} · {s.time}</div>
//                   </div>
//                   <button className="btn-green" style={{ padding: '7px 14px', fontSize: 12, whiteSpace: 'nowrap' }}>Join Now 📡</button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Right: Achievements */}
//         <div>
//           <div className="glass-card" style={{ padding: 24 }}>
//             <h2 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>🏅 Achievements</h2>

//             {/* XP to next level */}
//             <div style={{ padding: '14px 16px', borderRadius: 14, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', marginBottom: 18 }}>
//               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
//                 <span style={{ color: '#FCD34D', fontWeight: 600 }}>⚡ Level {user?.level} → {(user?.level || 5) + 1}</span>
//                 <span style={{ color: 'rgba(255,255,255,0.4)' }}>250 XP to go</span>
//               </div>
//               <div className="xp-bar"><div className="xp-fill" style={{ width: '75%' }} /></div>
//             </div>

//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
//               {achievements.map(a => (
//                 <div key={a.title} style={{
//                   padding: '14px 12px', borderRadius: 14, textAlign: 'center',
//                   background: a.earned ? 'rgba(79,70,229,0.15)' : 'rgba(255,255,255,0.03)',
//                   border: a.earned ? '1px solid rgba(79,70,229,0.35)' : '1px solid rgba(255,255,255,0.07)',
//                   opacity: a.earned ? 1 : 0.45,
//                   transition: 'all 0.2s ease',
//                 }}>
//                   <div style={{ fontSize: 24, marginBottom: 4, filter: a.earned ? 'none' : 'grayscale(1)' }}>{a.icon}</div>
//                   <div style={{ fontSize: 11, fontFamily: 'Poppins', fontWeight: 600 }}>{a.title}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ============================================================
// // PLAYGROUND PAGE
// // ============================================================
// const PlaygroundPage = () => {
//   const [code, setCode] = useState(`# Python Playground 🐍
// # Write your code below!

// name = "Coder"
// print(f"Hello, {name}! Welcome to MyFirstCode 🚀")

// # Try a simple loop:
// for i in range(1, 6):
//     print(f"⭐ Level {i}")

// # Your turn - try something!`);

//   const [output, setOutput] = useState('');
//   const [running, setRunning] = useState(false);
//   const [challenge, setChallenge] = useState(0);
//   const [showHint, setShowHint] = useState(false);
//   const [success, setSuccess] = useState(false);

//   const challenges = [
//     { title: 'Hello World', desc: 'Print "Hello, World!" to the console', hint: 'Use print("Hello, World!")' },
//     { title: 'Sum Calculator', desc: 'Write a function to add two numbers', hint: 'def add(a, b): return a + b' },
//     { title: 'Reverse String', desc: 'Reverse the string "coding"', hint: 'Use slicing: s[::-1]' },
//   ];

//   const runCode = () => {
//     setRunning(true);
//     setOutput('');
//     setTimeout(() => {
//       const lines = code.split('\n').filter(l => l.includes('print'));
//       const simulated = lines.length > 0
//         ? lines.map(l => {
//             const m = l.match(/print\((.+)\)/);
//             if (!m) return '';
//             const val = m[1].replace(/f?["']/g, '').replace(/["']/g, '').replace(/{name}/g, 'Coder');
//             return val;
//           }).filter(Boolean).join('\n')
//         : '# No print statements found';

//       setOutput(`>>> Running code...\n\nHello, Coder! Welcome to MyFirstCode 🚀\n⭐ Level 1\n⭐ Level 2\n⭐ Level 3\n⭐ Level 4\n⭐ Level 5\n\n✅ Code executed successfully!`);
//       setRunning(false);
//       setSuccess(true);
//       setTimeout(() => setSuccess(false), 3000);
//     }, 1200);
//   };

//   return (
//     <div style={{ maxWidth: 1200, margin: '0 auto', padding: 28, animation: 'slideIn 0.4s ease' }}>
//       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
//         <div>
//           <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Poppins' }}>💻 Code Playground</h1>
//           <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 4 }}>Write, run, and experiment with code!</p>
//         </div>
//         <div style={{ display: 'flex', gap: 10 }}>
//           <select className="input-glass" style={{ width: 'auto', padding: '8px 14px', fontSize: 13 }}>
//             <option>🐍 Python</option>
//             <option>🌐 JavaScript</option>
//             <option>🎨 HTML/CSS</option>
//           </select>
//         </div>
//       </div>

//       {/* Challenges */}
//       <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
//         {challenges.map((c, i) => (
//           <div key={i} onClick={() => { setChallenge(i); setShowHint(false); }} style={{
//             padding: '10px 16px', borderRadius: 12, cursor: 'pointer',
//             background: challenge === i ? 'rgba(79,70,229,0.3)' : 'rgba(255,255,255,0.05)',
//             border: `1px solid ${challenge === i ? 'rgba(79,70,229,0.5)' : 'rgba(255,255,255,0.1)'}`,
//             transition: 'all 0.2s ease',
//           }}>
//             <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 13 }}>🎯 {c.title}</div>
//             <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{c.desc}</div>
//           </div>
//         ))}
//       </div>

//       {/* Editor + Output */}
//       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, height: 420 }}>
//         {/* Editor */}
//         <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
//           <div style={{
//             background: '#0D0D1A', borderRadius: '16px 16px 0 0',
//             padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)',
//             display: 'flex', alignItems: 'center', gap: 8, border: '1px solid rgba(79,70,229,0.3)',
//           }}>
//             <div style={{ width: 10, height: 10, borderRadius: 50, background: '#EC4899' }} />
//             <div style={{ width: 10, height: 10, borderRadius: 50, background: '#F59E0B' }} />
//             <div style={{ width: 10, height: 10, borderRadius: 50, background: '#22C55E' }} />
//             <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: 'rgba(255,255,255,0.3)', marginLeft: 8 }}>main.py</span>
//           </div>
//           <textarea className="code-editor" value={code} onChange={e => setCode(e.target.value)}
//             style={{ flex: 1, borderRadius: '0 0 16px 16px', borderTop: 'none' }} />
//         </div>

//         {/* Output */}
//         <div style={{ display: 'flex', flexDirection: 'column' }}>
//           <div style={{
//             background: '#0D0D1A', borderRadius: '16px 16px 0 0',
//             padding: '10px 16px', border: '1px solid rgba(34,197,94,0.25)', borderBottom: 'none',
//             display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//           }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//               <div style={{ width: 8, height: 8, borderRadius: 50, background: running ? '#F59E0B' : '#22C55E', boxShadow: running ? '0 0 8px #F59E0B' : '0 0 8px #22C55E' }} />
//               <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Output</span>
//             </div>
//             {success && <span className="badge badge-green">✓ Success!</span>}
//           </div>
//           <div style={{
//             flex: 1, background: '#0D0D1A',
//             borderRadius: '0 0 16px 16px',
//             border: '1px solid rgba(34,197,94,0.25)', borderTop: 'none',
//             padding: 20, fontFamily: 'JetBrains Mono', fontSize: 13, color: '#86EFAC',
//             lineHeight: 1.8, whiteSpace: 'pre-wrap', overflowY: 'auto',
//           }}>
//             {output || <span style={{ color: 'rgba(255,255,255,0.2)' }}>// Output will appear here when you run code...</span>}
//           </div>
//         </div>
//       </div>

//       {/* Controls */}
//       <div style={{ display: 'flex', gap: 10, marginTop: 16, alignItems: 'center', flexWrap: 'wrap' }}>
//         <button onClick={runCode} className="btn-primary" style={{ padding: '11px 24px', fontSize: 14, opacity: running ? 0.7 : 1 }}>
//           {running ? '⏳ Running...' : '▶ Run Code'}
//         </button>
//         <button onClick={() => setCode('# Start fresh!\nprint("Hello World 🌍")')} className="btn-glass" style={{ padding: '11px 20px', fontSize: 14 }}>
//           🔄 Reset
//         </button>
//         <button onClick={() => setShowHint(!showHint)} className="btn-glass" style={{ padding: '11px 20px', fontSize: 14 }}>
//           💡 Hint
//         </button>

//         {showHint && (
//           <div style={{
//             padding: '10px 16px', borderRadius: 12, fontSize: 13,
//             background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)',
//             color: '#FCD34D', fontFamily: 'JetBrains Mono',
//           }}>
//             💡 {challenges[challenge]?.hint}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // ============================================================
// // LIVE CLASSES PAGE
// // ============================================================
// const LiveClassesPage = () => {
//   const upcoming = [
//     { title: 'Python for Beginners', teacher: 'Mr. Patel', time: 'Today, 4:00 PM', duration: '60 min', spots: 8, grade: '7th', live: true },
//     { title: 'Web Dev Crash Course', teacher: 'Ms. Sharma', time: 'Tomorrow, 5:00 PM', duration: '90 min', spots: 15, grade: '8th', live: false },
//     { title: 'JavaScript Basics', teacher: 'Mr. Kumar', time: 'Wed, 4:30 PM', duration: '60 min', spots: 20, grade: '9th', live: false },
//     { title: 'Scratch for Fun!', teacher: 'Ms. Rao', time: 'Thu, 3:00 PM', duration: '45 min', spots: 25, grade: '6th', live: false },
//   ];

//   const recordings = [
//     { title: 'Intro to Python', teacher: 'Mr. Patel', views: '1.2k', duration: '58 min', icon: '🐍' },
//     { title: 'HTML Fundamentals', teacher: 'Ms. Sharma', views: '980', duration: '72 min', icon: '🌐' },
//     { title: 'CSS Styling Magic', teacher: 'Ms. Sharma', views: '856', duration: '65 min', icon: '🎨' },
//   ];

//   return (
//     <div style={{ maxWidth: 1200, margin: '0 auto', padding: 28, animation: 'slideIn 0.4s ease' }}>
//       <div style={{ marginBottom: 32 }}>
//         <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: 'Poppins' }}>📡 Live Classes</h1>
//         <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 4 }}>Join expert-led live sessions and recordings</p>
//       </div>

//       {/* Upcoming */}
//       <h2 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 20, marginBottom: 16 }}>🔴 Upcoming Sessions</h2>
//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16, marginBottom: 40 }}>
//         {upcoming.map(s => (
//           <div key={s.title} className="glass-card" style={{ padding: 24, position: 'relative', overflow: 'hidden' }}>
//             {s.live && (
//               <div style={{
//                 position: 'absolute', top: 16, right: 16,
//                 display: 'flex', alignItems: 'center', gap: 6,
//                 padding: '4px 10px', borderRadius: 100,
//                 background: 'rgba(236,72,153,0.2)', border: '1px solid rgba(236,72,153,0.4)',
//                 fontSize: 11, fontWeight: 700, fontFamily: 'Poppins', color: '#F9A8D4',
//               }}>
//                 <div style={{ width: 6, height: 6, borderRadius: 50, background: '#EC4899', boxShadow: '0 0 6px #EC4899' }} />
//                 LIVE NOW
//               </div>
//             )}

//             <div style={{ marginBottom: 14 }}>
//               <span className="badge badge-indigo" style={{ marginBottom: 10 }}>{s.grade} Grade</span>
//               <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 17, marginBottom: 8 }}>{s.title}</h3>
//               <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>👨‍🏫 {s.teacher}</div>
//             </div>

//             <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 16 }}>
//               <span>🕐 {s.time}</span>
//               <span>⏱ {s.duration}</span>
//               <span>💺 {s.spots} spots</span>
//             </div>

//             <button className={s.live ? 'btn-primary' : 'btn-glass'} style={{ width: '100%', padding: '10px', fontSize: 14 }}>
//               {s.live ? '🔴 Join Now' : '📅 Register'}
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* Recordings */}
//       <h2 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 20, marginBottom: 16 }}>📹 Past Recordings</h2>
//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
//         {recordings.map(r => (
//           <div key={r.title} className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
//             <div style={{
//               height: 140, background: 'linear-gradient(135deg, rgba(79,70,229,0.2), rgba(34,197,94,0.1))',
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               position: 'relative', fontSize: 48,
//             }}>
//               {r.icon}
//               <div style={{
//                 position: 'absolute', width: 44, height: 44, borderRadius: 50,
//                 background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
//                 display: 'flex', alignItems: 'center', justifyContent: 'center',
//                 fontSize: 18, cursor: 'pointer', border: '2px solid rgba(255,255,255,0.3)',
//               }}>▶</div>
//             </div>
//             <div style={{ padding: 18 }}>
//               <h3 style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{r.title}</h3>
//               <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>👨‍🏫 {r.teacher} · {r.duration} · {r.views} views</div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// // ============================================================
// // FOOTER
// // ============================================================
// const Footer = () => (
//   <footer style={{
//     borderTop: '1px solid rgba(255,255,255,0.07)',
//     padding: '40px 24px',
//     marginTop: 40,
//     background: 'rgba(0,0,0,0.2)',
//   }}>
//     <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'space-between', alignItems: 'flex-start' }}>
//       <div>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
//           <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, #4F46E5, #A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}></div>
//           <span style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: 16 }}>MyFirstCode</span>
//         </div>
//         <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, maxWidth: 220, lineHeight: 1.6 }}>Making coding fun and accessible for every student in grades 6–10.</p>
//         <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
//           {['🐦','💼','📸','▶'].map(icon => (
//             <div key={icon} style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 14 }}>{icon}</div>
//           ))}
//         </div>
//       </div>

//       {[
//         { title: 'Learn', links: ['Courses', 'Live Classes', 'Playground', 'Certificates'] },
//         { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
//         { title: 'Support', links: ['Help Center', 'Community', 'Teachers', 'Parents'] },
//       ].map(col => (
//         <div key={col.title}>
//           <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 13, marginBottom: 12, color: 'rgba(255,255,255,0.6)' }}>{col.title}</div>
//           {col.links.map(l => (
//             <div key={l} style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 8, cursor: 'pointer', transition: 'color 0.2s ease' }}
//               onMouseEnter={e => e.target.style.color = 'white'}
//               onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.35)'}
//             >{l}</div>
//           ))}
//         </div>
//       ))}
//     </div>

//     <div style={{ maxWidth: 1200, margin: '24px auto 0', paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
//       <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>© 2026 MyFirstCode. Developed by Vortexweb Technologies Pvt Ltd.</span>
//       <div style={{ display: 'flex', gap: 16 }}>
//         {['Privacy', 'Terms', 'Cookies'].map(t => (
//           <span key={t} style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', cursor: 'pointer' }}>{t}</span>
//         ))}
//       </div>
//     </div>
//   </footer>
// );

// // ============================================================
// // MAIN APP
// // ============================================================
// export default function App() {
//   const [page, setPage] = useState('home');
//   const [user, setUser] = useState(null);
//   const [showAuth, setShowAuth] = useState(null);
//   const [selectedCourse, setSelectedCourse] = useState(null);

//   return (
//     <>
//       <GlobalStyles />
//       <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
//         <Navbar page={page} setPage={setPage} user={user} setShowAuth={setShowAuth} />

//         <main style={{ flex: 1 }}>
//           {page === 'home' && <HomePage setPage={setPage} setShowAuth={setShowAuth} user={user} />}
//           {page === 'courses' && <CoursesPage setPage={setPage} setCourse={setSelectedCourse} />}
//           {page === 'course-detail' && <CourseDetailPage course={selectedCourse} setPage={setPage} />}
//           {page === 'dashboard' && user && <Dashboard user={user} setPage={setPage} />}
//           {page === 'playground' && <PlaygroundPage />}
//           {page === 'live-classes' && <LiveClassesPage />}
//           {page === 'dashboard' && !user && <HomePage setPage={setPage} setShowAuth={setShowAuth} user={user} />}
//         </main>

//         <Footer />

//         {showAuth && (
//           <AuthModal mode={showAuth} onClose={() => setShowAuth(null)}
//             onAuth={(u) => { setUser(u); setPage('dashboard'); }} />
//         )}
//       </div>
//     </>
//   );
// }
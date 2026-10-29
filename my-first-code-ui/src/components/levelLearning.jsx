// // // src/pages/student/LevelLearning.jsx

// // import { useEffect, useState } from "react";
// // import axios from "axios";
// // import {
// //   ArrowLeft, ArrowRight, ChevronDown, ChevronUp,
// //   PlayCircle, CheckCircle2, Circle, Layers, Clock,
// //   BookOpen, Wrench, PenLine, Check, Target, Lock,
// // } from "lucide-react";
// // import { useNavigate, useParams } from "react-router-dom";
// // import ENDPOINT from "../lib/endpoints";

// // const diffColor = {
// //   Beginner:     "bg-green-50 text-green-700 border-green-200",
// //   Intermediate: "bg-amber-50 text-amber-700 border-amber-200",
// //   Advanced:     "bg-red-50 text-red-700 border-red-200",
// // };

// // function LessonTypeIcon({ type, size = 13 }) {
// //   if (type === "video")   return <PlayCircle size={size} />;
// //   if (type === "project") return <Wrench size={size} />;
// //   return <PenLine size={size} />;
// // }

// // export default function LevelLearning() {
// //   const { id } = useParams();
// //   console.log("Level ID:", id);
// //   const navigate = useNavigate();
// //   console.log("navigate:", navigate);


// //   const [level, setLevel]               = useState(null);
// //   const [loading, setLoading]           = useState(true);
// //   const [activeLessonId, setActiveLessonId] = useState(null);
// //   const [openModuleId, setOpenModuleId] = useState(null);
// //   const [completedLessons, setCompletedLessons] = useState(new Set());
// //   const [playing, setPlaying]           = useState(false);

// //   // ── Fetch ──────────────────────────────────────────────────────────────────
// //   const fetchLevel = async () => {
// //     try {
// //       setLoading(true);
// //       const res  = await axios.get(ENDPOINT.GET_LEVEL_DETAIL(id));
// //       const data = res.data?.level || res.data?.data || res.data;
// //       setLevel(data);

// //       if (data?.completed_lesson_ids?.length) {
// //         setCompletedLessons(new Set(data.completed_lesson_ids));
// //       }

// //       const firstMod    = data?.modules?.[0];
// //       const firstLesson = firstMod?.lessons?.[0];
// //       if (firstMod)    setOpenModuleId(firstMod.id);
// //       if (firstLesson) setActiveLessonId(firstLesson.id);
// //     } catch (err) {
// //       console.error("FETCH LEVEL ERROR:", err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => { fetchLevel(); }, [id]);

// //   // ── Helpers ────────────────────────────────────────────────────────────────
// //   const allLessons      = () => level?.modules?.flatMap((m) => m.lessons || []) || [];
// //   const totalLessons    = () => allLessons().length;
// //   const completedCount  = () => allLessons().filter((l) => completedLessons.has(l.id)).length;
// //   const overallProgress = () => {
// //     const t = totalLessons();
// //     return t ? Math.round((completedCount() / t) * 100) : 0;
// //   };
// //   const moduleProgress = (mod) => {
// //     const ls = mod.lessons || [];
// //     if (!ls.length) return 0;
// //     return Math.round((ls.filter((l) => completedLessons.has(l.id)).length / ls.length) * 100);
// //   };
// //   const activeLesson  = () => allLessons().find((l) => l.id === activeLessonId);
// //   const activeModule  = () => level?.modules?.find((m) => m.lessons?.some((l) => l.id === activeLessonId));
// //   const activeIndex   = () => allLessons().findIndex((l) => l.id === activeLessonId);

// //   // ── Mark complete ──────────────────────────────────────────────────────────
// //   const markComplete = async () => {
// //     const lessonId = activeLessonId;
// //     const next = new Set(completedLessons);

// //     if (next.has(lessonId)) {
// //       next.delete(lessonId);
// //     } else {
// //       next.add(lessonId);
// //       try {
// //         await axios.post(ENDPOINT.MARK_LESSON_COMPLETE?.({ lessonId }) || "#", {
// //           lesson_id: lessonId,
// //         });
// //       } catch (_) { /* silent */ }

// //       // auto-advance
// //       const all = allLessons();
// //       const idx = all.findIndex((l) => l.id === lessonId);
// //       if (idx < all.length - 1) {
// //         const nx = all[idx + 1];
// //         setActiveLessonId(nx.id);
// //         const nxMod = level.modules.find((m) => m.lessons?.some((l) => l.id === nx.id));
// //         if (nxMod) setOpenModuleId(nxMod.id);
// //       }
// //     }
// //     setCompletedLessons(next);
// //     setPlaying(false);
// //   };

// //   const goTo = (dir) => {
// //     const all = allLessons();
// //     const idx = activeIndex();
// //     const target = dir === "prev" ? all[idx - 1] : all[idx + 1];
// //     if (!target) return;
// //     setActiveLessonId(target.id);
// //     setPlaying(false);
// //     const mod = level.modules.find((m) => m.lessons?.some((l) => l.id === target.id));
// //     if (mod) setOpenModuleId(mod.id);
// //   };

// //   const selectLesson = (lesson) => {
// //     setActiveLessonId(lesson.id);
// //     setPlaying(false);
// //     const mod = level.modules.find((m) => m.lessons?.some((l) => l.id === lesson.id));
// //     if (mod) setOpenModuleId(mod.id);
// //   };

// //   // ── Loading ────────────────────────────────────────────────────────────────
// //   if (loading) {
// //     return (
// //       <div className="flex items-center justify-center h-screen">
// //         <div className="animate-pulse text-gray-400">Loading course...</div>
// //       </div>
// //     );
// //   }

// //   if (!level) {
// //     return (
// //       <div className="flex flex-col items-center justify-center h-screen gap-3">
// //         <p className="text-gray-500">Level not found.</p>
// //         <button
// //           onClick={() => navigate("/student/my-courses")}
// //           className="text-violet-600 underline text-sm"
// //         >
// //           Back to My Learning
// //         </button>
// //       </div>
// //     );
// //   }

// //   const lesson   = activeLesson();
// //   const mod      = activeModule();
// //   const idx      = activeIndex();
// //   const total    = totalLessons();
// //   const done     = completedCount();
// //   const progress = overallProgress();
// //   const isDone   = completedLessons.has(activeLessonId);

// //   // ── Render ─────────────────────────────────────────────────────────────────
// //   return (
// //     <div className="flex flex-col h-screen overflow-hidden bg-gray-50">

// //       {/* ── Top bar ── */}
// //       <div className="bg-white border-b border-gray-200 flex items-center gap-4 px-5 py-3 flex-shrink-0">
// //         <button
// //           onClick={() => navigate("/student/my-courses")}
// //           className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl px-3 py-1.5 hover:bg-gray-50 transition-colors"
// //         >
// //           <ArrowLeft size={14} />
// //           My Learning
// //         </button>

// //         <div className="flex-1 min-w-0">
// //           <h1 className="text-sm font-semibold text-gray-900 truncate">
// //             Level {level.level_number}: {level.level_name || level.title}
// //           </h1>
// //           <p className="text-xs text-gray-400">
// //             {done}/{total} lessons completed · {progress}% done
// //           </p>
// //         </div>

// //         {level.difficulty && (
// //           <span className={`hidden sm:inline-flex text-xs px-2.5 py-1 rounded-full border flex-shrink-0 ${diffColor[level.difficulty] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
// //             {level.difficulty}
// //           </span>
// //         )}
// //       </div>

// //       {/* ── Body ── */}
// //       <div className="flex flex-1 overflow-hidden">

// //         {/* ───────────── Left: content ───────────── */}
// //         <div className="flex-1 overflow-y-auto">

// //           {/* Video panel */}
// //           <div className="bg-gray-900 relative" style={{ aspectRatio: "16/7", maxHeight: 380 }}>
// //             {playing ? (
// //               /* ── Replace this div with your real <video> or iframe ── */
// //               <div className="w-full h-full flex items-center justify-center">
// //                 <p className="text-white/50 text-sm">[Video player renders here]</p>
// //               </div>
// //             ) : (
// //               <div
// //                 className="w-full h-full flex flex-col items-center justify-center gap-3 cursor-pointer"
// //                 onClick={() => setPlaying(true)}
// //               >
// //                 <div className="w-16 h-16 rounded-full bg-violet-600 flex items-center justify-center hover:scale-105 transition-transform">
// //                   <PlayCircle size={32} className="text-white ml-0.5" />
// //                 </div>
// //                 <p className="text-white font-medium text-sm px-4 text-center line-clamp-2">
// //                   {lesson?.title}
// //                 </p>
// //                 <p className="text-gray-400 text-xs flex items-center gap-1.5">
// //                   <Clock size={11} />
// //                   {lesson?.duration}
// //                   {lesson?.type && (
// //                     <>
// //                       <span className="mx-1 opacity-40">·</span>
// //                       <LessonTypeIcon type={lesson.type} />
// //                       {lesson.type}
// //                     </>
// //                   )}
// //                 </p>
// //               </div>
// //             )}

// //             {/* Lesson counter badge */}
// //             <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full">
// //               {idx + 1} / {total}
// //             </span>
// //           </div>

// //           {/* Nav + mark complete */}
// //           <div className="flex items-center gap-2 px-5 py-3 bg-white border-b border-gray-100">
// //             <button
// //               disabled={idx <= 0}
// //               onClick={() => goTo("prev")}
// //               className="flex items-center gap-1.5 text-sm border border-gray-200 rounded-xl px-3 py-2 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
// //             >
// //               <ArrowLeft size={14} />
// //               <span className="hidden sm:inline">Previous</span>
// //             </button>

// //             <button
// //               onClick={markComplete}
// //               className={`flex-1 flex items-center justify-center gap-1.5 text-sm font-medium py-2 rounded-xl transition-colors ${
// //                 isDone
// //                   ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
// //                   : "bg-violet-600 text-white hover:bg-violet-700"
// //               }`}
// //             >
// //               <Check size={14} />
// //               {isDone ? "Completed — click to undo" : "Mark as complete"}
// //             </button>

// //             <button
// //               disabled={idx >= total - 1}
// //               onClick={() => goTo("next")}
// //               className="flex items-center gap-1.5 text-sm border border-gray-200 rounded-xl px-3 py-2 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
// //             >
// //               <span className="hidden sm:inline">Next</span>
// //               <ArrowRight size={14} />
// //             </button>
// //           </div>

// //           {/* Lesson info & topics */}
// //           <div className="p-5 space-y-4">

// //             {/* Lesson title card */}
// //             <div className="bg-white rounded-2xl border border-gray-200 p-5">
// //               <h2 className="text-lg font-semibold text-gray-900">{lesson?.title}</h2>
// //               <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-400">
// //                 <span className="flex items-center gap-1">
// //                   <LessonTypeIcon type={lesson?.type} />
// //                   {lesson?.type}
// //                 </span>
// //                 <span className="flex items-center gap-1">
// //                   <Clock size={11} />
// //                   {lesson?.duration}
// //                 </span>
// //                 {mod && (
// //                   <span className="flex items-center gap-1">
// //                     <Layers size={11} />
// //                     {mod.title}
// //                   </span>
// //                 )}
// //               </div>
// //               <p className="mt-3 text-sm text-gray-600 leading-relaxed">
// //                 In this lesson you will explore <strong>{lesson?.title}</strong> as part
// //                 of the <em>{mod?.title}</em> module. Follow the video and complete any
// //                 activities at your own pace.
// //               </p>
// //             </div>

// //             {/* Topics in module */}
// //             {mod?.topics?.length > 0 && (
// //               <div className="bg-white rounded-2xl border border-gray-200 p-5">
// //                 <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
// //                   <BookOpen size={12} />
// //                   Topics in {mod.title}
// //                 </h3>
// //                 <ul className="space-y-2">
// //                   {mod.topics.map((t, i) => (
// //                     <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
// //                       <span className="text-violet-400 mt-0.5 flex-shrink-0">▸</span>
// //                       {t}
// //                     </li>
// //                   ))}
// //                 </ul>

// //                 {mod.activities?.length > 0 && (
// //                   <div className="mt-4 pt-4 border-t border-gray-100">
// //                     <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
// //                       <PenLine size={12} />
// //                       Practice Tasks
// //                     </h4>
// //                     <ul className="space-y-2">
// //                       {mod.activities.map((a, i) => (
// //                         <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
// //                           <CheckCircle2 size={14} className="text-violet-400 flex-shrink-0" />
// //                           {a}
// //                         </li>
// //                       ))}
// //                     </ul>
// //                   </div>
// //                 )}
// //               </div>
// //             )}

// //             {/* Learning outcomes */}
// //             {level.outcomes?.length > 0 && (
// //               <div className="bg-violet-50 border border-violet-100 rounded-2xl p-5">
// //                 <h3 className="text-xs font-semibold text-violet-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
// //                   <Target size={12} />
// //                   Learning Outcomes
// //                 </h3>
// //                 <ul className="space-y-2">
// //                   {level.outcomes.map((o, i) => (
// //                     <li key={i} className="flex items-center gap-2 text-sm text-violet-800">
// //                       <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />
// //                       {o}
// //                     </li>
// //                   ))}
// //                 </ul>
// //               </div>
// //             )}

// //             {/* Stats row */}
// //             <div className="grid grid-cols-3 gap-3">
// //               {[
// //                 { label: "Modules",  value: level.modules?.length || 0, icon: <Layers size={15} /> },
// //                 { label: "Lessons",  value: total,                       icon: <BookOpen size={15} /> },
// //                 { label: "Duration", value: `${level.duration || "—"}${level.duration_unit?.[0] || ""}`, icon: <Clock size={15} /> },
// //               ].map((s) => (
// //                 <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-3 text-center">
// //                   <div className="flex justify-center text-violet-400 mb-1">{s.icon}</div>
// //                   <div className="text-lg font-bold text-violet-700">{s.value}</div>
// //                   <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
// //                 </div>
// //               ))}
// //             </div>

// //           </div>
// //         </div>

// //         {/* ───────────── Right: sidebar ───────────── */}
// //         <div className="w-72 xl:w-80 flex-shrink-0 bg-white border-l border-gray-200 flex flex-col overflow-hidden">

// //           {/* Sidebar header */}
// //           <div className="p-4 border-b border-gray-100 flex-shrink-0">
// //             <h2 className="text-sm font-semibold text-gray-800">Course Content</h2>
// //             <div className="mt-2.5">
// //               <div className="flex justify-between text-xs text-gray-400 mb-1.5">
// //                 <span>{done}/{total} completed</span>
// //                 <span>{progress}%</span>
// //               </div>
// //               <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
// //                 <div
// //                   className="h-full bg-violet-600 rounded-full transition-all duration-500"
// //                   style={{ width: `${progress}%` }}
// //                 />
// //               </div>
// //             </div>
// //           </div>

// //           {/* Module list */}
// //           <div className="overflow-y-auto flex-1">
// //             {(level.modules || []).map((module, mi) => {
// //               const isOpen    = openModuleId === module.id;
// //               const mp        = moduleProgress(module);
// //               const allDone   = mp === 100;
// //               const isActive  = module.lessons?.some((l) => l.id === activeLessonId);

// //               return (
// //                 <div key={module.id} className="border-b border-gray-100 last:border-b-0">

// //                   {/* Module header */}
// //                   <button
// //                     onClick={() => setOpenModuleId(isOpen ? null : module.id)}
// //                     className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 ${isActive ? "bg-violet-50" : ""}`}
// //                   >
// //                     <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
// //                       allDone ? "bg-green-100 text-green-700" : isActive ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-500"
// //                     }`}>
// //                       {allDone ? <Check size={12} /> : mi + 1}
// //                     </div>

// //                     <div className="flex-1 min-w-0">
// //                       <p className="text-sm font-medium text-gray-900 truncate">{module.title}</p>
// //                       <p className="text-xs text-gray-400 mt-0.5">
// //                         {module.weeks && `${module.weeks} · `}{mp}% done
// //                       </p>
// //                     </div>

// //                     {isOpen
// //                       ? <ChevronUp size={14} className="text-gray-400 flex-shrink-0" />
// //                       : <ChevronDown size={14} className="text-gray-400 flex-shrink-0" />
// //                     }
// //                   </button>

// //                   {/* Lessons */}
// //                   {isOpen && (
// //                     <div className="bg-gray-50 px-3 pb-2 pt-1">
// //                       {(module.lessons || []).map((ls) => {
// //                         const isCompleted = completedLessons.has(ls.id);
// //                         const isCurrent   = ls.id === activeLessonId;

// //                         return (
// //                           <button
// //                             key={ls.id}
// //                             onClick={() => selectLesson(ls)}
// //                             className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-left transition-colors ${
// //                               isCurrent
// //                                 ? "bg-violet-600 text-white"
// //                                 : "hover:bg-white"
// //                             }`}
// //                           >
// //                             {/* Status dot */}
// //                             <div className="flex-shrink-0">
// //                               {isCompleted
// //                                 ? <CheckCircle2 size={17} className={isCurrent ? "text-green-300" : "text-green-500"} />
// //                                 : isCurrent
// //                                   ? <PlayCircle size={17} className="text-white" />
// //                                   : <Circle size={17} className="text-gray-300" />
// //                               }
// //                             </div>

// //                             <div className="flex-1 min-w-0">
// //                               <p className={`text-sm font-medium truncate ${isCurrent ? "text-white" : "text-gray-800"}`}>
// //                                 {ls.title}
// //                               </p>
// //                               <p className={`text-xs flex items-center gap-1 mt-0.5 ${isCurrent ? "text-violet-200" : "text-gray-400"}`}>
// //                                 <LessonTypeIcon type={ls.type} />
// //                                 {ls.type} · {ls.duration}
// //                               </p>
// //                             </div>
// //                           </button>
// //                         );
// //                       })}
// //                     </div>
// //                   )}

// //                 </div>
// //               );
// //             })}
// //           </div>
// //         </div>

// //       </div>
// //     </div>
// //   );
// // }





























import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ENDPOINT from "../lib/endpoints";

export default function LevelLearning() {
  const { id } = useParams();
  const [level, setLevel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openModules, setOpenModules] = useState({ 0: true });

  const fetchLevel = async () => {
    try {
      setLoading(true);
      const res = await axios.get(ENDPOINT.GET_LEVEL_BY_ID(id));
      setLevel(res.data?.data || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLevel();
  }, [id]);

  const toggleModule = (index) => {
    setOpenModules((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const getChapterIcon = (type) => {
    const t = (type || "").toLowerCase();
    if (t.includes("video"))
      return { icon: "▶", bg: "#E6F1FB", color: "#185FA5", label: "Video lesson" };
    if (t.includes("image") || t.includes("visual"))
      return { icon: "🖼", bg: "#EAF3DE", color: "#3B6D11", label: "Visual guide" };
    if (t.includes("quiz") || t.includes("assess"))
      return { icon: "✎", bg: "#FBEAF0", color: "#993556", label: "Assessment" };
    return { icon: "📄", bg: "#FAEEDA", color: "#854F0B", label: "Reading" };
  };

  if (loading) {
    return (
      <div style={styles.loadingWrap}>
        <div style={styles.loadingBox}>
          <div style={styles.loadingSpinner} />
          <span style={{ color: "#6b7280", fontSize: 14 }}>Loading course...</span>
        </div>
      </div>
    );
  }

  if (!level) {
    return (
      <div style={styles.loadingWrap}>
        <div style={styles.loadingBox}>Level not found.</div>
      </div>
    );
  }

  const modules = level.modules || [];
  const totalChapters = modules.reduce(
    (acc, m) => acc + (m.chapters?.length || m.topics?.length || 0),
    0
  );
  const prerequisites = Array.isArray(level.prerequisites)
    ? level.prerequisites
    : level.prerequisites
    ? [level.prerequisites]
    : ["No prerequisites"];

  return (
    <div style={styles.page}>

      {/* ── HERO ── */}
      <div style={styles.hero}>
        <div style={styles.heroBubble1} />
        <div style={styles.heroBubble2} />
        <div style={styles.heroInner}>
          <span style={styles.heroBadge}>
            <span style={{ fontSize: 12 }}>⬡</span> Level {level.level_number} · {level.difficulty}
          </span>
          <h1 style={styles.heroTitle}>{level.level_name}</h1>
          <p style={styles.heroDesc}>{level.objective}</p>
          <div style={styles.heroMeta}>
            {[
              { icon: "⏱", text: `${level.duration} ${level.duration_unit}` },
              { icon: "⊞", text: `${modules.length} modules` },
              { icon: "◎", text: level.language },
              { icon: "✦", text: "Certificate on completion" },
            ].map((item, i) => (
              <div key={i} style={styles.heroMetaItem}>
                <span style={{ color: "#a78bfa" }}>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={styles.body}>

        {/* LEFT */}
        <div style={styles.left}>

          {/* About */}
          <div style={styles.card}>
            <div style={styles.sectionTitle}>
              <span style={styles.sectionIcon}>ℹ</span> About this course
            </div>
            <p style={styles.aboutText}>
              {level.description || "No description available."}
            </p>
          </div>

          {/* Prerequisites */}
          <div style={styles.card}>
            <div style={styles.sectionTitle}>
              <span style={styles.sectionIcon}>✓</span> Prerequisites
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {prerequisites.map((p, i) => (
                <span key={i} style={styles.prereqPill}>
                  <span style={{ color: "#534AB7", fontSize: 12 }}>✓</span> {p}
                </span>
              ))}
            </div>
          </div>

          {/* Modules */}
          <div style={styles.card}>
            <div style={styles.sectionTitle}>
              <span style={styles.sectionIcon}>☰</span> Course content
              <span style={styles.moduleCount}>
                {modules.length} modules · {totalChapters} chapters
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {modules.length === 0 && (
                <div style={{ color: "#9ca3af", fontSize: 14 }}>No modules added yet.</div>
              )}

              {modules.map((module, index) => {
                const chapters =
                  module.chapters || module.topics || module.lessons || [];
                const isOpen = !!openModules[index];

                return (
                  <div key={index} style={styles.moduleItem}>

                    {/* Module header */}
                    <button
                      style={styles.moduleHeader}
                      onClick={() => toggleModule(index)}
                      aria-expanded={isOpen}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={styles.moduleNum}>
                          {String(index + 1).padStart(2, "0")}
                        </div>
                        <div>
                          <div style={styles.moduleTitle}>
                            {module.title || module.name || `Module ${index + 1}`}
                          </div>
                          <div style={styles.moduleSubtitle}>
                            {chapters.length} chapters
                            {module.duration ? ` · ${module.duration}` : ""}
                          </div>
                        </div>
                      </div>
                      <span
                        style={{
                          ...styles.chevron,
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                      >
                        ▾
                      </span>
                    </button>

                    {/* Module description (collapsed) */}
                    {!isOpen && module.description && (
                      <div style={styles.moduleCollapsedDesc}>
                        {module.description}
                      </div>
                    )}

                    {/* Chapter list */}
                    {isOpen && (
                      <div style={styles.moduleBody}>
                        {chapters.length === 0 && (
                          <div style={styles.emptyChapters}>No chapters yet.</div>
                        )}
                        {chapters.map((chapter, ci) => {
                          const { icon, bg, color, label } = getChapterIcon(
                            chapter.type || chapter.content_type || ""
                          );
                          const done = chapter.completed || chapter.is_completed || false;

                          return (
                            <div
                              key={ci}
                              style={{
                                ...styles.chapterItem,
                                ...(ci === chapters.length - 1
                                  ? { borderBottom: "none" }
                                  : {}),
                              }}
                            >
                              <div
                                style={{
                                  ...styles.chapterIcon,
                                  background: bg,
                                  color,
                                }}
                              >
                                {icon}
                              </div>
                              <div style={styles.chapterInfo}>
                                <div style={styles.chapterName}>
                                  {chapter.title || chapter.name || `Chapter ${ci + 1}`}
                                </div>
                                <div style={styles.chapterType}>{label}</div>
                              </div>
                              {chapter.duration && (
                                <div style={styles.chapterDur}>
                                  ⏱ {chapter.duration}
                                </div>
                              )}
                              <div
                                style={{
                                  ...styles.chapterStatus,
                                  background: done ? "#EAF3DE" : "transparent",
                                  border: done ? "none" : "1.5px solid #d1d5db",
                                  color: done ? "#3B6D11" : "transparent",
                                }}
                              >
                                {done ? "✓" : ""}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={styles.right}>
          <div style={styles.sidebarCard}>

            {/* Thumbnail */}
            <div style={styles.sidebarThumb}>
              <div style={styles.thumbIcon}>{ level.icon || "{ }" }</div>
              <span style={styles.thumbBadge}>Level {level.level_number}</span>
            </div>

            <div style={styles.sidebarBody}>

              {/* Price */}
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 16 }}>
                <span style={styles.price}>
                  {level.price ? `₹${level.price}` : "Free"}
                </span>
                {level.price && (
                  <span style={{ fontSize: 12, color: "#9ca3af" }}>one-time</span>
                )}
              </div>

              {/* CTA */}
              <button style={styles.ctaBtn}>▶ &nbsp;Continue learning</button>

              {/* Progress */}
              {level.progress !== undefined && (
                <div style={{ marginBottom: 16 }}>
                  <div style={styles.progressLabelRow}>
                    <span>Your progress</span>
                    <span>{level.progress}%</span>
                  </div>
                  <div style={styles.progressBar}>
                    <div
                      style={{
                        ...styles.progressFill,
                        width: `${level.progress}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              <hr style={styles.divider} />

              {/* Stats grid */}
              <div style={styles.statsGrid}>
                {[
                  { label: "Duration", value: `${level.duration} ${level.duration_unit}` },
                  { label: "Modules", value: modules.length },
                  { label: "Chapters", value: totalChapters || "—" },
                  { label: "Language", value: level.language },
                ].map((s, i) => (
                  <div key={i} style={styles.statChip}>
                    <div style={styles.statLabel}>{s.label}</div>
                    <div style={styles.statValue}>{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Certificate callout */}
              <div style={styles.certRow}>
                <span style={{ fontSize: 20 }}>🎓</span>
                <span style={styles.certText}>
                  Earn a certificate of completion upon finishing all modules
                </span>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ── STYLES ── */
const styles = {
  page: {
    background: "#f3f4f6",
    minHeight: "100vh",
    fontFamily: "Inter, system-ui, sans-serif",
  },

  /* Loading */
  loadingWrap: { padding: 24 },
  loadingBox: {
    background: "#fff",
    borderRadius: 16,
    padding: 40,
    border: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  loadingSpinner: {
    width: 18, height: 18,
    border: "2px solid #e5e7eb",
    borderTop: "2px solid #7c3aed",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },

  /* Hero */
  hero: {
    background: "#1e1045",
    color: "#fff",
    padding: "40px 32px 48px",
    position: "relative",
    overflow: "hidden",
  },
  heroBubble1: {
    position: "absolute", top: -60, right: -60,
    width: 320, height: 320, borderRadius: "50%",
    background: "#3b2290", zIndex: 0,
  },
  heroBubble2: {
    position: "absolute", bottom: -80, left: "40%",
    width: 200, height: 200, borderRadius: "50%",
    background: "#2a1870", zIndex: 0,
  },
  heroInner: { position: "relative", zIndex: 1, maxWidth: 680 },
  heroBadge: {
    display: "inline-flex", alignItems: "center", gap: 6,
    background: "rgba(255,255,255,0.12)",
    border: "0.5px solid rgba(255,255,255,0.25)",
    borderRadius: 20, padding: "4px 14px",
    fontSize: 12, color: "rgba(255,255,255,0.9)",
    marginBottom: 14,
  },
  heroTitle: {
    fontSize: 28, fontWeight: 600, lineHeight: 1.3,
    margin: "0 0 12px",
  },
  heroDesc: {
    fontSize: 15, color: "rgba(255,255,255,0.65)",
    lineHeight: 1.7, margin: "0 0 20px",
  },
  heroMeta: { display: "flex", flexWrap: "wrap", gap: 20 },
  heroMetaItem: {
    display: "flex", alignItems: "center", gap: 7,
    fontSize: 13, color: "rgba(255,255,255,0.75)",
  },

  /* Body layout */
  body: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "24px 24px 48px",
    display: "grid",
    gridTemplateColumns: "1fr 300px",
    gap: 24,
    alignItems: "start",
  },
  left: { display: "flex", flexDirection: "column", gap: 0 },

  /* Cards */
  card: {
    background: "#fff",
    border: "0.5px solid #e5e7eb",
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15, fontWeight: 600,
    color: "#111827",
    marginBottom: 16,
    display: "flex", alignItems: "center", gap: 8,
  },
  sectionIcon: { color: "#7c3aed", fontSize: 16 },
  moduleCount: {
    marginLeft: "auto",
    fontSize: 12, fontWeight: 400,
    color: "#9ca3af",
  },
  aboutText: {
    fontSize: 14, color: "#6b7280", lineHeight: 1.75,
  },

  /* Prereq */
  prereqPill: {
    display: "inline-flex", alignItems: "center", gap: 6,
    background: "#EEEDFE", color: "#3C3489",
    fontSize: 13, padding: "6px 14px", borderRadius: 20,
  },

  /* Module */
  moduleItem: {
    border: "0.5px solid #e5e7eb",
    borderRadius: 12,
    overflow: "hidden",
  },
  moduleHeader: {
    width: "100%",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "14px 16px",
    background: "#fff",
    border: "none", cursor: "pointer",
    textAlign: "left",
    transition: "background 0.15s",
  },
  moduleNum: {
    width: 30, height: 30, borderRadius: 8,
    background: "#EEEDFE", color: "#534AB7",
    fontSize: 12, fontWeight: 600,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  moduleTitle: {
    fontSize: 14, fontWeight: 600, color: "#111827",
  },
  moduleSubtitle: {
    fontSize: 12, color: "#9ca3af", marginTop: 2,
  },
  chevron: {
    fontSize: 18, color: "#9ca3af",
    transition: "transform 0.2s",
    display: "inline-block",  
  },
  moduleCollapsedDesc: {
    padding: "0 16px 12px 58px",
    fontSize: 13, color: "#9ca3af", lineHeight: 1.5,
    background: "#fff",
  },
  moduleBody: {
    borderTop: "0.5px solid #e5e7eb",
    background: "#fafafa",
  },
  emptyChapters: {
    padding: "16px 16px 16px 56px",
    fontSize: 13, color: "#9ca3af",
  },

  /* Chapter */
  chapterItem: {
    display: "flex", alignItems: "center", gap: 12,
    padding: "11px 16px 11px 56px",
    borderBottom: "0.5px solid #e5e7eb",
    cursor: "pointer",
    transition: "background 0.1s",
  },
  chapterIcon: {
    width: 32, height: 32, borderRadius: 8,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 14, flexShrink: 0,
  },
  chapterInfo: { flex: 1 },
  chapterName: { fontSize: 13, fontWeight: 500, color: "#111827" },
  chapterType: { fontSize: 11, color: "#9ca3af", marginTop: 1 },
  chapterDur: {
    fontSize: 12, color: "#9ca3af",
    whiteSpace: "nowrap",
  },
  chapterStatus: {
    width: 20, height: 20, borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 11, fontWeight: 700, flexShrink: 0,
  },

  /* Sidebar */
  right: {},
  sidebarCard: {
    background: "#fff",
    border: "0.5px solid #e5e7eb",
    borderRadius: 16,
    overflow: "hidden",
    position: "sticky",
    top: 20,
  },
  sidebarThumb: {
    height: 150, background: "#1e1045",
    display: "flex", alignItems: "center", justifyContent: "center",
    position: "relative",
  },
  thumbIcon: {
    fontSize: 42, fontWeight: 700,
    color: "#7c3aed", letterSpacing: -2,
  },
  thumbBadge: {
    position: "absolute", top: 10, right: 10,
    background: "rgba(255,255,255,0.15)",
    border: "0.5px solid rgba(255,255,255,0.25)",
    color: "#fff", fontSize: 11,
    padding: "3px 10px", borderRadius: 12,
  },
  sidebarBody: { padding: 20 },
  price: { fontSize: 28, fontWeight: 700, color: "#111827" },
  ctaBtn: {
    width: "100%",
    background: "#5b21b6", color: "#fff",
    border: "none", borderRadius: 10,
    padding: "12px 0",
    fontSize: 14, fontWeight: 600,
    cursor: "pointer",
    marginBottom: 16,
    letterSpacing: 0.2,
  },
  progressLabelRow: {
    display: "flex", justifyContent: "space-between",
    fontSize: 12, color: "#9ca3af", marginBottom: 6,
  },
  progressBar: {
    height: 6, borderRadius: 4,
    background: "#f3f4f6",
  },
  progressFill: {
    height: "100%", borderRadius: 4,
    background: "#7c3aed",
    transition: "width 0.4s ease",
  },
  divider: {
    border: "none",
    borderTop: "0.5px solid #e5e7eb",
    margin: "16px 0",
  },
  statsGrid: {
    display: "grid", gridTemplateColumns: "1fr 1fr",
    gap: 8, marginBottom: 16,
  },
  statChip: {
    background: "#f9fafb",
    borderRadius: 10, padding: "10px 12px",
  },
  statLabel: { fontSize: 11, color: "#9ca3af", marginBottom: 2 },
  statValue: { fontSize: 13, fontWeight: 600, color: "#111827" },
  certRow: {
    display: "flex", alignItems: "flex-start", gap: 10,
    background: "#EEEDFE",
    borderRadius: 10, padding: "10px 14px",
  },
  certText: { fontSize: 12, color: "#3C3489", lineHeight: 1.5 },
};

















// src/pages/student/LevelLearning.jsx

// import { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import {
//   ArrowLeft, ArrowRight, CheckCircle2, Circle, PlayCircle,
//   ChevronDown, ChevronUp, Clock, BookOpen, Layers, Check,
//   Target, Wrench, PenLine, Lock, Menu, X, FileText,
//   MessageSquare, Star, Award, BarChart2, Volume2, Maximize2,
//   SkipForward, SkipBack, Settings, Subtitles,
// } from "lucide-react";
// import { useNavigate, useParams } from "react-router-dom";
// import ENDPOINT from "../lib/endpoints";

// /* ─── tiny helpers ─────────────────────────────────────────── */
// const diffColor = {
//   Beginner:     { bg: "#DCFCE7", fg: "#15803D", dot: "#22C55E" },
//   Intermediate: { bg: "#FEF9C3", fg: "#A16207", dot: "#EAB308" },
//   Advanced:     { bg: "#FEE2E2", fg: "#B91C1C", dot: "#EF4444" },
// };

// function TypeIcon({ type = "", size = 14, className = "" }) {
//   const t = type.toLowerCase();
//   if (t.includes("video")) return <PlayCircle size={size} className={className} />;
//   if (t.includes("project") || t.includes("exercise")) return <Wrench size={size} className={className} />;
//   if (t.includes("quiz") || t.includes("assess")) return <BarChart2 size={size} className={className} />;
//   return <FileText size={size} className={className} />;
// }

// function LessonTypeLabel({ type = "" }) {
//   const t = type.toLowerCase();
//   if (t.includes("video"))   return <span style={css.typeVideo}>Video</span>;
//   if (t.includes("project")) return <span style={css.typeProject}>Project</span>;
//   if (t.includes("quiz"))    return <span style={css.typeQuiz}>Quiz</span>;
//   return <span style={css.typeRead}>Reading</span>;
// }

// /* ─── main component ───────────────────────────────────────── */
// export default function LevelLearning() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [level, setLevel]                     = useState(null);
//   const [loading, setLoading]                 = useState(true);
//   const [activeLessonId, setActiveLessonId]   = useState(null);
//   const [openModules, setOpenModules]         = useState({});
//   const [completedLessons, setCompletedLessons] = useState(new Set());
//   const [playing, setPlaying]                 = useState(false);
//   const [activeTab, setActiveTab]             = useState("overview");
//   const [sidebarOpen, setSidebarOpen]         = useState(true);
//   const [activeRating, setActiveRating]       = useState(0);
//   const [hoverRating, setHoverRating]         = useState(0);

//   /* fetch */
//   const fetchLevel = async () => {
//     try {
//       setLoading(true);
//       const res  = await axios.get(ENDPOINT.GET_LEVEL_BY_ID(id));
//       const data = res.data?.data || res.data?.level || res.data;
//       setLevel(data);

//       if (data?.completed_lesson_ids?.length)
//         setCompletedLessons(new Set(data.completed_lesson_ids));

//       // open all modules, select first lesson
//       const mods = data?.modules || [];
//       const initOpen = {};
//       mods.forEach((m, i) => { initOpen[m.id ?? i] = true; });
//       setOpenModules(initOpen);

//       const firstLesson = mods[0]?.lessons?.[0]
//         ?? mods[0]?.chapters?.[0]
//         ?? mods[0]?.topics?.[0];
//       if (firstLesson) setActiveLessonId(firstLesson.id ?? firstLesson._id ?? 0);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchLevel(); }, [id]);

//   /* helpers */
//   const getLessons = (mod) => mod?.lessons || mod?.chapters || mod?.topics || [];
//   const allLessons = () => (level?.modules || []).flatMap(getLessons);
//   const totalLessons   = () => allLessons().length;
//   const completedCount = () => allLessons().filter((l) => completedLessons.has(l.id ?? l._id)).length;
//   const overallProgress = () => {
//     const t = totalLessons(); return t ? Math.round((completedCount() / t) * 100) : 0;
//   };
//   const moduleProgress = (mod) => {
//     const ls = getLessons(mod);
//     if (!ls.length) return 0;
//     return Math.round((ls.filter((l) => completedLessons.has(l.id ?? l._id)).length / ls.length) * 100);
//   };

//   const activeLesson = () => allLessons().find((l) => (l.id ?? l._id) === activeLessonId);
//   const activeModule = () => level?.modules?.find((m) => getLessons(m).some((l) => (l.id ?? l._id) === activeLessonId));
//   const activeIndex  = () => allLessons().findIndex((l) => (l.id ?? l._id) === activeLessonId);

//   const toggleModule = (key) =>
//     setOpenModules((p) => ({ ...p, [key]: !p[key] }));

//   const selectLesson = (lesson) => {
//     const lid = lesson.id ?? lesson._id;
//     setActiveLessonId(lid);
//     setPlaying(false);
//     const mod = level?.modules?.find((m) => getLessons(m).some((l) => (l.id ?? l._id) === lid));
//     if (mod) setOpenModules((p) => ({ ...p, [mod.id ?? mod._id ?? level.modules.indexOf(mod)]: true }));
//   };

//   const markComplete = async () => {
//     const lid = activeLessonId;
//     const next = new Set(completedLessons);
//     if (next.has(lid)) {
//       next.delete(lid);
//     } else {
//       next.add(lid);
//       try { await axios.post(ENDPOINT.MARK_LESSON_COMPLETE?.({ lessonId: lid }) || "#", { lesson_id: lid }); }
//       catch (_) {}
//       const all = allLessons();
//       const idx = all.findIndex((l) => (l.id ?? l._id) === lid);
//       if (idx < all.length - 1) {
//         const nx = all[idx + 1];
//         setActiveLessonId(nx.id ?? nx._id);
//         const nxMod = level.modules.find((m) => getLessons(m).some((l) => (l.id ?? l._id) === (nx.id ?? nx._id)));
//         if (nxMod) setOpenModules((p) => ({ ...p, [nxMod.id ?? nxMod._id ?? level.modules.indexOf(nxMod)]: true }));
//       }
//     }
//     setCompletedLessons(next);
//     setPlaying(false);
//   };

//   const goTo = (dir) => {
//     const all = allLessons();
//     const idx = activeIndex();
//     const target = dir === "prev" ? all[idx - 1] : all[idx + 1];
//     if (!target) return;
//     selectLesson(target);
//   };

//   /* ── loading ── */
//   if (loading) return (
//     <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:"#0F1117" }}>
//       <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:16 }}>
//         <div style={css.spinner} />
//         <span style={{ color:"#6B7280", fontSize:14 }}>Loading your course…</span>
//       </div>
//     </div>
//   );

//   if (!level) return (
//     <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100vh", gap:12, background:"#0F1117" }}>
//       <p style={{ color:"#9CA3AF" }}>Level not found.</p>
//       <button onClick={() => navigate("/student/my-courses")} style={css.ghostBtn}>← Back to My Learning</button>
//     </div>
//   );

//   const lesson   = activeLesson();
//   const mod      = activeModule();
//   const idx      = activeIndex();
//   const total    = totalLessons();
//   const done     = completedCount();
//   const progress = overallProgress();
//   const isDone   = completedLessons.has(activeLessonId);
//   const diff     = diffColor[level.difficulty] || diffColor.Beginner;

//   return (
//     <div style={css.root}>

//       {/* ═══════════════════ TOP NAV ═══════════════════ */}
//       <header style={css.topNav}>
//         <div style={css.navLeft}>
//           <button style={css.sidebarToggle} onClick={() => setSidebarOpen(p => !p)} title="Toggle sidebar">
//             {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
//           </button>
//           <button style={css.backBtn} onClick={() => navigate("/student/my-courses")}>
//             <ArrowLeft size={15} /> My Learning
//           </button>
//           <span style={css.navDivider} />
//           <div style={css.navTitle}>
//             <span style={css.navCrumb}>Level {level.level_number}</span>
//             <span style={css.navName}>{level.level_name || level.title}</span>
//           </div>
//         </div>
//         <div style={css.navRight}>
//           <div style={css.navProgress}>
//             <div style={css.navProgressBar}>
//               <div style={{ ...css.navProgressFill, width: `${progress}%` }} />
//             </div>
//             <span style={css.navProgressLabel}>{progress}%</span>
//           </div>
//           <span style={{ ...css.diffBadge, background: diff.bg, color: diff.fg }}>
//             <span style={{ width:6, height:6, borderRadius:"50%", background: diff.dot, display:"inline-block" }} />
//             {level.difficulty}
//           </span>
//         </div>
//       </header>

//       {/* ═══════════════════ BODY ═══════════════════ */}
//       <div style={css.body}>

//         {/* ─── MAIN CONTENT ─── */}
//         <main style={css.main}>

//           {/* VIDEO PLAYER */}
//           <div style={css.playerWrap}>
//             {playing ? (
//               <div style={css.videoFrame}>
//                 {lesson?.video_url ? (
//                   <iframe
//                     src={lesson.video_url}
//                     style={{ width:"100%", height:"100%", border:"none" }}
//                     allow="autoplay; fullscreen"
//                     allowFullScreen
//                     title={lesson.title}
//                   />
//                 ) : (
//                   <div style={css.videoPlaceholder}>
//                     <div style={css.videoPlaceholderInner}>
//                       <div style={css.videoWaveform}>
//                         {[4,7,5,9,6,8,4,7,5,6,9,7].map((h,i)=>(
//                           <div key={i} style={{ ...css.waveBar, height: h*3, animationDelay:`${i*0.1}s` }} />
//                         ))}
//                       </div>
//                       <p style={{ color:"rgba(255,255,255,0.5)", fontSize:13, marginTop:16 }}>
//                         Video player — attach your media source
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               /* Thumbnail / play screen */
//               <div style={css.videoThumb} onClick={() => setPlaying(true)}>
//                 <div style={css.thumbGradient} />
//                 {/* Floating lesson type badge */}
//                 <div style={css.thumbTypeBadge}>
//                   <TypeIcon type={lesson?.type || "video"} size={13} />
//                   {lesson?.type || "Video Lesson"}
//                 </div>
//                 <button style={css.playBtn}>
//                   <div style={css.playRipple} />
//                   <PlayCircle size={52} color="#fff" strokeWidth={1.5} />
//                 </button>
//                 <div style={css.thumbMeta}>
//                   <p style={css.thumbTitle}>{lesson?.title || "Select a lesson"}</p>
//                   <p style={css.thumbSub}>
//                     <Clock size={12} style={{ opacity:.7 }} />
//                     {lesson?.duration || "—"}
//                     {mod && <><span style={{ opacity:.3 }}> · </span>{mod.title}</>}
//                   </p>
//                 </div>
//                 <span style={css.lessonCounter}>{idx + 1} / {total}</span>
//               </div>
//             )}

//             {/* Player controls bar */}
//             <div style={css.controls}>
//               <div style={css.controlsLeft}>
//                 <button style={css.ctrlBtn} onClick={() => goTo("prev")} disabled={idx <= 0} title="Previous">
//                   <SkipBack size={16} />
//                 </button>
//                 <button style={css.ctrlBtnPrimary} onClick={() => setPlaying(p => !p)} title={playing ? "Pause" : "Play"}>
//                   {playing
//                     ? <span style={{ fontSize:13, fontWeight:700, letterSpacing:1 }}>❚❚</span>
//                     : <span style={{ fontSize:13, marginLeft:2 }}>▶</span>}
//                 </button>
//                 <button style={css.ctrlBtn} onClick={() => goTo("next")} disabled={idx >= total - 1} title="Next">
//                   <SkipForward size={16} />
//                 </button>
//                 <div style={css.lessonTitleBar}>
//                   <span style={css.lessonTitleSmall}>{lesson?.title}</span>
//                   <span style={css.lessonIndexSmall}>{idx + 1}/{total}</span>
//                 </div>
//               </div>
//               <div style={css.controlsRight}>
//                 <button
//                   style={{ ...css.markBtn, ...(isDone ? css.markBtnDone : {}) }}
//                   onClick={markComplete}
//                 >
//                   <Check size={14} />
//                   {isDone ? "Completed" : "Mark complete"}
//                 </button>
//                 <button style={css.ctrlBtn} title="Settings"><Settings size={15} /></button>
//                 <button style={css.ctrlBtn} title="Fullscreen"><Maximize2 size={15} /></button>
//               </div>
//             </div>
//           </div>

//           {/* ─── TABS ─── */}
//           <div style={css.tabBar}>
//             {["overview","notes","qa","resources"].map(tab => (
//               <button
//                 key={tab}
//                 style={{ ...css.tabBtn, ...(activeTab===tab ? css.tabBtnActive : {}) }}
//                 onClick={() => setActiveTab(tab)}
//               >
//                 {tab === "overview"   && <BookOpen size={14} />}
//                 {tab === "notes"      && <PenLine size={14} />}
//                 {tab === "qa"         && <MessageSquare size={14} />}
//                 {tab === "resources"  && <FileText size={14} />}
//                 <span style={{ textTransform:"capitalize" }}>{tab === "qa" ? "Q&A" : tab}</span>
//               </button>
//             ))}
//           </div>

//           <div style={css.tabContent}>

//             {/* OVERVIEW TAB */}
//             {activeTab === "overview" && (
//               <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

//                 {/* Lesson detail */}
//                 <div style={css.infoCard}>
//                   <div style={css.infoCardHeader}>
//                     <div>
//                       <h2 style={css.lessonTitle}>{lesson?.title}</h2>
//                       <div style={css.lessonMeta}>
//                         <LessonTypeLabel type={lesson?.type || "video"} />
//                         <span style={css.metaDot}>·</span>
//                         <Clock size={12} color="#9CA3AF" />
//                         <span>{lesson?.duration || "—"}</span>
//                         {mod && <>
//                           <span style={css.metaDot}>·</span>
//                           <Layers size={12} color="#9CA3AF" />
//                           <span>{mod.title}</span>
//                         </>}
//                       </div>
//                     </div>
//                     <div style={css.infoCardBadge}>
//                       <TypeIcon type={lesson?.type || "video"} size={22} className="" />
//                     </div>
//                   </div>
//                   <p style={css.infoCardDesc}>
//                     {lesson?.description
//                       || `In this lesson you'll explore "${lesson?.title}" as part of the ${mod?.title || "module"}. Follow along with the video and complete any activities at your own pace.`}
//                   </p>
//                 </div>

//                 {/* Learning outcomes */}
//                 {level.outcomes?.length > 0 && (
//                   <div style={css.outcomesCard}>
//                     <div style={css.outcomesTitle}>
//                       <Target size={15} color="#6366F1" />
//                       What you'll learn
//                     </div>
//                     <div style={css.outcomesGrid}>
//                       {level.outcomes.map((o, i) => (
//                         <div key={i} style={css.outcomeItem}>
//                           <CheckCircle2 size={15} color="#10B981" style={{ flexShrink:0, marginTop:1 }} />
//                           <span>{o}</span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Module topics + activities */}
//                 {(mod?.topics?.length > 0 || mod?.activities?.length > 0) && (
//                   <div style={css.infoCard}>
//                     <div style={{ ...css.outcomesTitle, marginBottom:14 }}>
//                       <BookOpen size={15} color="#6366F1" />
//                       Topics in "{mod?.title}"
//                     </div>
//                     {mod.topics?.length > 0 && (
//                       <ul style={{ margin:0, padding:0, listStyle:"none", display:"flex", flexDirection:"column", gap:8 }}>
//                         {mod.topics.map((t, i) => (
//                           <li key={i} style={css.topicItem}>
//                             <span style={css.topicBullet}>▸</span> {t}
//                           </li>
//                         ))}
//                       </ul>
//                     )}
//                     {mod.activities?.length > 0 && (
//                       <div style={{ marginTop:16, paddingTop:16, borderTop:"1px solid #F3F4F6" }}>
//                         <div style={{ ...css.outcomesTitle, fontSize:12, marginBottom:10, color:"#6B7280" }}>
//                           <PenLine size={13} /> Practice Tasks
//                         </div>
//                         {mod.activities.map((a, i) => (
//                           <div key={i} style={css.topicItem}>
//                             <CheckCircle2 size={13} color="#6366F1" style={{ flexShrink:0 }} />
//                             {a}
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* Stats row */}
//                 <div style={css.statsRow}>
//                   {[
//                     { icon: <Layers size={18} color="#6366F1" />, value: level.modules?.length || 0, label:"Modules" },
//                     { icon: <BookOpen size={18} color="#10B981" />, value: total, label:"Lessons" },
//                     { icon: <Clock size={18} color="#F59E0B" />, value: `${level.duration || "—"} ${level.duration_unit?.[0] || ""}`, label:"Duration" },
//                     { icon: <Award size={18} color="#EF4444" />, value: done, label:"Completed" },
//                   ].map((s) => (
//                     <div key={s.label} style={css.statCard}>
//                       <div style={css.statIcon}>{s.icon}</div>
//                       <div style={css.statValue}>{s.value}</div>
//                       <div style={css.statLabel}>{s.label}</div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* NOTES TAB */}
//             {activeTab === "notes" && (
//               <div style={css.emptyTab}>
//                 <PenLine size={32} color="#E5E7EB" />
//                 <p style={{ color:"#9CA3AF", fontSize:14 }}>Your notes for this lesson will appear here.</p>
//                 <textarea
//                   placeholder={`Take notes on "${lesson?.title}"…`}
//                   style={css.notesArea}
//                 />
//               </div>
//             )}

//             {/* Q&A TAB */}
//             {activeTab === "qa" && (
//               <div style={css.emptyTab}>
//                 <MessageSquare size={32} color="#E5E7EB" />
//                 <p style={{ color:"#9CA3AF", fontSize:14 }}>No questions yet for this lesson.</p>
//                 <button style={css.askBtn}>Ask a question</button>
//               </div> 
//             )}

//             {/* RESOURCES TAB */}
//             {activeTab === "resources" && (
//               <div style={css.emptyTab}>
//                 <FileText size={32} color="#E5E7EB" />
//                 <p style={{ color:"#9CA3AF", fontSize:14 }}>No downloadable resources for this lesson.</p>
//               </div>
//             )}

//           </div>
//         </main>

//         {/* ─── SIDEBAR ─── */}
//         {sidebarOpen && (
//           <aside style={css.sidebar}>

//             {/* Sidebar header */}
//             <div style={css.sidebarHeader}>
//               <div>
//                 <div style={css.sidebarTitle}>Course Content</div>
//                 <div style={css.sidebarSubtitle}>
//                   {done}/{total} completed
//                 </div>
//               </div>
//               <div style={css.sidebarProgressWrap}>
//                 <div style={css.sidebarProgressBar}>
//                   <div style={{ ...css.sidebarProgressFill, width:`${progress}%` }} />
//                 </div>
//                 <span style={css.sidebarProgressPct}>{progress}%</span>
//               </div>
//             </div>

//             {/* Modules */}
//             <div style={css.sidebarScroll}>
//               {(level.modules || []).map((module, mi) => {
//                 const key      = module.id ?? module._id ?? mi;
//                 const lessons  = getLessons(module);
//                 const isOpen   = !!openModules[key];
//                 const mp       = moduleProgress(module);
//                 const allDone  = mp === 100;
//                 const hasActive = lessons.some((l) => (l.id ?? l._id) === activeLessonId);

//                 return (
//                   <div key={key} style={css.moduleBlock}>

//                     {/* Module header */}
//                     <button
//                       style={{
//                         ...css.moduleBtn,
//                         ...(hasActive ? css.moduleBtnActive : {}),
//                       }}
//                       onClick={() => toggleModule(key)}
//                     >
//                       <div style={css.moduleLeft}>
//                         <div style={{
//                           ...css.moduleNum,
//                           ...(allDone ? css.moduleNumDone : hasActive ? css.moduleNumActive : {}),
//                         }}>
//                           {allDone ? <Check size={11} /> : mi + 1}
//                         </div>
//                         <div style={{ minWidth:0 }}>
//                           <div style={css.moduleName}>{module.title || `Module ${mi + 1}`}</div>
//                           <div style={css.moduleMeta}>
//                             {lessons.length} lessons
//                             {module.duration && ` · ${module.duration}`}
//                             <span style={{ marginLeft:6, color: allDone ? "#10B981" : "#6366F1" }}>
//                               {mp}%
//                             </span>
//                           </div>
//                           {/* Mini progress bar */}
//                           <div style={css.moduleBar}>
//                             <div style={{ ...css.moduleBarFill, width:`${mp}%`, background: allDone ? "#10B981" : "#6366F1" }} />
//                           </div>
//                         </div>
//                       </div>
//                       <span style={{ color:"#9CA3AF", fontSize:14, transition:"transform .2s", transform: isOpen ? "rotate(180deg)" : "none" }}>▾</span>
//                     </button>

//                     {/* Lessons */}
//                     {isOpen && (
//                       <div style={css.lessonList}>
//                         {lessons.length === 0 && (
//                           <div style={css.emptyLessons}>No lessons added yet.</div>
//                         )}
//                         {lessons.map((ls, li) => {
//                           const lid         = ls.id ?? ls._id ?? li;
//                           const isCompleted = completedLessons.has(lid);
//                           const isCurrent   = lid === activeLessonId;

//                           return (
//                             <button
//                               key={lid}
//                               onClick={() => selectLesson(ls)}
//                               style={{
//                                 ...css.lessonItem,
//                                 ...(isCurrent ? css.lessonItemActive : {}),
//                               }}
//                             >
//                               {/* Status icon */}
//                               <div style={css.lessonStatusWrap}>
//                                 {isCompleted
//                                   ? <CheckCircle2 size={16} color={isCurrent ? "#A5F3C4" : "#10B981"} />
//                                   : isCurrent
//                                     ? <div style={css.lessonPlayDot}><div style={css.lessonPlayPulse} /></div>
//                                     : <Circle size={16} color="#D1D5DB" />
//                                 }
//                               </div>

//                               {/* Content */}
//                               <div style={css.lessonContent}>
//                                 <span style={{
//                                   ...css.lessonName,
//                                   ...(isCurrent ? css.lessonNameActive : {}),
//                                   ...(isCompleted && !isCurrent ? { color:"#6B7280" } : {}),
//                                 }}>
//                                   {ls.title || ls.name || `Lesson ${li + 1}`}
//                                 </span>
//                                 <div style={css.lessonSubMeta}>
//                                   <TypeIcon type={ls.type || "video"} size={10} />
//                                   <span>{ls.type || "Video"}</span>
//                                   {ls.duration && <>
//                                     <span style={css.metaDot}>·</span>
//                                     <Clock size={10} />
//                                     <span>{ls.duration}</span>
//                                   </>}
//                                 </div>
//                               </div>

//                               {/* Duration tag */}
//                               {ls.duration && (
//                                 <span style={{
//                                   ...css.lessonDurTag,
//                                   ...(isCurrent ? css.lessonDurTagActive : {}),
//                                 }}>
//                                   {ls.duration}
//                                 </span>
//                               )}
//                             </button>
//                           );
//                         })}
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>

//             {/* Sidebar footer — cert callout */}
//             <div style={css.sidebarFooter}>
//               <Award size={18} color="#F59E0B" />
//               <div>
//                 <div style={{ fontSize:12, fontWeight:600, color:"#111827" }}>Certificate of Completion</div>
//                 <div style={{ fontSize:11, color:"#9CA3AF", marginTop:2 }}>Finish all lessons to earn your certificate</div>
//               </div>
//             </div>
//           </aside>
//         )}

//       </div>
//     </div>
//   );
// }

// /* ═══════════════════ STYLES ═══════════════════ */
// const css = {
//   /* Root */
//   root: {
//     display:"flex", flexDirection:"column",
//     height:"100vh", overflow:"hidden",
//     fontFamily:"'Inter', system-ui, -apple-system, sans-serif",
//     background:"#F9FAFB",
//     color:"#111827",
//   },

//   /* Spinner */
//   spinner: {
//     width:28, height:28,
//     border:"2.5px solid #1F2937",
//     borderTop:"2.5px solid #6366F1",
//     borderRadius:"50%",
//     animation:"spin 0.7s linear infinite",
//   },

//   /* Top nav */
//   topNav: {
//     height:52, flexShrink:0,
//     background:"#0F1117",
//     borderBottom:"1px solid #1F2937",
//     display:"flex", alignItems:"center",
//     justifyContent:"space-between",
//     padding:"0 16px",
//     gap:12,
//     zIndex:10,
//   },
//   navLeft: { display:"flex", alignItems:"center", gap:10, minWidth:0 },
//   sidebarToggle: {
//     background:"transparent", border:"none", cursor:"pointer",
//     color:"#9CA3AF", padding:6, borderRadius:6,
//     display:"flex", alignItems:"center",
//     ":hover": { background:"#1F2937" },
//   },
//   backBtn: {
//     display:"flex", alignItems:"center", gap:6,
//     background:"transparent", border:"1px solid #374151",
//     color:"#9CA3AF", borderRadius:8, padding:"5px 10px",
//     fontSize:12, cursor:"pointer", whiteSpace:"nowrap",
//     transition:"all .15s",
//   },
//   navDivider: { width:1, height:20, background:"#1F2937", flexShrink:0 },
//   navTitle: { display:"flex", flexDirection:"column", gap:1, minWidth:0 },
//   navCrumb: { fontSize:10, color:"#6B7280", textTransform:"uppercase", letterSpacing:.5 },
//   navName: { fontSize:13, fontWeight:600, color:"#E5E7EB", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:280 },
//   navRight: { display:"flex", alignItems:"center", gap:12, flexShrink:0 },
//   navProgress: { display:"flex", alignItems:"center", gap:8 },
//   navProgressBar: { width:100, height:4, background:"#1F2937", borderRadius:2, overflow:"hidden" },
//   navProgressFill: { height:"100%", background:"#6366F1", borderRadius:2, transition:"width .4s ease" },
//   navProgressLabel: { fontSize:11, color:"#9CA3AF" },
//   diffBadge: {
//     display:"flex", alignItems:"center", gap:5,
//     fontSize:11, fontWeight:500, padding:"3px 10px", borderRadius:20,
//   },
//   ghostBtn: {
//     background:"transparent", border:"1px solid #374151",
//     color:"#9CA3AF", padding:"8px 16px", borderRadius:8, cursor:"pointer", fontSize:13,
//   },

//   /* Body */
//   body: { display:"flex", flex:1, overflow:"hidden" },

//   /* Main */
//   main: { flex:1, overflowY:"auto", display:"flex", flexDirection:"column" },

//   /* Player */
//   playerWrap: { background:"#0F1117", flexShrink:0 },
//   videoFrame: {
//     aspectRatio:"16/7", maxHeight:380,
//     background:"#000",
//   },
//   videoThumb: {
//     aspectRatio:"16/7", maxHeight:380,
//     background:"linear-gradient(135deg,#1a0533 0%,#0F1117 60%,#110b26 100%)",
//     display:"flex", flexDirection:"column",
//     alignItems:"center", justifyContent:"center",
//     position:"relative", cursor:"pointer", overflow:"hidden",
//   },
//   thumbGradient: {
//     position:"absolute", inset:0,
//     backgroundImage:"radial-gradient(circle at 30% 70%, rgba(99,102,241,0.18) 0%, transparent 60%)",
//   },
//   thumbTypeBadge: {
//     position:"absolute", top:14, left:14,
//     display:"flex", alignItems:"center", gap:6,
//     background:"rgba(255,255,255,0.1)",
//     border:"0.5px solid rgba(255,255,255,0.2)",
//     color:"rgba(255,255,255,0.85)", fontSize:11, padding:"4px 12px", borderRadius:20,
//   },
//   playBtn: {
//     background:"transparent", border:"none", cursor:"pointer",
//     position:"relative", padding:0,
//     transition:"transform .15s",
//     ":hover": { transform:"scale(1.05)" },
//   },
//   playRipple: {
//     position:"absolute", inset:-12,
//     borderRadius:"50%",
//     background:"rgba(99,102,241,0.2)",
//     animation:"ripple 1.8s ease-out infinite",
//   },
//   thumbMeta: { textAlign:"center", marginTop:16 },
//   thumbTitle: {
//     color:"#fff", fontSize:17, fontWeight:600,
//     maxWidth:500, textAlign:"center", lineHeight:1.35,
//     margin:"0 0 8px",
//   },
//   thumbSub: {
//     display:"flex", alignItems:"center", justifyContent:"center", gap:6,
//     color:"rgba(255,255,255,0.45)", fontSize:12,
//   },
//   lessonCounter: {
//     position:"absolute", bottom:12, right:14,
//     background:"rgba(0,0,0,0.55)", backdropFilter:"blur(4px)",
//     color:"rgba(255,255,255,0.75)", fontSize:11, padding:"3px 10px", borderRadius:12,
//   },
//   videoPlaceholder: {
//     width:"100%", height:"100%",
//     display:"flex", alignItems:"center", justifyContent:"center",
//     background:"#080D14",
//   },
//   videoPlaceholderInner: { display:"flex", flexDirection:"column", alignItems:"center" },
//   videoWaveform: { display:"flex", alignItems:"flex-end", gap:3, height:36 },
//   waveBar: {
//     width:4, background:"#6366F1", borderRadius:2,
//     opacity:.7, animation:"wave 1s ease-in-out infinite alternate",
//   },

//   /* Controls bar */
//   controls: {
//     display:"flex", alignItems:"center", justifyContent:"space-between",
//     padding:"8px 16px",
//     background:"#16181F",
//     borderTop:"1px solid #1F2937",
//     gap:8,
//   },
//   controlsLeft:  { display:"flex", alignItems:"center", gap:8 },
//   controlsRight: { display:"flex", alignItems:"center", gap:8 },
//   ctrlBtn: {
//     background:"transparent", border:"none", cursor:"pointer",
//     color:"#9CA3AF", padding:"6px 8px", borderRadius:6,
//     display:"flex", alignItems:"center",
//     transition:"color .1s",
//   },
//   ctrlBtnPrimary: {
//     width:34, height:34,
//     background:"#6366F1", border:"none", borderRadius:"50%", cursor:"pointer",
//     color:"#fff", display:"flex", alignItems:"center", justifyContent:"center",
//   },
//   lessonTitleBar: {
//     display:"flex", alignItems:"center", gap:8,
//     paddingLeft:4,
//   },
//   lessonTitleSmall: { fontSize:13, fontWeight:500, color:"#E5E7EB" },
//   lessonIndexSmall: {
//     fontSize:11, color:"#6B7280",
//     background:"#1F2937", padding:"2px 7px", borderRadius:10,
//   },
//   markBtn: {
//     display:"flex", alignItems:"center", gap:6,
//     background:"#6366F1", border:"none", color:"#fff",
//     fontSize:12, fontWeight:600, padding:"7px 14px", borderRadius:8,
//     cursor:"pointer", transition:"background .15s",
//     whiteSpace:"nowrap",
//   },
//   markBtnDone: {
//     background:"transparent",
//     border:"1px solid #10B981",
//     color:"#10B981",
//   },

//   /* Tabs */
//   tabBar: {
//     display:"flex", gap:0,
//     borderBottom:"1px solid #E5E7EB",
//     background:"#fff",
//     padding:"0 24px",
//     flexShrink:0,
//   },
//   tabBtn: {
//     display:"flex", alignItems:"center", gap:6,
//     background:"transparent", border:"none", cursor:"pointer",
//     fontSize:13, fontWeight:500, color:"#6B7280",
//     padding:"12px 14px",
//     borderBottom:"2px solid transparent",
//     transition:"all .15s",
//   },
//   tabBtnActive: {
//     color:"#6366F1",
//     borderBottomColor:"#6366F1",
//     fontWeight:600,
//   },
//   tabContent: { padding:"24px", flex:1 },

//   /* Info card */
//   infoCard: {
//     background:"#fff", border:"1px solid #E5E7EB",
//     borderRadius:12, padding:20,
//   },
//   infoCardHeader: {
//     display:"flex", justifyContent:"space-between", alignItems:"flex-start",
//     marginBottom:12, gap:12,
//   },
//   lessonTitle: { fontSize:18, fontWeight:600, color:"#111827", margin:0, lineHeight:1.35 },
//   lessonMeta: { display:"flex", alignItems:"center", gap:6, marginTop:6, fontSize:12, color:"#9CA3AF", flexWrap:"wrap" },
//   metaDot: { color:"#D1D5DB" },
//   infoCardBadge: {
//     width:44, height:44, borderRadius:10,
//     background:"#EEF2FF", display:"flex", alignItems:"center", justifyContent:"center",
//     flexShrink:0, color:"#6366F1",
//   },
//   infoCardDesc: { fontSize:14, color:"#6B7280", lineHeight:1.7, margin:0 },

//   /* Outcomes */
//   outcomesCard: {
//     background:"linear-gradient(135deg,#EEF2FF 0%,#F0FDF4 100%)",
//     border:"1px solid #E0E7FF",
//     borderRadius:12, padding:20,
//   },
//   outcomesTitle: {
//     display:"flex", alignItems:"center", gap:8,
//     fontSize:14, fontWeight:600, color:"#1F2937",
//     marginBottom:12,
//   },
//   outcomesGrid: {
//     display:"grid",
//     gridTemplateColumns:"repeat(auto-fill, minmax(220px, 1fr))",
//     gap:"8px 16px",
//   },
//   outcomeItem: { display:"flex", alignItems:"flex-start", gap:8, fontSize:13, color:"#374151" },

//   /* Topics */
//   topicItem: { display:"flex", alignItems:"flex-start", gap:8, fontSize:13, color:"#374151", padding:"4px 0" },
//   topicBullet: { color:"#6366F1", flexShrink:0 },

//   /* Stats row */
//   statsRow: { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 },
//   statCard: {
//     background:"#fff", border:"1px solid #E5E7EB",
//     borderRadius:12, padding:"16px 12px",
//     display:"flex", flexDirection:"column", alignItems:"center", gap:6,
//   },
//   statIcon: {
//     width:40, height:40, borderRadius:10,
//     background:"#F9FAFB",
//     display:"flex", alignItems:"center", justifyContent:"center",
//   },
//   statValue: { fontSize:22, fontWeight:700, color:"#111827" },
//   statLabel: { fontSize:11, color:"#9CA3AF" },

//   /* Empty tabs */
//   emptyTab: {
//     display:"flex", flexDirection:"column", alignItems:"center",
//     justifyContent:"center", gap:12, minHeight:180,
//     color:"#9CA3AF",
//   },
//   notesArea: {
//     width:"100%", minHeight:140,
//     border:"1px solid #E5E7EB", borderRadius:10,
//     padding:"12px 16px", fontSize:13, color:"#374151",
//     resize:"vertical", outline:"none", fontFamily:"inherit",
//     background:"#F9FAFB",
//   },
//   askBtn: {
//     background:"#6366F1", color:"#fff", border:"none",
//     borderRadius:8, padding:"8px 18px", fontSize:13, cursor:"pointer",
//   },

//   /* Type labels */
//   typeVideo:   { background:"#DBEAFE", color:"#1D4ED8", fontSize:11, padding:"2px 8px", borderRadius:20, fontWeight:500 },
//   typeProject: { background:"#DCFCE7", color:"#15803D", fontSize:11, padding:"2px 8px", borderRadius:20, fontWeight:500 },
//   typeQuiz:    { background:"#FEF9C3", color:"#A16207", fontSize:11, padding:"2px 8px", borderRadius:20, fontWeight:500 },
//   typeRead:    { background:"#F3F4F6", color:"#6B7280", fontSize:11, padding:"2px 8px", borderRadius:20, fontWeight:500 },

//   /* Sidebar */
//   sidebar: {
//     width:300, flexShrink:0,
//     background:"#fff",
//     borderLeft:"1px solid #E5E7EB",
//     display:"flex", flexDirection:"column",
//     overflow:"hidden",
//   },
//   sidebarHeader: {
//     padding:"14px 16px 12px",
//     borderBottom:"1px solid #F3F4F6",
//     flexShrink:0,
//   },
//   sidebarTitle: { fontSize:14, fontWeight:600, color:"#111827" },
//   sidebarSubtitle: { fontSize:11, color:"#9CA3AF", marginTop:2 },
//   sidebarProgressWrap: { display:"flex", alignItems:"center", gap:8, marginTop:10 },
//   sidebarProgressBar: { flex:1, height:5, background:"#F3F4F6", borderRadius:3, overflow:"hidden" },
//   sidebarProgressFill: { height:"100%", background:"#6366F1", borderRadius:3, transition:"width .4s ease" },
//   sidebarProgressPct: { fontSize:11, color:"#6366F1", fontWeight:600, minWidth:28, textAlign:"right" },
//   sidebarScroll: { flex:1, overflowY:"auto" },
//   sidebarFooter: {
//     display:"flex", alignItems:"center", gap:10,
//     padding:"12px 16px",
//     borderTop:"1px solid #F3F4F6",
//     background:"#FFFBEB",
//     flexShrink:0,
//   },

//   /* Module block */
//   moduleBlock: { borderBottom:"1px solid #F3F4F6" },
//   moduleBtn: {
//     width:"100%", display:"flex", alignItems:"center",
//     justifyContent:"space-between",
//     padding:"12px 14px",
//     background:"transparent", border:"none",
//     cursor:"pointer", textAlign:"left",
//     transition:"background .1s",
//   },
//   moduleBtnActive: { background:"#F5F3FF" },
//   moduleLeft: { display:"flex", alignItems:"flex-start", gap:10, minWidth:0, flex:1 },
//   moduleNum: {
//     width:26, height:26, borderRadius:6,
//     background:"#F3F4F6", color:"#6B7280",
//     fontSize:11, fontWeight:700,
//     display:"flex", alignItems:"center", justifyContent:"center",
//     flexShrink:0, marginTop:1,
//   },
//   moduleNumActive: { background:"#EEF2FF", color:"#6366F1" },
//   moduleNumDone:   { background:"#DCFCE7", color:"#15803D" },
//   moduleName: { fontSize:13, fontWeight:600, color:"#111827", lineHeight:1.3 },
//   moduleMeta: { fontSize:11, color:"#9CA3AF", marginTop:3, display:"flex", alignItems:"center", gap:4 },
//   moduleBar: { height:2, background:"#F3F4F6", borderRadius:2, marginTop:6, overflow:"hidden" },
//   moduleBarFill: { height:"100%", borderRadius:2, transition:"width .3s" },

//   /* Lesson list */
//   lessonList: { background:"#FAFAFA" },
//   emptyLessons: { padding:"10px 14px 10px 50px", fontSize:12, color:"#D1D5DB" },
//   lessonItem: {
//     width:"100%", display:"flex", alignItems:"center", gap:10,
//     padding:"9px 14px 9px 12px",
//     background:"transparent", border:"none",
//     cursor:"pointer", textAlign:"left",
//     transition:"background .1s",
//     borderBottom:"none",
//   },
//   lessonItemActive: { background:"#6366F1" },
//   lessonStatusWrap: { flexShrink:0 },
//   lessonPlayDot: {
//     width:16, height:16, borderRadius:"50%",
//     background:"rgba(255,255,255,0.25)",
//     display:"flex", alignItems:"center", justifyContent:"center",
//     position:"relative",
//   },
//   lessonPlayPulse: {
//     width:8, height:8, borderRadius:"50%",
//     background:"#fff",
//     animation:"pulse 1.2s ease-in-out infinite",
//   },
//   lessonContent: { flex:1, minWidth:0 },
//   lessonName: {
//     fontSize:12, fontWeight:500, color:"#374151",
//     display:"block", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
//   },
//   lessonNameActive: { color:"#fff" },
//   lessonSubMeta: {
//     display:"flex", alignItems:"center", gap:4,
//     fontSize:10, color:"#9CA3AF", marginTop:2,
//   },
//   lessonDurTag: {
//     fontSize:10, color:"#9CA3AF",
//     background:"#F3F4F6",
//     padding:"2px 7px", borderRadius:10,
//     flexShrink:0, whiteSpace:"nowrap",
//   },
//   lessonDurTagActive: { background:"rgba(255,255,255,0.2)", color:"rgba(255,255,255,0.75)" },
// };
// src/pages/student/CourseView.jsx

import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ChevronLeft, PlayCircle, Lock, CheckCircle2,
  BookOpen, FileText, Link2, ChevronDown, ChevronRight,
  Clock, Layers, User, BarChart2, X,
} from "lucide-react";
import ENDPOINT from "../lib/endpoints";


// ── helpers ──────────────────────────────────────────
const fmtDuration = (sec) => {
  if (!sec) return "";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export default function CourseView() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [course,          setCourse]          = useState(null);
  const [chapters,        setChapters]        = useState([]);
  const [activeLesson,    setActiveLesson]    = useState(null);
  const [completedIds,    setCompletedIds]    = useState(new Set());
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [tab,             setTab]             = useState("description");
  const [loading,         setLoading]         = useState(true);
  const [mobileSidebar,   setMobileSidebar]   = useState(false);
  const videoRef = useRef(null);

  const token      = localStorage.getItem("token");
  const authConfig = { headers: { Authorization: `Bearer ${token}` } };

  // ── fetch course ──────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await axios.get(ENDPOINT.GET_COURSE_DETAIL(id), authConfig);
        const data = res.data;
        setCourse(data.course);
        const chaps = data.chapters || [];
        setChapters(chaps);

        // restore completed lessons from localStorage
        const saved = JSON.parse(localStorage.getItem(`completed_${id}`) || "[]");
        setCompletedIds(new Set(saved));

        // set first lesson of first chapter as active
        if (chaps[0]?.lessons?.length > 0) {
          setActiveLesson(chaps[0].lessons[0]);
          setExpandedChapter(chaps[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // ── flat lesson list (for prev/next + unlock logic) ─
  const allLessons = chapters.flatMap((c) => c.lessons || []);
  const activeIdx  = allLessons.findIndex((l) => l.id === activeLesson?.id);

  // A lesson is unlocked if it's the first, or the previous one is completed
  const isUnlocked = (lessonId) => {
    const idx = allLessons.findIndex((l) => l.id === lessonId);
    if (idx === 0) return true;
    return completedIds.has(allLessons[idx - 1]?.id);
  };

  // ── mark complete ─────────────────────────────────
  const markComplete = () => {
    if (!activeLesson) return;
    const next = new Set(completedIds);
    next.add(activeLesson.id);
    setCompletedIds(next);
    localStorage.setItem(`completed_${id}`, JSON.stringify([...next]));
  };

  // ── video ended auto-mark ─────────────────────────
  const handleVideoEnded = () => markComplete();

  // ── next lesson ───────────────────────────────────
  const goNext = () => {
    const next = allLessons[activeIdx + 1];
    if (next && isUnlocked(next.id)) {
      setActiveLesson(next);
      // expand its chapter
      const chap = chapters.find((c) => c.lessons?.some((l) => l.id === next.id));
      if (chap) setExpandedChapter(chap.id);
    }
  };

  const goPrev = () => {
    const prev = allLessons[activeIdx - 1];
    if (prev) {
      setActiveLesson(prev);
      const chap = chapters.find((c) => c.lessons?.some((l) => l.id === prev.id));
      if (chap) setExpandedChapter(chap.id);
    }
  };

  const progress = allLessons.length
    ? Math.round((completedIds.size / allLessons.length) * 100)
    : 0;

  // ══════════════════════════════════════════════════
  //  LOADING
  // ══════════════════════════════════════════════════
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Loading course…</p>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════
  //  LESSON SIDEBAR ITEM
  // ══════════════════════════════════════════════════
  const LessonItem = ({ lesson }) => {
    const active    = activeLesson?.id === lesson.id;
    const done      = completedIds.has(lesson.id);
    const unlocked  = isUnlocked(lesson.id);

    return (
      <button
        disabled={!unlocked}
        onClick={() => {
          if (unlocked) {
            setActiveLesson(lesson);
            setMobileSidebar(false);
          }
        }}
        className={`
          w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left
          transition-all duration-150 group
          ${active
            ? "bg-violet-600 text-white"
            : unlocked
            ? "hover:bg-gray-100 text-gray-700"
            : "opacity-50 cursor-not-allowed text-gray-400"
          }
        `}
      >
        {/* status icon */}
        <span className="shrink-0">
          {done
            ? <CheckCircle2 size={16} className={active ? "text-violet-200" : "text-green-500"} />
            : unlocked
            ? <PlayCircle size={16} className={active ? "text-white" : "text-gray-400"} />
            : <Lock size={14} className="text-gray-300" />
          }
        </span>

        <div className="flex-1 min-w-0">
          <p className={`text-xs font-medium truncate ${active ? "text-white" : "text-gray-800"}`}>
            {lesson.title}
          </p>
          {lesson.duration && (
            <p className={`text-[10px] mt-0.5 ${active ? "text-violet-200" : "text-gray-400"}`}>
              {fmtDuration(lesson.duration)}
            </p>
          )}
        </div>
      </button>
    );
  };

  // ══════════════════════════════════════════════════
  //  SIDEBAR CONTENT
  // ══════════════════════════════════════════════════
  const SidebarContent = () => (
    <div className="flex flex-col h-full">

      {/* progress bar */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-medium text-gray-700">Your Progress</span>
          <span className="font-bold text-violet-600">{progress}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-violet-400 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[10px] text-gray-400 mt-1">
          {completedIds.size} / {allLessons.length} lessons completed
        </p>
      </div>

      {/* chapters list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {chapters.map((chap, ci) => (
          <div key={chap.id}>
            {/* chapter header */}
            <button
              onClick={() => setExpandedChapter(expandedChapter === chap.id ? null : chap.id)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-600 text-[10px] font-bold flex items-center justify-center shrink-0">
                  {ci + 1}
                </span>
                <span className="text-xs font-semibold text-gray-800 truncate">{chap.title}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[10px] text-gray-400">{chap.lessons?.length || 0}</span>
                {expandedChapter === chap.id
                  ? <ChevronDown size={13} className="text-gray-400" />
                  : <ChevronRight size={13} className="text-gray-400" />
                }
              </div>
            </button>

            {/* lessons */}
            {expandedChapter === chap.id && (
              <div className="ml-2 space-y-0.5 pb-1">
                {(chap.lessons || []).map((lesson) => (
                  <LessonItem key={lesson.id} lesson={lesson} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════
  //  MAIN RENDER
  // ══════════════════════════════════════════════════
  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">

      {/* ── TOP NAV ── */}
      <header className="h-13 bg-white border-b border-gray-200 px-4 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft size={17} />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="w-px h-5 bg-gray-200" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate max-w-[200px] sm:max-w-xs">
              {course?.title}
            </p>
            {course?.category && (
              <p className="text-xs text-violet-500 truncate">{course.category}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* progress chip */}
          <div className="hidden sm:flex items-center gap-2 bg-violet-50 border border-violet-200 px-3 py-1.5 rounded-full">
            <div className="w-14 h-1.5 bg-violet-100 rounded-full overflow-hidden">
              <div className="h-full bg-violet-500 rounded-full" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-xs font-semibold text-violet-600">{progress}%</span>
          </div>

          {/* mobile sidebar toggle */}
          <button
            onClick={() => setMobileSidebar(true)}
            className="lg:hidden flex items-center gap-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Layers size={14} /> Lessons
          </button>
        </div>
      </header>

      {/* ── BODY ── */}
      <div className="flex flex-1 min-h-0">

        {/* ── MAIN: video + tabs ── */}
        <main className="flex-1 overflow-y-auto min-w-0">

          {/* video player */}
          <div className="bg-black w-full aspect-video max-h-[56vh] relative flex items-center justify-center">
            {activeLesson?.video_url ? (
              <video
                ref={videoRef}
                key={activeLesson.id}
                src={activeLesson.video_url}
                controls
                onEnded={handleVideoEnded}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center gap-3">
                <PlayCircle size={52} className="text-white/20" />
                <p className="text-white/40 text-sm">No video available</p>
              </div>
            )}
          </div>

          {/* lesson title + nav + complete button */}
          <div className="px-5 py-4 border-b border-gray-200 bg-white">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <h1 className="text-base font-bold text-gray-900">{activeLesson?.title || "Select a lesson"}</h1>
                {activeLesson?.duration && (
                  <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                    <Clock size={11} /> {fmtDuration(activeLesson.duration)}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={goPrev}
                  disabled={activeIdx <= 0}
                  className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ← Prev
                </button>

                {completedIds.has(activeLesson?.id) ? (
                  <span className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg font-medium">
                    <CheckCircle2 size={13} /> Completed
                  </span>
                ) : (
                  <button
                    onClick={markComplete}
                    className="px-3 py-1.5 text-xs bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Mark Complete
                  </button>
                )}

                <button
                  onClick={goNext}
                  disabled={activeIdx >= allLessons.length - 1 || !completedIds.has(activeLesson?.id)}
                  className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>

          {/* tabs */}
          <div className="bg-white border-b border-gray-200">
            <div className="flex px-5 gap-1">
              {[
                { key: "description", label: "Description",  icon: BookOpen  },
                { key: "notes",       label: "Notes",         icon: FileText  },
                { key: "resources",   label: "Resources",     icon: Link2     },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`flex items-center gap-1.5 px-3 py-3 text-xs font-medium border-b-2 transition-colors ${
                    tab === key
                      ? "border-violet-500 text-violet-600"
                      : "border-transparent text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <Icon size={13} /> {label}
                </button>
              ))}
            </div>
          </div>

          {/* tab content */}
          <div className="p-5">

            {tab === "description" && (
              <div className="max-w-3xl space-y-5">
                {/* about lesson */}
                <div>
                  <h2 className="text-sm font-semibold text-gray-900 mb-2">About this lesson</h2>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {activeLesson?.description || "No description available for this lesson."}
                  </p>
                </div>

                {/* course info cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Chapters",  val: chapters.length,       icon: Layers,   color: "bg-violet-50 text-violet-600" },
                    { label: "Lessons",   val: allLessons.length,     icon: PlayCircle, color: "bg-blue-50 text-blue-600"   },
                    { label: "Standard",  val: `Std ${course?.standard || "—"}`, icon: BarChart2, color: "bg-emerald-50 text-emerald-600" },
                    { label: "Instructor",val: course?.teacher_name || "—", icon: User,  color: "bg-orange-50 text-orange-600" },
                  ].map(({ label, val, icon: Icon, color }) => (
                    <div key={label} className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                      <div className={`w-7 h-7 rounded-lg ${color} flex items-center justify-center mb-2`}>
                        <Icon size={14} />
                      </div>
                      <p className="text-xs text-gray-400">{label}</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">{val}</p>
                    </div>
                  ))}
                </div>

                {/* course description */}
                {course?.description && (
                  <div className="bg-violet-50 border border-violet-100 rounded-xl p-4">
                    <h3 className="text-xs font-semibold text-violet-700 mb-1.5">Course Overview</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">{course.description}</p>
                  </div>
                )}
              </div>
            )}

            {tab === "notes" && (
              <div className="max-w-2xl">
                <h2 className="text-sm font-semibold text-gray-900 mb-3">My Notes</h2>
                <textarea
                  placeholder="Write your notes for this lesson here…"
                  rows={10}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 resize-none text-gray-700"
                  onChange={(e) => {
                    localStorage.setItem(`note_${activeLesson?.id}`, e.target.value);
                  }}
                  defaultValue={activeLesson ? (localStorage.getItem(`note_${activeLesson.id}`) || "") : ""}
                />
                <p className="text-xs text-gray-400 mt-2">Notes are saved locally on your device.</p>
              </div>
            )}

            {tab === "resources" && (
              <div className="max-w-2xl">
                <h2 className="text-sm font-semibold text-gray-900 mb-3">Resources</h2>
                {activeLesson?.resources?.length > 0 ? (
                  <div className="space-y-2">
                    {activeLesson.resources.map((r, i) => (
                      <a
                        key={i}
                        href={r.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-violet-300 hover:bg-violet-50 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
                          <Link2 size={14} className="text-violet-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate group-hover:text-violet-600 transition-colors">{r.title}</p>
                          <p className="text-xs text-gray-400 truncate">{r.url}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <Link2 size={28} className="text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No resources for this lesson.</p>
                  </div>
                )}
              </div>
            )}

          </div>
        </main>

        {/* ── DESKTOP SIDEBAR ── */}
        <aside className="hidden lg:flex flex-col w-72 xl:w-80 border-l border-gray-200 bg-white shrink-0 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Course Content</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{chapters.length} chapters · {allLessons.length} lessons</p>
          </div>
          <div className="flex-1 overflow-hidden">
            <SidebarContent />
          </div>
        </aside>

      </div>

      {/* ── MOBILE SIDEBAR OVERLAY ── */}
      {mobileSidebar && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/40 z-40"
            onClick={() => setMobileSidebar(false)}
          />
          <div className="lg:hidden fixed right-0 top-0 h-full w-80 max-w-[90vw] bg-white z-50 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <p className="text-xs font-bold text-gray-800 uppercase tracking-wide">Course Content</p>
              <button onClick={() => setMobileSidebar(false)} className="text-gray-400 hover:text-gray-700">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <SidebarContent />
            </div>
          </div>
        </>
      )}

    </div>
  );
}
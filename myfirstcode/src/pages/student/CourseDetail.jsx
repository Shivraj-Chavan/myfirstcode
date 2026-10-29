import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, BookOpen, Lock, PlayCircle, CheckCircle2, Circle,
  CreditCard, Clock, ChevronDown, Star,
} from "lucide-react";
import api from "../../api/axios.js";
import { ENDPOINTS } from "../../api/endpoints.js";
import { useAuth } from "../../context/AuthContext.jsx";
import Loader from "../../components/ui/Loader.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Badge from "../../components/ui/Badge.jsx";
import { toText, toTextArray } from "../../utils/safeRender.js";

// TEMPORARY client-side unlock + progress tracking — see note in previous
// versions. Swap unlock for a real POST /courses/:id/purchase call, and
// progress for a real POST /levels/:id/progress call, once those exist.
const unlockedKey = (userId) => `mfc_unlocked_courses:${userId}`;
const getUnlocked = (userId) => {
  try { return JSON.parse(localStorage.getItem(unlockedKey(userId)) || "[]"); }
  catch { return []; }
};
const setUnlocked = (userId, ids) => localStorage.setItem(unlockedKey(userId), JSON.stringify(ids));

const progressKey = (userId, courseId) => `mfc_progress:${userId}:${courseId}`;
const getCompleted = (userId, courseId) => {
  try { return JSON.parse(localStorage.getItem(progressKey(userId, courseId)) || "[]"); }
  catch { return []; }
};
const setCompleted = (userId, courseId, ids) => localStorage.setItem(progressKey(userId, courseId), JSON.stringify(ids));

// Modules only carry a week range, not an explicit runtime — approximate
// a duration label from it so the page reads like a real platform.
// Swap for a real `durationMinutes` field on the module once it exists.
const moduleDuration = (m) => {
  if (m.durationMinutes) return `${m.durationMinutes} min`;
  return m.weekRange ? toText(m.weekRange) : "Self-paced";
};

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unlockedIds, setUnlockedIds] = useState(() => getUnlocked(user.id));
  const [paying, setPaying] = useState(false);

  const [levels, setLevels] = useState([]);
  const [levelsLoading, setLevelsLoading] = useState(false);
  const [activeLevelId, setActiveLevelId] = useState(null);
  const [activeModuleIdx, setActiveModuleIdx] = useState(0);
  const [expandedLevelId, setExpandedLevelId] = useState(null);
  const [completed, setCompletedState] = useState(() => getCompleted(user.id, id));

  const isUnlocked = unlockedIds.includes(Number(id));

  const totalModules = useMemo(() => levels.reduce((sum, l) => sum + (l.modules?.length || 0), 0), [levels]);
  const progressPct = totalModules ? Math.round((completed.length / totalModules) * 100) : 0;

  const moduleKey = (levelId, idx) => `${levelId}-${idx}`;
  const toggleComplete = (levelId, idx) => {
    const key = moduleKey(levelId, idx);
    const next = completed.includes(key) ? completed.filter((k) => k !== key) : [...completed, key];
    setCompletedState(next);
    setCompleted(user.id, id, next);
  };

  useEffect(() => {
    api.get(ENDPOINTS.course(id)).then((res) => setCourse(res.data?.course)).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!isUnlocked || !course) return;
    setLevelsLoading(true);
    // NOTE: levels have no course_id column yet, so there's no real
    // link between a course and its levels. Best-effort workaround:
    // only show levels whose language/tags/name mention this course's
    // category or title (e.g. a "Python" course only shows Python
    // levels, not Java/Web ones). Once a `course_id` column exists on
    // `levels`, replace this filter with a real `?course_id=` query.
    api.get(ENDPOINTS.levels).then((res) => {
      const all = res.data?.data || [];
      const needle = (toText(course.category) || toText(course.title) || "").toLowerCase().trim();

      const matches = needle
        ? all.filter((l) => {
            const haystack = [
              toText(l.language),
              toText(l.level_name),
              ...(Array.isArray(l.tags) ? l.tags.map(toText) : []),
            ]
              .join(" ")
              .toLowerCase();
            return haystack.includes(needle);
          })
        : [];

      // Fall back to the full catalog only if nothing matched at all,
      // so a mismatched/empty category doesn't leave the page blank.
      const data = matches.length > 0 ? matches : all;

      setLevels(data);
      if (data.length && !activeLevelId) setActiveLevelId(data[0].id);
    }).finally(() => setLevelsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUnlocked, course]);

  const simulatePayment = async () => {
    setPaying(true);
    await new Promise((r) => setTimeout(r, 900));
    const next = [...new Set([...unlockedIds, Number(id)])];
    setUnlockedIds(next);
    setUnlocked(user.id, next);
    setPaying(false);
  };

  if (loading) return <Loader label="Loading course" />;
  if (!course) return <EmptyState title="Course not found" />;

 const activeLevel = levels.find((l) => l.id === activeLevelId);
  const modules = activeLevel?.modules || [];
  const activeModule = modules[activeModuleIdx];
  const isActiveModuleDone = activeLevel && completed.includes(moduleKey(activeLevel.id, activeModuleIdx));

  const goToModule = (levelId, idx) => {
    setActiveLevelId(levelId);
    setActiveModuleIdx(idx);
    setExpandedLevelId(levelId);
  };

  // ---------------- NOT UNLOCKED: Udemy/Coursera-style landing view ----------------
  if (!isUnlocked) {
    return (
      <div className="mx-auto max-w-3xl">
        <button onClick={() => navigate("/student/courses")} className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-slate-muted hover:text-brand">
          <ArrowLeft size={15} /> Back to courses
        </button>

        <div className="card overflow-hidden">
          <div className="relative flex h-44 items-center justify-center bg-gradient-to-br from-brand to-brand-dark">
            {course.thumbnail ? (
              <img src={course.thumbnail} alt="" className="h-full w-full object-cover" />
            ) : (
              <BookOpen className="text-white/40" size={44} />
            )}
          </div>
          <div className="p-5 sm:p-6">
            <p className="font-mono text-[11px] uppercase tracking-wide text-brand">{toText(course.category)}</p>
            <h1 className="mt-1 font-display text-xl font-bold leading-snug text-ink sm:text-2xl">{course.title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-muted">{course.description}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge tone="brand">Std {course.standard}</Badge>
              <span className="flex items-center gap-1 text-xs text-amber-dark"><Star size={13} className="fill-amber text-amber" /> 4.8</span>
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-xl bg-amber-light px-4 py-3 text-amber-dark">
              <Lock size={18} className="shrink-0" />
              <p className="text-xs font-medium">Simulated unlock for now — wire to a real payment gateway once a backend purchase route exists.</p>
            </div>

            <button className="btn-primary mt-3 w-full" onClick={simulatePayment} disabled={paying}>
              <CreditCard size={16} /> {paying ? "Processing payment..." : "Pay & unlock course"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- UNLOCKED: compact player + curriculum view ----------------
  return (
    <div className="-mt-2">
      {/* Slim top bar — title, progress, back link. No big hero banner while learning. */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <button onClick={() => navigate("/student/courses")} className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-muted hover:bg-ink/5 hover:text-brand">
            <ArrowLeft size={16} />
          </button>
          <div className="min-w-0">
            <h1 className="truncate font-display text-base font-bold text-ink sm:text-lg">{course.title}</h1>
            <p className="text-xs text-slate-muted">{totalModules} lessons · {progressPct}% complete</p>
          </div>
        </div>
        <div className="h-1.5 w-32 overflow-hidden rounded-full bg-ink/10 sm:w-44">
          <div className="h-full rounded-full bg-mint transition-all" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      {levelsLoading ? (
        <Loader label="Loading levels" />
      ) : levels.length === 0 ? (
        <EmptyState icon={BookOpen} title="No levels available yet" />
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
          {/* -------- Player + details (left) -------- */}
          <div className="min-w-0 space-y-4">
            {!activeModule ? (
              <EmptyState title="No modules in this level yet" />
            ) : (
              <>
                <div className="overflow-hidden rounded-xl bg-ink shadow-card">
                  {activeModule.videoUrl ? (
                    <video key={activeModule.videoUrl} src={activeModule.videoUrl} controls className="aspect-video w-full" />
                  ) : (
                    <div className="flex aspect-video w-full items-center justify-center text-white/30">
                      <PlayCircle size={40} />
                    </div>
                  )}
                </div>

                <div className="card p-4 sm:p-5">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-muted">
                    <Badge tone="brand">Level {toText(activeLevel.level_number)}</Badge>
                    {activeLevel.difficulty && <Badge tone="amber">{toText(activeLevel.difficulty)}</Badge>}
                    <span className="flex items-center gap-1"><Clock size={12} /> {moduleDuration(activeModule)}</span>
                  </div>

                  <div className="mt-2 flex items-start justify-between gap-3">
                    <h2 className="font-display text-lg font-bold leading-snug text-ink">{toText(activeModule.title)}</h2>
                    <button
                      onClick={() => toggleComplete(activeLevel.id, activeModuleIdx)}
                      className={`btn-sm shrink-0 ${isActiveModuleDone ? "btn-secondary" : "btn-primary"}`}
                    >
                      {isActiveModuleDone ? <><CheckCircle2 size={13} /> Completed</> : "Mark complete"}
                    </button>
                  </div>

                  {toTextArray(activeModule.topics).length > 0 && (
                    <div className="mt-4">
                      <p className="label">What you'll cover</p>
                      <ul className="grid gap-1 sm:grid-cols-2">
                        {toTextArray(activeModule.topics).map((t, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-sm text-ink/80">
                            <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-mint-dark" /> {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {toTextArray(activeModule.practiceTasks).length > 0 && (
                    <div className="mt-4">
                      <p className="label">Practice tasks</p>
                      <ul className="list-inside list-disc space-y-1 text-sm text-ink/80">
                        {toTextArray(activeModule.practiceTasks).map((t, i) => <li key={i}>{t}</li>)}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <button
                    className="btn-secondary btn-sm"
                    disabled={activeModuleIdx === 0}
                    onClick={() => setActiveModuleIdx((i) => Math.max(0, i - 1))}
                  >
                    ← Previous
                  </button>
                  <button
                    className="btn-primary btn-sm"
                    disabled={activeModuleIdx === modules.length - 1}
                    onClick={() => setActiveModuleIdx((i) => Math.min(modules.length - 1, i + 1))}
                  >
                    Next lesson →
                  </button>
                </div>
              </>
            )}
          </div>

          {/* -------- Curriculum accordion (right) -------- */}
          <div className="card h-fit overflow-hidden lg:sticky lg:top-4">
            <p className="border-b border-ink/5 px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-wide text-slate-muted">
              Course content
            </p>
            <div className="max-h-[75vh] overflow-y-auto">
              {levels.map((lvl) => {
                const isOpen = expandedLevelId === lvl.id || (expandedLevelId === null && lvl.id === activeLevelId);
                const lvlModules = lvl.modules || [];
                const doneInLevel = lvlModules.filter((_, i) => completed.includes(moduleKey(lvl.id, i))).length;
                return (
                  <div key={lvl.id} className="border-b border-ink/5 last:border-0">
                    <button
                      onClick={() => setExpandedLevelId(isOpen ? null : lvl.id)}
                      className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left hover:bg-ink/[0.02]"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-ink">Level {toText(lvl.level_number)}: {toText(lvl.level_name)}</p>
                        <p className="text-xs text-slate-muted">{doneInLevel}/{lvlModules.length} · {toText(lvl.duration)} {toText(lvl.duration_unit)}</p>
                      </div>
                      <ChevronDown size={15} className={`shrink-0 text-slate-muted transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isOpen && (
                      <div className="pb-1.5">
                        {lvlModules.map((m, i) => {
                          const isCurrent = lvl.id === activeLevelId && i === activeModuleIdx;
                          const isDone = completed.includes(moduleKey(lvl.id, i));
                          return (
                            <button
                              key={i}
                              onClick={() => goToModule(lvl.id, i)}
                              className={`flex w-full items-center gap-2.5 px-4 py-2 text-left text-xs leading-snug ${
                                isCurrent ? "bg-brand-light" : "hover:bg-ink/[0.02]"
                              }`}
                            >
                              {isDone ? (
                                <CheckCircle2 size={14} className="shrink-0 text-mint-dark" />
                              ) : (
                                <Circle size={14} className="shrink-0 text-slate-faint" />
                              )}
                              <span className={`line-clamp-1 flex-1 ${isCurrent ? "font-semibold text-brand" : "text-ink/80"}`}>{toText(m.title)}</span>
                              <span className="shrink-0 font-mono text-[10px] text-slate-muted">{moduleDuration(m)}</span>
                            </button>
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
      )}
    </div>
  );
}
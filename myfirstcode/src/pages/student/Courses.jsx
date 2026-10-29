import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Lock } from "lucide-react";
import api from "../../api/axios.js";
import { ENDPOINTS } from "../../api/endpoints.js";
import { useAuth } from "../../context/AuthContext.jsx";
import PageHeader from "../../components/shared/PageHeader.jsx";
import Loader from "../../components/ui/Loader.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import { toText } from "../../utils/safeRender.js";

// TEMPORARY client-side unlock tracking — there is no payment or
// course-purchase endpoint on the backend yet. This simulates "paid"
// state locally per-browser so the level-viewing UI can be built and
// tested now. Swap this for a real POST /courses/:id/purchase call
// (and check its result instead of localStorage) once that route exists.
const unlockedKey = (userId) => `mfc_unlocked_courses:${userId}`;
const getUnlocked = (userId) => {
  try { return JSON.parse(localStorage.getItem(unlockedKey(userId)) || "[]"); }
  catch { return []; }
};
const setUnlocked = (userId, ids) => localStorage.setItem(unlockedKey(userId), JSON.stringify(ids));

export default function StudentCourses() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(ENDPOINTS.coursesByStandard(user.standard))
      .then((res) => setRows(res.data?.courses || []))
      .finally(() => setLoading(false));
  }, [user.standard]);

  if (loading) return <Loader label="Loading courses" />;

  return (
    <div>
      <PageHeader eyebrow="student/courses" title="Courses" subtitle={`Video courses published for Std ${user.standard}.`} />

      {rows.length === 0 ? (
        <EmptyState icon={BookOpen} title="No courses published for your standard yet" />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((c) => (
            <button
              key={c.id}
              onClick={() => navigate(`/student/courses/${c.id}`)}
              className="card overflow-hidden text-left transition-all hover:-translate-y-0.5 hover:shadow-pop"
            >
              <div className="relative flex h-32 items-center justify-center bg-gradient-to-br from-brand to-brand-dark">
                {c.thumbnail ? (
                  <img src={c.thumbnail} alt="" className="h-full w-full object-cover" />
                ) : (
                  <BookOpen className="text-white/40" size={36} />
                )}
                <span className="absolute right-2.5 top-2.5 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-brand">
                  <Lock size={13} />
                </span>
              </div>
              <div className="p-4">
                <p className="font-mono text-[11px] uppercase tracking-wide text-brand">{toText(c.category)}</p>
                <h3 className="mt-1 font-display font-bold text-ink">{c.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-slate-muted">{c.description}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, BookOpen, Video } from "lucide-react";
import api from "../../api/axios.js";
import { ENDPOINTS } from "../../api/endpoints.js";
import PageHeader from "../../components/shared/PageHeader.jsx";
import Loader from "../../components/ui/Loader.jsx";
import DataTable from "../../components/ui/DataTable.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Modal from "../../components/ui/Modal.jsx";
import LevelForm, { EMPTY_LEVEL } from "../../components/shared/LevelForm.jsx";

const csvToArray = (str) => (str || "").split(",").map((t) => t.trim()).filter(Boolean);

const toPayload = (form) => ({
  levelNumber: form.levelNumber,
  levelName: form.levelName,
  objective: form.objective,
  description: form.description,
  duration: form.duration,
  durationUnit: form.durationUnit,
  price: form.price,
  currency: form.currency,
  language: form.language,
  difficulty: form.difficulty,
  prerequisites: form.prerequisites,
  maxStudents: form.maxStudents,
  isFeatured: form.isFeatured,
  isPublished: form.isPublished,
  certificate: form.certificate,
  tags: csvToArray(form.tags),
  thumbnail: form.thumbnailUrl ? [form.thumbnailUrl] : [],
  videos: form.videoUrl ? [form.videoUrl] : [],
  modules: form.modules.map((m) => ({
    title: m.title,
    weekRange: m.weekRange,
    topics: csvToArray(m.topics),
    practiceTasks: csvToArray(m.practiceTasks),
    videoUrl: m.videoUrl,
  })),
  // WORKAROUND: `levels` table has no column for these extra curriculum
  // sections (Projects/Assessment/Outcomes/Why Important/Support), so
  // they're packed as one JSON object into `images` (unused otherwise
  // by this form). Swap this for a real `extras` JSON column when one
  // exists on the backend — search "images: [" in getLevels/getLevelById
  // in levelController.js, that's the safeParse() call to update too.
  images: [
    JSON.stringify({
      projects: form.projects.map((p) => ({ name: p.name, points: csvToArray(p.points) })),
      assessmentSystem: csvToArray(form.assessmentSystem),
      learningOutcomes: csvToArray(form.learningOutcomes),
      whyImportant: csvToArray(form.whyImportant),
      supportGuidance: csvToArray(form.supportGuidance),
    }),
  ],
});

const fromLevel = (l) => {
  let extras = {};
  try {
    extras = JSON.parse((l.images || [])[0] || "{}");
  } catch {
    extras = {};
  }
  return {
    ...EMPTY_LEVEL,
    levelNumber: l.level_number ?? "",
    levelName: l.level_name ?? "",
    objective: l.objective ?? "",
    description: l.description ?? "",
    duration: l.duration ?? "",
    durationUnit: l.duration_unit || "months",
    price: l.price ?? "",
    currency: l.currency || "INR",
    language: l.language || "English",
    difficulty: l.difficulty || "Beginner",
    prerequisites: l.prerequisites ?? "",
    maxStudents: l.max_students ?? "",
    isFeatured: !!l.is_featured,
    isPublished: !!l.is_published,
    certificate: !!l.certificate,
    tags: (l.tags || []).join(", "),
    thumbnailUrl: (l.thumbnail || [])[0] || "",
    videoUrl: (l.videos || [])[0] || "",
    modules: (l.modules || []).map((m) => ({
      title: m.title || "",
      weekRange: m.weekRange || "",
      topics: (m.topics || []).join(", "),
      practiceTasks: (m.practiceTasks || []).join(", "),
      videoUrl: m.videoUrl || "",
    })),
    projects: (extras.projects || []).map((p) => ({ name: p.name || "", points: (p.points || []).join(", ") })),
    assessmentSystem: (extras.assessmentSystem || []).join(", "),
    learningOutcomes: (extras.learningOutcomes || []).join(", "),
    whyImportant: (extras.whyImportant || []).join(", "),
    supportGuidance: (extras.supportGuidance || []).join(", "),
  };
};

export default function TeacherLevels() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_LEVEL);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    api.get(ENDPOINTS.levels).then((res) => setRows(res.data?.data || [])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY_LEVEL); setError(""); setModalOpen(true); };
  const openEdit = (l) => { setEditing(l); setForm(fromLevel(l)); setError(""); setModalOpen(true); };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editing) await api.put(ENDPOINTS.level(editing.id), toPayload(form));
      else await api.post(ENDPOINTS.levels, toPayload(form));
      setModalOpen(false);
      load();
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't save level.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (l) => {
    if (!confirm(`Delete "${l.level_name}"?`)) return;
    await api.delete(ENDPOINTS.level(l.id));
    load();
  };

  if (loading) return <Loader label="Loading levels" />;

  return (
    <div>
      <PageHeader
        eyebrow="teacher/levels"
        title="Course Levels"
        subtitle="Build level-by-level curriculum with modules and recorded videos."
        action={<button className="btn-primary" onClick={openCreate}><Plus size={16} /> New level</button>}
      />

      <DataTable
        emptyTitle="No levels created yet"
        rows={rows}
        columns={[
          { key: "level_number", header: "#", render: (r) => <Badge tone="brand">Level {r.level_number}</Badge> },
          { key: "level_name", header: "Name" },
          { key: "difficulty", header: "Difficulty" },
          { key: "modules", header: "Modules", render: (r) => (r.modules || []).length },
          { key: "is_published", header: "Status", render: (r) => <Badge tone={r.is_published ? "mint" : "amber"}>{r.is_published ? "Published" : "Draft"}</Badge> },
          {
            key: "actions",
            header: "",
            render: (r) => (
              <div className="flex items-center gap-1.5">
                <button className="btn-ghost btn-sm" onClick={() => openEdit(r)}><Pencil size={13} /></button>
                <button className="btn-ghost btn-sm text-coral hover:bg-coral-light" onClick={() => remove(r)}><Trash2 size={13} /></button>
              </div>
            ),
          },
        ]}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit level" : "New level"} width="max-w-2xl">
        <LevelForm form={form} setForm={setForm} onSubmit={save} saving={saving} error={error} />
      </Modal>
    </div>
  );
}
import { Plus, X } from "lucide-react";

const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];
const DURATION_UNITS = ["weeks", "months"];

export const EMPTY_LEVEL = {
  levelNumber: "",
  levelName: "",
  objective: "",
  description: "",
  duration: "",
  durationUnit: "months",
  price: "",
  currency: "INR",
  language: "English",
  difficulty: "Beginner",
  prerequisites: "",
  maxStudents: "",
  isFeatured: false,
  isPublished: false,
  certificate: false,
  tags: "",
  thumbnailUrl: "",
  videoUrl: "",
  modules: [],
  // Matches the extra sections in the curriculum docs (Projects,
  // Assessment System, Learning Outcomes, Why Important, Support).
  // No dedicated backend column exists for these yet — they're packed
  // as one JSON object into the `images` column (unused otherwise by
  // this form) until a proper `extras` column is added.
  projects: [],
  assessmentSystem: "",
  learningOutcomes: "",
  whyImportant: "",
  supportGuidance: "",
};

export const EMPTY_MODULE = () => ({ title: "", weekRange: "", topics: "", practiceTasks: "", videoUrl: "" });
export const EMPTY_PROJECT = () => ({ name: "", points: "" });

export default function LevelForm({ form, setForm, onSubmit, saving, error }) {
  const update = (k) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: val }));
  };

  const updateModule = (i, k) => (e) => {
    const modules = [...form.modules];
    modules[i] = { ...modules[i], [k]: e.target.value };
    setForm((f) => ({ ...f, modules }));
  };

 const addModule = () => setForm((f) => ({ ...f, modules: [...f.modules, EMPTY_MODULE()] }));
  const removeModule = (i) => setForm((f) => ({ ...f, modules: f.modules.filter((_, idx) => idx !== i) }));

  const updateProject = (i, k) => (e) => {
    const projects = [...form.projects];
    projects[i] = { ...projects[i], [k]: e.target.value };
    setForm((f) => ({ ...f, projects }));
  };
  const addProject = () => setForm((f) => ({ ...f, projects: [...f.projects, EMPTY_PROJECT()] }));
  const removeProject = (i) => setForm((f) => ({ ...f, projects: f.projects.filter((_, idx) => idx !== i) }));

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Level number</label>
          <input required type="number" className="input" value={form.levelNumber} onChange={update("levelNumber")} placeholder="1" />
        </div>
        <div>
          <label className="label">Level name</label>
          <input required className="input" value={form.levelName} onChange={update("levelName")} placeholder="Beginner Programming (Python + Web Basics)" />
        </div>
      </div>

      <div>
        <label className="label">Objective (shown to parents)</label>
        <textarea className="input min-h-16" value={form.objective} onChange={update("objective")} />
      </div>

      <div>
        <label className="label">Description</label>
        <textarea className="input min-h-16" value={form.description} onChange={update("description")} />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="label">Duration</label>
          <input type="number" className="input" value={form.duration} onChange={update("duration")} placeholder="6" />
        </div>
        <div>
          <label className="label">Unit</label>
          <select className="input" value={form.durationUnit} onChange={update("durationUnit")}>
            {DURATION_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Difficulty</label>
          <select className="input" value={form.difficulty} onChange={update("difficulty")}>
            {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="label">Price</label>
          <input type="number" className="input" value={form.price} onChange={update("price")} />
        </div>
        <div>
          <label className="label">Currency</label>
          <input className="input" value={form.currency} onChange={update("currency")} />
        </div>
        <div>
          <label className="label">Max students</label>
          <input type="number" className="input" value={form.maxStudents} onChange={update("maxStudents")} />
        </div>
      </div>

      <div>
        <label className="label">Prerequisites</label>
        <input className="input" value={form.prerequisites} onChange={update("prerequisites")} placeholder="Completion of Level 1 or basic coding knowledge" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Thumbnail image URL</label>
          <input className="input" value={form.thumbnailUrl} onChange={update("thumbnailUrl")} />
        </div>
        <div>
          <label className="label">Intro recorded video URL</label>
          <input className="input" value={form.videoUrl} onChange={update("videoUrl")} placeholder="https://..." />
        </div>
      </div>

      <div>
        <label className="label">Tags (comma separated)</label>
        <input className="input" value={form.tags} onChange={update("tags")} placeholder="python, web basics" />
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm text-ink"><input type="checkbox" checked={form.isFeatured} onChange={update("isFeatured")} /> Featured</label>
        <label className="flex items-center gap-2 text-sm text-ink"><input type="checkbox" checked={form.isPublished} onChange={update("isPublished")} /> Published</label>
        <label className="flex items-center gap-2 text-sm text-ink"><input type="checkbox" checked={form.certificate} onChange={update("certificate")} /> Awards certificate</label>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="label mb-0">Modules</label>
          <button type="button" onClick={addModule} className="btn-secondary btn-sm"><Plus size={13} /> Add module</button>
        </div>
        <div className="space-y-4">
          {form.modules.map((m, i) => (
            <div key={i} className="rounded-xl border border-ink/10 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-xs text-slate-muted">Module {i + 1}</span>
                <button type="button" onClick={() => removeModule(i)} className="text-coral hover:text-coral-dark"><X size={14} /></button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input required placeholder="Module title" className="input" value={m.title} onChange={updateModule(i, "title")} />
                <input placeholder="Week range (e.g. Week 1–2)" className="input" value={m.weekRange} onChange={updateModule(i, "weekRange")} />
              </div>
              <textarea placeholder="Topics covered (comma separated)" className="input mt-2 min-h-16" value={m.topics} onChange={updateModule(i, "topics")} />
              <textarea placeholder="Practice tasks / activities (comma separated)" className="input mt-2 min-h-16" value={m.practiceTasks} onChange={updateModule(i, "practiceTasks")} />
              <input placeholder="Recorded video URL for this module" className="input mt-2" value={m.videoUrl} onChange={updateModule(i, "videoUrl")} />
            </div>
          ))}
        </div>
      </div>

    <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="label mb-0">Projects (hands-on)</label>
          <button type="button" onClick={addProject} className="btn-secondary btn-sm"><Plus size={13} /> Add project</button>
        </div>
        <div className="space-y-3">
          {form.projects.map((p, i) => (
            <div key={i} className="rounded-xl border border-ink/10 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-xs text-slate-muted">Project {i + 1}</span>
                <button type="button" onClick={() => removeProject(i)} className="text-coral hover:text-coral-dark"><X size={14} /></button>
              </div>
              <input placeholder="Project name (e.g. Notes Mobile App)" className="input" value={p.name} onChange={updateProject(i, "name")} />
              <textarea placeholder="Features / points (comma separated)" className="input mt-2 min-h-16" value={p.points} onChange={updateProject(i, "points")} />
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="label">Assessment system (comma separated)</label>
        <textarea className="input min-h-16" value={form.assessmentSystem} onChange={update("assessmentSystem")} placeholder="Weekly assignments, Monthly coding tests, Final project submission" />
      </div>

      <div>
        <label className="label">Learning outcomes (comma separated)</label>
        <textarea className="input min-h-16" value={form.learningOutcomes} onChange={update("learningOutcomes")} placeholder="Build real-world applications, Work with databases and APIs" />
      </div>

      <div>
        <label className="label">Why this level is important (comma separated)</label>
        <textarea className="input min-h-16" value={form.whyImportant} onChange={update("whyImportant")} placeholder="Converts student into application developer, Builds real-world experience" />
      </div>

      <div>
        <label className="label">Support &amp; guidance (comma separated)</label>
        <textarea className="input min-h-16" value={form.supportGuidance} onChange={update("supportGuidance")} placeholder="Regular progress updates, Project mentoring, Doubt-solving sessions" />
      </div>

      {error && <p className="rounded-lg bg-coral-light px-3.5 py-2.5 text-xs font-medium text-coral-dark">{error}</p>}

      <button className="btn-primary w-full" disabled={saving}>{saving ? "Saving..." : "Save level"}</button>
    </form>
  );
}
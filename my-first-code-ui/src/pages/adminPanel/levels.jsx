"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  BookOpen, Hash, List, Layers, Video,
  Image as ImageIcon, Plus, Trash2, ChevronDown,
  ChevronRight, Save, Eye, X, GripVertical,
  CheckCircle2, Circle, AlertCircle, Pencil, Target,
  Award, Users, Clock, DollarSign, ArrowLeft,
} from "lucide-react";
import ENDPOINT from "../../lib/endpoints";
import axios from "axios";

// ─── helpers ────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 8);

const parseJsonField = (field) => {
  try {
    if (!field) return [];
    if (typeof field === "string") return JSON.parse(field);
    if (Array.isArray(field)) return field;
    return field;
  } catch {
    return [];
  }
};

const TABS = [
  { id: "basic",    label: "Basic Info",  icon: BookOpen },
  { id: "syllabus", label: "Syllabus",    icon: List },
  { id: "media",    label: "Media",       icon: ImageIcon },
  { id: "settings", label: "Settings",   icon: Target },
];

const DIFF_COLOR = {
  Beginner:     "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  Intermediate: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  Advanced:     "bg-red-50 text-red-600 ring-1 ring-red-200",
};

const inputCls =
  "w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition";
const labelCls = "block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1";

// ─── Field wrapper ───────────────────────────────────────────────
function Field({ label, children, required }) {
  return (
    <div>
      <label className={labelCls}>{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>
      {children}
    </div>
  );
}

// ─── Module row ─────────────────────────────────────────────────
function ModuleRow({ module, index, onChange, onDelete, onAddTopic }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-slate-100 rounded-xl overflow-hidden bg-white">
      <div className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-50 border-b border-slate-100">
        <GripVertical className="w-3.5 h-3.5 text-slate-300 shrink-0" />
        <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest shrink-0 w-16">Module {index + 1}</span>
        <input value={module.name} onChange={e => onChange(module.id, "name", e.target.value)}
          placeholder="Module name…"
          className="flex-1 bg-transparent text-sm font-semibold text-slate-700 placeholder-slate-300 focus:outline-none" />
        <button onClick={() => setOpen(o => !o)} className="text-slate-400 hover:text-slate-600 p-0.5">
          {open ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>
        <button onClick={() => onDelete(module.id)} className="text-slate-300 hover:text-red-400 p-0.5">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      {open && (
        <div className="px-3.5 py-3 space-y-2">
          {module.topics.map((t, ti) => (
            <div key={t.id} className="flex items-center gap-2 group">
              <span className="text-[10px] text-slate-400 w-5 text-right shrink-0">{ti + 1}.</span>
              <input value={t.name} onChange={e => onChange(module.id, "topic", e.target.value, t.id)}
                placeholder={`Topic ${ti + 1}…`}
                className="flex-1 bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5 text-xs text-slate-700 placeholder-slate-300 focus:outline-none focus:border-indigo-300 focus:bg-white transition" />
              <button onClick={() => onChange(module.id, "deleteTopic", null, t.id)}
                className="text-slate-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition p-0.5">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <button onClick={() => onAddTopic(module.id)}
            className="flex items-center gap-1.5 text-xs text-indigo-500 hover:text-indigo-700 font-semibold mt-1 transition">
            <Plus className="w-3 h-3" /> Add topic
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Drop zone ──────────────────────────────────────────────────
function DropZone({ label, accept, multiple, icon: Icon, hint, files, onChange }) {
  const ref = useRef();
  const handleDrop = (e) => { e.preventDefault(); const d = Array.from(e.dataTransfer.files); onChange(multiple ? [...files, ...d] : [d[0]]); };
  const handleChange = (e) => { const p = Array.from(e.target.files); onChange(multiple ? [...files, ...p] : [p[0]]); };
  const remove = (i) => onChange(files.filter((_, idx) => idx !== i));
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div onDragOver={e => e.preventDefault()} onDrop={handleDrop} onClick={() => ref.current.click()}
        className="border-2 border-dashed border-slate-200 hover:border-indigo-300 rounded-xl p-5 text-center cursor-pointer transition group bg-slate-50 hover:bg-indigo-50/30">
        <input ref={ref} type="file" accept={accept} multiple={multiple} className="hidden" onChange={handleChange} />
        <Icon className="w-6 h-6 text-slate-300 group-hover:text-indigo-400 mx-auto mb-1.5 transition" />
        <p className="text-xs font-semibold text-slate-500 group-hover:text-indigo-600 transition">Drop files or <span className="text-indigo-500">browse</span></p>
        {hint && <p className="text-[10px] text-slate-400 mt-0.5">{hint}</p>}
      </div>
      {files.length > 0 && (
        <div className="mt-2 space-y-1.5">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-2 bg-white border border-slate-100 rounded-lg px-3 py-2">
              {f.type?.startsWith("video") ? <Video className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> : <ImageIcon className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
              <span className="text-xs text-slate-600 truncate flex-1">{f.name}</span>
              <span className="text-[10px] text-slate-400 shrink-0">{(f.size / 1024).toFixed(0)} KB</span>
              <button onClick={(e) => { e.stopPropagation(); remove(i); }} className="text-slate-300 hover:text-red-400 transition"><X className="w-3 h-3" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── blank form state ────────────────────────────────────────────
const blankForm = () => ({
  id: uid(),
  levelNumber: "", levelName: "", objective: "", description: "",
  duration: "", durationUnit: "weeks", price: "", currency: "INR",
  language: "English", difficulty: "Beginner",
  modules: [{ id: uid(), name: "", topics: [{ id: uid(), name: "" }] }],
  images: [], videos: [], thumbnail: [],
  prerequisites: "", maxStudents: "", isFeatured: false,
  isPublished: false, certificate: false, tags: [], tagInput: "",
});

// ─── Level Form (shared for Add & Edit) ─────────────────────────
function LevelForm({ initial, onSave, onCancel, mode }) {
  const [activeTab, setActiveTab] = useState("basic");
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState(initial);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleModuleChange = (mId, field, value, tId) => {
    setForm(f => ({
      ...f,
      modules: f.modules.map(m => {
        if (m.id !== mId) return m;
        if (field === "name") return { ...m, name: value };
        if (field === "topic") return { ...m, topics: m.topics.map(t => t.id === tId ? { ...t, name: value } : t) };
        if (field === "deleteTopic") return { ...m, topics: m.topics.filter(t => t.id !== tId) };
        return m;
      })
    }));
  };
  const addModule = () => setForm(f => ({ ...f, modules: [...f.modules, { id: uid(), name: "", topics: [{ id: uid(), name: "" }] }] }));
  const deleteModule = (id) => setForm(f => ({ ...f, modules: f.modules.filter(m => m.id !== id) }));
  const addTopic = (mId) => setForm(f => ({ ...f, modules: f.modules.map(m => m.id === mId ? { ...m, topics: [...m.topics, { id: uid(), name: "" }] } : m) }));

  const addTag = (e) => {
    if ((e.key === "Enter" || e.key === ",") && form.tagInput.trim()) {
      e.preventDefault();
      set("tags", [...new Set([...form.tags, form.tagInput.trim()])]);
      set("tagInput", "");
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => { setSaved(false); onSave(form); }, 600);
  };

  const tabStatus = {
    basic: form.levelNumber && form.levelName && form.objective ? "done" : form.levelNumber || form.levelName ? "partial" : "empty",
    syllabus: form.modules.some(m => m.name) ? "done" : "empty",
    media: form.images.length || form.thumbnail.length ? "done" : "empty",
    settings: "empty",
  };

  const StatusDot = ({ s }) =>
    s === "done" ? <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500 shrink-0" />
    : s === "partial" ? <AlertCircle className="w-2.5 h-2.5 text-amber-400 shrink-0" />
    : <Circle className="w-2.5 h-2.5 text-slate-200 shrink-0" />;

  const curIdx = TABS.findIndex(t => t.id === activeTab);

  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {/* Form header */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onCancel} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition">
            <ArrowLeft className="w-4 h-4 text-slate-600" />
          </button>
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 leading-tight">
              {mode === "edit" ? "Edit Level" : "Create New Level"}
            </h1>
            <p className="text-[11px] text-slate-400 mt-0.5">Fill in all sections to {mode === "edit" ? "update" : "publish"} this level</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onCancel} className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition">
            <X className="w-3.5 h-3.5" /> Cancel
          </button>
          <button onClick={handleSave}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white rounded-xl transition shadow-sm ${saved ? "bg-emerald-500" : "bg-indigo-600 hover:bg-indigo-700"}`}>
            {saved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            {saved ? "Saved!" : mode === "edit" ? "Update Level" : "Save Level"}
          </button>
        </div>
      </div>

      {/* Tabs card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-100 overflow-x-auto scrollbar-none">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors shrink-0 ${
                activeTab === id ? "border-indigo-600 text-indigo-600 bg-indigo-50/40" : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}>
              <Icon className="w-3.5 h-3.5" />{label}<StatusDot s={tabStatus[id]} />
            </button>
          ))}
        </div>

        {/* Basic Info */}
        {activeTab === "basic" && (
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Level Number" required>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
                  <input value={form.levelNumber} onChange={e => set("levelNumber", e.target.value)} placeholder="e.g. 1" className={inputCls + " pl-8"} />
                </div>
              </Field>
              <Field label="Level Name" required>
                <input value={form.levelName} onChange={e => set("levelName", e.target.value)} placeholder="e.g. Foundation" className={inputCls} />
              </Field>
            </div>
            <Field label="Program Objective" required>
              <textarea value={form.objective} onChange={e => set("objective", e.target.value)}
                placeholder="What will students achieve after completing this level?" rows={3} className={inputCls + " resize-none"} />
            </Field>
            <Field label="Detailed Description">
              <textarea value={form.description} onChange={e => set("description", e.target.value)}
                placeholder="Full description of this level…" rows={4} className={inputCls + " resize-none"} />
            </Field>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Duration">
                <input value={form.duration} onChange={e => set("duration", e.target.value)} placeholder="e.g. 8" type="number" min="1" className={inputCls} />
              </Field>
              <Field label="Unit">
                <div className="relative">
                  <select value={form.durationUnit} onChange={e => set("durationUnit", e.target.value)} className={inputCls + " appearance-none pr-7"}>
                    {["days","weeks","months"].map(u => <option key={u}>{u}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                </div>
              </Field>
              <Field label="Difficulty">
                <div className="relative">
                  <select value={form.difficulty} onChange={e => set("difficulty", e.target.value)} className={inputCls + " appearance-none pr-7"}>
                    {["Beginner","Intermediate","Advanced"].map(d => <option key={d}>{d}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                </div>
              </Field>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Price">
                <input value={form.price} onChange={e => set("price", e.target.value)} placeholder="0.00" type="number" min="0" className={inputCls} />
              </Field>
              <Field label="Currency">
                <div className="relative">
                  <select value={form.currency} onChange={e => set("currency", e.target.value)} className={inputCls + " appearance-none pr-7"}>
                    {["INR","USD","EUR","GBP"].map(c => <option key={c}>{c}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                </div>
              </Field>
              <Field label="Language">
                <div className="relative">
                  <select value={form.language} onChange={e => set("language", e.target.value)} className={inputCls + " appearance-none pr-7"}>
                    {["English","Hindi","Marathi","Gujarati"].map(l => <option key={l}>{l}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                </div>
              </Field>
            </div>
          </div>
        )}

        {/* Syllabus */}
        {activeTab === "syllabus" && (
          <div className="p-5 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <div>
                <p className="text-xs font-semibold text-slate-700">Modules & Topics</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Organise the curriculum into modules. Add topics within each module.</p>
              </div>
              <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded-lg">{form.modules.length} module{form.modules.length !== 1 ? "s" : ""}</span>
            </div>
            {form.modules.map((m, i) => (
              <ModuleRow key={m.id} module={m} index={i} onChange={handleModuleChange} onDelete={deleteModule} onAddTopic={addTopic} />
            ))}
            <button onClick={addModule}
              className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 hover:border-indigo-300 text-slate-400 hover:text-indigo-500 text-xs font-semibold rounded-xl transition hover:bg-indigo-50/30">
              <Plus className="w-3.5 h-3.5" /> Add Module
            </button>
                     </div>
        )}

        {/* Media */}
        {activeTab === "media" && (
          <div className="p-5 space-y-5">
            <DropZone label="Thumbnail Image" accept="image/*" multiple={false} icon={ImageIcon} hint="PNG, JPG · Max 2 MB · 1280×720px" files={form.thumbnail} onChange={v => set("thumbnail", v)} />
            <DropZone label="Level Images" accept="image/*" multiple icon={ImageIcon} hint="PNG, JPG, WEBP · Up to 10 images" files={form.images} onChange={v => set("images", v)} />
            <DropZone label="Intro / Promo Video" accept="video/*" multiple icon={Video} hint="MP4, MOV · Max 500 MB" files={form.videos} onChange={v => set("videos", v)} />
          </div>
        )}

        {/* Settings */}
        {activeTab === "settings" && (
          <div className="p-5 space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Prerequisites">
                <input value={form.prerequisites} onChange={e => set("prerequisites", e.target.value)} placeholder="e.g. Level 1 completion" className={inputCls} />
              </Field>
              <Field label="Max Students">
                <input value={form.maxStudents} onChange={e => set("maxStudents", e.target.value)} type="number" min="1" placeholder="Unlimited" className={inputCls} />
              </Field>
            </div>
            <Field label="Tags">
              <div className="space-y-2">
                <input value={form.tagInput} onChange={e => set("tagInput", e.target.value)} onKeyDown={addTag} placeholder="Type a tag and press Enter…" className={inputCls} />
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {form.tags.map(t => (
                      <span key={t} className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-[11px] font-semibold px-2.5 py-1 rounded-lg">
                        {t}<button onClick={() => set("tags", form.tags.filter(x => x !== t))}><X className="w-2.5 h-2.5" /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Field>
            <div className="space-y-2.5">
              {[
                { label: "Featured Level", sub: "Highlight on homepage and listings", key: "isFeatured" },
                { label: "Publish Level", sub: "Visible and purchasable by students", key: "isPublished" },
                { label: "Issue Certificate", sub: "Students receive a certificate on completion", key: "certificate" },
              ].map(({ label, sub, key }) => (
                <div key={key} className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                  <div>
                    <p className="text-xs font-semibold text-slate-700">{label}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>
                  </div>
                  <button onClick={() => set(key, !form[key])}
                    className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${form[key] ? "bg-indigo-500" : "bg-slate-200"}`}>
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${form[key] ? "translate-x-4" : "translate-x-0"}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer nav */}
        <div className="px-5 py-3 border-t border-slate-50 bg-slate-50/50 flex items-center justify-between">
          <button disabled={curIdx === 0} onClick={() => setActiveTab(TABS[curIdx - 1].id)}
            className="text-xs font-semibold text-slate-500 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition">← Previous</button>
          <div className="flex gap-1">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`h-1.5 rounded-full transition-all ${activeTab === t.id ? "bg-indigo-600 w-4" : "bg-slate-200 w-1.5"}`} />
            ))}
          </div>
          {curIdx < TABS.length - 1 ? (
            <button onClick={() => setActiveTab(TABS[curIdx + 1].id)}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition">Next →</button>
          ) : (
            <button onClick={handleSave} className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 transition">Save & Finish ✓</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── VIEW MODAL ─────────────────────────────────────────────────
function ViewModal({ level, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Level {level.levelNumber} — {level.levelName}</p>
              <p className="text-[10px] text-slate-400">Level details</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center transition">
            <X className="w-3.5 h-3.5 text-slate-600" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${DIFF_COLOR[level.difficulty] || "bg-slate-100 text-slate-600"}`}>{level.difficulty}</span>
            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full ${level.isPublished ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : "bg-slate-100 text-slate-500"}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${level.isPublished ? "bg-emerald-500" : "bg-slate-400"}`} />{level.isPublished ? "Published" : "Draft"}
            </span>
            {level.isFeatured && <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-200">★ Featured</span>}
            {level.certificate && <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-200">🎓 Certificate</span>}
          </div>
          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: DollarSign, label: "Price", val: `${level.currency} ${level.price || "Free"}`, color: "text-emerald-600" },
              { icon: Clock, label: "Duration", val: `${level.duration || "—"} ${level.durationUnit}`, color: "text-blue-600" },
              { icon: Users, label: "Max Students", val: level.maxStudents || "Unlimited", color: "text-indigo-600" },
            ].map(({ icon: Icon, label, val, color }) => (
              <div key={label} className="bg-slate-50 rounded-xl px-3 py-2.5 text-center">
                <Icon className={`w-4 h-4 mx-auto mb-1 ${color}`} />
                <p className="text-[10px] text-slate-400">{label}</p>
                <p className="text-xs font-bold text-slate-700 mt-0.5">{val}</p>
              </div>
            ))}
          </div>
          {level.objective && (
            <div>
              <p className={labelCls}>Objective</p>
              <p className="text-xs text-slate-600 leading-relaxed">{level.objective}</p>
            </div>
          )}
          {level.modules?.length > 0 && (
            <div>
              <p className={labelCls}>Modules & Topics</p>
              <div className="space-y-2">
                {level.modules.map((m, i) => (
                  <div key={m.id} className="bg-slate-50 rounded-xl px-3.5 py-2.5">
                    <p className="text-xs font-semibold text-slate-700">{i + 1}. {m.name || "(unnamed)"}</p>
                    {m.topics?.length > 0 && (
                      <ul className="mt-1.5 space-y-0.5 pl-3">
                        {m.topics.map((t, ti) => (
                          <li key={t.id} className="text-[11px] text-slate-500">· {t.name || `Topic ${ti + 1}`}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {level.prerequisites && (
            <div><p className={labelCls}>Prerequisites</p><p className="text-xs text-slate-600">{level.prerequisites}</p></div>
          )}
          {level.tags?.length > 0 && (
            <div>
              <p className={labelCls}>Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {level.tags.map(t => <span key={t} className="text-[10px] bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg font-semibold">{t}</span>)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ──────────────────────────────────────────────────
export default function Levels() {
  const [levels, setLevels] = useState([]);
  const [view, setView] = useState("table"); 
  const [editTarget, setEditTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);

  const fetchLevels = async () => {
    try {
      const res = await axios.get(ENDPOINT.GET_LEVELS);
  
      const parsedLevels = (res.data.data || []).map(item => ({
        id: item.id,
  
        levelNumber: item.level_number,
        levelName: item.level_name,
  
        objective: item.objective,
        description: item.description,
  
        duration: item.duration,
        durationUnit: item.duration_unit,
  
        price: item.price,
        currency: item.currency,
  
        language: item.language,
        difficulty: item.difficulty,
  
        modules: parseJsonField(item.modules),
        images: parseJsonField(item.images),
        videos: parseJsonField(item.videos),
        thumbnail: parseJsonField(item.thumbnail),
  
        prerequisites: item.prerequisites,
        maxStudents: item.max_students,
  
        isFeatured: Boolean(item.is_featured),
        isPublished: Boolean(item.is_published),
        certificate: Boolean(item.certificate),
  
        tags: parseJsonField(item.tags),
      }));
  
      setLevels(parsedLevels);
  
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLevels();
  }, []);

  const handleAdd = async (form) => {
    try {
      const res = await axios.post(
        ENDPOINT.CREATE_LEVEL,
        form
      );
      console.log("Create",res)
      
      if (res.data.success) {
        setView("table");
        await fetchLevels();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (form) => {
    try {
      const res = await axios.put(
        ENDPOINT.UPDATE_LEVEL(form.id),
        form
      );
  
      if (res.data.success) {
        setView("table");
        setEditTarget(null);
        await fetchLevels();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      if (!window.confirm("Delete this level permanently?")) {
        return;
      }
  
      const res = await axios.delete(
        ENDPOINT.DELETE_LEVEL(id)
      );
  
      if (res.data.success) {
        await fetchLevels();
      }
    } catch (error) {
      console.error(error);
    }
  };


  const fetchLevelDetails = async (id) => {
    try {
      const res = await axios.get(
        ENDPOINT.GET_LEVEL_BY_ID(id)
      );
  
      if (res.data.success) {
        const item = res.data.data;

setEditTarget({
  ...item,
  modules: parseJsonField(item.modules),
  images: parseJsonField(item.images),
  videos: parseJsonField(item.videos),
  tags: parseJsonField(item.tags),
});
        setView("edit");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // ── TABLE VIEW ─────────────────────────────────────────────────
  if (view === "table") return (
    <div className="p-4 sm:p-5">
      {viewTarget && <ViewModal level={viewTarget} onClose={() => setViewTarget(null)} />}

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-800 tracking-tight">Levels</h2>
          <p className="text-[11px] text-slate-400 mt-0.5">{levels.length} level{levels.length !== 1 ? "s" : ""} configured</p>
        </div>
        <button
          onClick={() => setView("add")}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" /> Add Level
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block w-full overflow-x-auto rounded-xl border border-slate-100 shadow-sm">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-2 py-1.5 text-left font-semibold text-slate-500 uppercase tracking-wider w-12">#</th>
              <th className="px-2 py-1.5 text-left font-semibold text-slate-500 uppercase tracking-wider w-12">No.</th>
              <th className="px-2 py-1.5 text-left font-semibold text-slate-500 uppercase tracking-wider">Level Name</th>
              <th className="px-2 py-1.5 text-left font-semibold text-slate-500 uppercase tracking-wider w-24">Difficulty</th>
              <th className="px-2 py-1.5 text-left font-semibold text-slate-500 uppercase tracking-wider w-28">Duration</th>
              <th className="px-2 py-1.5 text-left font-semibold text-slate-500 uppercase tracking-wider w-24">Price</th>
              <th className="px-2 py-1.5 text-left font-semibold text-slate-500 uppercase tracking-wider w-16">Status</th>
              <th className="px-2 py-1.5 text-left font-semibold text-slate-500 uppercase tracking-wider w-20">Modules</th>
              <th className="px-2 py-1.5 text-center font-semibold text-slate-500 uppercase tracking-wider w-32">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-50">
            {levels.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-12 text-slate-400 text-xs">
                  No levels yet — click <span className="font-semibold text-indigo-500">Add Level</span> to create the first one.
                </td>
              </tr>
            ) : (
              levels.map((level, index) => (
                <tr key={level.id} className="hover:bg-indigo-50/30 transition-colors duration-150">
                  <td className="px-2 py-1 text-slate-400 font-mono">{index + 1}</td>
                  <td className="px-2 py-1">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-bold">{level.levelNumber}</span>
                  </td>
                  <td className="px-2 py-1">
                    <p className="font-semibold text-slate-800">{level.levelName}</p>
                    {level.objective && <p className="text-[10px] text-slate-400 truncate max-w-[200px] mt-0.5">{level.objective}</p>}
                  </td>
                  <td className="px-2 py-1">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${DIFF_COLOR[level.difficulty] || "bg-slate-100 text-slate-500"}`}>
                      {level.difficulty}
                    </span>
                  </td>
                  <td className="px-2 py-1 text-slate-500">{level.duration ? `${level.duration} ${level.durationUnit}` : "—"}</td>
                  <td className="px-2 py-1 font-semibold text-slate-700">{level.price ? `${level.currency} ${level.price}` : <span className="text-slate-400 font-normal">Free</span>}</td>
                  <td className="px-2 py-1">
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${level.isPublished ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : "bg-slate-100 text-slate-500"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${level.isPublished ? "bg-emerald-500" : "bg-slate-400"}`} />
                      {level.isPublished ? "Live" : "Draft"}
                    </span>
                  </td>
                  <td className="px-2 py-1 text-slate-500">{level.modules?.length || 0} module{level.modules?.length !== 1 ? "s" : ""}</td>
                  <td className="px-2 py-1">
                    <div className="flex items-center justify-center gap-1.5">
                      <button onClick={() => setViewTarget(level)}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md text-[11px] font-medium transition">
                        <Eye className="w-2.5 h-2.5" /> View
                      </button>
                      <button onClick={() => { setEditTarget(level); setView("edit"); }}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-[11px] font-medium transition">
                        <Pencil className="w-2.5 h-2.5" /> Edit
                      </button>
                      <button onClick={() => handleDelete(level.id)}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-[11px] font-medium transition">
                        <Trash2 className="w-2.5 h-2.5" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="block md:hidden space-y-2">
        {levels.length === 0 ? (
          <div className="text-center text-slate-400 py-10 text-xs">No levels yet.</div>
        ) : levels.map((level, index) => (
          <div key={level.id} className="bg-white rounded-xl border border-slate-100 shadow-sm px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-bold flex items-center justify-center shrink-0">{level.levelNumber}</span>
                <span className="text-xs font-bold text-slate-800 truncate">{level.levelName}</span>
              </div>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ml-2 ${level.isPublished ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : "bg-slate-100 text-slate-500"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${level.isPublished ? "bg-emerald-500" : "bg-slate-400"}`} />
                {level.isPublished ? "Live" : "Draft"}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${DIFF_COLOR[level.difficulty] || "bg-slate-100 text-slate-500"}`}>{level.difficulty}</span>
              {level.duration && <span className="text-[10px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full">{level.duration} {level.durationUnit}</span>}
              {level.price && <span className="text-[10px] font-semibold text-slate-700 bg-slate-50 px-2 py-0.5 rounded-full">{level.currency} {level.price}</span>}
              <span className="text-[10px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full">{level.modules?.length || 0} modules</span>
            </div>
            <div className="flex gap-1.5">
              <button onClick={() => setViewTarget(level)} className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-semibold transition">
                <Eye className="w-3 h-3" /> View
              </button>
              <button onClick={() => fetchLevelDetails(level.id)} className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition">
                <Pencil className="w-3 h-3" /> Edit
              </button>
              <button onClick={() => handleDelete(level.id)} className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-semibold transition">
                <Trash2 className="w-3 h-3" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── ADD / EDIT FORM ───────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <LevelForm
        key={view}
        initial={view === "edit" ? editTarget : blankForm()}
        mode={view}
        onSave={view === "edit" ? handleUpdate : handleAdd}
        onCancel={() => { setView("table"); setEditTarget(null); }}
      />
    </div>
  );
}
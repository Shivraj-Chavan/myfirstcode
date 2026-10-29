// ============================================================
// FILE: src/components/assignments/assignmentFormModal.jsx
// ============================================================

import { useState, useEffect } from "react";
import {
  X, Plus, Trash2, Lightbulb, TestTube2,
  FileCode2, Terminal, BookOpen, Star, ChevronRight, ChevronLeft
} from "lucide-react";

// ── helpers ──────────────────────────────────────────────────
const EMPTY_FORM = {
  title:          "",
  description:    "",
  standard:       "6th",
  language:       "javascript",
  categoryId:     "",
  difficulty:     "easy",
  starter_code:    "",
  solution_code:   "",
  expected_output: "",
  marks:          10,
  hints:          [""],
  test_case:      [{ input: "", output: "" }],
};

function safeArray(val) {
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    try { return JSON.parse(val); } catch { return []; }
  }
  return [];
}

function Label({ children, required }) {
  return (
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
      {children}{required && <span className="text-rose-500 ml-0.5">*</span>}
    </label>
  );
}

function Field({ children }) {
  return <div className="flex flex-col">{children}</div>;
}

const inputCls =
  "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none " +
  "focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all bg-white";

const STEPS = ["Basic Info", "Code", "Hints & Tests"];

// ─────────────────────────────────────────────────────────────
export default function AssignmentForm({ onSubmit, onClose, initialData }) {
  const isEdit = !!initialData;

  const [form, setForm] = useState(() => {
    if (!initialData) return { ...EMPTY_FORM };
    return {
      ...EMPTY_FORM,
      ...initialData,
      hints:     safeArray(initialData.hints).length     ? safeArray(initialData.hints)     : [""],
      test_case: safeArray(initialData.test_case).length ? safeArray(initialData.test_case) : [{ input: "", output: "" }],
    };
  });

  const [step, setStep]       = useState(0);
  const [saving, setSaving]   = useState(false);
  const [errors, setErrors]   = useState({});

  // reset when initialData changes (open for different record)
  useEffect(() => {
    if (initialData) {
      setForm({
        ...EMPTY_FORM,
        ...initialData,
        hints:     safeArray(initialData.hints).length     ? safeArray(initialData.hints)     : [""],
        test_case: safeArray(initialData.test_case).length ? safeArray(initialData.test_case) : [{ input: "", output: "" }],
      });
    } else {
      setForm({ ...EMPTY_FORM });
    }
    setStep(0);
    setErrors({});
  }, [initialData]);

  // ── field handlers ──────────────────────────────────────────
  const set = (name, value) => {
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(e => ({ ...e, [name]: undefined }));
  };

  const handleChange = e => set(e.target.name, e.target.value);

  // hints
  const setHint  = (i, v) => { const a = [...form.hints]; a[i] = v; set("hints", a); };
  const addHint  = ()     => set("hints", [...form.hints, ""]);
  const rmHint   = i      => set("hints", form.hints.filter((_, idx) => idx !== i));

  // test cases
  const setTC    = (i, field, v) => { const a = [...form.test_case]; a[i] = { ...a[i], [field]: v }; set("test_case", a); };
  const addTC    = ()            => set("test_case", [...form.test_case, { input: "", output: "" }]);
  const rmTC     = i             => set("test_case", form.test_case.filter((_, idx) => idx !== i));

  // ── validation ──────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.title.trim())          e.title       = "Title is required";
    if (!form.description.trim())    e.description = "Description is required";
    if (!form.starter_code.trim())    e.starter_code = "Starter code is required";
    if (!form.solution_code.trim())   e.solution_code= "Solution code is required";
    if (!form.expected_output.trim()) e.expected_output = "Expected output is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── submit ──────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate()) { setStep(0); return; }
    try {
      setSaving(true);
      await onSubmit(form);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // ── step nav ────────────────────────────────────────────────
  const goNext = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const goPrev = () => setStep(s => Math.max(s - 1, 0));

  // ── render ──────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[92vh]">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isEdit ? "Edit Assignment" : "Create Assignment"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {isEdit ? "Update the assignment details below" : "Build a coding task for students"}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-800">
            <X size={18} />
          </button>
        </div>

        {/* ── Step tabs ── */}
        <div className="flex border-b border-gray-100 bg-gray-50">
          {STEPS.map((s, i) => (
            <button
              key={s}
              onClick={() => setStep(i)}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${
                i === step
                  ? "border-b-2 border-gray-900 text-gray-900 bg-white"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] mr-1.5 ${
                i === step ? "bg-gray-900 text-white" : "bg-gray-200 text-gray-500"
              }`}>{i + 1}</span>
              {s}
            </button>
          ))}
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* ══ STEP 0: Basic Info ══ */}
          {step === 0 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <Field>
                  <Label required>Title</Label>
                  <input name="title" value={form.title} onChange={handleChange}
                    placeholder="e.g. Fibonacci Sequence" className={inputCls} />
                  {errors.title && <p className="text-rose-500 text-xs mt-1">{errors.title}</p>}
                </Field>

                <Field>
                  <Label required>Standard</Label>
                  <select name="standard" value={form.standard} onChange={handleChange} className={inputCls}>
                    {["6th","7th","8th","9th","10th"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </Field>

                <Field>
                  <Label required>Language</Label>
                  <select name="language" value={form.language} onChange={handleChange} className={inputCls}>
                    {["javascript","python","c","cpp","java","html","css"].map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </Field>

                <Field>
                  <Label>Category</Label>
                  <select name="categoryId" value={form.categoryId} onChange={handleChange} className={inputCls}>
                    <option value="">Select Category</option>
                    {[
                      { v:"variables", l:"Variables" },
                      { v:"loops",     l:"Loops"     },
                      { v:"arrays",    l:"Arrays"    },
                      { v:"functions", l:"Functions" },
                      { v:"flexbox",   l:"Flexbox"   },
                      { v:"forms",     l:"Forms"     },
                      { v:"strings",   l:"Strings"   },
                      { v:"oop",       l:"OOP"       },
                    ].map(({ v, l }) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </Field>

                <Field>
                  <Label required>Difficulty</Label>
                  <select name="difficulty" value={form.difficulty} onChange={handleChange} className={inputCls}>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </Field>

                <Field>
                  <Label required>Marks</Label>
                  <input type="number" name="marks" value={form.marks} onChange={handleChange}
                    min={1} className={inputCls} />
                </Field>
              </div>

              <Field>
                <Label required>Description</Label>
                <textarea rows={4} name="description" value={form.description} onChange={handleChange}
                  placeholder="Explain what the student needs to accomplish…"
                  className={inputCls + " resize-none"} />
                {errors.description && <p className="text-rose-500 text-xs mt-1">{errors.description}</p>}
              </Field>
            </div>
          )}

          {/* ══ STEP 1: Code ══ */}
          {step === 1 && (
            <div className="space-y-5">

              <Field>
                <div className="flex items-center gap-2 mb-1.5">
                  <FileCode2 size={14} className="text-blue-500" />
                  <Label required>Starter Code</Label>
                </div>
                <textarea rows={7} name="starter_code" value={form.starter_code} onChange={handleChange}
                  placeholder="// Give students a skeleton to start with…"
                  className={inputCls + " font-mono text-[13px] resize-none"} />
                {errors.starter_code && <p className="text-rose-500 text-xs mt-1">{errors.starter_code}</p>}
              </Field>

              <Field>
                <div className="flex items-center gap-2 mb-1.5">
                  <FileCode2 size={14} className="text-emerald-500" />
                  <Label required>Solution Code</Label>
                </div>
                <textarea rows={7} name="solution_code" value={form.solution_code} onChange={handleChange}
                  placeholder="// The correct/model solution…"
                  className={inputCls + " font-mono text-[13px] resize-none"} />
                {errors.solution_code && <p className="text-rose-500 text-xs mt-1">{errors.solution_code}</p>}
              </Field>

              <Field>
                <div className="flex items-center gap-2 mb-1.5">
                  <Terminal size={14} className="text-violet-500" />
                  <Label required>Expected Output</Label>
                </div>
                <textarea rows={3} name="expected_output" value={form.expected_output} onChange={handleChange}
                  placeholder="What should the program print / return?"
                  className={inputCls + " font-mono text-[13px] resize-none"} />
                {errors.expected_output && <p className="text-rose-500 text-xs mt-1">{errors.expected_output}</p>}
              </Field>
            </div>
          )}

          {/* ══ STEP 2: Hints & Test Cases ══ */}
          {step === 2 && (
            <div className="space-y-8">

              {/* Hints */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Lightbulb size={15} className="text-amber-500" />
                    <h3 className="font-bold text-sm text-gray-800">Hints</h3>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{form.hints.filter(Boolean).length}</span>
                  </div>
                  <button type="button" onClick={addHint}
                    className="flex items-center gap-1.5 text-xs font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-xl transition-colors">
                    <Plus size={12} /> Add Hint
                  </button>
                </div>
                <div className="space-y-2.5">
                  {form.hints.map((hint, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                      <input value={hint} onChange={e => setHint(i, e.target.value)}
                        placeholder={`Hint ${i + 1}…`}
                        className={inputCls + " flex-1"} />
                      {form.hints.length > 1 && (
                        <button type="button" onClick={() => rmHint(i)}
                          className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Test Cases */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TestTube2 size={15} className="text-violet-500" />
                    <h3 className="font-bold text-sm text-gray-800">Test Cases</h3>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{form.test_case.length}</span>
                  </div>
                  <button type="button" onClick={addTC}
                    className="flex items-center gap-1.5 text-xs font-semibold bg-violet-50 text-violet-700 hover:bg-violet-100 border border-violet-200 px-3 py-1.5 rounded-xl transition-colors">
                    <Plus size={12} /> Add Case
                  </button>
                </div>
                <div className="space-y-3">
                  {form.test_case.map((tc, i) => (
                    <div key={i} className="border border-gray-200 rounded-2xl p-4 bg-gray-50 space-y-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Case {i + 1}</span>
                        {form.test_case.length > 1 && (
                          <button type="button" onClick={() => rmTC(i)}
                            className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Field>
                          <Label>Input</Label>
                          <input value={tc.input} onChange={e => setTC(i, "input", e.target.value)}
                            placeholder="e.g. 5" className={inputCls + " font-mono text-[13px]"} />
                        </Field>
                        <Field>
                          <Label>Expected Output</Label>
                          <input value={tc.output} onChange={e => setTC(i, "output", e.target.value)}
                            placeholder="e.g. 120" className={inputCls + " font-mono text-[13px]"} />
                        </Field>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between bg-gray-50">
          <button onClick={goPrev} disabled={step === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronLeft size={14} /> Back
          </button>

          <div className="flex items-center gap-1.5">
            {STEPS.map((_, i) => (
              <div key={i} className={`rounded-full transition-all duration-300 ${
                i === step ? "w-5 h-2 bg-gray-900" : "w-2 h-2 bg-gray-300"
              }`} />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold border border-gray-200 rounded-xl hover:bg-white transition-colors">
              Cancel
            </button>
            {step < STEPS.length - 1 ? (
              <button onClick={goNext}
                className="flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition-colors">
                Next <ChevronRight size={14} />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-60">
                {saving
                  ? <><span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />Saving…</>
                  : isEdit ? "Save Changes" : "Create Assignment"
                }
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
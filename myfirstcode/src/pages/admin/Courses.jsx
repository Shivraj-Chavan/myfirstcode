// import { useEffect, useState } from "react";
// import { Plus, Pencil, Trash2, BookOpen, Layers } from "lucide-react";
// import { Link } from "react-router-dom";
// import api from "../../api/axios.js";
// import { ENDPOINTS } from "../../api/endpoints.js";
// import PageHeader from "../../components/shared/PageHeader.jsx";
// import Loader from "../../components/ui/Loader.jsx";
// import DataTable from "../../components/ui/DataTable.jsx";
// import Badge from "../../components/ui/Badge.jsx";
// import Modal from "../../components/ui/Modal.jsx";
// const EMPTY = { title: "", description: "", category: "", standard: "6", thumbnail: "", teacher_id: "", status: "Draft" };

// export default function AdminCourses() {
//   const [rows, setRows] = useState([]);
//   const [teachers, setTeachers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editing, setEditing] = useState(null);
//   const [form, setForm] = useState(EMPTY);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");

//   const load = () => {
//     setLoading(true);
//     Promise.all([api.get(ENDPOINTS.courses), api.get(ENDPOINTS.teachers)])
//       .then(([c, t]) => {
//         setRows(c.data?.courses || []);
//         setTeachers(t.data?.data || []);
//       })
//       .finally(() => setLoading(false));
//   };
//   useEffect(load, []);

//   const openCreate = () => { setEditing(null); setForm(EMPTY); setError(""); setModalOpen(true); };
//   const openEdit = (c) => {
//     setEditing(c);
//     setForm({
//      title: c.title, description: c.description || "", category: c.category || "",
//       standard: String(c.standard), thumbnail: c.thumbnail || "", teacher_id: c.teacher_id || "", status: c.status || "Draft",
//     });
//     setError("");
//     setModalOpen(true);
//   };

//   const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

//   const save = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     setError("");
//     try {
//       if (editing) await api.put(ENDPOINTS.updateCourse(editing.id), form);
//       else await api.post(ENDPOINTS.createCourse, form);
//       setModalOpen(false);
//       load();
//     } catch (err) {
//       setError(err?.response?.data?.message || "Couldn't save course.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const remove = async (c) => {
//     if (!confirm(`Delete "${c.title}"?`)) return;
//     await api.delete(ENDPOINTS.deleteCourse(c.id));
//     load();
//   };

//   if (loading) return <Loader label="Loading courses" />;

//   return (
//     <div>
//  <PageHeader
//         eyebrow="admin/courses"
//         title="Courses"
//         subtitle="Publish video courses for students to unlock. Use the Levels button on any course to build its curriculum with the full module/project/assessment form."
//         action={<button className="btn-primary" onClick={openCreate}><Plus size={16} /> New course</button>}
//       />

//       <DataTable
//         emptyTitle="No courses yet"
//         rows={rows}
//         columns={[
//           { key: "title", header: "Title" },
//           { key: "standard", header: "Std", render: (r) => <Badge tone="brand">Std {r.standard}</Badge> },
//           { key: "category", header: "Category" },
//          { key: "status", header: "Status", render: (r) => <Badge tone={r.status === "Published" ? "mint" : "amber"}>{r.status}</Badge> },
//          {
//             key: "actions",
//             header: "",
//             render: (r) => (
//               <div className="flex items-center gap-1.5">
//                 <Link to="/admin/levels" className="btn-ghost btn-sm" title="Manage curriculum levels for this course">
//                   <Layers size={13} /> Levels
//                 </Link>
//                 <button className="btn-ghost btn-sm" onClick={() => openEdit(r)}><Pencil size={13} /></button>
//                 <button className="btn-ghost btn-sm text-coral hover:bg-coral-light" onClick={() => remove(r)}><Trash2 size={13} /></button>
//               </div>
//             ),
//           },
//         ]}
//       />

//       <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit course" : "New course"}>
//         <form onSubmit={save} className="space-y-4">
//           <div><label className="label">Title</label><input required className="input" value={form.title} onChange={update("title")} /></div>
//           <div><label className="label">Description</label><textarea className="input min-h-20" value={form.description} onChange={update("description")} /></div>
//           <div className="grid grid-cols-2 gap-3">
//             <div><label className="label">Category</label><input className="input" value={form.category} onChange={update("category")} /></div>
//             <div>
//               <label className="label">Standard</label>
//               <select className="input" value={form.standard} onChange={update("standard")}>
//                 {["6", "7", "8", "9", "10"].map((s) => <option key={s} value={s}>Std {s}</option>)}
//               </select>
//             </div>
//           </div>
//           <div>
//             <label className="label">Teacher</label>
//             <select className="input" value={form.teacher_id} onChange={update("teacher_id")}>
//               <option value="">Unassigned</option>
//               {teachers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
//             </select>
//           </div>
//           <div><label className="label">Thumbnail URL</label><input className="input" value={form.thumbnail} onChange={update("thumbnail")} /></div>
//           <div>
//             <label className="label">Status</label>
//       <select className="input" value={form.status} onChange={update("status")}>
//               <option value="Draft">Draft</option>
//               <option value="Published">Published</option>
//             </select>
//           </div>
//           {error && <p className="rounded-lg bg-coral-light px-3.5 py-2.5 text-xs font-medium text-coral-dark">{error}</p>}
//           <button className="btn-primary w-full" disabled={saving}>{saving ? "Saving..." : editing ? "Save changes" : "Create course"}</button>
//         </form>
//       </Modal>
//     </div>
//   );
// }


import TeacherLevels from "../teacher/Levels.jsx";
export default function AdminCourses() {
  return <TeacherLevels />;
}
// src/pages/admin/Teachers.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, CheckCircle, X, GraduationCap, Search } from "lucide-react";
import ENDPOINT from "../../lib/endpoints";

const Teachers = () => {

  const [teachers,  setTeachers]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search,    setSearch]    = useState("");
  const [formData,  setFormData]  = useState({ name: "", email: "" });

  // ── fetch ───────────────────────────────────────────
  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(ENDPOINT.GET_TEACHERS);
      setTeachers(res.data.data || []);
    } catch (err) {
      console.log(err);
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTeachers(); }, []);

  // ── approve ─────────────────────────────────────────
  const approveTeacher = async (id) => {
    try {
      await axios.put(ENDPOINT.APPROVE_TEACHER(id));
      fetchTeachers();
    } catch (err) { console.log(err); }
  };

  // ── delete ──────────────────────────────────────────
  const deleteTeacher = async (id) => {
    if (!window.confirm("Delete this teacher?")) return;
    try {
      await axios.delete(ENDPOINT.DELETE_TEACHER(id));
      fetchTeachers();
    } catch (err) { console.log(err); }
  };

  // ── add teacher ─────────────────────────────────────
  const handleAddTeacher = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(ENDPOINT.CREATE, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.data);
      setShowModal(false);
      setFormData({ name: "", email: "" });
      fetchTeachers();
    } catch (err) {
      console.log("ERROR:", err.response?.status, err.response?.data, err.message);
    }
  };

  // ── filter ──────────────────────────────────────────
  const filtered = teachers.filter(
    (t) =>
      t.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.email?.toLowerCase().includes(search.toLowerCase())
  );

  const approved = teachers.filter((t) => t.status === "APPROVED").length;
  const pending  = teachers.filter((t) => t.status !== "APPROVED").length;

  const inp = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-900/10 bg-white";

  return (
    <div className="min-h-screen bg-gray-50 p-5">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <GraduationCap size={20} className="text-blue-500" />
            Teachers
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">Approve and manage teacher accounts</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={15} /> Add Teacher
        </button>
      </div>

      {/* ── Stat chips + search row ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="bg-white border border-gray-200 text-xs font-medium text-gray-600 px-3 py-1.5 rounded-lg">
            Total: <strong>{teachers.length}</strong>
          </span>
          <span className="bg-green-50 border border-green-200 text-xs font-medium text-green-700 px-3 py-1.5 rounded-lg">
            Approved: <strong>{approved}</strong>
          </span>
          <span className="bg-amber-50 border border-amber-200 text-xs font-medium text-amber-700 px-3 py-1.5 rounded-lg">
            Pending: <strong>{pending}</strong>
          </span>
        </div>

        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search teachers…"
            className="border border-gray-200 bg-white rounded-lg pl-8 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900/10 w-52"
          />
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 w-12">#</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500">Name</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500">Email</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500">Role</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500">Status</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500">Joined</th>
                <th className="px-4 py-2.5 text-center text-xs font-semibold text-gray-500">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm text-gray-400">
                    Loading teachers…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm text-gray-400">
                    {search ? "No teachers match your search." : "No teachers found."}
                  </td>
                </tr>
              ) : (
                filtered.map((teacher) => (
                  <tr
                    key={teacher.id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                  >
                    {/* id */}
                    <td className="px-4 py-2.5 text-xs text-gray-400 font-mono">
                      #{teacher.id}
                    </td>

                    {/* name */}
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                          <span className="text-xs font-semibold text-blue-600">
                            {teacher.name?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900 whitespace-nowrap">{teacher.name}</span>
                      </div>
                    </td>

                    {/* email */}
                    <td className="px-4 py-2.5 text-gray-500 max-w-[180px] truncate">
                      {teacher.email}
                    </td>

                    {/* role */}
                    <td className="px-4 py-2.5">
                      <span className="bg-blue-50 text-blue-600 text-xs font-medium px-2 py-0.5 rounded-full capitalize border border-blue-100">
                        {teacher.role}
                      </span>
                    </td>

                    {/* status */}
                    <td className="px-4 py-2.5">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                        teacher.status === "APPROVED"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-amber-50 text-amber-600 border-amber-200"
                      }`}>
                        {teacher.status}
                      </span>
                    </td>

                    {/* created */}
                    <td className="px-4 py-2.5 text-xs text-gray-400 whitespace-nowrap">
                      {new Date(teacher.created_at).toLocaleDateString("en-IN", {
                        day: "2-digit", month: "short", year: "numeric"
                      })}
                    </td>

                    {/* actions */}
                    <td className="px-4 py-2.5">
                      <div className="flex items-center justify-center gap-1.5">
                        {teacher.status !== "APPROVED" && (
                          <button
                            onClick={() => approveTeacher(teacher.id)}
                            title="Approve"
                            className="flex items-center gap-1 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors"
                          >
                            <CheckCircle size={12} /> Approve
                          </button>
                        )}
                        <button
                          onClick={() => deleteTeacher(teacher.id)}
                          title="Delete"
                          className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>

      {/* ── Add Teacher Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl">

            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <h2 className="font-semibold text-gray-900">Add Teacher</h2>
                <p className="text-xs text-gray-400 mt-0.5">Create a new teacher account</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddTeacher}>
              <div className="p-5 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={inp}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="teacher@school.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={inp}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium px-5 py-2 rounded-xl transition-colors"
                >
                  Create Teacher
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default Teachers;
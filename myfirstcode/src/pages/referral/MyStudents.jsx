import { useEffect, useState } from "react";
import { Plus, Eye, Pencil, Trash2, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";
import { REFERRAL_ENDPOINTS } from "../../api/referralEndpoints.js";

import PageHeader from "../../components/shared/PageHeader.jsx";
import Loader from "../../components/ui/Loader.jsx";
import DataTable from "../../components/ui/DataTable.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Modal from "../../components/ui/Modal.jsx";

const authHeader = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("refp_token")}` } });
const EDITABLE_STATUSES = ["LEAD_ADDED", "PENDING_REVIEW"];
const EMPTY = {
  studentName: "", age: "", gender: "", standard: "", schoolName: "", board: "", percentage: "",
  interestedCourse: "", preferredBatch: "", expectedJoiningMonth: "",
  studentMobile: "", parentMobile: "", studentEmail: "", parentEmail: "",
  address: "", city: "", state: "", pincode: "",
  parentName: "", relationship: "", occupation: "",
  referredHow: "", remarks: "",
};

const toForm = (lead) => ({
  studentName: lead.student_name || "", age: lead.age || "", gender: lead.gender || "",
  standard: lead.standard || "", schoolName: lead.school_name || "", board: lead.board || "",
  percentage: lead.percentage || "", interestedCourse: lead.interested_course || "",
  preferredBatch: lead.preferred_batch || "", expectedJoiningMonth: lead.expected_joining_month || "",
  studentMobile: lead.student_mobile || "", parentMobile: lead.parent_mobile || "",
  studentEmail: lead.student_email || "", parentEmail: lead.parent_email || "",
  address: lead.address || "", city: lead.city || "", state: lead.state || "", pincode: lead.pincode || "",
  parentName: lead.parent_name || "", relationship: lead.relationship || "", occupation: lead.occupation || "",
  referredHow: lead.referred_how || "", remarks: lead.remarks || "",
});

export default function MyStudents() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    api
      .get(REFERRAL_ENDPOINTS.myStudents, authHeader())
      .then((res) => setRows(res.data?.data || []))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const isEditable = (lead) => EDITABLE_STATUSES.includes(lead.status);

  const openEdit = (lead) => {
    setEditing(lead);
    setForm(toForm(lead));
    setError("");
  };

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.put(REFERRAL_ENDPOINTS.student(editing.id), form, authHeader());
      setEditing(null);
      load();
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't update lead.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (lead) => {
    if (!confirm(`Delete lead for "${lead.student_name}"?`)) return;
    try {
      await api.delete(REFERRAL_ENDPOINTS.student(lead.id), authHeader());
      load();
    } catch (err) {
      alert(err?.response?.data?.message || "Couldn't delete lead.");
    }
  };

  if (loading) return <Loader label="Loading students" />;

  return (
    <div>
      <PageHeader
        eyebrow="referral/students"
        title="My Students"
        action={<Link to="/referral/add-student" className="btn-primary"><Plus size={16} /> Add Student</Link>}
      />
      <DataTable
        emptyTitle="No students added yet"
        rows={rows}
        columns={[
          { key: "srNo", header: "Sr. No.", render: (_, index) => index + 1,},
          { key: "student_name", header: "Student" },
          { key: "school_name", header: "School/College" },
          { key: "interested_course", header: "Course" },
          { key: "student_mobile", header: "Mobile" },
         { key: "status", header: "Status", render: (r) => <Badge tone="brand">{r.status?.replaceAll("_", " ")}</Badge> },
          { key: "payment_status", header: "Payment", render: (r) => <Badge tone={r.payment_status === "VERIFIED" ? "mint" : "amber"}>{r.payment_status?.replaceAll("_", " ")}</Badge> },
          {
            key: "actions",
            header: "",
            render: (r) => (
              <div className="flex items-center gap-1.5">
                <button className="btn-ghost btn-sm" onClick={() => setViewing(r)}><Eye size={13} /> View</button>
                {isEditable(r) ? (
                  <>
                    <button className="btn-ghost btn-sm" onClick={() => openEdit(r)}><Pencil size={13} /></button>
                    <button className="btn-ghost btn-sm text-coral hover:bg-coral-light" onClick={() => remove(r)}><Trash2 size={13} /></button>
                  </>
                ) : (
                  <span className="flex items-center gap-1 px-2 text-xs text-slate-muted" title="Locked once admin starts processing this lead">
                    {/* <Lock size={12} /> Locked */}
                  </span>
                )}
              </div>
            ),
          },
        ]}
      />

   {/* ---------------- VIEW (every field) ---------------- */}
      <Modal open={!!viewing} onClose={() => setViewing(null)} title={viewing?.student_name} width="max-w-2xl">
        {viewing && (
          <div className="space-y-5 text-sm">
            <div>
              <p className="eyebrow mb-2">personal information</p>
              <div className="grid grid-cols-3 gap-3">
                <div><p className="label mb-0.5">Age</p><p className="text-ink">{viewing.age}</p></div>
                <div><p className="label mb-0.5">Gender</p><p className="text-ink">{viewing.gender || "—"}</p></div>
                <div><p className="label mb-0.5">Standard</p><p className="text-ink">{viewing.standard}</p></div>
              </div>
            </div>

            <div>
              <p className="eyebrow mb-2">academic information</p>
              <div className="grid grid-cols-2 gap-3">
                <div><p className="label mb-0.5">School / College</p><p className="text-ink">{viewing.school_name}</p></div>
                <div><p className="label mb-0.5">Board / University</p><p className="text-ink">{viewing.board || "—"}</p></div>
                <div><p className="label mb-0.5">Percentage / CGPA</p><p className="text-ink">{viewing.percentage || "—"}</p></div>
              </div>
            </div>

            <div>
              <p className="eyebrow mb-2">course information</p>
              <div className="grid grid-cols-3 gap-3">
                <div><p className="label mb-0.5">Interested Course</p><p className="text-ink">{viewing.interested_course}</p></div>
                <div><p className="label mb-0.5">Preferred Batch</p><p className="text-ink">{viewing.preferred_batch || "—"}</p></div>
                <div><p className="label mb-0.5">Expected Joining</p><p className="text-ink">{viewing.expected_joining_month || "—"}</p></div>
              </div>
            </div>

            <div>
              <p className="eyebrow mb-2">contact information</p>
              <div className="grid grid-cols-2 gap-3">
                <div><p className="label mb-0.5">Student Mobile</p><p className="text-ink">{viewing.student_mobile}</p></div>
                <div><p className="label mb-0.5">Parent Mobile</p><p className="text-ink">{viewing.parent_mobile}</p></div>
                <div><p className="label mb-0.5">Student Email</p><p className="text-ink">{viewing.student_email || "—"}</p></div>
                <div><p className="label mb-0.5">Parent Email</p><p className="text-ink">{viewing.parent_email || "—"}</p></div>
              </div>
              <div className="mt-2"><p className="label mb-0.5">Address</p><p className="text-ink">{viewing.address || "—"}</p></div>
              <div className="mt-2 grid grid-cols-3 gap-3">
                <div><p className="label mb-0.5">City</p><p className="text-ink">{viewing.city || "—"}</p></div>
                <div><p className="label mb-0.5">State</p><p className="text-ink">{viewing.state || "—"}</p></div>
                <div><p className="label mb-0.5">PIN Code</p><p className="text-ink">{viewing.pincode || "—"}</p></div>
              </div>
            </div>

            <div>
              <p className="eyebrow mb-2">parent details</p>
              <div className="grid grid-cols-3 gap-3">
                <div><p className="label mb-0.5">Parent Name</p><p className="text-ink">{viewing.parent_name || "—"}</p></div>
                <div><p className="label mb-0.5">Relationship</p><p className="text-ink">{viewing.relationship || "—"}</p></div>
                <div><p className="label mb-0.5">Occupation</p><p className="text-ink">{viewing.occupation || "—"}</p></div>
              </div>
            </div>

            <div>
              <p className="eyebrow mb-2">additional details</p>
              <div><p className="label mb-0.5">How was the student referred?</p><p className="text-ink">{viewing.referred_how || "—"}</p></div>
              <div className="mt-2"><p className="label mb-0.5">Remarks / Notes</p><p className="text-ink">{viewing.remarks || "—"}</p></div>
            </div>

            <div className="flex items-center gap-2 border-t border-ink/5 pt-3">
              <Badge tone="brand">{viewing.status}</Badge>
              <Badge tone={viewing.payment_status === "VERIFIED" ? "mint" : "amber"}>{viewing.payment_status}</Badge>
            </div>
          </div>
        )}
      </Modal>

      {/* ---------------- EDIT (every field) ---------------- */}
      <Modal open={!!editing} onClose={() => setEditing(null)} title={`Edit ${editing?.student_name || ""}`} width="max-w-2xl">
        <form onSubmit={save} className="space-y-6">
          <div>
            <p className="eyebrow mb-2">personal information</p>
            <div className="grid gap-3 sm:grid-cols-3">
              <div><label className="label">Student Full Name *</label><input required className="input" value={form.studentName} onChange={update("studentName")} /></div>
              <div><label className="label">Age *</label><input type="number" required className="input" value={form.age} onChange={update("age")} /></div>
              <div><label className="label">Gender</label>
                <select className="input" value={form.gender} onChange={update("gender")}>
                  <option value="">Select</option><option value="MALE">Male</option><option value="FEMALE">Female</option><option value="OTHER">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <p className="eyebrow mb-2">academic information</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div><label className="label">Current Standard / Year *</label><input required className="input" value={form.standard} onChange={update("standard")} /></div>
              <div><label className="label">School / College Name *</label><input required className="input" value={form.schoolName} onChange={update("schoolName")} /></div>
              <div><label className="label">Board / University</label><input className="input" value={form.board} onChange={update("board")} /></div>
              <div><label className="label">Percentage / CGPA</label><input className="input" value={form.percentage} onChange={update("percentage")} /></div>
            </div>
          </div>

          <div>
            <p className="eyebrow mb-2">course information</p>
            <div className="grid gap-3 sm:grid-cols-3">
              <div><label className="label">Interested Course *</label><input required className="input" value={form.interestedCourse} onChange={update("interestedCourse")} /></div>
              <div><label className="label">Preferred Batch</label><input className="input" value={form.preferredBatch} onChange={update("preferredBatch")} /></div>
              <div><label className="label">Expected Joining Month</label><input className="input" value={form.expectedJoiningMonth} onChange={update("expectedJoiningMonth")} /></div>
            </div>
          </div>

          <div>
            <p className="eyebrow mb-2">contact information</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div><label className="label">Student Mobile *</label><input required className="input" value={form.studentMobile} onChange={update("studentMobile")} /></div>
              <div><label className="label">Parent Mobile *</label><input required className="input" value={form.parentMobile} onChange={update("parentMobile")} /></div>
              <div><label className="label">Student Email</label><input className="input" value={form.studentEmail} onChange={update("studentEmail")} /></div>
              <div><label className="label">Parent Email</label><input className="input" value={form.parentEmail} onChange={update("parentEmail")} /></div>
            </div>
            <div className="mt-3"><label className="label">Address</label><input className="input" value={form.address} onChange={update("address")} /></div>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <div><label className="label">City</label><input className="input" value={form.city} onChange={update("city")} /></div>
              <div><label className="label">State</label><input className="input" value={form.state} onChange={update("state")} /></div>
              <div><label className="label">PIN Code</label><input className="input" value={form.pincode} onChange={update("pincode")} /></div>
            </div>
          </div>

          <div>
            <p className="eyebrow mb-2">parent details</p>
            <div className="grid gap-3 sm:grid-cols-3">
              <div><label className="label">Parent Name</label><input className="input" value={form.parentName} onChange={update("parentName")} /></div>
              <div><label className="label">Relationship</label><input className="input" value={form.relationship} onChange={update("relationship")} /></div>
              <div><label className="label">Occupation</label><input className="input" value={form.occupation} onChange={update("occupation")} /></div>
            </div>
          </div>

          <div>
            <p className="eyebrow mb-2">additional details</p>
            <div><label className="label">How was the student referred?</label><input className="input" value={form.referredHow} onChange={update("referredHow")} /></div>
            <div className="mt-3"><label className="label">Remarks / Notes</label><textarea className="input min-h-20" value={form.remarks} onChange={update("remarks")} /></div>
          </div>

          {error && <p className="rounded-lg bg-coral-light px-3.5 py-2.5 text-xs font-medium text-coral-dark">{error}</p>}

          <button className="btn-primary w-full" disabled={saving}>{saving ? "Saving..." : "Save changes"}</button>
        </form>
      </Modal>
    </div>
  );
}
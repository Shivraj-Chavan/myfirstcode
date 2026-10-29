import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios.js";
import { REFERRAL_ENDPOINTS } from "../../api/referralEndpoints.js";
import PageHeader from "../../components/shared/PageHeader.jsx";

const EMPTY = {
  studentName: "", age: "", gender: "", standard: "", schoolName: "", board: "", percentage: "",
  interestedCourse: "", preferredBatch: "", expectedJoiningMonth: "",
  studentMobile: "", parentMobile: "", studentEmail: "", parentEmail: "",
  address: "", city: "", state: "", pincode: "",
  parentName: "", relationship: "", occupation: "",
  referredHow: "", remarks: "",
};

export default function AddStudent() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.post(REFERRAL_ENDPOINTS.addStudent, form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("refp_token")}` },
      });
      navigate("/referral/students");
    } catch (err) {
      setError(err?.response?.data?.message || "Couldn't save student lead.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader eyebrow="referral/add-student" title="Add Student Lead" />
      <form onSubmit={submit} className="card space-y-6 p-6">
        <div>
          <p className="eyebrow mb-2">personal information</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <div><label className="label">Student Full Name *</label><input required className="input" value={form.studentName} onChange={update("studentName")} /></div>
            <div><label className="label">Age *</label><input type="number" required className="input" value={form.age} onChange={update("age")} /></div>
            <div><label className="label">Gender</label>
              <select className="input" value={form.gender} onChange={update("gender")}>
                <option value="">Select</option><option>Male</option><option>Female</option><option>Other</option>
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
            <div><label className="label">Interested Course </label><input required className="input" value={form.interestedCourse} onChange={update("interestedCourse")} /></div>
            <div><label className="label">Preferred Batch</label><input className="input" value={form.preferredBatch} onChange={update("preferredBatch")} /></div>
            <div><label className="label">Expected Joining Month</label><input className="input" value={form.expectedJoiningMonth} onChange={update("expectedJoiningMonth")} /></div>
          </div>
        </div>

        <div>
          <p className="eyebrow mb-2">contact information</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><label className="label">Student Mobile </label><input required className="input" value={form.studentMobile} onChange={update("studentMobile")} /></div>
            <div><label className="label">Parent Mobile *</label><input required className="input" value={form.parentMobile} onChange={update("parentMobile")} /></div>
            <div><label className="label">Student Email</label><input className="input" value={form.studentEmail} onChange={update("studentEmail")} /></div>
            <div><label className="label">Parent Email</label><input className="input" value={form.parentEmail} onChange={update("parentEmail")} /></div>
          </div>
          <div className="mt-3"><label className="label">Address</label><input className="input" value={form.address} onChange={update("address")} /></div>
          {/* <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div><label className="label">City</label><input className="input" value={form.city} onChange={update("city")} /></div>
            <div><label className="label">State</label><input className="input" value={form.state} onChange={update("state")} /></div>
            <div><label className="label">PIN Code</label><input className="input" value={form.pincode} onChange={update("pincode")} /></div>
          </div> */}
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

        <button className="btn-primary w-full" disabled={saving}>{saving ? "Saving..." : "Save Student Lead"}</button>
      </form>
    </div>
  );
}
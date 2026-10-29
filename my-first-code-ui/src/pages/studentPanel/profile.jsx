"use client";

import { useEffect, useState } from "react";
import {
  User, GraduationCap, MapPin, BookOpen, Users,
  Camera, Pencil, X, Save, CheckCircle2, Clock, AlertCircle
} from "lucide-react";
import ENDPOINT from "../../lib/endpoints";
import axios from "axios";

const TABS = [
  { id: "personal",  label: "Personal",  shortLabel: "Personal",  icon: User },
  { id: "parent",    label: "Parent",    shortLabel: "Parent",    icon: Users },
  { id: "academic",  label: "Academic",  shortLabel: "Academic",  icon: GraduationCap },
  { id: "address",   label: "Address",   shortLabel: "Address",   icon: MapPin },
  { id: "learning",  label: "Learning",  shortLabel: "Learning",  icon: BookOpen },
];

const StatusBadge = ({ status }) => {
  const map = {
    Active:   { color: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200", dot: "bg-emerald-500" },
    Inactive: { color: "bg-gray-100 text-gray-500 ring-1 ring-gray-200",         dot: "bg-gray-400" },
    Pending:  { color: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",       dot: "bg-amber-400" },
  };
  const s = map[status] || map["Pending"];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${s.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
};

const Field = ({ label, value, span = 1, readOnly, editing, type = "text" }) => (
  <div className={`flex flex-col gap-0.5 ${span === 2 ? "sm:col-span-2" : ""}`}>
    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{label}</label>
    {readOnly || !editing ? (
      <div className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs min-h-[34px] ${
        readOnly
          ? "bg-slate-50 border border-slate-100 text-slate-500 font-semibold"
          : "bg-white border border-transparent text-slate-700"
      }`}>
        {readOnly && <span className="w-1.5 h-1.5 rounded-full bg-blue-300 shrink-0" />}
        {value || "—"}
      </div>
    ) : (
      <input
        type={type}
        defaultValue={value || ""}
        placeholder={`Enter ${label.toLowerCase()}`}
        className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition min-h-[34px]"
      />
    )}
  </div>
);

const SelectField = ({ label, options = [], defaultVal, editing }) => (
  <div className="flex flex-col gap-0.5">
    <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{label}</label>
    {!editing ? (
      <div className="flex items-center bg-white border border-transparent rounded-lg px-3 py-2 text-xs text-slate-700 min-h-[34px]">
        {defaultVal || "—"}
      </div>
    ) : (
      <div className="relative">
        <select
          defaultValue={defaultVal || ""}
          className="w-full appearance-none bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition min-h-[34px] pr-7"
        >
          <option value="">Select {label}</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    )}
  </div>
);

export default function StudentProfile() {
  const [activeTab, setActiveTab] = useState("personal");
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(null);
const [loading, setLoading] = useState(true);

const [student, setStudent] = useState(null);

useEffect(() => {
  const user = localStorage.getItem("user");

  if (user) {
    setStudent(JSON.parse(user));
  }
}, []);

const studentId = student?.id;
console.log("Student ID", studentId);

useEffect(() => {
  console.log("useEffect Fired");
  fetchProfile();
}, []);

useEffect(() => {
  console.log("Updated Profile:", profile);
}, [profile]);

const fetchProfile = async () => {
  try {
    setLoading(true);

    const res = await axios.get(
      ENDPOINT.GET_STUDENT_PROFILE
    );

    console.log("Student Profile Response:", res.data);

    if (res.data.success) {
      setProfile(res.data.student);
    }
  } catch (err) {
    console.error("Profile Fetch Error:", err);
  } finally {
    setLoading(false);
  }
};


if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      Loading Profile...
    </div>
  );
}

// if (!profile) {
//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       Profile not found
//     </div>
//   );
// }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto space-y-3">

        {/* ── Profile Header ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="h-16 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 relative">
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: "radial-gradient(white 1px, transparent 1px)", backgroundSize: "20px 20px" }}
            />
          </div>
          <div className="px-4 pb-3 pt-0">
            <div className="flex items-end justify-between -mt-7">
              {/* Avatar + Info */}
              <div className="flex items-end gap-3">
                <div className="relative shrink-0">
                  <div className="w-14 h-14 rounded-xl border-2 border-white shadow-md bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-400" />
                  </div>
                  <button className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center shadow border-2 border-white hover:bg-blue-700 transition">
                    <Camera className="w-2.5 h-2.5 text-white" />
                  </button>
                </div>
                <div className="pb-0.5">
                  <h1 className="text-sm font-bold text-slate-800 leading-tight"> {profile?.name}</h1>
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    <span className="text-[9px] font-mono bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100 leading-none">{studentId}</span>
                    <StatusBadge  status={profile?.status || "Pending"} />
                  </div>
                </div>
              </div>

              {/* Edit / Save / Cancel */}
              <div className="flex items-center gap-1.5 pb-0.5">
                {editing ? (
                  <>
                    <button
                      onClick={() => setEditing(false)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                    >
                      <X className="w-3 h-3" /> Cancel
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-sm"
                    >
                      <Save className="w-3 h-3" /> Save
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditing(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition border border-blue-100"
                  >
                    <Pencil className="w-3 h-3" /> Edit
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Tab Bar ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-100 overflow-x-auto scrollbar-none">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors shrink-0 ${
                  activeTab === id
                    ? "border-blue-600 text-blue-600 bg-blue-50/50"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-4">

            {/* Personal */}
            {activeTab === "personal" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">

<Field
  label="Student ID"
  value={profile?.id}
  readOnly
  editing={editing}
/>

<Field
  label="Full Name"
  value={profile?.name}
  editing={editing}
/>

<SelectField
  label="Gender"
  defaultVal={profile?.gender}
  options={["Male","Female","Other"]}
  editing={editing}
/>

<Field
  label="Date of Birth"
value={
  profile?.dob
    ? profile.dob.split("T")[0]
    : ""
}  type="date"
  editing={editing}
/>

<Field
  label="Age"
  value={
    profile?.dob
      ? new Date().getFullYear() -
        new Date(profile.dob).getFullYear()
      : ""
  }
  editing={editing}
/>

<Field
  label="Email"
  value={profile?.email}
  editing={editing}
/>

<Field
  label="Mobile Number"
  value={profile?.phone}
  editing={editing}
/>

<Field
  label="WhatsApp Number"
  value={profile?.whatsapp_number}
  editing={editing}
/>
              </div>
            )}

            {/* Parent */}
            {activeTab === "parent" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">

                <Field
  label="Father Name"
  value={profile?.father_name}
  editing={editing}
/>

<Field
  label="Father Mobile"
  value={profile?.father_mobile}
  editing={editing}
/>

<Field
  label="Mother Name"
  value={profile?.mother_name}
  editing={editing}
/>

<Field
  label="Mother Mobile"
  value={profile?.mother_mobile}
  editing={editing}
/>

<Field
  label="Parent Email"
  value={profile?.parent_email}
  editing={editing}
/>

<Field label="Occupation"  value={profile?.occupation}  editing={editing} />
              </div>
            )}

            {/* Academic */}
            {activeTab === "academic" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">

                <Field
  label="School / College"
  value={profile?.school_college}
  span={2}
  editing={editing}
/>

<SelectField
  label="Board"
  defaultVal={profile?.board}
  options={[
    "CBSE",
    "ICSE",
    "State Board",
    "IB"
  ]}
  editing={editing}
/>

<SelectField
  label="Standard"
  defaultVal={profile?.standard}
  options={[
    "6th","7th","8th",
    "9th","10th",
    "11th","12th"
  ]}
  editing={editing}
/>

<SelectField label="Division"  defaultVal={profile?.division} options={["A","B","C","D"]}  editing={editing} />

<Field
  label="Academic Year"
  value={profile?.academic_year}
  editing={editing}
/>

<Field label="Course Enrolled" value={profile?.course} editing={editing} />
<Field label="Admission Date"  value={profile?.admission_date} type="date" editing={editing} />

              </div>
            )}

            {/* Address */}
            {activeTab === "address" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">

                <Field
  label="Address Line 1"
  value={profile?.address_line1}
  span={2}
  editing={editing}
/>

<Field
  label="Address Line 2"
  value={profile?.address_line2}
  editing={editing}
/>

<Field label="Area" value={profile?.area} editing={editing} />

<Field
  label="City"
  value={profile?.city}
  editing={editing}
/>

<Field
  label="State"
  value={profile?.state}
  editing={editing}
/>

<Field
  label="Pincode"
  value={profile?.pincode}
  editing={editing}
/>

<SelectField label="Country"  options={["India","USA","UK","Canada","Australia"]} defaultVal="India" editing={editing} />

              </div>
            )}

            {/* Learning */}
            {activeTab === "learning" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">

                <Field
  label="Assigned Teacher"
  value={profile?.teacher_name}
  readOnly
  editing={editing}
/>

<Field
  label="Assigned Batch"
  value={profile?.batch_name}
  readOnly
  editing={editing}
/>

<Field
  label="Current Level"
  value={profile?.current_level}
  readOnly
  editing={editing}
/>

<Field
  label="Completed Levels"
  value={profile?.completed_levels}
  readOnly
  editing={editing}
/>

<Field
  label="Purchased Levels"
  value={profile?.purchased_levels}
  readOnly
  editing={editing}
/>

<Field label="Pending Levels" value={profile?.pending_levels}  readOnly editing={editing} />
<div className="flex flex-col gap-0.5">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Enrollment Status</label>
                  <div className="flex items-center min-h-[34px]">
                    <StatusBadge status="Active" />
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-slate-50 flex items-center justify-between bg-slate-50/50">
            <p className="text-[10px] text-slate-400">
              Last updated: <span className="text-slate-500 font-medium">12 May 2025, 10:42 AM</span>
            </p>
            {editing && (
              <div className="flex gap-1.5">
                <button onClick={() => setEditing(false)} className="px-3 py-1 text-xs font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition">
                  Discard
                </button>
                <button onClick={() => setEditing(false)} className="px-3 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition">
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

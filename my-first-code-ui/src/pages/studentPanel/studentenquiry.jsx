// src/pages/student/StudentEnquiry.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import { Send, MessageCircle, User, Clock, CheckCircle2, ChevronDown, Inbox } from "lucide-react";
import ENDPOINT from "../../lib/endpoints";

export default function StudentEnquiry() {

  const [teachers,  setTeachers]  = useState([]);
  const [teacherId, setTeacherId] = useState("");
  const [subject,   setSubject]   = useState("");
  const [message,   setMessage]   = useState("");
  const [enquiries, setEnquiries] = useState([]);
  const [sending,   setSending]   = useState(false);

  const token      = localStorage.getItem("token");
  const authConfig = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchTeachers();
    fetchEnquiries();
  }, []);

  const fetchTeachers = async () => {

    try {
  
      const res = await axios.get(
        ENDPOINT.GET_TEACHERS,
        authConfig
      );
  
      console.log("TEACHERS API:", res.data);
  
      // SAFE ARRAY EXTRACTION
  
      const teacherData =
  
        Array.isArray(res.data)
          ? res.data
  
          : Array.isArray(res.data.teachers)
          ? res.data.teachers
  
          : Array.isArray(res.data.data)
          ? res.data.data
  
          : [];
  
      setTeachers(teacherData);
  
    } catch (err) {
  
      console.error("FETCH TEACHERS ERROR:", err);
  
      setTeachers([]);
  
    }
  };

  const fetchEnquiries = async () => {
    try {
      const res = await axios.get(ENDPOINT.GET_STUDENT_ENQUIRIES, authConfig);
      setEnquiries(res.data.enquiries || []);
    } catch (err) { console.error(err); }
  };

  const handleSend = async () => {
    if (!teacherId || !subject.trim() || !message.trim())
      return alert("Please fill all fields.");
    try {
      setSending(true);
      await axios.post(ENDPOINT.SEND_ENQUIRY, { teacher_id: teacherId, subject, message }, authConfig);
      setSubject(""); setMessage(""); setTeacherId("");
      fetchEnquiries();
    } catch (err) {
      console.error(err);
      alert("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  const inp = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 bg-white transition-colors";

  const pending = enquiries.filter((e) => e.status === "pending");
  const replied = enquiries.filter((e) => e.status !== "pending");

  return (
    <div className="min-h-screen bg-gray-50 p-5">
      <div className="max-w-5xl mx-auto">

        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <MessageCircle size={20} className="text-violet-500" />
            Talk to Teacher
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Ask doubts, discuss studies, or report issues directly to your teacher.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-5">

          {/* LEFT — New Enquiry form */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-2xl p-5 sticky top-5">

              <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-violet-500 rounded-full inline-block" />
                New Enquiry
              </h2>

              <div className="space-y-3">

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Select Teacher</label>
                  <div className="relative">
                    <select
                      value={teacherId}
                      onChange={(e) => setTeacherId(e.target.value)}
                      className={`${inp} appearance-none pr-8`}
                    >
                      <option value="">Choose a teacher…</option>
                      {teachers.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Subject</label>
                  <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Doubt in Chapter 3"
                    className={inp}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    placeholder="Write your message here…"
                    className={`${inp} resize-none`}
                  />
                </div>

                <button
                  onClick={handleSend}
                  disabled={sending}
                  className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
                >
                  <Send size={15} />
                  {sending ? "Sending…" : "Send Message"}
                </button>

              </div>

              {/* stats */}
              <div className="grid grid-cols-2 gap-2 mt-5 pt-5 border-t border-gray-100">
                <div className="bg-amber-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-amber-600">{pending.length}</p>
                  <p className="text-xs text-amber-500 mt-0.5">Pending</p>
                </div>
                <div className="bg-green-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-green-600">{replied.length}</p>
                  <p className="text-xs text-green-500 mt-0.5">Replied</p>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT — Enquiry list */}
          <div className="lg:col-span-3 space-y-3">

            {enquiries.length === 0 && (
              <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
                <Inbox size={36} className="text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-400">No enquiries sent yet.</p>
              </div>
            )}

            {enquiries.map((item) => {
              const isPending = item.status === "pending";
              return (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-sm transition-shadow"
                >

                  {/* top row */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                        <User size={16} className="text-violet-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{item.teacherName}</p>
                        <p className="text-xs text-violet-500 font-medium">{item.subject}</p>
                      </div>
                    </div>

                    {isPending ? (
                      <span className="flex items-center gap-1 bg-amber-50 text-amber-600 border border-amber-200 text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap">
                        <Clock size={11} /> Pending
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 bg-green-50 text-green-600 border border-green-200 text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap">
                        <CheckCircle2 size={11} /> Replied
                      </span>
                    )}
                  </div>

                  {/* student message */}
                  <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-600 leading-relaxed">
                    {item.message}
                  </div>

                  {/* teacher reply */}
                  {item.reply && (
                    <div className="mt-3 bg-violet-50 border border-violet-100 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <MessageCircle size={13} className="text-violet-500" />
                        <span className="text-xs font-semibold text-violet-600">Teacher Reply</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{item.reply}</p>
                    </div>
                  )}

                </div>
              );
            })}

          </div>

        </div>
      </div>
    </div>
  );
}
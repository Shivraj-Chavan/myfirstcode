// src/pages/teacher/TeacherEnquiries.jsx

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Send, User, MessageCircle, Inbox, CheckCircle2, Clock, Search } from "lucide-react";
import ENDPOINT from "../../lib/endpoints";

export default function TeacherEnquiries() {

  const [data,     setData]     = useState([]);
  const [reply,    setReply]    = useState({});
  const [sending,  setSending]  = useState({});
  const [tab,      setTab]      = useState("all");   // all | pending | replied
  const [search,   setSearch]   = useState("");

  const token      = localStorage.getItem("token");
  const authConfig = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(ENDPOINT.GET_TEACHER_ENQUIRIES, authConfig);
      setData(res.data.enquiries || []);
    } catch (err) { console.error(err); }
  };

  const handleReply = async (id) => {
    if (!reply[id]?.trim()) return alert("Write a reply first.");
    try {
      setSending((p) => ({ ...p, [id]: true }));
      await axios.put(`${ENDPOINT.REPLY_ENQUIRY}/${id}`, { reply: reply[id] }, authConfig);
      setReply((p) => ({ ...p, [id]: "" }));
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to send reply.");
    } finally {
      setSending((p) => ({ ...p, [id]: false }));
    }
  };

  // ── filter + search ──────────────────────────────────
  const filtered = useMemo(() => {
    let list = data;
    if (tab === "pending") list = list.filter((e) => !e.reply);
    if (tab === "replied") list = list.filter((e) =>  e.reply);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.studentName?.toLowerCase().includes(q) ||
          e.subject?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [data, tab, search]);

  const pendingCount = data.filter((e) => !e.reply).length;
  const repliedCount = data.filter((e) =>  e.reply).length;

  const inp = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 bg-white transition-colors resize-none";

  return (
    <div className="min-h-screen bg-gray-50 p-5">
      <div className="max-w-3xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-5">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <MessageCircle size={20} className="text-violet-500" />
            Student Enquiries
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">Communicate and reply to your students' questions.</p>
        </div>

        {/* ── Stats + filter bar ── */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">

          {/* tabs */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            {[
              { key:"all",     label:`All (${data.length})` },
              { key:"pending", label:`Pending (${pendingCount})` },
              { key:"replied", label:`Replied (${repliedCount})` },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                  tab === key
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student or subject…"
              className="border border-gray-200 rounded-xl pl-8 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 w-56"
            />
          </div>

        </div>

        {/* ── Empty state ── */}
        {filtered.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
            <Inbox size={36} className="text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-400">
              {search ? "No enquiries match your search." : "No enquiries here."}
            </p>
          </div>
        )}

        {/* ── Enquiry list ── */}
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-sm transition-shadow"
            >

              {/* student info + status */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                    <User size={15} className="text-violet-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{item.studentName}</p>
                    <p className="text-xs text-violet-500 font-medium">{item.subject}</p>
                  </div>
                </div>

                {item.reply ? (
                  <span className="flex items-center gap-1 bg-green-50 text-green-600 border border-green-200 text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap">
                    <CheckCircle2 size={11} /> Replied
                  </span>
                ) : (
                  <span className="flex items-center gap-1 bg-amber-50 text-amber-600 border border-amber-200 text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap">
                    <Clock size={11} /> Pending
                  </span>
                )}
              </div>

              {/* student message */}
              <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-600 leading-relaxed mb-3">
                {item.message}
              </div>

              {/* replied: show reply */}
              {item.reply ? (
                <div className="bg-violet-50 border border-violet-100 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <MessageCircle size={13} className="text-violet-500" />
                    <span className="text-xs font-semibold text-violet-600">Your Reply</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{item.reply}</p>
                </div>
              ) : (
                /* not replied: reply box */
                <div className="space-y-2">
                  <textarea
                    rows={3}
                    placeholder="Write your reply…"
                    value={reply[item.id] || ""}
                    onChange={(e) => setReply((p) => ({ ...p, [item.id]: e.target.value }))}
                    className={inp}
                  />
                  <button
                    onClick={() => handleReply(item.id)}
                    disabled={sending[item.id]}
                    className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-xs font-medium px-4 py-2 rounded-xl transition-colors"
                  >
                    <Send size={13} />
                    {sending[item.id] ? "Sending…" : "Send Reply"}
                  </button>
                </div>
              )}

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
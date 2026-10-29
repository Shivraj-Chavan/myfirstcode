import { useEffect, useState, useMemo } from "react";
import { Search, Eye } from "lucide-react";
import api from "../../api/axios.js";
import PageHeader from "../../components/shared/PageHeader.jsx";
import Loader from "../../components/ui/Loader.jsx";
import DataTable from "../../components/ui/DataTable.jsx";
import Badge from "../../components/ui/Badge.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Modal from "../../components/ui/Modal.jsx";
import { REFERRAL_ENDPOINTS } from "../../api/referralEndpoints.js";

const PAGE_SIZE = 10;

const STATUS_OPTIONS = [
  "LEAD_ADDED", "PENDING_REVIEW", "ENQUIRY", "COUNSELLING", "INTERESTED",
  "ADMISSION_APPROVED", "PAYMENT_PENDING", "PAYMENT_SUBMITTED", "PAYMENT_VERIFICATION",
  "ENROLLED", "COMPLETED", "REJECTED", "CANCELLED", "NO_RESPONSE",
];
const PAYMENT_OPTIONS = ["PENDING", "UNDER_VERIFICATION", "VERIFIED", "REJECTED"];
const statusTone = (s) =>
  ["ENROLLED", "COMPLETED"].includes(s) ? "mint" :
  ["REJECTED", "CANCELLED", "NO_RESPONSE"].includes(s) ? "coral" :
  "amber";
const paymentTone = (s) => (s === "VERIFIED" ? "mint" : s === "REJECTED" ? "coral" : "amber");

export default function AdminReferralStudents() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState(null);
  const [savingStatus, setSavingStatus] = useState(false);

  const load = () => {
    setLoading(true);
    api.get(REFERRAL_ENDPOINTS.allReferralStudents).then((res) => setRows(res.data?.data || [])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const changeStatus = async (lead, field, value) => {
    setSavingStatus(true);
    try {
      const payload = field === "status" ? { status: value } : { paymentStatus: value };
      await api.put(REFERRAL_ENDPOINTS.updateLeadStatus(lead.id), payload);
      // update in place so the table + open modal reflect it immediately
      setRows((prev) => prev.map((r) => (r.id === lead.id ? { ...r, [field === "status" ? "status" : "payment_status"]: value } : r)));
      setViewing((v) => (v && v.id === lead.id ? { ...v, [field === "status" ? "status" : "payment_status"]: value } : v));
    } catch (err) {
      alert(err?.response?.data?.message || "Couldn't update status.");
    } finally {
      setSavingStatus(false);
    }
  };

  const courses = useMemo(() => ["All", ...new Set(rows.map((r) => r.interested_course).filter(Boolean))], [rows]);
  const statuses = useMemo(() => ["All", ...new Set(rows.map((r) => r.status).filter(Boolean))], [rows]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const matchesCourse = courseFilter === "All" || r.interested_course === courseFilter;
      const matchesStatus = statusFilter === "All" || r.status === statusFilter;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        r.student_name?.toLowerCase().includes(q) ||
        r.student_mobile?.includes(q) ||
        r.referralName?.toLowerCase().includes(q) ||
        String(r.id).includes(q);
      return matchesCourse && matchesStatus && matchesSearch;
    });
  }, [rows, search, courseFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) return <Loader label="Loading referral students" />;

  return (
    <div>
      <PageHeader eyebrow="admin/referral-students" title="Referred Students" subtitle="Every student added by every referral partner." />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-muted" />
          <input
            className="input pl-9"
            placeholder="Search name, mobile, lead ID, partner..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="flex gap-2">
          <select className="input w-auto" value={courseFilter} onChange={(e) => { setCourseFilter(e.target.value); setPage(1); }}>
            {courses.map((c) => <option key={c} value={c}>{c === "All" ? "All courses" : c}</option>)}
          </select>
          <select className="input w-auto" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
            {statuses.map((s) => <option key={s} value={s}>{s === "All" ? "All statuses" : s}</option>)}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No referred students match" />
      ) : (
        <>
          <DataTable
            rows={paged}
            columns={[
              { key: "id", header: "Lead ID", render: (r) => `#${r.id}` },
              { key: "student_name", header: "Student" },
              { key: "referralName", header: "Referred By" },
              { key: "interested_course", header: "Course" },
              { key: "student_mobile", header: "Mobile" },
            {
                key: "status",
                header: "Status",
                render: (r) => (
                  <select
                    className="rounded-lg border border-slate-faint/60 bg-white px-2 py-1 text-xs font-semibold text-ink"
                    value={r.status}
                    onChange={(e) => changeStatus(r, "status", e.target.value)}
                    disabled={savingStatus}
                  >
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replaceAll("_", " ")}</option>)}
                  </select>
                ),
              },
              {
                key: "payment_status",
                header: "Payment",
                render: (r) => (
                  <select
                    className="rounded-lg border border-slate-faint/60 bg-white px-2 py-1 text-xs font-semibold text-ink"
                    value={r.payment_status}
                    onChange={(e) => changeStatus(r, "paymentStatus", e.target.value)}
                    disabled={savingStatus}
                  >
                    {PAYMENT_OPTIONS.map((s) => <option key={s} value={s}>{s.replaceAll("_", " ")}</option>)}
                  </select>
                ),
              },
              {
                key: "actions",
                header: "",
                render: (r) => <button className="btn-ghost btn-sm" onClick={() => setViewing(r)}><Eye size={13} /> View</button>,
              },
            ]}
          />

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm">
              <p className="text-slate-muted">Page {page} of {totalPages} · {filtered.length} students</p>
              <div className="flex gap-1.5">
                <button className="btn-secondary btn-sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>← Prev</button>
                <button className="btn-secondary btn-sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next →</button>
              </div>
            </div>
          )}
        </>
      )}

      <Modal open={!!viewing} onClose={() => setViewing(null)} title={viewing?.student_name}>
        {viewing && (
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div><p className="label mb-0.5">Lead ID</p><p className="text-ink">#{viewing.id}</p></div>
              <div><p className="label mb-0.5">Referred By</p><p className="text-ink">{viewing.referralName}</p></div>
              <div><p className="label mb-0.5">Standard</p><p className="text-ink">{viewing.standard}</p></div>
              <div><p className="label mb-0.5">School</p><p className="text-ink">{viewing.school_name}</p></div>
              <div><p className="label mb-0.5">Course</p><p className="text-ink">{viewing.interested_course}</p></div>
              <div><p className="label mb-0.5">Batch</p><p className="text-ink">{viewing.preferred_batch || "—"}</p></div>
              <div><p className="label mb-0.5">Student Mobile</p><p className="text-ink">{viewing.student_mobile}</p></div>
              <div><p className="label mb-0.5">Parent Mobile</p><p className="text-ink">{viewing.parent_mobile}</p></div>
            </div>
  {viewing.remarks && <div><p className="label mb-0.5">Remarks</p><p className="text-ink">{viewing.remarks}</p></div>}

            <div className="grid grid-cols-2 gap-3 border-t border-ink/5 pt-3">
              <div>
                <p className="label mb-1">Status</p>
                <select
                  className="input"
                  value={viewing.status}
                  onChange={(e) => changeStatus(viewing, "status", e.target.value)}
                  disabled={savingStatus}
                >
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replaceAll("_", " ")}</option>)}
                </select>
              </div>
              <div>
                <p className="label mb-1">Payment Status</p>
                <select
                  className="input"
                  value={viewing.payment_status}
                  onChange={(e) => changeStatus(viewing, "paymentStatus", e.target.value)}
                  disabled={savingStatus}
                >
                  {PAYMENT_OPTIONS.map((s) => <option key={s} value={s}>{s.replaceAll("_", " ")}</option>)}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone={statusTone(viewing.status)}>{viewing.status.replaceAll("_", " ")}</Badge>
              <Badge tone={paymentTone(viewing.payment_status)}>{viewing.payment_status.replaceAll("_", " ")}</Badge>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
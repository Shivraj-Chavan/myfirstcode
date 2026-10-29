import { useEffect, useState, useMemo } from "react";
import { Check, X, GraduationCap, Search, Eye } from "lucide-react";
import api from "../../api/axios.js";
import PageHeader from "../../components/shared/PageHeader.jsx";
import Loader from "../../components/ui/Loader.jsx";
import DataTable from "../../components/ui/DataTable.jsx";
import Badge from "../../components/ui/Badge.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Modal from "../../components/ui/Modal.jsx";
import { REFERRAL_ENDPOINTS } from "../../api/referralEndpoints.js";

const STATUS_FILTERS = ["All", "PENDING", "APPROVED", "REJECTED"];
const PAGE_SIZE = 10;

export default function AdminReferralPartners() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);

  const load = () => {
    setLoading(true);
    api.get(REFERRAL_ENDPOINTS.partners).then((res) => setRows(res.data?.data || [])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const approve = async (p) => { await api.put(REFERRAL_ENDPOINTS.approvePartner(p.id)); load(); setViewing(null); };
  const reject = async (p) => { if (confirm(`Reject "${p.institute_name}"?`)) { await api.put(REFERRAL_ENDPOINTS.rejectPartner(p.id)); load(); setViewing(null); } };

  const openDetails = async (p) => {
    setViewing({ id: p.id }); // show modal immediately with a loader
    setViewLoading(true);
    try {
      const { data } = await api.get(REFERRAL_ENDPOINTS.partner(p.id));
      setViewing(data.data);
    } finally {
      setViewLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const matchesStatus = statusFilter === "All" || r.status === statusFilter;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        r.institute_name?.toLowerCase().includes(q) ||
        r.contact_person?.toLowerCase().includes(q) ||
        r.email?.toLowerCase().includes(q) ||
        r.mobile?.includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [rows, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) return <Loader label="Loading referral partners" />;

  const pending = rows.filter((r) => r.status === "PENDING");

  return (
    <div>
      <PageHeader eyebrow="admin/referral-partners" title="Referral Partners" subtitle="Approve institutes, coaching classes & consultants." />

      {pending.length > 0 && (
        <div className="mb-6">
          <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-wide text-amber-dark">{pending.length} pending approval</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {pending.map((p) => (
              <div key={p.id} className="card flex items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">{p.institute_name}</p>
                  <p className="truncate text-xs text-slate-muted">{p.contact_person} · {p.email}</p>
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <button onClick={() => approve(p)} className="btn-primary btn-sm"><Check size={13} /></button>
                  <button onClick={() => reject(p)} className="btn-ghost btn-sm text-coral hover:bg-coral-light"><X size={13} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-muted" />
          <input
            className="input pl-9"
            placeholder="Search institute, contact, email, mobile..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="flex gap-1 rounded-xl border border-slate-faint/60 bg-white p-1">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${statusFilter === s ? "bg-brand text-white" : "text-slate-muted hover:text-ink"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={GraduationCap} title="No referral partners match" />
      ) : (
        <>
          <DataTable
            rows={paged}
            columns={[
              { key: "institute_name", header: "Institute" },
              { key: "contact_person", header: "Contact" },
              { key: "mobile", header: "Mobile" },
              { key: "email", header: "Email" },
              { key: "status", header: "Status", render: (r) => <Badge tone={r.status === "APPROVED" ? "mint" : r.status === "REJECTED" ? "coral" : "amber"}>{r.status}</Badge> },
              {
                key: "actions",
                header: "",
                render: (r) => (
                  <button className="btn-ghost btn-sm" onClick={() => openDetails(r)}><Eye size={13} /> View</button>
                ),
              },
            ]}
          />

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm">
              <p className="text-slate-muted">Page {page} of {totalPages} · {filtered.length} partners</p>
              <div className="flex gap-1.5">
                <button className="btn-secondary btn-sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>← Prev</button>
                <button className="btn-secondary btn-sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next →</button>
              </div>
            </div>
          )}
        </>
      )}

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Referral Partner Details">
        {viewLoading ? (
          <Loader label="Loading details" />
        ) : viewing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="label mb-0.5">Institute</p><p className="text-ink">{viewing.institute_name}</p></div>
              <div><p className="label mb-0.5">Contact Person</p><p className="text-ink">{viewing.contact_person}</p></div>
              <div><p className="label mb-0.5">Mobile</p><p className="text-ink">{viewing.mobile}</p></div>
              <div><p className="label mb-0.5">Email</p><p className="text-ink">{viewing.email}</p></div>
              <div><p className="label mb-0.5">City</p><p className="text-ink">{viewing.city || "—"}</p></div>
              <div><p className="label mb-0.5">State</p><p className="text-ink">{viewing.state || "—"}</p></div>
              <div><p className="label mb-0.5">PIN Code</p><p className="text-ink">{viewing.pincode || "—"}</p></div>
              <div><p className="label mb-0.5">GST No.</p><p className="text-ink">{viewing.gst_number || "—"}</p></div>
              <div><p className="label mb-0.5">PAN No.</p><p className="text-ink">{viewing.pan_number || "—"}</p></div>
              <div><p className="label mb-0.5">Website</p><p className="text-ink">{viewing.website || "—"}</p></div>
            </div>
            <div><p className="label mb-0.5">Address</p><p className="text-sm text-ink">{viewing.address || "—"}</p></div>
            <div className="flex items-center justify-between border-t border-ink/5 pt-4">
              <Badge tone={viewing.status === "APPROVED" ? "mint" : viewing.status === "REJECTED" ? "coral" : "amber"}>{viewing.status}</Badge>
              {viewing.status === "PENDING" && (
                <div className="flex gap-2">
                  <button className="btn-primary btn-sm" onClick={() => approve(viewing)}><Check size={13} /> Approve</button>
                  <button className="btn-danger btn-sm" onClick={() => reject(viewing)}><X size={13} /> Reject</button>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
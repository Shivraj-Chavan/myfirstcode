import { useEffect, useState } from "react";
import { Check, Trash2, GraduationCap } from "lucide-react";
import api from "../../api/axios.js";
import { ENDPOINTS } from "../../api/endpoints.js";
import PageHeader from "../../components/shared/PageHeader.jsx";
import Loader from "../../components/ui/Loader.jsx";
import DataTable from "../../components/ui/DataTable.jsx";
import Badge from "../../components/ui/Badge.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";

export default function AdminTeachers() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get(ENDPOINTS.teachers).then((res) => setRows(res.data?.data || [])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const approve = async (t) => {
    await api.put(ENDPOINTS.approveTeacher(t.id));
    load();
  };

  const remove = async (t) => {
    if (!confirm(`Remove "${t.name}"?`)) return;
    await api.delete(ENDPOINTS.deleteTeacher(t.id));
    load();
  };

  if (loading) return <Loader label="Loading teachers" />;

  const pending = rows.filter((r) => r.status === "PENDING");

  return (
    <div>
      <PageHeader eyebrow="admin/teachers" title="Teachers" subtitle="Approve new teacher sign-ups and manage existing ones." />

      {pending.length > 0 && (
        <div className="mb-6">
          <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-wide text-amber-dark">
            {pending.length} waiting for approval
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {pending.map((t) => (
              <div key={t.id} className="card flex items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">{t.name}</p>
                  <p className="truncate text-xs text-slate-muted">{t.email}</p>
                </div>
                <button onClick={() => approve(t)} className="btn-primary btn-sm shrink-0"><Check size={13} /> Approve</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {rows.length === 0 ? (
        <EmptyState icon={GraduationCap} title="No teachers yet" />
      ) : (
        <DataTable
          rows={rows}
          columns={[
            { key: "name", header: "Name" },
            { key: "email", header: "Email" },
            { key: "status", header: "Status", render: (r) => <Badge tone={r.status === "APPROVED" ? "mint" : "amber"}>{r.status}</Badge> },
            { key: "verified", header: "Verified", render: (r) => <Badge tone={r.verified ? "mint" : "neutral"}>{r.verified ? "Yes" : "No"}</Badge> },
            {
              key: "actions",
              header: "",
              render: (r) => (
                <div className="flex items-center gap-1.5">
                  {r.status !== "APPROVED" && (
                    <button className="btn-ghost btn-sm" onClick={() => approve(r)}><Check size={13} /> Approve</button>
                  )}
                  <button className="btn-ghost btn-sm text-coral hover:bg-coral-light" onClick={() => remove(r)}><Trash2 size={13} /></button>
                </div>
              ),
            },
          ]}
        />
      )}
    </div>
  );
}

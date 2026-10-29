import { useState, useEffect } from "react";
import EmptyState from "./EmptyState.jsx";
import { Inbox } from "lucide-react";

// columns: [{ key, header, render?(row) }]
// pageSize: pass 0/false to disable pagination for a specific table.
export default function DataTable({ columns, rows, emptyTitle = "Nothing here yet", emptySubtitle, rowKey = "id", pageSize = 10 }) {
  const [page, setPage] = useState(1);

  // Reset to page 1 whenever the underlying data set changes (e.g. a
  // search/filter narrows the rows) so you're never stuck on an
  // out-of-range page showing nothing.
  useEffect(() => {
    setPage(1);
  }, [rows]);

  if (!rows || rows.length === 0) {
    return <EmptyState icon={Inbox} title={emptyTitle} subtitle={emptySubtitle} />;
  }

  const paginated = pageSize && rows.length > pageSize;
  const totalPages = paginated ? Math.max(1, Math.ceil(rows.length / pageSize)) : 1;
  const currentPage = Math.min(page, totalPages);
  const visibleRows = paginated ? rows.slice((currentPage - 1) * pageSize, currentPage * pageSize) : rows;

  return (
    <div>
      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink/5 bg-ink/[0.02]">
              {columns.map((c) => (
                <th key={c.key} className="whitespace-nowrap px-5 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-wide text-slate-muted">
                  {c.header} 
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row, i) => (
              <tr key={row[rowKey] ?? i} className="border-b border-ink/5 last:border-0 hover:bg-brand-light/30 transition-colors">
                {columns.map((c) => {
                  const value = row[c.key];
                  const safeValue =
                    value && typeof value === "object" && !Array.isArray(value)
                      ? value.name ?? value.title ?? value.label ?? JSON.stringify(value)
                      : value;
                  return (
                    <td key={c.key} className="whitespace-nowrap px-5 py-3.5 text-ink">
                      {c.render ? c.render(row) : safeValue}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {paginated && (
        <div className="mt-3 flex items-center justify-between text-sm">
          <p className="text-slate-muted">
            Page {currentPage} of {totalPages} · {rows.length} total
          </p>
          <div className="flex gap-1.5">
            <button className="btn-secondary btn-sm" disabled={currentPage === 1} onClick={() => setPage((p) => p - 1)}>
              ← Prev
            </button>
            <button className="btn-secondary btn-sm" disabled={currentPage === totalPages} onClick={() => setPage((p) => p + 1)}>
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
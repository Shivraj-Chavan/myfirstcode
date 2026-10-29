export default function PageHeader({ eyebrow, title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="eyebrow mb-1.5">{eyebrow}</p>}
        <h2 className="font-display text-2xl font-bold text-ink">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-slate-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

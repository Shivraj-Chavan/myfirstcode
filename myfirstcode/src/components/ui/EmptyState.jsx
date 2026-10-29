export default function EmptyState({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl2 border border-dashed border-slate-faint bg-white/60 py-14 px-6 text-center">
      {Icon && (
        <div className="grid h-12 w-12 place-items-center rounded-full bg-brand-light text-brand">
          <Icon size={22} />
        </div>
      )}
      <div>
        <p className="font-display font-semibold text-ink">{title}</p>
        {subtitle && <p className="mt-1 max-w-sm text-sm text-slate-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

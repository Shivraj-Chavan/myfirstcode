export default function StatCard({ icon: Icon, label, value, tone = "brand" }) {
  const tones = {
    brand: "bg-brand-light text-brand",
    mint: "bg-mint-light text-mint-dark",
    amber: "bg-amber-light text-amber-dark",
    coral: "bg-coral-light text-coral-dark",
  };
  return (
    <div className="card flex items-center gap-4 p-5">
      <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${tones[tone]}`}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-medium text-slate-muted">{label}</p>
        <p className="font-display text-2xl font-bold text-ink">{value}</p>
      </div>
    </div>
  );
}

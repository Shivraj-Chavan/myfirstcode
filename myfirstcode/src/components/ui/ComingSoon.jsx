import { Construction } from "lucide-react";

export default function ComingSoon({ title, note }) {
  return (
    <div className="card flex flex-col items-center justify-center gap-3 py-20 px-6 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-full bg-amber-light text-amber-dark">
        <Construction size={24} />
      </div>
      <h2 className="font-display text-xl font-bold text-ink">{title}</h2>
      <p className="max-w-md text-sm text-slate-muted">
        {note || "This screen is designed and ready to wire up — it just needs a backend route to talk to."}
      </p>
    </div>
  );
}

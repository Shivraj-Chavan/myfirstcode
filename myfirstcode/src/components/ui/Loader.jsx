export default function Loader({ label = "Loading" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-muted">
      <div className="flex gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-brand animate-bounce [animation-delay:-0.3s]" />
        <span className="h-2.5 w-2.5 rounded-full bg-brand animate-bounce [animation-delay:-0.15s]" />
        <span className="h-2.5 w-2.5 rounded-full bg-brand animate-bounce" />
      </div>
      <p className="font-mono text-xs">{label}...</p>
    </div>
  );
}

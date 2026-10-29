const TONES = {
  neutral: "bg-ink/5 text-slate",
  brand: "bg-brand-light text-brand",
  mint: "bg-mint-light text-mint-dark",
  amber: "bg-amber-light text-amber-dark",
  coral: "bg-coral-light text-coral-dark",
};

export default function Badge({ children, tone = "neutral" }) {
  return <span className={`badge ${TONES[tone]}`}>{children}</span>;
}

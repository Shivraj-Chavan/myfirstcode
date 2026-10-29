const COLORS = ["#5B5FEF", "#12D992", "#FFB627", "#FF5C7A", "#EDEEFF"];

export default function Confetti({ count = 60 }) {
  const pieces = Array.from({ length: count }, (_, i) => {
    const left = Math.random() * 100;
    const delay = Math.random() * 0.6;
    const duration = 2.2 + Math.random() * 1.6;
    const size = 6 + Math.random() * 6;
    const color = COLORS[i % COLORS.length];
    const rounded = Math.random() > 0.5;
    return { id: i, left, delay, duration, size, color, rounded };
  });

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          style={{
              position: "absolute",
            left: `${p.left}%`,
            top: "-40px",
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.rounded ? "9999px" : "2px",
            animation: `confetti-fall ${p.duration}s ease-in ${p.delay}s forwards`,
          }}
        />
      ))}
    </div>
  );
}
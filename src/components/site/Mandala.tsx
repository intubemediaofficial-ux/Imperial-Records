export default function Mandala({ className = "" }: { className?: string }) {
  const petals = Array.from({ length: 16 }, (_, i) => i * 22.5);
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden fill="none" stroke="currentColor">
      <circle cx="100" cy="100" r="96" strokeWidth="0.6" />
      <circle cx="100" cy="100" r="80" strokeWidth="0.6" strokeDasharray="2 4" />
      <circle cx="100" cy="100" r="34" strokeWidth="0.8" />
      <circle cx="100" cy="100" r="18" strokeWidth="0.8" />
      {petals.map((a) => (
        <g key={a} transform={`rotate(${a} 100 100)`}>
          <path d="M100 66 C 110 48, 110 30, 100 12 C 90 30, 90 48, 100 66 Z" strokeWidth="0.7" />
          <circle cx="100" cy="8" r="2" strokeWidth="0.6" />
        </g>
      ))}
    </svg>
  );
}

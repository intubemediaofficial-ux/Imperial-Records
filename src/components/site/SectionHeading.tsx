export default function SectionHeading({ eyebrow, title, sub, center = true }: { eyebrow?: string; title: string; sub?: string; center?: boolean }) {
  return (
    <div className={`mb-10 ${center ? "mx-auto max-w-3xl text-center" : ""}`}>
      {eyebrow && (
        <p className={`mb-3 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-saffron ${center ? "justify-center" : ""}`}>
          <span className="h-px w-8 bg-saffron/60" /> {eyebrow} <span className="h-px w-8 bg-saffron/60" />
        </p>
      )}
      <h2 className="font-display text-3xl font-bold leading-tight text-gold-gradient sm:text-4xl md:text-5xl">{title}</h2>
      {sub && <p className="mt-4 text-base text-muted sm:text-lg">{sub}</p>}
    </div>
  );
}

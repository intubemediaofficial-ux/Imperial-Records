import Mandala from "./Mandala";

export default function PageHero({ eyebrow, title, sub, image }: { eyebrow: string; title: string; sub?: string; image?: string }) {
  return (
    <section className="relative overflow-hidden border-b border-gold/15 pt-32 pb-16 sm:pt-40 sm:pb-20">
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-20 blur-sm" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-deep/90 to-ink" />
      <div className="pattern-mandala absolute inset-0" />
      <Mandala className="animate-spin-slow absolute -right-24 -top-24 h-96 w-96 text-gold/15" />
      <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-saffron">{eyebrow}</p>
        <h1 className="font-display text-4xl font-bold text-gold-gradient sm:text-5xl md:text-6xl">{title}</h1>
        {sub && <p className="mx-auto mt-5 max-w-2xl text-base text-muted sm:text-lg">{sub}</p>}
        <div className="divider-gold mx-auto mt-8 w-48" />
      </div>
    </section>
  );
}

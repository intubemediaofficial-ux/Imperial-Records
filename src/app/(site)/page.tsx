import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Quote } from "lucide-react";
import HeroSlider from "@/components/site/HeroSlider";
import ReleaseCard from "@/components/site/ReleaseCard";
import SectionHeading from "@/components/site/SectionHeading";
import ServiceIcon from "@/components/site/ServiceIcon";
import Mandala from "@/components/site/Mandala";
import CtaBand from "@/components/site/CtaBand";
import { pageMetadata } from "@/lib/seo";
import { getContent } from "@/lib/store";

export const dynamic = "force-dynamic";
export function generateMetadata(): Promise<Metadata> {
  return pageMetadata("home", "/");
}

export default async function HomePage() {
  const c = await getContent();
  const t = c.texts;
  const cats = c.categories.filter((x) => x.published);
  const catName = Object.fromEntries(cats.map((x) => [x.slug, x.name]));
  const featured = c.releases.filter((r) => r.featured);
  const latest = (featured.length ? featured : c.releases).slice(0, 8);
  const countBy = (slug: string) => c.releases.filter((r) => r.category === slug).length;
  const artists = c.artists.filter((a) => a.featured).slice(0, 4);

  return (
    <>
      <HeroSlider banners={c.banners} ctaButton={t.ctaButton} />

      <div className="relative z-10 -mt-px overflow-hidden border-y border-gold/25 bg-deep py-4">
        <div className="animate-marquee flex w-max gap-12 whitespace-nowrap">
          {[...c.mantras, ...c.mantras, ...c.mantras, ...c.mantras].map((m, k) => (
            <span key={k} className="font-hindi flex items-center gap-12 text-xl text-gold-light/90">{m}<span className="text-saffron">✦</span></span>
          ))}
        </div>
      </div>

      <section className="bg-royal relative py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 sm:px-6 md:grid-cols-4">
          {c.stats.map((s) => (
            <div key={s.label} className="card-royal rounded-2xl p-6 text-center">
              <p className="font-display text-4xl font-bold text-gold-gradient md:text-5xl">{s.value}</p>
              <p className="mt-2 text-sm text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative py-20">
        <div className="pattern-mandala absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="भक्ति संग्रह" title={t.homeCategoriesTitle} sub={t.homeCategoriesSub} />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {cats.map((cat) => (
              <Link key={cat.slug} href={`/music/${cat.slug}`} className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-gold/15">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cat.image} alt={cat.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                <div className="absolute inset-0" style={{ background: `linear-gradient(to top, #031413 15%, ${cat.color}55 70%, transparent)` }} />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="font-hindi text-lg text-gold-light">{cat.hindi}</p>
                  <p className="font-semibold text-cream">{cat.name}</p>
                  <p className="mt-1 text-xs text-muted">{countBy(cat.slug)} songs</p>
                </div>
                <span className="absolute right-3 top-3 flex h-9 w-9 translate-x-2 items-center justify-center rounded-full bg-gold-gradient text-ink opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100"><ArrowRight size={16} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-royal py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="नई रिलीज़" title={t.homeReleasesTitle} sub={t.homeReleasesSub} center={false} />
            <Link href="/music" className="mb-10 inline-flex items-center gap-2 rounded-full border border-gold/30 px-5 py-2.5 text-sm font-semibold text-gold hover:bg-gold/10">View all <ArrowRight size={16} /></Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {latest.map((r) => <ReleaseCard key={r.youtubeId + r.title} release={r} categoryName={catName[r.category]} />)}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-20">
        <Mandala className="animate-spin-slow absolute -left-40 top-10 h-[520px] w-[520px] text-gold/10" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gold-gradient opacity-20 blur-2xl" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.about.image} alt={c.settings.companyName} className="relative aspect-[4/5] w-full rounded-[2rem] border border-gold/30 object-cover" />
            <div className="card-royal absolute -bottom-6 -right-4 rounded-2xl px-5 py-4 shadow-xl sm:-right-8">
              <p className="font-display text-3xl font-bold text-gold-gradient">{c.stats[0]?.value}</p>
              <p className="text-xs text-muted">{c.stats[0]?.label}</p>
            </div>
          </div>
          <div>
            <SectionHeading eyebrow={c.about.eyebrow} title={c.about.heading} center={false} />
            <p className="-mt-4 text-lg leading-relaxed text-cream/80">{c.about.intro}</p>
            <p className="mt-4 leading-relaxed text-muted">{c.about.paragraphs[0]}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {["Devotional-first label", "150+ platforms", "Studio & video production", "YouTube Content ID"].map((x) => (
                <p key={x} className="flex items-center gap-2 text-sm text-cream/85"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/15 text-gold"><Check size={14} /></span>{x}</p>
              ))}
            </div>
            <Link href="/about" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold-gradient px-6 py-3 font-semibold text-ink">Know More <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      <section className="bg-royal py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="सेवाएं" title={t.homeServicesTitle} sub={t.homeServicesSub} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {c.services.map((s) => (
              <Link key={s.slug} href={`/services#${s.slug}`} className="card-royal group rounded-2xl p-6 transition hover:-translate-y-1">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10 text-gold transition group-hover:bg-gold-gradient group-hover:text-ink"><ServiceIcon name={s.icon} /></span>
                <h3 className="mt-5 font-display text-lg font-semibold text-cream">{s.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {artists.length > 0 && (
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHeading eyebrow="कलाकार" title={t.homeArtistsTitle} sub={t.homeArtistsSub} />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {artists.map((a) => (
                <Link key={a.slug} href={`/artists/${a.slug}`} className="group relative aspect-[4/5] overflow-hidden rounded-3xl border border-gold/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={a.image} alt={a.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-saffron">{a.role}</p>
                    <h3 className="mt-1 font-display text-2xl font-bold text-gold-gradient">{a.name}</h3>
                    <p className="mt-1 text-sm text-muted">{a.genre}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-royal py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="हर प्लेटफ़ॉर्म पर" title={t.homePlatformsTitle} sub={t.homePlatformsSub} />
          <div className="flex flex-wrap justify-center gap-3">
            {c.platforms.map((p) => (
              <a key={p.name} href={p.url || undefined} target="_blank" rel="noopener noreferrer" className="card-royal rounded-full px-5 py-2.5 text-sm text-cream/85 transition hover:text-gold">
                {p.name} <span className="ml-1 text-[10px] uppercase tracking-wider text-muted">{p.type}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="यात्रा" title={t.homeJourneyTitle} center={false} />
            <ol className="relative space-y-6 border-l border-gold/30 pl-8">
              {c.journey.map((j) => (
                <li key={j.year + j.text} className="relative">
                  <span className="absolute -left-[41px] top-1 h-4 w-4 rounded-full border-2 border-gold bg-ink" />
                  <p className="font-display text-lg font-bold text-gold">{j.year}</p>
                  <p className="mt-1 text-muted">{j.text}</p>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <SectionHeading eyebrow="अनुभव" title={t.homeTestimonialsTitle} center={false} />
            <div className="space-y-4">
              {c.testimonials.map((q) => (
                <figure key={q.text} className="card-royal rounded-2xl p-6">
                  <Quote className="text-gold/50" size={26} />
                  <blockquote className="mt-2 text-cream/85">{q.text}</blockquote>
                  <figcaption className="mt-3 text-sm"><b className="text-gold">{q.name}</b> <span className="text-muted">· {q.role}</span></figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaBand title={t.ctaTitle} text={t.ctaText} button={t.ctaButton} />
    </>
  );
}

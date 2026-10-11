import type { Metadata } from "next";
import { Eye, Mail, Phone, Target } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import SectionHeading from "@/components/site/SectionHeading";
import CtaBand from "@/components/site/CtaBand";
import { pageMetadata } from "@/lib/seo";
import { getContent } from "@/lib/store";

export const dynamic = "force-dynamic";
export function generateMetadata(): Promise<Metadata> {
  return pageMetadata("about", "/about");
}

export default async function AboutPage() {
  const c = await getContent();
  const a = c.about;
  return (
    <>
      <PageHero eyebrow={a.eyebrow} title={`About ${c.settings.companyName}`} sub={c.settings.tagline} />
      <section className="mx-auto grid max-w-7xl items-start gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_420px]">
        <div>
          <h2 className="font-display text-3xl font-bold text-gold-gradient sm:text-4xl">{a.heading}</h2>
          <p className="mt-6 text-lg leading-relaxed text-cream/85">{a.intro}</p>
          {a.paragraphs.map((p) => <p key={p} className="mt-4 leading-relaxed text-muted">{p}</p>)}
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={c.settings.logo} alt={c.settings.companyName} className="w-full rounded-[2rem] border border-gold/30 shadow-2xl shadow-gold/10" />
      </section>
      <section className="bg-royal py-16">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 md:grid-cols-2">
          {[{ Icon: Target, t: "Our Mission", d: a.mission }, { Icon: Eye, t: "Our Vision", d: a.vision }].map(({ Icon, t, d }) => (
            <div key={t} className="card-royal rounded-3xl p-8">
              <Icon className="text-gold" size={32} />
              <h3 className="mt-4 font-display text-2xl font-bold text-cream">{t}</h3>
              <p className="mt-3 leading-relaxed text-muted">{d}</p>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-10 grid max-w-6xl grid-cols-2 gap-4 px-4 sm:px-6 md:grid-cols-4">
          {c.stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-gold/15 p-5 text-center">
              <p className="font-display text-3xl font-bold text-gold-gradient">{s.value}</p>
              <p className="mt-1 text-xs text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <SectionHeading eyebrow="यात्रा" title={c.texts.homeJourneyTitle} />
        <div className="grid gap-4 md:grid-cols-4">
          {c.journey.map((j) => (
            <div key={j.year + j.text} className="card-royal rounded-2xl p-6">
              <p className="font-display text-xl font-bold text-gold">{j.year}</p>
              <p className="mt-2 text-sm text-muted">{j.text}</p>
            </div>
          ))}
        </div>
      </section>
      {c.team.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
          <SectionHeading eyebrow="टीम" title="Leadership" />
          <div className="flex flex-wrap justify-center gap-6">
            {c.team.map((m) => (
              <div key={m.name} className="card-royal w-full max-w-xs rounded-3xl p-6 text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {m.image && <img src={m.image} alt={m.name} className="mx-auto h-28 w-28 rounded-full border-2 border-gold/50 object-cover" />}
                <h3 className="mt-4 font-display text-xl font-bold text-cream">{m.name}</h3>
                <p className="text-sm text-saffron">{m.role}</p>
                <div className="mt-4 space-y-1 text-sm text-muted">
                  {m.phone && <a href={`tel:${m.phone.replace(/\s/g, "")}`} className="flex items-center justify-center gap-2 hover:text-gold"><Phone size={14} /> {m.phone}</a>}
                  {m.email && <a href={`mailto:${m.email}`} className="flex items-center justify-center gap-2 break-all hover:text-gold"><Mail size={14} /> {m.email}</a>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      <CtaBand title={c.texts.ctaTitle} text={c.texts.ctaText} button={c.texts.ctaButton} />
    </>
  );
}

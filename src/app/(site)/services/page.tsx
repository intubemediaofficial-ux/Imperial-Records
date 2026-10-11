import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import ServiceIcon from "@/components/site/ServiceIcon";
import CtaBand from "@/components/site/CtaBand";
import { pageMetadata } from "@/lib/seo";
import { getContent } from "@/lib/store";

export const dynamic = "force-dynamic";
export function generateMetadata(): Promise<Metadata> {
  return pageMetadata("services", "/services");
}

export default async function ServicesPage() {
  const c = await getContent();
  return (
    <>
      <PageHero eyebrow="सेवाएं" title={c.texts.servicesTitle} sub={c.texts.servicesSub} />
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:px-6 md:grid-cols-2">
        {c.services.map((s, k) => (
          <article key={s.slug} id={s.slug} className="card-royal scroll-mt-28 rounded-3xl p-8">
            <div className="flex items-start gap-5">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gold-gradient text-ink"><ServiceIcon name={s.icon} size={30} /></span>
              <div>
                <p className="text-xs font-semibold text-saffron">0{k + 1}</p>
                <h2 className="font-display text-2xl font-bold text-cream">{s.name}</h2>
              </div>
            </div>
            <p className="mt-5 leading-relaxed text-muted">{s.description}</p>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {s.points.map((p) => (
                <li key={p} className="flex items-start gap-2 text-sm text-cream/85"><Check size={16} className="mt-0.5 shrink-0 text-gold" /> {p}</li>
              ))}
            </ul>
            <Link href="/contact" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold hover:underline">Enquire now <ArrowRight size={14} /></Link>
          </article>
        ))}
      </section>
      <CtaBand title={c.texts.ctaTitle} text={c.texts.ctaText} button={c.texts.ctaButton} />
    </>
  );
}

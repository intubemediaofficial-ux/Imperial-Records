import type { Metadata } from "next";
import PageHero from "@/components/site/PageHero";
import MusicBrowser from "@/components/site/MusicBrowser";
import CtaBand from "@/components/site/CtaBand";
import { pageMetadata } from "@/lib/seo";
import { getContent } from "@/lib/store";

export const dynamic = "force-dynamic";
export function generateMetadata(): Promise<Metadata> {
  return pageMetadata("music", "/music");
}

export default async function MusicPage() {
  const c = await getContent();
  const cats = c.categories.filter((x) => x.published);
  return (
    <>
      <PageHero eyebrow="भक्ति संगीत" title={c.texts.musicTitle} sub={c.texts.musicSub} image={c.banners[0]?.image} />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <MusicBrowser releases={c.releases} categories={cats} />
      </section>
      <CtaBand title={c.texts.ctaTitle} text={c.texts.ctaText} button={c.texts.ctaButton} />
    </>
  );
}

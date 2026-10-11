import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/site/PageHero";
import MusicBrowser from "@/components/site/MusicBrowser";
import CtaBand from "@/components/site/CtaBand";
import { getContent } from "@/lib/store";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = await getContent();
  const cat = c.categories.find((x) => x.slug === slug && x.published);
  if (!cat) return {};
  const title = `${cat.name} (${cat.hindi}) – Latest ${cat.name} Songs`;
  return { title, description: `${cat.description} Listen to the latest ${cat.name} from ${c.settings.companyName}.`, alternates: { canonical: `/music/${slug}` }, openGraph: { title, images: [cat.image] } };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const c = await getContent();
  const cats = c.categories.filter((x) => x.published);
  const cat = cats.find((x) => x.slug === slug);
  if (!cat) notFound();
  const releases = c.releases.filter((r) => r.category === slug);
  return (
    <>
      <PageHero eyebrow={cat.hindi} title={cat.name} sub={cat.description} image={cat.image} />
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
          <Link href="/music" className="shrink-0 rounded-full border border-gold/20 px-4 py-2 text-sm text-cream/80 hover:text-gold">All</Link>
          {cats.map((x) => (
            <Link key={x.slug} href={`/music/${x.slug}`} className={`shrink-0 rounded-full border px-4 py-2 text-sm ${x.slug === slug ? "border-gold bg-gold-gradient font-semibold text-ink" : "border-gold/20 text-cream/80 hover:text-gold"}`}>{x.name}</Link>
          ))}
        </div>
        <MusicBrowser releases={releases} categories={cats} showFilters={false} />
      </section>
      <CtaBand title={c.texts.ctaTitle} text={c.texts.ctaText} button={c.texts.ctaButton} />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/site/PageHero";
import CtaBand from "@/components/site/CtaBand";
import { pageMetadata } from "@/lib/seo";
import { getContent } from "@/lib/store";

export const dynamic = "force-dynamic";
export function generateMetadata(): Promise<Metadata> {
  return pageMetadata("artists", "/artists");
}

export default async function ArtistsPage() {
  const c = await getContent();
  return (
    <>
      <PageHero eyebrow="कलाकार" title={c.texts.artistsTitle} sub={c.texts.artistsSub} />
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        {c.artists.map((a) => {
          const songs = c.releases.filter((r) => r.artist === a.name).length;
          return (
            <Link key={a.slug} href={`/artists/${a.slug}`} className="card-royal group overflow-hidden rounded-3xl transition hover:-translate-y-1">
              <div className="relative aspect-square overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.image} alt={a.name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink to-transparent" />
              </div>
              <div className="-mt-16 relative p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-saffron">{a.role}</p>
                <h2 className="mt-1 font-display text-2xl font-bold text-gold-gradient">{a.name}</h2>
                <p className="mt-1 text-sm text-muted">{a.genre}{songs ? ` · ${songs} songs` : ""}</p>
                <p className="mt-3 line-clamp-3 text-sm text-cream/75">{a.bio}</p>
              </div>
            </Link>
          );
        })}
      </section>
      <CtaBand title="Want to become an Imperial artist?" text="Send us your bhajan or folk song. Our team will help you with recording, video, release on 150+ platforms and promotion." button="Join as Artist" />
    </>
  );
}

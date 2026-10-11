import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReleaseCard from "@/components/site/ReleaseCard";
import Mandala from "@/components/site/Mandala";
import SectionHeading from "@/components/site/SectionHeading";
import { FacebookIcon, InstagramIcon, SpotifyIcon, YoutubeIcon } from "@/components/icons";
import { getContent } from "@/lib/store";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = (await getContent()).artists.find((x) => x.slug === slug);
  if (!a) return {};
  return { title: `${a.name} – ${a.genre}`, description: a.bio.slice(0, 160), alternates: { canonical: `/artists/${slug}` }, openGraph: { images: [a.image] } };
}

export default async function ArtistPage({ params }: Props) {
  const { slug } = await params;
  const c = await getContent();
  const a = c.artists.find((x) => x.slug === slug);
  if (!a) notFound();
  const songs = c.releases.filter((r) => r.artist === a.name);
  const names = Object.fromEntries(c.categories.map((x) => [x.slug, x.name]));
  const links = [
    { href: a.youtube, Icon: YoutubeIcon, label: "YouTube" },
    { href: a.instagram, Icon: InstagramIcon, label: "Instagram" },
    { href: a.facebook, Icon: FacebookIcon, label: "Facebook" },
    { href: a.spotify, Icon: SpotifyIcon, label: "Spotify" },
  ].filter((l) => l.href);
  return (
    <>
      <section className="bg-royal relative overflow-hidden pt-32 pb-16 sm:pt-40">
        <Mandala className="animate-spin-slow absolute -right-32 top-0 h-[600px] w-[600px] text-gold/10" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 md:grid-cols-[380px_1fr]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={a.image} alt={a.name} className="mx-auto aspect-square w-full max-w-sm rounded-[2rem] border border-gold/30 object-cover shadow-2xl shadow-gold/10" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-saffron">{a.role}</p>
            <h1 className="mt-2 font-display text-4xl font-bold text-gold-gradient sm:text-6xl">{a.name}</h1>
            <p className="mt-2 text-muted">{a.genre}</p>
            <p className="mt-6 max-w-2xl leading-relaxed text-cream/80">{a.bio}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {links.map(({ href, Icon, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-gold/30 px-4 py-2 text-sm text-gold hover:bg-gold/10"><Icon size={16} /> {label}</a>
              ))}
            </div>
          </div>
        </div>
      </section>
      {songs.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <SectionHeading title={`Songs by ${a.name}`} center={false} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {songs.map((r, k) => <ReleaseCard key={k} release={r} categoryName={names[r.category]} />)}
          </div>
        </section>
      )}
    </>
  );
}

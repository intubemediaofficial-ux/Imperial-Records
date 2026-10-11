import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getContent } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const c = await getContent();
  const now = new Date();
  const abs = (src: string) => (src.startsWith("http") ? src : `${SITE_URL}${src}`);
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1, images: c.banners.slice(0, 5).map((b) => abs(b.image)) },
    { url: `${SITE_URL}/music`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    ...c.categories.filter((x) => x.published).map((x) => ({ url: `${SITE_URL}/music/${x.slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8, images: [abs(x.image)] })),
    { url: `${SITE_URL}/artists`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...c.artists.map((a) => ({ url: `${SITE_URL}/artists/${a.slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.7, images: [abs(a.image)] })),
    { url: `${SITE_URL}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];
}

import type { Metadata } from "next";
import type { SeoPage } from "./siteContent";
import { getContent } from "./store";

export async function pageMetadata(page: SeoPage, path: string): Promise<Metadata> {
  const { seo, settings } = await getContent();
  const { title, description } = seo[page];
  const ogTitle = page === "home" ? title : `${title} | ${settings.companyName}`;
  return {
    title: page === "home" ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: { title: ogTitle, description, url: path, images: [{ url: settings.logo, alt: settings.companyName }] },
    twitter: { title: ogTitle, description, images: [settings.logo] },
  };
}

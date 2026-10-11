import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import PlayerProvider from "@/components/site/Player";
import WhatsappFab from "@/components/site/WhatsappFab";
import JsonLd from "@/components/JsonLd";
import { getContent } from "@/lib/store";
import { SITE_URL } from "@/lib/site";
import type { SiteContent } from "@/lib/siteContent";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const content = await getContent();
  const categories = content.categories.filter((c) => c.published);
  return (
    <PlayerProvider>
      <JsonLd data={structuredData(content)} />
      <Header settings={content.settings} categories={categories} topStrip={content.texts.topStrip} ctaButton={content.texts.ctaButton} />
      <main className="min-h-screen">{children}</main>
      <Footer content={{ ...content, categories }} />
      <WhatsappFab number={content.settings.whatsapp} company={content.settings.companyName} />
    </PlayerProvider>
  );
}

function structuredData(c: SiteContent) {
  const orgId = `${SITE_URL}/#organization`;
  const abs = (s: string) => (s.startsWith("http") ? s : `${SITE_URL}${s}`);
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: SITE_URL, name: c.settings.companyName, inLanguage: "en-IN", publisher: { "@id": orgId } },
      {
        "@type": ["Organization", "MusicGroup"],
        "@id": orgId,
        name: c.settings.companyName,
        alternateName: ["The Imperial Records", "Imperial Records India", "इम्पीरियल रिकॉर्ड्स"],
        url: SITE_URL,
        logo: abs(c.settings.logo),
        description: c.settings.description,
        genre: ["Bhajan", "Devotional", "Kirtan", "Aarti", "Rajasthani Folk"],
        email: c.settings.email,
        telephone: c.settings.phone,
        address: { "@type": "PostalAddress", addressLocality: c.settings.address, addressCountry: "IN" },
        sameAs: Object.values(c.socials).filter((u) => u && u.startsWith("http")),
        contactPoint: { "@type": "ContactPoint", telephone: c.settings.phone, email: c.settings.email, contactType: "customer support", availableLanguage: ["Hindi", "English"] },
        track: c.releases.slice(0, 12).map((r) => ({ "@type": "MusicRecording", name: r.title, byArtist: { "@type": "Person", name: r.artist }, url: r.youtubeId ? `https://www.youtube.com/watch?v=${r.youtubeId}` : undefined })),
      },
    ],
  };
}

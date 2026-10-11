import type { Metadata } from "next";
import { Cinzel, Poppins, Tiro_Devanagari_Hindi } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--font-cinzel" });
const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-poppins" });
const tiro = Tiro_Devanagari_Hindi({ subsets: ["devanagari", "latin"], weight: ["400"], variable: "--font-hindi" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Imperial Records | Bhajan, Aarti, Kirtan & Devotional Music Company", template: "%s | Imperial Records" },
  description:
    "Imperial Records — devotional music company for bhajan, aarti, chalisa, kirtan, mantra, Rajasthani folk and kids rhymes. Music distribution on 150+ platforms, production and artist management.",
  applicationName: "Imperial Records",
  keywords: [
    "Imperial Records", "Imperial Records bhajan", "devotional music company", "bhajan music label", "Krishna bhajan",
    "Hanuman bhajan", "Mata Rani bhajan", "Khatu Shyam bhajan", "aarti", "chalisa", "kirtan", "Vikash Habibpur",
    "bhajan release", "music distribution India", "इम्पीरियल रिकॉर्ड्स", "भजन",
  ],
  alternates: { canonical: "/" },
  openGraph: { siteName: "Imperial Records", locale: "en_IN", type: "website", images: [{ url: "/images/logo-imperial.jpg", alt: "Imperial Records" }] },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/images/logo-imperial.jpg", apple: "/images/logo-imperial.jpg" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION } : undefined,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cinzel.variable} ${poppins.variable} ${tiro.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}

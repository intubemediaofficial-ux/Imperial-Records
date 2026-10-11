import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import type { SiteContent } from "@/lib/siteContent";
import { FacebookIcon, InstagramIcon, SpotifyIcon, YoutubeIcon } from "@/components/icons";

export default function Footer({ content }: { content: SiteContent }) {
  const { settings, socials, categories, texts } = content;
  const social = [
    { href: socials.youtube, Icon: YoutubeIcon, label: "YouTube" },
    { href: socials.youtube2, Icon: YoutubeIcon, label: "YouTube (Vikash Habibpur Official)" },
    { href: socials.instagram, Icon: InstagramIcon, label: "Instagram" },
    { href: socials.facebook, Icon: FacebookIcon, label: "Facebook" },
    { href: socials.spotify, Icon: SpotifyIcon, label: "Spotify" },
  ].filter((s) => s.href);
  return (
    <footer className="relative overflow-hidden border-t border-gold/20 bg-[#021010]">
      <div className="pattern-mandala absolute inset-0 opacity-60" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={settings.logo} alt="" className="h-14 w-14 rounded-full border border-gold/40 object-cover" />
            <p className="font-display text-xl font-bold text-gold-gradient">{settings.companyName}</p>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted">{texts.footerAbout}</p>
          <div className="mt-5 flex gap-2">
            {social.map(({ href, Icon, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/25 text-gold transition hover:bg-gold hover:text-ink"><Icon size={18} /></a>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold text-gold">Bhakti Music</h3>
          <ul className="mt-4 grid grid-cols-1 gap-2 text-sm">
            {categories.slice(0, 8).map((c) => (
              <li key={c.slug}><Link href={`/music/${c.slug}`} className="text-muted hover:text-gold">{c.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold text-gold">Company</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {[["/about", "About Us"], ["/artists", "Our Artists"], ["/services", "Services"], ["/music", "All Releases"], ["/contact", "Release Your Song"], ["/contact", "Contact"]].map(([h, l]) => (
              <li key={l}><Link href={h} className="text-muted hover:text-gold">{l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold text-gold">Get in Touch</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li><a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="flex items-start gap-3 hover:text-gold"><Phone size={16} className="mt-0.5 shrink-0 text-gold" /> {settings.phone}</a></li>
            <li><a href={`mailto:${settings.email}`} className="flex items-start gap-3 break-all hover:text-gold"><Mail size={16} className="mt-0.5 shrink-0 text-gold" /> {settings.email}</a></li>
            <li className="flex items-start gap-3"><MapPin size={16} className="mt-0.5 shrink-0 text-gold" /> {settings.address}</li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-gold/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} {settings.companyName}. All rights reserved.</p>
          <p className="font-hindi text-gold/70">॥ सर्वे भवन्तु सुखिनः ॥</p>
        </div>
      </div>
    </footer>
  );
}

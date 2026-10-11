"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Mail, Menu, Phone, X } from "lucide-react";
import type { Category, Settings } from "@/lib/siteContent";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/music", label: "Bhakti Music", menu: true },
  { href: "/artists", label: "Artists" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header({ settings, categories, topStrip, ctaButton }: { settings: Settings; categories: Category[]; topStrip: string; ctaButton: string }) {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === path;
  const setOpen = (v: boolean) => setOpenAt(v ? path : null);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 30);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className={`hidden overflow-hidden bg-gold-gradient text-ink transition-all duration-300 md:block ${scrolled ? "max-h-0" : "max-h-10"}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1.5 text-xs font-medium">
          <p className="font-hindi truncate">{topStrip}</p>
          <div className="flex shrink-0 items-center gap-5">
            <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="flex items-center gap-1.5 hover:underline"><Phone size={12} /> {settings.phone}</a>
            <a href={`mailto:${settings.email}`} className="flex items-center gap-1.5 hover:underline"><Mail size={12} /> {settings.email}</a>
          </div>
        </div>
      </div>
      <div className={`transition-all duration-300 ${scrolled || open ? "border-b border-gold/15 bg-ink/90 shadow-xl shadow-black/30 backdrop-blur-xl" : "bg-gradient-to-b from-ink/90 to-transparent"}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={settings.logo} alt={settings.companyName} className="h-12 w-12 rounded-full border border-gold/40 object-cover shadow-lg shadow-gold/10" />
            <span className="leading-tight">
              <span className="block font-display text-lg font-bold tracking-wider text-gold-gradient sm:text-xl">{settings.companyName.toUpperCase()}</span>
              <span className="block text-[10px] uppercase tracking-[0.25em] text-muted">{settings.tagline}</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((n) =>
              n.menu ? (
                <div key={n.href} className="group relative">
                  <Link href={n.href} className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition ${active(n.href) ? "text-gold" : "text-cream/85 hover:text-gold"}`}>
                    {n.label} <ChevronDown size={14} className="transition group-hover:rotate-180" />
                  </Link>
                  <div className="invisible absolute left-1/2 top-full w-[560px] -translate-x-1/2 pt-3 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    <div className="grid grid-cols-2 gap-1 rounded-2xl border border-gold/20 bg-deep/95 p-3 shadow-2xl backdrop-blur-xl">
                      {categories.map((c) => (
                        <Link key={c.slug} href={`/music/${c.slug}`} className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-gold/10">
                          <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: c.color }} />
                          <span>
                            <span className="block text-sm font-medium text-cream">{c.name}</span>
                            <span className="font-hindi block text-xs text-gold/70">{c.hindi}</span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link key={n.href} href={n.href} className={`rounded-full px-4 py-2 text-sm font-medium transition ${active(n.href) ? "text-gold" : "text-cream/85 hover:text-gold"}`}>
                  {n.label}
                </Link>
              ),
            )}
          </nav>
          <Link href="/contact" className="hidden rounded-full bg-gold-gradient px-5 py-2.5 text-sm font-semibold text-ink shadow-lg shadow-gold/20 transition hover:brightness-110 lg:inline-flex">{ctaButton}</Link>
          <button className="rounded-full border border-gold/30 p-2 text-gold lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
        {open && (
          <div className="max-h-[80vh] overflow-y-auto border-t border-gold/15 px-4 pb-6 lg:hidden">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className={`block border-b border-white/5 py-3 font-medium ${active(n.href) ? "text-gold" : "text-cream"}`}>{n.label}</Link>
            ))}
            <div className="mt-4 grid grid-cols-2 gap-2">
              {categories.map((c) => (
                <Link key={c.slug} href={`/music/${c.slug}`} className="rounded-xl border border-gold/15 px-3 py-2 text-sm text-cream/85">{c.name}</Link>
              ))}
            </div>
            <Link href="/contact" className="mt-5 block rounded-full bg-gold-gradient py-3 text-center font-semibold text-ink">{ctaButton}</Link>
          </div>
        )}
      </div>
    </header>
  );
}

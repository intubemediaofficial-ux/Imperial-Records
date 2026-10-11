"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import type { Banner } from "@/lib/siteContent";
import { usePlayer } from "./Player";
import Mandala from "./Mandala";

export default function HeroSlider({ banners, ctaButton }: { banners: Banner[]; ctaButton: string }) {
  const [i, setI] = useState(0);
  const play = usePlayer();
  const n = banners.length;
  useEffect(() => {
    if (n < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), 7000);
    return () => clearInterval(t);
  }, [n]);
  if (!n) return null;
  const go = (d: number) => setI((x) => (x + d + n) % n);
  return (
    <section className="relative h-[92vh] min-h-[600px] overflow-hidden">
      {banners.map((b, k) => (
        <div key={k} className={`absolute inset-0 transition-opacity duration-1000 ${k === i ? "opacity-100" : "opacity-0"}`} aria-hidden={k !== i}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={b.image} alt={b.title} className={`h-full w-full object-cover ${k === i ? "animate-kenburns" : ""}`} />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-ink/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />
      <Mandala className="animate-spin-slow pointer-events-none absolute -right-40 top-1/2 h-[720px] w-[720px] -translate-y-1/2 text-gold/10" />
      <div className="relative mx-auto flex h-full max-w-7xl items-center px-4 pt-20 sm:px-6">
        {banners.map((b, k) => k === i && (
          <div key={k} className="max-w-2xl animate-[fadeUp_0.8s_ease]">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-saffron/40 bg-saffron/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-saffron">
              <span className="animate-glow h-1.5 w-1.5 rounded-full bg-saffron" /> {b.eyebrow}
            </p>
            <h1 className="font-display text-4xl font-bold leading-[1.1] text-gold-gradient sm:text-6xl md:text-7xl">{b.title}</h1>
            <p className="mt-6 max-w-xl text-lg text-cream/80 sm:text-xl">{b.subtitle}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              {b.youtubeId ? (
                <button onClick={() => play({ id: b.youtubeId!, title: b.title })} className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-7 py-3.5 font-semibold text-ink shadow-xl shadow-gold/25 transition hover:brightness-110">
                  <Play size={18} fill="currentColor" /> {b.ctaText || "Watch Now"}
                </button>
              ) : b.ctaUrl ? (
                <Link href={b.ctaUrl} className="inline-flex items-center gap-2 rounded-full bg-gold-gradient px-7 py-3.5 font-semibold text-ink shadow-xl shadow-gold/25 transition hover:brightness-110">{b.ctaText || "Explore"}</Link>
              ) : null}
              <Link href="/music" className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-7 py-3.5 font-semibold text-gold backdrop-blur transition hover:bg-gold/10">Explore Bhakti Music</Link>
              <Link href="/contact" className="hidden items-center gap-2 rounded-full px-4 py-3.5 font-medium text-cream/80 underline-offset-4 hover:text-gold hover:underline sm:inline-flex">{ctaButton} →</Link>
            </div>
          </div>
        ))}
      </div>
      {n > 1 && (
        <>
          <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 gap-2">
            {banners.map((_, k) => (
              <button key={k} onClick={() => setI(k)} aria-label={`Slide ${k + 1}`} className={`h-1.5 rounded-full transition-all ${k === i ? "w-10 bg-gold" : "w-4 bg-cream/30 hover:bg-cream/60"}`} />
            ))}
          </div>
          <button onClick={() => go(-1)} aria-label="Previous" className="absolute left-4 top-1/2 hidden -translate-y-1/2 rounded-full border border-gold/30 bg-ink/50 p-3 text-gold backdrop-blur hover:bg-gold/20 md:block"><ChevronLeft /></button>
          <button onClick={() => go(1)} aria-label="Next" className="absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-full border border-gold/30 bg-ink/50 p-3 text-gold backdrop-blur hover:bg-gold/20 md:block"><ChevronRight /></button>
        </>
      )}
    </section>
  );
}

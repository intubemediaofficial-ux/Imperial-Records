"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Category, Release } from "@/lib/siteContent";
import ReleaseCard from "./ReleaseCard";

export default function MusicBrowser({ releases, categories, initial = "all", showFilters = true }: { releases: Release[]; categories: Category[]; initial?: string; showFilters?: boolean }) {
  const [cat, setCat] = useState(initial);
  const [q, setQ] = useState("");
  const names = useMemo(() => Object.fromEntries(categories.map((c) => [c.slug, c.name])), [categories]);
  const list = releases.filter((r) => (cat === "all" || r.category === cat) && (!q || `${r.title} ${r.hindi} ${r.artist}`.toLowerCase().includes(q.toLowerCase())));
  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {showFilters ? (
          <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-wrap lg:pb-0">
            {[{ slug: "all", name: "All" }, ...categories].map((c) => (
              <button key={c.slug} onClick={() => setCat(c.slug)} className={`shrink-0 rounded-full border px-4 py-2 text-sm transition ${cat === c.slug ? "border-gold bg-gold-gradient font-semibold text-ink" : "border-gold/20 text-cream/80 hover:border-gold/60 hover:text-gold"}`}>
                {c.name}
              </button>
            ))}
          </div>
        ) : <span />}
        <label className="relative block w-full shrink-0 lg:w-72">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search bhajan, artist…" className="w-full rounded-full border border-gold/20 bg-deep py-2.5 pl-10 pr-4 text-sm text-cream placeholder:text-muted focus:border-gold focus:outline-none" />
        </label>
      </div>
      <p className="mb-5 text-sm text-muted">{list.length} songs</p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {list.map((r, k) => <ReleaseCard key={`${r.youtubeId}-${k}`} release={r} categoryName={cat === "all" ? names[r.category] : undefined} />)}
      </div>
      {!list.length && <p className="py-16 text-center text-muted">No songs found.</p>}
    </div>
  );
}

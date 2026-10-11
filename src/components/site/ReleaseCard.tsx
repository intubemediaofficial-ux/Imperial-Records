"use client";

import { Play } from "lucide-react";
import { releaseImage, type Release } from "@/lib/siteContent";
import { usePlayer } from "./Player";

export default function ReleaseCard({ release, categoryName }: { release: Release; categoryName?: string }) {
  const play = usePlayer();
  const external = !release.youtubeId ? release.spotify || release.jiosaavn || release.apple : "";
  const onClick = () => {
    if (release.youtubeId) play({ id: release.youtubeId, title: release.title, artist: release.artist });
    else if (external) window.open(external, "_blank", "noopener");
  };
  return (
    <button onClick={onClick} className="group card-royal block w-full overflow-hidden rounded-2xl text-left transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gold/10">
      <div className="relative aspect-video overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={releaseImage(release)} alt={release.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent opacity-80" />
        <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 scale-75 items-center justify-center rounded-full bg-gold-gradient text-ink opacity-0 shadow-lg transition duration-300 group-hover:scale-100 group-hover:opacity-100">
          <Play size={24} fill="currentColor" className="ml-1" />
        </span>
        {categoryName && <span className="absolute left-3 top-3 rounded-full bg-ink/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold backdrop-blur">{categoryName}</span>}
      </div>
      <div className="p-4">
        <h3 className="line-clamp-1 font-semibold text-cream group-hover:text-gold-light">{release.title}</h3>
        {release.hindi && <p className="font-hindi mt-1 line-clamp-1 text-sm text-gold/80">{release.hindi}</p>}
        <p className="mt-2 text-xs text-muted">{release.artist}{release.date ? ` · ${release.date}` : ""}</p>
      </div>
    </button>
  );
}

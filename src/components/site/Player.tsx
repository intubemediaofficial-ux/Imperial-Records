"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { X } from "lucide-react";
import { YoutubeIcon } from "@/components/icons";

type Track = { id: string; title: string; artist?: string };
const PlayerCtx = createContext<(t: Track) => void>(() => {});
export const usePlayer = () => useContext(PlayerCtx);

export default function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [track, setTrack] = useState<Track | null>(null);
  const open = useCallback((t: Track) => setTrack(t), []);
  useEffect(() => {
    if (!track) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setTrack(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [track]);
  return (
    <PlayerCtx.Provider value={open}>
      {children}
      {track && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm" onClick={() => setTrack(null)} role="dialog" aria-modal>
          <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-gold/30 bg-deep shadow-2xl shadow-gold/10" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between gap-3 border-b border-gold/15 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate font-semibold text-cream">{track.title}</p>
                {track.artist && <p className="truncate text-xs text-muted">{track.artist}</p>}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <a href={`https://www.youtube.com/watch?v=${track.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-full border border-gold/30 px-3 py-1.5 text-xs text-gold hover:bg-gold/10">
                  <YoutubeIcon size={14} /> YouTube
                </a>
                <button onClick={() => setTrack(null)} className="rounded-full p-2 text-muted hover:bg-white/10 hover:text-cream" aria-label="Close"><X size={20} /></button>
              </div>
            </div>
            <div className="aspect-video bg-black">
              <iframe className="h-full w-full" src={`https://www.youtube-nocookie.com/embed/${track.id}?autoplay=1&rel=0`} title={track.title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
            </div>
          </div>
        </div>
      )}
    </PlayerCtx.Provider>
  );
}

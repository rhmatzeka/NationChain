"use client";

import { useState, useEffect } from "react";
import { Newspaper, X } from "lucide-react";
import type { NewsEvent } from "@/types/game";

export function NewsBanner({ event }: { event?: NewsEvent | null }) {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [currentEventId, setCurrentEventId] = useState<number | null>(null);

  // Reset dismissed state when new event arrives
  useEffect(() => {
    if (event && event.id !== currentEventId) {
      setDismissed(false);
      setCurrentEventId(event.id);
      
      // Auto-dismiss after 10 seconds
      const timer = setTimeout(() => {
        setDismissed(true);
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [event, currentEventId]);

  if (!event || dismissed) return null;
  
  const effects = event.gameEffects || [];
  
  return (
    <>
      <div className="fixed left-0 right-0 top-16 z-[999] border-y border-amberline/40 bg-amberline/95 px-4 py-3 text-obsidian shadow-tactical animate-slide-down">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3 flex-1">
            <Newspaper className="h-5 w-5 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="truncate font-bold">{event.headline}</div>
              <div className="text-xs truncate">{event.affectedCountries.join(", ")} | {effects.slice(0, 2).map((e) => `${e.country} ${e.stat} ${e.delta > 0 ? "+" : ""}${e.delta / 100}%`).join(" | ")}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setOpen(true)} 
              className="rounded bg-obsidian px-4 py-2 text-sm font-semibold text-radar hover:bg-obsidian/90 transition"
            >
              View Details
            </button>
            <button 
              onClick={() => setDismissed(true)} 
              className="rounded border border-obsidian/20 p-2 hover:bg-obsidian/20 transition"
              title="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 z-[1200] grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="max-h-[86vh] w-full max-w-2xl overflow-auto rounded border border-radar/30 bg-steel p-5 shadow-tactical">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">{event.headline}</h2>
                <p className="mt-2 text-sm text-slate-300">{event.aiAnalysis?.headline_summary || "Breaking news affecting the game world."}</p>
              </div>
              <button onClick={() => setOpen(false)} className="rounded border border-white/10 p-2 hover:border-radar/40 transition">
                <X className="h-5 w-5 text-white" />
              </button>
            </div>
            <div className="mt-5 grid gap-3">
              {effects.map((effect, index) => (
                <div key={index} className="rounded border border-white/10 bg-obsidian/60 p-3">
                  <div className="font-semibold text-radar">{effect.country}</div>
                  <div className="text-sm text-slate-300">{effect.stat}: {effect.delta > 0 ? "+" : ""}{effect.delta / 100}% for {effect.duration_hours}h</div>
                </div>
              ))}
            </div>
            {event.sourceUrl && event.sourceUrl !== 'manual://admin' && !event.sourceUrl.includes('demo.nationchain') && (
              <a 
                href={event.sourceUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="mt-5 inline-flex rounded bg-radar px-4 py-2 font-semibold text-obsidian hover:bg-radar/90 transition"
              >
                Open Source
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
}

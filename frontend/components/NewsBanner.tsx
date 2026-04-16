"use client";

import { useState } from "react";
import { Newspaper, X } from "lucide-react";
import type { NewsEvent } from "@/types/game";

export function NewsBanner({ event }: { event?: NewsEvent | null }) {
  const [open, setOpen] = useState(false);
  if (!event) return null;
  const effects = event.gameEffects || [];
  return (
    <>
      <div className="fixed left-0 right-0 top-16 z-[999] border-y border-amberline/40 bg-amberline/95 px-4 py-3 text-obsidian shadow-tactical">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Newspaper className="h-5 w-5 shrink-0" />
            <div className="min-w-0">
              <div className="truncate font-bold">{event.headline}</div>
              <div className="text-xs">{event.affectedCountries.join(", ")} | {effects.slice(0, 2).map((e) => `${e.country} ${e.stat} ${e.delta > 0 ? "+" : ""}${e.delta / 100}%`).join(" | ")}</div>
            </div>
          </div>
          <button onClick={() => setOpen(true)} className="rounded bg-obsidian px-4 py-2 text-sm font-semibold text-radar">View Details</button>
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 z-[1200] grid place-items-center bg-black/70 p-4">
          <div className="max-h-[86vh] w-full max-w-2xl overflow-auto rounded border border-radar/30 bg-steel p-5 shadow-tactical">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">{event.headline}</h2>
                <p className="mt-2 text-sm text-slate-300">{event.aiAnalysis?.headline_summary}</p>
              </div>
              <button onClick={() => setOpen(false)} className="rounded border border-white/10 p-2 hover:border-radar/40"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-5 grid gap-3">
              {effects.map((effect, index) => (
                <div key={index} className="rounded border border-white/10 bg-obsidian/60 p-3">
                  <div className="font-semibold text-radar">{effect.country}</div>
                  <div className="text-sm text-slate-300">{effect.stat}: {effect.delta > 0 ? "+" : ""}{effect.delta / 100}% for {effect.duration_hours}h</div>
                </div>
              ))}
            </div>
            <a href={event.sourceUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded bg-radar px-4 py-2 font-semibold text-obsidian">Open Source</a>
          </div>
        </div>
      )}
    </>
  );
}

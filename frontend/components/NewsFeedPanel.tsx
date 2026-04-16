"use client";

import { useState } from "react";
import { Filter, Newspaper, X } from "lucide-react";
import { useNews } from "@/hooks/useGameData";

const filters = ["all", "economic", "war", "sanction", "disaster", "diplomatic"];

export function NewsFeedPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [filter, setFilter] = useState("all");
  const { data = [], isLoading } = useNews(filter);
  return (
    <aside className={`fixed right-0 top-0 z-[1300] h-full w-full max-w-xl transform border-l border-radar/20 bg-obsidian shadow-tactical transition md:w-[520px] ${open ? "translate-x-0" : "translate-x-full"}`}>
      <div className="flex items-center justify-between border-b border-white/10 p-4">
        <div className="flex items-center gap-2 text-xl font-bold"><Newspaper className="h-5 w-5 text-radar" /> News Oracle</div>
        <button onClick={onClose} className="rounded border border-white/10 p-2"><X className="h-5 w-5" /></button>
      </div>
      <div className="flex gap-2 overflow-x-auto border-b border-white/10 p-3">
        <Filter className="mt-2 h-4 w-4 text-slate-400" />
        {filters.map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded px-3 py-2 text-sm capitalize ${filter === item ? "bg-radar text-obsidian" : "border border-white/10 text-slate-300"}`}>{item}</button>)}
      </div>
      <div className="h-[calc(100%-120px)] overflow-y-auto p-4">
        {isLoading && <div className="text-radar">Loading feed</div>}
        <div className="grid gap-3">
          {data.map((event) => (
            <article key={event.id} className="rounded border border-white/10 bg-steel p-4">
              <div className="text-xs uppercase text-amberline">{new Date(event.createdAt).toLocaleString()} | {event.eventType}</div>
              <h3 className="mt-2 font-semibold text-white">{event.headline}</h3>
              <div className="mt-2 text-xs text-slate-400">{event.affectedCountries.join(", ")}</div>
              <div className="mt-3 grid gap-2">
                {event.gameEffects.slice(0, 3).map((effect, index) => (
                  <div key={index} className="rounded bg-obsidian/60 px-3 py-2 text-sm text-slate-300">{effect.country}: {effect.stat} {effect.delta > 0 ? "+" : ""}{effect.delta / 100}%</div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </aside>
  );
}

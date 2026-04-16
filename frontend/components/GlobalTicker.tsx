"use client";

import { Radio } from "lucide-react";

export function GlobalTicker({ items }: { items: Array<{ id: string; type: string; message: string; createdAt: string }> }) {
  const content = items.length ? items : [{ id: "boot", type: "system", message: "Command network standing by for live wars, trades, sanctions, and oracle events", createdAt: new Date().toISOString() }];
  const doubled = [...content, ...content];
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[1000] border-t border-radar/20 bg-obsidian/95 py-2 text-sm text-slate-200 backdrop-blur">
      <div className="flex overflow-hidden">
        <div className="ticker-track flex min-w-full gap-8 whitespace-nowrap px-4">
          {doubled.map((item, index) => (
            <span key={`${item.id}-${index}`} className="inline-flex items-center gap-2">
              <Radio className="h-4 w-4 text-radar" />
              <b className="text-amberline">{item.type}</b>
              {item.message}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Megaphone, ShieldPlus, Swords, X } from "lucide-react";

export function WarRoomModal({ 
  open, 
  onClose, 
  battleFeed,
  onAction 
}: { 
  open: boolean; 
  onClose: () => void; 
  battleFeed: Array<{ message: string; createdAt: string }>;
  onAction?: (type: "boost" | "alliance", message: string) => void;
}) {
  const [boosting, setBoosting] = useState(false);
  const [calling, setCalling] = useState(false);

  const handleBoostDefense = () => {
    setBoosting(true);
    setTimeout(() => {
      setBoosting(false);
      onAction?.("boost", "🛡️ Defense boost activated! Your military strength increased by 15% for the next hour.");
    }, 1000);
  };

  const handleCallAlliance = () => {
    setCalling(true);
    setTimeout(() => {
      setCalling(false);
      onAction?.("alliance", "📢 Alliance reinforcements called! Allied forces will arrive in 30 minutes.");
    }, 1000);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[1250] grid place-items-center bg-black/70 backdrop-blur-sm p-4">
      <section className="w-full max-w-4xl rounded-lg border border-alert/40 bg-steel/95 backdrop-blur-md p-5 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-alert"><Swords className="h-6 w-6" /><span className="text-sm uppercase font-semibold">War Room</span></div>
            <h2 className="mt-1 text-3xl font-bold text-white">Live Battle Command</h2>
          </div>
          <button onClick={onClose} className="rounded border border-white/10 p-2 hover:bg-white/10 transition"><X className="h-5 w-5" /></button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Strength label="Attacker" value={62} tone="alert" />
          <Strength label="Defender" value={51} tone="radar" />
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-[1fr_260px]">
          <div className="max-h-72 overflow-y-auto rounded border border-white/10 bg-obsidian/60 p-4">
            {(battleFeed.length ? battleFeed : [
              { message: "Tank battalion deployed", createdAt: new Date().toISOString() },
              { message: "Naval blockade initiated", createdAt: new Date().toISOString() },
              { message: "Air defense grid reinforced", createdAt: new Date().toISOString() }
            ]).map((line, index) => (
              <div key={index} className="border-b border-white/10 py-3 text-sm text-slate-300">
                <span className="text-radar">{new Date(line.createdAt).toLocaleTimeString()}</span> {line.message}
              </div>
            ))}
          </div>
          <div className="grid content-start gap-3">
            <button 
              onClick={handleBoostDefense}
              disabled={boosting}
              className="inline-flex items-center justify-center gap-2 rounded bg-radar px-4 py-3 font-semibold text-obsidian hover:bg-radar/90 disabled:opacity-50 transition"
            >
              <ShieldPlus className="h-5 w-5" /> {boosting ? "Boosting..." : "Boost Defense"}
            </button>
            <button 
              onClick={handleCallAlliance}
              disabled={calling}
              className="inline-flex items-center justify-center gap-2 rounded border border-amberline/40 px-4 py-3 font-semibold text-amberline hover:bg-amberline/10 disabled:opacity-50 transition"
            >
              <Megaphone className="h-5 w-5" /> {calling ? "Calling..." : "Call Alliance"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function Strength({ label, value, tone }: { label: string; value: number; tone: "alert" | "radar" }) {
  const color = tone === "alert" ? "bg-alert" : "bg-radar";
  return (
    <div className="rounded border border-white/10 bg-obsidian/60 p-4">
      <div className="mb-2 flex justify-between"><span>{label}</span><span>{value}%</span></div>
      <div className="h-4 rounded bg-white/10"><div className={`h-full rounded ${color}`} style={{ width: `${value}%` }} /></div>
    </div>
  );
}

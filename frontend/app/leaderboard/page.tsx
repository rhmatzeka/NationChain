"use client";

import { useState } from "react";
import { Crown, Timer } from "lucide-react";
import { Header } from "@/components/Header";
import { GlobalTicker } from "@/components/GlobalTicker";
import { useLeaderboard } from "@/hooks/useGameData";
import { useRealtime } from "@/hooks/useRealtime";
import { shortWallet } from "@/lib/api";

const tabs = [
  { key: "gdp", label: "GDP Ranking" },
  { key: "military", label: "Military Power" },
  { key: "tokens", label: "NATION Earned" },
  { key: "wars", label: "Most Wars Won" }
] as const;

export default function LeaderboardPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]["key"]>("gdp");
  const realtime = useRealtime();
  const { data, isLoading } = useLeaderboard();
  const rows = data?.[tab] || [];

  return (
    <main className="min-h-screen pb-20">
      <Header onlinePlayers={realtime.onlinePlayers} />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-white">Leaderboard</h1>
            <p className="mt-2 text-slate-400">Weekly prize pool tracks dominance across economy, military, rewards, and PvP.</p>
          </div>
          <div className="rounded border border-amberline/40 bg-amberline/10 px-4 py-3 text-amberline"><Timer className="mr-2 inline h-4 w-4" /> Prize reset: Sunday UTC</div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {tabs.map((item) => <button key={item.key} onClick={() => setTab(item.key)} className={`rounded px-4 py-2 text-sm ${tab === item.key ? "bg-radar text-obsidian" : "border border-white/10 text-slate-300"}`}>{item.label}</button>)}
        </div>
        <div className="mt-6 overflow-hidden rounded border border-white/10 bg-steel shadow-tactical">
          {isLoading ? <div className="p-6 text-radar">Loading rankings</div> : rows.map((country, index) => (
            <div key={country.id} className={`grid grid-cols-[60px_1fr_160px_140px] items-center gap-3 border-b border-white/10 p-4 ${index < 3 ? "bg-amberline/5" : ""}`}>
              <div className="flex items-center gap-2 font-bold text-white">{index < 3 && <Crown className="h-4 w-4 text-amberline" />} #{index + 1}</div>
              <div><div className="font-semibold text-white">{country.name}</div><div className="text-xs text-slate-400">{shortWallet(country.ownerWallet)}</div></div>
              <div className="text-radar">{tab === "gdp" ? country.gdp : tab === "military" ? country.military : tab === "tokens" ? country.tokensEarned : country.warsWon}</div>
              <div className="text-sm text-slate-400">{country.online ? "Online" : "Offline"}</div>
            </div>
          ))}
        </div>
      </div>
      <GlobalTicker items={realtime.ticker} />
    </main>
  );
}

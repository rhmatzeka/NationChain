"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Banknote, ChevronDown, ChevronUp, Handshake, Landmark, Shield, Swords, WalletCards, type LucideIcon } from "lucide-react";
import { buildingNames } from "@/lib/api";
import type { CommodityPrice, Country, War } from "@/types/game";
import { StatChip } from "./StatChip";
import { DeclareWarModal } from "./DeclareWarModal";

const tabs = ["Economy", "Military", "Diplomacy", "Treasury"] as const;

export function CountryDashboard({ country, commodities, wars, allCountries }: { country?: Country; commodities?: CommodityPrice; wars: War[]; allCountries?: Country[] }) {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Economy");
  const [minimized, setMinimized] = useState(false);
  const [warModalOpen, setWarModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [claiming, setClaiming] = useState(false);
  const [staking, setStaking] = useState(false);
  const chart = useMemo(() => Array.from({ length: 30 }, (_, i) => ({ day: i + 1, gdp: Math.round((country?.gdp || 1000) * (0.88 + i / 180 + Math.sin(i) / 40)) })), [country?.gdp]);
  
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleClaimGov = async () => {
    if (!country || claiming) return;
    
    // Get wallet address from wagmi
    const walletAddress = (window as any).ethereum?.selectedAddress;
    if (!walletAddress) {
      showToast("❌ Please connect your wallet");
      return;
    }

    setClaiming(true);
    try {
      const response = await fetch(`http://localhost:4000/api/country/${country.id}/claim-gov`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet: walletAddress })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to claim GOV');
      }

      showToast(`✅ Claimed ${data.claimed} GOV tokens! Total: ${data.newTotal}`);
    } catch (error: any) {
      showToast(`❌ Failed: ${error.message}`);
    } finally {
      setClaiming(false);
    }
  };

  const handleStakeNation = async () => {
    if (!country || staking) return;
    
    const walletAddress = (window as any).ethereum?.selectedAddress;
    if (!walletAddress) {
      showToast("❌ Please connect your wallet");
      return;
    }

    const amount = 1000; // Default stake amount

    setStaking(true);
    try {
      const response = await fetch(`http://localhost:4000/api/country/${country.id}/stake-nation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet: walletAddress, amount })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to stake NATION');
      }

      showToast(`✅ Staked ${data.staked} NATION! Military +${data.militaryBoost} (New: ${data.newMilitary})`);
    } catch (error: any) {
      showToast(`❌ Failed: ${error.message}`);
    } finally {
      setStaking(false);
    }
  };
  
  if (!country) {
    return (
      <section className="rounded-lg border border-white/10 bg-steel/95 backdrop-blur-md p-3 shadow-2xl text-slate-300 text-sm">
        Connect a wallet or select a country from the map.
      </section>
    );
  }
  
  const activeWars = wars.filter((war) => war.attackerId === country.id || war.defenderId === country.id);
  const dailyGov = Math.round(country.gdp / 80 + country.happiness * 2 + country.oil * (commodities?.appliedMultiplier?.oil || 1));

  // Minimized view - compact bar
  if (minimized) {
    return (
      <section className="rounded-lg border border-white/10 bg-steel/95 backdrop-blur-md p-3 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-white">{country.name}</h2>
            <span className="text-xs text-slate-400">{country.ideology}</span>
            <div className="flex gap-3 text-xs">
              <span className="text-slate-300">GDP: <span className="text-radar">{country.gdp}</span></span>
              <span className="text-slate-300">Military: <span className="text-amber-400">{country.military}</span></span>
              <span className="text-slate-300">Happiness: <span className="text-green-400">{country.happiness}%</span></span>
            </div>
          </div>
          <button onClick={() => setMinimized(false)} className="rounded border border-white/20 p-2 hover:bg-white/10 transition">
            <ChevronUp className="h-4 w-4 text-white" />
          </button>
        </div>
      </section>
    );
  }

  // Full view
  return (
    <section className="rounded-lg border border-white/10 bg-steel/95 backdrop-blur-md p-4 shadow-2xl max-h-[35vh] overflow-y-auto">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">{country.name}</h2>
          <p className="text-xs text-slate-400">{country.ideology} | {country.territory.toLocaleString()}k km²</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded border border-white/10 p-1">
            {tabs.map((item) => (
              <button key={item} onClick={() => setTab(item)} className={`rounded px-2 py-1 text-xs ${tab === item ? "bg-radar text-obsidian" : "text-slate-300 hover:bg-white/5"}`}>{item}</button>
            ))}
          </div>
          <button onClick={() => setMinimized(true)} className="rounded border border-white/20 p-1 hover:bg-white/10 transition">
            <ChevronDown className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>

      <div className="mt-3">
        {tab === "Economy" && (
          <div className="grid gap-4 lg:grid-cols-[1.25fr_.75fr]">
            <div className="rounded border border-white/10 bg-obsidian/50 p-4">
              <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-5">
                <Resource name="Food" value={country.food} />
                <Resource name="Gold" value={country.gold} multiplier={commodities?.appliedMultiplier?.gold} />
                <Resource name="Oil" value={country.oil} multiplier={commodities?.appliedMultiplier?.oil} />
                <Resource name="Iron" value={country.iron} />
                <Resource name="Uranium" value={country.uranium} />
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chart}>
                    <defs><linearGradient id="gdp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#32f5c8" stopOpacity={0.7} /><stop offset="95%" stopColor="#32f5c8" stopOpacity={0.05} /></linearGradient></defs>
                    <XAxis dataKey="day" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip />
                    <Area type="monotone" dataKey="gdp" stroke="#32f5c8" fill="url(#gdp)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="grid gap-3">
              <StatChip icon={Banknote} label="Daily GOV" value={dailyGov} />
              <Slider label="Tax Rate" value={22} suffix="%" preview={`Happiness preview ${Math.max(0, country.happiness - 5)}%`} />
              <Slider label="Health Ministry" value={58} suffix="%" />
              <Slider label="Education Ministry" value={64} suffix="%" />
              <Slider label="Infrastructure" value={71} suffix="%" />
              <Slider label="Culture" value={43} suffix="%" />
            </div>
          </div>
        )}

        {tab === "Military" && (
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="grid grid-cols-2 gap-3">
              <StatChip icon={Shield} label="Infantry" value={Math.round(country.military * 1.8)} tone="white" />
              <StatChip icon={Swords} label="Tanks" value={Math.round(country.military * 0.18)} tone="amber" />
              <StatChip icon={Shield} label="Aircraft" value={Math.round(country.military * 0.08)} />
              <StatChip icon={Swords} label="Navy" value={Math.round(country.military * 0.04)} tone="white" />
              <StatChip icon={Shield} label="Nuclear" value={country.uranium > 45 ? "Ready" : "Dormant"} tone={country.uranium > 45 ? "alert" : "white"} />
              <button onClick={() => setWarModalOpen(true)} className="rounded border border-alert/40 bg-alert/10 px-4 py-3 font-semibold text-alert hover:bg-alert/20 transition">Declare War</button>
            </div>
            <div className="rounded border border-white/10 bg-obsidian/50 p-4">
              <h3 className="font-semibold text-white">Active Wars</h3>
              <div className="mt-3 grid gap-3">
                {activeWars.length === 0 && <p className="text-sm text-slate-400">No active battles.</p>}
                {activeWars.map((war) => <Progress key={war.id} label={`Battle ${war.id}`} value={58} />)}
              </div>
            </div>
          </div>
        )}

        {tab === "Diplomacy" && (
          <div className="grid gap-4 md:grid-cols-3">
            <Panel title="Alliances" lines={["Pacific Shield: 4 members", "Treasury: 12.4 ETH"]} icon={Handshake} />
            <Panel title="Proposals" lines={["Trade offer: Oil for GOV", "Ceasefire request: none"]} icon={Landmark} />
            <Panel title="UN Panel" lines={["Resolution #18: 64% support", "Sanctions received: none"]} icon={Shield} />
          </div>
        )}

        {tab === "Treasury" && (
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="grid grid-cols-2 gap-3">
              <StatChip icon={WalletCards} label="NATION" value={country.tokensEarned} />
              <StatChip icon={Banknote} label="GOV Claim" value={`${dailyGov}/day`} tone="amber" />
              <button 
                onClick={handleClaimGov}
                disabled={claiming}
                className="rounded bg-radar px-4 py-3 font-semibold text-obsidian hover:bg-radar/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {claiming ? "Claiming..." : "Claim GOV"}
              </button>
              <button 
                onClick={handleStakeNation}
                disabled={staking}
                className="rounded border border-amberline/40 px-4 py-3 font-semibold text-amberline hover:bg-amberline/10 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {staking ? "Staking..." : "Stake NATION"}
              </button>
            </div>
            <div className="rounded border border-white/10 bg-obsidian/50 p-4">
              <h3 className="font-semibold text-white">NFT Inventory</h3>
              <div className="mt-3 grid gap-2">
                {(country.buildings || []).map((building) => (
                  <div key={building.id} className="flex items-center justify-between rounded border border-white/10 p-3">
                    <span>{buildingNames[building.buildingType]}</span>
                    <span className="text-radar">Level {building.level}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <DeclareWarModal 
        open={warModalOpen} 
        onClose={() => setWarModalOpen(false)}
        currentCountry={country}
        availableCountries={allCountries || []}
        onSuccess={showToast}
      />
      
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-[1400] rounded-lg border border-radar/40 bg-steel/95 backdrop-blur-md p-4 shadow-2xl animate-slide-in-right">
          <p className="text-white">{toastMessage}</p>
        </div>
      )}
    </section>
  );
}

function Resource({ name, value, multiplier }: { name: string; value: number; multiplier?: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-slate-400"><span>{name}</span><span>{value}{multiplier ? ` x${multiplier.toFixed(2)}` : ""}</span></div>
      <div className="h-2 rounded bg-white/10"><div className="h-full rounded bg-radar" style={{ width: `${Math.min(100, value)}%` }} /></div>
    </div>
  );
}

function Slider({ label, value, suffix, preview }: { label: string; value: number; suffix: string; preview?: string }) {
  return (
    <label className="rounded border border-white/10 bg-obsidian/50 p-3">
      <div className="flex justify-between text-sm"><span>{label}</span><span className="text-radar">{value}{suffix}</span></div>
      <input type="range" min="0" max="100" defaultValue={value} className="mt-2 w-full accent-radar" />
      {preview && <div className="mt-1 text-xs text-amberline">{preview}</div>}
    </label>
  );
}

function Progress({ label, value }: { label: string; value: number }) {
  return <div><div className="mb-1 text-sm">{label}</div><div className="h-3 rounded bg-white/10"><div className="h-full rounded bg-alert" style={{ width: `${value}%` }} /></div></div>;
}

function Panel({ title, lines, icon: Icon }: { title: string; lines: string[]; icon: LucideIcon }) {
  return (
    <div className="rounded border border-white/10 bg-obsidian/50 p-4">
      <div className="mb-3 flex items-center gap-2 font-semibold text-white"><Icon className="h-5 w-5 text-radar" /> {title}</div>
      {lines.map((line) => <div key={line} className="py-2 text-sm text-slate-300">{line}</div>)}
    </div>
  );
}

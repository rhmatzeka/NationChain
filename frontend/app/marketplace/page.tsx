"use client";

import { useMemo, useState } from "react";
import { Filter, ShoppingBag, Tag } from "lucide-react";
import { useAccount } from "wagmi";
import { Header } from "@/components/Header";
import { GlobalTicker } from "@/components/GlobalTicker";
import { Toast } from "@/components/Toast";
import { useCountries } from "@/hooks/useGameData";
import { useRealtime } from "@/hooks/useRealtime";
import { shortWallet } from "@/lib/api";
import type { Country } from "@/types/game";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function MarketplacePage() {
  const { address, isConnected } = useAccount();
  const realtime = useRealtime();
  const { data = [], isLoading, refetch } = useCountries();
  const [region, setRegion] = useState("all");
  const [sort, setSort] = useState("gdp");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [minting, setMinting] = useState<number | null>(null);
  const countries = useMemo(() => [...data].sort((a, b) => sort === "price" ? a.id - b.id : b.gdp - a.gdp), [data, sort]);

  const handleMint = async (country: Country) => {
    if (!isConnected || !address) {
      setToast({ message: "Please connect your wallet first", type: "error" });
      return;
    }

    if (country.ownerWallet) {
      setToast({ message: "This country is already owned", type: "error" });
      return;
    }

    setMinting(country.id);
    setToast({ 
      message: `Minting ${country.name}... This may take 30-60 seconds.`, 
      type: "info" 
    });

    try {
      const response = await fetch(`${API_URL}/api/country/${country.id}/mint`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet: address })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Mint failed");
      }

      setToast({ 
        message: `🎉 ${country.name} minted successfully! NFT is now in your wallet.`, 
        type: "success" 
      });
      
      // Refresh countries list
      setTimeout(() => refetch(), 2000);
    } catch (error: any) {
      setToast({ 
        message: `Failed: ${error.message || 'Transaction rejected'}`, 
        type: "error" 
      });
    } finally {
      setMinting(null);
    }
  };

  return (
    <main className="min-h-screen pb-20">
      <Header onlinePlayers={realtime.onlinePlayers} />
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-white">Marketplace</h1>
            <p className="mt-2 text-slate-400">Country NFTs, building NFTs, listings, and direct ETH offers.</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded bg-radar px-5 py-3 font-bold text-obsidian"><ShoppingBag className="h-5 w-5" /> My Listings</button>
        </div>
        <div className="mt-6 flex flex-wrap gap-3 rounded border border-white/10 bg-steel p-3">
          <label className="inline-flex items-center gap-2"><Filter className="h-4 w-4 text-radar" /><select value={region} onChange={(e) => setRegion(e.target.value)} className="rounded bg-obsidian px-3 py-2 text-sm"><option value="all">All Regions</option><option value="europe">Europe</option><option value="asia">Asia</option><option value="americas">Americas</option></select></label>
          <label><select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded bg-obsidian px-3 py-2 text-sm"><option value="gdp">Sort by GDP</option><option value="price">Sort by Price</option></select></label>
          <span className="px-3 py-2 text-sm text-slate-400">{region === "all" ? countries.length : countries.length} listings visible</span>
        </div>
        {isLoading ? <div className="mt-6 text-radar">Loading marketplace</div> : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {countries.slice(0, 32).map((country) => (
              <article key={country.id} className="rounded border border-white/10 bg-steel p-4 shadow-tactical">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">{country.name}</h2>
                    <p className="text-xs text-slate-400">{country.ownerWallet ? shortWallet(country.ownerWallet) : "Unclaimed"}</p>
                  </div>
                  <span className={`rounded px-2 py-1 text-xs ${country.ownerWallet ? "bg-amberline/10 text-amberline" : "bg-radar/10 text-radar"}`}>{country.ownerWallet ? "Owned" : "Available"}</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <Metric label="GDP" value={country.gdp} />
                  <Metric label="Military" value={country.military} />
                  <Metric label="Oil" value={country.oil} />
                  <Metric label="Happy" value={`${country.happiness}%`} />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-lg font-bold text-white">{(0.02 + country.gdp / 1_000_000).toFixed(3)} ETH</div>
                  <button 
                    onClick={() => handleMint(country)}
                    disabled={!!country.ownerWallet || minting === country.id}
                    className="inline-flex items-center gap-2 rounded bg-radar px-4 py-2 font-semibold text-obsidian hover:bg-radar/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <Tag className="h-4 w-4" /> 
                    {minting === country.id ? "Minting..." : country.ownerWallet ? "Owned" : "Mint"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
        <section className="mt-8 rounded border border-white/10 bg-steel p-5">
          <h2 className="text-2xl font-bold text-white">Building NFTs</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {["Factory", "Mine", "Barracks", "Oil Derrick", "Power Plant", "Embassy"].map((name, index) => <div key={name} className="rounded border border-white/10 bg-obsidian/50 p-4"><div className="font-semibold">{name}</div><div className="mt-1 text-sm text-slate-400">Level {index % 5 + 1} boost asset</div></div>)}
          </div>
        </section>
      </div>
      <GlobalTicker items={realtime.ticker} />
      
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded bg-obsidian/60 p-2"><div className="text-xs text-slate-400">{label}</div><div className="font-semibold text-radar">{value}</div></div>;
}

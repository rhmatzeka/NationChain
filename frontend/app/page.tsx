"use client";

import Link from "next/link";
import { Globe2, Newspaper, Shield, Wallet } from "lucide-react";
import { useAccount, useConnect } from "wagmi";
import { useCountries, useActiveWars, useNews } from "@/hooks/useGameData";
import { useRealtime } from "@/hooks/useRealtime";
import { Header } from "@/components/Header";
import { GlobalTicker } from "@/components/GlobalTicker";

export default function LandingPage() {
  const { address } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const countries = useCountries();
  const wars = useActiveWars();
  const news = useNews();
  const realtime = useRealtime(address);
  const available = (countries.data || []).filter((country) => !country.ownerWallet).slice(0, 8);

  return (
    <main className="min-h-screen pb-14">
      <Header onlinePlayers={realtime.onlinePlayers} />
      <section className="relative min-h-[calc(100vh-64px)] overflow-hidden px-4 py-8">
        <div className="absolute inset-0 opacity-40">
          <div className="h-full w-full bg-[linear-gradient(transparent_95%,rgba(50,245,200,.18)_96%),linear-gradient(90deg,transparent_95%,rgba(50,245,200,.18)_96%)] bg-[length:48px_48px]" />
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_420px]">
          <div className="flex min-h-[70vh] flex-col justify-center">
            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded border border-radar/30 bg-radar/10 px-3 py-2 text-sm text-radar"><Globe2 className="h-4 w-4" /> Live geopolitical command</div>
            <h1 className="max-w-4xl text-5xl font-black tracking-normal text-white md:text-7xl">NationChain</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">Own a Country NFT, command real-time multiplayer strategy, and let real-world news reshape the battlefield through on-chain oracle effects.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {address ? (
                <Link href="/dashboard" className="inline-flex items-center gap-2 rounded bg-radar px-5 py-3 font-bold text-obsidian"><Globe2 className="h-5 w-5" /> Enter World Map</Link>
              ) : (
                <button disabled={isPending} onClick={() => connect({ connector: connectors[0] })} className="inline-flex items-center gap-2 rounded bg-radar px-5 py-3 font-bold text-obsidian"><Wallet className="h-5 w-5" /> Connect MetaMask</button>
              )}
              <Link href="/marketplace" className="inline-flex items-center gap-2 rounded border border-amberline/40 px-5 py-3 font-bold text-amberline"><Shield className="h-5 w-5" /> Mint Your Country</Link>
            </div>
          </div>
          <div className="self-center rounded border border-white/10 bg-steel/80 p-5 shadow-tactical">
            <div className="grid grid-cols-3 gap-3">
              <Metric label="Players" value={realtime.onlinePlayers || 4} />
              <Metric label="Wars" value={wars.data?.length || 0} />
              <Metric label="Countries" value={countries.data?.length || 180} />
            </div>
            <div className="mt-5 rounded border border-white/10 bg-obsidian/50 p-4">
              <div className="mb-2 flex items-center gap-2 text-radar"><Newspaper className="h-4 w-4" /> Last News Event</div>
              <div className="text-sm text-slate-300">{news.data?.[0]?.headline || "Oracle feed booting"}</div>
            </div>
            <div className="mt-5 grid gap-2">
              {available.map((country) => (
                <Link key={country.id} href="/marketplace" className="flex items-center justify-between rounded border border-white/10 bg-obsidian/50 p-3 hover:border-radar/40">
                  <span>{country.name}</span>
                  <span className="text-radar">Available</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      <GlobalTicker items={realtime.ticker} />
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="rounded border border-white/10 bg-obsidian/50 p-3 text-center"><div className="text-2xl font-black text-white">{value}</div><div className="text-xs text-slate-400">{label}</div></div>;
}

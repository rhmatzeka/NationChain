"use client";

import Link from "next/link";
import { Activity, Landmark, Wallet } from "lucide-react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { shortWallet } from "@/lib/api";
import { useBalances } from "@/hooks/useBalances";

export function Header({ onlinePlayers }: { onlinePlayers: number }) {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const balances = useBalances();

  return (
    <header className="border-b border-white/10 bg-obsidian/95 backdrop-blur-lg">
      <div className="flex min-h-12 items-center justify-between gap-3 px-4 py-1.5">
        <Link href="/" className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded border border-radar/40 bg-radar/10">
            <Landmark className="h-4 w-4 text-radar" />
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-bold tracking-tight text-white">NationChain</div>
            <div className="text-[10px] leading-none text-slate-500">Sepolia</div>
          </div>
        </Link>
        
        <nav className="flex items-center gap-1.5 text-xs">
          <Link className="rounded px-2.5 py-1.5 hover:bg-white/5" href="/dashboard">Map</Link>
          <Link className="rounded px-2.5 py-1.5 hover:bg-white/5" href="/my-nfts">NFTs</Link>
          <Link className="rounded px-2.5 py-1.5 hover:bg-white/5" href="/leaderboard">Ranks</Link>
          <Link className="rounded px-2.5 py-1.5 hover:bg-white/5" href="/marketplace">Market</Link>
          <Link className="rounded px-2.5 py-1.5 hover:bg-white/5" href="/about">About</Link>
        </nav>
        
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="hidden items-center gap-1 rounded bg-radar/10 px-2 py-1 text-radar sm:inline-flex">
            <Activity className="h-3 w-3" /> {onlinePlayers}
          </span>
          {isConnected ? (
            <>
              <span className="hidden rounded bg-white/5 px-2 py-1 md:inline-block">
                {balances.isLoading ? "..." : balances.eth} ETH
              </span>
              <span className="hidden rounded bg-white/5 px-2 py-1 lg:inline-block">
                {balances.isLoading ? "..." : balances.nation} NATION
              </span>
              <span className="hidden rounded bg-white/5 px-2 py-1 xl:inline-block">
                {balances.isLoading ? "..." : balances.gov} GOV
              </span>
              <button onClick={() => disconnect()} className="inline-flex items-center gap-1.5 rounded bg-radar px-2.5 py-1.5 font-semibold text-obsidian hover:bg-radar/90">
                <Wallet className="h-3 w-3" /> {shortWallet(address)}
              </button>
            </>
          ) : (
            <button disabled={isPending} onClick={() => connect({ connector: connectors[0] })} className="inline-flex items-center gap-1.5 rounded bg-radar px-3 py-1.5 font-semibold text-obsidian hover:bg-radar/90 disabled:opacity-60">
              <Wallet className="h-3 w-3" /> Connect
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

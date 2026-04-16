"use client";

import { useRouter } from "next/navigation";
import { Rocket, ShoppingBag, Map, Trophy } from "lucide-react";

export function WelcomeGuide({ playerCountries }: { playerCountries: number }) {
  const router = useRouter();

  if (playerCountries > 0) return null;

  return (
    <div className="fixed inset-x-4 top-20 z-[100] mx-auto max-w-2xl">
      <div className="rounded-lg border-2 border-radar bg-obsidian/95 p-6 shadow-2xl backdrop-blur-md">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-radar/20 p-3">
            <Rocket className="h-8 w-8 text-radar" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">Welcome to NationChain! 🌍</h2>
            <p className="mt-2 text-slate-300">
              You don't own any countries yet. Get started by minting your first Country NFT!
            </p>
            
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <button
                onClick={() => router.push("/marketplace")}
                className="flex items-center gap-2 rounded bg-radar px-4 py-3 font-semibold text-obsidian hover:bg-radar/90 transition"
              >
                <ShoppingBag className="h-5 w-5" />
                <div className="text-left">
                  <div className="text-sm">Mint Country</div>
                  <div className="text-xs opacity-80">Start here!</div>
                </div>
              </button>
              
              <button
                onClick={() => router.push("/leaderboard")}
                className="flex items-center gap-2 rounded border border-white/20 bg-white/5 px-4 py-3 font-semibold text-white hover:bg-white/10 transition"
              >
                <Trophy className="h-5 w-5" />
                <div className="text-left">
                  <div className="text-sm">Leaderboard</div>
                  <div className="text-xs opacity-70">See rankings</div>
                </div>
              </button>
              
              <button
                onClick={() => {
                  const event = new CustomEvent("openTutorial");
                  window.dispatchEvent(event);
                }}
                className="flex items-center gap-2 rounded border border-white/20 bg-white/5 px-4 py-3 font-semibold text-white hover:bg-white/10 transition"
              >
                <Map className="h-5 w-5" />
                <div className="text-left">
                  <div className="text-sm">How to Play</div>
                  <div className="text-xs opacity-70">Learn more</div>
                </div>
              </button>
            </div>

            <div className="mt-4 rounded border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200">
              <strong>💡 Tip:</strong> You need Sepolia ETH to mint countries. Get free testnet ETH from{" "}
              <a
                href="https://sepoliafaucet.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-amber-100"
              >
                Sepolia Faucet
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

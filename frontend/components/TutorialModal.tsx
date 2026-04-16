"use client";

import { useState } from "react";
import { X, ChevronRight, ChevronLeft, Landmark, Map, Swords, Coins, Users } from "lucide-react";

const tutorialSteps = [
  {
    title: "Welcome to NationChain! 🌍",
    icon: Landmark,
    content: (
      <div className="space-y-3">
        <p>You are now a president of a nation in a blockchain-powered world!</p>
        <div className="rounded border border-radar/30 bg-radar/10 p-4">
          <p className="font-semibold text-radar mb-2">Your Mission:</p>
          <ul className="space-y-1 text-sm">
            <li>• Manage your country's economy and military</li>
            <li>• Declare wars and form alliances</li>
            <li>• Trade resources and build infrastructure</li>
            <li>• Earn NATION and GOV tokens</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    title: "Getting Started 🎮",
    icon: Map,
    content: (
      <div className="space-y-3">
        <p className="font-semibold text-white">First, you need a country!</p>
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-3 p-3 rounded bg-obsidian/50 border border-white/10">
            <div className="text-2xl">1️⃣</div>
            <div>
              <p className="font-semibold text-radar">Connect Your Wallet</p>
              <p className="text-slate-300">Click "Connect MetaMask" in the top right corner</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded bg-obsidian/50 border border-white/10">
            <div className="text-2xl">2️⃣</div>
            <div>
              <p className="font-semibold text-radar">Mint a Country NFT</p>
              <p className="text-slate-300">Go to Marketplace and mint your country (costs ETH on Sepolia testnet)</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded bg-obsidian/50 border border-white/10">
            <div className="text-2xl">3️⃣</div>
            <div>
              <p className="font-semibold text-radar">Start Playing!</p>
              <p className="text-slate-300">Your country will appear on the map with a colored marker</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "The World Map 🗺️",
    icon: Map,
    content: (
      <div className="space-y-3">
        <p>The map shows all 180 countries in real-time:</p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-3 p-2 rounded bg-obsidian/50">
            <div className="w-4 h-4 rounded-full bg-cyan-400"></div>
            <span><strong className="text-cyan-400">Colored dots</strong> = Countries owned by players</span>
          </div>
          <div className="flex items-center gap-3 p-2 rounded bg-obsidian/50">
            <div className="w-4 h-4 rounded-full bg-slate-500"></div>
            <span><strong className="text-slate-400">Gray dots</strong> = Available countries (not owned)</span>
          </div>
          <div className="flex items-center gap-3 p-2 rounded bg-obsidian/50">
            <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse"></div>
            <span><strong className="text-red-400">Red pulsing</strong> = Countries at war</span>
          </div>
        </div>
        <p className="text-sm text-slate-300 mt-3">
          <strong>Tip:</strong> Click any country on the map to see its details, then click "Show Dashboard" to manage it!
        </p>
      </div>
    )
  },
  {
    title: "Managing Your Nation 🏛️",
    icon: Landmark,
    content: (
      <div className="space-y-3">
        <p>Once you own a country, you can:</p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="p-3 rounded border border-radar/30 bg-radar/5">
            <p className="font-semibold text-radar mb-1">💰 Economy</p>
            <p className="text-slate-300">Manage resources, adjust tax rates, invest in ministries</p>
          </div>
          <div className="p-3 rounded border border-amber-500/30 bg-amber-500/5">
            <p className="font-semibold text-amber-400 mb-1">⚔️ Military</p>
            <p className="text-slate-300">Build army, declare wars, defend your nation</p>
          </div>
          <div className="p-3 rounded border border-blue-500/30 bg-blue-500/5">
            <p className="font-semibold text-blue-400 mb-1">🤝 Diplomacy</p>
            <p className="text-slate-300">Form alliances, trade with others, vote in UN</p>
          </div>
          <div className="p-3 rounded border border-green-500/30 bg-green-500/5">
            <p className="font-semibold text-green-400 mb-1">💎 Treasury</p>
            <p className="text-slate-300">Claim GOV tokens, stake NATION, manage NFTs</p>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Ready to Play! 🚀",
    icon: Users,
    content: (
      <div className="space-y-4">
        <p className="text-lg">You're all set to become a world leader!</p>
        <div className="rounded border border-radar/40 bg-radar/10 p-4">
          <p className="font-semibold text-radar mb-2">Quick Tips:</p>
          <ul className="space-y-1 text-sm text-slate-200">
            <li>• Check the <strong>News</strong> button for real-world events affecting gameplay</li>
            <li>• Visit <strong>War Room</strong> to see active battles</li>
            <li>• Go to <strong>Leaderboard</strong> to see top countries</li>
            <li>• Visit <strong>Marketplace</strong> to trade Country NFTs and Buildings</li>
          </ul>
        </div>
        <p className="text-sm text-slate-400 text-center">
          Don't have a country yet? Connect your wallet and head to the Marketplace!
        </p>
      </div>
    )
  }
];

export function TutorialModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0);

  if (!open) return null;

  const currentStep = tutorialSteps[step];
  const Icon = currentStep.icon;

  return (
    <div className="fixed inset-0 z-[1500] grid place-items-center bg-black/80 backdrop-blur-sm p-4">
      <section className="w-full max-w-2xl rounded-lg border border-radar/40 bg-steel/95 backdrop-blur-md shadow-2xl">
        <div className="flex items-start justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-radar/20 border border-radar/40">
              <Icon className="h-6 w-6 text-radar" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{currentStep.title}</h2>
              <p className="text-xs text-slate-400">Step {step + 1} of {tutorialSteps.length}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded border border-white/10 p-2 hover:bg-white/10 transition">
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        <div className="p-6 text-slate-200">
          {currentStep.content}
        </div>

        <div className="flex items-center justify-between p-6 border-t border-white/10">
          <div className="flex gap-1">
            {tutorialSteps.map((_, i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-full transition ${
                  i === step ? "bg-radar w-6" : "bg-white/20"
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="inline-flex items-center gap-2 rounded border border-white/20 px-4 py-2 font-semibold text-white hover:bg-white/5 transition"
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </button>
            )}
            {step < tutorialSteps.length - 1 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="inline-flex items-center gap-2 rounded bg-radar px-4 py-2 font-semibold text-obsidian hover:bg-radar/90 transition"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="inline-flex items-center gap-2 rounded bg-radar px-6 py-2 font-semibold text-obsidian hover:bg-radar/90 transition"
              >
                Let's Go! 🚀
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

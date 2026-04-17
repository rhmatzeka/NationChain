"use client";

import { useState } from "react";
import { Swords, X, AlertTriangle, Target } from "lucide-react";
import { useAccount } from "wagmi";
import type { Country } from "@/types/game";

export function DeclareWarModal({ 
  open, 
  onClose, 
  currentCountry,
  availableCountries,
  onSuccess
}: { 
  open: boolean; 
  onClose: () => void;
  currentCountry?: Country;
  availableCountries: Country[];
  onSuccess?: (message: string) => void;
}) {
  const { address, isConnected } = useAccount();
  const [selectedTarget, setSelectedTarget] = useState<number | null>(null);
  const [declaring, setDeclaring] = useState(false);

  const handleDeclare = async () => {
    if (!selectedTarget || !currentCountry || !isConnected || !address) return;
    
    setDeclaring(true);
    try {
      const response = await fetch(`http://localhost:4000/api/war/declare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attackerId: currentCountry.id,
          defenderId: selectedTarget,
          wallet: address
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to declare war');
      }

      onSuccess?.(`⚔️ War declared successfully against ${availableCountries.find(c => c.id === selectedTarget)?.name}!`);
      onClose();
    } catch (error: any) {
      console.error("Declare war error:", error);
      onSuccess?.(`❌ Failed: ${error.message || 'Transaction rejected'}`);
    } finally {
      setDeclaring(false);
    }
  };

  if (!open) return null;

  const targetCountry = availableCountries.find(c => c.id === selectedTarget);
  const cost = 1000;

  return (
    <div className="fixed inset-0 z-[1300] grid place-items-center bg-black/80 p-4 backdrop-blur-sm">
      <section className="w-full max-w-3xl rounded-lg border border-alert/40 bg-steel/95 backdrop-blur-md p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-alert">
              <Swords className="h-6 w-6" />
              <span className="text-sm uppercase font-semibold">Declare War</span>
            </div>
            <h2 className="mt-2 text-3xl font-bold text-white">Military Action</h2>
            <p className="mt-1 text-sm text-slate-400">Select a target nation to initiate military conflict</p>
          </div>
          <button onClick={onClose} className="rounded border border-white/10 p-2 hover:bg-white/10 transition">
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Warning Banner */}
        <div className="mt-6 flex items-start gap-3 rounded border border-amber-500/40 bg-amber-500/10 p-4">
          <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-amber-400">Warning: Act of War</p>
            <p className="text-amber-200/80 mt-1">This action will initiate a 1-hour battle. Your military forces will be committed. Cost: {cost} NATION tokens.</p>
          </div>
        </div>

        {!isConnected && (
          <div className="mt-4 rounded border border-alert/40 bg-alert/10 p-3 text-center text-sm text-alert">
            Please connect your wallet to declare war
          </div>
        )}

        {/* Current Country Info */}
        <div className="mt-6 rounded border border-white/10 bg-obsidian/50 p-4">
          <div className="text-xs text-slate-400 mb-1">YOUR NATION</div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold text-white">{currentCountry?.name || "Unknown"}</div>
              <div className="text-sm text-slate-300">Military Strength: {currentCountry?.military || 0}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400">GDP</div>
              <div className="text-lg font-semibold text-radar">{currentCountry?.gdp || 0}</div>
            </div>
          </div>
        </div>

        {/* Target Selection */}
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-5 w-5 text-alert" />
            <label className="text-sm font-semibold text-white">Select Target Nation</label>
          </div>
          <div className="max-h-64 overflow-y-auto rounded border border-white/10 bg-obsidian/50">
            {availableCountries
              .filter(c => c.id !== currentCountry?.id)
              .slice(0, 20)
              .map((country) => (
                <button
                  key={country.id}
                  onClick={() => setSelectedTarget(country.id)}
                  className={`w-full flex items-center justify-between p-3 border-b border-white/10 hover:bg-white/5 transition ${
                    selectedTarget === country.id ? 'bg-alert/20 border-alert/40' : ''
                  }`}
                >
                  <div className="text-left">
                    <div className="font-semibold text-white">{country.name}</div>
                    <div className="text-xs text-slate-400">{country.ideology}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Military</div>
                    <div className="text-sm font-semibold text-amber-400">{country.military}</div>
                  </div>
                </button>
              ))}
          </div>
        </div>

        {/* Selected Target Preview */}
        {targetCountry && (
          <div className="mt-4 rounded border border-alert/40 bg-alert/10 p-4">
            <div className="text-xs text-alert mb-2">TARGET SELECTED</div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-white">{targetCountry.name}</div>
                <div className="text-sm text-slate-300">Military: {targetCountry.military} | GDP: {targetCountry.gdp}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">Win Probability</div>
                <div className="text-2xl font-bold text-radar">
                  {Math.round((currentCountry?.military || 0) / ((currentCountry?.military || 1) + targetCountry.military) * 100)}%
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded border border-white/20 px-4 py-3 font-semibold text-white hover:bg-white/5 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleDeclare}
            disabled={!selectedTarget || declaring || !isConnected}
            className="flex-1 rounded bg-alert px-4 py-3 font-semibold text-white hover:bg-alert/90 disabled:opacity-50 disabled:cursor-not-allowed transition inline-flex items-center justify-center gap-2"
          >
            <Swords className="h-5 w-5" />
            {declaring ? "Declaring War..." : `Declare War (${cost} NATION)`}
          </button>
        </div>
      </section>
    </div>
  );
}

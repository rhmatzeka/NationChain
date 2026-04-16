"use client";

import { X, Crown, Shield, Swords, TrendingUp } from "lucide-react";
import type { Country } from "@/types/game";
import { getCountryLeader } from "@/lib/countryLeaders";

interface CountryLeaderPopupProps {
  country: Country;
  onClose: () => void;
  onViewDashboard: () => void;
}

export function CountryLeaderPopup({ country, onClose, onViewDashboard }: CountryLeaderPopupProps) {
  const leader = getCountryLeader(country.name);
  const isOwned = !!country.ownerWallet;

  return (
    <>
      {/* Character Portrait - Bottom Left Corner */}
      <div className="fixed bottom-4 left-4 z-[1600] animate-in slide-in-from-left duration-500">
        <div className="relative">
          {/* Character Image */}
          <div className="relative h-64 w-48 rounded-lg border-2 border-radar/40 bg-gradient-to-br from-obsidian via-steel to-obsidian shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(48,232,189,0.2),transparent)]"></div>
            <div className="relative flex flex-col items-center justify-center h-full p-4">
              <div className="text-9xl mb-2">{leader.avatar}</div>
              <div className="rounded-full bg-obsidian/90 px-3 py-1 text-xs font-semibold text-radar border border-radar/40">
                {leader.title}
              </div>
            </div>
          </div>
          
          {/* Name Badge */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[90%] rounded-lg border border-radar/40 bg-obsidian/95 px-3 py-2 text-center shadow-xl backdrop-blur-sm">
            <div className="text-sm font-bold text-white truncate">{leader.name}</div>
            <div className="text-xs text-slate-400 truncate">{country.name}</div>
          </div>
        </div>
      </div>

      {/* Info Panel - Bottom Right */}
      <div className="fixed bottom-4 right-4 z-[1600] w-80 animate-in slide-in-from-right duration-500">
        <div className="rounded-lg border-2 border-radar/40 bg-obsidian/95 shadow-2xl backdrop-blur-md">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute -right-2 -top-2 rounded-full border-2 border-radar/40 bg-obsidian p-1.5 shadow-lg hover:bg-steel transition z-10"
          >
            <X className="h-4 w-4 text-white" />
          </button>

          <div className="p-4">
            {/* Country Name */}
            <div className="mb-3 flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-400" />
              <h2 className="text-xl font-bold text-white">{country.name}</h2>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="rounded border border-white/10 bg-obsidian/50 p-2">
                <div className="flex items-center gap-1.5 mb-1">
                  <TrendingUp className="h-3 w-3 text-green-400" />
                  <span className="text-xs text-slate-400">GDP</span>
                </div>
                <div className="text-base font-bold text-white">${country.gdp}B</div>
              </div>
              <div className="rounded border border-white/10 bg-obsidian/50 p-2">
                <div className="flex items-center gap-1.5 mb-1">
                  <Swords className="h-3 w-3 text-red-400" />
                  <span className="text-xs text-slate-400">Military</span>
                </div>
                <div className="text-base font-bold text-white">{country.military}</div>
              </div>
              <div className="rounded border border-white/10 bg-obsidian/50 p-2">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-xs">😊</span>
                  <span className="text-xs text-slate-400">Happiness</span>
                </div>
                <div className="text-base font-bold text-white">{country.happiness}%</div>
              </div>
              <div className="rounded border border-white/10 bg-obsidian/50 p-2">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-xs">🛢️</span>
                  <span className="text-xs text-slate-400">Oil</span>
                </div>
                <div className="text-base font-bold text-white">{country.oil}</div>
              </div>
            </div>

            {/* Status Badge */}
            <div className="mb-3 rounded border border-radar/30 bg-radar/10 p-2 text-center">
              {isOwned ? (
                <div className="flex items-center justify-center gap-2">
                  <Shield className="h-3 w-3 text-radar" />
                  <span className="text-xs font-semibold text-radar">
                    Owned by Player
                  </span>
                </div>
              ) : (
                <span className="text-xs text-slate-400">
                  Available for Conquest
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 rounded border border-white/20 bg-white/5 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10 transition"
              >
                Close
              </button>
              <button
                onClick={onViewDashboard}
                className="flex-1 rounded bg-radar px-3 py-2 text-sm font-semibold text-obsidian hover:bg-radar/90 transition"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[1500] bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-300"
        onClick={onClose}
      ></div>
    </>
  );
}

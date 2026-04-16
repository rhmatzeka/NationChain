"use client";

import { useMemo, useState } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import { Swords, Crown } from "lucide-react";
import type { Country, War } from "@/types/game";
import { shortWallet } from "@/lib/api";

export function WorldMap({ countries, wars, onSelect, ownedCountryId }: { countries: Country[]; wars: War[]; onSelect?: (country: Country) => void; ownedCountryId?: number }) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const atWar = useMemo(() => new Set(wars.flatMap((war) => [war.attackerId, war.defenderId])), [wars]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <MapContainer center={[20, 10]} zoom={2} minZoom={2} maxZoom={6} scrollWheelZoom className="z-0 h-full w-full">
        <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {countries.map((country) => {
          const war = atWar.has(country.id);
          const isOwned = country.id === ownedCountryId;
          const radius = isOwned ? 18 : Math.max(7, Math.min(22, 6 + country.gdp / 1500));
          
          return (
            <CircleMarker
              key={country.id}
              center={[country.latitude, country.longitude]}
              radius={radius}
              pathOptions={{
                color: war ? "#ff4d5a" : isOwned ? "#fbbf24" : country.ownerWallet ? country.color : "#64748b",
                fillColor: isOwned ? "#fbbf24" : country.ownerWallet ? country.color : "#334155",
                fillOpacity: isOwned ? 0.9 : country.ownerWallet ? 0.72 : 0.42,
                weight: isOwned ? 5 : war ? 4 : selectedId === country.id ? 3 : 1
              }}
              eventHandlers={{
                click: () => {
                  setSelectedId(country.id);
                  onSelect?.(country);
                }
              }}
            >
              <Popup>
                <div className="min-w-56 text-slate-900">
                  <div className="flex items-center gap-2 text-lg font-bold">
                    {isOwned && <Crown className="h-5 w-5 text-amber-500" />}
                    {war && <Swords className="h-4 w-4 text-red-600" />}
                    {country.name}
                  </div>
                  {isOwned && <div className="text-xs text-amber-600 font-semibold">YOUR NATION</div>}
                  <div className="mt-1 text-xs">Owner: {shortWallet(country.ownerWallet)}</div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <span>GDP: {country.gdp}</span>
                    <span>Military: {country.military}</span>
                    <span>Happiness: {country.happiness}%</span>
                    <span>Oil: {country.oil}</span>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
      <div className="pointer-events-none absolute left-4 top-24 z-[500] space-y-2">
        <div className="rounded border border-radar/30 bg-obsidian/85 px-4 py-2.5 text-sm text-slate-200 backdrop-blur">
          <div className="font-semibold text-radar text-xs">Live World Map</div>
          <div className="text-xs">{countries.length} countries | {wars.length} wars</div>
        </div>
        
        {/* Legend - Below map info */}
        <div className="rounded border border-white/20 bg-obsidian/85 px-3 py-2 text-xs text-slate-200 backdrop-blur">
          <div className="font-semibold text-white mb-1.5 text-xs">Legend</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-500 flex-shrink-0"></div>
              <span className="text-xs">Your Nation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 flex-shrink-0"></div>
              <span className="text-xs">Player Owned</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-500 flex-shrink-0"></div>
              <span className="text-xs">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse flex-shrink-0"></div>
              <span className="text-xs">At War</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

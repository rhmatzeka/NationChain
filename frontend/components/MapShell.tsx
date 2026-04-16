"use client";

import dynamic from "next/dynamic";
import type { Country, War } from "@/types/game";

const DynamicWorldMap = dynamic(() => import("./WorldMap").then((mod) => mod.WorldMap), {
  ssr: false,
  loading: () => <div className="grid h-full w-full place-items-center bg-steel text-radar">Loading world map</div>
});

export function MapShell(props: { countries: Country[]; wars: War[]; onSelect?: (country: Country) => void; ownedCountryId?: number }) {
  return <DynamicWorldMap {...props} />;
}

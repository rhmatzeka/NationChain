import type { CommodityPrice, Country, Leaderboard, NewsEvent, War } from "@/types/game";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export const api = {
  countries: () => getJson<Country[]>("/api/countries"),
  country: (id: number) => getJson<Country & { warHistory: War[] }>(`/api/country/${id}`),
  player: (wallet: string) => getJson(`/api/player/${wallet}`),
  activeWars: () => getJson<War[]>("/api/wars/active"),
  news: (type = "all") => getJson<NewsEvent[]>(`/api/news/feed?type=${type}`),
  leaderboard: () => getJson<Leaderboard>("/api/leaderboard"),
  commodities: () => getJson<CommodityPrice>("/api/commodities")
};

export function shortWallet(wallet?: string | null) {
  if (!wallet) return "Unclaimed";
  return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
}

export const buildingNames: Record<number, string> = {
  1: "Factory",
  2: "Mine",
  3: "Barracks",
  4: "Oil Derrick",
  5: "Power Plant",
  6: "Embassy"
};

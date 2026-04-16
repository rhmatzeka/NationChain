"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useCountries() {
  return useQuery({ queryKey: ["countries"], queryFn: api.countries, refetchInterval: 15_000 });
}

export function useActiveWars() {
  return useQuery({ queryKey: ["wars", "active"], queryFn: api.activeWars, refetchInterval: 10_000 });
}

export function useNews(type = "all") {
  return useQuery({ queryKey: ["news", type], queryFn: () => api.news(type), refetchInterval: 30_000 });
}

export function useLeaderboard() {
  return useQuery({ queryKey: ["leaderboard"], queryFn: api.leaderboard, refetchInterval: 30_000 });
}

export function useCommodities() {
  return useQuery({ queryKey: ["commodities"], queryFn: api.commodities, refetchInterval: 60_000 });
}

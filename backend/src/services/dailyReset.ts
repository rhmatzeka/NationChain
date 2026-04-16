import type { NationChainIO } from "../websocket/server.js";
import { emitTicker } from "../websocket/server.js";
import { prisma } from "../prisma.js";

export async function runDailyReset(io: NationChainIO) {
  const byGdp = await prisma.country.findMany({ orderBy: { gdp: "desc" }, take: 20 });
  const byMilitary = await prisma.country.findMany({ orderBy: { military: "desc" }, take: 20 });
  const byTokens = await prisma.country.findMany({ orderBy: { tokensEarned: "desc" }, take: 20 });
  const date = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate()));
  const snapshot = await prisma.leaderboardSnapshot.upsert({
    where: { date },
    update: { rankingsByGdp: byGdp, rankingsByMilitary: byMilitary, rankingsByTokens: byTokens },
    create: { date, rankingsByGdp: byGdp, rankingsByMilitary: byMilitary, rankingsByTokens: byTokens }
  });

  if (new Date().getUTCDay() === 0) {
    const topTen = byTokens.slice(0, 10);
    await Promise.all(topTen.map((country: { id: number }, index: number) => prisma.country.update({ where: { id: country.id }, data: { tokensEarned: { increment: 1000 - index * 75 } } })));
  }

  io.to("world_map").emit("daily_reset", snapshot);
  emitTicker(io, "daily_reset", "Daily production window reset and leaderboard snapshots are live");
  return snapshot;
}

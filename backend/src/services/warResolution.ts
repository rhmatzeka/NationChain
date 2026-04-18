import type { NationChainIO } from "../websocket/server.js";
import { emitTicker } from "../websocket/server.js";
import { prisma } from "../prisma.js";
import { resolveWarOnChain } from "./blockchain.js";

export async function resolveActiveWars(io: NationChainIO) {
  const now = new Date();
  
  // Find wars that have ended
  const endedWars = await prisma.war.findMany({
    where: {
      status: "active",
      endTime: {
        lte: now
      }
    },
    include: {
      attacker: true,
      defender: true
    }
  });

  console.log(`⚔️ Resolving ${endedWars.length} ended wars...`);

  for (const war of endedWars) {
    await resolveWar(io, war);
  }

  return endedWars.length;
}

async function resolveWar(io: NationChainIO, war: any) {
  const attacker = war.attacker;
  const defender = war.defender;

  // Calculate battle outcome
  const attackerPower = attacker.military;
  const defenderPower = defender.military;
  
  // Add randomness (±20%)
  const attackerRoll = attackerPower * (0.8 + Math.random() * 0.4);
  const defenderRoll = defenderPower * (0.8 + Math.random() * 0.4);
  
  const attackerWins = attackerRoll > defenderRoll;
  const winnerId = attackerWins ? attacker.id : defender.id;
  const loserId = attackerWins ? defender.id : attacker.id;
  
  const winner = attackerWins ? attacker : defender;
  const loser = attackerWins ? defender : attacker;

  // Calculate rewards and penalties
  const territoryGain = Math.floor(loser.territory * 0.05); // 5% territory
  const gdpGain = Math.floor(loser.gdp * 0.1); // 10% GDP
  const militaryLoss = Math.floor(winner.military * 0.15); // Winner loses 15% military
  const loserMilitaryLoss = Math.floor(loser.military * 0.3); // Loser loses 30% military
  const tokenReward = 2000; // Winner gets 2000 NATION tokens

  // Update winner
  await prisma.country.update({
    where: { id: winner.id },
    data: {
      territory: winner.territory + territoryGain,
      gdp: winner.gdp + gdpGain,
      military: Math.max(50, winner.military - militaryLoss),
      tokensEarned: winner.tokensEarned + tokenReward,
      warsWon: winner.warsWon + 1,
      happiness: Math.min(100, winner.happiness + 5)
    }
  });

  // Update loser
  await prisma.country.update({
    where: { id: loser.id },
    data: {
      territory: Math.max(10000, loser.territory - territoryGain),
      gdp: Math.max(100, loser.gdp - gdpGain),
      military: Math.max(20, loser.military - loserMilitaryLoss),
      happiness: Math.max(0, loser.happiness - 10)
    }
  });

  // Update war record
  const battleLog = [
    {
      timestamp: new Date().toISOString(),
      event: "battle_start",
      attackerPower,
      defenderPower
    },
    {
      timestamp: new Date().toISOString(),
      event: "battle_end",
      winner: winner.name,
      loser: loser.name,
      attackerRoll: Math.round(attackerRoll),
      defenderRoll: Math.round(defenderRoll)
    },
    {
      timestamp: new Date().toISOString(),
      event: "rewards",
      territoryGain,
      gdpGain,
      tokenReward,
      militaryLoss: {
        winner: militaryLoss,
        loser: loserMilitaryLoss
      }
    }
  ];

  await prisma.war.update({
    where: { id: war.id },
    data: {
      status: "completed",
      winnerId,
      battleLog
    }
  });

  // Try to resolve on-chain (optional, may fail if not configured)
  await resolveWarOnChain(war.id, winnerId).catch(() => {
    console.log(`⚠️ Could not resolve war ${war.id} on-chain (oracle not configured)`);
  });

  // Emit real-time updates
  io.to("world_map").emit("war_resolved", {
    warId: war.id,
    winner: winner.name,
    loser: loser.name,
    rewards: {
      territory: territoryGain,
      gdp: gdpGain,
      tokens: tokenReward
    }
  });

  emitTicker(
    io,
    "war_resolved",
    `⚔️ ${winner.name} defeated ${loser.name}! Gained ${territoryGain.toLocaleString()}km² territory and ${tokenReward} NATION tokens!`
  );

  console.log(`✅ War ${war.id} resolved: ${winner.name} defeated ${loser.name}`);
}

// Schedule war resolution every minute
export function scheduleWarResolution(io: NationChainIO) {
  setInterval(() => {
    resolveActiveWars(io).catch(console.error);
  }, 60000); // Check every minute

  console.log("⚔️ War resolution scheduler started (checks every minute)");
}

import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma.js";
import type { NationChainIO } from "../websocket/server.js";
import { injectManualNews } from "../services/newsOracle.js";
import { initializeCountryOnChain, mintGovTokens } from "../services/blockchain.js";

export function apiRouter(io: NationChainIO) {
  const router = Router();

  router.get("/health", (_req, res) => res.json({ ok: true, service: "nationchain-backend", time: new Date().toISOString() }));

  router.get("/countries", async (_req, res, next) => {
    try {
      const countries = await prisma.country.findMany({ include: { buildings: true }, orderBy: { id: "asc" } });
      res.json(countries);
    } catch (error) {
      next(error);
    }
  });

  router.get("/country/:id", async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const country = await prisma.country.findUnique({
        where: { id },
        include: {
          buildings: true,
          attacks: { orderBy: { startTime: "desc" }, take: 20 },
          defenses: { orderBy: { startTime: "desc" }, take: 20 }
        }
      });
      if (!country) return res.status(404).json({ error: "Country not found" });
      res.json({ ...country, warHistory: [...country.attacks, ...country.defenses].sort((a, b) => b.startTime.getTime() - a.startTime.getTime()) });
    } catch (error) {
      next(error);
    }
  });

  router.post("/country/:id/mint", async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const schema = z.object({ wallet: z.string().regex(/^0x[a-fA-F0-9]{40}$/) });
      const { wallet } = schema.parse(req.body);

      const country = await prisma.country.findUnique({ where: { id } });
      if (!country) return res.status(404).json({ error: "Country not found" });
      if (country.ownerWallet) return res.status(400).json({ error: "Country already owned" });

      // Calculate population from GDP (rough estimate: GDP per capita ~$10k)
      const estimatedPopulation = Math.floor(country.gdp * 100);

      const stats = {
        gdp: country.gdp || 1000,
        population: estimatedPopulation || 1000000,
        militaryPower: country.military || 100,
        happiness: country.happiness || 50,
        oilReserves: country.oil || 0,
        territory: country.territory || 100000
      };

      console.log("Minting country:", country.name, "Stats:", stats);

      const result = await initializeCountryOnChain(
        wallet,
        country.id,
        country.name,
        country.isoCode,
        stats
      );

      if (result.skipped) {
        return res.status(500).json({ error: `Blockchain error: ${result.reason}` });
      }

      console.log("Mint successful! TxHash:", result.hash);

      await prisma.country.update({
        where: { id },
        data: { ownerWallet: wallet.toLowerCase() }
      });

      await prisma.player.upsert({
        where: { wallet: wallet.toLowerCase() },
        update: { lastSeen: new Date() },
        create: { wallet: wallet.toLowerCase() }
      });

      io.emit("country:minted", { countryId: id, owner: wallet, txHash: result.hash });

      res.json({ success: true, txHash: result.hash, country: { ...country, ownerWallet: wallet.toLowerCase() } });
    } catch (error) {
      console.error("Mint error:", error);
      next(error);
    }
  });

  router.get("/player/:wallet", async (req, res, next) => {
    try {
      const wallet = req.params.wallet.toLowerCase();
      const player = await prisma.player.upsert({
        where: { wallet },
        update: { lastSeen: new Date() },
        create: { wallet },
        include: { countries: { include: { buildings: true } } }
      });
      res.json({ ...player, balances: { eth: "0", nation: "0", gov: "0" } });
    } catch (error) {
      next(error);
    }
  });

  router.get("/wars/active", async (_req, res, next) => {
    try {
      const wars = await prisma.war.findMany({ where: { status: "active" }, include: { attacker: true, defender: true }, orderBy: { startTime: "desc" } });
      res.json(wars);
    } catch (error) {
      next(error);
    }
  });

  router.get("/news/feed", async (req, res, next) => {
    try {
      const eventType = typeof req.query.type === "string" && req.query.type !== "all" ? req.query.type : undefined;
      const events = await prisma.newsEvent.findMany({
        where: eventType ? { eventType } : undefined,
        orderBy: { createdAt: "desc" },
        take: 50
      });
      res.json(events);
    } catch (error) {
      next(error);
    }
  });

  router.get("/leaderboard", async (_req, res, next) => {
    try {
      const [gdp, military, tokens, wars] = await Promise.all([
        prisma.country.findMany({ orderBy: { gdp: "desc" }, take: 20 }),
        prisma.country.findMany({ orderBy: { military: "desc" }, take: 20 }),
        prisma.country.findMany({ orderBy: { tokensEarned: "desc" }, take: 20 }),
        prisma.country.findMany({ orderBy: { warsWon: "desc" }, take: 20 })
      ]);
      res.json({ gdp, military, tokens, wars });
    } catch (error) {
      next(error);
    }
  });

  router.get("/commodities", async (_req, res, next) => {
    try {
      const latest = await prisma.commodityPrice.findFirst({ orderBy: { timestamp: "desc" } });
      res.json(latest || { oilUsd: 82.4, goldUsd: 2380.8, appliedMultiplier: { oil: 1, gold: 1 } });
    } catch (error) {
      next(error);
    }
  });

  router.post("/news/manual", async (req, res, next) => {
    try {
      const schema = z.object({
        headline: z.string().min(8),
        sourceUrl: z.string().url().optional(),
        impact: z.any().optional()
      });
      const payload = schema.parse(req.body);
      const event = await injectManualNews(io, payload);
      res.status(201).json(event);
    } catch (error) {
      next(error);
    }
  });

  router.post("/war/declare", async (req, res, next) => {
    try {
      const schema = z.object({
        attackerId: z.number(),
        defenderId: z.number(),
        wallet: z.string().regex(/^0x[a-fA-F0-9]{40}$/)
      });
      const { attackerId, defenderId, wallet } = schema.parse(req.body);

      const attacker = await prisma.country.findUnique({ where: { id: attackerId } });
      const defender = await prisma.country.findUnique({ where: { id: defenderId } });

      if (!attacker || !defender) {
        return res.status(404).json({ error: "Country not found" });
      }

      if (attacker.ownerWallet?.toLowerCase() !== wallet.toLowerCase()) {
        return res.status(403).json({ error: "You don't own this country" });
      }

      // Create war in database
      const war = await prisma.war.create({
        data: {
          attackerId,
          defenderId,
          startTime: new Date(),
          endTime: new Date(Date.now() + 2 * 60 * 1000), // 2 minutes for testing
          status: "active",
          battleLog: []
        }
      });

      // Emit real-time update
      io.emit("war:declared", { war, attacker, defender });

      res.json({ success: true, war });
    } catch (error) {
      console.error("Declare war error:", error);
      next(error);
    }
  });

  router.post("/country/:id/claim-gov", async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const schema = z.object({ wallet: z.string().regex(/^0x[a-fA-F0-9]{40}$/) });
      const { wallet } = schema.parse(req.body);

      const country = await prisma.country.findUnique({ where: { id } });
      if (!country) return res.status(404).json({ error: "Country not found" });
      
      if (country.ownerWallet?.toLowerCase() !== wallet.toLowerCase()) {
        return res.status(403).json({ error: "You don't own this country" });
      }

      // Calculate daily GOV tokens
      const dailyGov = Math.round(country.gdp / 80 + country.happiness * 2 + country.oil * 1.2);

      console.log("Minting GOV tokens:", dailyGov, "to", wallet);

      // Mint GOV tokens to user's wallet
      const result = await mintGovTokens(wallet, dailyGov);

      if (result.skipped) {
        return res.status(500).json({ error: `Blockchain error: ${result.reason}` });
      }

      console.log("GOV mint successful! TxHash:", result.hash);

      // Update tokens earned in database
      const updated = await prisma.country.update({
        where: { id },
        data: { tokensEarned: country.tokensEarned + dailyGov }
      });

      io.emit("country:claimed", { countryId: id, amount: dailyGov, txHash: result.hash });

      res.json({ success: true, claimed: dailyGov, newTotal: updated.tokensEarned, txHash: result.hash });
    } catch (error) {
      console.error("Claim GOV error:", error);
      next(error);
    }
  });

  router.post("/country/:id/stake-nation", async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const schema = z.object({ 
        wallet: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
        amount: z.number().min(1)
      });
      const { wallet, amount } = schema.parse(req.body);

      const country = await prisma.country.findUnique({ where: { id } });
      if (!country) return res.status(404).json({ error: "Country not found" });
      
      if (country.ownerWallet?.toLowerCase() !== wallet.toLowerCase()) {
        return res.status(403).json({ error: "You don't own this country" });
      }

      // Increase military power based on staked amount
      const militaryBoost = Math.floor(amount / 100);
      
      const updated = await prisma.country.update({
        where: { id },
        data: { 
          military: country.military + militaryBoost,
          tokensEarned: country.tokensEarned + amount
        }
      });

      io.emit("country:staked", { countryId: id, amount, militaryBoost });

      res.json({ success: true, staked: amount, militaryBoost, newMilitary: updated.military });
    } catch (error) {
      console.error("Stake NATION error:", error);
      next(error);
    }
  });

  return router;
}

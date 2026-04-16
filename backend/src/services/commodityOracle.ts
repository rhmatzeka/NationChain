import type { NationChainIO } from "../websocket/server.js";
import { emitTicker } from "../websocket/server.js";
import { prisma } from "../prisma.js";
import { config } from "../config.js";
import { updateCommodityMultipliersOnChain } from "./blockchain.js";

export async function runCommodityOracle(io: NationChainIO) {
  const prices = await fetchCommodityPrices();
  const oilMultiplier = Math.max(0.7, Math.min(1.8, prices.oilUsd / 75));
  const goldMultiplier = Math.max(0.8, Math.min(1.5, prices.goldUsd / 2100));
  const record = await prisma.commodityPrice.create({
    data: {
      oilUsd: prices.oilUsd,
      goldUsd: prices.goldUsd,
      appliedMultiplier: { oil: oilMultiplier, gold: goldMultiplier }
    }
  });

  await prisma.country.updateMany({
    where: { oil: { gte: 70 } },
    data: { tokensEarned: { increment: Math.round(25 * oilMultiplier) } }
  });

  await updateCommodityMultipliersOnChain(Math.round(oilMultiplier * 10_000), Math.round(goldMultiplier * 10_000)).catch(() => undefined);
  io.to("world_map").emit("commodity_update", record);
  emitTicker(io, "commodity_update", `Oil $${prices.oilUsd.toFixed(2)} and gold $${prices.goldUsd.toFixed(2)} synced into production multipliers`);
  return record;
}

async function fetchCommodityPrices() {
  if (!config.alphaVantageKey) return { oilUsd: 82.4, goldUsd: 2380.8 };
  const oilUrl = `https://www.alphavantage.co/query?function=WTI&interval=daily&apikey=${config.alphaVantageKey}`;
  const goldUrl = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=XAU&to_currency=USD&apikey=${config.alphaVantageKey}`;
  const [oil, gold] = await Promise.all([fetch(oilUrl).then((r) => r.json()), fetch(goldUrl).then((r) => r.json())]);
  const oilValue = Number(oil.data?.[0]?.value || oil["data"]?.[0]?.["value"] || 82.4);
  const goldValue = Number(gold["Realtime Currency Exchange Rate"]?.["5. Exchange Rate"] || 2380.8);
  return { oilUsd: oilValue, goldUsd: goldValue };
}

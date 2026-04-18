import type { NationChainIO } from "../websocket/server.js";
import { emitTicker } from "../websocket/server.js";
import { prisma } from "../prisma.js";
import { config } from "../config.js";
import type { NewsImpact } from "../types.js";
import { applyNewsEffectOnChain } from "./blockchain.js";

type Article = { title: string; description?: string; content?: string; url: string; source?: { name?: string }; publishedAt?: string };

const prompt = (article: Article) => `Analyze this news for geopolitical game impact. Return JSON only:
{ affected_countries: string[], event_type: 'war'|'sanction'|'disaster'|'election'|'economic'|'diplomatic', severity: 1-10, game_effects: { country: string, stat: string, delta: number, duration_hours: number }[], headline_summary: string, game_notification: string }
Headline: ${article.title}
Body: ${article.description || article.content || "No body provided"}`;

export async function runNewsOracle(io: NationChainIO) {
  const articles = await fetchLatestArticles();
  const unique = dedupeArticles(articles).slice(0, 8);
  for (const article of unique) {
    const exists = await prisma.newsEvent.findFirst({ where: { headline: article.title } });
    if (exists) continue;
    const impact = await analyzeArticle(article);
    await persistAndApplyImpact(io, article, impact);
  }
}

export async function injectManualNews(io: NationChainIO, input: { headline: string; sourceUrl?: string; impact?: NewsImpact }) {
  const article: Article = { title: input.headline, url: input.sourceUrl || "manual://admin" };
  const impact = input.impact || (await analyzeArticle(article));
  return persistAndApplyImpact(io, article, impact);
}

async function fetchLatestArticles(): Promise<Article[]> {
  const query = encodeURIComponent("(geopolitics OR sanctions OR military OR election OR earthquake OR flood OR oil OR economy)");
  const requests: Promise<Article[]>[] = [];
  if (config.newsApiKey) {
    requests.push(fetch(`https://newsapi.org/v2/everything?q=${query}&language=en&pageSize=20&sortBy=publishedAt&apiKey=${config.newsApiKey}`).then((r) => r.json()).then((j) => j.articles || []));
  }
  if (config.gnewsApiKey) {
    requests.push(fetch(`https://gnews.io/api/v4/search?q=${query}&lang=en&max=10&apikey=${config.gnewsApiKey}`).then((r) => r.json()).then((j) => j.articles || []));
  }
  if (requests.length === 0) return demoArticles();
  const settled = await Promise.allSettled(requests);
  return settled.flatMap((result) => (result.status === "fulfilled" ? result.value : []));
}

async function analyzeArticle(article: Article): Promise<NewsImpact> {
  if (!config.openaiApiKey) return heuristicImpact(article);
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.openaiApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o",
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "You are a geopolitical game oracle. Return strict JSON that matches the user's schema." },
        { role: "user", content: prompt(article) }
      ]
    })
  });
  if (!response.ok) return heuristicImpact(article);
  const json = await response.json();
  try {
    return normalizeImpact(JSON.parse(json.choices[0].message.content));
  } catch {
    return heuristicImpact(article);
  }
}

async function persistAndApplyImpact(io: NationChainIO, article: Article, impact: NewsImpact) {
  const event = await prisma.newsEvent.create({
    data: {
      headline: article.title,
      sourceUrl: article.url,
      affectedCountries: impact.affected_countries,
      eventType: impact.event_type,
      severity: impact.severity,
      gameEffects: impact.game_effects,
      aiAnalysis: { headline_summary: impact.headline_summary, game_notification: impact.game_notification }
    }
  });

  for (const effect of impact.game_effects) {
    if (effect.country.toUpperCase() === "GLOBAL") continue;
    const country = await prisma.country.findFirst({ where: { name: { equals: effect.country, mode: "insensitive" } } });
    if (!country) continue;
    const updated = applyLocalEffect(country, effect.stat, effect.delta);
    await prisma.country.update({ where: { id: country.id }, data: updated });
    await applyNewsEffectOnChain(country.id, normalizeStat(effect.stat), effect.delta).catch(() => undefined);
  }

  io.to("global_ticker").emit("news_event_triggered", event);
  io.to("world_map").emit("country_update", { reason: "news", eventId: event.id });
  emitTicker(io, "news_event_triggered", impact.game_notification);
  return event;
}

function applyLocalEffect(country: { gdp: number; military: number; happiness: number; oil: number; food: number; gold: number }, stat: string, delta: number) {
  const factor = 1 + delta / 10_000;
  const clamp = (n: number, min = 0, max = 100_000) => Math.max(min, Math.min(max, Math.round(n)));
  if (["gdp", "trade_income", "crisis_mode"].includes(stat)) return { gdp: clamp(country.gdp * factor) };
  if (["military", "military_morale", "military_tension"].includes(stat)) return { military: clamp(country.military * factor) };
  if (["happiness", "refugee_event"].includes(stat)) return { happiness: clamp(country.happiness * factor, 0, 100) };
  if (["oil", "oil_reserves", "oil_price"].includes(stat)) return { oil: clamp(country.oil * factor, 0, 100) };
  if (stat === "food") return { food: clamp(country.food * factor, 0, 100) };
  if (stat === "gold") return { gold: clamp(country.gold * factor, 0, 100) };
  return {};
}

function normalizeStat(stat: string) {
  if (stat === "oil_price") return "oil";
  if (stat === "diplomatic_power") return "happiness";
  if (stat === "trade_multiplier") return "gdp";
  return stat;
}

function normalizeImpact(raw: Partial<NewsImpact>): NewsImpact {
  return {
    affected_countries: raw.affected_countries || [],
    event_type: raw.event_type || "economic",
    severity: Math.max(1, Math.min(10, Number(raw.severity || 5))),
    game_effects: raw.game_effects || [],
    headline_summary: raw.headline_summary || "Real-world event detected.",
    game_notification: raw.game_notification || "World event updated NationChain."
  };
}

function heuristicImpact(article: Article): NewsImpact {
  const text = `${article.title} ${article.description || ""}`.toLowerCase();
  const countries = ["United States", "China", "Russia", "Ukraine", "Iran", "Saudi Arabia", "Turkey", "Germany", "France", "India", "Indonesia"].filter((country) =>
    text.includes(country.toLowerCase()) || (country === "United States" && text.includes("us "))
  );
  if (text.includes("sanction")) return normalizeImpact({ affected_countries: countries, event_type: "sanction", severity: 8, game_effects: countries.map((country) => ({ country, stat: "trade_income", delta: -3000, duration_hours: 48 })), headline_summary: "Sanctions detected.", game_notification: "Sanctions Alert: trade income disrupted." });
  if (text.includes("war") || text.includes("offensive") || text.includes("missile")) return normalizeImpact({ affected_countries: countries, event_type: "war", severity: 9, game_effects: countries.map((country) => ({ country, stat: "military_tension", delta: 2000, duration_hours: 24 })), headline_summary: "Conflict detected.", game_notification: "War Alert: military tension rising." });
  if (text.includes("earthquake") || text.includes("flood") || text.includes("hurricane")) return normalizeImpact({ affected_countries: countries, event_type: "disaster", severity: 8, game_effects: countries.map((country) => ({ country, stat: "happiness", delta: -2500, duration_hours: 48 })), headline_summary: "Disaster detected.", game_notification: "Disaster Alert: affected countries need aid." });
  return normalizeImpact({ affected_countries: countries, event_type: "economic", severity: 5, game_effects: countries.map((country) => ({ country, stat: "gdp", delta: 500, duration_hours: 24 })), headline_summary: "Economic update detected.", game_notification: "Market Shift: country stats adjusted." });
}

function dedupeArticles(articles: Article[]) {
  const seen = new Set<string>();
  return articles.filter((article) => {
    const key = article.title.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return Boolean(article.title && article.url);
  });
}

function demoArticles(): Article[] {
  return [
    { 
      title: "US imposes new sanctions on Iran over nuclear program", 
      description: "The United States announced comprehensive sanctions targeting Iran's nuclear facilities and military infrastructure.",
      url: "https://demo.nationchain.local/news/us-iran-sanctions" 
    },
    { 
      title: "Saudi Arabia cuts oil production by 1M barrels/day", 
      description: "OPEC+ announces major production cuts affecting global oil prices and energy markets.",
      url: "https://demo.nationchain.local/news/opec-oil-cut" 
    },
    { 
      title: "China announces massive infrastructure investment in Africa", 
      description: "Beijing commits $50 billion to African infrastructure projects, expanding Belt and Road Initiative.",
      url: "https://demo.nationchain.local/news/china-africa-investment" 
    },
    { 
      title: "Russia and Ukraine reach temporary ceasefire agreement", 
      description: "Both nations agree to 48-hour ceasefire for humanitarian corridor negotiations.",
      url: "https://demo.nationchain.local/news/russia-ukraine-ceasefire" 
    },
    { 
      title: "Major earthquake strikes Turkey, thousands affected", 
      description: "7.8 magnitude earthquake causes widespread damage across southern Turkey and northern Syria.",
      url: "https://demo.nationchain.local/news/turkey-earthquake" 
    },
    { 
      title: "India surpasses China as world's most populous nation", 
      description: "UN data confirms India's population exceeds 1.4 billion, overtaking China for the first time.",
      url: "https://demo.nationchain.local/news/india-population" 
    },
    { 
      title: "Germany announces €100 billion defense spending increase", 
      description: "Berlin commits to major military modernization amid European security concerns.",
      url: "https://demo.nationchain.local/news/germany-defense" 
    },
    { 
      title: "Brazil and Argentina propose common South American currency", 
      description: "Leaders discuss 'Sur' currency to reduce dependence on US dollar in regional trade.",
      url: "https://demo.nationchain.local/news/latam-currency" 
    }
  ];
}

import { PrismaClient } from "@prisma/client";
import { countryCoordinates } from "./realCoordinates";

const prisma = new PrismaClient();

const demoWallets = [
  "0x1111111111111111111111111111111111111111",
  "0x2222222222222222222222222222222222222222",
  "0x3333333333333333333333333333333333333333",
  "0x4444444444444444444444444444444444444444"
];

const featured = [
  { id: 1, name: "United States", isoCode: "US", gdp: 27360, military: 9800, happiness: 72, oil: 88, food: 92, gold: 78, iron: 72, uranium: 65, territory: 9834, ideology: "Federal Republic", latitude: 38, longitude: -97, color: "#22d3ee", ownerWallet: demoWallets[0], tokensEarned: 4200, warsWon: 3 },
  { id: 2, name: "China", isoCode: "CN", gdp: 17700, military: 9200, happiness: 68, oil: 62, food: 80, gold: 66, iron: 95, uranium: 58, territory: 9597, ideology: "Centralized Republic", latitude: 35, longitude: 103, color: "#f87171", ownerWallet: demoWallets[1], tokensEarned: 3900, warsWon: 2 },
  { id: 3, name: "Russia", isoCode: "RU", gdp: 2240, military: 8900, happiness: 59, oil: 96, food: 68, gold: 84, iron: 88, uranium: 92, territory: 17098, ideology: "Federation", latitude: 61, longitude: 105, color: "#a78bfa", ownerWallet: demoWallets[2], tokensEarned: 3500, warsWon: 4 },
  { id: 4, name: "Germany", isoCode: "DE", gdp: 4450, military: 5200, happiness: 80, oil: 18, food: 74, gold: 52, iron: 64, uranium: 18, territory: 357, ideology: "Parliamentary Republic", latitude: 51, longitude: 10, color: "#34d399", ownerWallet: demoWallets[3], tokensEarned: 2600, warsWon: 1 },
  { id: 5, name: "Japan", isoCode: "JP", gdp: 4210, military: 5600, happiness: 76, oil: 8, food: 58, gold: 48, iron: 42, uranium: 12, territory: 378, ideology: "Constitutional Monarchy", latitude: 36, longitude: 138, color: "#f9a8d4", ownerWallet: null, tokensEarned: 1900, warsWon: 1 },
  { id: 6, name: "Brazil", isoCode: "BR", gdp: 2170, military: 4300, happiness: 70, oil: 72, food: 95, gold: 70, iron: 82, uranium: 28, territory: 8516, ideology: "Federal Republic", latitude: -10, longitude: -55, color: "#facc15", ownerWallet: null, tokensEarned: 1600, warsWon: 0 },
  { id: 7, name: "India", isoCode: "IN", gdp: 3730, military: 7600, happiness: 66, oil: 35, food: 88, gold: 55, iron: 78, uranium: 44, territory: 3287, ideology: "Federal Republic", latitude: 22, longitude: 79, color: "#fb923c", ownerWallet: null, tokensEarned: 3100, warsWon: 2 },
  { id: 8, name: "United Kingdom", isoCode: "GB", gdp: 3340, military: 6100, happiness: 74, oil: 42, food: 63, gold: 60, iron: 40, uranium: 20, territory: 244, ideology: "Constitutional Monarchy", latitude: 55, longitude: -3, color: "#60a5fa", ownerWallet: null, tokensEarned: 2200, warsWon: 1 },
  { id: 9, name: "France", isoCode: "FR", gdp: 3030, military: 6500, happiness: 73, oil: 16, food: 77, gold: 58, iron: 52, uranium: 70, territory: 552, ideology: "Republic", latitude: 46, longitude: 2, color: "#38bdf8", ownerWallet: null, tokensEarned: 2400, warsWon: 1 },
  { id: 10, name: "Indonesia", isoCode: "ID", gdp: 1370, military: 4100, happiness: 71, oil: 70, food: 84, gold: 80, iron: 65, uranium: 18, territory: 1905, ideology: "Republic", latitude: -2, longitude: 118, color: "#2dd4bf", ownerWallet: null, tokensEarned: 1500, warsWon: 0 }
];

const extraNames = "Afghanistan,Albania,Algeria,Andorra,Angola,Argentina,Armenia,Australia,Austria,Azerbaijan,Bahrain,Bangladesh,Belarus,Belgium,Benin,Bhutan,Bolivia,Bosnia and Herzegovina,Botswana,Bulgaria,Burkina Faso,Burundi,Cambodia,Cameroon,Canada,Chad,Chile,Colombia,Costa Rica,Croatia,Cuba,Cyprus,Czechia,Denmark,Dominican Republic,Ecuador,Egypt,Estonia,Ethiopia,Finland,Ghana,Greece,Guatemala,Hungary,Iceland,Iran,Iraq,Ireland,Israel,Italy,Jordan,Kazakhstan,Kenya,Kuwait,Laos,Latvia,Lebanon,Libya,Lithuania,Luxembourg,Malaysia,Mexico,Morocco,Netherlands,New Zealand,Nigeria,North Korea,Norway,Oman,Pakistan,Peru,Philippines,Poland,Portugal,Qatar,Romania,Saudi Arabia,Serbia,Singapore,South Africa,South Korea,Spain,Sweden,Switzerland,Syria,Thailand,Turkey,Ukraine,United Arab Emirates,Venezuela,Vietnam,Yemen,Zimbabwe,Nepal,Sri Lanka,Myanmar,Mongolia,Uzbekistan,Turkmenistan,Kyrgyzstan,Tajikistan,Georgia,Moldova,Slovakia,Slovenia,North Macedonia,Montenegro,Kosovo,Malta,Monaco,San Marino,Vatican City,Liechtenstein,Greenland,Panama,Paraguay,Uruguay,Suriname,Guyana,Belize,Honduras,Nicaragua,El Salvador,Jamaica,Haiti,Trinidad and Tobago,Bahamas,Barbados,Fiji,Papua New Guinea,Solomon Islands,Samoa,Tonga,Vanuatu,Madagascar,Mauritius,Seychelles,Comoros,Malawi,Mozambique,Tanzania,Uganda,Rwanda,South Sudan,Sudan,Eritrea,Djibouti,Somalia,Mali,Niger,Mauritania,Senegal,Gambia,Guinea,Guinea-Bissau,Sierra Leone,Liberia,Ivory Coast,Togo,Equatorial Guinea,Gabon,Congo,Democratic Republic of the Congo,Central African Republic,Namibia,Zambia,Lesotho,Eswatini,Antigua and Barbuda,Dominica,Grenada,Saint Kitts and Nevis,Saint Lucia,Saint Vincent and the Grenadines,Palestine,Brunei,Maldives,Cabo Verde,Sao Tome and Principe,Timor-Leste".split(",");

function codeFor(name: string, id: number) {
  const letters = name.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase();
  return `${letters}${id}`;
}

function generatedCountry(name: string, index: number) {
  const id = index + 11;
  const seed = id * 37;
  
  // Use real coordinates if available, otherwise generate random
  const coords = countryCoordinates[name];
  const latitude = coords ? coords[0] : (((seed * 13) % 180) - 90);
  const longitude = coords ? coords[1] : (((seed * 19) % 360) - 180);
  
  return {
    id,
    name,
    isoCode: codeFor(name, id),
    gdp: 400 + (seed % 5200),
    military: 900 + (seed % 6500),
    happiness: 45 + (seed % 45),
    oil: seed % 100,
    food: 35 + (seed % 65),
    gold: (seed * 3) % 100,
    iron: (seed * 5) % 100,
    uranium: (seed * 7) % 80,
    territory: 50 + (seed % 9000),
    ideology: index % 5 === 0 ? "Republic" : index % 5 === 1 ? "Parliamentary Democracy" : index % 5 === 2 ? "Federation" : index % 5 === 3 ? "Constitutional Monarchy" : "Presidential Republic",
    latitude,
    longitude,
    color: "#64748b",
    ownerWallet: null,
    tokensEarned: seed % 1100,
    warsWon: seed % 4
  };
}

const sampleNews = [
  {
    headline: "US imposes new sanctions on Iran",
    sourceUrl: "https://demo.nationchain.local/news/us-iran-sanctions",
    affectedCountries: ["Iran", "United States"],
    eventType: "sanction",
    severity: 8,
    gameEffects: [
      { country: "Iran", stat: "trade_income", delta: -3500, duration_hours: 72 },
      { country: "United States", stat: "diplomatic_power", delta: 1000, duration_hours: 72 },
      { country: "GLOBAL", stat: "oil_price", delta: 800, duration_hours: 24 }
    ],
    aiAnalysis: { headline_summary: "Sanctions pressure Iran and unsettle oil markets.", game_notification: "Sanctions Alert: Iran trade routes blocked. Oil markets rattled." }
  },
  {
    headline: "Russia launches military offensive in Ukraine",
    sourceUrl: "https://demo.nationchain.local/news/russia-ukraine-offensive",
    affectedCountries: ["Russia", "Ukraine", "Germany", "France", "Poland"],
    eventType: "war",
    severity: 9,
    gameEffects: [
      { country: "Russia", stat: "military_morale", delta: 2500, duration_hours: 24 },
      { country: "Ukraine", stat: "crisis_mode", delta: -2200, duration_hours: 48 },
      { country: "Germany", stat: "happiness", delta: -600, duration_hours: 24 },
      { country: "GLOBAL", stat: "oil_price", delta: 1500, duration_hours: 24 }
    ],
    aiAnalysis: { headline_summary: "Eastern Europe conflict escalates and energy markets surge.", game_notification: "War Outbreak: Eastern Europe in crisis. Commodity markets surge." }
  },
  {
    headline: "Saudi Arabia cuts oil production by 1M barrels/day",
    sourceUrl: "https://demo.nationchain.local/news/opec-oil-cut",
    affectedCountries: ["Saudi Arabia", "Global"],
    eventType: "economic",
    severity: 7,
    gameEffects: [{ country: "GLOBAL", stat: "oil_price", delta: 2000, duration_hours: 24 }],
    aiAnalysis: { headline_summary: "OPEC supply cuts lift oil prices worldwide.", game_notification: "OPEC Cut: Oil scarcity drives global prices up." }
  },
  {
    headline: "Magnitude 7.8 earthquake strikes Turkey",
    sourceUrl: "https://demo.nationchain.local/news/turkey-earthquake",
    affectedCountries: ["Turkey", "Syria", "Greece"],
    eventType: "disaster",
    severity: 10,
    gameEffects: [
      { country: "Turkey", stat: "gdp", delta: -2000, duration_hours: 72 },
      { country: "Turkey", stat: "happiness", delta: -3000, duration_hours: 72 }
    ],
    aiAnalysis: { headline_summary: "Major earthquake damages infrastructure and public morale.", game_notification: "Disaster: Major earthquake in Turkey. International aid needed." }
  },
  {
    headline: "China and USA sign new trade deal",
    sourceUrl: "https://demo.nationchain.local/news/us-china-trade-deal",
    affectedCountries: ["China", "United States"],
    eventType: "diplomatic",
    severity: 6,
    gameEffects: [
      { country: "China", stat: "gdp", delta: 1000, duration_hours: 48 },
      { country: "United States", stat: "gdp", delta: 1000, duration_hours: 48 },
      { country: "GLOBAL", stat: "trade_multiplier", delta: 500, duration_hours: 48 }
    ],
    aiAnalysis: { headline_summary: "Trade normalization boosts two major economies.", game_notification: "Trade Peace: US-China deal boosts global economy." }
  }
];

async function main() {
  for (const wallet of demoWallets) {
    await prisma.player.upsert({
      where: { wallet },
      update: { lastSeen: new Date() },
      create: { wallet, ensName: `commander-${wallet.slice(2, 6)}.eth`, avatar: `https://api.dicebear.com/8.x/shapes/svg?seed=${wallet}` }
    });
  }

  const countries = [...featured, ...extraNames.slice(0, 170).map(generatedCountry)];
  for (const country of countries) {
    const { id, ...data } = country;
    await prisma.country.upsert({
      where: { id },
      update: data,
      create: { id, ...data }
    });
  }

  for (const countryId of [1, 2, 3, 4, 7]) {
    for (const buildingType of [1, 2, 3, 4, 5, 6]) {
      await prisma.building.upsert({
        where: { countryId_buildingType: { countryId, buildingType } },
        update: { level: ((countryId + buildingType) % 5) + 1, nftTokenId: buildingType },
        create: { countryId, buildingType, level: ((countryId + buildingType) % 5) + 1, nftTokenId: buildingType }
      });
    }
  }

  await prisma.war.createMany({
    data: [
      { attackerId: 1, defenderId: 3, status: "active", battleLog: ["Satellite recon deployed", "Cyber defense grid activated"] },
      { attackerId: 2, defenderId: 7, status: "active", battleLog: ["Naval blockade initiated", "Air patrols contest the border"] }
    ],
    skipDuplicates: true
  });

  await prisma.commodityPrice.create({
    data: { oilUsd: 82.4, goldUsd: 2380.8, appliedMultiplier: { oil: 1.12, gold: 1.06 } }
  });

  for (const event of sampleNews) {
    await prisma.newsEvent.create({ data: event });
  }

  const byGdp = await prisma.country.findMany({ orderBy: { gdp: "desc" }, take: 20 });
  const byMilitary = await prisma.country.findMany({ orderBy: { military: "desc" }, take: 20 });
  const byTokens = await prisma.country.findMany({ orderBy: { tokensEarned: "desc" }, take: 20 });
  await prisma.leaderboardSnapshot.upsert({
    where: { date: new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate())) },
    update: { rankingsByGdp: byGdp, rankingsByMilitary: byMilitary, rankingsByTokens: byTokens },
    create: { date: new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate())), rankingsByGdp: byGdp, rankingsByMilitary: byMilitary, rankingsByTokens: byTokens }
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

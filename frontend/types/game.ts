export type Building = {
  id: number;
  countryId: number;
  buildingType: number;
  level: number;
  nftTokenId: number;
};

export type Country = {
  id: number;
  name: string;
  isoCode: string;
  ownerWallet?: string | null;
  gdp: number;
  military: number;
  happiness: number;
  oil: number;
  food: number;
  gold: number;
  iron: number;
  uranium: number;
  territory: number;
  ideology: string;
  latitude: number;
  longitude: number;
  color: string;
  online: boolean;
  tokensEarned: number;
  warsWon: number;
  buildings?: Building[];
};

export type War = {
  id: number;
  attackerId: number;
  defenderId: number;
  status: string;
  startTime: string;
  endTime?: string | null;
  winnerId?: number | null;
  battleLog: string[];
  attacker?: Country;
  defender?: Country;
};

export type NewsEvent = {
  id: number;
  headline: string;
  sourceUrl: string;
  affectedCountries: string[];
  eventType: string;
  severity: number;
  gameEffects: Array<{ country: string; stat: string; delta: number; duration_hours: number }>;
  aiAnalysis: { headline_summary?: string; game_notification?: string };
  createdAt: string;
};

export type CommodityPrice = {
  timestamp: string;
  oilUsd: number;
  goldUsd: number;
  appliedMultiplier: { oil: number; gold: number };
};

export type Leaderboard = {
  gdp: Country[];
  military: Country[];
  tokens: Country[];
  wars: Country[];
};

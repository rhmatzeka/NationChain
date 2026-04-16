export type EventType = "war" | "sanction" | "disaster" | "election" | "economic" | "diplomatic";

export type GameEffect = {
  country: string;
  stat: string;
  delta: number;
  duration_hours: number;
};

export type NewsImpact = {
  affected_countries: string[];
  event_type: EventType;
  severity: number;
  game_effects: GameEffect[];
  headline_summary: string;
  game_notification: string;
};

export type GlobalTickerEvent = {
  id: string;
  type: string;
  message: string;
  createdAt: string;
};

export type ClientToServerEvents = {
  player_connected: (payload: { wallet: string }) => void;
  player_disconnected: (payload: { wallet: string }) => void;
  join_country: (payload: { countryId: number }) => void;
  join_war: (payload: { battleId: number }) => void;
  join_alliance: (payload: { allianceId: number }) => void;
  country_update: (payload: { countryId: number; cursor?: { lat: number; lng: number } }) => void;
  war_declared: (payload: { battleId: number; attackerId: number; defenderId: number }) => void;
  peace_treaty: (payload: { battleId: number; message: string }) => void;
  alliance_chat: (payload: { allianceId: number; wallet: string; content: string }) => void;
  direct_message: (payload: { toCountryId: number; wallet: string; content: string }) => void;
};

export type ServerToClientEvents = {
  online_players: (payload: { count: number; wallets: string[] }) => void;
  country_update: (payload: unknown) => void;
  war_declared: (payload: unknown) => void;
  peace_treaty: (payload: unknown) => void;
  news_event_triggered: (payload: unknown) => void;
  commodity_update: (payload: unknown) => void;
  daily_reset: (payload: unknown) => void;
  global_ticker: (payload: GlobalTickerEvent) => void;
  alliance_chat: (payload: unknown) => void;
  battle_feed: (payload: unknown) => void;
  direct_message: (payload: unknown) => void;
  player_cursor: (payload: unknown) => void;
};

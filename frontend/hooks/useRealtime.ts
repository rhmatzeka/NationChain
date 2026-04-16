"use client";

import { useEffect, useMemo, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { API_URL } from "@/lib/api";
import type { NewsEvent } from "@/types/game";

type Ticker = { id: string; type: string; message: string; createdAt: string };

export function useRealtime(wallet?: string) {
  const [onlinePlayers, setOnlinePlayers] = useState(0);
  const [ticker, setTicker] = useState<Ticker[]>([]);
  const [latestNews, setLatestNews] = useState<NewsEvent | null>(null);
  const [battleFeed, setBattleFeed] = useState<Array<{ message: string; createdAt: string }>>([]);
  const [connected, setConnected] = useState(false);

  const socket: Socket = useMemo(() => io(API_URL, { 
    path: "/ws", 
    autoConnect: false,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    timeout: 10000
  }), []);

  useEffect(() => {
    socket.on("connect", () => {
      setConnected(true);
      if (wallet) socket.emit("player_connected", { wallet });
    });

    socket.on("connect_error", (error) => {
      console.warn("WebSocket connection error:", error.message);
      setConnected(false);
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("online_players", (payload) => setOnlinePlayers(payload.count));
    socket.on("global_ticker", (event) => setTicker((items) => [event, ...items].slice(0, 30)));
    socket.on("news_event_triggered", (event) => setLatestNews(event as NewsEvent));
    socket.on("battle_feed", (event) => setBattleFeed((items) => [event, ...items].slice(0, 40)));

    socket.connect();

    return () => {
      if (wallet) socket.emit("player_disconnected", { wallet });
      socket.disconnect();
    };
  }, [socket, wallet]);

  return { socket, onlinePlayers, ticker, latestNews, battleFeed, connected };
}

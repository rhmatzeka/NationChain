import { Server } from "socket.io";
import type { Server as HttpServer } from "node:http";
import { prisma } from "../prisma.js";
import type { ClientToServerEvents, ServerToClientEvents, GlobalTickerEvent } from "../types.js";

export type NationChainIO = Server<ClientToServerEvents, ServerToClientEvents>;

const onlineWallets = new Map<string, string>();

export function createSocketServer(httpServer: HttpServer, corsOrigin: string) {
  const io: NationChainIO = new Server(httpServer, {
    path: "/ws",
    cors: { origin: corsOrigin, credentials: true },
    maxHttpBufferSize: 1e6
  });

  io.on("connection", (socket) => {
    socket.join("world_map");
    socket.join("global_ticker");

    socket.on("player_connected", async ({ wallet }) => {
      if (!wallet) return;
      onlineWallets.set(socket.id, wallet.toLowerCase());
      await prisma.player.upsert({
        where: { wallet: wallet.toLowerCase() },
        update: { lastSeen: new Date() },
        create: { wallet: wallet.toLowerCase() }
      }).catch((error) => console.warn("player_connected DB skipped:", error.message));
      await prisma.country.updateMany({ where: { ownerWallet: wallet.toLowerCase() }, data: { online: true } }).catch((error) => console.warn("country online DB skipped:", error.message));
      broadcastOnline(io);
      emitTicker(io, "player_connected", `${wallet.slice(0, 6)} joined the command network`);
    });

    socket.on("player_disconnected", async ({ wallet }) => {
      await disconnectWallet(io, socket.id, wallet);
    });

    socket.on("join_country", ({ countryId }) => socket.join(`country_${countryId}`));
    socket.on("join_war", ({ battleId }) => socket.join(`war_${battleId}`));
    socket.on("join_alliance", ({ allianceId }) => socket.join(`alliance_${allianceId}`));

    socket.on("country_update", (payload) => {
      io.to("world_map").emit("country_update", payload);
      if (payload.cursor) io.to("world_map").emit("player_cursor", { socketId: socket.id, ...payload });
    });

    socket.on("war_declared", (payload) => {
      io.to("world_map").emit("war_declared", payload);
      io.to(`war_${payload.battleId}`).emit("battle_feed", { battleId: payload.battleId, message: "War declaration confirmed on-chain", createdAt: new Date().toISOString() });
      emitTicker(io, "war_declared", `Country ${payload.attackerId} declared war on country ${payload.defenderId}`);
    });

    socket.on("peace_treaty", (payload) => {
      io.to(`war_${payload.battleId}`).emit("peace_treaty", payload);
      emitTicker(io, "peace_treaty", payload.message);
    });

    socket.on("alliance_chat", async (payload) => {
      await prisma.chatMessage.create({
        data: {
          allianceId: payload.allianceId,
          senderWallet: payload.wallet.toLowerCase(),
          content: payload.content
        }
      }).catch((error) => console.warn("alliance_chat DB skipped:", error.message));
      io.to(`alliance_${payload.allianceId}`).emit("alliance_chat", { ...payload, createdAt: new Date().toISOString() });
    });

    socket.on("direct_message", (payload) => {
      io.to(`country_${payload.toCountryId}`).emit("direct_message", { ...payload, createdAt: new Date().toISOString() });
    });

    socket.on("disconnect", async () => {
      await disconnectWallet(io, socket.id);
    });
  });

  return io;
}

export function emitTicker(io: NationChainIO, type: string, message: string) {
  const event: GlobalTickerEvent = { id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, type, message, createdAt: new Date().toISOString() };
  io.to("global_ticker").emit("global_ticker", event);
}

export function broadcastOnline(io: NationChainIO) {
  const wallets = [...new Set(onlineWallets.values())];
  io.to("world_map").emit("online_players", { count: wallets.length, wallets });
}

async function disconnectWallet(io: NationChainIO, socketId: string, wallet?: string) {
  const knownWallet = wallet?.toLowerCase() || onlineWallets.get(socketId);
  onlineWallets.delete(socketId);
  if (knownWallet && ![...onlineWallets.values()].includes(knownWallet)) {
    await prisma.country.updateMany({ where: { ownerWallet: knownWallet }, data: { online: false } }).catch((error) => console.warn("disconnect DB skipped:", error.message));
  }
  broadcastOnline(io);
}

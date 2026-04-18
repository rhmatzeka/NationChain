import express, { type ErrorRequestHandler } from "express";
import http from "node:http";
import cors from "cors";
import helmet from "helmet";
import cron from "node-cron";
import { config } from "./config.js";
import { createSocketServer } from "./websocket/server.js";
import { apiRouter } from "./routes/api.js";
import { runNewsOracle } from "./services/newsOracle.js";
import { runCommodityOracle } from "./services/commodityOracle.js";
import { runDailyReset } from "./services/dailyReset.js";

const app = express();
const server = http.createServer(app);
const io = createSocketServer(server, config.frontendOrigin);

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: config.frontendOrigin, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use("/api", apiRouter(io));

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  console.error(error);
  res.status(error.status || 500).json({ error: error.message || "Internal server error" });
};
app.use(errorHandler);

cron.schedule("*/30 * * * *", () => runNewsOracle(io).catch(console.error));
cron.schedule("0 * * * *", () => runCommodityOracle(io).catch(console.error));
cron.schedule("0 0 * * *", () => runDailyReset(io).catch(console.error), { timezone: "UTC" });

// Run news oracle immediately on startup for demo
setTimeout(() => {
  console.log("Running initial news oracle...");
  runNewsOracle(io).catch(console.error);
}, 5000);

server.listen(config.port, () => {
  console.log(`NationChain backend listening on http://localhost:${config.port}`);
  console.log(`Socket.io endpoint ready at ws://localhost:${config.port}/ws`);
});

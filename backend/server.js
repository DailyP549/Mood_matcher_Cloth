import "./env.js";
import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readDb, writeDb } from "./db.js";
import { getWeather } from "./weather.js";
import { generateReasoning } from "./llm.js";
import { searchProducts, toWardrobeItem } from "./channel3.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || process.env.API_PORT || 4000;

const app = express();
app.use(cors());
app.use(express.json({ limit: "25mb" }));

app.get("/api/health", async (_req, res) => {
  const db = await readDb();
  res.json({ ok: true, items: db.items.length, favorites: db.favorites.length, planned: Object.keys(db.plans || {}).length });
});

app.get("/api/items", async (_req, res) => res.json({ items: (await readDb()).items }));

app.put("/api/items", async (req, res) => {
  const db = await readDb();
  db.items = Array.isArray(req.body) ? req.body : db.items;
  await writeDb(db);
  res.json({ items: db.items });
});

app.get("/api/favorites", async (_req, res) => res.json({ ids: (await readDb()).favorites }));

app.put("/api/favorites", async (req, res) => {
  const db = await readDb();
  db.favorites = Array.isArray(req.body?.ids) ? req.body.ids : db.favorites;
  await writeDb(db);
  res.json({ ids: db.favorites });
});

app.get("/api/plans", async (_req, res) => res.json({ plans: (await readDb()).plans || {} }));

app.put("/api/plans", async (req, res) => {
  const db = await readDb();
  db.plans = req.body?.plans || db.plans;
  await writeDb(db);
  res.json({ plans: db.plans });
});

app.get("/api/weather", async (req, res) => {
  const lat = req.query.lat || "13.0827";
  const lon = req.query.lon || "80.2707";
  const city = req.query.city || "Chennai";
  try {
    res.json(await getWeather(lat, lon, city));
  } catch {
    res.status(502).json({ error: "weather unavailable" });
  }
});

app.post("/api/reason", async (req, res) => {
  const note = await generateReasoning(req.body || {});
  res.json({ note });
});

app.post("/api/trending", async (req, res) => {
  const { query } = req.body || {};
  if (!query) return res.status(400).json({ error: "query required" });
  const products = await searchProducts(query, 30);
  if (!products) return res.status(502).json({ error: "channel3 unavailable" });
  res.json({ products: products.map(toWardrobeItem) });
});

app.use((req, res) => res.status(404).json({ error: "not found" }));

app.listen(PORT, () => console.log(`OutfitWise API running at http://localhost:${PORT}`));

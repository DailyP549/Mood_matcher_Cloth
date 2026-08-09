import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getState, setState, supabaseEnabled } from "./supabase.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, "data.json");

export const seed = [
  { id: 1, name: "White Oxford Shirt", cat: "Tops", color: "White", season: "All", occasion: "Formal", img: "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?auto=format&fit=crop&w=500&q=80", wears: 8 },
  { id: 2, name: "Black Oversized Tee", cat: "Tops", color: "Black", season: "Summer", occasion: "Casual", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=80", wears: 12 },
  { id: 3, name: "Navy Chinos", cat: "Bottoms", color: "Navy", season: "All", occasion: "Formal", img: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=500&q=80", wears: 5 },
  { id: 4, name: "Blue Denim", cat: "Bottoms", color: "Blue", season: "All", occasion: "Casual", img: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=500&q=80", wears: 15 },
  { id: 5, name: "White Sneakers", cat: "Shoes", color: "White", season: "All", occasion: "Casual", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80", wears: 10 },
  { id: 6, name: "Brown Loafers", cat: "Shoes", color: "Brown", season: "All", occasion: "Formal", img: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=500&q=80", wears: 3 }
];

const EMPTY = { items: seed, favorites: [], plans: {} };

function readFile() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(EMPTY, null, 2));
      return { ...EMPTY };
    }
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    return { ...EMPTY };
  }
}

function writeFile(db) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
  } catch {
    /* best-effort local cache */
  }
}

export async function readDb() {
  const fileDb = readFile();
  if (supabaseEnabled) {
    const [items, favorites, plans] = await Promise.all([
      getState("items"),
      getState("favorites"),
      getState("plans")
    ]);
    return {
      items: Array.isArray(items) && items.length ? items : fileDb.items,
      favorites: Array.isArray(favorites) ? favorites : fileDb.favorites,
      plans: plans && typeof plans === "object" ? plans : fileDb.plans
    };
  }
  return fileDb;
}

export async function writeDb(db) {
  writeFile(db);
  if (supabaseEnabled) {
    await Promise.all([
      setState("items", db.items),
      setState("favorites", db.favorites),
      setState("plans", db.plans)
    ]);
  }
}

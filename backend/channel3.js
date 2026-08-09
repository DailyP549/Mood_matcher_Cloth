const BASE = "https://api.trychannel3.com";
const KEY = process.env.CHANNEL3_API_KEY;

const CAT_RULES = [
  [/dress|gown|robe|jumpsuit|playsuit/i, "Dresses"],
  [/jacket|coat|blazer|outerwear|parka|hoodie|cardigan|bomber/i, "Outerwear"],
  [/shirt|tee|top|sweater|knit|blouse|tank|crop|polo|puffer/i, "Tops"],
  [/jean|pant|trouser|short|chino|skirt|legging|jogger|cargo|sweatpant/i, "Bottoms"],
  [/shoe|sneaker|boot|sandal|loafer|heel|slipper|trainer|runner|mule|flat/i, "Shoes"]
];

const KNOWN_COLORS = ["Black", "White", "Blue", "Brown", "Beige", "Navy", "Red", "Green", "Pink", "Grey", "Gray", "Yellow", "Purple", "Orange"];

function mapCat(p) {
  const hay = [p.title, p.category?.slug, p.category?.title].filter(Boolean).join(" ");
  for (const [re, cat] of CAT_RULES) if (re.test(hay)) return cat;
  return "Tops";
}

function mapColor(p) {
  const attrs = p.structured_attributes?.color?.[0];
  const hay = [attrs, ...(p.images || []).map((i) => i.alt_text), p.title].filter(Boolean).join(" | ");
  const hit = KNOWN_COLORS.find((k) => new RegExp("\\b" + k + "\\b", "i").test(hay));
  if (hit) return hit;
  const c = attrs && attrs.trim();
  if (c) return c.charAt(0).toUpperCase() + c.slice(1);
  return "Black";
}

function mapOccasion(p) {
  const hay = [p.title, p.category?.slug].filter(Boolean).join(" ");
  if (/blazer|suit|oxford|formal|dress shirt/i.test(hay)) return "Formal";
  if (/dress|gown|party|evening/i.test(hay)) return "Party";
  if (/denim|jean|tee|sneaker|casual|hoodie|jogger|sweats/i.test(hay)) return "Casual";
  return "Casual";
}

function mapImage(p) {
  const imgs = p.images || [];
  const main = imgs.find((i) => i.is_main_image);
  return (main?.cleaned_url || main?.url || imgs[0]?.cleaned_url || imgs[0]?.url) || "";
}

function mapPrice(p) {
  const o = p.offers?.[0];
  return o?.price ? { price: o.price.price, currency: o.price.currency, url: o.url } : null;
}

export function toWardrobeItem(p) {
  const price = mapPrice(p);
  return {
    id: "c3_" + String(p.id || "").replace(/[^a-z0-9]/gi, "").slice(0, 18),
    name: p.title,
    cat: mapCat(p),
    color: mapColor(p),
    season: "All",
    occasion: mapOccasion(p),
    img: mapImage(p),
    wears: 0,
    brand: p.brands?.[0]?.name || "",
    price: price?.price ?? null,
    currency: price?.currency ?? null,
    url: price?.url || ""
  };
}

export async function searchProducts(query, limit = 30) {
  if (!KEY) return null;
  const r = await fetch(`${BASE}/v1/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": KEY },
    body: JSON.stringify({ query, limit, config: { country: "US", currency: "USD" } })
  });
  if (!r.ok) return null;
  const data = await r.json();
  return data.products || [];
}

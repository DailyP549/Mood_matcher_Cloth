export async function generateReasoning(ctx) {
  const apiKey = process.env.LLM_API_KEY;
  if (!apiKey) return null;
  const baseUrl = process.env.LLM_BASE_URL || "https://opencode.ai/zen/v1";
  const model = process.env.LLM_MODEL || "deepseek-v4-flash";

  const pieces = (ctx.pieces || [])
    .map((p) => `- ${p.name} (${p.color} ${p.cat}, usually ${p.occasion}, worn ${p.wears} times)`)
    .join("\n");

  const prompt = `I'm building an outfit for ${ctx.occasion} (${ctx.mood} mood, ${ctx.style} style). Weather: ${ctx.weather.temp}°C, ${ctx.weather.desc}${ctx.weather.rainy ? ", rain expected" : ""}.

My wardrobe pieces selected:
${pieces}

Write 2-3 short sentences explaining WHY this outfit works together, referencing the weather, occasion, and how worn each piece is. Plain text only, no markdown, no bullet points.`;

  try {
    const r = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: "You are OutfitWise, a concise personal AI fashion stylist. Answer in plain text only." },
          { role: "user", content: prompt }
        ],
        max_tokens: 200,
        temperature: 0.7
      })
    });
    if (!r.ok) return null;
    const data = await r.json();
    return data?.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
}

const OWM_KEY = process.env.OPENWEATHER_API_KEY;
let cache = { t: 0, data: null };

function owmToResponse(data) {
  const t = Math.round(data?.main?.temp ?? 28);
  const id = data?.weather?.[0]?.id ?? 800;
  let code;
  if (id >= 200 && id < 300) code = 95;
  else if (id >= 300 && id < 400) code = 61;
  else if (id >= 500 && id < 600) code = 63;
  else if (id >= 600 && id < 700) code = 73;
  else if (id >= 700 && id < 800) code = 45;
  else if (id === 800) code = 0;
  else if (id === 801) code = 2;
  else code = 3;
  return {
    current: { temperature_2m: t, weather_code: code },
    city: data?.name
  };
}

export async function getWeather(lat, lon, city) {
  if (Date.now() - cache.t < 5 * 60 * 1000 && cache.data) {
    return { ...cache.data, city };
  }
  if (OWM_KEY) {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OWM_KEY}&units=metric`;
      const r = await fetch(url);
      if (r.ok) {
        const data = await r.json();
        const shaped = owmToResponse(data);
        cache = { t: Date.now(), data: shaped };
        return { ...shaped, city };
      }
    } catch {
      /* fall through to Open-Meteo */
    }
  }
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=1&timezone=auto`;
  const r = await fetch(url);
  const data = await r.json();
  cache = { t: Date.now(), data };
  return { ...data, city };
}

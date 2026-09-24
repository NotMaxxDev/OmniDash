import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city") || "Berlin";

  try {
    // 1. Geocoding search using Open-Meteo Geocoding API
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=de&format=json`);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      return NextResponse.json({ error: "Ort nicht gefunden" }, { status: 404 });
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // 2. Fetch weather forecast from Open-Meteo
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`
    );
    const weatherData = await weatherRes.json();

    return NextResponse.json({
      location: `${name}, ${country}`,
      current: weatherData.current_weather,
      daily: weatherData.daily,
    });
  } catch (error) {
    return NextResponse.json({ error: "Fehler beim Laden des Wetters" }, { status: 500 });
  }
}

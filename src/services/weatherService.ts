import type { WeatherData, DataStatus } from "@/types";
import { weatherCodeToRainfall } from "@/types/weather";
import { fallbackEnvironmentalData } from "@/data/fallbackData";

// ============================================================
// Weather Service
// ============================================================
// Uses OpenWeatherMap free API (current weather endpoint, 60 calls/min free tier).
// API key is read from VITE_OPENWEATHER_API_KEY env variable.
// If no key is configured or the API fails, falls back to demo data automatically.
// NEVER hardcode API keys in source code. Use .env + .env.example.
// ============================================================

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY as string | undefined;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export function isWeatherApiConfigured(): boolean {
  return typeof API_KEY === "string" && API_KEY.length > 0 && API_KEY !== "your_openweather_api_key_here";
}

interface OpenWeatherResponse {
  weather: { id: number; description: string }[];
  main: { temp: number; humidity: number };
  wind: { speed: number };
  rain?: { "1h"?: number; "3h"?: number };
  name: string;
  cod: number;
  message?: string;
}

export async function fetchWeather(lat: number, lng: number, locationId: string): Promise<WeatherData> {
  if (!isWeatherApiConfigured()) {
    return getFallbackWeather(locationId);
  }

  try {
    const url = `${BASE_URL}?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Weather API returned ${response.status}`);
    }

    const data: OpenWeatherResponse = await response.json();
    const code = data.weather[0]?.id ?? 800;
    const { rainfall, description } = weatherCodeToRainfall(code);

    // Use actual rain volume from API if available, otherwise estimate from code
    const rainMm = data.rain?.["1h"] ?? data.rain?.["3h"] ?? rainfall;

    return {
      temperature: Math.round(data.main.temp),
      rainfall: Math.round(rainMm),
      weatherCode: code,
      weatherDescription: data.weather[0]?.description ?? description,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed),
      dataSource: "LIVE",
      timestamp: new Date().toISOString(),
      locationName: data.name,
      precipitationSource: "OPENWEATHERMAP",
    };
  } catch {
    // API failure — gracefully fall back to demo data
    return getFallbackWeather(locationId);
  }
}

export function getFallbackWeather(locationId: string): WeatherData {
  const fb = fallbackEnvironmentalData[locationId] ?? { rainfall: 80, temperature: 22, soilMoisture: 65, groundMovement: 4 };
  return {
    temperature: fb.temperature,
    rainfall: fb.rainfall,
    weatherCode: 500,
    weatherDescription: fb.rainfall > 100 ? "Heavy Rain (Demo)" : fb.rainfall > 50 ? "Rain (Demo)" : "Light Rain (Demo)",
    humidity: fb.soilMoisture,
    windSpeed: 3,
    dataSource: "FALLBACK",
    timestamp: new Date().toISOString(),
    precipitationSource: "FALLBACK",
  };
}

export function getWeatherDataSourceStatus(): DataStatus {
  return isWeatherApiConfigured() ? "LIVE" : "FALLBACK";
}

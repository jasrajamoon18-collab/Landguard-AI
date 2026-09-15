import type { DataStatus } from "./location";

export interface WeatherData {
  temperature: number; // °C
  rainfall: number; // mm (24h — primary rainfall, from IMERG or OpenWeatherMap or fallback)
  weatherCode: number;
  weatherDescription: string;
  humidity: number; // %
  windSpeed: number; // m/s
  dataSource: DataStatus;
  timestamp: string;
  locationName?: string;
  precipitationSource?: "NASA_IMERG" | "OPENWEATHERMAP" | "FALLBACK"; // tracks where rainfall came from
}

export interface WeatherServiceConfig {
  apiKey?: string;
  baseUrl: string;
  units: "metric" | "imperial";
}

// OpenWeatherMap weather codes to rainfall estimation
// See: https://openweathermap.org/weather-conditions
export function weatherCodeToRainfall(code: number): { rainfall: number; description: string } {
  if (code >= 200 && code < 300) return { rainfall: 45, description: "Thunderstorm" };
  if (code >= 300 && code < 400) return { rainfall: 15, description: "Drizzle" };
  if (code >= 500 && code < 600) {
    if (code < 504) return { rainfall: 25, description: "Light Rain" };
    return { rainfall: 60, description: "Heavy Rain" };
  }
  if (code >= 600 && code < 700) return { rainfall: 5, description: "Snow" };
  if (code >= 700 && code < 800) return { rainfall: 0, description: "Atmospheric" };
  if (code === 800) return { rainfall: 0, description: "Clear Sky" };
  if (code > 800) return { rainfall: 0, description: "Cloudy" };
  return { rainfall: 0, description: "Unknown" };
}

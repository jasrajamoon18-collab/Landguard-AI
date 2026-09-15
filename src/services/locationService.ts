import type { Location, DataStatus, RiskInputs } from "@/types";
import { locationBaseData, fallbackEnvironmentalData } from "@/data/fallbackData";
import { fetchWeather, isWeatherApiConfigured } from "./weatherService";
import { getGroundMovement } from "./groundMovementService";
import { calculateRisk } from "./riskService";
import { fetchImergForLocation, isImergConfigured, clearImergCache } from "./imergService";

// ============================================================
// Location Service
// ============================================================
// Merges static terrain data (elevation, slope, historical risk)
// with dynamic environmental data:
//   - Rainfall: NASA IMERG (primary) → OpenWeatherMap → fallback
//   - Soil moisture: fallback (no live source configured)
//   - Ground movement: fallback (no live source configured)
//
// Computes the risk score using riskService.calculateRisk().
// IMERG multi-window rainfall (24h, 3d, 7d) feeds into the risk engine.
//
// Future: replace with GET /api/locations backend call.
// ============================================================

export async function fetchAllLocations(): Promise<Location[]> {
  const locations: Location[] = [];

  for (const base of locationBaseData) {
    const loc = await buildLocation(base.id);
    locations.push(loc);
  }

  return locations;
}

// Synchronous version using fallback data only — for initial load / no-API scenarios
export function getLocationsSync(): Location[] {
  return locationBaseData.map((base) => buildLocationSync(base.id));
}

export async function buildLocation(locationId: string): Promise<Location> {
  const base = locationBaseData.find((l) => l.id === locationId);
  if (!base) throw new Error(`Location ${locationId} not found`);

  // Fetch IMERG precipitation data (primary rainfall source) — falls back automatically
  const imerg = await fetchImergForLocation(base.lat, base.lng, locationId);

  // Fetch weather (temperature, humidity, wind — and rainfall as secondary source)
  const weather = await fetchWeather(base.lat, base.lng, locationId);

  // Ground movement from service (falls back to demo)
  const gm = getGroundMovement(locationId);

  // Soil moisture — no live source configured, use fallback
  const fb = fallbackEnvironmentalData[locationId];
  const soilMoisture = fb?.soilMoisture ?? 65;

  // Use IMERG 24h precipitation as the primary rainfall input.
  // IMERG provides rainfall whether LIVE or FALLBACK — the status
  // tells the user whether it's real NASA data or demo data.
  // Only fall back to weather service rainfall if IMERG errored entirely.
  const imergUsable = imerg.dataStatus === "LIVE" || imerg.dataStatus === "FALLBACK";
  const primaryRainfall = imergUsable ? imerg.precipitation24h : weather.rainfall;

  // Determine overall data status
  // LIVE when IMERG is LIVE, FALLBACK when IMERG is FALLBACK, ERROR otherwise
  const overallStatus: DataStatus = imerg.dataStatus === "LIVE"
    ? "LIVE"
    : imerg.dataStatus === "ERROR"
      ? "ERROR"
      : "FALLBACK";

  const inputs: RiskInputs = {
    rainfall: primaryRainfall,
    soilMoisture,
    slope: base.slope,
    elevation: base.elevation,
    groundMovement: gm.value,
    historicalRisk: base.historicalRisk,
    rainfall3h: imerg.precipitation3h,
    rainfall3d: imerg.precipitation3d,
    rainfall7d: imerg.precipitation7d,
  };

  const risk = calculateRisk(inputs);

  return {
    ...base,
    rainfall: Math.round(primaryRainfall),
    soilMoisture,
    groundMovement: gm.value,
    riskScore: risk.score,
    riskLevel: risk.riskLevel,
    status: risk.riskLevel === "CRITICAL" ? "CRITICAL" : risk.riskLevel === "HIGH" ? "ALERT" : "MONITORING",
    dataStatus: overallStatus,
    lastUpdated: new Date().toISOString(),
    imerg,
  };
}

export function buildLocationSync(locationId: string): Location {
  const base = locationBaseData.find((l) => l.id === locationId);
  if (!base) throw new Error(`Location ${locationId} not found`);

  const fb = fallbackEnvironmentalData[locationId] ?? { rainfall: 80, soilMoisture: 65, groundMovement: 4, temperature: 22 };

  const inputs: RiskInputs = {
    rainfall: fb.rainfall,
    soilMoisture: fb.soilMoisture,
    slope: base.slope,
    elevation: base.elevation,
    groundMovement: fb.groundMovement,
    historicalRisk: base.historicalRisk,
  };

  const risk = calculateRisk(inputs);

  return {
    ...base,
    rainfall: fb.rainfall,
    soilMoisture: fb.soilMoisture,
    groundMovement: fb.groundMovement,
    riskScore: risk.score,
    riskLevel: risk.riskLevel,
    status: risk.riskLevel === "CRITICAL" ? "CRITICAL" : risk.riskLevel === "HIGH" ? "ALERT" : "MONITORING",
    dataStatus: "FALLBACK",
    lastUpdated: new Date().toISOString(),
  };
}

export function getLocationByIdSync(id: string): Location | undefined {
  return getLocationsSync().find((l) => l.id === id);
}

export async function getLocationById(id: string): Promise<Location | undefined> {
  const locs = await fetchAllLocations();
  return locs.find((l) => l.id === id);
}

export function getWeatherConfigStatus(): boolean {
  return isWeatherApiConfigured();
}

export function getImergConfigStatus(): boolean {
  return isImergConfigured();
}

export function clearLocationCache(): void {
  clearImergCache();
}

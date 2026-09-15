import { locationBaseData } from "@/data/fallbackData";
import type { LocationBase } from "@/types";

// ============================================================
// Historical Landslide Risk Service
// ============================================================
// Provides historical landslide risk scores per location.
// This factor is SEPARATED from live environmental inputs (rainfall, soil moisture, etc.)
// because it represents long-term geological/historical susceptibility, not current conditions.
//
// Future: Import official historical landslide datasets (GSI, NRSC, Bhuvan, etc.)
//   into a database table and query by location ID.
// ============================================================

export function getHistoricalRisk(locationId: string): number {
  const loc = locationBaseData.find((l) => l.id === locationId);
  return loc?.historicalRisk ?? 50;
}

export function getAllHistoricalRisks(): Record<string, number> {
  const map: Record<string, number> = {};
  for (const loc of locationBaseData) {
    map[loc.id] = loc.historicalRisk;
  }
  return map;
}

export function getHistoricalRiskByState(): { state: string; avgRisk: number; locationCount: number }[] {
  const stateMap: Record<string, number[]> = {};
  for (const loc of locationBaseData) {
    if (!stateMap[loc.state]) stateMap[loc.state] = [];
    stateMap[loc.state].push(loc.historicalRisk);
  }
  return Object.entries(stateMap).map(([state, risks]) => ({
    state,
    avgRisk: Math.round(risks.reduce((s, r) => s + r, 0) / risks.length),
    locationCount: risks.length,
  }));
}

export function getLocationBaseById(id: string): LocationBase | undefined {
  return locationBaseData.find((l) => l.id === id);
}

import type { OfflineCache } from "@/types/user";
import type { Location, DataStatus } from "@/types";

const CACHE_KEY = "landguard_offline_cache";

export function saveOfflineCache(
  locations: Location[],
  dataStatus: DataStatus,
): void {
  if (locations.length === 0) return;

  const topRisk = [...locations].sort((a, b) => b.riskScore - a.riskScore)[0];
  const cache: OfflineCache = {
    lastRiskScore: topRisk.riskScore,
    lastRiskLevel: topRisk.riskLevel,
    lastLocation: `${topRisk.name}, ${topRisk.state}`,
    lastRainfall: topRisk.rainfall,
    lastUpdated: new Date().toISOString(),
    dataStatus,
  };

  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // storage full or unavailable
  }
}

export function getOfflineCache(): OfflineCache | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as OfflineCache;
  } catch {
    return null;
  }
}

export function clearOfflineCache(): void {
  localStorage.removeItem(CACHE_KEY);
}

export function formatOfflineTimestamp(cache: OfflineCache): string {
  const d = new Date(cache.lastUpdated);
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

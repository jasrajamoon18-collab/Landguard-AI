import type { ImergData, ImergProxyResponse, ImergLocationData, ImergDebugInfo, DataStatus } from "@/types/imerg";
import type { LocationBase } from "@/types/location";
import { locationBaseData, fallbackEnvironmentalData } from "@/data/fallbackData";

// ============================================================
// NASA GPM IMERG Service
// ============================================================
// Retrieves near-real-time precipitation data from NASA GPM
// IMERG V07B Early Run via a Supabase Edge Function proxy.
//
// The edge function holds the NASA Earthdata Bearer token
// server-side so it is never exposed in frontend code.
//
// IMERG latency: ~4 hours minimum
// IMERG spatial resolution: 0.1 degree (~10 km)
// IMERG temporal resolution: 30 minutes
//
// If the edge function is unreachable or NASA is unavailable,
// the service falls back to demo data clearly labeled FALLBACK.
// Never labels fallback data as NASA IMERG data.
// ============================================================

// Edge function URL — derived from Supabase project URL
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const IMERG_FUNCTION_SLUG = "imerg-precipitation";

function getEdgeFunctionUrl(): string {
  if (SUPABASE_URL) {
    return `${SUPABASE_URL}/functions/v1/${IMERG_FUNCTION_SLUG}`;
  }
  return "";
}

export function isImergConfigured(): boolean {
  return typeof SUPABASE_URL === "string" && SUPABASE_URL.length > 0 && SUPABASE_URL.startsWith("http");
}

// In-memory cache for the latest IMERG results.
// Keyed by locationId. Prevents excessive API calls.
// Cache is cleared on page refresh (acceptable for prototype).
interface CacheEntry {
  data: ImergData;
  timestamp: number;
}

const imergCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

// Track the last successful IMERG request globally for debug panel
let lastSuccessfulRequest: string | null = null;
let lastErrorMessage: string | null = null;
let lastConnectionStatus = false;

// Snap lat/lng to nearest 0.1-degree IMERG grid cell
function snapToGrid(value: number): number {
  return Math.round(value * 10) / 10;
}

// Calculate the most recent available IMERG timestamp (UTC).
// IMERG Early Run has ~4 hour latency — go back 5 hours, round to 30 min.
function getLatestImergTime(): Date {
  const now = new Date();
  const target = new Date(now.getTime() - 5 * 60 * 60 * 1000);
  target.setUTCMinutes(Math.floor(target.getUTCMinutes() / 30) * 30, 0, 0);
  return target;
}

// Generate fallback IMERG data for a location.
// These are plausible monsoon-season estimates — clearly labeled FALLBACK.
// Never presented as NASA data.
function getFallbackImerg(lat: number, lng: number, locationId: string): ImergData {
  const gridLat = snapToGrid(lat);
  const gridLng = snapToGrid(lng);
  const obsTime = getLatestImergTime().toISOString();

  const fb = fallbackEnvironmentalData[locationId];
  const base24h = fb?.rainfall ?? 80;
  const base3d = base24h * 1.8;
  const base7d = base24h * 3.2;
  const base3h = base24h * 0.25;
  const base30min = base3h * 0.15;

  return {
    lat,
    lng,
    gridLat,
    gridLng,
    precipitation30min: +base30min.toFixed(2),
    precipitation3h: +base3h.toFixed(2),
    precipitation24h: base24h,
    precipitation3d: +base3d.toFixed(2),
    precipitation7d: +base7d.toFixed(2),
    observationTime: obsTime,
    source: "NASA IMERG Fallback (Demo Data)",
    product: "IMERG V07B",
    run: "Early Run",
    spatialResolution: "0.1° (~10 km)",
    dataStatus: "FALLBACK",
  };
}

// Convert proxy response to ImergData
function proxyResponseToImergData(res: ImergProxyResponse): ImergData {
  return {
    lat: res.lat,
    lng: res.lng,
    gridLat: res.gridLat,
    gridLng: res.gridLng,
    precipitation30min: res.precipitation30min,
    precipitation3h: res.precipitation3h,
    precipitation24h: res.precipitation24h,
    precipitation3d: res.precipitation3d,
    precipitation7d: res.precipitation7d,
    observationTime: res.observationTime,
    source: res.status === "LIVE" ? "NASA IMERG Near-Real-Time" : "NASA IMERG Fallback (Demo Data)",
    product: res.product,
    run: res.run,
    spatialResolution: res.spatialResolution,
    dataStatus: res.status as DataStatus,
    errorMessage: res.error,
  };
}

// Fetch IMERG precipitation for a single location
export async function fetchImergForLocation(
  lat: number,
  lng: number,
  locationId: string,
): Promise<ImergData> {
  // Check cache first
  const cached = imergCache.get(locationId);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  if (!isImergConfigured()) {
    lastConnectionStatus = false;
    lastErrorMessage = "IMERG edge function URL not configured";
    return getFallbackImerg(lat, lng, locationId);
  }

  const url = getEdgeFunctionUrl();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (SUPABASE_ANON_KEY) {
    headers["Authorization"] = `Bearer ${SUPABASE_ANON_KEY}`;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    const response = await fetch(`${url}?lat=${lat}&lng=${lng}`, {
      method: "GET",
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`IMERG proxy returned ${response.status}`);
    }

    const data: ImergProxyResponse = await response.json();

    // Validate response has expected fields
    if (typeof data.precipitation24h !== "number") {
      throw new Error("Invalid IMERG response: missing precipitation data");
    }

    const imergData = proxyResponseToImergData(data);

    // Cache the result
    imergCache.set(locationId, {
      data: imergData,
      timestamp: Date.now(),
    });

    if (imergData.dataStatus === "LIVE") {
      lastSuccessfulRequest = new Date().toISOString();
      lastConnectionStatus = true;
      lastErrorMessage = null;
    } else if (imergData.dataStatus === "FALLBACK") {
      lastConnectionStatus = false;
      lastErrorMessage = imergData.errorMessage ?? "NASA data temporarily unavailable";
    }

    return imergData;
  } catch (err) {
    lastConnectionStatus = false;
    lastErrorMessage = err instanceof Error ? err.message : "Unknown IMERG fetch error";

    // Return fallback on any error — app must not crash
    return getFallbackImerg(lat, lng, locationId);
  }
}

// Fetch IMERG data for all NER locations in parallel
export async function fetchImergForAllLocations(): Promise<Map<string, ImergData>> {
  const results = new Map<string, ImergData>();

  const promises = locationBaseData.map(async (loc) => {
    const data = await fetchImergForLocation(loc.lat, loc.lng, loc.id);
    return { id: loc.id, data };
  });

  const settled = await Promise.allSettled(promises);

  for (const result of settled) {
    if (result.status === "fulfilled") {
      results.set(result.value.id, result.value.data);
    }
  }

  return results;
}

// Get IMERG data for a specific location by ID (async, uses cache)
export async function getImergByLocationId(locationId: string): Promise<ImergData | null> {
  const base = locationBaseData.find((l) => l.id === locationId);
  if (!base) return null;
  return fetchImergForLocation(base.lat, base.lng, locationId);
}

// Get the overall IMERG data status across all locations
export function getImergOverallStatus(imergMap: Map<string, ImergData>): DataStatus {
  if (imergMap.size === 0) return "FALLBACK";
  const allLive = Array.from(imergMap.values()).every((d) => d.dataStatus === "LIVE");
  const anyError = Array.from(imergMap.values()).some((d) => d.dataStatus === "ERROR");
  if (anyError) return "ERROR";
  if (allLive) return "LIVE";
  return "FALLBACK";
}

// Get debug info for the developer panel
export function getImergDebugInfo(selectedLocationId: string | null): ImergDebugInfo {
  let lat: number | null = null;
  let lng: number | null = null;
  let selectedLocationName: string | null = null;

  if (selectedLocationId) {
    const loc = locationBaseData.find((l) => l.id === selectedLocationId);
    if (loc) {
      lat = loc.lat;
      lng = loc.lng;
      selectedLocationName = loc.name;
    }
  }

  const cached = selectedLocationId ? imergCache.get(selectedLocationId) : null;

  return {
    connected: lastConnectionStatus,
    lastSuccessfulRequest,
    lastObservationTime: cached?.data.observationTime ?? null,
    selectedLocation: selectedLocationName,
    lat,
    lng,
    product: "IMERG V07B",
    run: "Early Run",
    dataStatus: cached?.data.dataStatus ?? "FALLBACK",
    errorMessage: lastErrorMessage,
  };
}

// Clear the IMERG cache (used by manual refresh)
export function clearImergCache(): void {
  imergCache.clear();
}

// Get the primary rainfall value for risk calculation.
// Uses 24-hour precipitation as the primary rainfall input,
// with 3-day and 7-day as secondary factors.
export function getPrimaryRainfall(imerg: ImergData): number {
  return imerg.precipitation24h;
}

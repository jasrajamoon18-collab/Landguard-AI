import type { DataStatus } from "./location";
export type { DataStatus } from "./location";

// ============================================================
// NASA GPM IMERG Types
// ============================================================
// IMERG = Integrated Multi-satellitE Retrievals for GPM
// Product: IMERG V07B, Early Run, Near Real-Time
// Latency: ~4 hours minimum
// Spatial resolution: 0.1 degree (~10 km)
// Temporal resolution: 30 minutes
//
// NASA IMERG provides precipitation estimates only.
// It does NOT predict landslides. LANDGUARD uses IMERG
// rainfall as one input feature in its own risk engine.
// ============================================================

export type ImergProduct = "IMERG V07B";
export type ImergRun = "Early Run";

export interface ImergRainfallWindows {
  precipitation30min: number; // mm — latest 30-minute precipitation
  precipitation3h: number; // mm — accumulated 3-hour precipitation
  precipitation24h: number; // mm — accumulated 24-hour (1-day) precipitation
  precipitation3d: number; // mm — accumulated 3-day precipitation
  precipitation7d: number; // mm — accumulated 7-day precipitation
}

export interface ImergData extends ImergRainfallWindows {
  lat: number; // queried latitude
  lng: number; // queried longitude
  gridLat: number; // nearest IMERG grid cell latitude (0.1 deg resolution)
  gridLng: number; // nearest IMERG grid cell longitude
  observationTime: string; // ISO timestamp of the IMERG observation
  source: string; // human-readable source label
  product: ImergProduct; // e.g. "IMERG V07B"
  run: ImergRun; // e.g. "Early Run"
  spatialResolution: string; // e.g. "0.1° (~10 km)"
  dataStatus: DataStatus; // LIVE | FALLBACK | ERROR
  errorMessage?: string; // present when dataStatus is ERROR
}

export interface ImergLocationData extends ImergData {
  locationId: string;
  locationName: string;
  state: string;
}

// Edge function response shape
export interface ImergProxyResponse {
  lat: number;
  lng: number;
  gridLat: number;
  gridLng: number;
  precipitation30min: number;
  precipitation3h: number;
  precipitation24h: number;
  precipitation3d: number;
  precipitation7d: number;
  observationTime: string;
  product: ImergProduct;
  run: ImergRun;
  spatialResolution: string;
  status: DataStatus;
  error?: string;
}

// Debug / diagnostic info for the developer panel
export interface ImergDebugInfo {
  connected: boolean;
  lastSuccessfulRequest: string | null; // ISO timestamp
  lastObservationTime: string | null; // ISO timestamp
  selectedLocation: string | null;
  lat: number | null;
  lng: number | null;
  product: ImergProduct | null;
  run: ImergRun | null;
  dataStatus: DataStatus;
  errorMessage: string | null;
}

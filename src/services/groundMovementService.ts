import type { DataStatus } from "@/types";
import { fallbackEnvironmentalData } from "@/data/fallbackData";

// ============================================================
// Ground Movement Service
// ============================================================
// Structured to receive real ground-movement data from:
//   - GPS/GNSS sensors
//   - InSAR (satellite interferometry)
//   - IoT crackmeters / extensometers
//   - Other authorized monitoring networks
//
// Currently returns fallback demo data since no real sensor source is configured.
// Never claims demo values are real measurements.
// ============================================================

export function isGroundMovementSourceConfigured(): boolean {
  // Check for future env var: VITE_GROUND_MOVEMENT_API_URL
  const url = import.meta.env.VITE_GROUND_MOVEMENT_API_URL as string | undefined;
  return typeof url === "string" && url.length > 0;
}

export function getGroundMovement(locationId: string): { value: number; dataSource: DataStatus; description: string } {
  if (isGroundMovementSourceConfigured()) {
    // Future: fetch from real sensor API
    // const url = import.meta.env.VITE_GROUND_MOVEMENT_API_URL;
    // const response = await fetch(`${url}/sensors/${locationId}`);
    // return { value: data.displacement, dataSource: "LIVE", description: "GNSS Sensor" };
  }

  const fb = fallbackEnvironmentalData[locationId] ?? { groundMovement: 4 };
  return {
    value: fb.groundMovement,
    dataSource: "FALLBACK",
    description: "DEMO SENSOR DATA",
  };
}

export function getGroundMovementDataSourceStatus(): DataStatus {
  return isGroundMovementSourceConfigured() ? "LIVE" : "FALLBACK";
}

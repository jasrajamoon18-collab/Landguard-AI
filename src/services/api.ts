import type { Alert, Location, PredictionResult, SensorData } from "@/types";
import { locations as staticLocations } from "@/data/locations";
import { alerts as staticAlerts } from "@/data/alerts";
import { generateSensorHistory, type SensorHistoryPoint } from "@/data/sensors";
import { predictRisk } from "@/utils/risk";

// Demo service layer — currently returns local/simulated data.
// In production these functions would call backend API endpoints:
//   /api/risk/predict, /api/locations, /api/sensors, /api/alerts, /api/historical

export function getLocations(): Location[] {
  return staticLocations;
}

export function getLocationById(id: string): Location | undefined {
  return staticLocations.find((l) => l.id === id);
}

export function getAlerts(): Alert[] {
  return staticAlerts;
}

export function getSensorData(locationId?: string): SensorData {
  const loc = locationId ? getLocationById(locationId) : staticLocations[0];
  if (!loc) {
    return {
      rainfall: 126,
      soilMoisture: 84,
      groundMovement: 8,
      temperature: 24,
      weather: "Heavy Rain Simulation",
      riskScore: 82,
      riskLevel: "HIGH",
      timestamp: new Date().toISOString(),
    };
  }
  return {
    rainfall: loc.rainfall,
    soilMoisture: loc.soilMoisture,
    groundMovement: loc.groundMovement,
    temperature: 20 + Math.round(Math.random() * 10),
    weather: loc.riskLevel === "CRITICAL" ? "Heavy Rain Simulation" : "Rain Simulation",
    riskScore: loc.riskScore,
    riskLevel: loc.riskLevel,
    timestamp: new Date().toISOString(),
  };
}

export function getSensorHistory(hours = 24): SensorHistoryPoint[] {
  return generateSensorHistory(hours);
}

export function predictRiskService(inputs: {
  rainfall: number;
  soilMoisture: number;
  slope: number;
  elevation: number;
  groundMovement: number;
  historicalRisk: number;
}): PredictionResult {
  return predictRisk(inputs);
}

// Future production architecture placeholder:
// These functions would call /api/* endpoints backed by a trained ML model
// (Random Forest / XGBoost) and real sensor networks.
// export async function fetchPredictionFromAPI(inputs): Promise<PredictionResult> { ... }

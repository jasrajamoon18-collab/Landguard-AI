// Barrel re-export for backward compatibility with existing imports
import type { RiskLevel } from "./risk";
export type { RiskLevel, RiskInputs, RiskResult, RiskFactor, RiskData, PredictionResult, RiskPredictRequest, RiskPredictResponse } from "./risk";
export type { NERState, LocationBase, Location, DataStatus, DataSourceInfo } from "./location";
export type { WeatherData, WeatherServiceConfig } from "./weather";
export type { Alert } from "./alert";
export type {
  ImergData,
  ImergProduct,
  ImergRun,
  ImergRainfallWindows,
  ImergLocationData,
  ImergProxyResponse,
  ImergDebugInfo,
} from "./imerg";
export { NER_STATES } from "./location";

// UI-only types kept here
export type PageId =
  | "dashboard"
  | "map"
  | "prediction"
  | "monitoring"
  | "alerts"
  | "locations"
  | "analytics"
  | "emergency"
  | "about"
  | "register"
  | "myalerts"
  | "alert-settings"
  | "alert-history"
  | "emergency-info"
  | "admin";

export type Language = "en" | "hi" | "as";

// Legacy SensorData interface (used by simulation + monitoring)
export interface SensorData {
  rainfall: number;
  soilMoisture: number;
  groundMovement: number;
  temperature: number;
  weather: string;
  riskScore: number;
  riskLevel: RiskLevel;
  timestamp: string;
}

export interface SensorHistoryPoint {
  time: string;
  rainfall: number;
  soilMoisture: number;
  groundMovement: number;
  riskScore: number;
}

export type RiskLevel = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";

export type NERState =
  | "Arunachal Pradesh"
  | "Assam"
  | "Meghalaya"
  | "Manipur"
  | "Mizoram"
  | "Nagaland"
  | "Tripura"
  | "Sikkim";

export interface Location {
  id: string;
  name: string;
  state: NERState;
  lat: number;
  lng: number;
  rainfall: number; // mm
  soilMoisture: number; // %
  slope: number; // degrees
  elevation: number; // meters
  groundMovement: number; // mm
  historicalRisk: number; // %
  riskScore: number; // 0-100
  riskLevel: RiskLevel;
  status: "MONITORING" | "ALERT" | "CRITICAL";
}

export interface RiskData {
  score: number;
  level: RiskLevel;
  contributions: {
    rainfall: number;
    soilMoisture: number;
    slope: number;
    groundMovement: number;
    historicalRisk: number;
  };
}

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

export interface Alert {
  id: string;
  time: string;
  locationId: string;
  locationName: string;
  state: NERState;
  riskLevel: RiskLevel;
  riskScore: number;
  reason: string;
  status: "ACTIVE" | "ACKNOWLEDGED" | "RESOLVED";
  factors: string[];
  action: string;
}

export interface PredictionResult {
  score: number;
  level: RiskLevel;
  contributions: {
    rainfall: number;
    soilMoisture: number;
    slope: number;
    groundMovement: number;
    historicalRisk: number;
  };
  explanation: string;
}

export type PageId =
  | "dashboard"
  | "map"
  | "prediction"
  | "monitoring"
  | "alerts"
  | "locations"
  | "analytics"
  | "emergency"
  | "about";

export type Language = "en" | "hi" | "as";

export type RiskLevel = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";

export interface RiskInputs {
  rainfall: number; // mm (24-hour precipitation — primary rainfall input)
  soilMoisture: number; // %
  slope: number; // degrees
  elevation: number; // meters (contextual only)
  groundMovement: number; // mm
  historicalRisk: number; // %
  // Extended rainfall windows from NASA IMERG (optional — used when available)
  rainfall3h?: number; // mm (3-hour accumulated precipitation)
  rainfall3d?: number; // mm (3-day accumulated precipitation)
  rainfall7d?: number; // mm (7-day accumulated precipitation)
}

export interface RiskFactor {
  key: string;
  label: string;
  weight: number;
  normalizedValue: number; // 0-100
  rawValue: number;
  unit: string;
}

export interface RiskResult {
  score: number; // 0-100
  riskLevel: RiskLevel;
  factors: RiskFactor[];
  explanation: string;
  model: string;
  dataSource: string;
}

// Legacy compatible interfaces (used by existing components during migration)
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
  factors?: RiskFactor[];
  model?: string;
  dataSource?: string;
}

// Expected API request/response for POST /api/risk/predict
export interface RiskPredictRequest extends RiskInputs {}

export interface RiskPredictResponse {
  score: number;
  riskLevel: RiskLevel;
  factors: RiskFactor[];
  explanation: string;
}

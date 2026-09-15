import type { RiskInputs, RiskResult, RiskLevel, RiskFactor } from "@/types/risk";

// ============================================================
// Risk Calculation Service — Prototype Risk Engine
// ============================================================
// This is a TRANSPARENT, DETERMINISTIC weighted scoring model.
// It is NOT a trained or validated ML model.
//
// Weights (must sum to 1.0):
//   Rainfall (24h):     18%  — primary trigger: recent intense precipitation
//   Rainfall (3d):      7%   — antecedent moisture from multi-day rain
//   Rainfall (7d):      5%   — sustained rainfall weakens slope stability
//   Soil Moisture:      25%  — saturated soil reduces stability
//   Slope:              20%  — steeper slopes are more susceptible
//   Ground Movement:    15%  — direct indicator of slope instability
//   Historical Risk:    10%  — areas with past landslides are more vulnerable
//   Elevation:           0%  — contextual only (displayed but not scored)
//
// TO REPLACE WITH A TRAINED ML MODEL:
//   Replace the calculateRisk() function body with a call to a trained
//   Random Forest or XGBoost model endpoint (POST /api/risk/predict).
//   Keep the same RiskResult interface so no UI changes are needed.
//
//   Example future implementation:
//     export async function predictRisk(inputs: RiskInputs): Promise<RiskResult> {
//       const res = await fetch('/api/risk/predict', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(inputs),
//       });
//       const data: RiskPredictResponse = await res.json();
//       return { ...data, model: 'XGBoost v1.0', dataSource: 'LIVE' };
//     }
// ============================================================

const WEIGHTS = {
  rainfall: 0.18,   // 24-hour precipitation
  rainfall3d: 0.07, // 3-day accumulated precipitation
  rainfall7d: 0.05, // 7-day accumulated precipitation
  soilMoisture: 0.25,
  slope: 0.2,
  groundMovement: 0.15,
  historicalRisk: 0.1,
} as const;

const NORMALIZATION = {
  rainfall: { min: 0, max: 200, unit: "mm" },     // 24-hour precipitation
  rainfall3d: { min: 0, max: 400, unit: "mm" },   // 3-day accumulated
  rainfall7d: { min: 0, max: 600, unit: "mm" },   // 7-day accumulated
  soilMoisture: { min: 0, max: 100, unit: "%" },
  slope: { min: 0, max: 60, unit: "°" },
  groundMovement: { min: 0, max: 15, unit: "mm" },
  historicalRisk: { min: 0, max: 100, unit: "%" },
} as const;

const MODEL_NAME = "Prototype Risk Engine";

export function classifyRisk(score: number): RiskLevel {
  if (score <= 25) return "LOW";
  if (score <= 50) return "MODERATE";
  if (score <= 75) return "HIGH";
  return "CRITICAL";
}

function normalize(value: number, min: number, max: number): number {
  const clamped = Math.max(min, Math.min(max, value));
  return ((clamped - min) / (max - min)) * 100;
}

export function calculateRisk(inputs: RiskInputs): RiskResult {
  const rainfallN = normalize(inputs.rainfall, NORMALIZATION.rainfall.min, NORMALIZATION.rainfall.max);
  const rainfall3dN = normalize(inputs.rainfall3d ?? inputs.rainfall * 1.8, NORMALIZATION.rainfall3d.min, NORMALIZATION.rainfall3d.max);
  const rainfall7dN = normalize(inputs.rainfall7d ?? inputs.rainfall * 3.2, NORMALIZATION.rainfall7d.min, NORMALIZATION.rainfall7d.max);
  const soilN = normalize(inputs.soilMoisture, NORMALIZATION.soilMoisture.min, NORMALIZATION.soilMoisture.max);
  const slopeN = normalize(inputs.slope, NORMALIZATION.slope.min, NORMALIZATION.slope.max);
  const groundN = normalize(inputs.groundMovement, NORMALIZATION.groundMovement.min, NORMALIZATION.groundMovement.max);
  const histN = normalize(inputs.historicalRisk, NORMALIZATION.historicalRisk.min, NORMALIZATION.historicalRisk.max);

  const score = Math.round(
    rainfallN * WEIGHTS.rainfall +
      rainfall3dN * WEIGHTS.rainfall3d +
      rainfall7dN * WEIGHTS.rainfall7d +
      soilN * WEIGHTS.soilMoisture +
      slopeN * WEIGHTS.slope +
      groundN * WEIGHTS.groundMovement +
      histN * WEIGHTS.historicalRisk,
  );

  const factors: RiskFactor[] = [
    { key: "rainfall", label: "Rainfall (24h)", weight: WEIGHTS.rainfall, normalizedValue: Math.round(rainfallN), rawValue: inputs.rainfall, unit: "mm" },
    { key: "rainfall3d", label: "Rainfall (3d)", weight: WEIGHTS.rainfall3d, normalizedValue: Math.round(rainfall3dN), rawValue: inputs.rainfall3d ?? Math.round(inputs.rainfall * 1.8), unit: "mm" },
    { key: "rainfall7d", label: "Rainfall (7d)", weight: WEIGHTS.rainfall7d, normalizedValue: Math.round(rainfall7dN), rawValue: inputs.rainfall7d ?? Math.round(inputs.rainfall * 3.2), unit: "mm" },
    { key: "soilMoisture", label: "Soil Moisture", weight: WEIGHTS.soilMoisture, normalizedValue: Math.round(soilN), rawValue: inputs.soilMoisture, unit: "%" },
    { key: "slope", label: "Slope", weight: WEIGHTS.slope, normalizedValue: Math.round(slopeN), rawValue: inputs.slope, unit: "°" },
    { key: "groundMovement", label: "Ground Movement", weight: WEIGHTS.groundMovement, normalizedValue: Math.round(groundN), rawValue: inputs.groundMovement, unit: "mm" },
    { key: "historicalRisk", label: "Historical Risk", weight: WEIGHTS.historicalRisk, normalizedValue: Math.round(histN), rawValue: inputs.historicalRisk, unit: "%" },
  ];

  const clampedScore = Math.max(0, Math.min(100, score));
  const riskLevel = classifyRisk(clampedScore);
  const explanation = generateExplanation(factors);

  return {
    score: clampedScore,
    riskLevel,
    factors,
    explanation,
    model: MODEL_NAME,
    dataSource: "Prototype Risk Engine · Transparent Weighted Model",
  };
}

export function generateExplanation(factors: RiskFactor[]): string {
  const significant = factors.filter((f) => f.normalizedValue >= 40 && f.key !== "rainfall3d" && f.key !== "rainfall7d").sort((a, b) => b.normalizedValue - a.normalizedValue);

  if (significant.length === 0) {
    return "Current conditions do not indicate significant landslide risk. Continue routine monitoring.";
  }

  const labels = significant.map((f) => {
    if (f.normalizedValue >= 70) return f.key === "rainfall" ? "heavy rainfall" : f.key === "soilMoisture" ? "high soil moisture" : f.key === "groundMovement" ? "increasing ground movement" : f.key === "slope" ? "steep terrain" : f.key === "historicalRisk" ? "significant historical landslide activity" : f.label.toLowerCase();
    return f.key === "rainfall" ? "moderate rainfall" : f.key === "soilMoisture" ? "elevated soil moisture" : f.key === "groundMovement" ? "notable ground movement" : f.key === "slope" ? "moderate slope" : f.label.toLowerCase();
  });

  if (labels.length === 1) return `The estimated risk is mainly influenced by ${labels[0]}.`;
  const last = labels.pop();
  return `The estimated risk is mainly influenced by ${labels.join(", ")} and ${last}.`;
}

// Legacy-compatible function for components that expect the old PredictionResult shape
import type { PredictionResult } from "@/types/risk";

export function predictRisk(inputs: RiskInputs): PredictionResult {
  const result = calculateRisk(inputs);
  return {
    score: result.score,
    level: result.riskLevel,
    contributions: {
      rainfall: result.factors[0].normalizedValue,
      soilMoisture: result.factors[3].normalizedValue,
      slope: result.factors[4].normalizedValue,
      groundMovement: result.factors[5].normalizedValue,
      historicalRisk: result.factors[6].normalizedValue,
    },
    explanation: result.explanation,
    factors: result.factors,
    model: result.model,
    dataSource: result.dataSource,
  };
}

import type { RiskData, RiskLevel, PredictionResult } from "@/types";

export function classifyRisk(score: number): RiskLevel {
  if (score <= 25) return "LOW";
  if (score <= 50) return "MODERATE";
  if (score <= 75) return "HIGH";
  return "CRITICAL";
}

export function riskColor(level: RiskLevel): string {
  switch (level) {
    case "LOW":
      return "#22c55e";
    case "MODERATE":
      return "#eab308";
    case "HIGH":
      return "#f97316";
    case "CRITICAL":
      return "#ef4444";
  }
}

export function riskBgClass(level: RiskLevel): string {
  switch (level) {
    case "LOW":
      return "bg-emerald-500";
    case "MODERATE":
      return "bg-yellow-500";
    case "HIGH":
      return "bg-orange-500";
    case "CRITICAL":
      return "bg-red-500";
  }
}

export function riskTextClass(level: RiskLevel): string {
  switch (level) {
    case "LOW":
      return "text-emerald-400";
    case "MODERATE":
      return "text-yellow-400";
    case "HIGH":
      return "text-orange-400";
    case "CRITICAL":
      return "text-red-400";
  }
}

export function riskBorderClass(level: RiskLevel): string {
  switch (level) {
    case "LOW":
      return "border-emerald-500/40";
    case "MODERATE":
      return "border-yellow-500/40";
    case "HIGH":
      return "border-orange-500/40";
    case "CRITICAL":
      return "border-red-500/40";
  }
}

interface RiskInputs {
  rainfall: number;
  soilMoisture: number;
  slope: number;
  elevation: number;
  groundMovement: number;
  historicalRisk: number;
}

const WEIGHTS = {
  rainfall: 0.3,
  soilMoisture: 0.25,
  slope: 0.2,
  groundMovement: 0.15,
  historicalRisk: 0.1,
};

function normalize(value: number, min: number, max: number): number {
  const clamped = Math.max(min, Math.min(max, value));
  return ((clamped - min) / (max - min)) * 100;
}

export function calculateRisk(inputs: RiskInputs): RiskData {
  const rainfallN = normalize(inputs.rainfall, 0, 200);
  const soilN = normalize(inputs.soilMoisture, 0, 100);
  const slopeN = normalize(inputs.slope, 0, 60);
  const groundN = normalize(inputs.groundMovement, 0, 15);
  const histN = normalize(inputs.historicalRisk, 0, 100);

  const score = Math.round(
    rainfallN * WEIGHTS.rainfall +
      soilN * WEIGHTS.soilMoisture +
      slopeN * WEIGHTS.slope +
      groundN * WEIGHTS.groundMovement +
      histN * WEIGHTS.historicalRisk,
  );

  return {
    score: Math.max(0, Math.min(100, score)),
    level: classifyRisk(score),
    contributions: {
      rainfall: Math.round(rainfallN),
      soilMoisture: Math.round(soilN),
      slope: Math.round(slopeN),
      groundMovement: Math.round(groundN),
      historicalRisk: Math.round(histN),
    },
  };
}

export function generateExplanation(c: PredictionResult["contributions"], inputs: RiskInputs): string {
  const factors: string[] = [];
  if (c.rainfall >= 70) factors.push("heavy rainfall");
  else if (c.rainfall >= 40) factors.push("moderate rainfall");
  if (c.soilMoisture >= 70) factors.push("high soil moisture");
  else if (c.soilMoisture >= 40) factors.push("elevated soil moisture");
  if (c.groundMovement >= 70) factors.push("increasing ground movement");
  else if (c.groundMovement >= 40) factors.push("notable ground movement");
  if (c.slope >= 70) factors.push("steep terrain");
  else if (c.slope >= 40) factors.push("moderate slope");
  if (c.historicalRisk >= 70) factors.push("significant historical landslide activity");

  if (factors.length === 0) {
    return "Current simulated conditions do not indicate significant landslide risk. Continue routine monitoring.";
  }
  if (factors.length === 1) {
    return `The simulated risk is mainly influenced by ${factors[0]}.`;
  }
  const last = factors.pop();
  return `The simulated risk is mainly influenced by ${factors.join(", ")} and ${last}.`;
}

export function predictRisk(inputs: RiskInputs): PredictionResult {
  const risk = calculateRisk(inputs);
  const explanation = generateExplanation(risk.contributions, inputs);
  return {
    score: risk.score,
    level: risk.level,
    contributions: risk.contributions,
    explanation,
  };
}

// Re-export risk utilities from the service layer for backward compatibility.
// The canonical risk calculation now lives in src/services/riskService.ts.

export { classifyRisk, calculateRisk, predictRisk, generateExplanation } from "@/services/riskService";
export type { RiskInputs, RiskResult, RiskFactor, RiskData, PredictionResult } from "@/types/risk";

import type { RiskLevel } from "@/types/risk";

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

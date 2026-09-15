// Re-export SensorHistoryPoint type and fallback generator.
// Alert generation is now handled by alertService.ts.

export type { SensorHistoryPoint } from "@/types";
export { generateFallbackSensorHistory } from "./fallbackData";

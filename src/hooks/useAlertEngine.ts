import { useEffect, useRef, useCallback } from "react";
import { getLocalRegistration } from "@/services/userPreferencesService";
import { shouldTriggerAlert, triggerAlert, type AlertTriggerResult } from "@/services/alertEngineService";
import { saveOfflineCache } from "@/services/offlineService";
import type { Location, DataStatus } from "@/types";

interface UseAlertEngineOptions {
  locations: Location[];
  dataStatus: DataStatus;
  enabled: boolean;
  onAlert?: (result: AlertTriggerResult) => void;
}

export function useAlertEngine({ locations, dataStatus, enabled, onAlert }: UseAlertEngineOptions) {
  const prevRiskRef = useRef<Map<string, { level: string; score: number }>>(new Map());
  const onAlertRef = useRef(onAlert);
  onAlertRef.current = onAlert;

  // Save offline cache whenever locations change
  useEffect(() => {
    saveOfflineCache(locations, dataStatus);
  }, [locations, dataStatus]);

  const checkAlerts = useCallback(async () => {
    if (!enabled) return;
    const registration = getLocalRegistration();
    if (!registration) return;

    for (const loc of locations) {
      const prev = prevRiskRef.current.get(loc.id);
      const currLevel = loc.riskLevel;
      const currScore = loc.riskScore;

      // Only check if risk changed since last scan
      if (prev && prev.level === currLevel && prev.score === currScore) continue;

      const { shouldTrigger, reason } = shouldTriggerAlert(registration, loc);
      if (shouldTrigger) {
        const result = await triggerAlert(registration, loc, false);
        onAlertRef.current?.(result);
      }

      prevRiskRef.current.set(loc.id, { level: currLevel, score: currScore });
    }
  }, [locations, enabled]);

  // Run alert check when locations change
  useEffect(() => {
    checkAlerts();
  }, [checkAlerts]);

  return { checkAlerts };
}

export function useSimulatedAlert() {
  return async (
    locations: Location[],
    targetLevel: "MODERATE" | "HIGH" | "CRITICAL",
    onAlert?: (result: AlertTriggerResult) => void,
  ) => {
    const registration = getLocalRegistration();
    if (!registration || locations.length === 0) return;

    // Find nearest location to user
    const loc = locations[0];
    const simulatedLoc: Location = {
      ...loc,
      riskLevel: targetLevel,
      riskScore: targetLevel === "CRITICAL" ? 88 : targetLevel === "HIGH" ? 72 : 45,
    };

    const { shouldTrigger } = shouldTriggerAlert(registration, simulatedLoc);
    if (shouldTrigger || true) {
      const result = await triggerAlert(registration, simulatedLoc, true);
      onAlert?.(result);
    }
  };
}

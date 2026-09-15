import { useState, useEffect, useCallback, useRef } from "react";
import type { Location, Alert, DataStatus } from "@/types";
import { getLocationsSync, fetchAllLocations } from "@/services/locationService";
import { generateAlertsFromLocations } from "@/services/alertService";
import { isImergConfigured, clearImergCache, getImergDebugInfo } from "@/services/imergService";

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>(() => getLocationsSync());
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataStatus, setDataStatus] = useState<DataStatus>("FALLBACK");
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [isSimulating, setIsSimulating] = useState(false);
  const refreshTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setAlerts(generateAlertsFromLocations(locations));
  }, [locations]);

  useEffect(() => {
    if (isSimulating) {
      setDataStatus("SIMULATION");
      return;
    }
    const allLive = locations.every((l) => l.dataStatus === "LIVE");
    const anyError = locations.some((l) => l.dataStatus === "ERROR");
    if (anyError) setDataStatus("ERROR");
    else if (allLive) setDataStatus("LIVE");
    else setDataStatus("FALLBACK");
  }, [locations, isSimulating]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    clearImergCache();
    try {
      const locs = await fetchAllLocations();
      setLocations(locs);
      setLastRefresh(new Date());
    } catch {
      setError("Live data temporarily unavailable. Showing fallback prototype data.");
      setLocations(getLocationsSync());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    refreshTimerRef.current = setInterval(refresh, 30 * 60 * 1000);
    return () => {
      if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
    };
  }, [refresh]);

  const updateLocations = useCallback((newLocs: Location[]) => {
    setLocations(newLocs);
  }, []);

  const setSimulationMode = useCallback((active: boolean) => {
    setIsSimulating(active);
  }, []);

  const regionScore = locations.length > 0
    ? Math.round(locations.reduce((s, l) => s + l.riskScore, 0) / locations.length)
    : 0;

  const imergConfigured = isImergConfigured();

  return {
    locations,
    alerts,
    loading,
    error,
    dataStatus,
    lastRefresh,
    regionScore,
    isSimulating,
    imergConfigured,
    refresh,
    updateLocations,
    setSimulationMode,
  };
}

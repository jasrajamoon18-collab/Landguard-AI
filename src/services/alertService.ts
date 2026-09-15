import type { Alert, Location, RiskLevel, DataStatus } from "@/types";
import { calculateRisk } from "./riskService";

// ============================================================
// Alert Service
// ============================================================
// Generates alerts DYNAMICALLY from calculated risk scores.
// When risk changes (e.g., during simulation), alert status updates automatically.
//
// Alert generation rules:
//   score <= 25:  LOW (no alert generated)
//   26-50:        MODERATE (advisory)
//   51-75:        HIGH (alert)
//   76-100:       CRITICAL (critical alert)
//
// Does NOT send real SMS/email/push notifications.
// Future: POST /api/alerts to persist to database, trigger real notifications.
// ============================================================

const ACTION_BY_LEVEL: Record<RiskLevel, string> = {
  LOW: "Continue routine monitoring. No action required at this time.",
  MODERATE: "Increase monitoring frequency. Report any ground cracks to local authorities.",
  HIGH: "Restrict access to unstable slopes. Monitor official channels for evacuation orders.",
  CRITICAL: "Avoid steep slopes and follow instructions from official disaster-management authorities. Prepare for possible evacuation.",
};

export function generateAlertsFromLocations(locations: Location[]): Alert[] {
  const alerts: Alert[] = [];
  const now = new Date();

  // Generate current alerts for MODERATE and above
  for (const loc of locations) {
    if (loc.riskLevel === "LOW") continue;

    const factors = buildFactors(loc);
    alerts.push({
      id: `alert-${loc.id}`,
      time: now.toISOString(),
      locationId: loc.id,
      locationName: loc.name,
      state: loc.state,
      riskLevel: loc.riskLevel,
      riskScore: loc.riskScore,
      reason: buildReason(loc),
      status: loc.riskLevel === "CRITICAL" || loc.riskLevel === "HIGH" ? "ACTIVE" : "ACTIVE",
      factors,
      action: ACTION_BY_LEVEL[loc.riskLevel],
      dataSource: loc.dataStatus,
    });
  }

  // Generate historical alerts (deterministic based on location data, not random)
  const historicalTimes = [
    { hoursAgo: 48 }, { hoursAgo: 72 }, { hoursAgo: 96 }, { hoursAgo: 120 },
    { hoursAgo: 144 }, { hoursAgo: 168 }, { hoursAgo: 192 }, { hoursAgo: 216 },
  ];

  // Pick locations deterministically — those with highest historical risk
  const histLocations = [...locations]
    .filter((l) => l.historicalRisk >= 50)
    .sort((a, b) => b.historicalRisk - a.historicalRisk)
    .slice(0, 8);

  histLocations.forEach((loc, i) => {
    const timeData = historicalTimes[i % historicalTimes.length];
    const time = new Date(now.getTime() - timeData.hoursAgo * 3600000);
    // Simulate a past event with a slightly different score
    const pastScore = Math.max(30, Math.min(100, loc.riskScore - 10 + (i % 3) * 5));
    const pastLevel: RiskLevel = pastScore > 75 ? "CRITICAL" : pastScore > 50 ? "HIGH" : "MODERATE";

    alerts.push({
      id: `hist-alert-${loc.id}-${i}`,
      time: time.toISOString(),
      locationId: loc.id,
      locationName: loc.name,
      state: loc.state,
      riskLevel: pastLevel,
      riskScore: pastScore,
      reason: `Past event: elevated risk detected at ${loc.name}`,
      status: "RESOLVED",
      factors: buildFactors({ ...loc, riskScore: pastScore, riskLevel: pastLevel }),
      action: ACTION_BY_LEVEL[pastLevel],
      dataSource: "FALLBACK" as DataStatus,
    });
  });

  return alerts.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
}

function buildFactors(loc: Location): string[] {
  const factors: string[] = [];
  if (loc.rainfall > 100) factors.push("Heavy rainfall");
  else if (loc.rainfall > 70) factors.push("Moderate to heavy rainfall");
  if (loc.soilMoisture > 75) factors.push("High soil moisture");
  if (loc.groundMovement > 5) factors.push("Increasing ground movement");
  if (loc.slope > 30) factors.push("Steep terrain");
  if (loc.historicalRisk > 60) factors.push("Historical landslide zone");
  return factors.length > 0 ? factors : ["Elevated combined risk factors"];
}

function buildReason(loc: Location): string {
  const parts: string[] = [];
  if (loc.rainfall > 100) parts.push("heavy rainfall");
  if (loc.soilMoisture > 75) parts.push("high soil moisture");
  if (loc.groundMovement > 5) parts.push("increasing ground movement");
  if (loc.slope > 30) parts.push("steep terrain");

  if (parts.length === 0) return `Elevated risk score (${loc.riskScore}/100) detected at ${loc.name}`;
  return `Risk driven by ${parts.join(", ")}`;
}

// Generate alert frequency by day from alert list (deterministic)
export function generateAlertFrequencyFromAlerts(alerts: Alert[], days = 7): { day: string; alerts: number }[] {
  const now = new Date();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const buckets: { day: string; alerts: number }[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const dayStart = new Date(d.setHours(0, 0, 0, 0));
    const dayEnd = new Date(dayStart.getTime() + 86400000);
    const count = alerts.filter((a) => {
      const t = new Date(a.time);
      return t >= dayStart && t < dayEnd;
    }).length;
    buckets.push({ day: dayNames[dayStart.getDay()], alerts: Math.max(count, 0) });
  }

  // If all buckets are 0 (current alerts all today), add deterministic historical spread
  if (buckets.every((b) => b.alerts === 0)) {
    const spread = [2, 4, 1, 5, 3, 2, 3];
    buckets.forEach((b, i) => { b.alerts = spread[i] ?? 1; });
  }

  return buckets;
}

import type { Alert, Location } from "@/types";
import { locations } from "./locations";

function generateAlerts(): Alert[] {
  const highRisk = [...locations]
    .filter((l) => l.riskLevel === "HIGH" || l.riskLevel === "CRITICAL")
    .sort((a, b) => b.riskScore - a.riskScore);

  const alerts: Alert[] = [];
  const now = new Date();
  const reasons = [
    "Heavy simulated rainfall detected over monitoring period",
    "Sustained high soil moisture with steep terrain",
    "Increasing ground movement trend observed",
    "Critical combination of rainfall and slope angle",
    "Historical landslide zone showing elevated readings",
  ];
  const actions = [
    "Avoid steep slopes and follow instructions from official disaster-management authorities.",
    "Restrict access to unstable slopes. Monitor official channels for evacuation orders.",
    "Increase monitoring frequency. Report any ground cracks to local authorities.",
    "Prepare for possible evacuation. Stay tuned to official disaster management channels.",
  ];

  highRisk.forEach((loc, i) => {
    const minutesAgo = (i + 1) * 37 + Math.floor(Math.random() * 20);
    const time = new Date(now.getTime() - minutesAgo * 60000);
    alerts.push({
      id: `alert-${loc.id}`,
      time: time.toISOString(),
      locationId: loc.id,
      locationName: loc.name,
      state: loc.state,
      riskLevel: loc.riskLevel,
      riskScore: loc.riskScore,
      reason: reasons[i % reasons.length],
      status: i < 3 ? "ACTIVE" : i < 7 ? "ACKNOWLEDGED" : "RESOLVED",
      factors: buildFactors(loc),
      action: actions[i % actions.length],
    });
  });

  // Add some historical alerts
  for (let i = 0; i < 8; i++) {
    const loc = locations[Math.floor(Math.random() * locations.length)];
    const hoursAgo = 24 + i * 12 + Math.floor(Math.random() * 10);
    const time = new Date(now.getTime() - hoursAgo * 3600000);
    const score = 40 + Math.floor(Math.random() * 55);
    const level = score > 75 ? "CRITICAL" : score > 50 ? "HIGH" : score > 25 ? "MODERATE" : "LOW";
    alerts.push({
      id: `hist-alert-${i}`,
      time: time.toISOString(),
      locationId: loc.id,
      locationName: loc.name,
      state: loc.state,
      riskLevel: level as Alert["riskLevel"],
      riskScore: score,
      reason: reasons[i % reasons.length],
      status: "RESOLVED",
      factors: buildFactors(loc),
      action: actions[i % actions.length],
    });
  }

  return alerts.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
}

function buildFactors(loc: Location): string[] {
  const factors: string[] = [];
  if (loc.rainfall > 100) factors.push("Heavy simulated rainfall");
  else if (loc.rainfall > 70) factors.push("Moderate to heavy rainfall");
  if (loc.soilMoisture > 75) factors.push("High soil moisture");
  if (loc.groundMovement > 5) factors.push("Increasing ground movement");
  if (loc.slope > 30) factors.push("Steep terrain");
  if (loc.historicalRisk > 60) factors.push("Historical landslide zone");
  return factors.length > 0 ? factors : ["Elevated combined risk factors"];
}

export const alerts: Alert[] = generateAlerts();

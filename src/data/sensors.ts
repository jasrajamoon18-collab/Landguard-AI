export interface SensorHistoryPoint {
  time: string;
  rainfall: number;
  soilMoisture: number;
  groundMovement: number;
  riskScore: number;
}

export function generateSensorHistory(hours = 24): SensorHistoryPoint[] {
  const points: SensorHistoryPoint[] = [];
  const now = new Date();
  for (let i = hours - 1; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 60 * 60 * 1000);
    const baseRain = 40 + Math.sin((i / hours) * Math.PI * 2) * 30 + Math.random() * 20;
    const baseSoil = 55 + Math.sin((i / hours) * Math.PI * 2 + 1) * 15 + Math.random() * 10;
    const baseMove = 2 + Math.sin((i / hours) * Math.PI) * 3 + Math.random() * 2;
    const risk = Math.round(
      Math.min(100, baseRain * 0.3 + baseSoil * 0.25 + 30 * 1.1 + baseMove * 4 + 50 * 0.1),
    );
    points.push({
      time: t.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      rainfall: Math.round(Math.max(0, baseRain)),
      soilMoisture: Math.round(Math.max(0, Math.min(100, baseSoil))),
      groundMovement: +Math.max(0, baseMove).toFixed(1),
      riskScore: risk,
    });
  }
  return points;
}

export function generateRiskTrend(days = 7): { day: string; risk: number }[] {
  const points: { day: string; risk: number }[] = [];
  const now = new Date();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    points.push({
      day: dayNames[d.getDay()],
      risk: Math.round(45 + Math.random() * 30),
    });
  }
  return points;
}

export function generateAlertFrequency(days = 7): { day: string; alerts: number }[] {
  const points: { day: string; alerts: number }[] = [];
  const now = new Date();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    points.push({
      day: dayNames[d.getDay()],
      alerts: Math.floor(Math.random() * 8) + 1,
    });
  }
  return points;
}

import { BarChart3 } from "lucide-react";
import { SimpleBarChart, RiskPieChart, MultiLineChart } from "@/components/RiskChart";
import { NER_STATES } from "@/types/location";
import { riskColor } from "@/utils/risk";
import { generateFallbackSensorHistory } from "@/data/fallbackData";
import { generateAlertFrequencyFromAlerts } from "@/services/alertService";
import { getHistoricalRiskByState } from "@/services/historicalRiskService";
import type { Location, Alert } from "@/types";

interface AnalyticsPageProps {
  locations: Location[];
  alerts: Alert[];
}

export function AnalyticsPage({ locations, alerts }: AnalyticsPageProps) {
  const distribution = [
    { name: "Low", value: locations.filter((l) => l.riskLevel === "LOW").length, color: riskColor("LOW") },
    { name: "Moderate", value: locations.filter((l) => l.riskLevel === "MODERATE").length, color: riskColor("MODERATE") },
    { name: "High", value: locations.filter((l) => l.riskLevel === "HIGH").length, color: riskColor("HIGH") },
    { name: "Critical", value: locations.filter((l) => l.riskLevel === "CRITICAL").length, color: riskColor("CRITICAL") },
  ];

  const stateRisk = NER_STATES.map((state) => {
    const stateLocs = locations.filter((l) => l.state === state);
    const avg = stateLocs.length > 0
      ? Math.round(stateLocs.reduce((s, l) => s + l.riskScore, 0) / stateLocs.length)
      : 0;
    return { state: state.replace(" Pradesh", ""), risk: avg };
  });

  const rainfallVsRisk = locations.map((l) => ({
    name: l.name.split(" ")[0],
    rainfall: l.rainfall,
    risk: l.riskScore,
  }));

  // Risk trend from deterministic fallback history of highest-risk location
  const topLoc = [...locations].sort((a, b) => b.riskScore - a.riskScore)[0];
  const riskTrend = topLoc
    ? generateFallbackSensorHistory(topLoc.id, 7).map((p) => ({ day: p.time, risk: p.riskScore }))
    : [];

  // Alert frequency calculated from actual alert list
  const alertFreq = generateAlertFrequencyFromAlerts(alerts, 7);

  // Historical risk by state (separate from live data)
  const histByState = getHistoricalRiskByState();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <BarChart3 className="text-cyan-400" /> Analytics
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Risk analytics calculated from application data · {locations.length} locations, {alerts.length} alerts
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Risk Distribution */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="text-sm font-semibold text-slate-400 mb-3">Risk Distribution</h2>
          <RiskPieChart data={distribution} height={260} />
        </div>

        {/* State-wise Risk */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="text-sm font-semibold text-slate-400 mb-3">State-wise Average Risk (Current)</h2>
          <SimpleBarChart data={stateRisk} xKey="state" yKey="risk" color="#06b6d4" height={260} />
        </div>

        {/* Rainfall vs Risk */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="text-sm font-semibold text-slate-400 mb-3">Rainfall vs Risk Score</h2>
          <MultiLineChart
            data={rainfallVsRisk}
            xKey="name"
            lines={[
              { key: "rainfall", color: "#3b82f6", label: "Rainfall (mm)" },
              { key: "risk", color: "#ef4444", label: "Risk Score" },
            ]}
            height={260}
          />
        </div>

        {/* Risk Trend */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="text-sm font-semibold text-slate-400 mb-3">Regional Risk Trend (7 days)</h2>
          <SimpleBarChart data={riskTrend} xKey="day" yKey="risk" color="#f97316" height={260} />
        </div>

        {/* Alert Frequency */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="text-sm font-semibold text-slate-400 mb-3">Alert Frequency by Day</h2>
          <SimpleBarChart data={alertFreq} xKey="day" yKey="alerts" color="#ef4444" height={240} />
        </div>

        {/* Historical Risk by State */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="text-sm font-semibold text-slate-400 mb-3">Historical Landslide Risk by State</h2>
          <SimpleBarChart
            data={histByState.map((s) => ({ state: s.state.replace(" Pradesh", "").slice(0, 8), risk: s.avgRisk }))}
            xKey="state"
            yKey="risk"
            color="#a855f7"
            height={240}
          />
        </div>
      </div>

      <p className="text-center text-xs text-slate-600">
        Analytics calculated from current application data. Historical risk uses sample data.
      </p>
    </div>
  );
}

import { BarChart3 } from "lucide-react";
import { SimpleBarChart, RiskPieChart, MultiLineChart } from "@/components/RiskChart";
import { locations, NER_STATES } from "@/data/locations";
import { generateRiskTrend, generateAlertFrequency } from "@/data/sensors";
import { riskColor } from "@/utils/risk";

export function AnalyticsPage() {
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

  const riskTrend = generateRiskTrend(7).map((d) => ({ ...d, day: d.day }));
  const alertFreq = generateAlertFrequency(7);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <BarChart3 className="text-cyan-400" /> Analytics
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Risk analytics and trends · All charts use DEMO DATA
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
          <h2 className="text-sm font-semibold text-slate-400 mb-3">State-wise Average Risk</h2>
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
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-400 mb-3">Alert Frequency by Day</h2>
          <SimpleBarChart data={alertFreq} xKey="day" yKey="alerts" color="#ef4444" height={240} />
        </div>
      </div>

      <p className="text-center text-xs text-slate-600">
        All data shown is simulated for demonstration purposes.
      </p>
    </div>
  );
}

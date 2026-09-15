import { ShieldCheck, AlertTriangle, AlertOctagon, ShieldAlert } from "lucide-react";
import { RiskCard } from "@/components/RiskCard";
import { RiskGauge } from "@/components/RiskGauge";
import { RiskMap } from "@/components/RiskMap";
import { TrendChart, SimpleBarChart } from "@/components/RiskChart";
import { DataStatusBadge } from "@/components/DataStatusBadge";
import { ImergRainfallPanel } from "@/components/ImergRainfallPanel";
import { NER_STATES } from "@/types/location";
import { getHistoricalRiskByState } from "@/services/historicalRiskService";
import { generateFallbackSensorHistory } from "@/data/fallbackData";
import type { PageId, Language, Location, DataStatus } from "@/types";

interface DashboardProps {
  onNavigate: (page: PageId) => void;
  onSelectLocation: (id: string) => void;
  language: Language;
  regionScore: number;
  locations: Location[];
  dataStatus: DataStatus;
  onRefresh?: () => void;
  loading?: boolean;
}

export function Dashboard({ onNavigate, onSelectLocation, language, regionScore, locations, dataStatus, onRefresh, loading }: DashboardProps) {
  const low = locations.filter((l) => l.riskLevel === "LOW").length;
  const moderate = locations.filter((l) => l.riskLevel === "MODERATE").length;
  const high = locations.filter((l) => l.riskLevel === "HIGH").length;
  const critical = locations.filter((l) => l.riskLevel === "CRITICAL").length;

  const topLocations = [...locations].sort((a, b) => b.riskScore - a.riskScore).slice(0, 5);

  const trendLoc = topLocations[0] ?? locations[0];
  const trendData = trendLoc
    ? generateFallbackSensorHistory(trendLoc.id, 7).map((p) => ({ day: p.time, risk: p.riskScore }))
    : [];

  const stateRiskData = NER_STATES.map((state) => {
    const stateLocs = locations.filter((l) => l.state === state);
    const avg = stateLocs.length > 0
      ? Math.round(stateLocs.reduce((s, l) => s + l.riskScore, 0) / stateLocs.length)
      : 0;
    return { state: state.replace(" Pradesh", "").slice(0, 8), risk: avg };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">North Eastern Region — Landslide Risk Monitoring</h1>
          <p className="text-sm text-slate-500 mt-1">
            Overview of landslide risk across {NER_STATES.length} NER states · {locations.length} monitored locations
          </p>
        </div>
        <DataStatusBadge status={dataStatus} language={language} size="md" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <RiskCard level="LOW" count={low} icon={ShieldCheck} />
        <RiskCard level="MODERATE" count={moderate} icon={ShieldAlert} />
        <RiskCard level="HIGH" count={high} icon={AlertTriangle} />
        <RiskCard level="CRITICAL" count={critical} icon={AlertOctagon} />
      </div>

      {/* NASA IMERG Rainfall Panel */}
      <ImergRainfallPanel locations={locations} dataStatus={dataStatus} onRefresh={onRefresh} loading={loading} />

      {/* Gauge + Map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col items-center justify-center">
          <h2 className="text-sm font-semibold text-slate-400 mb-4">Overall Regional Risk</h2>
          <RiskGauge score={regionScore} size={220} label="Regional Average" />
          <div className="mt-4 text-center">
            <p className="text-xs text-slate-500">Aggregated from {locations.length} monitored locations</p>
            <button
              onClick={() => onNavigate("map")}
              className="mt-3 px-4 py-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-sm font-medium transition-colors"
            >
              View Full Risk Map
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="text-sm font-semibold text-slate-400 mb-3">Risk Map Overview</h2>
          <RiskMap locations={locations} onSelectLocation={onSelectLocation} height="340px" />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="text-sm font-semibold text-slate-400 mb-3">Regional Risk Trend (7 days)</h2>
          <TrendChart data={trendData} xKey="day" yKey="risk" color="#f97316" height={220} />
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="text-sm font-semibold text-slate-400 mb-3">State-wise Average Risk</h2>
          <SimpleBarChart data={stateRiskData} xKey="state" yKey="risk" color="#06b6d4" height={220} />
        </div>
      </div>

      {/* Top risk locations */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-400">Highest Risk Locations</h2>
          <button
            onClick={() => onNavigate("locations")}
            className="text-xs text-cyan-400 hover:text-cyan-300"
          >
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500 border-b border-slate-800">
                <th className="py-2 pr-4">Location</th>
                <th className="py-2 pr-4">State</th>
                <th className="py-2 pr-4">Risk Score</th>
                <th className="py-2 pr-4">Level</th>
                <th className="py-2 pr-4">Rainfall (24h)</th>
              </tr>
            </thead>
            <tbody>
              {topLocations.map((loc) => {
                const color = loc.riskLevel === "CRITICAL" ? "#ef4444" : loc.riskLevel === "HIGH" ? "#f97316" : loc.riskLevel === "MODERATE" ? "#eab308" : "#22c55e";
                return (
                  <tr
                    key={loc.id}
                    className="border-b border-slate-800/50 hover:bg-slate-800/30 cursor-pointer"
                    onClick={() => onSelectLocation(loc.id)}
                  >
                    <td className="py-2.5 pr-4 text-slate-200 font-medium">{loc.name}</td>
                    <td className="py-2.5 pr-4 text-slate-400">{loc.state}</td>
                    <td className="py-2.5 pr-4 font-bold" style={{ color }}>{loc.riskScore}</td>
                    <td className="py-2.5 pr-4">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color, backgroundColor: color + "20" }}>
                        {loc.riskLevel}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 text-slate-400">{loc.rainfall} mm</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

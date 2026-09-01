import { CloudRain, Droplets, Mountain, Move3D, History, TrendingUp } from "lucide-react";
import type { PredictionResult } from "@/types";

interface ExplainableRiskProps {
  result: PredictionResult;
}

export function ExplainableRisk({ result }: ExplainableRiskProps) {
  const bars = [
    { label: "Rainfall", value: result.contributions.rainfall, icon: CloudRain, color: "#3b82f6" },
    { label: "Soil Moisture", value: result.contributions.soilMoisture, icon: Droplets, color: "#06b6d4" },
    { label: "Slope", value: result.contributions.slope, icon: Mountain, color: "#f97316" },
    { label: "Ground Movement", value: result.contributions.groundMovement, icon: Move3D, color: "#ec4899" },
    { label: "Historical Risk", value: result.contributions.historicalRisk, icon: History, color: "#a855f7" },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-slate-300 mb-3">Factor Contributions</h4>
        <div className="space-y-3">
          {bars.map((bar) => {
            const Icon = bar.icon;
            return (
              <div key={bar.label}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Icon size={14} style={{ color: bar.color }} />
                    {bar.label}
                  </div>
                  <span className="text-xs font-mono font-semibold text-slate-400">
                    {bar.value}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${bar.value}%`, backgroundColor: bar.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex items-start gap-2">
          <TrendingUp size={16} className="text-cyan-400 mt-0.5 shrink-0" />
          <p className="text-sm text-slate-300 leading-relaxed">{result.explanation}</p>
        </div>
      </div>
    </div>
  );
}

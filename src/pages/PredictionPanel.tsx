import { useState, useEffect } from "react";
import { CloudRain, Droplets, Mountain, Move3D, History, Milestone, Brain, Cpu, Database } from "lucide-react";
import { RiskGauge } from "@/components/RiskGauge";
import { ExplainableRisk } from "@/components/ExplainableRisk";
import { predictRiskService } from "@/services/api";
import { getLocationById } from "@/services/api";
import { t } from "@/data/translations";
import type { PredictionResult, Language } from "@/types";

interface PredictionPanelProps {
  preselectedLocationId?: string | null;
  language: Language;
}

interface InputConfig {
  key: string;
  label: string;
  icon: React.ElementType;
  min: number;
  max: number;
  step: number;
  unit: string;
}

const INPUTS: InputConfig[] = [
  { key: "rainfall", label: "Rainfall", icon: CloudRain, min: 0, max: 200, step: 1, unit: "mm" },
  { key: "soilMoisture", label: "Soil Moisture", icon: Droplets, min: 0, max: 100, step: 1, unit: "%" },
  { key: "slope", label: "Slope", icon: Mountain, min: 0, max: 60, step: 1, unit: "°" },
  { key: "elevation", label: "Elevation", icon: Milestone, min: 0, max: 5000, step: 50, unit: "m" },
  { key: "groundMovement", label: "Ground Movement", icon: Move3D, min: 0, max: 15, step: 0.1, unit: "mm" },
  { key: "historicalRisk", label: "Historical Landslide Risk", icon: History, min: 0, max: 100, step: 1, unit: "%" },
];

const DEFAULT_INPUTS = {
  rainfall: 80,
  soilMoisture: 65,
  slope: 25,
  elevation: 1200,
  groundMovement: 3,
  historicalRisk: 50,
};

export function PredictionPanel({ preselectedLocationId, language }: PredictionPanelProps) {
  const [inputs, setInputs] = useState(DEFAULT_INPUTS);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);

  useEffect(() => {
    if (preselectedLocationId) {
      const loc = getLocationById(preselectedLocationId);
      if (loc) {
        setInputs({
          rainfall: loc.rainfall,
          soilMoisture: loc.soilMoisture,
          slope: loc.slope,
          elevation: loc.elevation,
          groundMovement: loc.groundMovement,
          historicalRisk: loc.historicalRisk,
        });
        setSelectedName(loc.name);
        const res = predictRiskService({
          rainfall: loc.rainfall,
          soilMoisture: loc.soilMoisture,
          slope: loc.slope,
          elevation: loc.elevation,
          groundMovement: loc.groundMovement,
          historicalRisk: loc.historicalRisk,
        });
        setResult(res);
      }
    }
  }, [preselectedLocationId]);

  const handleAnalyze = () => {
    const res = predictRiskService(inputs);
    setResult(res);
  };

  const updateInput = (key: string, value: number) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Brain className="text-cyan-400" /> AI Landslide Risk Prediction
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Prototype AI Risk Engine — transparent weighted scoring model · DEMO DATA
        </p>
      </div>

      {selectedName && (
        <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-3 text-sm text-cyan-300">
          Loaded data from: <span className="font-semibold">{selectedName}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Input controls */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <h2 className="text-sm font-semibold text-slate-300 mb-4">Environmental Inputs</h2>
          <div className="space-y-5">
            {INPUTS.map((cfg) => {
              const Icon = cfg.icon;
              const val = inputs[cfg.key as keyof typeof inputs];
              return (
                <div key={cfg.key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <Icon size={16} className="text-slate-400" />
                      {cfg.label}
                    </div>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={val}
                        min={cfg.min}
                        max={cfg.max}
                        step={cfg.step}
                        onChange={(e) => updateInput(cfg.key, parseFloat(e.target.value) || 0)}
                        className="w-16 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-sm text-slate-200 text-right outline-none focus:border-cyan-500"
                      />
                      <span className="text-xs text-slate-500 w-6">{cfg.unit}</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    value={val}
                    min={cfg.min}
                    max={cfg.max}
                    step={cfg.step}
                    onChange={(e) => updateInput(cfg.key, parseFloat(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-700 accent-cyan-500"
                  />
                </div>
              );
            })}
          </div>

          <button
            onClick={handleAnalyze}
            className="mt-6 w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold transition-all shadow-lg shadow-cyan-500/20"
          >
            {t(language, "analyzeRisk")}
          </button>

          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-slate-800/50 p-2">
              <div className="text-slate-500">Rainfall weight</div>
              <div className="text-slate-300 font-mono">30%</div>
            </div>
            <div className="rounded-lg bg-slate-800/50 p-2">
              <div className="text-slate-500">Soil moisture</div>
              <div className="text-slate-300 font-mono">25%</div>
            </div>
            <div className="rounded-lg bg-slate-800/50 p-2">
              <div className="text-slate-500">Slope</div>
              <div className="text-slate-300 font-mono">20%</div>
            </div>
            <div className="rounded-lg bg-slate-800/50 p-2">
              <div className="text-slate-500">Ground movement</div>
              <div className="text-slate-300 font-mono">15%</div>
            </div>
            <div className="rounded-lg bg-slate-800/50 p-2 col-span-2">
              <div className="text-slate-500">Historical risk</div>
              <div className="text-slate-300 font-mono">10% · Elevation: contextual only</div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {result ? (
            <>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                <h2 className="text-sm font-semibold text-slate-300 mb-4">Landslide Risk Score</h2>
                <div className="flex flex-col items-center">
                  <RiskGauge score={result.score} size={200} />
                  <div className="mt-4 text-center">
                    <p className="text-sm text-slate-400 max-w-xs">
                      {result.level === "CRITICAL"
                        ? "Current simulated environmental conditions indicate critical landslide risk."
                        : result.level === "HIGH"
                        ? "Current simulated environmental conditions indicate elevated landslide risk."
                        : result.level === "MODERATE"
                        ? "Current simulated environmental conditions indicate moderate landslide risk."
                        : "Current simulated environmental conditions indicate low landslide risk."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                <h2 className="text-sm font-semibold text-slate-300 mb-4">Why Is This Location At Risk?</h2>
                <ExplainableRisk result={result} />
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Cpu size={14} className="text-slate-500" />
                    <div>
                      <div className="text-slate-500">Model</div>
                      <div className="text-slate-300 font-medium">Prototype Risk Engine</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Database size={14} className="text-slate-500" />
                    <div>
                      <div className="text-slate-500">Data</div>
                      <div className="text-slate-300 font-medium">Simulated Demo Data</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-12 flex flex-col items-center justify-center text-center min-h-[300px]">
              <Brain size={48} className="text-slate-700 mb-4" />
              <p className="text-slate-500 text-sm">
                Adjust the input sliders and click "Analyze Risk" to generate a landslide risk prediction.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

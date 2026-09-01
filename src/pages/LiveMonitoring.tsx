import { CloudRain, Droplets, Move3D, Thermometer, Cloud, Activity } from "lucide-react";
import { SensorCard } from "@/components/SensorCard";
import { SimulationController } from "@/components/SimulationController";
import { TrendChart, MultiLineChart } from "@/components/RiskChart";
import { useSimulation } from "@/hooks/useSimulation";
import { riskColor } from "@/utils/risk";
import { t } from "@/data/translations";
import type { Language } from "@/types";

interface LiveMonitoringProps {
  language: Language;
}

export function LiveMonitoring({ language }: LiveMonitoringProps) {
  const sim = useSimulation();
  const { liveData, history } = sim;

  const chartData = history.length > 0
    ? history
    : [{ time: "00:00", rainfall: liveData.rainfall, soilMoisture: liveData.soilMoisture, groundMovement: liveData.groundMovement, riskScore: liveData.riskScore }];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Activity className="text-cyan-400" /> Live Environmental Monitoring
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Simulated sensor data — not live sensor data · DEMO MODE
        </p>
      </div>

      {/* Simulation controller */}
      <SimulationController
        isRunning={sim.isRunning}
        stageName={sim.stageName}
        stageIndex={sim.stageIndex}
        stageCount={sim.stageCount}
        progress={sim.progress}
        isComplete={sim.isComplete}
        onStart={sim.start}
        onPause={sim.pause}
        onReset={sim.reset}
        language={language}
      />

      {/* Sensor cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <SensorCard
          label="Rainfall"
          value={liveData.rainfall}
          unit="mm"
          icon={CloudRain}
          color="#3b82f6"
          trend={sim.isRunning ? "up" : "stable"}
          trendLabel={sim.isRunning ? "Increasing" : "Stable"}
        />
        <SensorCard
          label="Soil Moisture"
          value={liveData.soilMoisture}
          unit="%"
          icon={Droplets}
          color="#06b6d4"
          trend={liveData.soilMoisture > 75 ? "up" : "stable"}
          trendLabel={liveData.soilMoisture > 75 ? "High" : "Normal"}
        />
        <SensorCard
          label="Ground Movement"
          value={`+${liveData.groundMovement}`}
          unit="mm"
          icon={Move3D}
          color="#ec4899"
          trend={sim.isRunning ? "up" : "stable"}
          trendLabel={sim.isRunning ? "Increasing" : "Stable"}
        />
        <SensorCard
          label="Temperature"
          value={liveData.temperature}
          unit="°C"
          icon={Thermometer}
          color="#f97316"
        />
      </div>

      {/* Weather + Risk status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex items-center gap-3">
          <Cloud size={28} className="text-blue-400" />
          <div>
            <div className="text-xs text-slate-500">Weather</div>
            <div className="text-lg font-semibold text-slate-200">{liveData.weather}</div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex items-center gap-3">
          <Activity size={28} style={{ color: riskColor(liveData.riskLevel) }} />
          <div>
            <div className="text-xs text-slate-500">Current Risk</div>
            <div className="text-lg font-semibold" style={{ color: riskColor(liveData.riskLevel) }}>
              {liveData.riskScore}/100 · {liveData.riskLevel}
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <div className="text-xs text-slate-500">Sensor Status</div>
            <div className="text-lg font-semibold text-emerald-400">Active (Simulated)</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="text-sm font-semibold text-slate-400 mb-3">Rainfall & Soil Moisture Trend</h2>
          <MultiLineChart
            data={chartData}
            xKey="time"
            lines={[
              { key: "rainfall", color: "#3b82f6", label: "Rainfall (mm)" },
              { key: "soilMoisture", color: "#06b6d4", label: "Soil Moisture (%)" },
            ]}
            height={220}
          />
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="text-sm font-semibold text-slate-400 mb-3">Ground Movement Trend</h2>
          <TrendChart data={chartData} xKey="time" yKey="groundMovement" color="#ec4899" unit=" mm" height={220} />
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-400 mb-3">Risk Score Trend (Live)</h2>
          <TrendChart data={chartData} xKey="time" yKey="riskScore" color="#f97316" height={220} />
        </div>
      </div>

      <p className="text-center text-xs text-slate-600">
        Simulation data — not live sensor data. {t(language, "demoDisclaimer")}
      </p>
    </div>
  );
}

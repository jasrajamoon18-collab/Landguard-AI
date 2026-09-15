import { useState, useEffect, useRef, useCallback } from "react";
import { CloudRain, Droplets, Move3D, Thermometer, Cloud, Activity, RefreshCw, Play, Pause, RotateCcw, Satellite } from "lucide-react";
import { SensorCard } from "@/components/SensorCard";
import { DataStatusBadge } from "@/components/DataStatusBadge";
import { TrendChart, MultiLineChart } from "@/components/RiskChart";
import { riskColor, classifyRisk } from "@/utils/risk";
import { generateFallbackSensorHistory } from "@/data/fallbackData";
import { getGroundMovement } from "@/services/groundMovementService";
import { isWeatherApiConfigured } from "@/services/weatherService";
import { t } from "@/data/translations";
import type { Language, Location, DataStatus, RiskLevel } from "@/types";

interface LiveMonitoringProps {
  language: Language;
  locations: Location[];
  dataStatus: DataStatus;
  onRefresh: () => void;
  loading: boolean;
  onUpdateLocations: (locs: Location[]) => void;
  onSetSimulationMode: (active: boolean) => void;
}

interface SimStage {
  name: string;
  rainfall: number;
  soilMoisture: number;
  groundMovement: number;
  weather: string;
  temperature: number;
}

const SIM_STAGES: SimStage[] = [
  { name: "NORMAL CONDITIONS", rainfall: 35, soilMoisture: 42, groundMovement: 1, weather: "Light Rain", temperature: 26 },
  { name: "RISK INCREASING", rainfall: 90, soilMoisture: 67, groundMovement: 4, weather: "Moderate Rain", temperature: 23 },
  { name: "CRITICAL CONDITIONS", rainfall: 150, soilMoisture: 88, groundMovement: 9, weather: "Heavy Rain", temperature: 21 },
];

export function LiveMonitoring({
  language, locations, dataStatus, onRefresh, loading, onUpdateLocations, onSetSimulationMode,
}: LiveMonitoringProps) {
  const [selectedLocationId, setSelectedLocationId] = useState<string>(
    locations[0]?.id ?? ""
  );

  const [isRunning, setIsRunning] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const simHistoryRef = useRef<{ time: string; rainfall: number; soilMoisture: number; groundMovement: number; riskScore: number }[]>([]);

  useEffect(() => {
    if (!locations.find((l) => l.id === selectedLocationId) && locations.length > 0) {
      setSelectedLocationId(locations[0].id);
    }
  }, [locations, selectedLocationId]);

  const selectedLoc = locations.find((l) => l.id === selectedLocationId) ?? locations[0];

  const weatherLive = isWeatherApiConfigured();
  const gmConfigured = getGroundMovement(selectedLocationId ?? "loc-001").dataSource === ("LIVE" as DataStatus);

  // Determine IMERG data source status for rainfall label
  const imerg = selectedLoc?.imerg;
  const rainfallSourceLabel = isRunning
    ? "Increasing"
    : imerg
      ? imerg.dataStatus === "LIVE"
        ? "NASA IMERG"
        : "FALLBACK"
      : weatherLive
        ? "LIVE"
        : "FALLBACK";
  const rainfallIsLive = imerg?.dataStatus === "LIVE";

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    onSetSimulationMode(false);
  }, [onSetSimulationMode]);

  const tick = useCallback(() => {
    setProgress((p) => {
      const np = p + 0.02;
      if (np >= 1) {
        setStageIndex((si) => {
          if (si >= SIM_STAGES.length - 1) {
            stop();
            return si;
          }
          return si + 1;
        });
        return 0;
      }
      return np;
    });
  }, [stop]);

  const startSim = useCallback(() => {
    if (stageIndex >= SIM_STAGES.length - 1 && progress >= 1) {
      setStageIndex(0);
      setProgress(0);
    }
    setIsRunning(true);
    onSetSimulationMode(true);
  }, [stageIndex, progress, onSetSimulationMode]);

  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(tick, 100);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, tick]);

  const pauseSim = useCallback(() => {
    setIsRunning(false);
    onSetSimulationMode(false);
  }, [onSetSimulationMode]);

  const resetSim = useCallback(() => {
    stop();
    setStageIndex(0);
    setProgress(0);
    simHistoryRef.current = [];
    onUpdateLocations(locations);
  }, [stop, onUpdateLocations, locations]);

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const currentStage = SIM_STAGES[stageIndex];
  const nextStage = SIM_STAGES[Math.min(stageIndex + 1, SIM_STAGES.length - 1)];

  const displayRainfall = isRunning || stageIndex > 0 || progress > 0
    ? Math.round(lerp(currentStage.rainfall, nextStage.rainfall, progress))
    : selectedLoc?.rainfall ?? 80;
  const displaySoil = isRunning || stageIndex > 0 || progress > 0
    ? Math.round(lerp(currentStage.soilMoisture, nextStage.soilMoisture, progress))
    : selectedLoc?.soilMoisture ?? 65;
  const displayMove = isRunning || stageIndex > 0 || progress > 0
    ? +lerp(currentStage.groundMovement, nextStage.groundMovement, progress).toFixed(1)
    : selectedLoc?.groundMovement ?? 4;
  const displayTemp = isRunning || stageIndex > 0 || progress > 0
    ? Math.round(lerp(currentStage.temperature, nextStage.temperature, progress))
    : 22;
  const displayWeather = isRunning || stageIndex > 0 || progress > 0
    ? (progress > 0.5 && stageIndex < SIM_STAGES.length - 1 ? nextStage.weather : currentStage.weather)
    : (selectedLoc?.rainfall ?? 0) > 100 ? "Heavy Rain" : "Rain";

  const displayRiskScore = Math.round(
    Math.min(100,
      Math.min(100, displayRainfall / 200 * 100) * 0.18 +
      Math.min(100, displayRainfall * 1.8 / 400 * 100) * 0.07 +
      Math.min(100, displayRainfall * 3.2 / 600 * 100) * 0.05 +
      Math.min(100, displaySoil) * 0.25 +
      Math.min(100, (selectedLoc?.slope ?? 25) / 60 * 100) * 0.2 +
      Math.min(100, displayMove / 15 * 100) * 0.15 +
      (selectedLoc?.historicalRisk ?? 50) * 0.1
    )
  );
  const displayRiskLevel: RiskLevel = classifyRisk(displayRiskScore);

  useEffect(() => {
    if (!isRunning && stageIndex === 0 && progress === 0) return;
    if (!locations.length) return;
    const updated = locations.map((loc) => {
      if (loc.id !== selectedLocationId) return loc;
      return {
        ...loc,
        rainfall: displayRainfall,
        soilMoisture: displaySoil,
        groundMovement: displayMove,
        riskScore: displayRiskScore,
        riskLevel: displayRiskLevel,
        status: displayRiskLevel === "CRITICAL" ? "CRITICAL" as const : displayRiskLevel === "HIGH" ? "ALERT" as const : "MONITORING" as const,
        dataStatus: "SIMULATION" as DataStatus,
      };
    });
    onUpdateLocations(updated);
  }, [displayRainfall, displaySoil, displayMove, displayRiskScore, displayRiskLevel, isRunning, stageIndex, progress]);

  useEffect(() => {
    if (!isRunning) return;
    const point = {
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      rainfall: displayRainfall,
      soilMoisture: displaySoil,
      groundMovement: displayMove,
      riskScore: displayRiskScore,
    };
    simHistoryRef.current = [...simHistoryRef.current.slice(-29), point];
  }, [displayRainfall, displaySoil, displayMove, displayRiskScore, isRunning]);

  const fallbackHistory = selectedLoc
    ? generateFallbackSensorHistory(selectedLoc.id, 24)
    : [];

  const chartData = isRunning || simHistoryRef.current.length > 0
    ? simHistoryRef.current
    : fallbackHistory;

  const overallProgress = ((stageIndex + progress) / SIM_STAGES.length) * 100;
  const isComplete = stageIndex >= SIM_STAGES.length - 1 && progress >= 0.98 && !isRunning;

  // IMERG observation time formatted
  const imergObsTime = imerg
    ? new Date(imerg.observationTime).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Activity className="text-cyan-400" /> {t(language, "monitoring")}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Environmental monitoring with data source indicators
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DataStatusBadge status={isRunning ? "SIMULATION" : dataStatus} language={language} size="md" />
          <button
            onClick={onRefresh}
            disabled={loading || isRunning}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700 hover:border-slate-600 text-sm text-slate-300 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">{t(language, "refreshData")}</span>
          </button>
        </div>
      </div>

      {/* Location selector */}
      <div className="flex items-center gap-2">
        <select
          value={selectedLocationId}
          onChange={(e) => setSelectedLocationId(e.target.value)}
          disabled={isRunning}
          className="px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-800 text-sm text-slate-200 outline-none cursor-pointer disabled:opacity-50"
        >
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id} className="bg-slate-800">
              {loc.name} — {loc.state}
            </option>
          ))}
        </select>
      </div>

      {/* Simulation banner */}
      {isRunning && (
        <div className="rounded-lg border border-orange-500/30 bg-orange-500/10 p-3 flex items-center gap-2 animate-pulse">
          <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
          <span className="text-sm font-semibold text-orange-400">
            SIMULATION MODE — Environmental conditions are being artificially modified for demonstration
          </span>
        </div>
      )}

      {/* Simulation controller */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-100">Landslide Simulation</h3>
            <p className="text-xs text-slate-500 mt-0.5">Watch risk escalate as environmental conditions worsen</p>
          </div>
          <div className="flex gap-2">
            {!isRunning ? (
              <button
                onClick={startSim}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-cyan-500/20"
              >
                <Play size={16} />
                {isComplete ? "Restart" : "Start Simulation"}
              </button>
            ) : (
              <button
                onClick={pauseSim}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold text-sm transition-colors"
              >
                <Pause size={16} /> Pause
              </button>
            )}
            <button
              onClick={resetSim}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-colors"
            >
              <RotateCcw size={16} /> Reset
            </button>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-cyan-400 tracking-wide">{currentStage.name}</span>
            <span className="text-slate-500">Stage {stageIndex + 1} / {SIM_STAGES.length}</span>
          </div>
          <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500 transition-all duration-200"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Sensor cards with per-variable data source */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <SensorCard
          label="Rainfall (24h)"
          value={displayRainfall}
          unit="mm"
          icon={CloudRain}
          color="#3b82f6"
          trend={isRunning ? "up" : "stable"}
          trendLabel={rainfallSourceLabel}
        />
        <SensorCard
          label="Soil Moisture"
          value={displaySoil}
          unit="%"
          icon={Droplets}
          color="#06b6d4"
          trend={displaySoil > 75 ? "up" : "stable"}
          trendLabel={isRunning ? "Increasing" : "FALLBACK"}
        />
        <SensorCard
          label="Ground Movement"
          value={`+${displayMove}`}
          unit="mm"
          icon={Move3D}
          color="#ec4899"
          trend={isRunning ? "up" : "stable"}
          trendLabel={isRunning ? "Increasing" : gmConfigured ? "LIVE" : "DEMO SENSOR"}
        />
        <SensorCard
          label="Temperature"
          value={displayTemp}
          unit="°C"
          icon={Thermometer}
          color="#f97316"
          trendLabel={weatherLive ? "LIVE" : "FALLBACK"}
        />
      </div>

      {/* NASA IMERG Rainfall Details */}
      {imerg && !isRunning && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Satellite size={18} className="text-cyan-400" />
            <h2 className="text-sm font-semibold text-slate-300">NASA IMERG Near-Real-Time Precipitation</h2>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ml-auto ${
                rainfallIsLive
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-yellow-500/10 text-yellow-400"
              }`}
            >
              {imerg.dataStatus}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <div className="rounded-lg p-2 bg-slate-800/40">
              <div className="text-xs text-slate-500">30 min</div>
              <div className="text-lg font-bold text-slate-200">{imerg.precipitation30min.toFixed(1)}<span className="text-xs font-normal text-slate-500 ml-0.5">mm</span></div>
            </div>
            <div className="rounded-lg p-2 bg-slate-800/40">
              <div className="text-xs text-slate-500">3 hour</div>
              <div className="text-lg font-bold text-slate-200">{imerg.precipitation3h.toFixed(1)}<span className="text-xs font-normal text-slate-500 ml-0.5">mm</span></div>
            </div>
            <div className="rounded-lg p-2 bg-blue-500/10 border border-blue-500/20">
              <div className="text-xs text-slate-500">24 hour</div>
              <div className="text-lg font-bold text-blue-400">{imerg.precipitation24h.toFixed(1)}<span className="text-xs font-normal text-slate-500 ml-0.5">mm</span></div>
            </div>
            <div className="rounded-lg p-2 bg-slate-800/40">
              <div className="text-xs text-slate-500">3 day</div>
              <div className="text-lg font-bold text-slate-200">{imerg.precipitation3d.toFixed(1)}<span className="text-xs font-normal text-slate-500 ml-0.5">mm</span></div>
            </div>
            <div className="rounded-lg p-2 bg-slate-800/40">
              <div className="text-xs text-slate-500">7 day</div>
              <div className="text-lg font-bold text-slate-200">{imerg.precipitation7d.toFixed(1)}<span className="text-xs font-normal text-slate-500 ml-0.5">mm</span></div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-500">
            <span>{imerg.product} · {imerg.run}</span>
            <span className="text-slate-600">·</span>
            <span>{imerg.spatialResolution}</span>
            {imergObsTime && (
              <>
                <span className="text-slate-600">·</span>
                <span>Observed: {imergObsTime}</span>
              </>
            )}
          </div>
          {!rainfallIsLive && (
            <p className="text-xs text-yellow-500/80 mt-2">
              NASA IMERG data temporarily unavailable. Showing fallback data — not from NASA.
            </p>
          )}
        </div>
      )}

      {/* Weather + Risk status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex items-center gap-3">
          <Cloud size={28} className="text-blue-400" />
          <div className="flex-1">
            <div className="text-xs text-slate-500">Weather</div>
            <div className="text-lg font-semibold text-slate-200">{displayWeather}</div>
          </div>
          <span className={`text-xs px-1.5 py-0.5 rounded ${
            weatherLive ? "bg-emerald-500/10 text-emerald-400" : "bg-yellow-500/10 text-yellow-400"
          }`}>
            {weatherLive ? "LIVE" : "FALLBACK"}
          </span>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex items-center gap-3">
          <Activity size={28} style={{ color: riskColor(displayRiskLevel) }} />
          <div>
            <div className="text-xs text-slate-500">Current Risk</div>
            <div className="text-lg font-semibold" style={{ color: riskColor(displayRiskLevel) }}>
              {displayRiskScore}/100 · {displayRiskLevel}
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isRunning ? "bg-orange-500 animate-pulse" : rainfallIsLive ? "bg-emerald-500 animate-pulse" : "bg-yellow-500 animate-pulse"}`} />
          <div>
            <div className="text-xs text-slate-500">Data Source</div>
            <div className={`text-lg font-semibold ${isRunning ? "text-orange-400" : rainfallIsLive ? "text-emerald-400" : "text-yellow-400"}`}>
              {isRunning ? "Simulation" : rainfallIsLive ? "NASA IMERG Live" : "Fallback Data"}
            </div>
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
          <h2 className="text-sm font-semibold text-slate-400 mb-3">Risk Score Trend</h2>
          <TrendChart data={chartData} xKey="time" yKey="riskScore" color="#f97316" height={220} />
        </div>
      </div>

      <p className="text-center text-xs text-slate-600">
        {isRunning
          ? "Simulation data — environmental conditions are artificially modified for demonstration."
          : rainfallIsLive
            ? "NASA IMERG near-real-time precipitation (~4 hour latency). " + t(language, "demoDisclaimer")
            : "Fallback data shown when NASA IMERG is unavailable. " + t(language, "demoDisclaimer")}
      </p>
    </div>
  );
}

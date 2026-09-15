import { CloudRain, Clock, Satellite, RefreshCw } from "lucide-react";
import type { Location, DataStatus } from "@/types";

interface ImergRainfallPanelProps {
  locations: Location[];
  dataStatus: DataStatus;
  onRefresh?: () => void;
  loading?: boolean;
}

export function ImergRainfallPanel({ locations, dataStatus, onRefresh, loading }: ImergRainfallPanelProps) {
  // Find the highest-risk location with IMERG data to feature
  const featured = [...locations]
    .filter((l) => l.imerg)
    .sort((a, b) => b.riskScore - a.riskScore)[0];

  if (!featured || !featured.imerg) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Satellite size={18} className="text-cyan-400" />
          <h2 className="text-sm font-semibold text-slate-400">NASA IMERG — Latest Available Rainfall</h2>
        </div>
        <p className="text-xs text-slate-500">NASA IMERG precipitation data not yet loaded.</p>
      </div>
    );
  }

  const imerg = featured.imerg;
  const isLive = imerg.dataStatus === "LIVE";
  const statusColor = isLive ? "#22c55e" : imerg.dataStatus === "ERROR" ? "#ef4444" : "#eab308";
  const statusLabel = isLive ? "LIVE" : imerg.dataStatus === "ERROR" ? "ERROR" : "FALLBACK";
  const obsTime = new Date(imerg.observationTime).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Satellite size={18} className="text-cyan-400" />
          <div>
            <h2 className="text-sm font-semibold text-slate-300">NASA IMERG — Latest Available Rainfall</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {imerg.product} · {imerg.run} · {imerg.spatialResolution}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800/60 border border-slate-700 hover:border-slate-600 text-xs text-slate-300 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
              Refresh NASA Data
            </button>
          )}
          <span
            className="text-xs font-bold px-2 py-1 rounded-full"
            style={{ color: statusColor, backgroundColor: statusColor + "20" }}
          >
            {statusLabel}
          </span>
        </div>
      </div>

      <div className="mb-3 flex items-center gap-2 text-xs text-slate-400">
        <CloudRain size={14} className="text-blue-400" />
        <span className="font-medium text-slate-300">{featured.name}</span>
        <span className="text-slate-600">·</span>
        <span>{featured.state}</span>
        <span className="text-slate-600">·</span>
        <Clock size={12} />
        <span>Updated: {obsTime}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        <RainfallCell label="30 min" value={imerg.precipitation30min} unit="mm" />
        <RainfallCell label="3 hour" value={imerg.precipitation3h} unit="mm" />
        <RainfallCell label="24 hour" value={imerg.precipitation24h} unit="mm" highlight />
        <RainfallCell label="3 day" value={imerg.precipitation3d} unit="mm" />
        <RainfallCell label="7 day" value={imerg.precipitation7d} unit="mm" />
      </div>

      {!isLive && (
        <p className="text-xs text-yellow-500/80 mt-3">
          {imerg.dataStatus === "FALLBACK"
            ? "NASA IMERG data temporarily unavailable. Showing fallback data — not from NASA."
            : "Error retrieving NASA IMERG data."}
        </p>
      )}
      <p className="text-xs text-slate-600 mt-2">
        NASA IMERG Near-Real-Time Precipitation · ~4 hour latency · Not for real-world emergency decisions.
      </p>
    </div>
  );
}

function RainfallCell({ label, value, unit, highlight }: { label: string; value: number; unit: string; highlight?: boolean }) {
  return (
    <div className={`rounded-lg p-2 ${highlight ? "bg-blue-500/10 border border-blue-500/20" : "bg-slate-800/40"}`}>
      <div className="text-xs text-slate-500">{label}</div>
      <div className={`text-lg font-bold ${highlight ? "text-blue-400" : "text-slate-200"}`}>
        {value.toFixed(1)}
        <span className="text-xs font-normal text-slate-500 ml-0.5">{unit}</span>
      </div>
    </div>
  );
}

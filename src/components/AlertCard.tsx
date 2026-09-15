import { MapPin, AlertTriangle, CheckCircle, Share2, Eye } from "lucide-react";
import type { Alert } from "@/types";
import { riskColor } from "@/utils/risk";
import { formatDateTime } from "@/utils/format";

interface AlertCardProps {
  alert: Alert;
  onView?: (alert: Alert) => void;
  onAcknowledge?: (alert: Alert) => void;
  onShare?: (alert: Alert) => void;
}

export function AlertCard({ alert, onView, onAcknowledge, onShare }: AlertCardProps) {
  const color = riskColor(alert.riskLevel);

  return (
    <div
      className="rounded-xl border bg-slate-900/60 p-4 sm:p-5 transition-all hover:bg-slate-900/90"
      style={{ borderColor: color + "30" }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0"
          style={{ backgroundColor: color + "15" }}
        >
          <AlertTriangle size={20} style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ color, backgroundColor: color + "20" }}
            >
              {alert.riskLevel} ALERT
            </span>
            <span className="text-xs text-slate-500">{formatDateTime(new Date(alert.time))}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded ${
              alert.dataSource === "LIVE" ? "bg-emerald-500/10 text-emerald-400" :
              alert.dataSource === "SIMULATION" ? "bg-orange-500/10 text-orange-400" :
              "bg-yellow-500/10 text-yellow-400"
            }`}>
              {alert.dataSource}
            </span>
          </div>
          <h3 className="mt-2 text-lg font-semibold text-slate-100">{alert.locationName}</h3>
          <div className="flex items-center gap-1 text-sm text-slate-400">
            <MapPin size={14} />
            {alert.state}
          </div>

          <div className="mt-3 flex items-center gap-3">
            <span className="text-sm text-slate-400">Risk Score:</span>
            <span className="text-xl font-bold" style={{ color }}>
              {alert.riskScore}/100
            </span>
          </div>

          <p className="mt-2 text-sm text-slate-400">{alert.reason}</p>

          {alert.factors.length > 0 && (
            <div className="mt-3">
              <div className="text-xs font-medium text-slate-500 mb-1.5">Contributing factors:</div>
              <div className="flex flex-wrap gap-1.5">
                {alert.factors.map((f, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-300"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-3 rounded-lg bg-slate-800/50 border border-slate-700/50 p-3">
            <div className="text-xs font-medium text-slate-500 mb-1">Recommended action:</div>
            <p className="text-sm text-slate-300">{alert.action}</p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {onView && (
              <button
                onClick={() => onView(alert)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm text-slate-300 transition-colors"
              >
                <Eye size={14} /> View Location
              </button>
            )}
            {onAcknowledge && (
              <button
                onClick={() => onAcknowledge(alert)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  alert.status !== "ACTIVE"
                    ? "bg-emerald-500/10 text-emerald-400 cursor-default"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                }`}
              >
                <CheckCircle size={14} /> Acknowledge
              </button>
            )}
            {onShare && (
              <button
                onClick={() => onShare(alert)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm text-slate-300 transition-colors"
              >
                <Share2 size={14} /> Share
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

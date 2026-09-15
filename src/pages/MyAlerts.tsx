import { useState, useEffect } from "react";
import { Shield, Bell, MapPin, Clock, Satellite, Radio, AlertTriangle } from "lucide-react";
import { getLocalRegistration } from "@/services/userPreferencesService";
import { checkNotificationPermission, requestNotificationPermission } from "@/services/notificationService";
import { getOfflineCache, formatOfflineTimestamp } from "@/services/offlineService";
import { isWithinRadius } from "@/utils/geo";
import { riskColor, riskTextClass } from "@/utils/risk";
import type { UserRegistration, NotificationPermission } from "@/types/user";
import type { Location, DataStatus } from "@/types";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

interface MyAlertsProps {
  locations: Location[];
  dataStatus: DataStatus;
  lastRefresh: Date;
  onNavigate: (page: string) => void;
}

export function MyAlerts({ locations, dataStatus, lastRefresh, onNavigate }: MyAlertsProps) {
  const [registration, setRegistration] = useState<UserRegistration | null>(getLocalRegistration());
  const [notifPerm, setNotifPerm] = useState<NotificationPermission>(checkNotificationPermission());
  const online = useOnlineStatus();
  const offlineCache = getOfflineCache();

  useEffect(() => {
    setRegistration(getLocalRegistration());
  }, []);

  if (!registration) {
    return (
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Shield className="text-cyan-400" /> My Alerts
          </h1>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-8 text-center">
          <Shield size={48} className="text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 mb-4">You are not registered for alerts yet.</p>
          <button
            onClick={() => onNavigate("register")}
            className="px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white text-sm font-bold transition-colors"
          >
            Get Protected — Register Now
          </button>
        </div>
      </div>
    );
  }

  // Find the nearest monitored location to the user
  const nearestLocation = [...locations]
    .map((loc) => ({
      loc,
      distance: isWithinRadius(registration.lat, registration.lng, loc.lat, loc.lng, registration.alert_radius_km),
    }))
    .filter((x) => x.distance)
    .sort((a, b) => b.loc.riskScore - a.loc.riskScore)[0]?.loc ?? locations[0];

  const riskScore = nearestLocation?.riskScore ?? 0;
  const riskLevel = nearestLocation?.riskLevel ?? "LOW";
  const imerg = nearestLocation?.imerg;
  const color = riskColor(riskLevel);

  async function handleEnableNotifications() {
    const result = await requestNotificationPermission();
    setNotifPerm(result);
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Shield className="text-cyan-400" /> LANDGUARD Protection
          </h1>
          <p className="text-sm text-slate-500 mt-1">Your personal landslide alert dashboard</p>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium ${online ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
          <Radio size={14} className={online ? "animate-pulse" : ""} />
          {online ? "ONLINE" : "OFFLINE"}
        </div>
      </div>

      {/* Offline banner */}
      {!online && offlineCache && (
        <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
          <div className="text-sm font-semibold text-yellow-400 mb-1">OFFLINE MODE</div>
          <div className="text-xs text-yellow-300/80 space-y-1">
            <div>Last successful update: {formatOfflineTimestamp(offlineCache)}</div>
            <div>Last known risk: <b>{offlineCache.lastRiskLevel}</b></div>
            <div>Last known location: {offlineCache.lastLocation}</div>
            <div>Last known rainfall: {offlineCache.lastRainfall} mm</div>
            <div className="mt-2 text-yellow-500/60">Showing last known data — not live data.</div>
          </div>
        </div>
      )}

      {/* Main protection card */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="flex items-center gap-2 mb-4">
          <MapPin size={18} className="text-cyan-400" />
          <h2 className="text-sm font-semibold text-slate-300">Monitoring Location</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <InfoRow label="Location" value={`${registration.district}, ${registration.state}`} />
          <InfoRow label="Latitude" value={registration.lat.toFixed(4)} />
          <InfoRow label="Longitude" value={registration.lng.toFixed(4)} />
          <InfoRow label="Monitoring Radius" value={`${registration.alert_radius_km} km`} />
        </div>
      </section>

      {/* Risk Status */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-300">Current Risk Status</h2>
          <Clock size={14} className="text-slate-500" />
        </div>
        <div className="flex items-center gap-4">
          <div
            className="flex items-center justify-center w-20 h-20 rounded-full text-2xl font-bold text-white shrink-0"
            style={{ backgroundColor: color }}
          >
            {riskScore}
          </div>
          <div>
            <div className="text-lg font-bold" style={{ color }}>{riskLevel}</div>
            <div className="text-xs text-slate-500">Risk Score: {riskScore}/100</div>
            <div className="text-xs text-slate-500 mt-1">
              Nearest monitored: {nearestLocation?.name ?? "Unknown"}
            </div>
          </div>
        </div>
      </section>

      {/* NASA IMERG */}
      {imerg && (
        <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Satellite size={18} className="text-cyan-400" />
            <h2 className="text-sm font-semibold text-slate-300">NASA IMERG Rainfall</h2>
            <span
              className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
              style={{
                color: imerg.dataStatus === "LIVE" ? "#22c55e" : "#eab308",
                backgroundColor: imerg.dataStatus === "LIVE" ? "#22c55e20" : "#eab30820",
              }}
            >
              {imerg.dataStatus}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <Metric label="24h" value={`${imerg.precipitation24h.toFixed(1)} mm`} />
            <Metric label="3 day" value={`${imerg.precipitation3d.toFixed(1)} mm`} />
            <Metric label="7 day" value={`${imerg.precipitation7d.toFixed(1)} mm`} />
          </div>
          <div className="text-xs text-slate-500 mt-3 flex items-center gap-1">
            <Clock size={12} />
            Observed: {new Date(imerg.observationTime).toISOString().slice(0, 16).replace("T", " ")} UTC
          </div>
        </section>
      )}

      {/* Alert Status */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
        <h2 className="text-sm font-semibold text-slate-300">Alert Subscription Status</h2>
        <InfoRow label="Alerts" value={registration.emergency_alerts_on ? "ON" : "OFF"} />
        <InfoRow label="SMS Alerts" value={registration.sms_alerts_on ? "ON (DEMO)" : "OFF"} />
        <InfoRow label="Last Updated" value={lastRefresh.toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })} />
        <div>
          <div className="text-xs text-slate-500 mb-1">Notification Permission</div>
          {notifPerm === "granted" ? (
            <div className="text-sm text-emerald-400 font-medium flex items-center gap-1">
              <Bell size={14} /> Granted — notifications active
            </div>
          ) : notifPerm === "denied" ? (
            <div className="text-sm text-red-400">Denied — enable in browser settings to receive notifications</div>
          ) : notifPerm === "unsupported" ? (
            <div className="text-sm text-slate-500">Not supported on this device</div>
          ) : (
            <button
              onClick={handleEnableNotifications}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium hover:bg-cyan-500/20 transition-colors"
            >
              <Bell size={16} /> Enable Emergency Alerts
            </button>
          )}
        </div>
      </section>

      {(riskLevel === "HIGH" || riskLevel === "CRITICAL") && (
        <div
          className="rounded-xl border-2 p-5"
          style={{ borderColor: color + "40", backgroundColor: color + "10" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={20} style={{ color }} />
            <span className="text-lg font-bold" style={{ color }}>
              {riskLevel === "CRITICAL" ? "EMERGENCY ALERT" : "WARNING"}
            </span>
          </div>
          <p className="text-sm" style={{ color: color + "cc" }}>
            {riskLevel === "CRITICAL"
              ? `CRITICAL landslide risk detected near ${nearestLocation?.name}. Risk Score: ${riskScore}/100. Move away from unstable slopes and follow official instructions.`
              : `High landslide risk detected near ${nearestLocation?.name}. Risk Score: ${riskScore}/100. Stay away from steep slopes and known landslide-prone areas.`}
          </p>
        </div>
      )}

      <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => onNavigate("alert-settings")}
          className="px-4 py-2 rounded-lg bg-slate-800/60 border border-slate-700 text-sm text-slate-300 hover:border-slate-600 transition-colors"
        >
          Alert Settings
        </button>
        <button
          onClick={() => onNavigate("alert-history")}
          className="px-4 py-2 rounded-lg bg-slate-800/60 border border-slate-700 text-sm text-slate-300 hover:border-slate-600 transition-colors"
        >
          Alert History
        </button>
        <button
          onClick={() => onNavigate("emergency-info")}
          className="px-4 py-2 rounded-lg bg-slate-800/60 border border-slate-700 text-sm text-slate-300 hover:border-slate-600 transition-colors"
        >
          Safety Information
        </button>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-sm text-slate-200 font-medium">{value}</span>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-800/40 p-2">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-sm font-bold text-slate-200">{value}</div>
    </div>
  );
}

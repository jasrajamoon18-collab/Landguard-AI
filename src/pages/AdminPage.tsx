import { useState, useEffect } from "react";
import { Users, Shield, AlertTriangle, Bell, MessageSquare, Satellite, Clock, MapPin } from "lucide-react";
import { getAllRegistrations, getAlertHistory } from "@/services/userPreferencesService";
import type { UserRegistration, AlertHistoryEntry } from "@/types/user";
import type { Location, DataStatus } from "@/types";
import { riskColor } from "@/utils/risk";

interface AdminPageProps {
  locations: Location[];
  dataStatus: DataStatus;
  lastRefresh: Date;
}

export function AdminPage({ locations, dataStatus, lastRefresh }: AdminPageProps) {
  const [registrations, setRegistrations] = useState<UserRegistration[]>([]);
  const [history, setHistory] = useState<AlertHistoryEntry[]>([]);

  useEffect(() => {
    async function load() {
      const [regs, hist] = await Promise.all([getAllRegistrations(), getAlertHistory()]);
      setRegistrations(regs);
      setHistory(hist);
    }
    load();
  }, []);

  const activeHigh = locations.filter((l) => l.riskLevel === "HIGH").length;
  const activeCritical = locations.filter((l) => l.riskLevel === "CRITICAL").length;
  const notifSent = history.filter((h) => h.delivery_channels.web === "SENT").length;
  const smsDemo = history.filter((h) => h.delivery_channels.sms === "DEMO").length;
  const protectedUsers = registrations.filter((r) => r.emergency_alerts_on).length;

  const stats = [
    { label: "Total Registered Users", value: registrations.length, icon: Users, color: "text-cyan-400" },
    { label: "Users Currently Protected", value: protectedUsers, icon: Shield, color: "text-emerald-400" },
    { label: "Active HIGH Alerts", value: activeHigh, icon: AlertTriangle, color: "text-orange-400" },
    { label: "Active CRITICAL Alerts", value: activeCritical, icon: AlertTriangle, color: "text-red-400" },
    { label: "Notifications Sent", value: notifSent, icon: Bell, color: "text-cyan-400" },
    { label: "SMS DEMO Messages", value: smsDemo, icon: MessageSquare, color: "text-yellow-400" },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Users className="text-cyan-400" /> Admin / Demo Monitoring
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Hackathon demonstration panel. No personal information is exposed.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={18} className={s.color} />
                <span className="text-xs text-slate-500">{s.label}</span>
              </div>
              <div className="text-2xl font-bold text-slate-100">{s.value}</div>
            </div>
          );
        })}
      </div>

      {/* NASA data status */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <Satellite size={16} className="text-cyan-400" /> NASA IMERG Data Status
        </h2>
        <div className="flex items-center gap-4">
          <span
            className="text-sm font-bold px-3 py-1 rounded-full"
            style={{
              color: dataStatus === "LIVE" ? "#22c55e" : dataStatus === "ERROR" ? "#ef4444" : "#eab308",
              backgroundColor: dataStatus === "LIVE" ? "#22c55e20" : dataStatus === "ERROR" ? "#ef444420" : "#eab30820",
            }}
          >
            {dataStatus}
          </span>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Clock size={12} />
            Last update: {lastRefresh.toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      </section>

      {/* Map of affected areas + registered locations */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <MapPin size={16} className="text-cyan-400" /> Monitored Locations & Registered Users
        </h2>
        <div className="space-y-2">
          {locations.map((loc) => {
            const color = riskColor(loc.riskLevel);
            const nearbyUsers = registrations.filter((r) =>
              Math.abs(r.lat - loc.lat) < 1 && Math.abs(r.lng - loc.lng) < 1,
            ).length;
            return (
              <div key={loc.id} className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/40">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: color }}
                />
                <div className="min-w-0 flex-1">
                  <span className="text-sm text-slate-200">{loc.name}, {loc.state}</span>
                </div>
                <span className="text-xs text-slate-500">Score: {loc.riskScore}</span>
                <span className="text-xs text-cyan-400">{nearbyUsers} user{nearbyUsers !== 1 ? "s" : ""}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Privacy notice */}
      <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3 text-xs text-slate-500">
        Admin panel for hackathon demonstration only. Phone numbers and personal details are never exposed.
        User counts and locations are shown in aggregate only.
      </div>
    </div>
  );
}

import { useState } from "react";
import { Bell, Search, CheckCircle, Eye } from "lucide-react";
import { AlertCard } from "@/components/AlertCard";
import { alerts as initialAlerts } from "@/data/alerts";
import { NER_STATES } from "@/data/locations";
import { formatDateTime } from "@/utils/format";
import { riskColor } from "@/utils/risk";
import type { Alert, PageId, Language } from "@/types";
import { t } from "@/data/translations";

interface AlertsPageProps {
  onNavigate: (page: PageId) => void;
  onSelectLocation: (id: string) => void;
  language: Language;
}

export function AlertsPage({ onSelectLocation, language }: AlertsPageProps) {
  const [alertList, setAlertList] = useState<Alert[]>(initialAlerts);
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toast, setToast] = useState<string | null>(null);

  const filtered = alertList.filter((a) => {
    const matchesSearch = a.locationName.toLowerCase().includes(search.toLowerCase()) ||
      a.reason.toLowerCase().includes(search.toLowerCase());
    const matchesState = stateFilter === "all" || a.state === stateFilter;
    const matchesLevel = levelFilter === "all" || a.riskLevel === levelFilter;
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    return matchesSearch && matchesState && matchesLevel && matchesStatus;
  });

  const activeAlerts = filtered.filter((a) => a.status === "ACTIVE").slice(0, 6);

  const handleAcknowledge = (alert: Alert) => {
    if (alert.status === "ACTIVE") {
      setAlertList((prev) =>
        prev.map((a) => (a.id === alert.id ? { ...a, status: "ACKNOWLEDGED" } : a)),
      );
      showToast(`Alert for ${alert.locationName} acknowledged`);
    }
  };

  const handleShare = (alert: Alert) => {
    const text = `LANDGUARD AI Alert: ${alert.locationName}, ${alert.state} — Risk ${alert.riskScore}/100 (${alert.riskLevel}). ${alert.action}`;
    if (navigator.share) {
      navigator.share({ title: "LANDGUARD AI Alert", text }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(text).catch(() => {});
    }
    showToast(`Alert details copied to clipboard`);
  };

  const handleView = (alert: Alert) => {
    onSelectLocation(alert.locationId);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Bell className="text-cyan-400" /> {t(language, "earlyWarning")}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Simulated early warning alerts · DEMO DATA · No real notifications are sent
        </p>
      </div>

      {/* Active alerts */}
      <div>
        <h2 className="text-sm font-semibold text-slate-400 mb-3">Active Alerts ({activeAlerts.length})</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {activeAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onView={handleView}
              onAcknowledge={handleAcknowledge}
              onShare={handleShare}
            />
          ))}
          {activeAlerts.length === 0 && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-8 text-center col-span-2">
              <CheckCircle size={36} className="text-emerald-400 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No active alerts. All monitored locations are within safe parameters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Alert history */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h2 className="text-sm font-semibold text-slate-400 mb-3">Alert History</h2>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700 flex-1 min-w-[180px]">
            <Search size={14} className="text-slate-500" />
            <input
              type="text"
              placeholder="Search alerts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm text-slate-200 outline-none flex-1"
            />
          </div>
          <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} className="px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700 text-sm text-slate-200 outline-none cursor-pointer">
            <option value="all" className="bg-slate-800">All States</option>
            {NER_STATES.map((s) => <option key={s} value={s} className="bg-slate-800">{s}</option>)}
          </select>
          <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)} className="px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700 text-sm text-slate-200 outline-none cursor-pointer">
            <option value="all" className="bg-slate-800">All Levels</option>
            <option value="LOW" className="bg-slate-800">Low</option>
            <option value="MODERATE" className="bg-slate-800">Moderate</option>
            <option value="HIGH" className="bg-slate-800">High</option>
            <option value="CRITICAL" className="bg-slate-800">Critical</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700 text-sm text-slate-200 outline-none cursor-pointer">
            <option value="all" className="bg-slate-800">All Status</option>
            <option value="ACTIVE" className="bg-slate-800">Active</option>
            <option value="ACKNOWLEDGED" className="bg-slate-800">Acknowledged</option>
            <option value="RESOLVED" className="bg-slate-800">Resolved</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500 border-b border-slate-800">
                <th className="py-2 pr-4">Time</th>
                <th className="py-2 pr-4">Location</th>
                <th className="py-2 pr-4">State</th>
                <th className="py-2 pr-4">Level</th>
                <th className="py-2 pr-4">Score</th>
                <th className="py-2 pr-4 hidden md:table-cell">Reason</th>
                <th className="py-2 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                  <td className="py-2.5 pr-4 text-xs text-slate-500 whitespace-nowrap">{formatDateTime(new Date(a.time))}</td>
                  <td className="py-2.5 pr-4 text-slate-200 font-medium">{a.locationName}</td>
                  <td className="py-2.5 pr-4 text-slate-400">{a.state}</td>
                  <td className="py-2.5 pr-4">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: riskColor(a.riskLevel), backgroundColor: riskColor(a.riskLevel) + "20" }}>
                      {a.riskLevel}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4 font-bold" style={{ color: riskColor(a.riskLevel) }}>{a.riskScore}</td>
                  <td className="py-2.5 pr-4 text-slate-400 hidden md:table-cell max-w-xs truncate">{a.reason}</td>
                  <td className="py-2.5 pr-4">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                      a.status === "ACTIVE" ? "bg-red-500/10 text-red-400" :
                      a.status === "ACKNOWLEDGED" ? "bg-yellow-500/10 text-yellow-400" :
                      "bg-emerald-500/10 text-emerald-400"
                    }`}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-slate-800 border border-slate-600 px-4 py-3 text-sm text-slate-200 shadow-xl flex items-center gap-2">
          <Eye size={16} className="text-cyan-400" />
          {toast}
        </div>
      )}
    </div>
  );
}

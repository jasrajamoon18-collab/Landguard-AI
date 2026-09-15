import { useState, useEffect } from "react";
import { History, Bell, MessageSquare, Monitor } from "lucide-react";
import { getAlertHistory, getAlertHistoryForUser, getLocalRegistration } from "@/services/userPreferencesService";
import type { AlertHistoryEntry } from "@/types/user";
import { riskColor } from "@/utils/risk";
import type { RiskLevel } from "@/types/risk";

export function AlertHistoryPage() {
  const [history, setHistory] = useState<AlertHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const registration = getLocalRegistration();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = registration?.id
        ? await getAlertHistoryForUser(registration.id)
        : await getAlertHistory();
      setHistory(data);
      setLoading(false);
    }
    load();
  }, [registration?.id]);

  if (!registration) {
    return (
      <div className="space-y-6 max-w-4xl">
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <History className="text-cyan-400" /> Alert History
        </h1>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-8 text-center">
          <p className="text-slate-400">Register for alerts to start building your alert history.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <History className="text-cyan-400" /> Alert History
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {history.length} alert record{history.length !== 1 ? "s" : ""}
          {registration && ` for ${registration.district}, ${registration.state}`}
        </p>
      </div>

      {loading && (
        <div className="text-sm text-slate-500 text-center py-8">Loading alert history...</div>
      )}

      {!loading && history.length === 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-8 text-center">
          <History size={40} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No alerts have been triggered yet.</p>
          <p className="text-xs text-slate-500 mt-1">
            Alerts will appear here when the risk engine detects escalation in your area.
          </p>
        </div>
      )}

      {!loading && history.length > 0 && (
        <div className="space-y-3">
          {history.map((entry) => {
            const color = riskColor(entry.risk_level as RiskLevel);
            const channels = entry.delivery_channels;
            return (
              <div
                key={entry.id}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-4"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex items-center justify-center w-10 h-10 rounded-full text-xs font-bold text-white shrink-0"
                      style={{ backgroundColor: color }}
                    >
                      {entry.risk_score}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                        {entry.risk_level}
                        {entry.is_demo && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400">
                            DEMO
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500">
                        {entry.created_at
                          ? new Date(entry.created_at).toLocaleString("en-IN", {
                              day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
                            })
                          : ""}
                      </div>
                    </div>
                  </div>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ color, backgroundColor: color + "20" }}
                  >
                    {entry.alert_type}
                  </span>
                </div>

                <div className="text-xs text-slate-400 mb-2">{entry.message}</div>

                <div className="flex flex-wrap gap-2">
                  <ChannelBadge icon={<Monitor size={12} />} label="Web" status={channels.web} />
                  <ChannelBadge icon={<MessageSquare size={12} />} label="SMS" status={channels.sms} />
                  <ChannelBadge icon={<Bell size={12} />} label="In-App" status={channels.inApp} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ChannelBadge({
  icon,
  label,
  status,
}: {
  icon: React.ReactNode;
  label: string;
  status?: string;
}) {
  if (!status || status === "OFF") {
    return (
      <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-600">
        {icon} {label}: OFF
      </span>
    );
  }

  const colorMap: Record<string, string> = {
    SENT: "text-emerald-400 bg-emerald-500/10",
    ACTIVE: "text-emerald-400 bg-emerald-500/10",
    DEMO: "text-yellow-400 bg-yellow-500/10",
    DENIED: "text-red-400 bg-red-500/10",
    PENDING: "text-slate-400 bg-slate-700/30",
  };

  const cls = colorMap[status] ?? "text-slate-400 bg-slate-700/30";

  return (
    <span className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded font-medium ${cls}`}>
      {icon} {label}: {status}
    </span>
  );
}

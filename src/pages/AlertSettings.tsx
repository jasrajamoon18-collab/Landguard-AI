import { useState } from "react";
import { Settings, Bell, MessageSquare, AlertCircle } from "lucide-react";
import { getLocalRegistration, updateRegistration, clearRegistration } from "@/services/userPreferencesService";
import { ALERT_LANGUAGES, ALERT_RADII } from "@/types/user";
import type { AlertLanguage, AlertRadiusKm, MinAlertLevel } from "@/types/user";
import { checkNotificationPermission, requestNotificationPermission } from "@/services/notificationService";
import type { NotificationPermission } from "@/types/user";

interface AlertSettingsProps {
  onNavigate: (page: string) => void;
}

export function AlertSettings({ onNavigate }: AlertSettingsProps) {
  const registration = getLocalRegistration();
  const [form, setForm] = useState(registration);
  const [notifPerm, setNotifPerm] = useState<NotificationPermission>(checkNotificationPermission());
  const [saved, setSaved] = useState(false);

  if (!registration || !form) {
    return (
      <div className="space-y-6 max-w-3xl">
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Settings className="text-cyan-400" /> Emergency Alert Settings
        </h1>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-8 text-center">
          <p className="text-slate-400 mb-4">You need to register first to configure alert settings.</p>
          <button
            onClick={() => onNavigate("register")}
            className="px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white text-sm font-bold"
          >
            Register Now
          </button>
        </div>
      </div>
    );
  }

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => prev ? { ...prev, [key]: value } : prev);
  }

  async function handleSave() {
    if (form.id) {
      await updateRegistration(form.id, form);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleEnableNotifications() {
    const result = await requestNotificationPermission();
    setNotifPerm(result);
  }

  function handleUnregister() {
    clearRegistration();
    onNavigate("register");
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Settings className="text-cyan-400" /> Emergency Alert Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">Configure how and when you receive alerts</p>
      </div>

      {saved && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">
          Settings saved successfully.
        </div>
      )}

      {/* Alert toggles */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
        <h2 className="text-sm font-semibold text-slate-300">Alert Channels</h2>
        <ToggleRow
          label="Emergency Alerts"
          description="Master switch for all alert delivery"
          icon={<AlertCircle size={16} className="text-orange-400" />}
          value={form.emergency_alerts_on}
          onChange={(v) => update("emergency_alerts_on", v)}
        />
        <ToggleRow
          label="Browser Notifications"
          description="Web push notifications on your device"
          icon={<Bell size={16} className="text-cyan-400" />}
          value={form.notification_alerts_on}
          onChange={(v) => update("notification_alerts_on", v)}
        />
        <ToggleRow
          label="SMS Alerts"
          description="SMS to your mobile number (DEMO mode)"
          icon={<MessageSquare size={16} className="text-emerald-400" />}
          value={form.sms_alerts_on}
          onChange={(v) => update("sms_alerts_on", v)}
        />
      </section>

      {/* Notification permission */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="text-sm font-semibold text-slate-300 mb-2">Browser Notification Permission</h2>
        {notifPerm === "granted" ? (
          <div className="text-sm text-emerald-400 flex items-center gap-2">
            <Bell size={16} /> Permission granted — notifications are active.
          </div>
        ) : notifPerm === "denied" ? (
          <div className="text-sm text-red-400">
            Permission denied. Enable notifications in your browser settings to receive alerts.
          </div>
        ) : notifPerm === "unsupported" ? (
          <div className="text-sm text-slate-500">Notifications not supported on this device.</div>
        ) : (
          <button
            onClick={handleEnableNotifications}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium hover:bg-cyan-500/20 transition-colors"
          >
            <Bell size={16} /> Enable Emergency Alerts
          </button>
        )}
      </section>

      {/* Alert thresholds */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
        <h2 className="text-sm font-semibold text-slate-300">Alert Thresholds</h2>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Alert Radius</label>
          <select
            value={form.alert_radius_km}
            onChange={(e) => update("alert_radius_km", Number(e.target.value) as AlertRadiusKm)}
            className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700 text-sm text-slate-200 outline-none cursor-pointer"
          >
            {ALERT_RADII.map((r) => (
              <option key={r} value={r} className="bg-slate-800">{r} km</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Minimum Alert Level</label>
          <select
            value={form.min_alert_level}
            onChange={(e) => update("min_alert_level", e.target.value as MinAlertLevel)}
            className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700 text-sm text-slate-200 outline-none cursor-pointer"
          >
            <option value="HIGH" className="bg-slate-800">HIGH and above</option>
            <option value="CRITICAL" className="bg-slate-800">CRITICAL only</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Preferred Language</label>
          <select
            value={form.preferred_language}
            onChange={(e) => update("preferred_language", e.target.value as AlertLanguage)}
            className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700 text-sm text-slate-200 outline-none cursor-pointer"
          >
            {ALERT_LANGUAGES.map((l) => (
              <option key={l.value} value={l.value} className="bg-slate-800">{l.label}</option>
            ))}
          </select>
        </div>
      </section>

      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white text-sm font-bold transition-colors"
        >
          Save Settings
        </button>
        <button
          onClick={handleUnregister}
          className="px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors"
        >
          Unregister
        </button>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  icon,
  value,
  onChange,
}: {
  label: string;
  description: string;
  icon: React.ReactNode;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40">
      <div className="flex items-center gap-2">
        {icon}
        <div>
          <div className="text-sm font-medium text-slate-200">{label}</div>
          <div className="text-xs text-slate-500">{description}</div>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
          value ? "bg-cyan-500" : "bg-slate-700"
        }`}
      >
        <div
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
            value ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

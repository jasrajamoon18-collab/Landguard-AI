import { useState, useEffect } from "react";
import { ShieldPlus, MapPin, Crosshair, Check, Globe2 } from "lucide-react";
import { NER_DISTRICTS, ALERT_LANGUAGES, ALERT_RADII } from "@/types/user";
import { NER_STATES } from "@/types/location";
import type { UserRegistration, AlertLanguage, AlertRadiusKm, MinAlertLevel } from "@/types/user";
import { saveRegistration, getLocalRegistration } from "@/services/userPreferencesService";
import { riskColor } from "@/utils/risk";
import type { Location, PageId } from "@/types";

interface RegisterPageProps {
  locations: Location[];
  onRegistered: () => void;
  onNavigate: (page: PageId) => void;
}

export function RegisterPage({ onRegistered, onNavigate }: RegisterPageProps) {
  const existing = getLocalRegistration();
  const [form, setForm] = useState<UserRegistration>(
    existing ?? {
      full_name: "",
      mobile_number: "",
      state: "Meghalaya",
      district: "East Khasi Hills",
      village: "",
      lat: 25.27,
      lng: 91.73,
      preferred_language: "en",
      alert_radius_km: 20,
      emergency_alerts_on: true,
      notification_alerts_on: true,
      sms_alerts_on: true,
      min_alert_level: "HIGH",
    },
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);

  function updateField<K extends keyof UserRegistration>(key: K, value: UserRegistration[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function requestGeolocation() {
    setGeoError(null);
    setGeoLoading(true);
    if (!("geolocation" in navigator)) {
      setGeoError("Geolocation not supported on this device. Please enter coordinates manually.");
      setGeoLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        updateField("lat", +pos.coords.latitude.toFixed(4));
        updateField("lng", +pos.coords.longitude.toFixed(4));
        setGeoLoading(false);
      },
      (err) => {
        setGeoError(
          err.code === err.PERMISSION_DENIED
            ? "Location permission denied. You can select your location manually."
            : "Could not retrieve your location. Please enter coordinates manually.",
        );
        setGeoLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: true },
    );
  }

  function handleStateChange(state: string) {
    const districts = NER_DISTRICTS[state] ?? [];
    setForm((prev) => ({
      ...prev,
      state,
      district: districts[0] ?? "",
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await saveRegistration(form);
      setSaved(true);
      setTimeout(() => {
        onRegistered();
        onNavigate("myalerts");
      }, 1500);
    } catch {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <ShieldPlus className="text-cyan-400" /> Get Protected — Subscribe to Alerts
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Register to receive landslide risk alerts for your area. Your information is stored securely and never shared publicly.
        </p>
      </div>

      {existing && !saved && (
        <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-3 text-sm text-cyan-300">
          You are already registered. Update your details below or go to My Alerts.
        </div>
      )}

      {saved && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300 flex items-center gap-2">
          <Check size={18} /> Registration saved! Redirecting to My Alerts...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Personal Info */}
        <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-300">Personal Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Full Name</label>
              <input
                required
                type="text"
                value={form.full_name}
                onChange={(e) => updateField("full_name", e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700 text-sm text-slate-200 outline-none focus:border-cyan-500"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Mobile Number</label>
              <input
                required
                type="tel"
                value={form.mobile_number}
                onChange={(e) => updateField("mobile_number", e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700 text-sm text-slate-200 outline-none focus:border-cyan-500"
                placeholder="+91XXXXXXXXXX"
              />
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <MapPin size={16} className="text-cyan-400" /> Monitoring Location
            </h2>
            <button
              type="button"
              onClick={requestGeolocation}
              disabled={geoLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium hover:bg-cyan-500/20 transition-colors disabled:opacity-50"
            >
              <Crosshair size={14} className={geoLoading ? "animate-spin" : ""} />
              {geoLoading ? "Locating..." : "Use my current location"}
            </button>
          </div>

          {geoError && (
            <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-xs text-yellow-400">
              {geoError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">State</label>
              <select
                value={form.state}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700 text-sm text-slate-200 outline-none cursor-pointer"
              >
                {NER_STATES.map((s: string) => (
                  <option key={s} value={s} className="bg-slate-800">{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">District</label>
              <select
                value={form.district}
                onChange={(e) => updateField("district", e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700 text-sm text-slate-200 outline-none cursor-pointer"
              >
                {(NER_DISTRICTS[form.state] ?? []).map((d) => (
                  <option key={d} value={d} className="bg-slate-800">{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Village / City</label>
              <input
                type="text"
                value={form.village ?? ""}
                onChange={(e) => updateField("village", e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700 text-sm text-slate-200 outline-none focus:border-cyan-500"
                placeholder="Your village or city"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Monitoring Radius</label>
              <select
                value={form.alert_radius_km}
                onChange={(e) => updateField("alert_radius_km", Number(e.target.value) as AlertRadiusKm)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700 text-sm text-slate-200 outline-none cursor-pointer"
              >
                {ALERT_RADII.map((r) => (
                  <option key={r} value={r} className="bg-slate-800">{r} km</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Latitude</label>
              <input
                required
                type="number"
                step="0.0001"
                value={form.lat}
                onChange={(e) => updateField("lat", parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700 text-sm text-slate-200 outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Longitude</label>
              <input
                required
                type="number"
                step="0.0001"
                value={form.lng}
                onChange={(e) => updateField("lng", parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700 text-sm text-slate-200 outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="rounded-lg bg-slate-800/40 p-3 text-xs text-slate-400 flex items-center gap-2">
            <MapPin size={14} className="text-cyan-400 shrink-0" />
            <span>
              Location: <b className="text-slate-300">{form.district}, {form.state}</b>
              {" — "}
              Lat: <b className="text-slate-300">{form.lat.toFixed(4)}</b>,
              Lng: <b className="text-slate-300">{form.lng.toFixed(4)}</b>
              {" — "}
              Radius: <b className="text-slate-300">{form.alert_radius_km} km</b>
            </span>
          </div>
        </section>

        {/* Alert Preferences */}
        <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-300">Alert Preferences</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1 flex items-center gap-1">
                <Globe2 size={12} /> Preferred Language
              </label>
              <select
                value={form.preferred_language}
                onChange={(e) => updateField("preferred_language", e.target.value as AlertLanguage)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700 text-sm text-slate-200 outline-none cursor-pointer"
              >
                {ALERT_LANGUAGES.map((l) => (
                  <option key={l.value} value={l.value} className="bg-slate-800">{l.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Minimum Alert Level</label>
              <select
                value={form.min_alert_level}
                onChange={(e) => updateField("min_alert_level", e.target.value as MinAlertLevel)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700 text-sm text-slate-200 outline-none cursor-pointer"
              >
                <option value="HIGH" className="bg-slate-800">HIGH and above</option>
                <option value="CRITICAL" className="bg-slate-800">CRITICAL only</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <ToggleRow
              label="Emergency Alerts"
              description="Receive alerts when risk escalates"
              value={form.emergency_alerts_on}
              onChange={(v) => updateField("emergency_alerts_on", v)}
            />
            <ToggleRow
              label="Browser Notifications"
              description="Show desktop/mobile push notifications"
              value={form.notification_alerts_on}
              onChange={(v) => updateField("notification_alerts_on", v)}
            />
            <ToggleRow
              label="SMS Alerts"
              description="Receive SMS to your mobile number (DEMO mode)"
              value={form.sms_alerts_on}
              onChange={(v) => updateField("sms_alerts_on", v)}
            />
          </div>
        </section>

        <button
          type="submit"
          disabled={saving || saved}
          className="w-full sm:w-auto px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white text-sm font-bold transition-colors disabled:opacity-50"
          style={{ backgroundColor: saved ? undefined : undefined }}
        >
          {saved ? "Saved!" : saving ? "Saving..." : "Get Protected"}
        </button>
      </form>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40">
      <div>
        <div className="text-sm font-medium text-slate-200">{label}</div>
        <div className="text-xs text-slate-500">{description}</div>
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

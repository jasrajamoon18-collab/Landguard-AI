import { Siren, AlertOctagon, ShieldAlert, ListChecks, Phone, MapPin } from "lucide-react";
import { locations } from "@/data/locations";
import { riskColor } from "@/utils/risk";
import type { PageId } from "@/types";

interface EmergencyResponseProps {
  onNavigate: (page: PageId) => void;
  onSelectLocation: (id: string) => void;
}

export function EmergencyResponse({ onNavigate, onSelectLocation }: EmergencyResponseProps) {
  const critical = locations.filter((l) => l.riskLevel === "CRITICAL");
  const high = locations.filter((l) => l.riskLevel === "HIGH");
  const moderate = locations.filter((l) => l.riskLevel === "MODERATE");

  const priorities = [
    { label: "Critical-risk areas", count: critical.length, color: riskColor("CRITICAL"), icon: AlertOctagon },
    { label: "High-risk areas", count: high.length, color: riskColor("HIGH"), icon: ShieldAlert },
    { label: "Moderate-risk areas", count: moderate.length, color: riskColor("MODERATE"), icon: ShieldAlert },
  ];

  const actions = [
    "Monitor rainfall continuously in high-risk zones",
    "Monitor ground movement for acceleration trends",
    "Restrict access to unstable slopes and vulnerable areas",
    "Notify local disaster management authorities",
    "Follow official evacuation instructions when issued",
    "Maintain communication with emergency services",
  ];

  const emergencyContacts = [
    { name: "NDRF (National Disaster Response Force)", number: "112" },
    { name: "State Emergency Operations Centre", number: "1070" },
    { name: "District Emergency", number: "1077" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Siren className="text-red-400" /> Emergency Response
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Prototype response dashboard — NOT official emergency instructions
        </p>
      </div>

      {/* Critical locations */}
      <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-5">
        <h2 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
          <AlertOctagon size={20} /> Critical Locations ({critical.length})
        </h2>
        {critical.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {critical.map((loc) => (
              <button
                key={loc.id}
                onClick={() => onSelectLocation(loc.id)}
                className="text-left p-4 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-red-500/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-200 truncate">{loc.name}</div>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                      <MapPin size={12} /> {loc.state}
                    </div>
                  </div>
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-lg text-lg font-bold text-white shrink-0"
                    style={{ backgroundColor: riskColor(loc.riskLevel) }}
                  >
                    {loc.riskScore}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 text-sm">No critical locations at this time.</p>
        )}
      </div>

      {/* Response priorities */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <ListChecks size={20} className="text-cyan-400" /> Response Priorities
        </h2>
        <div className="space-y-3">
          {priorities.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={p.label}
                className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/40 border-l-4"
                style={{ borderColor: p.color }}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800 text-sm font-bold text-slate-300 shrink-0">
                  {i + 1}
                </div>
                <Icon size={20} style={{ color: p.color }} className="shrink-0" />
                <span className="text-sm font-medium text-slate-200 flex-1">{p.label}</span>
                <span className="text-sm font-bold" style={{ color: p.color }}>{p.count} locations</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommended actions */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">Recommended Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actions.map((action, i) => (
            <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-slate-800/40">
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold shrink-0 mt-0.5">
                {i + 1}
              </div>
              <p className="text-sm text-slate-300">{action}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
          <p className="text-xs text-yellow-400">
            These are prototype recommendations only. Always follow instructions from official disaster management authorities during actual emergencies.
          </p>
        </div>
      </div>

      {/* Emergency contacts (demo) */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <Phone size={20} className="text-emerald-400" /> Emergency Contacts (Reference)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {emergencyContacts.map((c) => (
            <div key={c.name} className="p-3 rounded-lg bg-slate-800/40">
              <div className="text-xs text-slate-500">{c.name}</div>
              <div className="text-lg font-bold text-emerald-400 mt-1">{c.number}</div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-600">
          Emergency numbers shown for reference. In a real emergency, contact local authorities directly.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onNavigate("alerts")}
          className="flex-1 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition-colors"
        >
          View Active Alerts
        </button>
        <button
          onClick={() => onNavigate("map")}
          className="flex-1 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition-colors"
        >
          View Risk Map
        </button>
      </div>
    </div>
  );
}

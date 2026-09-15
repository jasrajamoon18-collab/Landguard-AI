import { useState } from "react";
import { Map as MapIcon, Search } from "lucide-react";
import { RiskMap } from "@/components/RiskMap";
import { DataStatusBadge } from "@/components/DataStatusBadge";
import { NER_STATES } from "@/types/location";
import { riskColor } from "@/utils/risk";
import type { Location, DataStatus, Language } from "@/types";

interface MapPageProps {
  locations: Location[];
  onSelectLocation: (id: string) => void;
  dataStatus: DataStatus;
}

export function MapPage({ locations, onSelectLocation, dataStatus }: MapPageProps) {
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  const filtered = locations.filter((l) => {
    const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.state.toLowerCase().includes(search.toLowerCase());
    const matchesState = stateFilter === "all" || l.state === stateFilter;
    const matchesLevel = levelFilter === "all" || l.riskLevel === levelFilter;
    return matchesSearch && matchesState && matchesLevel;
  });

  const handleSelect = (id: string) => {
    setSelectedId(id);
    onSelectLocation(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <MapIcon className="text-cyan-400" /> Interactive GIS Risk Map
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {filtered.length} of {locations.length} monitored locations · Click markers for details
          </p>
        </div>
        <DataStatusBadge status={dataStatus} size="md" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-800 flex-1 min-w-[200px]">
          <Search size={16} className="text-slate-500" />
          <input
            type="text"
            placeholder="Search location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-slate-200 outline-none flex-1"
          />
        </div>
        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          className="px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-800 text-sm text-slate-200 outline-none cursor-pointer"
        >
          <option value="all" className="bg-slate-800">All States</option>
          {NER_STATES.map((s) => (
            <option key={s} value={s} className="bg-slate-800">{s}</option>
          ))}
        </select>
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-800 text-sm text-slate-200 outline-none cursor-pointer"
        >
          <option value="all" className="bg-slate-800">All Risk Levels</option>
          <option value="LOW" className="bg-slate-800">Low</option>
          <option value="MODERATE" className="bg-slate-800">Moderate</option>
          <option value="HIGH" className="bg-slate-800">High</option>
          <option value="CRITICAL" className="bg-slate-800">Critical</option>
        </select>
      </div>

      {/* Map */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <RiskMap
          locations={filtered}
          onSelectLocation={handleSelect}
          height="500px"
          highlightId={selectedId}
        />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        {(["LOW", "MODERATE", "HIGH", "CRITICAL"] as const).map((level) => (
          <div key={level} className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: riskColor(level) }} />
            <span className="text-sm text-slate-400">{level}</span>
          </div>
        ))}
      </div>

      {/* Location list */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h2 className="text-sm font-semibold text-slate-400 mb-3">Locations on Map ({filtered.length})</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {filtered.map((loc) => {
            const imerg = loc.imerg;
            const statusColor = loc.dataStatus === "LIVE" ? "text-emerald-400" : loc.dataStatus === "ERROR" ? "text-red-400" : "text-yellow-400";
            return (
            <button
              key={loc.id}
              onClick={() => handleSelect(loc.id)}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40 hover:bg-slate-800/80 transition-colors text-left"
            >
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-slate-200 truncate">{loc.name}</div>
                <div className="text-xs text-slate-500">{loc.state}</div>
                {imerg && (
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                    <span>24h: <b className="text-blue-400">{imerg.precipitation24h.toFixed(1)} mm</b></span>
                    <span>3d: <b>{imerg.precipitation3d.toFixed(0)} mm</b></span>
                    <span className={statusColor + " font-semibold"}>{imerg.dataStatus}</span>
                  </div>
                )}
              </div>
              <div
                className="flex items-center justify-center w-8 h-8 rounded-full shrink-0 ml-2 text-xs font-bold text-white"
                style={{ backgroundColor: riskColor(loc.riskLevel) }}
              >
                {loc.riskScore}
              </div>
            </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

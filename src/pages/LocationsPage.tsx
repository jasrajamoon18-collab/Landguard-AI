import { useState, useMemo } from "react";
import { MapPin, Search, ArrowUpDown, X } from "lucide-react";
import { NER_STATES } from "@/types/location";
import { riskColor } from "@/utils/risk";
import type { Location } from "@/types";

interface LocationsPageProps {
  locations: Location[];
  onSelectLocation: (id: string) => void;
}

type SortKey = "riskScore" | "rainfall" | "soilMoisture" | "slope" | "groundMovement" | "name";

export function LocationsPage({ locations, onSelectLocation }: LocationsPageProps) {
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("riskScore");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selected, setSelected] = useState<Location | null>(null);

  const filtered = useMemo(() => {
    let result = locations.filter((l) => {
      const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.state.toLowerCase().includes(search.toLowerCase());
      const matchesState = stateFilter === "all" || l.state === stateFilter;
      const matchesLevel = levelFilter === "all" || l.riskLevel === levelFilter;
      return matchesSearch && matchesState && matchesLevel;
    });

    result = [...result].sort((a, b) => {
      let av: string | number = a[sortKey];
      let bv: string | number = b[sortKey];
      if (typeof av === "string" && typeof bv === "string") {
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sortDir === "asc" ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });

    return result;
  }, [search, stateFilter, levelFilter, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const handleRowClick = (loc: Location) => {
    setSelected(loc);
  };

  const handleViewAnalysis = () => {
    if (selected) onSelectLocation(selected.id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <MapPin className="text-cyan-400" /> Monitored Locations
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {filtered.length} of {locations.length} monitored locations
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700 flex-1 min-w-[180px]">
          <Search size={14} className="text-slate-500" />
          <input
            type="text"
            placeholder="Search by name or state..."
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
          <option value="all" className="bg-slate-800">All Risk Levels</option>
          <option value="LOW" className="bg-slate-800">Low</option>
          <option value="MODERATE" className="bg-slate-800">Moderate</option>
          <option value="HIGH" className="bg-slate-800">High</option>
          <option value="CRITICAL" className="bg-slate-800">Critical</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 overflow-x-auto">
        <table className="w-full text-sm whitespace-nowrap">
          <thead>
            <tr className="text-left text-xs text-slate-500 border-b border-slate-800">
              <th className="py-2 pr-4">
                <button onClick={() => toggleSort("name")} className="flex items-center gap-1 hover:text-slate-300">
                  Location <ArrowUpDown size={10} />
                </button>
              </th>
              <th className="py-2 pr-4">State</th>
              <th className="py-2 pr-4">
                <button onClick={() => toggleSort("riskScore")} className="flex items-center gap-1 hover:text-slate-300">
                  Risk <ArrowUpDown size={10} />
                </button>
              </th>
              <th className="py-2 pr-4">Level</th>
              <th className="py-2 pr-4">
                <button onClick={() => toggleSort("rainfall")} className="flex items-center gap-1 hover:text-slate-300">
                  Rainfall <ArrowUpDown size={10} />
                </button>
              </th>
              <th className="py-2 pr-4">
                <button onClick={() => toggleSort("soilMoisture")} className="flex items-center gap-1 hover:text-slate-300">
                  Soil <ArrowUpDown size={10} />
                </button>
              </th>
              <th className="py-2 pr-4">
                <button onClick={() => toggleSort("slope")} className="flex items-center gap-1 hover:text-slate-300">
                  Slope <ArrowUpDown size={10} />
                </button>
              </th>
              <th className="py-2 pr-4">
                <button onClick={() => toggleSort("groundMovement")} className="flex items-center gap-1 hover:text-slate-300">
                  Movement <ArrowUpDown size={10} />
                </button>
              </th>
              <th className="py-2 pr-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((loc) => (
              <tr
                key={loc.id}
                className="border-b border-slate-800/50 hover:bg-slate-800/30 cursor-pointer"
                onClick={() => handleRowClick(loc)}
              >
                <td className="py-2.5 pr-4 text-slate-200 font-medium">{loc.name}</td>
                <td className="py-2.5 pr-4 text-slate-400">{loc.state}</td>
                <td className="py-2.5 pr-4 font-bold" style={{ color: riskColor(loc.riskLevel) }}>{loc.riskScore}</td>
                <td className="py-2.5 pr-4">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: riskColor(loc.riskLevel), backgroundColor: riskColor(loc.riskLevel) + "20" }}>
                    {loc.riskLevel}
                  </span>
                </td>
                <td className="py-2.5 pr-4 text-slate-400">{loc.rainfall}mm</td>
                <td className="py-2.5 pr-4 text-slate-400">{loc.soilMoisture}%</td>
                <td className="py-2.5 pr-4 text-slate-400">{loc.slope}°</td>
                <td className="py-2.5 pr-4 text-slate-400">+{loc.groundMovement}mm</td>
                <td className="py-2.5 pr-4">
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    loc.status === "CRITICAL" ? "bg-red-500/10 text-red-400" :
                    loc.status === "ALERT" ? "bg-orange-500/10 text-orange-400" :
                    "bg-emerald-500/10 text-emerald-400"
                  }`}>
                    {loc.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60" onClick={() => setSelected(null)}>
          <div
            className="bg-slate-900 border border-slate-700 rounded-t-xl sm:rounded-xl w-full sm:max-w-md max-h-[80vh] overflow-y-auto p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-100">{selected.name}</h2>
                <div className="flex items-center gap-1 text-sm text-slate-400 mt-1">
                  <MapPin size={14} /> {selected.state}
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-slate-800">
                <X size={18} className="text-slate-400" />
              </button>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div
                className="flex items-center justify-center w-16 h-16 rounded-2xl text-2xl font-bold text-white"
                style={{ backgroundColor: riskColor(selected.riskLevel) }}
              >
                {selected.riskScore}
              </div>
              <div>
                <div className="text-sm text-slate-500">Risk Score</div>
                <div className="text-lg font-bold" style={{ color: riskColor(selected.riskLevel) }}>
                  {selected.riskLevel} RISK
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: "Rainfall", value: `${selected.rainfall} mm` },
                { label: "Soil Moisture", value: `${selected.soilMoisture}%` },
                { label: "Slope", value: `${selected.slope}°` },
                { label: "Elevation", value: `${selected.elevation} m` },
                { label: "Ground Movement", value: `+${selected.groundMovement} mm` },
                { label: "Historical Risk", value: `${selected.historicalRisk}%` },
                { label: "Latitude", value: selected.lat.toFixed(4) },
                { label: "Longitude", value: selected.lng.toFixed(4) },
                { label: "Data Source", value: selected.dataStatus },
              ].map((item) => (
                <div key={item.label} className="rounded-lg bg-slate-800/50 p-3">
                  <div className="text-xs text-slate-500">{item.label}</div>
                  <div className="text-sm font-semibold text-slate-200 mt-0.5">{item.value}</div>
                </div>
              ))}
            </div>

            <button
              onClick={handleViewAnalysis}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm transition-all"
            >
              View AI Analysis
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

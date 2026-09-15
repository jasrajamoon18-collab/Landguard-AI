import { useState, useEffect } from "react";
import { Radio, Globe, RefreshCw } from "lucide-react";
import { t } from "@/data/translations";
import { formatDateTime } from "@/utils/format";
import { riskTextClass } from "@/utils/risk";
import { DataStatusBadge } from "./DataStatusBadge";
import type { Language, DataStatus } from "@/types";

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  regionScore: number;
  dataStatus: DataStatus;
  onRefresh: () => void;
  loading: boolean;
  lastRefresh: Date;
}

export function Header({ language, onLanguageChange, regionScore, dataStatus, onRefresh, loading, lastRefresh }: HeaderProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const scoreLevel =
    regionScore > 75 ? "CRITICAL" : regionScore > 50 ? "HIGH" : regionScore > 25 ? "MODERATE" : "LOW";

  return (
    <header className="sticky top-14 lg:top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="flex items-center justify-between gap-2 sm:gap-3 px-4 sm:px-6 lg:px-8 h-14">
        {/* Left */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="hidden sm:block">
            <div className="text-sm font-semibold text-slate-200 truncate">
              NER Landslide Monitoring
            </div>
            <div className="text-[10px] text-slate-500">{formatDateTime(now)}</div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Regional score */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-800/60 border border-slate-700">
            <span className="text-xs text-slate-400">Regional Risk</span>
            <span className={`text-sm font-bold ${riskTextClass(scoreLevel)}`}>
              {regionScore}
              <span className="text-slate-500 text-xs">/100</span>
            </span>
          </div>

          {/* Data status badge */}
          <DataStatusBadge status={dataStatus} language={language} />

          {/* Refresh button */}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800/60 border border-slate-700 hover:border-slate-600 transition-colors disabled:opacity-50"
            title={`Last refreshed: ${formatDateTime(lastRefresh)}`}
          >
            <RefreshCw size={14} className={`text-slate-400 ${loading ? "animate-spin" : ""}`} />
          </button>

          {/* System online */}
          <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <Radio size={14} className="text-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-emerald-400 hidden sm:inline">
              {t(language, "systemOnline")}
            </span>
          </div>

          {/* Language selector */}
          <div className="relative">
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800/60 border border-slate-700 hover:border-slate-600 cursor-pointer">
              <Globe size={14} className="text-slate-400" />
              <select
                value={language}
                onChange={(e) => onLanguageChange(e.target.value as Language)}
                className="bg-transparent text-xs text-slate-300 outline-none cursor-pointer"
              >
                <option value="en" className="bg-slate-800">EN</option>
                <option value="hi" className="bg-slate-800">हिं</option>
                <option value="as" className="bg-slate-800">অস</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

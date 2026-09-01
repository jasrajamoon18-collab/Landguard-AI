import type { RiskLevel } from "@/types";
import { riskColor } from "@/utils/risk";

interface RiskCardProps {
  level: RiskLevel;
  count: number;
  icon: React.ElementType;
}

export function RiskCard({ level, count, icon: Icon }: RiskCardProps) {
  const color = riskColor(level);

  return (
    <div
      className="relative overflow-hidden rounded-xl border bg-slate-900/60 p-4 sm:p-5 transition-all hover:scale-[1.02] hover:bg-slate-900/90"
      style={{ borderColor: color + "30" }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: color }}
      />
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-medium text-slate-400 tracking-wider">{level} RISK</div>
          <div className="mt-1 text-2xl sm:text-3xl font-bold" style={{ color }}>
            {count}
          </div>
          <div className="text-xs text-slate-500">Locations</div>
        </div>
        <div
          className="flex items-center justify-center w-12 h-12 rounded-lg shrink-0"
          style={{ backgroundColor: color + "15" }}
        >
          <Icon size={24} style={{ color }} />
        </div>
      </div>
    </div>
  );
}

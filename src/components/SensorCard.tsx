import { ArrowUp, ArrowDown, Minus } from "lucide-react";

interface SensorCardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: "up" | "down" | "stable";
  trendLabel?: string;
  icon: React.ElementType;
  color?: string;
}

export function SensorCard({ label, value, unit, trend, trendLabel, icon: Icon, color = "#06b6d4" }: SensorCardProps) {
  const TrendIcon = trend === "up" ? ArrowUp : trend === "down" ? ArrowDown : Minus;
  const trendColor =
    trend === "up" ? "text-red-400" : trend === "down" ? "text-emerald-400" : "text-slate-400";

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition-all hover:border-slate-700">
      <div className="flex items-center justify-between mb-3">
        <div
          className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0"
          style={{ backgroundColor: color + "15" }}
        >
          <Icon size={18} style={{ color }} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
            <TrendIcon size={12} />
            {trendLabel}
          </div>
        )}
      </div>
      <div className="text-xs text-slate-400 font-medium tracking-wide">{label}</div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-2xl font-bold text-slate-100">{value}</span>
        {unit && <span className="text-sm text-slate-500">{unit}</span>}
      </div>
    </div>
  );
}

import type { DataStatus } from "@/types";
import { t } from "@/data/translations";
import type { Language } from "@/types";

interface DataStatusBadgeProps {
  status: DataStatus;
  language?: Language;
  size?: "sm" | "md";
}

export function DataStatusBadge({ status, language = "en", size = "sm" }: DataStatusBadgeProps) {
  const config = {
    LIVE: { color: "bg-emerald-500", text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", label: t(language, "liveData") },
    FALLBACK: { color: "bg-yellow-500", text: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20", label: t(language, "fallbackData") },
    SIMULATION: { color: "bg-orange-500", text: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", label: t(language, "simulationMode") },
    ERROR: { color: "bg-red-500", text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", label: t(language, "errorData") },
  };

  const c = config[status];
  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${c.bg} ${c.border} ${c.text} ${sizeClass} font-medium`}>
      <span className={`w-2 h-2 rounded-full ${c.color} ${status === "LIVE" || status === "SIMULATION" ? "animate-pulse" : ""}`} />
      {c.label}
    </span>
  );
}

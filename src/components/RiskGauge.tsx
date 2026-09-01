interface RiskGaugeProps {
  score: number;
  size?: number;
  label?: string;
}

export function RiskGauge({ score, size = 200, label }: RiskGaugeProps) {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score > 75 ? "#ef4444" : score > 50 ? "#f97316" : score > 25 ? "#eab308" : "#22c55e";
  const level = score > 75 ? "CRITICAL" : score > 50 ? "HIGH" : score > 25 ? "MODERATE" : "LOW";

  return (
    <div className="flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1e293b"
          strokeWidth="12"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease, stroke 0.4s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center" style={{ width: size }}>
        <span className="text-4xl font-bold" style={{ color }}>
          {score}
        </span>
        <span className="text-sm text-slate-500 -mt-1">/ 100</span>
        <span className="mt-2 text-xs font-bold tracking-wider px-3 py-0.5 rounded-full" style={{ color, backgroundColor: color + "20" }}>
          {level}
        </span>
        {label && <span className="mt-1 text-[10px] text-slate-500">{label}</span>}
      </div>
    </div>
  );
}

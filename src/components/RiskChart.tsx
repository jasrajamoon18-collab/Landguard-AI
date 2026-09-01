import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const COLORS = {
  low: "#22c55e",
  moderate: "#eab308",
  high: "#f97316",
  critical: "#ef4444",
  cyan: "#06b6d4",
  blue: "#3b82f6",
  pink: "#ec4899",
};

const tooltipStyle = {
  backgroundColor: "#0f172a",
  border: "1px solid #1e293b",
  borderRadius: "8px",
  fontSize: "12px",
  color: "#e2e8f0",
};

const axisStyle = { fontSize: 11, fill: "#64748b" };

interface TrendChartProps {
  data: Array<Record<string, any>>;
  xKey: string;
  yKey: string;
  color?: string;
  unit?: string;
  height?: number;
}

export function TrendChart({ data, xKey, yKey, color = COLORS.cyan, unit = "", height = 250 }: TrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id={`grad-${yKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis dataKey={xKey} tick={axisStyle} axisLine={{ stroke: "#1e293b" }} />
        <YAxis tick={axisStyle} axisLine={{ stroke: "#1e293b" }} />
        <Tooltip contentStyle={tooltipStyle} />
        <Area
          type="monotone"
          dataKey={yKey}
          stroke={color}
          strokeWidth={2}
          fill={`url(#grad-${yKey})`}
          unit={unit}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

interface MultiLineChartProps {
  data: Array<Record<string, any>>;
  xKey: string;
  lines: { key: string; color: string; label: string }[];
  height?: number;
}

export function MultiLineChart({ data, xKey, lines, height = 250 }: MultiLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis dataKey={xKey} tick={axisStyle} axisLine={{ stroke: "#1e293b" }} />
        <YAxis tick={axisStyle} axisLine={{ stroke: "#1e293b" }} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
        {lines.map((l) => (
          <Line
            key={l.key}
            type="monotone"
            dataKey={l.key}
            stroke={l.color}
            strokeWidth={2}
            dot={false}
            name={l.label}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

interface SimpleBarChartProps {
  data: Array<Record<string, any>>;
  xKey: string;
  yKey: string;
  color?: string;
  height?: number;
  horizontal?: boolean;
}

export function SimpleBarChart({ data, xKey, yKey, color = COLORS.cyan, height = 250, horizontal = false }: SimpleBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout={horizontal ? "vertical" : "horizontal"}
        margin={{ top: 10, right: 10, left: horizontal ? 60 : -20, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        {horizontal ? (
          <>
            <XAxis type="number" tick={axisStyle} axisLine={{ stroke: "#1e293b" }} />
            <YAxis type="category" dataKey={xKey} tick={axisStyle} axisLine={{ stroke: "#1e293b" }} width={80} />
          </>
        ) : (
          <>
            <XAxis dataKey={xKey} tick={axisStyle} axisLine={{ stroke: "#1e293b" }} />
            <YAxis tick={axisStyle} axisLine={{ stroke: "#1e293b" }} />
          </>
        )}
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#1e293b40" }} />
        <Bar dataKey={yKey} fill={color} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

interface RiskPieChartProps {
  data: { name: string; value: number; color: string }[];
  height?: number;
}

export function RiskPieChart({ data, height = 250 }: RiskPieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 11, color: "#94a3b8" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

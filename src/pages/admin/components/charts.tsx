/* eslint-disable react-refresh/only-export-components */
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { aed } from "@/lib/adminTypes";

/** Brand-aligned chart palette drawn from the StyleSystem role scales. */
export const CHART_COLORS = [
  "oklch(var(--primary-500))",
  "oklch(var(--accent-500))",
  "oklch(var(--secondary-500))",
  "oklch(var(--background-300))",
  "oklch(var(--primary-700))",
  "oklch(var(--secondary-300))",
];

const tooltipStyle = {
  background: "oklch(var(--background-900))",
  border: "1px solid oklch(var(--background-200) / 0.5)",
  borderRadius: 12,
  fontSize: 12,
  color: "oklch(var(--foreground-950))",
  padding: "8px 12px",
};

const axisTick = { fill: "oklch(var(--foreground-500))", fontSize: 11 };

export interface NamedValue {
  name: string;
  value: number;
}

export interface TrendPoint {
  label: string;
  value: number;
}

function ChartEmpty() {
  return (
    <div className="h-[180px] flex flex-col items-center justify-center gap-2 text-foreground-500">
      <i className="ri-bar-chart-box-line text-2xl" aria-hidden="true"></i>
      <span className="text-sm">Not enough data yet</span>
    </div>
  );
}

/** Donut chart with an accessible side legend. */
export function DonutChart({ data }: { data: NamedValue[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (!total) return <ChartEmpty />;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <div className="w-full sm:w-1/2 h-[190px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={52} outerRadius={80} paddingAngle={2} stroke="none">
              {data.map((entry, i) => (
                <Cell key={entry.name} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="w-full sm:w-1/2 space-y-2">
        {data.map((d, i) => (
          <li key={d.name} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 text-foreground-700">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}></span>
              {d.name}
            </span>
            <span className="font-semibold text-foreground-950">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Soft area trend line, optionally formatted as currency. */
export function TrendChart({
  data,
  color = CHART_COLORS[0],
  currency = false,
}: {
  data: TrendPoint[];
  color?: string;
  currency?: boolean;
}) {
  const isEmpty = data.every((d) => d.value === 0);
  if (isEmpty) return <ChartEmpty />;

  return (
    <div className="h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--background-200) / 0.22)" vertical={false} />
          <XAxis dataKey="label" tick={axisTick} axisLine={false} tickLine={false} interval="preserveStartEnd" />
          <YAxis tick={axisTick} axisLine={false} tickLine={false} width={48} allowDecimals={false} />
          <Tooltip contentStyle={tooltipStyle} formatter={(value) => (currency ? aed(Number(value)) : value)} />
          <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2.5} fill={color} fillOpacity={0.22} dot={false} activeDot={{ r: 4 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Horizontal ranking bars, ideal for "most popular" lists. */
export function RankBarChart({ data }: { data: NamedValue[] }) {
  if (!data.length) return <ChartEmpty />;

  return (
    <div className="w-full" style={{ height: Math.max(180, data.length * 44) }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
          <XAxis type="number" tick={axisTick} axisLine={false} tickLine={false} allowDecimals={false} />
          <YAxis type="category" dataKey="name" tick={axisTick} axisLine={false} tickLine={false} width={130} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "oklch(var(--background-200) / 0.15)" }} />
          <Bar dataKey="value" fill={CHART_COLORS[0]} radius={[0, 6, 6, 0]} barSize={16} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
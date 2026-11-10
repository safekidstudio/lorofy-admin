import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { formatCompactNumber, formatMinutes, formatNumber } from "@/lib/format";
import type { ActivityPoint } from "@/types/api";

function activityLabel(value: string): string {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return `${date.getDate()}/${date.getMonth() + 1}`;
}

export function ActivityChart({ data }: { data: ActivityPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
      >
        <defs>
          <linearGradient id="active-users-fill" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--chart-1)"
              stopOpacity={0.35}
            />
            <stop
              offset="95%"
              stopColor="var(--chart-1)"
              stopOpacity={0.02}
            />
          </linearGradient>
          <linearGradient id="focus-minutes-fill" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--chart-2)"
              stopOpacity={0.2}
            />
            <stop
              offset="95%"
              stopColor="var(--chart-2)"
              stopOpacity={0.01}
            />
          </linearGradient>
        </defs>
        <CartesianGrid
          vertical={false}
          stroke="var(--border)"
          strokeDasharray="3 3"
        />
        <XAxis
          dataKey="date"
          tickFormatter={activityLabel}
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          minTickGap={18}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          width={44}
          tickFormatter={(value: number) => formatCompactNumber(value)}
        />
        <RechartsTooltip
          contentStyle={{
            borderRadius: 10,
            border: "1px solid var(--border)",
            background: "var(--popover)",
            color: "var(--popover-foreground)",
            fontSize: 12,
          }}
          labelFormatter={(label) =>
            `Date: ${activityLabel(String(label ?? ""))}`
          }
          formatter={(value, name) => {
            const numeric = Number(value ?? 0);
            return [
              name === "focusMinutes"
                ? formatMinutes(numeric)
                : formatNumber(numeric),
              name === "focusMinutes" ? "Focus Time" : "Active Users",
            ];
          }}
        />
        <Area
          type="monotone"
          dataKey="activeUsers"
          stroke="var(--chart-1)"
          strokeWidth={2}
          fill="url(#active-users-fill)"
        />
        <Area
          type="monotone"
          dataKey="focusMinutes"
          stroke="var(--chart-2)"
          strokeWidth={2}
          fill="url(#focus-minutes-fill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

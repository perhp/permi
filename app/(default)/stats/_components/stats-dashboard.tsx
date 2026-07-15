"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { RaspberryStat } from "@/models/raspberry-stat.model";
import { format } from "date-fns";
import { Activity, ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

type Props = {
  referenceTime: number;
  stats: RaspberryStat[];
};

type RangeKey = "6h" | "24h" | "7d";

type ChartPoint = {
  cpuTemperature: number | null;
  cpuUsage: number | null;
  diskTotal: number | null;
  diskUsed: number | null;
  memoryTotal: number | null;
  memoryUsed: number | null;
  recordedAt: string;
  timestamp: number;
  uptime: number | null;
};

type Series = {
  dataKey: keyof ChartPoint;
  stroke: string;
};

const RANGES: { label: string; milliseconds: number; value: RangeKey }[] = [
  { label: "6 hours", milliseconds: 6 * 60 * 60_000, value: "6h" },
  { label: "24 hours", milliseconds: 24 * 60 * 60_000, value: "24h" },
  { label: "7 days", milliseconds: 7 * 24 * 60 * 60_000, value: "7d" },
];

const cpuUsageConfig = {
  cpuUsage: { label: "CPU usage", color: "#2563eb" },
} satisfies ChartConfig;

const cpuTemperatureConfig = {
  cpuTemperature: { label: "CPU temperature", color: "#ef4444" },
} satisfies ChartConfig;

const memoryConfig = {
  memoryUsed: { label: "Used", color: "#7c3aed" },
  memoryTotal: { label: "Total", color: "#c4b5fd" },
} satisfies ChartConfig;

const diskConfig = {
  diskUsed: { label: "Used", color: "#0891b2" },
  diskTotal: { label: "Total", color: "#a5f3fc" },
} satisfies ChartConfig;

const uptimeConfig = {
  uptime: { label: "Uptime", color: "#16a34a" },
} satisfies ChartConfig;

function bytesToGiB(value: number | null) {
  return value === null ? null : Number((value / 1024 ** 3).toFixed(2));
}

function formatBytes(value: number | null) {
  if (value === null) return "Unavailable";
  return `${(value / 1024 ** 3).toFixed(1)} GiB`;
}

function formatUptime(value: number | null) {
  if (value === null) return "Unavailable";
  const totalHours = Math.floor(value / 3_600_000);
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  return days > 0 ? `${days}d ${hours}h` : `${hours}h`;
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-[#d9e4e3] px-4 py-5 first:border-t-0 sm:border-l sm:border-t-0 sm:first:border-l-0 lg:px-6">
      <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#5c6f76]">
        {label}
      </dt>
      <dd className="mt-2 text-xl font-semibold tracking-[-0.035em] text-[#10212b] lg:text-2xl">
        {value}
      </dd>
    </div>
  );
}

function MetricChart({
  config,
  data,
  description,
  range,
  series,
  title,
  unit,
}: {
  config: ChartConfig;
  data: ChartPoint[];
  description: string;
  range: RangeKey;
  series: Series[];
  title: string;
  unit: string;
}) {
  return (
    <Card className="rounded-2xl border-[#d9e4e3] shadow-none">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <ChartContainer config={config} className="h-64 w-full">
            <LineChart
              accessibilityLayer
              data={data}
              margin={{ left: 4, right: 12 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                axisLine={false}
                dataKey="timestamp"
                minTickGap={32}
                tickFormatter={(value) =>
                  format(new Date(value), range === "7d" ? "dd. MMM" : "HH:mm")
                }
                tickLine={false}
                tickMargin={10}
                type="number"
                domain={["dataMin", "dataMax"]}
              />
              <YAxis
                axisLine={false}
                tickFormatter={(value) => `${value}${unit}`}
                tickLine={false}
                width={48}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(_, payload) => {
                      const recordedAt = payload?.[0]?.payload?.recordedAt;
                      return recordedAt
                        ? format(new Date(recordedAt), "dd. MMM yyyy @ HH:mm")
                        : "";
                    }}
                  />
                }
              />
              {series.map((item) => (
                <Line
                  connectNulls={false}
                  dataKey={item.dataKey}
                  dot={false}
                  key={item.dataKey}
                  stroke={item.stroke}
                  strokeWidth={2}
                  type="monotone"
                />
              ))}
            </LineChart>
          </ChartContainer>
        ) : (
          <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            No samples in this time range.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function StatsDashboard({ referenceTime, stats }: Props) {
  const [range, setRange] = useState<RangeKey>("24h");
  const latest = stats.at(-1)!;
  const selectedRange = RANGES.find((item) => item.value === range)!;
  const data = useMemo(() => {
    const cutoff = referenceTime - selectedRange.milliseconds;

    return stats
      .filter((stat) => new Date(stat.recorded_at).getTime() >= cutoff)
      .map<ChartPoint>((stat) => ({
        cpuTemperature: stat.cpu_temperature_c,
        cpuUsage: stat.cpu_usage_percent,
        diskTotal: bytesToGiB(stat.disk_total_bytes),
        diskUsed: bytesToGiB(stat.disk_used_bytes),
        memoryTotal: bytesToGiB(stat.memory_total_bytes),
        memoryUsed: bytesToGiB(stat.memory_used_bytes),
        recordedAt: stat.recorded_at,
        timestamp: new Date(stat.recorded_at).getTime(),
        uptime:
          stat.uptime_ms === null
            ? null
            : Number((stat.uptime_ms / 3_600_000).toFixed(1)),
      }));
  }, [referenceTime, selectedRange.milliseconds, stats]);

  return (
    <div className="mt-8">
      <dl className="grid overflow-hidden rounded-2xl border border-[#d9e4e3] bg-white sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          label="CPU temperature"
          value={
            latest.cpu_temperature_c === null
              ? "Unavailable"
              : `${latest.cpu_temperature_c.toFixed(1)}°C`
          }
        />
        <StatCard
          label="CPU usage"
          value={
            latest.cpu_usage_percent === null
              ? "Unavailable"
              : `${latest.cpu_usage_percent.toFixed(1)}%`
          }
        />
        <StatCard
          label="Memory"
          value={`${formatBytes(latest.memory_used_bytes)} / ${formatBytes(
            latest.memory_total_bytes,
          )}`}
        />
        <StatCard
          label="Disk"
          value={`${formatBytes(latest.disk_used_bytes)} / ${formatBytes(
            latest.disk_total_bytes,
          )}`}
        />
        <StatCard label="Uptime" value={formatUptime(latest.uptime_ms)} />
      </dl>

      <details className="group mt-5 rounded-2xl border border-[#d9e4e3] bg-white">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-5 px-5 py-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#256a8a] sm:px-6 [&::-webkit-details-marker]:hidden">
          <span className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-[#e7efef] text-[#256a8a]">
              <Activity className="size-4" />
            </span>
            <span>
              <span className="block text-sm font-semibold">
                View telemetry history
              </span>
              <span className="mt-0.5 block text-xs text-[#5c6f76]">
                Last sample{" "}
                {format(new Date(latest.recorded_at), "dd MMM yyyy · HH:mm")}
              </span>
            </span>
          </span>
          <ChevronDown className="size-4 shrink-0 transition-transform group-open:rotate-180" />
        </summary>

        <div className="border-t border-[#d9e4e3] p-5 sm:p-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#5c6f76]">Choose a time range</p>
            <div className="flex flex-wrap gap-2" aria-label="Chart time range">
              {RANGES.map((item) => (
                <Button
                  key={item.value}
                  onClick={() => setRange(item.value)}
                  size="sm"
                  variant={range === item.value ? "default" : "outline"}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <MetricChart
              config={cpuUsageConfig}
              data={data}
              description="Average processor utilization per sample."
              range={range}
              series={[
                { dataKey: "cpuUsage", stroke: "var(--color-cpuUsage)" },
              ]}
              title="CPU usage"
              unit="%"
            />
            <MetricChart
              config={cpuTemperatureConfig}
              data={data}
              description="Processor temperature reported by the Raspberry Pi."
              range={range}
              series={[
                {
                  dataKey: "cpuTemperature",
                  stroke: "var(--color-cpuTemperature)",
                },
              ]}
              title="CPU temperature"
              unit="°C"
            />
            <MetricChart
              config={memoryConfig}
              data={data}
              description="Used memory compared with total installed memory."
              range={range}
              series={[
                { dataKey: "memoryUsed", stroke: "var(--color-memoryUsed)" },
                { dataKey: "memoryTotal", stroke: "var(--color-memoryTotal)" },
              ]}
              title="Memory"
              unit=" GiB"
            />
            <MetricChart
              config={diskConfig}
              data={data}
              description="Used space compared with total space on the monitored disk."
              range={range}
              series={[
                { dataKey: "diskUsed", stroke: "var(--color-diskUsed)" },
                { dataKey: "diskTotal", stroke: "var(--color-diskTotal)" },
              ]}
              title="Disk"
              unit=" GiB"
            />
            <div className="lg:col-span-2">
              <MetricChart
                config={uptimeConfig}
                data={data}
                description="Hours since the Raspberry Pi last restarted."
                range={range}
                series={[{ dataKey: "uptime", stroke: "var(--color-uptime)" }]}
                title="Uptime"
                unit="h"
              />
            </div>
          </div>
        </div>
      </details>
    </div>
  );
}

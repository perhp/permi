"use client";

import { Button } from "@/components/ui/button";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { RaspberryStat } from "@/models/raspberry-stat.model";
import { format } from "date-fns";
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

const SPARKLINE_WINDOW_MS = 6 * 60 * 60_000;

const cpuUsageConfig = {
  cpuUsage: { label: "CPU usage", color: "oklch(0.85 0.17 155)" },
} satisfies ChartConfig;

const cpuTemperatureConfig = {
  cpuTemperature: { label: "CPU temperature", color: "oklch(0.8 0.14 75)" },
} satisfies ChartConfig;

const memoryConfig = {
  memoryUsed: { label: "Used", color: "oklch(0.85 0.17 155)" },
  memoryTotal: { label: "Total", color: "oklch(0.45 0.03 240)" },
} satisfies ChartConfig;

const diskConfig = {
  diskUsed: { label: "Used", color: "oklch(0.8 0.1 220)" },
  diskTotal: { label: "Total", color: "oklch(0.45 0.03 240)" },
} satisfies ChartConfig;

function bytesToGiB(value: number | null) {
  return value === null ? null : Number((value / 1024 ** 3).toFixed(2));
}

function formatGiB(value: number | null) {
  if (value === null) return "—";
  return (value / 1024 ** 3).toFixed(1);
}

function formatUptime(value: number | null) {
  if (value === null) return "—";
  const totalHours = Math.floor(value / 3_600_000);
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  return days > 0 ? `${days}d ${hours}h` : `${hours}h`;
}

function buildTrace(values: number[]) {
  if (values.length === 0) return null;

  const points = values.length === 1 ? [values[0], values[0]] : values;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const pad = Math.max((max - min) * 0.15, 1e-6);
  const lo = min - pad;
  const hi = max + pad;

  const x0 = 6;
  const x1 = 314;
  const top = 14;
  const base = 90;

  const coordinates = points.map((value, index) => {
    const x = x0 + (x1 - x0) * (index / (points.length - 1));
    const fraction = Math.max(0, Math.min(1, (value - lo) / (hi - lo)));
    const y = base - fraction * (base - top);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const line = coordinates.join(" ");
  const area = `${x0},100 ${line} ${x1},100`;
  return { area, line };
}

function MetricSparkline({
  label,
  sub,
  trace,
  unit,
  value,
}: {
  label: string;
  sub: string;
  trace: { area: string; line: string } | null;
  unit: string;
  value: string;
}) {
  return (
    <div className="panel p-4.5 pb-3.5">
      <div className="mb-3 flex items-end justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </span>
        <span className="flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-bold leading-[0.9] text-bright">
            {value}
          </span>
          <span className="font-mono text-[10px] text-faint">{unit}</span>
        </span>
      </div>
      <div className="chart-grid overflow-hidden rounded-[3px] border border-rule">
        {trace ? (
          <svg
            viewBox="0 0 320 100"
            preserveAspectRatio="none"
            className="block h-[82px] w-full"
          >
            <polygon
              points={trace.area}
              fill="oklch(0.85 0.17 155 / 0.14)"
              stroke="none"
            />
            <polyline
              points={trace.line}
              fill="none"
              stroke="oklch(0.85 0.17 155)"
              strokeWidth="1.8"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <div className="flex h-[82px] items-center justify-center font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
            No data
          </div>
        )}
      </div>
      <div className="mt-2 flex justify-between font-mono text-[9px] uppercase tracking-[0.1em] text-faint">
        <span>-6H</span>
        <span>{sub}</span>
        <span>Now</span>
      </div>
    </div>
  );
}

function MetricChart({
  config,
  data,
  range,
  series,
  title,
  unit,
}: {
  config: ChartConfig;
  data: ChartPoint[];
  range: RangeKey;
  series: Series[];
  title: string;
  unit: string;
}) {
  return (
    <div className="panel p-4.5">
      <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        {title}
      </p>
      {data.length > 0 ? (
        <ChartContainer config={config} className="h-64 w-full">
          <LineChart
            accessibilityLayer
            data={data}
            margin={{ left: 4, right: 12 }}
          >
            <CartesianGrid stroke="var(--rule)" vertical={false} />
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
                strokeWidth={1.8}
                type="monotone"
              />
            ))}
          </LineChart>
        </ChartContainer>
      ) : (
        <div className="flex h-64 items-center justify-center font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
          No samples in this time range.
        </div>
      )}
    </div>
  );
}

function UptimeStrip({
  data,
  referenceTime,
  showHistory,
  onToggleHistory,
}: {
  data: ChartPoint[];
  onToggleHistory: () => void;
  referenceTime: number;
  showHistory: boolean;
}) {
  const validData = data.filter(
    (point): point is ChartPoint & { uptime: number } => point.uptime !== null,
  );

  const historyToggle = (
    <button
      type="button"
      onClick={onToggleHistory}
      aria-expanded={showHistory}
      className="rounded-[2px] border border-accent/40 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.12em] text-accent transition-colors hover:border-accent/70 hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      Telemetry history {showHistory ? "↑" : "→"}
    </button>
  );

  if (validData.length === 0) {
    return (
      <div className="panel mt-4.5 flex flex-wrap items-center justify-between gap-6 p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
          No uptime readings in the last 6 hours.
        </p>
        {historyToggle}
      </div>
    );
  }

  const windowStart = referenceTime - SPARKLINE_WINDOW_MS;
  const latest = validData.at(-1)!;
  const runStarted = latest.timestamp - latest.uptime;
  const restartEvents = validData.slice(1).flatMap((point, index) => {
    const previous = validData[index];
    if (point.uptime < previous.uptime - 6_000) {
      return [point.timestamp - point.uptime];
    }
    return [];
  });

  const positionFor = (timestamp: number) =>
    Math.min(
      100,
      Math.max(0, ((timestamp - windowStart) / SPARKLINE_WINDOW_MS) * 100),
    );

  return (
    <div className="panel mt-4.5 p-5">
      <div className="flex flex-wrap items-center justify-between gap-6 font-mono">
        <div className="flex flex-wrap gap-8">
          <div>
            <div className="text-[9px] uppercase tracking-[0.16em] text-faint">
              Uptime
            </div>
            <div className="mt-1 text-[17px] text-bright">
              {formatUptime(latest.uptime)}
            </div>
          </div>
          <div>
            <div className="text-[9px] uppercase tracking-[0.16em] text-faint">
              Run started
            </div>
            <div className="mt-1 text-[17px] text-bright">
              {format(new Date(runStarted), "dd MMM HH:mm").toUpperCase()}
            </div>
          </div>
          <div>
            <div className="text-[9px] uppercase tracking-[0.16em] text-faint">
              Restarts / win
            </div>
            <div
              className={`mt-1 text-[17px] ${restartEvents.length > 0 ? "text-warn" : "text-bright"}`}
            >
              {restartEvents.length}
            </div>
          </div>
        </div>
        {historyToggle}
      </div>
      <div className="mt-4">
        <div className="relative h-2.5 overflow-hidden rounded-[2px] bg-accent/80">
          {restartEvents.map((timestamp) => (
            <div
              key={timestamp}
              title={`Restart around ${format(new Date(timestamp), "dd MMM yyyy · HH:mm")}`}
              className="absolute inset-y-0 w-[2px] bg-warn"
              style={{ left: `${positionFor(timestamp)}%` }}
            />
          ))}
        </div>
        <div className="mt-1.5 flex justify-between font-mono text-[9px] uppercase tracking-[0.1em] text-faint">
          <span>{format(new Date(windowStart), "HH:mm")}</span>
          {restartEvents.length > 0 ? (
            <span className="text-warn">
              {format(new Date(restartEvents[0]), "HH:mm")} · RESTART
            </span>
          ) : (
            <span>NO RESTARTS</span>
          )}
          <span>{format(new Date(referenceTime), "HH:mm")}</span>
        </div>
      </div>
    </div>
  );
}

export default function StatsDashboard({ referenceTime, stats }: Props) {
  const [range, setRange] = useState<RangeKey>("24h");
  const [showHistory, setShowHistory] = useState(false);
  const latest = stats.at(-1)!;
  const selectedRange = RANGES.find((item) => item.value === range)!;

  const allPoints = useMemo(
    () =>
      stats.map<ChartPoint>((stat) => ({
        cpuTemperature: stat.cpu_temperature_c,
        cpuUsage: stat.cpu_usage_percent,
        diskTotal: bytesToGiB(stat.disk_total_bytes),
        diskUsed: bytesToGiB(stat.disk_used_bytes),
        memoryTotal: bytesToGiB(stat.memory_total_bytes),
        memoryUsed: bytesToGiB(stat.memory_used_bytes),
        recordedAt: stat.recorded_at,
        timestamp: new Date(stat.recorded_at).getTime(),
        uptime: stat.uptime_ms,
      })),
    [stats],
  );

  const sparklinePoints = useMemo(
    () =>
      allPoints.filter(
        (point) => point.timestamp >= referenceTime - SPARKLINE_WINDOW_MS,
      ),
    [allPoints, referenceTime],
  );

  const historyData = useMemo(() => {
    const cutoff = referenceTime - selectedRange.milliseconds;
    return allPoints
      .filter((point) => point.timestamp >= cutoff)
      .map((point) => ({
        ...point,
        uptime:
          point.uptime === null
            ? null
            : Number((point.uptime / 3_600_000).toFixed(1)),
      }));
  }, [allPoints, referenceTime, selectedRange.milliseconds]);

  const metrics = useMemo(() => {
    const values = (selector: (point: ChartPoint) => number | null) =>
      sparklinePoints
        .map(selector)
        .filter((value): value is number => value !== null);

    const usage = values((point) => point.cpuUsage);
    const temperature = values((point) => point.cpuTemperature);
    const memory = values((point) => point.memoryUsed);
    const disk = values((point) => point.diskUsed);

    return [
      {
        label: "CPU usage",
        sub: usage.length
          ? `PEAK ${Math.max(...usage).toFixed(0)}%`
          : "NO DATA",
        trace: buildTrace(usage),
        unit: "%",
        value:
          latest.cpu_usage_percent === null
            ? "—"
            : latest.cpu_usage_percent.toFixed(1),
      },
      {
        label: "CPU temp",
        sub: temperature.length
          ? `${Math.min(...temperature).toFixed(0)}–${Math.max(...temperature).toFixed(0)}°C`
          : "NO DATA",
        trace: buildTrace(temperature),
        unit: "°C",
        value:
          latest.cpu_temperature_c === null
            ? "—"
            : latest.cpu_temperature_c.toFixed(1),
      },
      {
        label: "Memory",
        sub: "USED",
        trace: buildTrace(memory),
        unit: `/ ${formatGiB(latest.memory_total_bytes)} GiB`,
        value: formatGiB(latest.memory_used_bytes),
      },
      {
        label: "Disk",
        sub: "USED",
        trace: buildTrace(disk),
        unit: `/ ${formatGiB(latest.disk_total_bytes)} GiB`,
        value: formatGiB(latest.disk_used_bytes),
      },
    ];
  }, [latest, sparklinePoints]);

  return (
    <div>
      <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricSparkline key={metric.label} {...metric} />
        ))}
      </div>

      <UptimeStrip
        data={sparklinePoints}
        onToggleHistory={() => setShowHistory((value) => !value)}
        referenceTime={referenceTime}
        showHistory={showHistory}
      />

      {showHistory && (
        <div className="mt-4.5">
          <div className="mb-4.5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Telemetry history · last sample{" "}
              {format(new Date(latest.recorded_at), "dd MMM yyyy · HH:mm")}
            </p>
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

          <div className="grid gap-4.5 lg:grid-cols-2">
            <MetricChart
              config={cpuUsageConfig}
              data={historyData}
              range={range}
              series={[
                { dataKey: "cpuUsage", stroke: "var(--color-cpuUsage)" },
              ]}
              title="CPU usage"
              unit="%"
            />
            <MetricChart
              config={cpuTemperatureConfig}
              data={historyData}
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
              data={historyData}
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
              data={historyData}
              range={range}
              series={[
                { dataKey: "diskUsed", stroke: "var(--color-diskUsed)" },
                { dataKey: "diskTotal", stroke: "var(--color-diskTotal)" },
              ]}
              title="Disk"
              unit=" GiB"
            />
          </div>
        </div>
      )}
    </div>
  );
}

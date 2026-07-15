import { createServiceClient } from "@/lib/supabase";
import { RaspberryStat } from "@/models/raspberry-stat.model";
import { subDays } from "date-fns";
import { Metadata } from "next";
import StatsDashboard from "./_components/stats-dashboard";

const PAGE_SIZE = 1_000;

export const metadata: Metadata = {
  title: "Station Stats | permi",
};

export const dynamic = "force-dynamic";

export default async function StatsPage() {
  const supabase = createServiceClient();
  const now = new Date();
  const cutoff = subDays(now, 7).toISOString();
  const stats: RaspberryStat[] = [];

  for (let offset = 0; ; offset += PAGE_SIZE) {
    const { data, error } = await supabase
      .from("raspberry_stats")
      .select(
        "id,recorded_at,cpu_temperature_c,cpu_usage_percent,memory_total_bytes,memory_used_bytes,disk_total_bytes,disk_used_bytes,uptime_ms",
      )
      .gte("recorded_at", cutoff)
      .order("recorded_at", { ascending: true })
      .range(offset, offset + PAGE_SIZE - 1);

    if (error) {
      console.error("Could not load Raspberry stats", error);
      throw new Error("Could not load Raspberry stats");
    }

    const page = (data ?? []) as RaspberryStat[];
    stats.push(...page);

    if (page.length < PAGE_SIZE) break;
  }

  return (
    <main className="container py-16">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-gray-500">
          Raspberry Pi health
        </p>
        <h1 className="text-4xl font-bold text-black">Station stats</h1>
        <p className="max-w-2xl text-gray-500">
          CPU, memory, disk, and uptime history from the receiving station.
        </p>
      </div>

      {stats.length > 0 ? (
        <StatsDashboard referenceTime={now.getTime()} stats={stats} />
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-gray-200 p-10 text-center text-gray-500">
          No Raspberry Pi statistics have been recorded yet.
        </div>
      )}
    </main>
  );
}

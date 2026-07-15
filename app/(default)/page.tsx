import { createServiceClient } from "@/lib/supabase";
import { RaspberryStat } from "@/models/raspberry-stat.model";
import { passQuery } from "@/queries/pass.query";
import { getImagesWithoutGraphs } from "@/utils/get-images-without-graphs";
import { subDays } from "date-fns";
import { Activity, RadioTower, ScanLine } from "lucide-react";
import { Metadata } from "next";
import LandingHero from "../_components/home/landing-hero";
import PassesList from "../_components/passes-list/passes-list";
import StatsDashboard from "./stats/_components/stats-dashboard";
import UpcomingPassesList from "./upcoming/_components/upcoming-passes-list";

const PAGE_SIZE = 1_000;

export const metadata: Metadata = {
  title: "Weather satellite passes | permi",
  description:
    "Weather images received from NOAA and Meteor satellites by a personal ground station in Denmark.",
};

export const revalidate = 15;

async function loadStats(cutoff: string) {
  const supabase = createServiceClient();
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

  return stats;
}

function getPrimaryImage(images: { id: number; path: string }[]) {
  if (images.length === 0) return null;

  return (
    images.find(
      (image) =>
        image.path.endsWith("221_composite.jpg") ||
        image.path.endsWith("MCIR.jpg") ||
        image.path.endsWith("221_corrected.jpg") ||
        image.path.endsWith("spread_221.jpg"),
    ) ?? images[0]
  );
}

function SectionHeading({
  description,
  icon: Icon,
  label,
  title,
}: {
  description: string;
  icon: typeof RadioTower;
  label: string;
  title: string;
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-[0.62fr_1.38fr] lg:items-end">
      <p className="flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#256a8a]">
        <Icon className="size-3.5" />
        {label}
      </p>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-4xl font-semibold tracking-[-0.055em] text-[#10212b] sm:text-5xl">
          {title}
        </h2>
        <p className="max-w-md text-sm leading-6 text-[#5c6f76] sm:text-right">
          {description}
        </p>
      </div>
    </div>
  );
}

export default async function Page() {
  const now = new Date();
  const supabase = createServiceClient();

  const [passesResult, upcomingResult, stats] = await Promise.all([
    supabase
      .from("passes")
      .select(passQuery)
      .order("pass_start", { ascending: false }),
    supabase
      .from("upcoming_passes")
      .select(
        "id,satellite_name,pass_start,pass_end,max_elevation,pass_start_azimuth,azimuth_at_max,direction",
      )
      .gt("pass_start", now.toISOString())
      .order("pass_start", { ascending: true }),
    loadStats(subDays(now, 7).toISOString()),
  ]);

  if (passesResult.error) {
    console.error("Could not load passes", passesResult.error);
    throw new Error("Could not load passes");
  }
  if (upcomingResult.error) {
    console.error("Could not load upcoming passes", upcomingResult.error);
    throw new Error("Could not load upcoming passes");
  }

  const passes = passesResult.data ?? [];
  const upcomingPasses = upcomingResult.data ?? [];

  if (passes.length === 0) {
    throw new Error("No passes found");
  }

  const latestPass = passes[0];
  const latestImages = getImagesWithoutGraphs(latestPass.images);
  const featuredImage = getPrimaryImage(latestImages);

  return (
    <>
      <LandingHero
        featuredImagePath={featuredImage?.path ?? null}
        latestPass={latestPass}
        latestStat={stats.at(-1) ?? null}
        nextPass={upcomingPasses[0] ?? null}
        now={now}
        passCount={passes.length}
      />

      <main>
        <section id="schedule" className="scroll-mt-20 py-20 sm:py-28">
          <div className="container">
            <SectionHeading
              description="The receiver wakes automatically for each window. Higher elevations usually mean a cleaner signal."
              icon={RadioTower}
              label="Flight plan"
              title="Next over the horizon"
            />
            {upcomingPasses.length > 0 ? (
              <UpcomingPassesList passes={upcomingPasses} />
            ) : (
              <div className="mt-10 rounded-2xl border border-dashed border-[#cbdada] p-10 text-center text-[#5c6f76]">
                No passes are scheduled yet. The archive remains available
                below.
              </div>
            )}
          </div>
        </section>

        <section
          id="passes"
          className="scroll-mt-20 border-y border-[#d9e4e3] bg-white py-20 sm:py-28"
        >
          <div className="container">
            <SectionHeading
              description={`${passes.length} received passes, newest first. Open a capture to explore every processed channel and signal graph.`}
              icon={ScanLine}
              label="Downlink archive"
              title="Earlier weather from orbit"
            />
            {passes.length > 1 ? (
              <PassesList passes={passes.slice(1)} />
            ) : (
              <p className="mt-10 text-sm text-[#5c6f76]">
                The latest downlink is featured above. Earlier captures will
                appear here.
              </p>
            )}
          </div>
        </section>

        <section id="station" className="scroll-mt-20 py-20 sm:py-28">
          <div className="container">
            <SectionHeading
              description="A concise readiness check for the Raspberry Pi. Historical charts stay close when diagnostics are needed."
              icon={Activity}
              label="Receiver health"
              title="Station telemetry"
            />
            {stats.length > 0 ? (
              <StatsDashboard referenceTime={now.getTime()} stats={stats} />
            ) : (
              <div className="mt-10 rounded-2xl border border-dashed border-[#cbdada] p-10 text-center text-[#5c6f76]">
                No station readings have been recorded yet.
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

import { createServiceClient } from "@/lib/supabase";
import { RaspberryStat } from "@/models/raspberry-stat.model";
import { passQuery } from "@/queries/pass.query";
import { subDays } from "date-fns";
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

function SectionHeading({
  label,
  meta,
  title,
}: {
  label: string;
  meta: string;
  title: string;
}) {
  return (
    <header className="mb-5 flex items-center gap-3.5 font-mono">
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
        [ {label} ]
      </p>
      <h2 className="text-[clamp(20px,3vw,26px)] font-bold tracking-[-0.01em] text-bright">
        {title}
      </h2>
      <span aria-hidden="true" className="h-px flex-1 bg-rule" />
      <p className="hidden text-[10px] uppercase text-faint sm:block">
        {meta}
      </p>
    </header>
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

  return (
    <>
      <LandingHero nextPass={upcomingPasses[0] ?? null} />

      <main>
        <section id="captures" className="scroll-mt-28 py-10">
          <div className="container">
            <SectionHeading
              label="Archive"
              meta={`${String(passes.length).padStart(2, "0")} FILES`}
              title="Recent captures"
            />
            <PassesList passes={passes} />
          </div>
        </section>

        <section id="schedule" className="scroll-mt-28 py-12">
          <div className="container">
            <SectionHeading
              label="Schedule"
              meta="AUTO-REC"
              title="Upcoming passes"
            />
            {upcomingPasses.length > 0 ? (
              <UpcomingPassesList passes={upcomingPasses} />
            ) : (
              <div className="panel border-dashed p-10 text-center text-sm text-body-muted">
                No passes are scheduled yet. The archive remains available
                above.
              </div>
            )}
          </div>
        </section>

        <section id="station" className="scroll-mt-28 py-12">
          <div className="container">
            <SectionHeading label="Receiver" meta="6H · RPi" title="Station health" />
            {stats.length > 0 ? (
              <StatsDashboard referenceTime={now.getTime()} stats={stats} />
            ) : (
              <div className="panel border-dashed p-10 text-center text-sm text-body-muted">
                No station readings have been recorded yet.
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

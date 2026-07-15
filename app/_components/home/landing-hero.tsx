import { CDN_URL } from "@/lib/cdn-url";
import { Pass } from "@/models/pass.model";
import { RaspberryStat } from "@/models/raspberry-stat.model";
import { UpcomingPass } from "@/models/upcoming-pass.model";
import { getSatelliteName } from "@/utils/get-satellite-name";
import { differenceInMinutes, format } from "date-fns";
import { ArrowDown, ArrowUpRight, Radio, Satellite } from "lucide-react";
import Link from "next/link";

type Props = {
  featuredImagePath: string | null;
  latestPass: Pass;
  latestStat: RaspberryStat | null;
  nextPass: UpcomingPass | null;
  now: Date;
  passCount: number;
};

function StationStatus({ latestStat, now }: Pick<Props, "latestStat" | "now">) {
  if (!latestStat) {
    return <span>No station readings yet</span>;
  }

  const minutesAgo = Math.max(
    0,
    differenceInMinutes(now, new Date(latestStat.recorded_at)),
  );
  const isReporting = minutesAgo < 20;

  return (
    <span className="flex items-center gap-2">
      <span
        className={`size-1.5 rounded-full ${isReporting ? "bg-[#2e7d5b]" : "bg-[#e8a735]"}`}
      />
      {isReporting ? "Station reporting" : `Last reading ${minutesAgo}m ago`}
    </span>
  );
}

export default function LandingHero({
  featuredImagePath,
  latestPass,
  latestStat,
  nextPass,
  now,
  passCount,
}: Props) {
  const satelliteName = getSatelliteName(latestPass);

  return (
    <section className="border-b border-[#d9e4e3]">
      <div className="container py-14 sm:py-20">
        <div className="max-w-3xl">
          <p className="flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#256a8a]">
            <Radio className="size-3.5" />A personal ground station in Denmark
          </p>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-0.055em] text-[#10212b] sm:text-6xl">
            I receive weather satellite images from home.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[#4e646b] sm:text-lg">
            I built this station with a Raspberry Pi and a homemade QFH antenna.
            It listens for passing NOAA and Meteor satellites, decodes their
            signals, and saves the images here.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1.55fr)_minmax(17rem,0.45fr)] lg:items-start lg:gap-14">
          <Link
            href={`/passes/${latestPass.id}`}
            className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#256a8a]"
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-[#10212b]">
              {featuredImagePath ? (
                <img
                  src={`${CDN_URL}/images/${featuredImagePath}?width=1200`}
                  alt={`Weather image received from ${satelliteName}`}
                  className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.01]"
                />
              ) : (
                <div className="flex size-full items-center justify-center text-white/60">
                  Image unavailable
                </div>
              )}
            </div>
            <div className="mt-4 flex items-start justify-between gap-5">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#5c6f76]">
                  Latest capture ·{" "}
                  {format(
                    new Date(latestPass.pass_start),
                    "dd MMM yyyy · HH:mm",
                  )}
                </p>
                <h2 className="mt-1.5 text-2xl font-semibold tracking-[-0.035em] text-[#10212b]">
                  {satelliteName}
                </h2>
                <p className="mt-1 text-sm text-[#5c6f76]">
                  {Number(latestPass.max_elevation).toFixed(0)}° elevation ·{" "}
                  {latestPass.direction}
                </p>
              </div>
              <ArrowUpRight className="mt-1 size-5 shrink-0 text-[#256a8a] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
          </Link>

          <aside className="border-y border-[#cbdada]">
            <div className="flex flex-wrap gap-x-5 gap-y-2 py-5 font-mono text-[10px] font-medium uppercase tracking-[0.15em] text-[#5c6f76]">
              <StationStatus latestStat={latestStat} now={now} />
              <span>{passCount} captures</span>
            </div>

            <div className="border-t border-[#d9e4e3] py-6">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5c6f76]">
                Next pass
              </p>
              {nextPass ? (
                <div className="mt-3">
                  <div className="flex items-center gap-3">
                    <Satellite className="size-4 text-[#256a8a]" />
                    <p className="text-xl font-semibold tracking-[-0.03em]">
                      {nextPass.satellite_name}
                    </p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#4e646b]">
                    {format(
                      new Date(nextPass.pass_start),
                      "EEEE, dd MMM · HH:mm",
                    )}
                    <br />
                    {Number(nextPass.max_elevation).toFixed(0)}° max elevation
                  </p>
                </div>
              ) : (
                <p className="mt-3 text-sm text-[#5c6f76]">Awaiting schedule</p>
              )}

              <Link
                href="#schedule"
                className="group mt-6 flex items-center gap-2 text-sm font-semibold text-[#256a8a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#256a8a]"
              >
                See upcoming passes
                <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

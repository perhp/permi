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
    <section className="relative overflow-hidden border-b border-[#cbdada] bg-[#e7efef]">
      <div className="pointer-events-none absolute -right-40 -top-72 size-[46rem] rounded-full border border-[#256a8a]/20 sm:-right-20" />
      <div className="pointer-events-none absolute -right-20 -top-52 size-[34rem] rounded-full border border-[#256a8a]/30 sm:right-12" />

      <div className="container relative grid min-h-[42rem] gap-10 py-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-stretch lg:gap-14 lg:py-14">
        <div className="flex flex-col justify-between gap-14 py-2 lg:py-7">
          <div>
            <div className="mb-9 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10px] font-medium uppercase tracking-[0.17em] text-[#4e646b]">
              <StationStatus latestStat={latestStat} now={now} />
              <span>{passCount} downlinks archived</span>
            </div>
            <p className="mb-4 flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#256a8a]">
              <Radio className="size-3.5" />
              Weather satellite ground station
            </p>
            <h1 className="max-w-xl text-[clamp(3.8rem,8vw,7.2rem)] font-semibold leading-[0.82] tracking-[-0.075em] text-[#10212b]">
              Weather,
              <br />
              received.
            </h1>
            <p className="mt-8 max-w-md text-base leading-7 text-[#4e646b] sm:text-lg">
              Live weather imagery captured from passing NOAA and Meteor
              satellites with a homemade antenna in Denmark.
            </p>
          </div>

          <div className="grid gap-5 border-t border-[#bfcfce] pt-6 sm:grid-cols-[1fr_auto] sm:items-end">
            {nextPass ? (
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5c6f76]">
                  Next acquisition
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <Satellite className="size-5 text-[#256a8a]" />
                  <p className="text-2xl font-semibold tracking-[-0.035em]">
                    {nextPass.satellite_name}
                  </p>
                </div>
                <p className="mt-1 pl-8 text-sm text-[#4e646b]">
                  {format(new Date(nextPass.pass_start), "EEE dd MMM · HH:mm")}{" "}
                  · {Number(nextPass.max_elevation).toFixed(0)}° max elevation
                </p>
              </div>
            ) : (
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5c6f76]">
                  Next acquisition
                </p>
                <p className="mt-2 text-lg font-semibold">Awaiting schedule</p>
              </div>
            )}
            <Link
              href="#schedule"
              className="group flex items-center gap-2 text-sm font-semibold text-[#256a8a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#256a8a]"
            >
              View flight plan
              <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
            </Link>
          </div>
        </div>

        <Link
          href={`/passes/${latestPass.id}`}
          className="group relative min-h-[30rem] overflow-hidden rounded-[1.75rem] bg-[#10212b] shadow-[0_24px_70px_-35px_rgba(16,33,43,0.65)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#256a8a] lg:min-h-full"
        >
          {featuredImagePath ? (
            <img
              src={`${CDN_URL}/images/${featuredImagePath}?width=1200`}
              alt={`Weather image received from ${satelliteName}`}
              className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.015]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white/60">
              Image unavailable
            </div>
          )}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,33,43,0.08)_40%,rgba(16,33,43,0.9)_100%)]" />
          <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/25 bg-[#10212b]/45 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md">
            <span className="size-1.5 rounded-full bg-[#8be0b7]" />
            Latest downlink
          </div>
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-white sm:p-8">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/70">
                {format(new Date(latestPass.pass_start), "dd MMM yyyy · HH:mm")}
              </p>
              <h2 className="mt-1 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                {satelliteName}
              </h2>
              <p className="mt-1 text-sm text-white/75">
                {Number(latestPass.max_elevation).toFixed(0)}° elevation ·{" "}
                {latestPass.direction}
              </p>
            </div>
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-[#10212b] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1">
              <ArrowUpRight className="size-5" />
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}

import { RaspberryStat } from "@/models/raspberry-stat.model";
import { UpcomingPass } from "@/models/upcoming-pass.model";
import { differenceInMinutes, format } from "date-fns";
import { ArrowDown, Radio, Satellite } from "lucide-react";
import Link from "next/link";

type Props = {
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
  latestStat,
  nextPass,
  now,
  passCount,
}: Props) {
  return (
    <section className="border-b border-[#d9e4e3]">
      <div className="container grid gap-10 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-center lg:gap-16">
        <div className="max-w-3xl">
          <p className="flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#256a8a]">
            <Radio className="size-3.5" />A personal ground station in Denmark
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.04] tracking-[-0.05em] text-[#10212b] sm:text-5xl">
            I receive weather satellite images from home.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#4e646b]">
            I built this station with a Raspberry Pi and a homemade QFH antenna.
            It automatically records passing NOAA and Meteor satellites and
            saves the decoded images here.
          </p>
        </div>

        <aside className="border-t border-[#cbdada] pt-5 lg:border-l lg:border-t-0 lg:py-2 lg:pl-8">
          <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] font-medium uppercase tracking-[0.15em] text-[#5c6f76]">
            <StationStatus latestStat={latestStat} now={now} />
            <span>{passCount} captures</span>
          </div>

          <div className="mt-5 border-t border-[#d9e4e3] pt-5">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5c6f76]">
              Next pass
            </p>
            {nextPass ? (
              <div className="mt-2.5">
                <div className="flex items-center gap-2.5">
                  <Satellite className="size-4 text-[#256a8a]" />
                  <p className="text-lg font-semibold tracking-[-0.025em]">
                    {nextPass.satellite_name}
                  </p>
                </div>
                <p className="mt-1.5 text-sm leading-6 text-[#4e646b]">
                  {format(new Date(nextPass.pass_start), "EEE, dd MMM · HH:mm")}{" "}
                  · {Number(nextPass.max_elevation).toFixed(0)}° peak
                </p>
              </div>
            ) : (
              <p className="mt-2.5 text-sm text-[#5c6f76]">Awaiting schedule</p>
            )}

            <Link
              href="#schedule"
              className="group mt-4 flex items-center gap-2 text-sm font-semibold text-[#256a8a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#256a8a]"
            >
              Upcoming passes
              <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}

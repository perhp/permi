import { createServiceClient } from "@/lib/supabase";
import { differenceInMinutes } from "date-fns";
import Link from "next/link";
import LastSampleBadge from "./last-sample-badge";
import { NavLink } from "./nav-link";

async function getLastSampleTime() {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("raspberry_stats")
      .select("recorded_at")
      .order("recorded_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    return data?.recorded_at ?? null;
  } catch {
    return null;
  }
}

export default async function Header() {
  const lastSample = await getLastSampleTime();
  const minutesAgo = lastSample ? Math.max(0, differenceInMinutes(new Date(), new Date(lastSample))) : null;
  const isReporting = minutesAgo !== null && minutesAgo < 20;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-panel-raised/90 backdrop-blur-md">
      <div className="container flex items-center justify-between gap-4 py-2.5 font-mono">
        <Link
          href="/"
          className="flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          <span className="text-base font-bold tracking-[0.14em]">PERMI</span>
          <span className="hidden border-l border-border pl-3 text-[10px] tracking-[0.24em] text-muted-foreground sm:inline">
            GND&nbsp;STATION
          </span>
        </Link>
        <nav>
          <ul className="flex items-center gap-4 text-[11px] uppercase tracking-[0.14em] sm:gap-5">
            <NavLink href="/#captures">Captures</NavLink>
            <NavLink href="/#schedule">Passes</NavLink>
            <NavLink href="/setup">Setup</NavLink>
            <NavLink href="https://github.com/perhp/permi" target="_blank">
              GitHub
            </NavLink>
          </ul>
        </nav>
      </div>
      <div className="border-t border-rule bg-panel-inset">
        <div className="container flex flex-wrap gap-x-5 gap-y-1 py-1.5 text-[10.5px] tracking-[0.08em] text-muted-foreground">
          {isReporting ? <span className="text-accent">● ONLINE</span> : <span className="text-warn">● STANDBY</span>}
          <span className="hidden sm:inline">LAT 55.67 N · LON 12.57 E</span>
          <span className="hidden md:inline">ANT QFH · 137MHZ</span>
          {lastSample && <LastSampleBadge lastSample={lastSample} />}
        </div>
      </div>
    </header>
  );
}

import { UpcomingPass } from "@/models/upcoming-pass.model";
import Link from "next/link";
import NextPassCard from "./next-pass-card";

type Props = {
  nextPass: UpcomingPass | null;
};

export default function LandingHero({ nextPass }: Props) {
  return (
    <section className="container flex flex-wrap items-center gap-12 pb-11 pt-15">
      <div className="min-w-[300px] flex-[1_1_460px]">
        <div className="mb-5 font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
          {"// personal ground station · denmark"}
        </div>
        <h1 className="mb-5 font-mono text-[clamp(34px,5vw,58px)] font-bold leading-[1.05] tracking-[-0.01em] text-[oklch(0.95_0.01_220)]">
          I receive weather
          <br />
          satellite images
          <br />
          <span className="text-accent">from home.</span>
        </h1>
        <p className="mb-7 max-w-[52ch] text-sm leading-[1.75] text-body-muted [text-wrap:pretty]">
          Built with a Raspberry Pi and a homemade QFH antenna. It
          automatically records passing NOAA and Meteor satellites and decodes
          the images here — fully autonomous, 24/7.
        </p>
        <div className="flex flex-wrap items-center gap-3.5">
          <Link
            href="/#captures"
            className="inline-flex items-center gap-2.5 rounded-[2px] bg-accent px-5.5 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.1em] text-accent-foreground shadow-[0_0_22px_oklch(0.85_0.17_155/0.35)] transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            View captures →
          </Link>
          <Link
            href="/#schedule"
            className="inline-flex items-center gap-2.5 rounded-[2px] border border-border px-5.5 py-[13px] font-mono text-xs uppercase tracking-[0.1em] text-nav transition-colors hover:border-accent/60 hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            Upcoming passes
          </Link>
        </div>
      </div>

      {nextPass ? (
        <NextPassCard pass={nextPass} />
      ) : (
        <div className="panel min-w-75 flex-[0_1_460px] p-7">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Next pass
          </div>
          <p className="text-sm text-body-muted">Awaiting schedule.</p>
        </div>
      )}
    </section>
  );
}

"use client";

import { UpcomingPass } from "@/models/upcoming-pass.model";
import { format } from "date-fns";
import PolarPlot from "../polar-plot";
import CountdownBadge from "./countdown-badge";

function formatDegrees(value: number) {
  return Number(value).toFixed(0);
}

// The pass track is symmetric about its peak, so the exit azimuth is the
// entry azimuth mirrored across the azimuth at max elevation.
function estimateExitAzimuth(startAzimuth: number, peakAzimuth: number) {
  return (((2 * peakAzimuth - startAzimuth) % 360) + 360) % 360;
}

function Readout({ label, value, highlight = false }: {
  highlight?: boolean;
  label: string;
  value: string;
}) {
  return (
    <div className="font-mono">
      <div className="text-[8.5px] uppercase tracking-[0.16em] text-faint">
        {label}
      </div>
      <div className={`text-[15px] ${highlight ? "text-accent" : ""}`}>
        {value}
      </div>
    </div>
  );
}

export default function NextPassCard({ pass }: { pass: UpcomingPass }) {
  return (
    <div className="panel min-w-[300px] flex-[0_1_380px] p-5.5">
      <div className="mb-4 flex items-center justify-between font-mono">
        <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Next pass
        </span>
        <CountdownBadge passEnd={pass.pass_end} passStart={pass.pass_start} />
      </div>
      <div className="flex flex-wrap items-center gap-5">
        <PolarPlot
          endAzimuth={estimateExitAzimuth(
            Number(pass.pass_start_azimuth),
            Number(pass.azimuth_at_max),
          )}
          maxElevation={Number(pass.max_elevation)}
          peakAzimuth={Number(pass.azimuth_at_max)}
          startAzimuth={Number(pass.pass_start_azimuth)}
        />
        <div className="min-w-40 flex-1">
          <div className="font-mono text-[17px] font-bold text-bright">
            {pass.satellite_name}
          </div>
          <div className="mb-3.5 text-[11px] text-muted-foreground">
            {format(new Date(pass.pass_start), "EEE, dd MMM")} ·{" "}
            {pass.direction}
          </div>
          <div className="grid grid-cols-2 gap-x-3.5 gap-y-2.5">
            <Readout
              label="AOS"
              value={format(new Date(pass.pass_start), "HH:mm")}
            />
            <Readout
              label="LOS"
              value={format(new Date(pass.pass_end), "HH:mm")}
            />
            <Readout
              highlight
              label="Peak"
              value={`${formatDegrees(pass.max_elevation)}°`}
            />
            <Readout
              label="Az"
              value={`${formatDegrees(pass.pass_start_azimuth)}→${formatDegrees(pass.azimuth_at_max)}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

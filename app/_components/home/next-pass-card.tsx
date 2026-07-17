"use client";

import { UpcomingPass } from "@/models/upcoming-pass.model";
import { estimateExitAzimuth } from "@/utils/estimate-exit-azimuth";
import { format } from "date-fns";
import PolarPlot from "../polar-plot";
import CountdownBadge from "./countdown-badge";

function formatDegrees(value: number) {
  return Number(value).toFixed(0);
}

function Readout({ label, value, highlight = false }: {
  highlight?: boolean;
  label: string;
  value: string;
}) {
  return (
    <div className="font-mono">
      <div className="text-[9.5px] uppercase tracking-[0.16em] text-faint">
        {label}
      </div>
      <div className={`text-[17px] ${highlight ? "text-accent" : ""}`}>
        {value}
      </div>
    </div>
  );
}

export default function NextPassCard({ pass }: { pass: UpcomingPass }) {
  return (
    <div className="panel min-w-75 flex-[0_1_460px] p-7">
      <div className="mb-5 flex items-center justify-between font-mono">
        <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          Next pass
        </span>
        <CountdownBadge passEnd={pass.pass_end} passStart={pass.pass_start} />
      </div>
      <div className="flex flex-wrap items-center gap-6">
        <PolarPlot
          size={180}
          endAzimuth={estimateExitAzimuth(
            Number(pass.pass_start_azimuth),
            Number(pass.azimuth_at_max),
          )}
          maxElevation={Number(pass.max_elevation)}
          peakAzimuth={Number(pass.azimuth_at_max)}
          startAzimuth={Number(pass.pass_start_azimuth)}
        />
        <div className="min-w-40 flex-1">
          <div className="font-mono text-[19px] font-bold text-bright">
            {pass.satellite_name}
          </div>
          <div className="mb-4 text-xs text-muted-foreground">
            {format(new Date(pass.pass_start), "EEE, dd MMM")} ·{" "}
            {pass.direction}
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
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

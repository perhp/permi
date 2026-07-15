"use client";

import { cn } from "@/lib/utils";
import { UpcomingPass } from "@/models/upcoming-pass.model";
import { format } from "date-fns";
import { useState } from "react";

type Props = {
  passes: UpcomingPass[];
};

const VISIBLE_COUNT = 5;
const GRID_COLUMNS =
  "grid grid-cols-[48px_1.6fr_1.3fr_1.2fr_0.7fr_1fr] items-center gap-3 px-5";

function formatDegrees(value: number) {
  return `${Number(value).toFixed(0)}°`;
}

function peakColorClass(peak: number) {
  if (peak >= 70) return "text-accent";
  if (peak >= 50) return "text-nav";
  return "text-muted-foreground";
}

function PassRow({ pass, position }: { pass: UpcomingPass; position: number }) {
  return (
    <li
      className={cn(
        GRID_COLUMNS,
        "border-b border-border-soft py-3.5",
        position % 2 === 0 ? "bg-panel" : "bg-panel-alt",
      )}
    >
      <span className="font-mono text-xs text-accent">
        {String(position + 1).padStart(2, "0")}
      </span>
      <span>
        <span className="font-mono text-[13px] font-bold text-bright">
          {pass.satellite_name}
        </span>
        <span className="mt-0.5 block text-[9.5px] uppercase tracking-[0.1em] text-faint">
          {pass.direction}
        </span>
      </span>
      <span className="text-xs text-[oklch(0.68_0.015_228)]">
        {format(new Date(pass.pass_start), "EEE, dd MMM")}
      </span>
      <span className="font-mono text-xs text-[oklch(0.8_0.012_225)]">
        {format(new Date(pass.pass_start), "HH:mm")}–
        {format(new Date(pass.pass_end), "HH:mm")}
      </span>
      <span
        className={cn(
          "font-mono text-[12.5px] font-bold",
          peakColorClass(Number(pass.max_elevation)),
        )}
      >
        {formatDegrees(pass.max_elevation)}
      </span>
      <span className="text-right font-mono text-[11px] text-muted-foreground">
        {formatDegrees(pass.pass_start_azimuth)}→
        {formatDegrees(pass.azimuth_at_max)}
      </span>
    </li>
  );
}

export default function UpcomingPassesList({ passes }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const visiblePasses = isExpanded ? passes : passes.slice(0, VISIBLE_COUNT);
  const hiddenCount = passes.length - VISIBLE_COUNT;

  return (
    <div className="panel overflow-x-auto">
      <div className="min-w-[640px]">
        <div
          className={cn(
            GRID_COLUMNS,
            "border-b border-border py-2.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-faint",
          )}
        >
          <span>#</span>
          <span>Satellite</span>
          <span>Date</span>
          <span>Window</span>
          <span>Peak</span>
          <span className="text-right">Azimuth</span>
        </div>
        <ol>
          {visiblePasses.map((pass, index) => (
            <PassRow key={pass.id} pass={pass} position={index} />
          ))}
        </ol>
        {hiddenCount > 0 && (
          <button
            type="button"
            onClick={() => setIsExpanded((expanded) => !expanded)}
            className="w-full px-5 py-3 text-center font-mono text-[10.5px] uppercase tracking-[0.14em] text-accent transition-colors hover:text-accent-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
          >
            {isExpanded
              ? "− Collapse schedule"
              : `+ ${hiddenCount} later ${hiddenCount === 1 ? "pass" : "passes"}`}
          </button>
        )}
      </div>
    </div>
  );
}

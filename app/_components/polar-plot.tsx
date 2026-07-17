import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  endAzimuth?: number | null;
  maxElevation: number;
  peakAzimuth: number;
  peakLabel?: boolean;
  size?: number;
  startAzimuth?: number | null;
};

function polarPoint(azimuthDegrees: number, elevationDegrees: number) {
  const azimuthRadians = (azimuthDegrees * Math.PI) / 180;
  const radius = ((90 - elevationDegrees) / 90) * 44;
  return {
    x: 50 + radius * Math.sin(azimuthRadians),
    y: 50 - radius * Math.cos(azimuthRadians),
  };
}

function polarPosition(azimuthDegrees: number, elevationDegrees: number) {
  const { x, y } = polarPoint(azimuthDegrees, elevationDegrees);
  return { left: `${x}%`, top: `${y}%` };
}

export default function PolarPlot({
  className,
  endAzimuth = null,
  maxElevation,
  peakAzimuth,
  peakLabel = false,
  size = 150,
  startAzimuth = null,
}: Props) {
  const peak = polarPosition(Number(peakAzimuth), Number(maxElevation));
  const start =
    startAzimuth === null ? null : polarPosition(Number(startAzimuth), 0);
  const end = endAzimuth === null ? null : polarPosition(Number(endAzimuth), 0);

  // Quadratic Bézier from entry to exit whose midpoint (t = 0.5) lands
  // exactly on the peak, approximating the sky track.
  let track: string | null = null;
  if (startAzimuth !== null && endAzimuth !== null) {
    const entry = polarPoint(Number(startAzimuth), 0);
    const apex = polarPoint(Number(peakAzimuth), Number(maxElevation));
    const exit = polarPoint(Number(endAzimuth), 0);
    const controlX = 2 * apex.x - (entry.x + exit.x) / 2;
    const controlY = 2 * apex.y - (entry.y + exit.y) / 2;
    track = `M ${entry.x} ${entry.y} Q ${controlX} ${controlY} ${exit.x} ${exit.y}`;
  }

  const compassLabel =
    "absolute font-mono text-[8px] text-faint pointer-events-none";

  return (
    <div
      className={cn(
        "relative flex-none rounded-full border border-border bg-[radial-gradient(circle,oklch(0.22_0.015_255),oklch(0.16_0.013_255))]",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-[16%] rounded-full border border-rule" />
      <div className="absolute inset-[33%] rounded-full border border-rule" />
      <div className="absolute inset-y-1.5 left-1/2 w-px -translate-x-1/2 bg-rule" />
      <div className="absolute inset-x-1.5 top-1/2 h-px -translate-y-1/2 bg-rule" />
      <span className={`${compassLabel} left-1/2 top-[3px] -translate-x-1/2`}>
        N
      </span>
      <span
        className={`${compassLabel} bottom-[3px] left-1/2 -translate-x-1/2`}
      >
        S
      </span>
      <span className={`${compassLabel} left-[3px] top-1/2 -translate-y-1/2`}>
        W
      </span>
      <span className={`${compassLabel} right-[3px] top-1/2 -translate-y-1/2`}>
        E
      </span>
      {track && (
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 size-full"
          viewBox="0 0 100 100"
        >
          <path
            d={track}
            fill="none"
            opacity="0.55"
            stroke="var(--accent)"
            strokeDasharray="3 3"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      )}
      {start && (
        <div
          className="absolute size-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[oklch(0.6_0.12_155)]"
          style={start}
          title={`Acquisition of signal at ${Number(startAzimuth).toFixed(0)}° azimuth`}
        />
      )}
      {end && (
        <div
          className="absolute size-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[oklch(0.55_0.13_25)]"
          style={end}
          title={`Loss of signal near ${Number(endAzimuth).toFixed(0)}° azimuth`}
        />
      )}
      <div
        className="absolute size-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_12px_var(--accent)]"
        style={peak}
        title={`Peak: ${Number(maxElevation).toFixed(0)}° elevation at ${Number(peakAzimuth).toFixed(0)}° azimuth`}
      />
      {peakLabel && (
        <span
          className="absolute translate-x-[10px] translate-y-[-18px] font-mono text-[9px] text-accent"
          style={peak}
        >
          {Number(maxElevation).toFixed(0)}°
        </span>
      )}
    </div>
  );
}

"use client";

import PolarPlot from "@/app/_components/polar-plot";
import { CDN_URL } from "@/lib/cdn-url";
import { cn } from "@/lib/utils";
import { Pass as PassModel } from "@/models/pass.model";
import { getImagesOfGraphs } from "@/utils/get-images-of-graphs";
import { getImagesWithoutGraphs } from "@/utils/get-images-without-graphs";
import { getPassImageName } from "@/utils/get-pass-image-name";
import { getSatelliteName } from "@/utils/get-satellite-name";
import { format } from "date-fns";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { RemoveScrollBar } from "react-remove-scroll-bar";

type PassImage = PassModel["images"][number];

type Props = {
  pass: PassModel;
};

const GRAPH_TITLES: [string, string][] = [
  ["polar-azel", "Azimuth / Elevation"],
  ["polar-direction", "Ground direction"],
  ["spectrogram", "Spectrogram"],
  ["histogram", "Histogram"],
];

function getGraphTitle(path: string) {
  return (
    GRAPH_TITLES.find(([needle]) => path.includes(needle))?.[1] ?? "Graph"
  );
}

function splitChannelName(imageName: string) {
  const [channel, ...modeParts] = imageName.trim().split(/\s+/);
  return {
    channel: (channel ?? "").toUpperCase(),
    mode: modeParts.join(" "),
  };
}

function StatCell({
  highlight = false,
  label,
  value,
}: {
  highlight?: boolean;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-panel px-4 py-3.5">
      <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-faint">
        {label}
      </div>
      <div
        className={cn(
          "mt-1 font-mono text-xl",
          highlight ? "text-accent" : "text-bright",
        )}
      >
        {value}
      </div>
    </div>
  );
}

function SectionHeading({ meta, label, title }: {
  label: string;
  meta?: string;
  title: string;
}) {
  return (
    <div className="mb-5 flex items-center gap-3.5 font-mono">
      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
        [ {label} ]
      </span>
      <h2 className="text-[clamp(20px,3vw,26px)] font-bold tracking-[-0.01em] text-bright">
        {title}
      </h2>
      <span aria-hidden="true" className="h-px flex-1 bg-rule" />
      {meta && (
        <span className="hidden text-[10px] uppercase text-faint sm:block">
          {meta}
        </span>
      )}
    </div>
  );
}

export default function Pass({ pass }: Props) {
  const {
    images,
    gain,
    pass_start,
    direction,
    azimuth_at_max,
    max_elevation,
    pass_start_azimuth,
  } = pass;

  const satelliteName = getSatelliteName(pass);
  const channelImages = getImagesWithoutGraphs(images);
  const graphImages = getImagesOfGraphs(images);

  const [activeImage, setActiveImage] = useState<PassImage | null>(null);

  return (
    <>
      <section className="pb-10 pt-1">
        <Link
          href="/#captures"
          className="mb-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-body-muted transition-colors hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          ← Back to archive
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-10">
          <div className="min-w-[300px] flex-[1_1_480px]">
            <div className="mb-3.5 font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
              {"// pass log · "}
              {format(new Date(pass_start), "dd MMM yyyy").toLowerCase()}
            </div>
            <h1 className="mb-1.5 font-mono text-[clamp(32px,5vw,52px)] font-bold leading-[1.02] tracking-[-0.02em] text-[oklch(0.95_0.01_220)]">
              {satelliteName}
            </h1>
            <div className="mb-6 font-mono text-sm text-muted-foreground">
              {format(new Date(pass_start), "dd MMM @ HH:mm")}
              {direction ? ` · ${direction}` : ""}
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-px overflow-hidden rounded-md border border-border bg-border">
              <StatCell highlight label="Gain" value={String(gain)} />
              <StatCell
                label="Max elev"
                value={`${Number(max_elevation).toFixed(0)}°`}
              />
              <StatCell
                label="Az start"
                value={`${Number(pass_start_azimuth).toFixed(0)}°`}
              />
              <StatCell
                label="Az max"
                value={`${Number(azimuth_at_max).toFixed(0)}°`}
              />
            </div>
          </div>

          <PolarPlot
            className="mx-auto sm:mx-0"
            maxElevation={Number(max_elevation)}
            peakAzimuth={Number(azimuth_at_max)}
            peakLabel
            size={200}
            startAzimuth={Number(pass_start_azimuth)}
          />
        </div>
      </section>

      <section className="pb-5">
        <SectionHeading
          label="Channels"
          meta={`${String(channelImages.length).padStart(2, "0")} OUTPUTS`}
          title="Processed imagery"
        />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4.5">
          {channelImages.map((image) => {
            const { channel, mode } = splitChannelName(
              getPassImageName(image.path, pass),
            );

            return (
              <button
                key={image.id}
                type="button"
                onClick={() => setActiveImage(image)}
                className="panel group overflow-hidden text-left transition-colors hover:border-accent/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <div className="relative h-[400px] border-b border-border bg-panel-inset">
                  <span className="absolute inset-0 m-auto size-fit font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                    loading…
                  </span>
                  <img
                    src={`${CDN_URL}/images/${image.path}?width=700`}
                    alt={`${satelliteName} ${channel} ${mode}`.trim()}
                    loading="lazy"
                    className="absolute inset-0 size-full object-contain"
                  />
                  <span className="absolute left-2.5 top-2.5 z-[2] rounded-[2px] bg-background/85 px-1.5 py-[3px] font-mono text-[9px] uppercase tracking-[0.14em] text-accent">
                    {channel}
                    {mode ? ` · ${mode.slice(0, 4)}` : ""}
                  </span>
                </div>
                <div className="flex items-center justify-between px-4 py-3 font-mono">
                  <span className="text-[13px] font-bold text-bright">
                    {channel}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.1em] text-faint">
                    {mode || "Raw"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {graphImages.length > 0 && (
        <section className="pb-5 pt-11">
          <SectionHeading label="Tracking" title="Pass geometry" />
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4.5">
            {graphImages.map((image) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setActiveImage(image)}
                className="panel group overflow-hidden text-left transition-colors hover:border-accent/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <div className="relative h-[360px] border-b border-border bg-panel-inset">
                  <span className="absolute inset-0 m-auto size-fit font-mono text-[9px] uppercase tracking-[0.14em] text-faint">
                    loading…
                  </span>
                  <img
                    src={`${CDN_URL}/images/${image.path}?width=700`}
                    alt={getGraphTitle(image.path)}
                    loading="lazy"
                    className="absolute inset-0 size-full object-contain"
                  />
                </div>
                <div className="px-4 py-3 font-mono text-[13px] font-bold text-bright">
                  {getGraphTitle(image.path)}
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      <AnimatePresence>
        {activeImage && (
          <>
            <motion.div
              animate={{ scale: 1, opacity: 1 }}
              initial={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setActiveImage(null)}
              className="fixed left-0 top-0 z-50 flex h-screen w-full items-center justify-center bg-background/80 p-5 backdrop-blur-sm"
            >
              <motion.img
                animate={{ scale: 1 }}
                initial={{ scale: 0.9 }}
                exit={{ scale: 0.9 }}
                transition={{ duration: 0.1 }}
                src={`${CDN_URL}/images/${activeImage.path}`}
                alt={activeImage.path.split(".")[0].replace("-", " ")}
                className="max-h-full select-none rounded-[3px] border border-border object-contain"
              />
            </motion.div>
            <RemoveScrollBar />
          </>
        )}
      </AnimatePresence>
    </>
  );
}

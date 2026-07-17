"use client";

import { CDN_URL } from "@/lib/cdn-url";
import { Pass } from "@/models/pass.model";
import { getImagesWithoutGraphs } from "@/utils/get-images-without-graphs";
import { getSatelliteName } from "@/utils/get-satellite-name";
import { format } from "date-fns";
import { AnimatePresence, motion } from "motion/react";
import { Eye } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { RemoveScrollBar } from "react-remove-scroll-bar";

type Props = {
  collapsedCount?: number;
  passes: Pass[];
};

export default function PassesList({ collapsedCount, passes }: Props) {
  const [activePass, setActivePass] = useState<Pass | null>(null);
  const [showAll, setShowAll] = useState(false);

  const isCollapsed =
    collapsedCount !== undefined && !showAll && passes.length > collapsedCount;
  const visiblePasses = isCollapsed ? passes.slice(0, collapsedCount) : passes;

  const getImage = (images: Pass["images"]) => {
    if (!images || images.length === 0) return null;
    return (
      images.find(
        (image) =>
          image.path.endsWith("221_composite.jpg") ||
          image.path.endsWith("MCIR.jpg") ||
          image.path.endsWith("221_corrected.jpg") ||
          image.path.endsWith("spread_221.jpg"),
      ) || images[0]
    );
  };

  const activePassImage = activePass
    ? getImage(getImagesWithoutGraphs(activePass.images))
    : null;

  return (
    <>
      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visiblePasses.map((pass) => {
          const satelliteName = getSatelliteName(pass);
          const imagesWithoutGraphs = getImagesWithoutGraphs(pass.images);
          const image = getImage(imagesWithoutGraphs);

          return (
            <motion.li key={pass.id} className="group relative">
              <div className="panel overflow-hidden transition-colors group-hover:border-accent/50">
                <Link
                  href={`/passes/${pass.id}`}
                  className="relative block aspect-[16/10] border-b border-border focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-accent"
                >
                  <div className="absolute inset-0 m-auto size-5 animate-spin rounded-full border-2 border-accent/20 border-l-accent border-t-accent" />
                  {image && (
                    <img
                      src={`${CDN_URL}/images/${image.path}?width=500`}
                      alt={image.path.split(".")[0].replace("-", " ")}
                      className="relative z-10 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
                    />
                  )}
                  <span className="absolute left-3 top-3 z-20 bg-background/70 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-accent backdrop-blur-sm">
                    {String(imagesWithoutGraphs.length).padStart(2, "0")} IMG ·{" "}
                    {pass.direction || "PASS"}
                  </span>
                </Link>
                <div className="flex items-baseline justify-between gap-3 px-4.5 py-3.5 font-mono">
                  <span className="truncate text-sm font-bold text-bright">
                    {satelliteName}
                  </span>
                  <span className="shrink-0 text-[11px] text-faint">
                    {format(new Date(pass.pass_start), "dd MMM · HH:mm").toUpperCase()}
                  </span>
                </div>
              </div>
              <button
                type="button"
                aria-label={`Quick view of ${satelliteName}`}
                onClick={() => setActivePass(pass)}
                className="absolute right-3 top-3 z-20 flex size-8 items-center justify-center rounded-[3px] border border-border bg-background/60 text-nav backdrop-blur-sm transition-colors hover:border-accent/60 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100"
              >
                <Eye className="size-4" />
              </button>
            </motion.li>
          );
        })}
      </ul>
      {isCollapsed && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="panel mt-5 w-full border-dashed py-3.5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:border-accent/50 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Show all {passes.length} passes
        </button>
      )}
      <AnimatePresence>
        {activePass && (
          <>
            <motion.div
              animate={{ scale: 1, opacity: 1 }}
              initial={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setActivePass(null)}
              className="fixed left-0 top-0 z-50 flex h-screen w-full items-center justify-center bg-background/80 p-5 backdrop-blur-sm"
            >
              <div className="absolute z-0 inset-0 m-auto bg-panel size-12 p-1 rounded-full">
                <div className="size-10 rounded-full border-8 border-accent border-b-accent/25 animate-spin" />
              </div>
              {activePassImage ? (
                <motion.img
                  animate={{ scale: 1 }}
                  initial={{ scale: 0.9 }}
                  exit={{ scale: 0.9 }}
                  transition={{ duration: 0.1 }}
                  src={`${CDN_URL}/images/${activePassImage.path}`}
                  alt={activePassImage.path.split(".")[0].replace("-", " ")}
                  className="z-20 mb-3 max-h-full select-none rounded-[3px] border border-border object-contain"
                />
              ) : (
                <p>No image available</p>
              )}
            </motion.div>
            <RemoveScrollBar />
          </>
        )}
      </AnimatePresence>
    </>
  );
}

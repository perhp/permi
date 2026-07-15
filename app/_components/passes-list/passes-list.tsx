"use client";

import { CDN_URL } from "@/lib/cdn-url";
import { Pass } from "@/models/pass.model";
import { getImagesWithoutGraphs } from "@/utils/get-images-without-graphs";
import { getSatelliteName } from "@/utils/get-satellite-name";
import { format } from "date-fns";
import { AnimatePresence, motion } from "motion/react";
import { Eye, MoveUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { RemoveScrollBar } from "react-remove-scroll-bar";

type Props = {
  passes: Pass[];
};

export default function PassesList({ passes }: Props) {
  const [activePass, setActivePass] = useState<Pass | null>(null);

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
      <ul className="mt-10 grid grid-cols-1 gap-x-5 gap-y-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {passes.map((pass) => {
          const satelliteName = getSatelliteName(pass);
          const imagesWithoutGraphs = getImagesWithoutGraphs(pass.images);
          const image = getImage(imagesWithoutGraphs);

          return (
            <motion.li key={pass.id} className="group">
              <div className="relative overflow-hidden rounded-2xl bg-[#10212b] shadow-[0_14px_45px_-32px_rgba(16,33,43,0.75)] transition-shadow hover:shadow-[0_20px_55px_-30px_rgba(16,33,43,0.75)]">
                <Link
                  href={`/passes/${pass.id}`}
                  className="relative block aspect-[4/5] focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white"
                >
                  <div className="absolute inset-0 m-auto size-5 animate-spin rounded-full border-2 border-white/25 border-l-white border-t-white" />
                  {image && (
                    <img
                      src={`${CDN_URL}/images/${image.path}?width=500`}
                      alt={image.path.split(".")[0].replace("-", " ")}
                      className="relative z-10 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
                    />
                  )}
                  <div className="absolute inset-0 z-10 bg-[linear-gradient(180deg,transparent_48%,rgba(16,33,43,0.88)_100%)]" />
                  <div className="absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-4 p-5 text-white">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/65">
                        {format(
                          new Date(pass.pass_start),
                          "dd MMM yyyy · HH:mm",
                        )}
                      </p>
                      <h3 className="mt-1 text-2xl font-semibold tracking-[-0.035em]">
                        {satelliteName}
                      </h3>
                    </div>
                    <MoveUpRight className="mb-1 size-4 shrink-0 text-white/70 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                </Link>
                <button
                  type="button"
                  aria-label={`Quick view of ${satelliteName}`}
                  onClick={() => setActivePass(pass)}
                  className="absolute right-4 top-4 z-20 flex size-9 items-center justify-center rounded-full border border-white/20 bg-[#10212b]/45 text-white opacity-100 backdrop-blur-md transition-colors hover:bg-[#10212b]/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100"
                >
                  <Eye className="size-4" />
                </button>
              </div>
            </motion.li>
          );
        })}
      </ul>
      <AnimatePresence>
        {activePass && (
          <>
            <motion.div
              animate={{ scale: 1, opacity: 1 }}
              initial={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setActivePass(null)}
              className="fixed left-0 top-0 z-50 flex h-screen w-full items-center justify-center bg-[#10212b]/75 p-5 backdrop-blur-sm"
            >
              <div className="absolute z-0 inset-0 m-auto bg-black/50 size-12 p-1 rounded-full">
                <div className="size-10 rounded-full border-8 border-white border-b-white/25 animate-spin" />
              </div>
              {activePassImage ? (
                <motion.img
                  animate={{ scale: 1 }}
                  initial={{ scale: 0.9 }}
                  exit={{ scale: 0.9 }}
                  transition={{ duration: 0.1 }}
                  src={`${CDN_URL}/images/${activePassImage.path}`}
                  alt={activePassImage.path.split(".")[0].replace("-", " ")}
                  className="z-20 mb-3 max-h-full select-none rounded-lg object-contain"
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

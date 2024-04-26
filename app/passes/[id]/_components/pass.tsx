"use client";

import { Badge } from "@/components/ui/badge";
import { CDN_URL } from "@/lib/cdn-url";
import { cn } from "@/lib/utils";
import { Pass as PassModel } from "@/models/pass.model";
import { getImagesOfGraphs } from "@/utils/get-images-of-graphs";
import { getImagesWithoutGraphs } from "@/utils/get-images-without-graphs";
import { getPassImageName } from "@/utils/get-pass-image-name";
import { getSatelitteName } from "@/utils/get-satellite-name";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { RemoveScrollBar } from "react-remove-scroll-bar";

interface EnrichedPass extends PassModel {
  images: (PassModel["images"][number] & {
    is_graph: boolean;
  })[];
}

type Props = {
  pass: PassModel;
};

export default function Pass({ pass }: Props) {
  const { images, gain, pass_start, direction, azimuth_at_max, max_elevation } = pass;

  const satelliteName = getSatelitteName(pass);
  const imagesWithoutGraphs: EnrichedPass["images"] = getImagesWithoutGraphs(images).map((image: any) => ({
    ...image,
    is_graph: false,
  }));
  const imagesOfGraphs: EnrichedPass["images"] = getImagesOfGraphs(images).map((image: any) => ({ ...image, is_graph: true }));

  const [activeImage, setActiveImage] = useState<EnrichedPass["images"][number] | null>(null);

  const selectActiveImage = (image: EnrichedPass["images"][number]) => () => {
    setActiveImage(image);
  };

  const deselectActiveImage = () => () => {
    setActiveImage(null);
  };

  return (
    <>
      <div className="flex flex-col gap-2 md:gap-5 md:flex-row">
        <h1 className="text-sm font-medium text-gray-500">
          {format(pass_start, "dd. MMM @ HH:mm")} <br />
          <span className="text-4xl font-bold text-black">{satelliteName}</span>
        </h1>
        <Badge variant="outline" className="mt-auto mb-[6px] w-min whitespace-nowrap bg-white">
          {gain} gain
        </Badge>
        {direction && (
          <Badge variant="outline" className="mt-auto mb-[6px] w-min whitespace-nowrap bg-white">
            {direction}
          </Badge>
        )}
        {azimuth_at_max && (
          <Badge variant="outline" className="mt-auto mb-[6px] w-min whitespace-nowrap bg-white">
            {azimuth_at_max}° azimuth
          </Badge>
        )}
        {max_elevation && (
          <Badge variant="outline" className="mt-auto mb-[6px] w-min whitespace-nowrap bg-white">
            {max_elevation}° max elevation
          </Badge>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-5">
        {[...imagesWithoutGraphs, ...imagesOfGraphs]
          .sort((a, b) => getPassImageName(a.path, pass).localeCompare(getPassImageName(b.path, pass)))
          .map((image) => (
            <button key={image.id} onClick={selectActiveImage(image)} className="relative flex h-96">
              <div className="absolute inset-0 bg-gray-100 -z-10 animate-pulse rounded-lg" />
              <img
                src={`${CDN_URL}/images/${image?.path}`}
                alt={image.path.split(".")[0].replace("-", " ")}
                className={cn("rounded-lg mb-3 w-full h-full object-cover", image.is_graph && "mix-blend-multiply")}
              />
              {!image.is_graph && <Badge className="absolute z-10 top-3 left-3 capitalize">{getPassImageName(image.path, pass)}</Badge>}
            </button>
          ))}
      </div>
      <AnimatePresence>
        {activeImage && (
          <>
            <motion.div
              animate={{ scale: 1, opacity: 1 }}
              initial={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={deselectActiveImage()}
              className="fixed flex items-center justify-center w-full h-screen bg-white/20 z-20 top-0 left-0 p-5 backdrop-blur-sm"
            >
              <motion.img
                animate={{ scale: 1 }}
                initial={{ scale: 0.9 }}
                exit={{ scale: 0.9 }}
                transition={{ duration: 0.1 }}
                src={`${CDN_URL}/images/${activeImage?.path}`}
                alt={activeImage.path.split(".")[0].replace("-", " ")}
                className="rounded-lg mb-3 max-h-full select-none"
              />
            </motion.div>
            <RemoveScrollBar />
          </>
        )}
      </AnimatePresence>
    </>
  );
}

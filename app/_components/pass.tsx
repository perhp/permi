"use client";

import { Badge } from "@/components/ui/badge";
import { CDN_URL } from "@/lib/cdn-url";
import { cn } from "@/lib/utils";
import { Pass } from "@/models/pass.model";
import { format } from "date-fns";
import { useState } from "react";

const graphs = ["spectrogram", "polar-direction", "polar-azel", "histogram"];

interface EnrichedPass extends Pass {
  images: (Pass["images"][number] & {
    is_graph: boolean;
  })[];
}

type Props = {
  pass: Pass;
};

export default function Pass({ pass }: Props) {
  const { images, gain, pass_start, is_noaa } = pass;
  const [satelliteIdentifier, satelitteNumber] = images[0].path.split("-");

  const satelliteName = is_noaa ? `${satelliteIdentifier} ${satelitteNumber}` : "Meteor M2-3";
  const imagesWithoutGraphs: EnrichedPass["images"] = images
    .filter((image: any) => !graphs.some((graph) => image.path.includes(graph)))
    .map((image: any) => ({ ...image, is_graph: false }));
  const imagesOfGraphs: EnrichedPass["images"] = images
    .filter((image: any) => graphs.some((graph) => image.path.includes(graph)))
    .map((image: any) => ({ ...image, is_graph: true }));

  const [activeImage, setActiveImage] = useState<EnrichedPass["images"][number] | null>(null);

  const selectActiveImage = (image: EnrichedPass["images"][number]) => () => {
    setActiveImage(image);
    document.body.classList.add("overflow-hidden");
  };

  const deselectActiveImage = () => () => {
    setActiveImage(null);
    document.body.classList.remove("overflow-hidden");
  };

  return (
    <>
      <div className="flex gap-5">
        <h1 className="text-sm font-medium text-gray-500">
          {format(pass_start, "dd. MMM @ HH:mm")} <br />
          <span className="text-4xl font-bold text-black">{satelliteName}</span>
        </h1>
        <Badge variant="outline" className="mt-auto mb-[6px]">
          Gain {gain}
        </Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-5">
        {[...imagesWithoutGraphs, ...imagesOfGraphs]
          .sort((a, b) => +b.created_at - +a.created_at)
          .map((image) => (
            <button key={image.id} onClick={selectActiveImage(image)} className="relative flex flex-col">
              <img
                src={`${CDN_URL}/images/${image?.path}`}
                alt={image.path.split(".")[0].replace("-", " ")}
                className={cn("rounded-lg mb-3", image.is_graph && "mix-blend-multiply")}
              />
              {!image.is_graph && (
                <Badge className="absolute z-10 top-3 left-3 capitalize">
                  {image.path
                    .replace(/(.jpg)|(.png)/g, "")
                    .split("-")
                    .slice(4)
                    .join(" ")}
                </Badge>
              )}
            </button>
          ))}
      </div>
      {activeImage && (
        <div
          onClick={deselectActiveImage()}
          className="fixed flex items-center justify-center w-full h-screen bg-black/20 z-20 top-0 left-0 p-5"
        >
          <img
            src={`${CDN_URL}/images/${activeImage?.path}`}
            alt={activeImage.path.split(".")[0].replace("-", " ")}
            className="rounded-lg mb-3 max-h-full"
          />
        </div>
      )}
    </>
  );
}

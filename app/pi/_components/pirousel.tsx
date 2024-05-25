"use client";

import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { CDN_URL } from "@/lib/cdn-url";
import { Pass } from "@/models/pass.model";
import { getSatelitteName } from "@/utils/get-satellite-name";
import { format } from "date-fns";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  latestPass: Pass;
};

export const revalidate = 0;
export default function Pirousel({ latestPass }: Props) {
  const router = useRouter();
  const [carousel, setCarousel] = useState<CarouselApi>();

  useEffect(() => {
    const refresh = setInterval(() => {
      router.refresh();
    }, 30000);

    return () => clearInterval(refresh);
  }, []);

  const satelliteName = getSatelitteName(latestPass);

  const next = () => {
    carousel?.scrollNext();
  };

  const previous = () => {
    carousel?.scrollPrev();
  };

  return (
    <>
      <Carousel
        setApi={setCarousel}
        opts={{
          loop: true,
          duration: 100,
        }}
        plugins={[Autoplay({ delay: 30000 })]}
        className="fixed inset-0 bg-black z-10"
      >
        <CarouselContent>
          {latestPass.images.map((image) => (
            <CarouselItem key={image.id} className="flex justify-center">
              <img src={`${CDN_URL}/images/${image.path}`} alt={image.path} className="object-contain h-screen" />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="fixed z-20 bottom-5 inset-x-5 border text-white border-white/5 bg-white/5 rounded-lg backdrop-blur">
        <div className="border-b border-white/5 py-3 flex">
          <button onClick={previous} className="h-full flex items-center p-3">
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          <div className="flex flex-col w-full items-center">
            <p className="text-white/60 text-xs">{format(latestPass.pass_start, "dd. MMM @ HH:mm")}</p>
            <p className="font-medium">{satelliteName}</p>
          </div>
          <button onClick={next} className="h-full flex items-center p-3">
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
        <div className="flex">
          <Link
            href={{ pathname: "/pi", query: { series: "noaa" } }}
            className="font-light text-xs flex-1 p-3 border-r border-white/5 text-center"
          >
            Latest NOAA
          </Link>
          <Link
            href={{ pathname: "/pi", query: { series: "meteor" } }}
            className="border-r border-white/5 font-light text-xs flex-1 p-3 text-center"
          >
            Latest Meteor
          </Link>
          <Link href={{ pathname: "/pi" }} className="font-light text-xs flex-1 p-3 text-center">
            Latest pass
          </Link>
        </div>
      </div>
    </>
  );
}

"use client";

import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { CDN_URL } from "@/lib/cdn-url";
import { cn } from "@/lib/utils";
import { Pass } from "@/models/pass.model";
import { getPassImageName } from "@/utils/get-pass-image-name";
import { getSatelitteName } from "@/utils/get-satellite-name";
import { format } from "date-fns";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeftIcon, ChevronRightIcon, RefreshCwIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { SatelliteSeries } from "../_enums/series";

type Props = {
  latestPass: Pass;
};

export const revalidate = 0;
export default function Pirousel({ latestPass }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const refresh = setInterval(() => {
      router.refresh();
    }, 30000);

    return () => clearInterval(refresh);
  }, []);

  const satelliteName = getSatelitteName(latestPass);

  const currentSeries = searchParams.get("series") as SatelliteSeries;
  const currentPage = Number(searchParams.get("page")) || 1;

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <>
      <Carousel
        opts={{
          loop: true,
          duration: 100,
        }}
        plugins={[Autoplay({ delay: 30000 })]}
        className="fixed inset-0 bg-black z-10"
      >
        <CarouselContent>
          {latestPass.images.map((image) => (
            <CarouselItem key={image.id} className="relative flex justify-center items-center">
              <img src={`${CDN_URL}/images/${image.path}`} alt={image.path} className="object-contain h-screen" />
              <Badge className="absolute top-5 left-5 bg-white/5 border border-white/5 backdrop-blur">
                {getPassImageName(image.path, latestPass)}
              </Badge>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <button onClick={handleRefresh} className="fixed top-5 right-5 p-3 rounded-lg border border-white/5 bg-white/5 z-20 backdrop-blur">
        <RefreshCwIcon className="w-4 h-4 text-white" />
      </button>
      <div className="fixed z-20 bottom-5 inset-x-5 border text-white border-white/5 bg-white/5 rounded-lg backdrop-blur">
        <div className="border-b border-white/5 py-3 flex">
          <Link
            href={{ pathname: "/pi", query: { ...(currentSeries && { series: currentSeries }), page: Math.max(1, currentPage - 1) } }}
            className="h-full flex items-center p-3"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </Link>
          <div className="flex flex-col w-full items-center">
            <p className="text-white/60 text-xs">{format(latestPass.pass_start, "dd. MMM @ HH:mm")}</p>
            <p className="font-medium">{satelliteName}</p>
          </div>
          <Link
            href={{ pathname: "/pi", query: { ...(currentSeries && { series: currentSeries }), page: currentPage + 1 } }}
            className="h-full flex items-center p-3"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex">
          <Link
            href={{ pathname: "/pi" }}
            className={cn(
              !searchParams.get("series") && "bg-white/10",
              "font-light text-xs flex-1 p-3 border-r border-white/5 text-center"
            )}
          >
            Either
          </Link>
          <Link
            href={{ pathname: "/pi", query: { page: 1, series: SatelliteSeries.NOAA } }}
            className={cn(
              searchParams.get("series") === SatelliteSeries.NOAA && "bg-white/10",
              "font-light text-xs flex-1 p-3 border-r border-white/5 text-center"
            )}
          >
            NOAA
          </Link>
          <Link
            href={{ pathname: "/pi", query: { page: 1, series: "meteor" } }}
            className={cn(
              searchParams.get("series") === SatelliteSeries.METEOR && "bg-white/10",
              "font-light text-xs flex-1 p-3 text-center"
            )}
          >
            Meteor
          </Link>
        </div>
      </div>
    </>
  );
}

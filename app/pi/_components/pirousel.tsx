"use client";

import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { CDN_URL } from "@/lib/cdn-url";
import { Pass } from "@/models/pass.model";
import { getSatelitteName } from "@/utils/get-satellite-name";
import { format } from "date-fns";
import Autoplay from "embla-carousel-autoplay";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
  latestPass: Pass;
};

export default function Pirousel({ latestPass }: Props) {
  const router = useRouter();

  useEffect(() => {
    const refresh = setInterval(() => {
      router.refresh();
    }, 30000);

    return () => clearInterval(refresh);
  }, []);

  const satelliteName = getSatelitteName(latestPass);

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
            <CarouselItem key={image.id} className="flex justify-center">
              <img src={`${CDN_URL}/images/${image.path}`} alt={image.path} className="object-contain h-screen" />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="fixed z-20 bottom-5 inset-x-5 border text-white p-5 border-white/5 bg-white/5 rounded-lg backdrop-blur">
        <p className="text-white/60 text-sm">{format(latestPass.pass_start, "dd. MMM @ HH:mm")}</p>
        <p className="text-lg font-medium">{satelliteName}</p>
      </div>
    </>
  );
}

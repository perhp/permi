"use client";

import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { CDN_URL } from "@/lib/cdn-url";
import { Pass } from "@/models/pass.model";
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

  return (
    <Carousel
      opts={{
        loop: true,
        duration: 100,
      }}
      plugins={[Autoplay({ delay: 30000 })]}
      className="fixed inset-0 bg-black"
    >
      <CarouselContent>
        {latestPass.images.map((image) => (
          <CarouselItem key={image.id} className="flex justify-center">
            <img src={`${CDN_URL}/images/${image.path}`} alt={image.path} className="object-contain h-screen" />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

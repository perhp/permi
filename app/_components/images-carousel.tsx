"use client";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { CDN_URL } from "@/lib/cdn-url";

type Props = {
  images: {
    id: string;
    path: string;
  }[];
};

export default function ImagesCarousel({ images }: Props) {
  return (
    <Carousel className="w-full h-full [&>div]:flex [&>div]:h-full">
      <CarouselContent className="h-full">
        {images.map((image) => (
          <CarouselItem key={image.id} className="h-full">
            <img
              src={`${CDN_URL}/images/${image.path}`}
              alt={image.path.replace(".jpg", "").split("-").join(" ")}
              className="h-full rounded-2xl"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-5" />
      <CarouselNext className="right-5" />
    </Carousel>
  );
}

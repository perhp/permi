"use client";

import { useWindowSize } from "@/hooks/useWindowSize";
import { cn } from "@/lib/utils";

export const Meteors = ({ number }: { number?: number }) => {
  const { width } = useWindowSize();
  const meteors = new Array(number || 20).fill(null);

  const windowWidth = width || 0;

  return meteors.map((_, index) => (
    <span
      key={index}
      className={cn(
        "animate-meteor-effect absolute top-1/2 left-1/2 h-0.5 w-0.5 rounded-[9999px] bg-gray-200 shadow-[0_0_0_1px_#ffffff10] rotate-[215deg] -z-10",
        "before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-[50%] before:w-[50px] before:h-[1px] before:bg-gradient-to-r before:from-gray-300 before:to-transparent"
      )}
      style={{
        top: 0,
        left: Math.floor(Math.random() * (windowWidth - -windowWidth) + -windowWidth) + "px",
        animationDelay: Math.random() * (0.8 - 0.2) + 0.2 + "s",
        animationDuration: Math.floor(Math.random() * (10 - 2) + 2) + "s",
      }}
    ></span>
  ));
};

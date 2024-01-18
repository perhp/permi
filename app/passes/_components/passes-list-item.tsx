"use client";

import { CDN_URL } from "@/lib/cdn-url";
import { Pass } from "@/models/pass.model";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Props = {
  pass: Pass;
};

export default function PassesListItem({ pass }: Props) {
  const [satelliteIdentifier, satelitteNumber] = pass.images[0].path.split("-");
  const satelliteName = pass.is_noaa ? `${satelliteIdentifier} ${satelitteNumber}` : "Meteor M2-3";
  const [imageIndex, setImageIndex] = useState<number>(0);

  return (
    <li key={pass.id}>
      <Link href={`/passes/${pass.id}`} className="flex flex-col">
        <div className="relative flex h-96">
          <Image
            src={`${CDN_URL}/images/${pass.images[imageIndex]!.path}`}
            alt={pass.images[0]!.path.split(".")[0].replace("-", " ")}
            width={300}
            height={300}
            className="w-full h-full object-cover rounded-xl"
          />
          <div className="flex absolute inset-0">
            {pass.images.map((image, i) => (
              <div key={image.id} onMouseEnter={() => setImageIndex(i)} className="h-full w-full" />
            ))}
          </div>
        </div>
        <p className="text-2xl font-bold ml-2 text-black mt-2">{satelliteName}</p>
        <p className="text-sm -mt-1 ml-2">{format(pass.pass_start, "dd. MMM @ HH:mm")}</p>
      </Link>
    </li>
  );
}

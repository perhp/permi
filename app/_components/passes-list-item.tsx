"use client";

import { CDN_URL } from "@/lib/cdn-url";
import { Pass } from "@/models/pass.model";
import { getImagesWithoutGraphs } from "@/utils/get-images-without-graphs";
import { getSatelitteName } from "@/utils/get-satellite-name";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";

type Props = {
  pass: Pass;
};

export default function PassesListItem({ pass }: Props) {
  const satelliteName = getSatelitteName(pass);
  const imagesWithoutGraphs = getImagesWithoutGraphs(pass.images);

  return (
    <li key={pass.id}>
      <Link href={`/passes/${pass.id}`} className="flex flex-col">
        <div className="flex h-52 md:h-72 lg:h-80 bg-black rounded-xl relative">
          <div className="w-5 h-5 rounded-full border-t-2 border-l-2 border-t-white border-l-white border-r-2 border-b-2 border-r-white border-b-white/25 animate-spin absolute z-0 inset-0 m-auto" />
          <Image
            src={`${CDN_URL}/images/${imagesWithoutGraphs[0].path}`}
            alt={pass.images[0]!.path.split(".")[0].replace("-", " ")}
            width={300}
            height={300}
            className="w-full h-full object-cover rounded-xl relative z-10"
          />
        </div>
        <p className="text-2xl font-bold ml-2 text-black mt-2">{satelliteName}</p>
        <p className="text-sm -mt-1 ml-2">{format(pass.pass_start, "dd. MMM @ HH:mm")}</p>
      </Link>
    </li>
  );
}

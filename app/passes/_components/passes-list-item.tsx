"use client";

import { Pass } from "@/models/pass.model";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

type Props = {
  pass: Pass;
};

export default function PassesListItem({ pass }: Props) {
  const [satelliteIdentifier, satelitteNumber] = pass.images[0].path.split("-");
  const satelliteName = pass.is_noaa ? `${satelliteIdentifier} ${satelitteNumber}` : "Meteor M2-3";

  return (
    <li key={pass.id}>
      <Link
        href={`/passes/${pass.id}`}
        className="flex justify-between border border-gray-100 p-5 text-sm font-medium text-gray-500 items-center rounded-xl"
      >
        <p>
          <span className="text-4xl font-bold text-black">{satelliteName}</span> <br />
          {format(pass.pass_start, "dd. MMM @ HH:mm")}
        </p>
        <ArrowRight className="w-7 h-7" />
      </Link>
    </li>
  );
}

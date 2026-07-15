"use client";

import { UpcomingPass } from "@/models/upcoming-pass.model";
import { format } from "date-fns";
import { Clock3, Compass, Satellite, TrendingUp } from "lucide-react";

type Props = {
  passes: UpcomingPass[];
};

function formatDegrees(value: number) {
  return `${Number(value).toFixed(0)}\u00b0`;
}

export default function UpcomingPassesList({ passes }: Props) {
  return (
    <ul className="mt-8 divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      {passes.map((pass) => (
        <li
          key={pass.id}
          className="grid gap-6 p-5 md:grid-cols-[minmax(12rem,1.2fr)_2fr] md:items-center md:p-6"
        >
          <div className="flex items-center gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-black text-white">
              <Satellite className="size-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-black">
                {pass.satellite_name}
              </h2>
              <p className="text-sm text-gray-500">{pass.direction}</p>
            </div>
          </div>

          <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 xl:grid-cols-4">
            <div className="flex gap-3">
              <Clock3 className="mt-0.5 size-4 shrink-0 text-gray-400" />
              <div>
                <dt className="font-medium text-gray-500">Start</dt>
                <dd className="font-semibold text-black">
                  <time dateTime={pass.pass_start}>
                    {format(new Date(pass.pass_start), "dd. MMM yyyy @ HH:mm")}
                  </time>
                </dd>
              </div>
            </div>

            <div className="flex gap-3">
              <Clock3 className="mt-0.5 size-4 shrink-0 text-gray-400" />
              <div>
                <dt className="font-medium text-gray-500">End</dt>
                <dd className="font-semibold text-black">
                  <time dateTime={pass.pass_end}>
                    {format(new Date(pass.pass_end), "dd. MMM yyyy @ HH:mm")}
                  </time>
                </dd>
              </div>
            </div>

            <div className="flex gap-3">
              <TrendingUp className="mt-0.5 size-4 shrink-0 text-gray-400" />
              <div>
                <dt className="font-medium text-gray-500">Max elevation</dt>
                <dd className="font-semibold text-black">
                  {formatDegrees(pass.max_elevation)}
                </dd>
              </div>
            </div>

            <div className="flex gap-3">
              <Compass className="mt-0.5 size-4 shrink-0 text-gray-400" />
              <div>
                <dt className="font-medium text-gray-500">Azimuth</dt>
                <dd className="font-semibold text-black">
                  {formatDegrees(pass.pass_start_azimuth)} start ?{" "}
                  {formatDegrees(pass.azimuth_at_max)} max
                </dd>
              </div>
            </div>
          </dl>
        </li>
      ))}
    </ul>
  );
}

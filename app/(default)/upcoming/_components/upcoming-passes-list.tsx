import { UpcomingPass } from "@/models/upcoming-pass.model";
import { format } from "date-fns";
import { ArrowDown, Compass, MoveRight, Satellite } from "lucide-react";

type Props = {
  passes: UpcomingPass[];
};

function formatDegrees(value: number) {
  return `${Number(value).toFixed(0)}°`;
}

function PassCard({
  pass,
  position,
}: {
  pass: UpcomingPass;
  position: number;
}) {
  return (
    <li className="relative flex min-h-64 flex-col justify-between border-l border-[#cbdada] px-5 pb-5 pt-9 first:border-l-0 lg:px-6">
      <span className="absolute left-[-5px] top-[-5px] size-2.5 rounded-full border-2 border-[#f7faf9] bg-[#256a8a] first:left-0 lg:first:left-5" />
      <div>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.17em] text-[#5c6f76]">
          Pass {String(position).padStart(2, "0")} · {pass.direction}
        </p>
        <h3 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-[#10212b]">
          {pass.satellite_name}
        </h3>
        <time
          dateTime={pass.pass_start}
          className="mt-1 block text-sm text-[#4e646b]"
        >
          {format(new Date(pass.pass_start), "EEEE, dd MMM")}
        </time>
        <p className="mt-5 text-3xl font-semibold tracking-[-0.04em]">
          {format(new Date(pass.pass_start), "HH:mm")}
          <span className="ml-2 text-sm font-normal tracking-normal text-[#5c6f76]">
            to {format(new Date(pass.pass_end), "HH:mm")}
          </span>
        </p>
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-3 border-t border-[#d9e4e3] pt-4 text-xs">
        <div>
          <dt className="flex items-center gap-1.5 text-[#5c6f76]">
            <Satellite className="size-3.5" /> Peak
          </dt>
          <dd className="mt-1 font-mono font-semibold">
            {formatDegrees(pass.max_elevation)}
          </dd>
        </div>
        <div>
          <dt className="flex items-center gap-1.5 text-[#5c6f76]">
            <Compass className="size-3.5" /> Azimuth
          </dt>
          <dd className="mt-1 flex items-center gap-1 font-mono font-semibold">
            {formatDegrees(pass.pass_start_azimuth)}
            <MoveRight className="size-3" />
            {formatDegrees(pass.azimuth_at_max)}
          </dd>
        </div>
      </dl>
    </li>
  );
}

export default function UpcomingPassesList({ passes }: Props) {
  const visiblePasses = passes.slice(0, 4);
  const laterPasses = passes.slice(4);

  return (
    <div className="mt-10">
      <ol className="relative grid border-y border-[#cbdada] pt-px sm:grid-cols-2 lg:grid-cols-4">
        <span
          aria-hidden="true"
          className="absolute left-0 right-0 top-0 h-px bg-[#256a8a]/45"
        />
        {visiblePasses.map((pass, index) => (
          <PassCard key={pass.id} pass={pass} position={index + 1} />
        ))}
      </ol>

      {laterPasses.length > 0 && (
        <details className="group border-b border-[#cbdada]">
          <summary className="flex cursor-pointer list-none items-center justify-between py-5 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#256a8a] [&::-webkit-details-marker]:hidden">
            <span>
              Show {laterPasses.length} later{" "}
              {laterPasses.length === 1 ? "pass" : "passes"}
            </span>
            <ArrowDown className="size-4 transition-transform group-open:rotate-180" />
          </summary>
          <ol className="grid border-t border-[#d9e4e3] sm:grid-cols-2 lg:grid-cols-4">
            {laterPasses.map((pass, index) => (
              <PassCard key={pass.id} pass={pass} position={index + 5} />
            ))}
          </ol>
        </details>
      )}
    </div>
  );
}

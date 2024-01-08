import { supabaseServiceClient } from "@/lib/supabase";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const revalidate = 300;
export default async function Page() {
  const { data: passes } = await supabaseServiceClient
    .from("passes")
    .select(
      `id, created_at, pass_start, daylight_pass, is_noaa, 
      gain, has_pristine, has_polar_az_el, has_polar_direction, 
      has_histogram, is_meteor, has_spectrogram,
      images:passes_images(id, created_at, path)`
    )
    .order("created_at", { ascending: false });

  if (!passes || passes.length === 0) {
    throw new Error("No passes found");
  }

  return (
    <main className="container py-16">
      <ul className="flex flex-col gap-5">
        {passes.map((pass) => {
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
        })}
      </ul>
    </main>
  );
}

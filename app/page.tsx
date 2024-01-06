import { CDN_URL } from "@/lib/cdn-url";
import { supabaseServiceClient } from "@/lib/supabase";
import { format } from "date-fns";

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

  if (!passes) {
    throw new Error("No passes found");
  }

  const [latestPass] = passes;
  const { images } = latestPass;
  const [satelliteIdentifier, satelitteNumber] = images[0].path.split("-");
  const satelliteName = latestPass.is_noaa ? `${satelliteIdentifier} ${satelitteNumber}` : "Meteor M2-3";

  return (
    <main className="container py-20">
      <h1 className="text-sm text-gray-600">{format(latestPass.pass_start, "dd. MMM @ HH:mm")}</h1>
      <h2 className="text-4xl font-bold">{satelliteName}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-5 mt-5">
        {images.map((image) => (
          <img key={image.id} src={`${CDN_URL}/images/${image.path}`} alt="" className="rounded-md" />
        ))}
      </div>
    </main>
  );
}

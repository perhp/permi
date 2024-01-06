import { Badge } from "@/components/ui/badge";
import { CDN_URL } from "@/lib/cdn-url";
import { supabaseServiceClient } from "@/lib/supabase";
import { format } from "date-fns";
import ImagesCarousel from "./_components/images-carousel";

const excludeImages = ["spectrogram", "polar-direction", "polar-azel", "histogram"];

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
  const { images, gain, pass_start } = latestPass;
  const [satelliteIdentifier, satelitteNumber] = images[0].path.split("-");
  const satelliteName = latestPass.is_noaa ? `${satelliteIdentifier} ${satelitteNumber}` : "Meteor M2-3";

  const spectrogram = images.find((image) => image.path.includes("spectrogram"));
  const polarDirection = images.find((image) => image.path.includes("polar-direction"));
  const polarAzEl = images.find((image) => image.path.includes("polar-azel"));
  const histogram = images.find((image) => image.path.includes("histogram"));
  const imagesToDisplay = images.filter((image) => !excludeImages.some((excludeImage) => image.path.includes(excludeImage)));

  return (
    <main className="container py-16">
      <div className="flex justify-between">
        <h1 className="text-sm font-medium text-gray-500">
          {format(pass_start, "dd. MMM @ HH:mm")} <br />
          <span className="text-4xl font-bold text-black">{satelliteName}</span>
        </h1>
        <Badge variant="outline" className="mt-auto">
          Gain {gain}
        </Badge>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10 mt-5 lg:auto-rows-[275px]">
        <div className="flex col-span-1 lg:col-span-2 lg:row-span-2 lg:col-start-1 lg:row-start-1">
          <ImagesCarousel images={imagesToDisplay} />
        </div>
        <div className="flex lg:row-span-2 xl:col-start-3 xl:row-start-1">
          <img src={`${CDN_URL}/images/${spectrogram?.path}`} alt="Spectrogram" className="w-full h-full rounded-2xl" />
        </div>
        <div className="flex justify-center bg-gray-100 p-5 rounded-2xl border border-gray-200">
          <img src={`${CDN_URL}/images/${polarDirection?.path}`} alt="Polar direction" className="mix-blend-multiply rounded-lg h-full" />
        </div>
        <div className="flex justify-center bg-gray-100 p-5 rounded-2xl border border-gray-200">
          <img src={`${CDN_URL}/images/${polarAzEl?.path}`} alt="Azimuth and elevation" className="mix-blend-multiply rounded-lg h-full" />
        </div>
        <div className="flex justify-center bg-gray-100 p-5 rounded-2xl border border-gray-200">
          <img src={`${CDN_URL}/images/${histogram?.path}`} alt="Histogram" className="rounded-lg" />
        </div>
      </div>
    </main>
  );
}

import { supabaseServiceClient } from "@/lib/supabase";
import Pass from "./_components/pass";

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
    .order("created_at", { ascending: false })
    .limit(1);

  if (!passes || passes.length === 0) {
    throw new Error("No passes found");
  }

  const [latestPass] = passes;

  return (
    <main className="container py-16">
      <Pass pass={latestPass} />
    </main>
  );
}

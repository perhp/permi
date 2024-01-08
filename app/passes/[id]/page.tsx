import Pass from "@/app/_components/pass";
import { supabaseServiceClient } from "@/lib/supabase";

type Props = {
  params: { [key: string]: string };
};

export const revalidate = 300;
export default async function Page({ params }: Props) {
  const { id } = params;
  const { data: passes } = await supabaseServiceClient
    .from("passes")
    .select(
      `id, created_at, pass_start, daylight_pass, is_noaa, 
      gain, has_pristine, has_polar_az_el, has_polar_direction, 
      has_histogram, is_meteor, has_spectrogram,
      images:passes_images(id, created_at, path)`
    )
    .eq("id", id);

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

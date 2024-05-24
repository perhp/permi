import { supabaseServiceClient } from "@/lib/supabase";
import { passQuery } from "@/queries/pass.query";
import Pirousel from "./_components/pirousel";

export default async function Page() {
  const { data } = await supabaseServiceClient.from("passes").select(passQuery).order("created_at", { ascending: false }).limit(1);
  const [latestPass] = data ?? [];

  return <Pirousel latestPass={latestPass} />;
}

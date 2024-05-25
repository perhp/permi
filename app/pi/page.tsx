import { supabaseServiceClient } from "@/lib/supabase";
import { passQuery } from "@/queries/pass.query";
import Pirousel from "./_components/pirousel";

type Props = {
  searchParams: { [key: string]: string[] | string | undefined };
};

export default async function Page({ searchParams }: Props) {
  const passesBuilder = supabaseServiceClient.from("passes").select(passQuery).order("created_at", { ascending: false }).limit(1);

  if (searchParams.series) {
    if (searchParams.series === "noaa") {
      passesBuilder.eq("is_noaa", true);
    } else if (searchParams.series === "meteor") {
      passesBuilder.eq("is_meteor", true);
    }
  }

  const { data } = await passesBuilder;
  const [latestPass] = data ?? [];

  return <Pirousel latestPass={latestPass} />;
}

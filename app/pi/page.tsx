import { supabaseServiceClient } from "@/lib/supabase";
import { passQuery } from "@/queries/pass.query";
import Pirousel from "./_components/pirousel";
import { SatelliteSeries } from "./_enums/series";

type Props = {
  searchParams: { [key: string]: string[] | string | undefined };
};

export default async function Page({ searchParams }: Props) {
  const passesBuilder = supabaseServiceClient.from("passes").select(passQuery).order("created_at", { ascending: false }).limit(1);

  if (searchParams.series) {
    if (searchParams.series === SatelliteSeries.NOAA) {
      passesBuilder.eq("is_noaa", true);
    } else if (searchParams.series === SatelliteSeries.METEOR) {
      passesBuilder.eq("is_meteor", true);
    }
  }

  if (searchParams.page) {
    passesBuilder.range(Number(searchParams.page) - 1, Number(searchParams.page));
  }

  const { data } = await passesBuilder;
  const [latestPass] = data ?? [];

  return <Pirousel latestPass={latestPass} />;
}

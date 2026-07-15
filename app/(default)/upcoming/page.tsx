import { createServiceClient } from "@/lib/supabase";
import { Metadata } from "next";
import UpcomingPassesList from "./_components/upcoming-passes-list";

export const metadata: Metadata = {
  title: "Upcoming Passes | permi",
};

export const revalidate = 30;

export default async function UpcomingPassesPage() {
  const supabase = createServiceClient();
  const { data: passes, error } = await supabase
    .from("upcoming_passes")
    .select(
      "id,satellite_name,pass_start,pass_end,max_elevation,pass_start_azimuth,azimuth_at_max,direction",
    )
    .gt("pass_start", new Date().toISOString())
    .order("pass_start", { ascending: true });

  if (error) {
    console.error("Could not load upcoming passes", error);
    throw new Error("Could not load upcoming passes");
  }

  const upcomingPasses = passes ?? [];

  return (
    <main className="container py-16">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-gray-500">
          {upcomingPasses.length} scheduled{" "}
          {upcomingPasses.length === 1 ? "pass" : "passes"}
        </p>
        <h1 className="text-4xl font-bold text-black">Upcoming passes</h1>
        <p className="max-w-2xl text-gray-500">
          Future satellite passes currently scheduled by the receiving station.
        </p>
      </div>

      {upcomingPasses.length > 0 ? (
        <UpcomingPassesList passes={upcomingPasses} />
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-gray-200 p-10 text-center text-gray-500">
          No upcoming passes are currently scheduled.
        </div>
      )}
    </main>
  );
}

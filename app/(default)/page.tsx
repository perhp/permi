import { createServiceClient } from "@/lib/supabase";
import { passQuery } from "@/queries/pass.query";
import { Metadata } from "next";
import PassesList from "../_components/passes-list/passes-list";

export const metadata: Metadata = {
  title: "All Passes | permi",
};

export const revalidate = 15;
export default async function Page() {
  const supabaseServiceClient = await createServiceClient();
  const { data: passes, error } = await supabaseServiceClient
    .from("passes")
    .select(passQuery)
    .order("pass_start", { ascending: false });

  if (error) {
    console.error("Could not load passes", error);
    throw new Error("Could not load passes");
  }

  if (!passes || passes.length === 0) {
    throw new Error("No passes found");
  }

  return (
    <main className="container py-16">
      <div className="flex flex-col gap-2 md:gap-5 md:flex-row">
        <h1 className="text-sm font-medium text-gray-500">
          {passes.length} passes <br />
          <span className="text-4xl font-bold text-black">All passes</span>
        </h1>
      </div>
      <PassesList passes={passes} />
    </main>
  );
}

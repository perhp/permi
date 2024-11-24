import { supabaseServiceClient } from "@/lib/supabase";
import { passQuery } from "@/queries/pass.query";
import { Metadata } from "next";
import PassesList from "../_components/passes-list/passes-list";
import PassesListPagination from "../_components/passes-list/passes-list-pagination";

export const metadata: Metadata = {
  title: "All Passes | permi",
};

export const revalidate = 15;
export default async function Page() {
  const pageSize = 24;

  const [{ data: passes }, { count }] = await Promise.all([
    supabaseServiceClient.from("passes").select(passQuery).order("pass_start", { ascending: false }).limit(pageSize),
    supabaseServiceClient.from("passes").select("count", { count: "exact" }),
  ]);

  if (!passes || passes.length === 0 || count === null) {
    throw new Error("No passes found");
  }

  const totalPages = Math.ceil(count / pageSize);

  return (
    <main className="container py-16">
      <div className="flex flex-col gap-2 md:gap-5 md:flex-row">
        <h1 className="text-sm font-medium text-gray-500">
          {count} passes <br />
          <span className="text-4xl font-bold text-black">All passes</span>
        </h1>
      </div>
      <PassesList passes={passes} refreshOnLoad={true} />
      <PassesListPagination page={1} totalPages={totalPages} />
    </main>
  );
}

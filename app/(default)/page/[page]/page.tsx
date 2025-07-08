import PassesList from "@/app/_components/passes-list/passes-list";
import PassesListPagination from "@/app/_components/passes-list/passes-list-pagination";
import { createServiceClient } from "@/lib/supabase";
import { passQuery } from "@/queries/pass.query";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Passes | permi",
};

type Props = {
  params: Promise<Record<string, string[] | string | undefined>>;
};

export default async function Page(props: Props) {
  const params = await props.params;
  const pageSize = 24;
  const page = +(params.page ?? 1);

  const supabaseServiceClient = await createServiceClient();
  const [{ data: passes }, { count }] = await Promise.all([
    supabaseServiceClient
      .from("passes")
      .select(passQuery)
      .order("pass_start", { ascending: false })
      .range(page * pageSize - pageSize, page * pageSize - 1),
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
      <PassesList passes={passes} />
      <PassesListPagination page={page} totalPages={totalPages} />
    </main>
  );
}

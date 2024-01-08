import { supabaseServiceClient } from "@/lib/supabase";
import { passQuery } from "@/queries/pass.query";
import PassesListItem from "./_components/passes-list-item";

export const revalidate = 300;
export default async function Page() {
  const { data: passes } = await supabaseServiceClient.from("passes").select(passQuery).order("created_at", { ascending: false });
  if (!passes || passes.length === 0) {
    throw new Error("No passes found");
  }

  return (
    <main className="container py-16">
      <ul className="flex flex-col gap-5">
        {passes.map((pass) => (
          <PassesListItem key={pass.id} pass={pass} />
        ))}
      </ul>
    </main>
  );
}

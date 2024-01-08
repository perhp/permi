import { supabaseServiceClient } from "@/lib/supabase";
import { passQuery } from "@/queries/pass.query";
import Pass from "./_components/pass";

export const revalidate = 300;
export default async function Page() {
  const { data: passes } = await supabaseServiceClient.from("passes").select(passQuery).order("created_at", { ascending: false }).limit(1);
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

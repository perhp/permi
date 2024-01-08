import Pass from "@/app/_components/pass";
import { supabaseServiceClient } from "@/lib/supabase";
import { passQuery } from "@/queries/pass.query";
import { notFound } from "next/navigation";

type Props = {
  params: { [key: string]: string };
};

export const revalidate = 300;
export default async function Page({ params }: Props) {
  const { id } = params;
  const { data: latestPass } = await supabaseServiceClient.from("passes").select(passQuery).eq("id", id).single();
  if (!latestPass) {
    notFound();
  }

  return (
    <main className="container py-16">
      <Pass pass={latestPass} />
    </main>
  );
}

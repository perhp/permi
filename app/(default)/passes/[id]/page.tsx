import Pass from "@/app/(default)/passes/[id]/_components/pass";
import { supabaseServiceClient } from "@/lib/supabase";
import { passQuery } from "@/queries/pass.query";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Pass | permi",
};

type Props = {
  params: Promise<Record<string, string[] | string | undefined>>;
};

export const revalidate = 300;
export default async function Page(props: Props) {
  const params = await props.params;
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

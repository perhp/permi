import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { supabaseServiceClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { passQuery } from "@/queries/pass.query";
import { Metadata } from "next";
import PassesListItem from "./_components/passes-list-item";

export const metadata: Metadata = {
  title: "All Passes | permi",
};

type Props = {
  searchParams: { [key: string]: string[] | string | undefined };
};

export const revalidate = 0;
export default async function Page({ searchParams }: Props) {
  const pageSize = 24;
  const page = +(searchParams.page ?? 1);

  const [{ data: passes }, { count }] = await Promise.all([
    supabaseServiceClient
      .from("passes")
      .select(passQuery)
      .order("created_at", { ascending: false })
      .range(page * pageSize - pageSize, page * pageSize - 1),
    supabaseServiceClient.from("passes").select("count", { count: "exact" }),
  ]);

  const totalPages = Math.ceil(count! / pageSize);

  if (!passes || passes.length === 0) {
    throw new Error("No passes found");
  }

  return (
    <main className="container py-16">
      <ul className="grid grid-cols-4 gap-8">
        {passes.map((pass) => (
          <PassesListItem key={pass.id} pass={pass} />
        ))}
      </ul>
      <Pagination className="mt-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={page - 1 === 1 ? "/passes" : `?page=${page - 1}`}
              className={cn(page - 1 < 1 && "pointer-events-none opacity-50")}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => (
            <PaginationItem key={i}>
              <PaginationLink href={i === 0 ? "/passes" : `?page=${i + 1}`}>{i + 1}</PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext href={`?page=${page + 1}`} className={cn(page + 1 > totalPages && "pointer-events-none opacity-50")} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </main>
  );
}

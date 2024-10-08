import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { supabaseServiceClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { passQuery } from "@/queries/pass.query";
import { Metadata } from "next";
import PassesList from "../_components/passes-list/passes-list";

export const metadata: Metadata = {
  title: "All Passes | permi",
};

type Props = {
  searchParams: { [key: string]: string[] | string | undefined };
};

export const revalidate = 5;
export default async function Page({ searchParams }: Props) {
  const pageSize = 24;
  const page = +(searchParams.page ?? 1);

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
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const before = pages.slice(0, 2);
  const after = pages.slice(totalPages - 2, totalPages);

  return (
    <main className="container py-16">
      <div className="flex flex-col gap-2 md:gap-5 md:flex-row">
        <h1 className="text-sm font-medium text-gray-500">
          {count} passes <br />
          <span className="text-4xl font-bold text-black">All passes</span>
        </h1>
      </div>
      <PassesList passes={passes} />
      <Pagination className="mt-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={page - 1 === 1 ? "/" : `?page=${page - 1}`}
              className={cn(page - 1 < 1 && "pointer-events-none opacity-50")}
            />
          </PaginationItem>
          {before.map((p) => (
            <PaginationItem key={p}>
              <PaginationLink href={p === 1 ? "/" : `?page=${p}`} className={cn(p === page && "bg-gray-100")}>
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}
          {page > 3 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          {page > 2 && page < totalPages - 1 && (
            <>
              <PaginationItem key={page}>
                <PaginationLink href={`?page=${page}`} className="bg-gray-100">
                  {page}
                </PaginationLink>
              </PaginationItem>
            </>
          )}
          {page < totalPages - 2 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          {after.map((p) => (
            <PaginationItem key={p}>
              <PaginationLink href={p === 1 ? "/" : `?page=${p}`} className={cn(p === page && "bg-gray-100")}>
                {p}
              </PaginationLink>
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

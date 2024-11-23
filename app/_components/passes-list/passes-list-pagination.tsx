import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

type Props = {
  page: number;
  totalPages: number;
};

export default function PassesListPagination({ page, totalPages }: Props) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const before = pages.slice(0, 2);
  const after = pages.slice(totalPages - 2, totalPages);

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={page - 1 === 1 ? "/" : `/page/${page - 1}`}
            className={cn(page - 1 < 1 && "pointer-events-none opacity-50")}
          />
        </PaginationItem>
        {before.map((p) => (
          <PaginationItem key={p}>
            <PaginationLink href={p === 1 ? "/" : `/page/${p}`} className={cn(p === page && "bg-gray-100")}>
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
              <PaginationLink href={`/page/${page}`} className="bg-gray-100">
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
            <PaginationLink href={p === 1 ? "/" : `/page/${p}`} className={cn(p === page && "bg-gray-100")}>
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext href={`/page/${page + 1}`} className={cn(page + 1 > totalPages && "pointer-events-none opacity-50")} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

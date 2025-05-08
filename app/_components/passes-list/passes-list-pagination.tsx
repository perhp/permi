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

interface Props {
  page: number;
  totalPages: number;
  siblingCount?: number;
}

const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, i) => start + i);

export default function PassesListPagination({ page, totalPages, siblingCount = 1 }: Props) {
  type PageToken = number | "DOTS";
  const tokens: PageToken[] = [];

  const totalNumbers = siblingCount * 2 + 5;

  if (totalPages <= totalNumbers) {
    tokens.push(...range(1, totalPages));
  } else {
    const leftSibling = Math.max(page - siblingCount, 2);
    const rightSibling = Math.min(page + siblingCount, totalPages - 1);
    const showLeftDots = leftSibling > 2;
    const showRightDots = rightSibling < totalPages - 1;

    tokens.push(1);
    if (showLeftDots) tokens.push("DOTS");

    tokens.push(...range(leftSibling, rightSibling));

    if (showRightDots) tokens.push("DOTS");
    tokens.push(totalPages);
  }

  const hrefFor = (p: number) => (p === 1 ? "/" : `/page/${p}`);
  const isFirst = page === 1;
  const isLast = page === totalPages;

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            aria-label="Go to previous page"
            href={hrefFor(Math.max(page - 1, 1))}
            className={cn("rounded-md focus-visible:ring-2 focus-visible:ring-ring", isFirst && "pointer-events-none opacity-50")}
          />
        </PaginationItem>

        {tokens.map((token, idx) =>
          token === "DOTS" ? (
            <PaginationItem key={`dots-${idx}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={token}>
              <PaginationLink
                href={hrefFor(token)}
                aria-current={token === page ? "page" : undefined}
                className={cn(
                  "rounded-md focus-visible:ring-2 focus-visible:ring-ring",
                  token === page && "bg-muted text-primary font-medium"
                )}
              >
                {token}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            aria-label="Go to next page"
            href={hrefFor(Math.min(page + 1, totalPages))}
            className={cn("rounded-md focus-visible:ring-2 focus-visible:ring-ring", isLast && "pointer-events-none opacity-50")}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

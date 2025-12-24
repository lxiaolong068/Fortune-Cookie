/**
 * Pagination Component
 *
 * A reusable pagination component for any listing page.
 * Supports URL-based navigation with search params preservation.
 * Mobile-optimized with 44px touch targets.
 */

"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage?: number;
  basePath: string;
  searchParams?: Record<string, string>;
  className?: string;
  /** Show item count summary (e.g., "Showing 1-24 of 180") */
  showItemCount?: boolean;
}

/**
 * Generate page URL with optional search params
 */
function getPageUrl(
  page: number,
  basePath: string,
  searchParams?: Record<string, string>
): string {
  const params = new URLSearchParams(searchParams);

  if (page > 1) {
    params.set("page", String(page));
  } else {
    params.delete("page");
  }

  const queryString = params.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
}

/**
 * Generate array of page numbers to display
 * Shows first, last, current, and adjacent pages with ellipsis
 */
function getPageNumbers(
  currentPage: number,
  totalPages: number
): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [];

  // Always show first page
  pages.push(1);

  if (currentPage > 3) {
    pages.push("ellipsis");
  }

  // Show pages around current page
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let i = start; i <= end; i++) {
    if (!pages.includes(i)) {
      pages.push(i);
    }
  }

  if (currentPage < totalPages - 2) {
    pages.push("ellipsis");
  }

  // Always show last page
  if (!pages.includes(totalPages)) {
    pages.push(totalPages);
  }

  return pages;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  basePath,
  searchParams,
  className,
  showItemCount = false,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = getPageNumbers(currentPage, totalPages);
  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  // Filter out 'page' from searchParams for building URLs
  const filteredParams = searchParams
    ? Object.fromEntries(
        Object.entries(searchParams).filter(([key]) => key !== "page")
      )
    : undefined;

  // Calculate item range for display
  const startItem =
    totalItems && itemsPerPage ? (currentPage - 1) * itemsPerPage + 1 : null;
  const endItem =
    totalItems && itemsPerPage
      ? Math.min(currentPage * itemsPerPage, totalItems)
      : null;

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {/* Item count summary */}
      {showItemCount && startItem && endItem && totalItems && (
        <p className="text-sm text-gray-600">
          Showing {startItem}-{endItem} of {totalItems} results
        </p>
      )}

      <nav
        aria-label="Pagination navigation"
        className="flex items-center justify-center gap-1 sm:gap-2"
      >
        {/* Previous Button - 44px touch target */}
        {hasPrevPage ? (
          <Link
            href={getPageUrl(currentPage - 1, basePath, filteredParams)}
            aria-label="Go to previous page"
            rel="prev"
          >
            <Button
              variant="outline"
              className="gap-1 min-h-[44px] min-w-[44px] px-3 bg-white/80 border-amber-200 hover:bg-amber-50 hover:border-amber-300"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </Button>
          </Link>
        ) : (
          <Button
            variant="outline"
            disabled
            className="gap-1 min-h-[44px] min-w-[44px] px-3 bg-white/50 border-amber-100"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Previous</span>
          </Button>
        )}

        {/* Page Numbers - 44px touch targets */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((pageNum, index) =>
            pageNum === "ellipsis" ? (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-gray-400"
                aria-hidden="true"
              >
                <MoreHorizontal className="h-4 w-4" />
              </span>
            ) : (
              <Link
                key={pageNum}
                href={getPageUrl(pageNum, basePath, filteredParams)}
                aria-label={`Go to page ${pageNum}`}
                aria-current={pageNum === currentPage ? "page" : undefined}
              >
                <Button
                  variant={pageNum === currentPage ? "default" : "outline"}
                  className={cn(
                    "min-w-[44px] min-h-[44px]",
                    pageNum === currentPage
                      ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-500"
                      : "bg-white/80 border-amber-200 hover:bg-amber-50 hover:border-amber-300"
                  )}
                >
                  {pageNum}
                </Button>
              </Link>
            )
          )}
        </div>

        {/* Next Button - 44px touch target */}
        {hasNextPage ? (
          <Link
            href={getPageUrl(currentPage + 1, basePath, filteredParams)}
            aria-label="Go to next page"
            rel="next"
          >
            <Button
              variant="outline"
              className="gap-1 min-h-[44px] min-w-[44px] px-3 bg-white/80 border-amber-200 hover:bg-amber-50 hover:border-amber-300"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        ) : (
          <Button
            variant="outline"
            disabled
            className="gap-1 min-h-[44px] min-w-[44px] px-3 bg-white/50 border-amber-100"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </nav>
    </div>
  );
}

export default Pagination;

"use client";
import { FC } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

// Props interface for the main pagination component
interface PaginationProps {
  pageCount: number;
}

// Props interface for the arrow buttons
interface PaginationArrowProps {
  direction: "left" | "right";
  href: string;
  isDisabled: boolean;
}

// Arrow button component for navigation
const PaginationArrow: FC<PaginationArrowProps> = ({
  direction,
  href,
  isDisabled,
}) => {
  const router = useRouter();
  const isLeft = direction === "left";

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        router.push(href, { scroll: false });
      }}
      className={`px-3 py-2 text-lg font-medium border rounded-md ${
        isDisabled
          ? "text-gray-400 border-gray-300 cursor-not-allowed"
          : "text-gray-800 border-gray-400 hover:bg-gray-100"
      }`}
      aria-disabled={isDisabled}
      disabled={isDisabled}
    >
      {isLeft ? "«" : "»"}
    </button>
  );
};

export function PaginationComponent({ pageCount }: Readonly<PaginationProps>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className="flex justify-center mt-10"
    >
      <ul className="flex items-center space-x-4">
        {/* Left arrow - disabled if on first page */}
        <li>
          <PaginationArrow
            direction="left"
            href={createPageURL(currentPage - 1)}
            isDisabled={currentPage <= 1}
          />
        </li>
        {/* Current page indicator */}
        <li>
          <span className="text-gray-700 text-sm font-medium">
            Page {currentPage}
          </span>
        </li>
        {/* Right arrow - disabled if on last page */}
        <li>
          <PaginationArrow
            direction="right"
            href={createPageURL(currentPage + 1)}
            isDisabled={currentPage >= pageCount}
          />
        </li>
      </ul>
    </nav>
  );
}

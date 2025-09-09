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
// const PaginationArrow: FC<PaginationArrowProps> = ({
//   direction,
//   href,
//   isDisabled,
// }) => {
//   const router = useRouter();
//   const isLeft = direction === "left";

//   return (
//     <button
//       onClick={(e) => {
//         e.preventDefault();
//         router.push(href, { scroll: false });
//       }}
//       className={`px-3 py-2 text-lg font-medium border rounded-md ${
//         isDisabled
//           ? "text-gray-400 border-gray-300 cursor-not-allowed"
//           : "text-gray-800 border-gray-400 hover:bg-gray-100"
//       }`}
//       aria-disabled={isDisabled}
//       disabled={isDisabled}
//     >
//       {isLeft ? (
//       // Left arrow SVG (matches your image)
//       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="inline-block" xmlns="http://www.w3.org/2000/svg">
//         <circle cx="12" cy="12" r="12" fill="currentColor" fillOpacity="0"/>
//         <path d="M15 12H9M9 12L12 15M9 12L12 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//       </svg>
//     ) : (
//       // Right arrow SVG (matches your image)
//       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="inline-block" xmlns="http://www.w3.org/2000/svg">
//         <circle cx="12" cy="12" r="12" fill="currentColor" fillOpacity="0"/>
//         <path d="M9 12H15M15 12L12 9M15 12L12 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//       </svg>
//     )}
//     </button>
//   );
// };

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
      className={`px-2 py-2 rounded-sm transition-colors
        ${isDisabled
          ? "bg-gray-200 text-white cursor-not-allowed"
          : "bg-gray-800 text-white hover:bg-gray-700"
        }`}
      aria-disabled={isDisabled}
      disabled={isDisabled}
    >
      {isLeft ? (
        // Left long arrow SVG
        <svg width="24" height="24" viewBox="0 0 36 36" fill="none" className="inline-block" xmlns="http://www.w3.org/2000/svg">
          <line x1="26" y1="18" x2="10" y2="18" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          <polyline points="16,12 10,18 16,24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : (
        // Right long arrow SVG
        <svg width="24" height="24" viewBox="0 0 36 36" fill="none" className="inline-block" xmlns="http://www.w3.org/2000/svg">
          <line x1="10" y1="18" x2="26" y2="18" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          <polyline points="20,12 26,18 20,24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
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
        {/* <li>
          <span className="text-gray-700 text-sm font-medium">
            Page {currentPage}
          </span>
        </li> */}
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

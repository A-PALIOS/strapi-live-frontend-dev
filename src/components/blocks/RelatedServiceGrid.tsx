"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { RelatedServicesGridBlockProps } from "@/types";

function normalizePath(path?: string) {
  if (!path) return "/";
  let cleaned = path.trim().toLowerCase();

  if (!cleaned.startsWith("/")) cleaned = `/${cleaned}`;
  if (cleaned.length > 1 && cleaned.endsWith("/")) cleaned = cleaned.slice(0, -1);

  return cleaned;
}

function getLastSegment(path?: string) {
  const normalized = normalizePath(path);
  return normalized.split("/").filter(Boolean).pop() ?? "";
}

export function RelatedServiceGrid({
  eyebrow,
  items,
  theme,
}: Readonly<RelatedServicesGridBlockProps>) {
  const pathname = normalizePath(usePathname());
  const currentSlug = getLastSegment(pathname);
  const isBlack = theme === "black";

  if (!items?.length) return null;

  // find current page index
  const hiddenIndex = items.findIndex((item) => {
    const itemSlug = getLastSegment(item.pagePath);
    return itemSlug === currentSlug;
  });

  return (
    <section className={`w-full ${isBlack ? "bg-black" : "bg-white"}`}>
      <div className="w-full px-6 py-10 md:px-10 md:py-12 lg:px-16 xl:px-20">
        {eyebrow && (
          <p className={`mb-3 text-[15px] font-agenda-medium uppercase tracking-[0.08em] ${isBlack ? "text-white" : "text-black"}`}>
            {eyebrow}
          </p>
        )}

        <div className={`grid grid-cols-1 border md:grid-cols-3 ${isBlack ? "border-[#444444]" : "border-[#D9D9D9]"}`}>
          {items.map((item, index) => {
            const isHidden = index === hiddenIndex;

            return (
              <Link
                key={item.id}
                href={item.pagePath}
                target={item.openInNewTab ? "_blank" : undefined}
                rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                className={[
                  "group relative flex min-h-[140px] items-center justify-between border px-5 py-5 transition-colors duration-200 md:min-h-[110px] pt-12 pb-12 pr-30 pl-18",
                  isBlack
                    ? "border-[#444444] text-white hover:bg-[#F28C28] hover:text-white"
                    : "border-[#D9D9D9] text-[#3A3A3A] hover:bg-[#F28C28] hover:text-white",
                  isHidden ? "invisible pointer-events-none" : "",
                ].join(" ")}
              >
                <span className="text-[24px] font-agenda-medium leading-[1.1] tracking-[-0.03em] md:text-[24px] lg:text-[32px] xl:text-5xl uppercase leading-10">
                  {item.title}
                </span>

                <span
                  className={`absolute bottom-5 right-5 flex h-10 w-10 items-center justify-center border border-transparent transition-transform duration-200 group-hover:-translate-y-[1px] group-hover:translate-x-[1px] group-hover:border-white group-hover:bg-white group-hover:text-[#F28C28] ${isBlack ? "text-white" : "text-black"}`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
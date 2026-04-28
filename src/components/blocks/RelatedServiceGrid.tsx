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
}: Readonly<RelatedServicesGridBlockProps>) {
  const pathname = normalizePath(usePathname());
  const currentSlug = getLastSegment(pathname);

  if (!items?.length) return null;

  // find current page index
  const hiddenIndex = items.findIndex((item) => {
    const itemSlug = getLastSegment(item.pagePath);
    return itemSlug === currentSlug;
  });

  // find next item after current page
  let firstVisibleIndex = items.findIndex((_, i) => i > hiddenIndex);

  // fallback if current is last item
  if (firstVisibleIndex === -1) {
    firstVisibleIndex = items.findIndex((_, i) => i !== hiddenIndex);
  }

  return (
    <section className="w-full bg-white">
      <div className="w-full px-6 py-10 md:px-10 md:py-12 lg:px-16 xl:px-20">
        {eyebrow && (
          <p className="mb-3 text-[15px] font-agenda-medium uppercase tracking-[0.08em] text-black">
            {eyebrow}
          </p>
        )}

        <div className="grid grid-cols-1 border border-[#D9D9D9] md:grid-cols-3">
          {items.map((item, index) => {
            const isHidden = index === hiddenIndex;
            const isHighlighted = index === firstVisibleIndex;

            return (
              <Link
                key={item.id}
                href={item.pagePath}
                target={item.openInNewTab ? "_blank" : undefined}
                rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                className={[
                  "group relative flex  min-h-[92px] items-center justify-between border border-[#D9D9D9] px-5 py-5 transition-colors duration-200 md:min-h-[110px] pt-12 pb-12 pr-30 pl-18",

                  // hide current page but keep layout
                  isHidden ? "invisible pointer-events-none" : "",

                  // highlight next item
                  !isHidden && isHighlighted
                    ? "bg-[#F28C28] text-white"
                    : "text-[#3A3A3A] hover:bg-[#ECECEC]",
                ].join(" ")}
              >
                <span className=" text-[24px] font-agenda-medium leading-[1.1] tracking-[-0.03em] md:text-[28px] lg:text-5xl uppercase
leading-10 ">
                  {item.title}
                </span>

                <span
  className={[
    "absolute bottom-5 right-5 flex h-10 w-10 items-center justify-center text-[22px] border transition-transform duration-200 group-hover:-translate-y-[1px] group-hover:translate-x-[1px]",
    !isHidden && isHighlighted
      ? "border-white bg-white text-[#F28C28]"
      : "border-transparent text-black",
  ].join(" ")}
>
  ↗
</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
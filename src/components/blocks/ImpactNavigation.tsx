"use client";

import Link from "next/link";
import type { ImpactNavigationBlockProps } from "@/types";

export function ImpactNavigation({
  eyebrow,
  items,
}: Readonly<ImpactNavigationBlockProps>) {
  if (!items?.length) return null;

  return (
    <section className="w-full">
      <div className="mx-auto max-w-[1750px] px-6 pt-6 pb-0 md:px-10">
        {/* Eyebrow */}
        {eyebrow ? (
          <p className="mb-6 text-3xl font-agenda-regular uppercase tracking-[-1.6px] text-[#1e1e1e]">
            {eyebrow}
          </p>
        ) : null}

        {/* Grid */}
        <div className="grid grid-cols-1 border-t border-[#dedede] md:grid-cols-2">
          {items.map((item, index) => {
            const isFirst = index === 0;

            return (
              <Link
                key={item.id}
                href={item.url?.href || "#"}
                target={item.url?.isExternal ? "_blank" : undefined}
                rel={
                  item.url?.isExternal ? "noopener noreferrer" : undefined
                }
                className={`
                  group relative border-b border-r md:border-b-0 border-[#dedede] md:border-r-0 flex min-h-[280px] items-start overflow-hidden px-6 py-10 transition-all duration-300
                  ${
                    isFirst
                      ? "text-[#27313a] hover:bg-[#ff7417] hover:text-white md:border-r-1"
                      : "text-[#27313a] hover:bg-[#ff7417] hover:text-white"
                  }
                `}
              >
                {/* Title */}
                <h3 className="max-w-[600px] font-agenda-regular text-4xl uppercase leading-[0.95] tracking-[-0.055em] md:text-5xl lg:text-7xl">
                  {item.title}
                </h3>

                {/* Arrow */}
                <span
                  className={`
                    absolute bottom-5 right-5 flex h-9 w-9 items-center justify-center transition-all
                    ${
                      isFirst
                        ? "bg-white text-[#ff7417]"
                        : "text-[#1e1e1e] group-hover:bg-white group-hover:text-[#ff7417]"
                    }
                  `}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 shrink-0"
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
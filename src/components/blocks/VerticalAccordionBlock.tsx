"use client";

import { useState } from "react";
import type { VerticalAccordionBlockProps } from "@/types";
import Link from "next/link";

export function VerticalAccordionBlock({ title,items,cta }: VerticalAccordionBlockProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const visibleCount = 5;
  const getVisibleItems = () => {
    const start = Math.max(0, Math.min(activeIndex - 1, items.length - visibleCount));
    return items.slice(start, start + visibleCount);
  };
  const visibleItems = getVisibleItems();

  return (
    <section className="w-full max-w-7xl mx-auto py-12 px-4 sm:px-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-10 md:py-12 ">

            <div className="flex items-center justify-between text-[24px]  uppercase ">
          <span className="font-agenda-medium opacity-80">{title}</span>

          {cta && (
            <a
              href={cta.href}
              target={cta.isExternal ? "_blank" : "_self"}
              className="font-agenda-regular md:text-[18px] sm:text-sm  group inline-flex items-center gap-2 opacity-90 hover:opacity-100"
            >
              <span>{cta.text}</span>
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">↗</span>
            </a>
          )}
        </div>
      <div className="mt-8 flex h-[500px] w-full max-w-7xl gap-3 transition-all duration-500 ease-in-out overflow-hidden">


        {visibleItems.map((item) => {
          const globalIndex = items.findIndex((i) => i === item);
          const isActive = globalIndex === activeIndex;

          return (

            
            <div
              key={globalIndex}
              onClick={() => !isActive && setActiveIndex(globalIndex)}
              className={[
                "transition-all duration-500 ease-in-out flex-shrink-0 cursor-pointer h-full",
                "flex items-center justify-center relative overflow-hidden",
                isActive
                  ? "w-[75%] border-0 rounded-2xl"
                  : "w-15 sm:w-15 md:w-15 lg:w-15 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md"
              ].join(" ")}
            >
              {/* INACTIVE TAB */}
              {!isActive && (
                <div className="flex flex-col items-center justify-center px-1 text-center overflow-hidden h-full w-full rounded-xl">
                  <span className="text-3xl font-ivypresto-semibold mt-2 mb-2 truncate text-gray-300">
                    {String(globalIndex + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 flex items-center justify-center">
                    <span className="text-[22px]  font-agenda-medium transform -rotate-90 origin-center whitespace-nowrap truncate max-w-[340px] customnumber2">
                      {item.title}
                    </span>
                  </div>
                  <span className="mb-2 text-blue-300">↗</span>
                </div>
              )}

              {/* ACTIVE CARD */}
              {isActive && (
                <div className="relative w-full h-full rounded-2xl bg-[#1E90FF] p-6 sm:p-8 md:p-10 text-white shadow-[0_12px_28px_-8px_rgba(30,144,255,0.45)]">
                  <span className="text-5xl sm:text-6xl font-ivypresto-semibold text-white/40 block mb-2">
                    {String(globalIndex + 1).padStart(2, "0")}
                  </span>

                  <h3 className="text-4xl font-agenda-medium text-white">
                    {item.title}
                  </h3>

                  <div className="h-px bg-white/25 my-4 w-full" />

                  <p className="font-agenda-regular text-[20px] leading-7 text-white/95 max-w-3xl">
                    {item.description}
                  </p>

                  {item.cta?.href && (
                    <div className="absolute bottom-6 right-6">
                      <Link
                        href={item.cta.href}
                        target={item.cta.isExternal ? "_blank" : "_self"}
                        className="inline-flex items-center gap-2 rounded-md bg-white/95 px-4 py-2 text-sm text-gray-900 shadow hover:bg-white"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {item.cta.text || "Learn More"}
                        <span className="text-xs">↗</span>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      </div>
    </section>
  );
}

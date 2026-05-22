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
    <section className="w-full py-12">
  <div className="w-full px-4 sm:px-8 md:px-12 xl:px-[65px] py-8 sm:py-10 md:py-12">
    <div className="flex items-center justify-between mb-6 tracking-[-2px] uppercase">
      <h3 className="text-3xl font-agenda-medium">{title}</h3>

      {cta && (
        <a
          href={cta.href}
          target={cta.isExternal ? "_blank" : "_self"}
          className="inline-flex items-center font-agenda-regular text-[24px] font-medium text-gray-900 transition"
          style={{ color: "#323C43" }}
        >
          {cta.text}
          <div style={{ marginLeft: "10px" }} className="flex items-center justify-center rounded">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              className="w-6 h-6 transform -rotate-135 md:ml-7"
              style={{ color: "#221D1D" }}
            >
              <path d="M11 3h2v12.17l3.59-3.58L18 13l-6 6-6-6 1.41-1.41L11 15.17V3z" />
            </svg>
          </div>
        </a>
      )}
    </div>

    {/* ===== Mobile/Tablet: show ALL items as full-width cards ===== */}
    <div className="mt-8 xl:hidden space-y-3">
      {items.map((item, idx) => (
        <div
          key={`m-${idx}`}
          className="w-full rounded-2xl border border-gray-200 bg-white shadow-sm"
        >
          <div className="relative w-full h-full rounded-2xl bg-[#1E90FF] p-6 sm:p-8 text-white" style={{ boxShadow: "0 20px 80px 10px rgba(0, 0, 0, 0.07)" }}>
            <span className="text-5xl sm:text-6xl font-ivypresto-semibold text-white/40 block mb-2">
              {String(idx + 1).padStart(2, "0")}
            </span>

            <h3 className="text-3xl sm:text-4xl font-agenda-medium text-white">
              {item.title}
            </h3>

            <div className="h-px bg-white/25 my-4 w-full" />

            <p className="font-agenda-regular text-[22px] sm:text-[28px]" style={{ lineHeight: "normal", letterSpacing: "-2.2px", color: "#EFEFEF" }}>
              {item.description}
            </p>

            {item.cta?.href && (
              <div className="mt-6">
                <Link
                  href={item.cta.href}
                  target={item.cta.isExternal ? "_blank" : "_self"}
                  className="inline-flex items-center gap-2 rounded-md bg-white/95 px-4 py-2 text-sm text-gray-900 shadow hover:bg-white"
                >
                  {item.cta.text || "Learn More"}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 shrink-0" aria-hidden="true"><path d="M7 17L17 7M17 7H7M17 7V17" /></svg>
                </Link>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>

    {/* ===== Desktop: your existing accordion with visibleItems ===== */}
    <div className="mt-8 hidden xl:flex justify-start h-[771px] w-full max-w-8xl gap-3 transition-all duration-500 ease-in-out">
      {visibleItems.map((item) => {
        const globalIndex = items.findIndex((i) => i === item);
        const isActive = globalIndex === activeIndex;

        return (
          <div
            key={globalIndex}
            onClick={() => !isActive && setActiveIndex(globalIndex)}
            className={[
              "transition-all duration-500 ease-in-out cursor-pointer h-full",
              "flex items-center justify-center relative",
              isActive
                ? "flex-1 min-w-0 border-0 rounded-2xl"
                : "flex-none w-[90px] bg-white rounded-[8px] border border-[rgba(36,42,46,0.50)] hover:shadow-md"
            ].join(" ")}
          >
            {/* INACTIVE TAB */}
            {!isActive && (
              <div className="flex flex-col items-center justify-between py-5 px-2 text-center overflow-hidden h-full w-full rounded-[8px]">
                <span className="font-ivypresto-semibold" style={{ color: "rgba(36,42,46,0.25)", fontSize: "48px", fontWeight: 600, lineHeight: "56px", letterSpacing: "-2.4px" }}>
                  {String(globalIndex + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 flex items-center justify-center overflow-hidden">
                  <span
                    className="font-agenda-medium transform -rotate-90 origin-center whitespace-nowrap"
                    style={{ fontSize: "40px", color: "rgba(36,42,46,0.75)", letterSpacing: "-2px", fontWeight: 500, lineHeight: "normal", maxWidth: "680px" }}
                  >
                    {item.title}
                  </span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
                  <path d="M0.636353 24.8999L24.6364 0.899902M0.636353 0.899902H24.6364V23.6367" stroke="#1E9BFB" strokeWidth="1.8"/>
                </svg>
              </div>
            )}

            {/* ACTIVE CARD */}
            {isActive && (
              <div className="relative w-full h-full rounded-2xl bg-[#1E90FF] p-6 sm:p-8 xl:px-[82px] xl:py-[60px] text-white" style={{ boxShadow: "-7px 13px 18px -12px rgba(0, 0, 0, 0.6)"}}>
                <span className="text-[100px] font-ivypresto-semibold text-white/40 block mb-2 leading-none">
                  {String(globalIndex + 1).padStart(2, "0")}
                </span>

                <h3 className="text-[64px] tracking-[-3.2px] font-agenda-medium text-white">
                  {item.title}
                </h3>

                <div className="h-px bg-white/25 my-4 w-full" />

                <p className="font-agenda-regular" style={{ fontSize: "clamp(18px, 2.8vw, 35px)", lineHeight: "normal", letterSpacing: "-2.2px", color: "#EFEFEF" }}>
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
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 shrink-0" aria-hidden="true"><path d="M7 17L17 7M17 7H7M17 7V17" /></svg>
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

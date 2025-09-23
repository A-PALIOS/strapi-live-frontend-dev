"use client";

import { useState } from "react";
import type { ServicesAccordionBlockProps } from "@/types";
import { StrapiImage } from "../StrapiImage";

export function ServicesAccordionBlock({
  heading,       // use as the small eyebrow text (left)
  items,
  cta,           // { href, text, isExternal }
  image,
}: ServicesAccordionBlockProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const toggleIndex = (index: number) => setOpenIndex((prev) => (prev === index ? null : index));

  return (
    <section id="services" data-header="dark" className="relative">
      {/* Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <StrapiImage
          src={image.url}
          alt={image.alternativeText || "Background"}
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        {/* Dark veil for readability */}
        <div className="absolute inset-0" />
                {/* <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/70" /> */}

      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10 md:py-12 text-white">
        {/* Top bar */}
        <div className="flex items-center justify-between text-[11px] sm:text-xs uppercase tracking-[0.16em]">
          <span className="opacity-80">{heading}</span>

          {cta && (
            <a
              href={cta.href}
              target={cta.isExternal ? "_blank" : "_self"}
              className="group inline-flex items-center gap-2 opacity-90 hover:opacity-100"
            >
              <span>{cta.text}</span>
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">↗</span>
            </a>
          )}
        </div>

        {/* Thin divider */}
        <div className="mt-3 h-px w-full bg-white/25" />

        {/* Accordion list */}
        <div role="list" className="divide-y divide-white/15 mt-1">
          {items.map((item, index) => {
            const isOpen = index === openIndex;
            const displayIndex = String(index + 1).padStart(2, "0");

            return (
              <div key={item.id} role="listitem" className="py-3 sm:py-4">
                {/* Row button */}
                <button
                  onClick={() => toggleIndex(index)}
                  className="group w-full text-left"
                >
                  <div className="flex items-center justify-between gap-4 py-2">
                    {/* Left: 01 — Title */}
                    <div className="flex min-w-0 items-baseline gap-3 sm:gap-4">
                      <span className="shrink-0 font-ivypresto-light text-2xl sm:text-3xl md:text-4xl leading-none">
                        {displayIndex}
                      </span>
                      <span className="shrink-0 text-white/70 text-xl md:text-2xl leading-none">—</span>
                      <span
                        className={[
                          "truncate",
                          "text-xl sm:text-2xl md:text-3xl",
                          "font-agenda-semibold",
                          isOpen ? "text-blue-400" : "text-white",
                        ].join(" ")}
                        title={item.title}
                      >
                        {item.title}
                      </span>
                    </div>

                    {/* Right: plus/minus circle */}
                    <div
                      className={[
                        "grid place-items-center h-8 w-8 rounded-full border transition-colors",
                        isOpen ? "border-white/60 text-white/90" : "border-white/50 text-white/70 group-hover:border-white/80 group-hover:text-white",
                      ].join(" ")}
                      aria-hidden
                    >
                      <span className="text-base leading-none">{isOpen ? "−" : "＋"}</span>
                    </div>
                  </div>

                  {/* Description (open row) */}
                  {isOpen && (
                    <div className="pl-[4.25rem] sm:pl-[5.25rem] md:pl-[5.25rem] pr-1 pb-4">
                      <p className="font-agenda-light max-w-2xl text-sm sm:text-[18px] leading-6 text-white/85">
                        {item.description}
                      </p>
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import type { ServicesAccordionBlockProps } from "@/types";
import { StrapiImage } from "../StrapiImage";
import { AnimatePresence, motion, useReducedMotion, type Transition } from "framer-motion";

export function ServicesAccordionBlock({
  heading,
  items,
  cta,
  image,
}: ServicesAccordionBlockProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const prefersReducedMotion = useReducedMotion();
  const toggleIndex = (index: number) =>
    setOpenIndex((prev) => (prev === index ? null : index));
  const bezier = [0.22, 0.61, 0.36, 1] as const; // keep tuple type
  const transition: Transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.45, ease: bezier };
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
        <div className="absolute inset-0" />
      </div>

      <div className="w-full px-6 md:px-10 lg:px-16 xl:px-20 py-16 md:py-20 text-white">
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
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              >
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
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
                  aria-expanded={isOpen}
                  aria-controls={`svc-desc-${item.id}`}
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
                        isOpen
                          ? "border-white/60 text-white/90"
                          : "border-white/50 text-white/70 group-hover:border-white/80 group-hover:text-white",
                      ].join(" ")}
                      aria-hidden
                    >
                      <span className="text-base leading-none">{isOpen ? "−" : "＋"}</span>
                    </div>
                  </div>

                  {/* Description (animated) */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`svc-desc-${item.id}`}
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={transition}
                        style={{ overflow: "hidden" }}
                        className="pl-[4.25rem] sm:pl-[5.25rem] md:pl-[5.25rem] pr-1"
                      >
                        <motion.p
                          initial={{ y: 6, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 6, opacity: 0 }}
                          transition={transition}
                          className="font-agenda-light max-w-2xl text-sm sm:text-[18px] leading-6 text-white/85 py-3"
                        >
                          {item.description}
                        </motion.p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
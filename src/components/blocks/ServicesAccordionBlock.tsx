"use client";

import { useState } from "react";
import type { ServicesAccordionBlockProps } from "@/types";
import { StrapiImage } from "../StrapiImage";
import {StrapiVideo} from "../StrapiVideo";
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
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-start py-8 xl:mb-8">
          <div className="inline-flex max-w-full items-center gap-3 flex-wrap">
            <span className="lg:hidden text-white font-agenda-medium text-[24px] uppercase tracking-[-1.6px]">FROM INSIGHT TO IMPACT</span>
            <span className="hidden lg:inline text-white font-agenda-medium text-[24px] xl:text-[32px] uppercase tracking-[-1.6px]">{heading}</span>
          </div>

          {cta && (
            <div className="block lg:inline-block">
              <a
                href={cta.href}
                target={cta.isExternal ? "_blank" : "_self"}
                className="group inline-flex items-center gap-2 hover:opacity-100"
              >
                <span className="font-agenda-regular text-[20px] xl:text-[24px] tracking-[-1.1px]">{cta.text}</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-7 w-7 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                >
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </a>
            </div>
          )}
        </div>

        {/* Thin divider */}
        <div className="mt-3 h-px bg-white -mx-6 md:-mx-10 lg:-mx-16 xl:-mx-20" />

        {/* Accordion list */}
        <div role="list" className="divide-y divide-white/35 mt-24">
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
                  <div className="flex items-center justify-between gap-4 py-2 cursor-pointer">
                    {/* Left: 01 — Title */}
<div className="min-w-0 flex-1">
  {/* Mobile / tablet */}
  <span
    className={[
      "block lg:hidden",
      "font-agenda-medium uppercase",
      "text-[23px] sm:text-2xl leading-[1.05]",
      "break-words whitespace-normal",
      isOpen ? "text-blue-400" : "text-white",
    ].join(" ")}
    title={item.title}
  >
    <span className="font-ivypresto-light">{displayIndex}</span>
    <span className="mx-3">—</span>
    {item.title}
  </span>

  {/* Desktop */}
  <div className="hidden lg:flex min-w-0 items-baseline gap-3 sm:gap-4">
    <span
      className={`shrink-0 font-ivypresto-light text-2xl sm:text-3xl xl:text-5xl lg:text-[32px] leading-none ${
        isOpen ? "text-blue-400" : "text-white"
      }`}
    >
      {displayIndex}
    </span>

    <span
      className={`shrink-0 text-xl xl:text-5xl lg:text-[32px] leading-none ${
        isOpen ? "text-blue-400" : "text-white"
      }`}
    >
      —
    </span>

    <span
      className={[
        "text-[23px] sm:text-2xl xl:text-5xl lg:text-[32px] md:tracking-[-2.2px]",
        "font-agenda-medium",
        "uppercase",
        isOpen ? "text-blue-400" : "text-white",
      ].join(" ")}
      title={item.title}
    >
      {item.title}
    </span>
  </div>
</div>

                    {/* Right: plus/minus circle */}
                    <div
                      className={[
                        "grid place-items-center h-8 w-8 rounded-full border transition-colors",
                        isOpen
                          ? "border-blue-400 text-blue-400"
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
                        className="pl-[0rem] sm:pl-[4.25rem] md:pl-[4.5rem] xl:pl-[5.25rem] lg:pl-[6.00rem] pr-1"
                      >
                        <motion.p
                          initial={{ y: 6, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 6, opacity: 0 }}
                          transition={transition}
                          className="font-agenda-light xl:ml-8  text-[19px] sm:text-[24px] lg:text-[24px] xl:text-4xl md:leading-8 sm:leading-6 text-white py-3 xl:tracking-[-2px] lg:tracking-[-1.2px]"
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

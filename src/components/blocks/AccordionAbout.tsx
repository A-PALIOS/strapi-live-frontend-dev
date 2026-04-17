"use client";

import { useState } from "react";
import type { AccordionAboutBlockProps } from "@/types";
import { StrapiImage } from "../StrapiImage";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from "framer-motion";

export function AccordionAbout({
  heading,
  items,
  cta,
  image,
}: AccordionAboutBlockProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const prefersReducedMotion = useReducedMotion();

  const toggleIndex = (index: number) =>
    setOpenIndex((prev) => (prev === index ? null : index));

  const bezier = [0.22, 0.61, 0.36, 1] as const;

  const transition: Transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.4, ease: bezier };

  return (
    <section
      id="services"
      data-header="dark"
      className="relative overflow-hidden"
    >
      <div className="absolute inset-0 -z-10">
        <StrapiImage
          src={image.url}
          alt={image.alternativeText || "Background"}
          className="h-full w-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-[#1E4E78]/78" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#4A79A2]/30 via-transparent to-[#0E3557]/55" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#A56A46]/28 via-transparent to-transparent" />
      </div>

      <div className="px-6 py-10 text-white md:px-10 md:py-14 lg:px-14 xl:px-20">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-4">
          <span className="font-agenda-medium text-[11px] uppercase tracking-[0.08em] text-white/90 md:text-[12px]">
            {heading}
          </span>

          {cta && (
            <a
              href={cta.href}
              target={cta.isExternal ? "_blank" : "_self"}
              rel={cta.isExternal ? "noreferrer" : undefined}
              className="group inline-flex items-center gap-2 font-agenda-medium text-[10px] uppercase tracking-[0.08em] text-white/85 transition hover:text-white md:text-[11px]"
            >
              <span>{cta.text}</span>
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              >
                ↗
              </span>
            </a>
          )}
        </div>

        <div className="mt-5 h-px w-full bg-white/30" />

        {/* ONE border outside items.map */}
        <div className="mt-10 border border-white/35 px-8 py-6">
          {items.map((item, index) => {
            const isOpen = index === openIndex;

            return (
              <div
                key={item.id}
                className={index !== items.length - 1 ? "border-b border-white/30 pb-6 mb-6" : ""}
              >
                {/* Trigger row */}
                <button
                  type="button"
                  onClick={() => toggleIndex(index)}
                  aria-expanded={isOpen}
                  aria-controls={`svc-desc-${item.id}`}
                  className="group flex w-full items-start justify-between gap-4 text-left"
                >
                  <span
                    className={[
                      "block text-left font-agenda-medium uppercase leading-[1.15]",
                      "text-[18px] md:text-[20px]",
                      isOpen ? "text-white" : "text-white/95",
                    ].join(" ")}
                  >
                    {item.title}
                  </span>

                  <span
                    aria-hidden
                    className={[
                      "shrink-0 text-[22px] leading-none text-white/90 transition-transform duration-300",
                      isOpen ? "rotate-90" : "rotate-0",
                    ].join(" ")}
                  >
                    ↗
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`svc-desc-${item.id}`}
                      key={`content-${item.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={transition}
                      style={{ overflow: "hidden" }}
                    >
                      <motion.p
                        initial={{ y: 8, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 8, opacity: 0 }}
                        transition={transition}
                        className="mt-5 max-w-[920px] font-agenda-light text-[17px] leading-[1.45] text-white/95 md:text-[18px]"
                      >
                        {item.description}
                      </motion.p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
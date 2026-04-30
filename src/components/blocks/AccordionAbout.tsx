"use client";

import { useState } from "react";
import type { AccordionAboutBlockProps } from "@/types";
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
      <div className="w-full px-6 py-16 md:px-10 md:py-20 lg:px-16 xl:px-20">
        <div
          className="min-h-[500px] w-full rounded-[24px] px-6 py-10 text-white md:px-10 md:py-14 lg:px-14 xl:px-20"
          style={{
            background: `
              linear-gradient(
                25deg,
                #947560 0%,
                #6f7176 25%,
                #4f6e85 50%,
                #2f6d9d 100%
              )
            `,
          }}
        >
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

          <div className="mt-5 h-px w-full bg-white/30" />

          {/* ONE border outside items.map */}
          <div className="mt-10 border border-white/35 px-8 py-6">
            {items.map((item, index) => {
              const isOpen = index === openIndex;

              return (
                <div
                  key={item.id}
                  className={
                    index !== items.length - 1
                      ? "mb-6 border-b border-white/30 pb-6"
                      : ""
                  }
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

                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={[
                        "h-5 w-5 shrink-0 text-white/90 transition-transform duration-300",
                        isOpen ? "rotate-90" : "rotate-0",
                      ].join(" ")}
                      aria-hidden="true"
                    >
                      <path d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
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
      </div>
    </section>
  );
}
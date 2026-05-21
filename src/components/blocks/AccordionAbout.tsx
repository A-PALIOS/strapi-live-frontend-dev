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
  theme,
}: AccordionAboutBlockProps) {
  const isBlack = theme === "black";
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
      className={`relative overflow-hidden${isBlack ? " bg-black" : ""}`}
    >
      <div className="w-full px-6 py-16 md:px-10 md:py-20 lg:px-16 xl:px-20">
        <div
          className="min-h-[500px] w-full rounded-[24px] px-6 py-14 text-white md:px-10 lg:px-14 xl:px-20"
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
            <span style={{ letterSpacing: "-1.6px" }} className="font-agenda text-[32px] font-normal leading-[24px] uppercase tracking-[-0.05em] text-[#FEFEFE]">
              {heading}
            </span>

            {cta && (
              <a style={{ lineHeight: "24px", letterSpacing: "-1.2px" }} href={cta.href} target={cta.isExternal ? "_blank" : "_self"} rel={cta.isExternal ? "noreferrer" : undefined} className="group inline-flex items-center gap-2 font-agenda text-[24px] font-normal leading-[24px] uppercase tracking-[-0.05em] text-[#FEFEFE] transition hover:opacity-80"
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

          <div className="mt-14 h-px bg-white -mx-6 md:-mx-10 lg:-mx-14 xl:-mx-20" />

          {/* ONE border outside items.map */}
          <div className="mt-32 border rounded-[8px] border-white py-8 px-14 ">
            {items.map((item, index) => {
              const isOpen = index === openIndex;

              return (
                <div
                  key={item.id}
                  className={
                    index !== items.length - 1
                      ? "mb-6 border-b border-white pb-6"
                      : ""
                  }
                >
                  {/* Trigger row */}
                  <button
                    type="button"
                    onClick={() => toggleIndex(index)}
                    aria-expanded={isOpen}
                    aria-controls={`svc-desc-${item.id}`}
                    className="group flex w-full items-start justify-between gap-4 text-left cursor-pointer"
                  >
                    <span className="block text-left font-agenda-medium text-[40px] font-medium uppercase leading-normal tracking-[-0.05em] text-[#FEFEFE]">
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
                          className="mt-5 max-w-[960px] font-agenda-medium text-[32px] font-medium leading-[1.2] tracking-[-0.05em] text-[#FEFEFE]"
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
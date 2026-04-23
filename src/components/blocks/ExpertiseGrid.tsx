"use client";

import type { ExpertiseGridBlockProps } from "@/types";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

function ExpertiseItem({
  item,
  index,
}: {
  item: ExpertiseGridBlockProps["items"][number];
  index: number;
}) {
  const textRef = useRef<HTMLDivElement | null>(null);

  const textInView = useInView(textRef, {
    once: false,
    margin: "0px 0px -15% 0px",
  });

  return (
    <motion.article
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.35 }}
      transition={{
        delay: index * 0.2,
      }}
      className={`relative pt-8 md:pt-7 ${
        index >= 4 ? "border-b border-[#cfcfcf] pb-8 md:pb-7" : ""
      }`}
    >
      <motion.div
        variants={{
          hidden: { scaleX: 0, opacity: 0 },
          visible: { scaleX: 1, opacity: 1 },
        }}
        transition={{
          duration: 0.65,
          ease: [0.22, 1, 0.36, 1],
          delay: index * 0.2,
        }}
        className="absolute left-0 top-0 h-px w-full origin-left bg-[#cfcfcf]"
      />

      <div className="grid grid-cols-[32px_1fr] gap-x-3 md:grid-cols-[44px_1fr] md:gap-x-4">
        <motion.span
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: { y: 0, opacity: 1 },
          }}
          transition={{
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
            delay: index * 0.2 + 0.15,
          }}
          className="pt-[2px] font-agenda-light text-[15px] leading-none tracking-[-0.03em] text-[#9a9a9a] md:text-[18px]"
        >
          {item.number}
        </motion.span>

        <div ref={textRef}>
          <motion.h3
            initial={{ y: 28, opacity: 0 }}
            animate={textInView ? { y: 0, opacity: 1 } : { y: 28, opacity: 0 }}
            transition={{
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="font-agenda-medium text-[26px] leading-[1] tracking-[-0.045em] text-[#231f20] md:text-[39px]"
          >
            {item.title}
          </motion.h3>

          <motion.p
            initial={{ y: 28, opacity: 0 }}
            animate={textInView ? { y: 0, opacity: 1 } : { y: 28, opacity: 0 }}
            transition={{
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.12,
            }}
            className="mt-3 max-w-[520px] font-agenda-light text-[16px] leading-[1.22] tracking-[-0.035em] text-[#5b5b5b] md:mt-4 md:text-[23px]"
          >
            {item.description}
          </motion.p>
        </div>
      </div>
    </motion.article>
  );
}

export function ExpertiseGrid({
  eyebrow,
  items,
}: Readonly<ExpertiseGridBlockProps>) {
  return (
    <section className="w-full px-6 md:px-10 lg:px-16 xl:px-20 py-16 md:py-20">
      <div className="w-full">
        {eyebrow && (
          <p className="mb-8 font-agenda-medium text-[14px] uppercase leading-none tracking-[0.02em] text-black md:mb-10">
            {eyebrow}
          </p>
        )}

        <div className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
          {items?.map((item, index) => (
            <ExpertiseItem key={item.id ?? index} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
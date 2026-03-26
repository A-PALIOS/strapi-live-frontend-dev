import Link from "next/link";
import type { WhatSetsUsApartBlockProps } from "@/types";
import { StrapiImage } from "../StrapiImage";

export function WhatSetsUsApart({
  eyebrow,
  topLabel,
  topImage,
  introText,
  highlightedText,
  leftTitleTop,
  rightTitleTop,
  leftTitleBottom,
  rightList,
  bottomTitle,
}: Readonly<WhatSetsUsApartBlockProps>) {
  return (
    <section className="w-full  px-6 py-8 md:px-10 md:py-10">
      <div className="mx-auto">
        <div className="mb-6 flex items-start justify-between gap-6 border-b border-black/10 pb-6">
          <p className="text-[12px] font-agendamedium uppercase tracking-[0.04em] text-black/80">
            {eyebrow}
          </p>

          <div className="flex items-start gap-4">
            {topLabel ? (
              <p className="pt-1 text-right text-[11px] uppercase tracking-[0.04em] text-black/70">
                {topLabel}
              </p>
            ) : null}

            {topImage ? (
              <div className="relative h-[56px] w-[84px] overflow-hidden rounded-[2px] md:h-[74px] md:w-[112px]">
                <StrapiImage
                  src={topImage.url}
                  alt={topImage.alternativeText || "Approach image"}
                  className="h-full w-full object-cover"
                  width={40}
                  height={40}
                />
              </div>
            ) : null}
          </div>
        </div>

        <div className="border-b border-black/10 py-5 md:py-7">
          <h2 className="text-[44px] font-agenda-regular uppercase leading-none tracking-[-0.06em] text-black md:text-[72px]">
            {leftTitleTop}
          </h2>
        </div>

        <div className="grid border-b border-black/10 py-5 md:grid-cols-[1fr_auto] md:items-center md:gap-8 md:py-7">
          <div className="text-[12px] uppercase tracking-[0.02em] text-black/75 md:text-[14px]">
            <span>{introText} </span>
            <span className="text-[#4da3ff]">{highlightedText}</span>
          </div>

          <h3 className="mt-4 text-left text-[44px] font-agenda-regular uppercase leading-none tracking-[-0.06em] text-black md:mt-0 md:text-right md:text-[64px]">
            {rightTitleTop}
          </h3>
        </div>

        <div className="grid border-b border-black/10 py-5 md:grid-cols-[1fr_auto] md:items-start md:gap-8 md:py-7">
          <h3 className="text-[34px] font-agenda-regular uppercase leading-none tracking-[-0.06em] text-black md:text-[64px]">
            {leftTitleBottom}
          </h3>

          <div className="mt-4 space-y-2 md:mt-1">
            {rightList?.map((item) => (
              <Link
                key={item.id}
                href={item.url || "#"}
                className="group flex items-center justify-end gap-2 text-right"
              >
                <span className="text-[12px] uppercase leading-[1.2] tracking-[0.02em] text-black/75 md:text-[14px]">
                  {item.text}
                </span>
                <span className="flex h-4 w-4 shrink-0 items-center justify-center bg-[#f28c28] text-[10px] text-white transition-transform duration-200 group-hover:translate-x-[2px]">
                  ↗
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="py-5 md:py-7">
          <h3 className="text-right text-[44px] font-agenda-regular uppercase leading-none tracking-[-0.06em] text-black md:text-[64px]">
            {bottomTitle}
          </h3>
        </div>
      </div>
    </section>
  );
}
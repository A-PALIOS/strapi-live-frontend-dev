"use client";

import Link from "next/link";
import type { ImpactLinksBlockProps } from "@/types";
import { StrapiImage } from "../StrapiImage";

function getStrapiMediaUrl(url?: string | null) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${process.env.NEXT_PUBLIC_STRAPI_URL}${url}`;
}

export function ImpactLinks({
  eyebrow,
  introText,
  backgroundImage,
  items,
}: Readonly<ImpactLinksBlockProps>) {
//   const bgUrl = getStrapiMediaUrl(backgroundImage?.url);

  if (!items?.length) return null;

  return (
    <section className="relative w-full px-6 md:px-10 lg:px-16 xl:px-20 py-10 md:py-10 overflow-hidden text-white">
      {/* Background */}
      {backgroundImage && (
        <StrapiImage
          src={backgroundImage.url}
          alt={backgroundImage?.alternativeText || "impact background"}
          className="absolute inset-0 h-full w-full object-cover"
          width={1920}
          height={1080}
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 " />

      {/* Content */}
      <div className="relative max-w-[1920px]  py-16  md:py-24">
        {/* Top Row */}
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {eyebrow && (
            <p className="text-sm tracking-[0.2em] text-white/70 uppercase">
              {eyebrow}
            </p>
          )}

          {introText && (
            <p className=" text-white/70 md:text-right">
              {introText}
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="mb-10 h-px w-full bg-white/20" />

        {/* Links */}
        <div className="flex flex-col gap-10">
          {items.map((item) => {
            const isHighlighted = item.isHighlighted;

            return (
              <Link
                key={item.id}
                href={item.url || "#"}
                target={item.openInNewTab ? "_blank" : "_self"}
                className={`group flex items-center justify-between text-left transition-all duration-300 ${
                  isHighlighted
                    ? "text-[#2F80ED]"
                    : "text-white hover:text-[#2F80ED]"
                }`}
              >
                <span className="text-[22px] font-agenda-medium tracking-[-0.02em] md:text-[32px]">
                  {item.title} ↗
                </span>

                {/* Arrow */}
                {/* <span className="ml-4 transition-transform duration-300 group-hover:translate-x-1">
                  ↗
                </span> */}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
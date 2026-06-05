"use client";

import { useState } from "react";
import Link from "next/link";
import type { TestimonialsBlockProps } from "@/types";
// import Image from "next/image";
import { StrapiImage } from "../StrapiImage";
import { AnimatedTestimonials } from "../ui/animated-testimonials";
import { getStrapiURL } from "@/utils/get-strapi-url"; // ✅ ensure this exists

function resolveMediaUrl(m: any): string | null {
  if (!m) return null;
  if (typeof m === "string") return m;
  if (typeof m?.url === "string") return m.url;
  const nested = m?.data?.attributes?.url;
  return typeof nested === "string" ? nested : null;
}

export function TestimonialsBlock({ items, heading, cta }: TestimonialsBlockProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const active = items[activeIndex];

  return (
    <section className="w-full py-12">

      <div className="w-full px-6 md:px-10 lg:px-16 xl:px-20">
  {/* Heading + CTA */}
  <div className="mb-6 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-start">
    <div className="inline-flex max-w-full items-center gap-3 flex-wrap">
      <h3 className="font-agenda-medium text-[24px] sm:text-3xl uppercase tracking-[-2px]">{heading}</h3>
    </div>
    {cta && (
      <div className="block lg:inline-block">
        <Link
          href={cta.href}
          target={cta.isExternal ? "_blank" : "_self"}
          className="group inline-flex items-center gap-2 font-agenda-regular text-[20px] md:text-[24px] uppercase tracking-wide text-gray-900 transition hover:text-[#1E9BFB]"
        >
          {cta.text}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="h-6 w-6 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          >
            <path d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </Link>
      </div>
    )}
  </div>

  {/* Full-width divider */}
  <div className="mt-16 border-t -mx-6 md:-mx-10 lg:-mx-16 xl:-mx-20" style={{ borderColor: "#626262" }} />

      {/* <div className="max-w-5xl w-full px-4 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="w-32 h-32 bg-gray-200 rounded-md overflow-hidden">
            {active.image?.url && (
              <StrapiImage
                src={active.image.url}
                alt={active.image.alternativeText || active.name}
                width={128}
                height={128}
                className="object-cover w-full h-full"
              />
            )}
          </div>
          <h3 className="mt-4 text-xl font-bold text-gray-900">{active.name}</h3>
          <p className="text-sm text-gray-500">{active.position}</p>
        </div>

        <div className="flex-1">
          <p className="text-2xl text-gray-600 italic max-w-xl">
            “{active.quote}”
          </p>

          <div className="flex gap-2 mt-6 justify-start">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`h-[2px] w-6 rounded-full transition-all duration-300 ${
                  i === activeIndex ? "bg-blue-500" : "bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div> */}
{/* <AnimatedTestimonials
  testimonials={items.map((item) => ({
    quote: item.quote,
    name: item.name,
    designation: item.position,
    src: item.image?.url?.startsWith("http")
      ? item.image.url
      : `${getStrapiURL()}${item.image?.url}`,
  }))}
/> */}

<AnimatedTestimonials
  testimonials={items.map((item) => ({
    quote: item.quote ?? "",
    name: item.name ?? "",
    designation: item.position ?? "",
    // ❗ no base prefix here — just the raw Strapi URL
    src: String(resolveMediaUrl(item.image)),
    }))
    .filter(t => !!t.src) // optional: drop entries without an image
  }
/>
</div>


      
     
    </section>
  );
}

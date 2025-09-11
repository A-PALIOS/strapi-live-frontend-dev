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
    <section className="py-12 flex justify-center">

      <div className="max-w-6xl mx-auto px-4">
  {/* Heading + CTA on one line */}
  <div className="flex items-center justify-between mb-6 ml-4">
    <h3 className="text-3xl font-agenda-medium">{heading}</h3>
    {cta && (
      <Link
        href={cta.href}
        target={cta.isExternal ? "_blank" : "_self"}
        className="inline-flex items-center font-agenda-regular text-xl font-medium text-gray-900 hover:opacity-80 transition"
        style={{color: "#323C43"}}
      >
        {cta.text}
        <div
          style={{ marginLeft: "10px" }}
          className="flex items-center justify-center rounded"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            className="w-5 h-5 transform -rotate-135"
            style={{ color: "#221D1D" }}
          >
            <path d="M11 3h2v12.17l3.59-3.58L18 13l-6 6-6-6 1.41-1.41L11 15.17V3z" />
          </svg>
        </div>
      </Link>
    )}
  </div>


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

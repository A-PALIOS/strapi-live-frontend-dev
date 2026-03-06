"use client";

import React from "react";
import type { CoverflowShowcaseProps, ShowcaseItemProps } from "@/types";
import { CoverflowShowcaseAppleTVDemo } from "@/components/ui/CoverflowShocaseAppleTVDemo"; 
// 👆 import from wherever your AppleTV component currently lives
// If you kept it in the same file, we can adjust.
import CardSwap, { Card } from '../ui/CardSwap'
import Link from "next/link";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL ?? "http://localhost:1337";

const mediaUrl = (u?: string) => {
  if (!u) return "";
  if (u.startsWith("http")) return u;

  const path = u.startsWith("/") ? u : `/${u}`;
  // handle spaces in filenames
  return `${STRAPI_URL}${path}`.replace(/ /g, "%20");
};


const cards = [
  {
    tag: "Smooth",
    image:
      process.env.NEXT_PUBLIC_STRAPI_API_URL+"/uploads/swapimage1_61da3b189e.png",
    alt: "Smooth digital experience",
  },
  {
    tag: "Customizable",
    image:
      process.env.NEXT_PUBLIC_STRAPI_API_URL+"/uploads/swap2_7c7c3ec22c.png",
    alt: "Customizable digital experience",
  },
  {
    tag: "Health Sec",
    image:
      process.env.NEXT_PUBLIC_STRAPI_API_URL+"/uploads/swap4_0c1b2adf9b.png",
    alt: "Reliable digital experience",
  },
  {
    tag: "EU",
    image:
      process.env.NEXT_PUBLIC_STRAPI_API_URL+"/uploads/swap3_83c0c78a32.png",
    alt: "Eu",
  },
];


function toSite(item: ShowcaseItemProps) {
  return {
    id: String(item.id),
    title: item.title,
    subtitle: item.subtitle ?? "",
    url: item.url,
    description: item.description ?? "",
    tags: item.tags?.map((t) => t.label) ?? [],
    stack: item.stack?.map((s) => s.label) ?? [],
thumb: mediaUrl(item.thumb?.url),
screenshots: item.screenshots?.map((img) => mediaUrl(img.url)) ?? [],
  };
}

export function CoverflowShowcase({ ...block }: CoverflowShowcaseProps) {
  const sites = (block.items ?? []).map(toSite);

  // If you want, we can use these to control autoplay/options inside the modal next.
  const autoplay = block.autoplay ?? true;
  const autoplayDelayMs = block.autoplayDelayMs ?? 3200;
  const startIndex = block.startIndex ?? 0;

  return (
    <section id={block.sectionId || undefined} className="relative w-full py-14 bg-[#071426]">


   <section className="relative overflow-hidden  bg-[#071426] text-white">
      <div className="mx-auto grid min-h-[740px] max-w-[1440px] grid-cols-1 items-center gap-10 px-6 py-20 md:px-10 lg:grid-cols-2 lg:gap-6 lg:px-16 xl:px-24 2xl:px-32">
        <div className="relative z-auto max-w-[520px]">
          <p className="mb-4 text-sm uppercase tracking-[0.24em] text-white/45">
            Digital Experiences
          </p>

          <h2 className="max-w-[520px] text-[42px] font-semibold leading-[0.98] tracking-[-0.04em] text-white md:text-[56px]">
Discover the websites we’ve built      
    </h2>

          <p className="mt-6 max-w-[520px] text-[20px] leading-[1.45] text-white/55 md:text-[22px]">
         Take a closer look at the websites and digital solutions
we've created for our clients. Each project is designed to
deliver performance, usability, and modern design.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
      <div className="mt-8">
          {/* IMPORTANT:
              We’ll slightly update your AppleTV component to accept these props.
              For now this line assumes we’ll do that in the next step. */}
                <CoverflowShowcaseAppleTVDemo
            buttonText={block.buttonText ?? "View Websites"}
            sites={sites}
            autoplay={block.autoplay ?? true}
            autoplayDelayMs={block.autoplayDelayMs ?? 3200}
            startIndex={block.startIndex ?? 0}
            />
        </div>

           
          </div>
        </div>

        <div className="relative min-h-[580px] w-full">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(97,61,255,0.16),transparent_55%)]" />

          <div className="relative h-[580px] w-full">
            <CardSwap
              width={520}
              height={360}
              cardDistance={64}
            verticalDistance={48}
              delay={6000}
              pauseOnHover={false}
              skewAmount={4}
              easing="elastic"
            >
              {cards.map((item, index) => (
              <Card
                    key={index}
                    customClass="shadow-[0_25px_80px_rgba(0,0,0,0.45)]"
                  >
                    <div className="relative h-full w-full bg-black">
                    <div className="absolute right-5 top-5 z-20 rounded-full border border-white/40 bg-[#120D1E]/90 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-md">
                      {item.tag}
                    </div>

                    <img
                      src={item.image}
                      alt={item.alt}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
                  </div>
                </Card>
              ))}
            </CardSwap>
          </div>
        </div>
      </div>
    </section>




 
    </section>
  );
}
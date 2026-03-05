"use client";

import React from "react";
import type { CoverflowShowcaseProps, ShowcaseItemProps } from "@/types";
import { CoverflowShowcaseAppleTVDemo } from "@/components/ui/CoverflowShocaseAppleTVDemo"; 
// 👆 import from wherever your AppleTV component currently lives
// If you kept it in the same file, we can adjust.

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";

const mediaUrl = (u?: string) => {
  if (!u) return "";
  if (u.startsWith("http")) return u;

  const path = u.startsWith("/") ? u : `/${u}`;
  // handle spaces in filenames
  return `${STRAPI_URL}${path}`.replace(/ /g, "%20");
};

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
    <section id={block.sectionId || undefined} className="relative w-full py-14">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
        {block.heading ? (
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
            {block.heading}
          </h2>
        ) : null}

        {block.subheading ? (
          <p className="mt-3 text-gray-600 max-w-2xl">{block.subheading}</p>
        ) : null}

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
    </section>
  );
}
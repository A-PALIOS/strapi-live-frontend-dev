"use client";

import { useMemo, useState } from "react";
import type { ExpertiseVideoTabsBlockProps } from "@/types";
import { StrapiImage } from "../StrapiImage";
// import { StrapiVideo } from "../StrapiVideo";

function getStrapiMediaUrl(url?: string | null) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${url}`;
}

export function ExpertiseVideoTabs({
  Eyebrow,
  items,
}: Readonly<ExpertiseVideoTabsBlockProps>) {
  const defaultIndex = useMemo(() => {
    const foundIndex = items.findIndex((item) => item.isDefault);
    return foundIndex >= 0 ? foundIndex : 0;
  }, [items]);

  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  const activeItem = items[activeIndex];

  console.log("activeItem", activeItem.video);

  if (!items?.length) return null;

  return (
    <section className="w-full">
      <div style={{ background: "linear-gradient(25deg, rgb(148, 117, 96) 0%, rgb(111, 113, 118) 25%, rgb(79, 110, 133) 50%, rgb(47, 109, 157) 100%)" }}
       className="grid w-full px-6 md:px-10 lg:px-16 xl:px-20  grid-cols-1 md:grid-cols-[48%_52%]">
        <div className="relative overflow-hidden px-6 py-8 md:min-h-[590px] md:px-10 md:py-8">
          <div className="absolute inset-0 opacity-20">
            <div className="flex h-full">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-full flex-1" />
              ))}
            </div>
          </div>

          <div className="relative h-full">
            {Eyebrow ? (
              <p className="mb-10 text-[13px] uppercase tracking-[0.04em] text-white/95">
                {Eyebrow}
              </p>
            ) : null}

            <div className="rounded-[4px] border border-white/20 bg-white/5 p-2 md:p-3">
              {items.map((item, index) => {
                const isActive = index === activeIndex;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className="group block w-full text-left"
                  >
                    <div className="flex items-start justify-between gap-4 px-2 py-6 md:px-3 md:py-6">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-[24px] font-light uppercase leading-[1.1] tracking-[-0.03em] text-white md:text-[32px]">
                          {item.title}
                        </h3>

                        {isActive && item.description ? (
                          <p className="mt-5 max-w-[520px] text-[15px] leading-[1.5] text-white/80 md:text-[17px]">
                            {item.description}
                          </p>
                        ) : null}
                      </div>

                      <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center text-white transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                        {item.icon?.url ? (
                          <StrapiImage
                            src={item.icon.url}
                            alt={item.icon.alternativeText || item.title}
                            width={18}
                            height={18}
                            className="h-[18px] w-[18px] object-contain"
                          />
                        ) : (
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-5 w-5"
                            aria-hidden="true"
                          >
                            {isActive ? (
                              <path d="M7 7L17 17M17 17H7M17 17V7" />
                            ) : (
                              <path d="M7 17L17 7M17 7H7M17 7V17" />
                            )}
                          </svg>
                        )}
                      </span>
                    </div>

                    {index !== items.length - 1 ? (
                      <div className="mx-2 h-px bg-white/30 md:mx-3" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="relative min-h-[320px] overflow-hidden h-fit md:min-h-[520px]">
          {activeItem?.video?.url ? (
            <video
              key={activeItem.video.url}
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              controls={false}
            >
              <source src={getStrapiMediaUrl(activeItem.video.url)} />
            </video>
          ) : (
            <div className="flex h-full items-center justify-center text-center text-[16px] text-[#1E2A39]/60">
              No video selected
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
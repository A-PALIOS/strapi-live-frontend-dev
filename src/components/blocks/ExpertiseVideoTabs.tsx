"use client";

import { useMemo, useState } from "react";
import type { ExpertiseVideoTabsBlockProps } from "@/types";
import { StrapiImage } from "../StrapiImage";

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

  if (!items?.length) return null;

  const activeItem = items[activeIndex];

  return (
    <section
      className="w-full overflow-hidden"
      style={{
        background:
          "linear-gradient(25deg, #947560 0%, #6f7176 25%, #4f6e85 50%, #2f6d9d 100%)",
      }}
    >
      <div className="relative grid min-h-screen w-full grid-cols-1 grid-rows-[auto_1fr] xl:grid-cols-2">
        {/* EYEBROW ROW — spans both columns, z-10 so it sits above the video */}
        {Eyebrow ? (
          <div className="relative z-10 col-span-1 md:col-span-2">
            <p
              style={{ letterSpacing: "-1.6px" }}
              className="px-6 pt-8 pb-6 font-agenda-medium text-[32px] font-medium uppercase leading-normal text-white md:px-10 md:pt-10 lg:px-14 xl:px-20"
            >
              {Eyebrow}
            </p>
            <div className="h-px bg-white" />
          </div>
        ) : null}

        {/* LEFT CONTENT */}
        <div className="relative z-10 pl-8 pr-6 py-10 md:pl-[80px] md:pr-[80px] md:py-14">
          <div className="flex h-full flex-col justify-center">
            <div className="rounded-[8px] border border-white p-4">
              {items.map((item, index) => {
                const isActive = index === activeIndex;

                return (
                  <div
                    key={item.id}
                    className={
                      index !== items.length - 1
                        ? "border-b border-white/30 py-10"
                        : "pt-10 pb-10"
                    }
                  >
                    <button
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className="group flex w-full cursor-pointer items-start justify-between gap-4 text-left"
                    >
                      <h3
                        style={{ letterSpacing: "-1.2px" }}
                        className="font-agenda-medium text-[18px] uppercase leading-normal tracking-[-0.05em] text-white whitespace-nowrap md:text-[30px] lg:text-[32px]"
                      >
                        {item.title}
                      </h3>

                      <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center text-white">
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
                            className={[
                              "h-5 w-5 shrink-0 transition-transform duration-300",
                              isActive ? "rotate-90" : "rotate-0",
                            ].join(" ")}
                            aria-hidden="true"
                          >
                            <path d="M7 17L17 7M17 7H7M17 7V17" />
                          </svg>
                        )}
                      </span>
                    </button>

                    {isActive && item.description ? (
                      <p className="mt-5 font-agenda-medium md:text-[24px] sm:text-[24px] font-medium leading-[1.2] tracking-[-0.05em] text-[#FEFEFE]">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN placeholder — keeps the grid slot so left doesn't expand */}
        <div className="hidden xl:block" style={{ backgroundColor: "white" }} />

        {/* RIGHT VIDEO — absolutely positioned from section top, shorter than full height */}
        <div
          className="absolute right-0 top-0 hidden w-1/2 overflow-hidden xl:block"
          style={{ height: "calc(100% - 120px)", borderRadius: "0 0 16px 0" }}
        >
          {activeItem?.video?.url ? (
            <video
              key={activeItem.video.url}
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              controls={false}
            >
              <source src={getStrapiMediaUrl(activeItem.video.url)} />
            </video>
          ) : (
            <div className="flex h-full items-center justify-center text-center text-[16px] text-white/70">
              No video selected
            </div>
          )}
        </div>

        {/* MOBILE VIDEO — shown only on small screens, below the accordion */}
        {/* <div className="relative hidden lg:block min-h-[300px] overflow-hidden md:hidden">
          {activeItem?.video?.url ? (
            <video
              key={activeItem.video.url}
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              controls={false}
            >
              <source src={getStrapiMediaUrl(activeItem.video.url)} />
            </video>
          ) : null}
        </div> */}
      </div>
    </section>
  );
}

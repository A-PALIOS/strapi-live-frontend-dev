"use client";

import { useMemo, useState } from "react";
import type { ExpertiseVideoTabsBlockProps } from "@/types";
import { StrapiImage } from "../StrapiImage";

function getStrapiMediaUrl(url?: string | null) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${url}`;
}

/* ------------------------------------------------------------------ *
 * Fluid type and spacing
 *
 * The Figma board is a fixed 1920-wide canvas, so every size in it is
 * really "this many px AT 1920". Hard-coding those px made the section
 * break on a smaller laptop: at 1280 the 32px titles still measured 32px
 * and, with `whitespace-nowrap`, "Funding & Programme Development" ran
 * 60px past the right edge of its own card.
 *
 * Each value below is therefore expressed as its Figma size converted to
 * vw (size / 1920 * 100), clamped so it stops growing past the design at
 * wide viewports and stays legible at narrow ones. At exactly 1920 every
 * one of them resolves to the Figma number.
 * ------------------------------------------------------------------ */

/** 32px at 1920 — section eyebrow and each tab title. */
const TITLE_SIZE = "clamp(17px, 1.667vw, 32px)";
/** 24px at 1920 — the open tab's body copy. */
const BODY_SIZE = "clamp(14px, 1.25vw, 24px)";
/** 80px at 1920 — left column side padding. */
const COLUMN_PAD_X = "clamp(24px, 4.17vw, 80px)";
/** 56px at 1920 — left column top/bottom padding. */
const COLUMN_PAD_Y = "clamp(24px, 2.9vw, 56px)";
/** 40px at 1920 — space above/below each tab row. */
const ROW_PAD_Y = "clamp(16px, 2.1vw, 40px)";

/** The photo is 1080 tall where the gradient column beside it is 1151
 *  (Figma node 2253:3503), so it stops just short of the bottom. Stating
 *  it as that ratio of the section keeps the relationship at any height —
 *  unlike an aspect ratio, which stops tracking the section as soon as
 *  the accordion grows taller than half the viewport width, leaving the
 *  white gap. At 1920 with a 1151-tall section this is 960 x 1080: the
 *  Figma size exactly. */
const VIDEO_HEIGHT = "calc(100% * 1080 / 1151)";

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
              style={{ letterSpacing: "-0.05em", fontSize: TITLE_SIZE }}
              className="px-6 pt-8 pb-6 font-agenda-medium font-medium uppercase leading-normal text-white md:px-10 md:pt-10 lg:px-14 xl:px-20"
            >
              {Eyebrow}
            </p>
            <div className="h-px bg-white" />
          </div>
        ) : null}

        {/* LEFT CONTENT */}
        <div
          className="relative z-10"
          style={{
            paddingLeft: COLUMN_PAD_X,
            paddingRight: COLUMN_PAD_X,
            paddingTop: COLUMN_PAD_Y,
            paddingBottom: COLUMN_PAD_Y,
          }}
        >
          <div className="flex h-full flex-col justify-center">
            <div className="rounded-[8px] border border-white p-4">
              {items.map((item, index) => {
                const isActive = index === activeIndex;

                return (
                  <div
                    key={item.id}
                    className={
                      index !== items.length - 1
                        ? "border-b border-white/30"
                        : ""
                    }
                    style={{ paddingTop: ROW_PAD_Y, paddingBottom: ROW_PAD_Y }}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className="group flex w-full cursor-pointer items-start justify-between gap-4 text-left"
                    >
                      {/* min-w-0 lets the title shrink inside the flex row;
                          without it a long title pushes the arrow out of the
                          card instead of wrapping. No `whitespace-nowrap`:
                          that is what made "Funding & Programme Development"
                          overflow on a small laptop. */}
                      <h3
                        style={{
                          letterSpacing: "-0.05em",
                          fontSize: TITLE_SIZE,
                        }}
                        className="min-w-0 font-agenda-medium uppercase leading-normal text-white [overflow-wrap:anywhere]"
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
                              "h-7 w-7 shrink-0 transition-transform duration-300",
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
                      <p
                        style={{ fontSize: BODY_SIZE }}
                        className="mt-5 font-agenda-regular leading-[1.2] tracking-[-0.05em] text-[#FFFFFF]"
                      >
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

        {/* RIGHT VIDEO — absolutely positioned from section top, shorter than
            full height.

            Size comes straight from Figma (CMT_WEBSITE_NEW, node 2253:3503):
            inside a 1920-wide section the photo is 960 x 1080 — exactly half
            the width, sitting beside a gradient column that runs the full
            1151. See VIDEO_HEIGHT for why that is expressed as a share of the
            section rather than as an aspect ratio. */}
        <div
          className="absolute right-0 top-0 hidden w-1/2 overflow-hidden xl:block"
          style={{ height: VIDEO_HEIGHT, borderRadius: "0 0 16px 0" }}
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

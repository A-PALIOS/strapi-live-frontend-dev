"use client";

import Link from "next/link";
import Image from "next/image";
import type { RelevantProjectsBlockProps } from "@/types";

function getStrapiMediaUrl(url?: string | null) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${url}`;
}

/**
 * Figma: Relevant_Projects — node 2115:3831 (card = 576 x 702 @ 1920)
 *
 * Every size inside a card is expressed as a share of the CARD width (cqw)
 * with a clamp() floor and the Figma value as the ceiling, so the card keeps
 * the designed proportions on 1920 and stays readable on laptops.
 *   32px pad  -> 5.556cqw   28px title -> 4.861cqw   24px body -> 4.167cqw
 *   18px tag  -> 3.125cqw   217px pill -> 37.674cqw  40px inset -> 6.944cqw
 *
 * Panel: always visible on phones/tablets (< lg, no hover); hidden and
 * revealed on hover from lg up.
 *
 * The overlay panel is content-deterministic — 1 title line, a fixed-height
 * tag row and a 3-line description box are always reserved — so all cards
 * render the exact same panel height regardless of their copy.
 */
export function RelevantProjects({
  eyebrow,
  cta,
  projects,
  theme,
}: Readonly<RelevantProjectsBlockProps>) {
  if (!projects?.length) return null;

  const isBlack = theme === "black";

  return (
    <section
      className={`w-full px-6 pt-16 pb-24 md:px-10 md:pt-20 md:pb-28 lg:px-12 xl:px-16 2xl:px-24 2xl:pb-[200px]${
        isBlack ? " bg-black" : ""
      }`}
    >
      {/* Section_Heading — 2115:3832 */}
      <div className="flex min-h-[64px] items-center justify-between gap-6 xl:min-h-[83px]">
        {eyebrow ? (
          <p
            className={`font-agenda-medium text-[20px] uppercase leading-none tracking-[-1px] md:text-[24px] lg:text-[26px] xl:text-[28px] 2xl:text-[32px] 2xl:tracking-[-1.6px] ${
              isBlack ? "text-white" : "text-[#242A2E]"
            }`}
          >
            {eyebrow}
          </p>
        ) : (
          <span aria-hidden />
        )}

        {cta?.text && cta?.href ? (
          <Link
            href={cta.href}
            target={cta.isExternal ? "_blank" : undefined}
            rel={cta.isExternal ? "noopener noreferrer" : undefined}
            className="group inline-flex shrink-0 items-center gap-3"
          >
            <span
              className={`font-agenda-regular whitespace-nowrap text-[16px] leading-[1.2] tracking-[-0.8px] md:text-[18px] lg:text-[20px] xl:text-[22px] 2xl:text-[24px] 2xl:tracking-[-1.2px] ${
                isBlack ? "text-white" : "text-[#000F1D]"
              }`}
            >
              {cta.text}
            </span>
            <span
              aria-hidden
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[2px] bg-[#FF7417] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 xl:h-8 xl:w-8"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.75 11.25L11.25 3.75M11.25 3.75H5.75M11.25 3.75V9.25"
                  stroke="#FFFFFF"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Link>
        ) : null}
      </div>

      {/* Frame 34676 — 2115:3835 (flush cards, no gutter) */}
      <div className="mt-6 grid grid-cols-1 gap-0 md:grid-cols-2 lg:grid-cols-3 xl:mt-[38px]">
        {projects.map((item) => (
          <Link
            key={item.id}
            href={item.linkUrl || "#"}
            className="group @container relative block aspect-[576/702] min-h-[420px] w-full overflow-hidden bg-[#b9afa7]"
          >
            {item.backgroundImage?.url ? (
              <Image
                src={getStrapiMediaUrl(item.backgroundImage.url)}
                alt={
                  item.backgroundImage.alternativeText ||
                  item.title ||
                  "Project image"
                }
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            ) : null}

            {/* scrim — rgba(0,0,0,0.2) */}
            <div className="absolute inset-0 bg-black/20 transition-colors duration-300 group-hover:bg-black/35" />

            {/* logo — 2115:3846, 1.5x the Figma box, inset 40/576 */}
            {item.logo?.url ? (
              <div className="absolute left-[clamp(18px,6.944cqw,40px)] top-[clamp(18px,6.944cqw,40px)] h-[clamp(46px,14.583cqw,84px)] w-[clamp(132px,41.667cqw,240px)]">
                <Image
                  src={getStrapiMediaUrl(item.logo.url)}
                  alt={item.logo.alternativeText || item.title || "Project logo"}
                  fill
                  sizes="240px"
                  className="object-contain"
                  style={{ objectPosition: "left bottom" }}
                />
              </div>
            ) : null}

            {/* Project Description — 2115:3837, revealed on hover / focus */}
            <div className="absolute inset-x-0 bottom-0 flex translate-y-0 flex-col gap-[clamp(12px,5.556cqw,32px)] bg-black/40 p-[clamp(16px,5.556cqw,32px)] opacity-100 transition-all duration-500 ease-out lg:pointer-events-none lg:translate-y-6 lg:opacity-0 lg:group-hover:pointer-events-auto lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:group-focus-visible:pointer-events-auto lg:group-focus-visible:translate-y-0 lg:group-focus-visible:opacity-100">
              <h3 className="line-clamp-1 font-agenda-medium text-[clamp(17px,4.861cqw,28px)] uppercase leading-[1.15] text-white">
                {item.title}
              </h3>

              {/* Content — 2115:3839 */}
              <div className="flex flex-col gap-[clamp(10px,4.167cqw,24px)]">
                {/* Keywords — 2115:3840 (fixed row so panels stay equal) */}
                <div className="flex h-[clamp(36px,8.681cqw,52px)] flex-nowrap items-stretch gap-[clamp(8px,3.125cqw,18px)] overflow-hidden">
                  {item.tags?.map((tag) => (
                    <span
                      key={tag.id}
                      className="flex w-[clamp(92px,37.674cqw,217px)] shrink items-center justify-center rounded-[8px] border border-white/30 px-[1.389cqw] text-center font-agenda-medium text-[clamp(11px,3.125cqw,18px)] leading-none text-white"
                    >
                      {tag.label}
                    </span>
                  ))}
                </div>

                <p className="line-clamp-3 min-h-[4.05em] font-agenda-regular text-[clamp(13px,4.167cqw,24px)] leading-[1.35] text-white">
                  {item.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

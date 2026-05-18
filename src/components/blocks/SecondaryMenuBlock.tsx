// components/blocks/SecondaryMenuBlock.tsx
"use client";

import type { AboutInfoProps } from "@/types";
import type { SecondaryMenuProps as SecondaryMenuData } from "@/utils/mapSecondaryMenu";
import { useScrollSpy } from "@/utils/useScrollspy";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { StrapiImage } from "../StrapiImage";

function getStrapiMediaUrl(url?: string | null) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${url}`;
}

interface ExtendedSecondaryMenuProps extends SecondaryMenuData {
  aboutInfoBlocks: AboutInfoProps[];
  global?: SecondaryMenuData | null;
}

export function SecondaryMenuBlock({
  title,
  slug,
  items,
  theme,
  global,
  aboutInfoBlocks,
}: ExtendedSecondaryMenuProps) {
  const pathname = usePathname();

  const sectionIds = aboutInfoBlocks
    .map((info) =>
      info.heading ? info.heading.toLowerCase().replace(/\s+/g, "-") : null
    )
    .filter(Boolean) as string[];

  const activeId = useScrollSpy(sectionIds, 120);

  const [isOpen, setIsOpen] = useState(false);
  const globalItems = global?.items ?? [];

  const firstItem = items?.[0]; // #mobile
  const mobileMenuItems = items?.slice(1) ?? []; // #mobile

  const themes = {
    white: "bg-white/40 border-white/20 text-black",
    black: "bg-black border-white/20 text-white",
  };

  const isWhite = theme === "white";

  const currentTheme = themes[theme as keyof typeof themes] || themes.white;

  return (
    <div
      className={`sticky top-0 z-30 w-full px-6 py-5 md:px-10 md:py-6 lg:px-16 xl:px-20 backdrop-blur-md ${currentTheme}`}
      style={{ borderBottom: "1px solid #F5F4F4" }}
    >
      <div className="mx-auto flex w-full items-center justify-between">
        <div className="flex items-center gap-2"></div>
      </div>

      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-6 text-xl text-white">
          {/* #mobile - first item stays visible on mobile, usually the logo/image */}
          {firstItem?.icon && (
            <Link
              href={firstItem.url || "#"}
              className="flex items-center"
            >
              <StrapiImage
                src={getStrapiMediaUrl(String(firstItem.icon.url))}
                alt={firstItem.label || "Logo"}
                width={200}
                height={200}
                className="object-contain"
              />
            </Link>
          )}

          {/* Desktop menu */}
          {/* <div className="hidden flex-wrap items-center gap-6 md:flex"> */}
          <div className="hidden flex-wrap items-center gap-6 lg:flex"> {/* #ipad */}
            {items?.slice(1).map((item) => {
              const isHash = item.url?.startsWith("#");
              const isActivePage = !!item.url && !isHash && pathname === item.url;

              if (item?.icon != null) {
                return (
                  <Link
                    key={String(item.id ?? item.label)}
                    href={item.url || "#"}
                    className={`font-agenda-regular transition-colors duration-300 ${
                      isActivePage
                        ? "text-[#1E9BFB]"
                        : "text-black/70 hover:text-black"
                    }`}
                    style={{ fontSize: "22px" }}
                  >
                    <StrapiImage
                      src={getStrapiMediaUrl(String(item.icon.url))}
                      alt={"error.png"}
                      width={200}
                      height={200}
                      className="object-contain"
                    />
                  </Link>
                );
              }

              return (
                <Link
                  key={String(item.id ?? item.label)}
                  href={item.url || "#"}
                  className={`font-agenda-regular transition-colors duration-300 ${
                    isActivePage
                      ? theme === "white"
                        ? "text-black"
                        : "text-white"
                      : theme === "white"
                        ? "text-zinc-800/50 hover:text-[#1E9BFB]"
                        : "text-white hover:text-white"
                  }`}
                  style={{ fontSize: "22px" }}
                >
                  {item.label}
                </Link>
              );
            })}

            {aboutInfoBlocks.length > 0 && (
              <span className={theme === "white" ? "text-[#969698]" : "text-white"}>
                |
              </span>
            )}

            {aboutInfoBlocks.map((info) => {
              const id = info.heading?.toLowerCase().replace(/\s+/g, "-") ?? "";
              const isActive = id === activeId;

              return (
                <a
                  key={info.id}
                  href={`#${id}`}
                  className={[
                    "font-agenda-regular transition-colors duration-300",
                    isActive
                      ? "text-[#1E9BFB] decoration underline"
                      : theme === "white"
                        ? "text-zinc-800/50"
                        : "text-white",
                  ].join(" ")}
                  style={{ fontSize: "22px" }}
                >
                  {info.heading}
                </a>
              );
            })}
          </div>
        </div>

        {/* #mobile - burger button only visible on mobile */}
        <button
          onClick={() => setIsOpen((v) => !v)}
          // className={`md:hidden transition-colors ${
          className={`lg:hidden transition-colors ${ // #ipad
            theme === "white" ? "text-black" : "text-white"
          }`}
          aria-label="Toggle secondary menu"
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <svg
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* #mobile - dropdown panel */}
      {isOpen && (
        // <div className="mt-5 border-t border-white/20 pt-5 md:hidden">
        <div className="mt-5 border-t border-white/20 pt-5 lg:hidden"> {/* #ipad */}
          <nav className="flex flex-col gap-4">
            {mobileMenuItems.map((item) => (
              <Link
                key={String(item.id ?? item.label)}
                href={item.url || "#"}
                className={`font-agenda-regular text-[22px] transition-colors ${
                  theme === "white"
                    ? "text-zinc-800/70 hover:text-[#1E9BFB]"
                    : "text-white hover:text-[#1E9BFB]"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {/* {aboutInfoBlocks.map((info) => {
              const id = info.heading?.toLowerCase().replace(/\s+/g, "-") ?? "";
              const isActive = id === activeId;

              return (
                <a
                  key={info.id}
                  href={`#${id}`}
                  className={`font-agenda-regular text-[22px] transition-colors ${
                    isActive
                      ? "text-[#1E9BFB] decoration underline"
                      : theme === "white"
                        ? "text-zinc-800/70 hover:text-[#1E9BFB]"
                        : "text-white hover:text-[#1E9BFB]"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {info.heading}
                </a>
              );
            })} */}

            {/* {globalItems.map((item) => (
              <Link
                key={`g-${String(item.id ?? item.label)}-${item.url}`}
                href={item.url || "#"}
                className={`font-agenda-regular text-[22px] transition-colors ${
                  theme === "white"
                    ? "text-zinc-800/70 hover:text-[#1E9BFB]"
                    : "text-white hover:text-[#1E9BFB]"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))} */}
          </nav>
        </div>
      )}
    </div>
  );
}
// components/blocks/SecondaryMenuBlock.tsx
'use client';

import type { AboutInfoProps } from "@/types";
import type { SecondaryMenuProps as SecondaryMenuData } from "@/utils/mapSecondaryMenu";
import { useScrollSpy } from "@/utils/useScrollspy";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

interface ExtendedSecondaryMenuProps extends SecondaryMenuData {
  aboutInfoBlocks: AboutInfoProps[];
  global?: SecondaryMenuData | null; // second/global menu (goes in burger)
}

export function SecondaryMenuBlock({
  title,
  slug,
  items,
  global,
  aboutInfoBlocks,
}: ExtendedSecondaryMenuProps) {
  const pathname = usePathname();

  // Build section anchors from AboutInfo blocks
  const sectionIds = aboutInfoBlocks
    .map((info) => (info.heading ? info.heading.toLowerCase().replace(/\s+/g, "-") : null))
    .filter(Boolean) as string[];
  const activeId = useScrollSpy(sectionIds, 120);

  const [isOpen, setIsOpen] = useState(false);
  const globalItems = global?.items ?? [];

  return (
    <div className="sticky top-0 z-50 bg-white px-4 py-3">
      {/* Row 1: logo area (kept for parity with StickyMenuBlock; wire a logo if you add one later) */}
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          {/* Optional: render a logo here if you later add it to your menu model */}
        </div>
      </div>

      {/* Row 2: burger (left) + inline page links + '|' + section anchors */}
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex flex-wrap gap-4 text-lg text-gray-700">
          {/* Burger (visible on desktop too) */}
          <button
            onClick={() => setIsOpen((v) => !v)}
            className="text-gray-700 hover:text-blue-600 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <svg
                className="w-6 h-6"
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
                className="w-6 h-6"
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

          {/* Burger panel content (GLOBAL goes here) */}
          {isOpen && (
            <div className="px-6 pb-4">
              <nav className="flex flex-col gap-4 mb-4">
                {globalItems.map((item) => (
                  <Link
                    key={`g-${String(item.id ?? item.label)}-${item.url}`}
                    href={item.url || "#"}
                    className="font-agenda-medium text-[#242A2E] hover:text-blue-500 transition"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          )}

          {/* Inline page-level links (use items from the selected menu) */}
          {items?.map((item) => {
            const isHash = item.url?.startsWith("#");
            const isActivePage = !!item.url && !isHash && pathname === item.url;
            return (
              <Link
                key={String(item.id ?? item.label)}
                href={item.url || "#"}
                className={`transition-colors text-[#242A2E]/50 font-agenda-regular duration-300 ${
                  isActivePage ? "text-[#242A2E]/100 font-agenda-regular" : ""
                }`}
                style={{ fontSize: "20px" }}
              >
                {item.label}
              </Link>
            );
          })}

          {/* Separator */}
          {aboutInfoBlocks.length > 0 && (
            <span className="text-gray-400">|</span>
          )}

          {/* In-page scrollspy links */}
          {aboutInfoBlocks.map((info) => {
            const id = info.heading?.toLowerCase().replace(/\s+/g, "-") ?? "";
            const isActive = id === activeId;
            return (
              <a
                key={info.id}
                href={`#${id}`}
                className={[
                  "transition-colors font-agenda-regular duration-300",
                  isActive ? "text-[#1E9BFB]" : "text-[#242A2E]/50",
                ].join(" ")}
                style={{ fontSize: "20px" }}
              >
                {info.heading}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

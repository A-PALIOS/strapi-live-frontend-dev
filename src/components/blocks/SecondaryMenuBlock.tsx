// components/blocks/SecondaryMenuBlock.tsx
'use client';

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
  global?: SecondaryMenuData | null; // second/global menu (goes in burger)

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

  // Build section anchors from AboutInfo blocks
  const sectionIds = aboutInfoBlocks
    .map((info) => (info.heading ? info.heading.toLowerCase().replace(/\s+/g, "-") : null))
    .filter(Boolean) as string[];
  const activeId = useScrollSpy(sectionIds, 120);

  const [isOpen, setIsOpen] = useState(false);
  const globalItems = global?.items ?? [];

  const themes = {
    white: "bg-white/40 border-white/20 text-black",
    black: "bg-black border-white/20 text-white",
  };

  const isWhite = theme === "white";

  const backgroundClass = isWhite ? "black" : "white";
  

  // Use the theme value to pick the class, defaulting to 'white' if theme is null
  const currentTheme = themes[theme as keyof typeof themes] || themes.white;


  
  return (
    // <div className="sticky top-0 z-30 w-full bg-transparent px-6 py-5 md:px-10 md:py-6 lg:px-16 xl:px-20">
  //   <div className="sticky top-0 z-30 w-full px-6 py-5 md:px-10 md:py-6 lg:px-16 xl:px-20
  // backdrop-blur-md bg-white/10 border-b border-white/20">
  <div className={`sticky top-0 z-30 w-full px-6 py-5 md:px-10 md:py-6 lg:px-16 xl:px-20 backdrop-blur-md ${currentTheme} ` } style={{borderBottom:"1px solid white"}}>

    
      {/* Row 1: logo area (kept for parity with StickyMenuBlock; wire a logo if you add one later) */}
      <div className="mx-auto flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Optional: render a logo here if you later add it to your menu model */}
        </div>
      </div>

      {/* Row 2: burger (left) + inline page links + '|' + section anchors */}
      <div className="flex w-full justify-between">
        <div className="flex flex-wrap items-center gap-6 text-xl text-white">
          {/* Burger (visible on desktop too) */}
          {/* <button
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
          

          {/* http://5.77.39.26:1337/uploads/Logo_Color_e94b003ceb.svg */}
          {/* <Link 
          className="flex items-center"
          href={"/"}
          >
          <StrapiImage
              src={getStrapiMediaUrl("/uploads/Logo_Color_e94b003ceb.svg") }
              alt={"error.png" }
              width={200}
              height={200}
              className="object-contain"
            >
            </StrapiImage>
          </Link> */}

          {/* Inline page-level links (use items from the selected menu) */}
          {items?.map((item) => {
            const isHash = item.url?.startsWith("#");
            const isActivePage = !!item.url && !isHash && pathname === item.url;
            console.log("item,: ",item)
            if(item?.icon!=null){

                return (
                <Link
                  key={String(item.id ?? item.label)}
                  href={item.url || "#"}
                  // className={`font-agenda-regular transition-colors duration-300 ${
                  //   isActivePage ? "text-white" : "text-white/70"
                  // }`}
                  className={`font-agenda-regular transition-colors duration-300 ${
                    isActivePage ? "text-[#1E9BFB]" : "text-black/70 hover:text-black"
                  }`}
                  style={{ fontSize: "22px" }}
                >
                  <StrapiImage
                    src={getStrapiMediaUrl(String(item.icon.url)) }
                    alt={"error.png" }
                    width={200}
                    height={200}
                    className="object-contain"
                  >
                  </StrapiImage>
                </Link>
              );

            }else{

            

              return (
                <Link
                  key={String(item.id ?? item.label)}
                  href={item.url || "#"}
                  // className={`font-agenda-regular transition-colors duration-300 ${
                  //   isActivePage ? "text-white" : "text-white/70"
                  // }`}
                  className={`font-agenda-regular transition-colors duration-300 ${
                    isActivePage ? 
                    (theme=="white" ? "text-black":"text-white") : 
                    (theme=="white" ? `text-zinc-800/50 hover:text-[#1E9BFB]`: "text-white hover:text-white")
                  }`}
                  style={{ fontSize: "22px" }}
                >
                  {item.label}
                </Link>
              );
            }
          })}

          {/* Separator */}
          {aboutInfoBlocks.length > 0 && (
            <span className={theme=="white"? "text-[#969698]":"text-white"}>|</span>
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
                  "font-agenda-regular transition-colors duration-300 ",
                  isActive ? 
                  ( theme=="white" ? "text-[#1E9BFB] decoration underline" : "text-[#1E9BFB] decoration underline") : 
                  (theme=="white" ? `text-zinc-800/50`: "text-white"),
                ].join(" ")}
                style={{ fontSize: "22px" }}
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
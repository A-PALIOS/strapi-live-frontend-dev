'use client';

import { StickyMenuProps, AboutInfoProps, /* LinkProps,LogoProps*/ } from "@/types";
import { StrapiImage } from "../StrapiImage";
import { useScrollSpy } from "@/utils/useScrollspy";
import { usePathname } from "next/navigation"; // ✅ Import this
import Link from "next/link";
import { useState } from "react";

interface ExtendedStickyMenuProps extends StickyMenuProps {
  aboutInfoBlocks: AboutInfoProps[]; 
}


export function StickyMenuBlock({
  logo,
  navigation,
  aboutInfoBlocks,
  hamnavigation
}: ExtendedStickyMenuProps) {
  const pathname = usePathname(); // ✅ Get current path

  const sectionIds = aboutInfoBlocks
    .map((info) =>
      info.heading ? info.heading.toLowerCase().replace(/\s+/g, "-") : null
    )
    .filter(Boolean) as string[];

  const activeId = useScrollSpy(sectionIds, 120);

   const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50 bg-white px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2">
          {logo?.image?.url && (
            <StrapiImage
              src={logo.image.url}
              alt={logo.image.alternativeText || logo.logoText || "error.png" }
              width={200}
              height={200}
              className="object-contain"
            />
          )}
        </div>
      </div>

      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex gap-4 text-lg text-gray-700">

          <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-700 hover:text-blue-600 focus:outline-none"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Mobile Menu Items */}
      {isOpen && (
        <div className=" px-6 pb-4">
          <nav className="flex flex-col gap-4 mb-4">
            {hamnavigation.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                target={item.isExternal ? "_blank" : "_self"}
                className="text-base font-medium text-gray-800 hover:text-blue-500 transition"
              >
                {item.text}
              </Link>
            ))}
          </nav>
          {/* <Link href={cta.href} target={cta.isExternal ? "_blank" : "_self"}>
            <button className="w-full text-blue-500 border border-blue-500 rounded-full px-4 py-2 text-sm font-medium hover:bg-blue-50 transition">
              {cta.text} <span className="ml-1">→</span>
            </button>
          </Link> */}
        </div>
      )}
        

          {/* Page-level navigation links */}
          {navigation?.map((item) => {
            const isActivePage = pathname === item.href;
            return (
              <a
                key={item.id}
                href={item.href}
                className={`transition-colors duration-300 ${
                  isActivePage ? "text-black-500 font-semibold" : ""
                }`}
              >
                {item.text}
              </a>
            );
          })}

          {/* Separator */}
          <span className="text-gray-400">|</span>

          {/* In-page scrollspy links */}
          {aboutInfoBlocks.map((info) => {
            const id = info.heading?.toLowerCase().replace(/\s+/g, "-") ?? "";
            const isActive = id === activeId;
            return (
              <a
                key={info.id}
                href={`#${id}`}
                className={`transition-colors duration-300 ${
                  isActive ? "text-blue-500 font-semibold" : ""
                }`}
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

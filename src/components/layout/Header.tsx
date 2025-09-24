"use client";
import type { LinkProps, LogoProps } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { StrapiImage } from "../StrapiImage";
// import { useState } from "react";
import { useState, useEffect, useRef } from "react";
import NavLink from "../NavLink";

interface HeaderProps {
  data: {
    logo: LogoProps;
    logoWhite?: LogoProps;    // white logo for dark sections

    navigation: LinkProps[];
    cta: LinkProps;
  };
  overlay?: boolean;
}

export function Header({ data }: HeaderProps) {
  const pathname = usePathname();
  const overlay: boolean = pathname !== "/";
  const [isOpen, setIsOpen] = useState(false);


 const headerRef = useRef<HTMLDivElement>(null);
const [onDark, setOnDark] = useState(false);

useEffect(() => {
  let raf = 0;

  const calc = () => {
    const hh = headerRef.current?.offsetHeight ?? 80;

    // Re-query zones each time to avoid stale elements after navigation
    const zones = Array.from(
      document.querySelectorAll<HTMLElement>('[data-header="dark"]')
    );

    const isOverAnyDark = zones.some((el) => {
      const r = el.getBoundingClientRect();
      // header occupies [0, hh] since it's fixed at the top
      return r.top < hh && r.bottom > 0;
    });

    setOnDark(isOverAnyDark);
  };

  const onScroll = () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(calc);
  };

  // Run immediately, and again on the next frame to catch newly mounted page content
  calc();
  raf = requestAnimationFrame(calc);

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", calc);
  window.addEventListener("orientationchange", calc);
  window.addEventListener("pageshow", calc);         // bfcache restores
  document.addEventListener("visibilitychange", calc);

  return () => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", calc);
    window.removeEventListener("orientationchange", calc);
    window.removeEventListener("pageshow", calc);
    document.removeEventListener("visibilitychange", calc);
    cancelAnimationFrame(raf);
  };
}, [pathname]); // 👈 re-run after each client navigation


  if (!data) return null;
  const { logo, logoWhite, navigation, cta } = data;
  console.log("data",logoWhite)
// inside your Header component, after `const { logo, logoWhite, navigation, cta } = data;`
const activeLogo = onDark && logoWhite ? logoWhite : logo;
const logoAlt =
  (onDark ? logoWhite?.image?.alternativeText : logo.image.alternativeText) ||
  "Logo";

  return (
    <header
      id="site-header"
      className={`w-full z-50 transition-colors duration-300 ${
        overlay
          ? "fixed top-0 left-0 bg-transparent"
          : "fixed top-0 left-0 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Glassy nav container */}
<div
  ref={headerRef}

  className={`
    w-full flex items-center justify-between gap-6 rounded-2xl px-5 py-3
    border shadow-[0_8px_24px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.25)]
    backdrop-blur-xl backdrop-saturate-150
    ${onDark ? "bg-black/20 border-white/20" : "bg-white/10 border-white/20"}
  `}
  style={{ marginTop: 20 }}
>
          {/* Logo */}
<Link href="/" className="flex items-center shrink-0">
  <StrapiImage
    src={activeLogo.image.url}
    alt={logoAlt}
    width={120}
    height={120}
    className="h-10 w-auto transition-opacity duration-200"
  />
</Link>

       {/* separator */}
<span
  className={`hidden md:inline ${
    onDark ? "text-white/70" : "text-[#73777A]"
  }`}
  style={{ fontFamily: "agenda", fontStyle: "normal", fontSize: "25px", marginLeft: 12, marginRight: 12 }}
>
  |
</span>

         {/* Desktop Nav */}
<nav className="hidden md:flex gap-8">
  {navigation.map((item) => (
    <NavLink
      key={item.id}
      href={item.href}
      target={item.isExternal ? "_blank" : "_self"}
      className={`${onDark ? "text-white/90 hover:text-white" : "text-[#23292E] hover:text-gray-900"} font-agenda-medium transition`}
      style={{ fontSize: 22 }}
    >
      {item.text}
    </NavLink>
  ))}
</nav>

          {/* CTA Button */}
          <div className="hidden md:block ml-auto">
            <Link href={cta.href} target={cta.isExternal ? "_blank" : "_self"}>
              <button
                className="flex items-center gap-3 rounded-xl px-6 py-3 text-base text-white transition shadow"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(30,155,251,0.95) 0%, rgba(15,142,214,0.95) 100%)",
                  height: 56,
                  boxShadow: "0 8px 20px rgba(30,155,251,0.35)",
                }}
              >
                <span
                  id="ContactFont"
                  style={{
                    color: "white",
                    fontFamily: "agenda",
                    fontStyle: "normal",
                    fontSize: 18,
                  }}
                >
                  {cta.text}
                </span>
                <span className="flex items-center justify-center w-7 h-7 bg-white rounded-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-[#1E9BFB]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 17L17 7M7 7h10v10"
                    />
                  </svg>
                </span>
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
        {/* Mobile button icon color */}
<button
  onClick={() => setIsOpen((v) => !v)}
  className={`${onDark ? "text-white/90 hover:text-white" : "text-gray-900/80 hover:text-gray-900"} md:hidden focus:outline-none`}
  aria-label="Toggle menu"
>
            {isOpen ? (
              <svg
                className="w-7 h-7"
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
                className="w-7 h-7"
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
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-6 pb-6">
          <div
            className="
              rounded-2xl px-5 py-4 space-y-4
              bg-white/10 dark:bg-white/5
              backdrop-blur-xl backdrop-saturate-150
              border border-white/20 dark:border-white/10
              shadow-[0_8px_24px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.25)]
            "
          >
            <nav className="flex flex-col gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  target={item.isExternal ? "_blank" : "_self"}
                  className="text-base font-medium text-gray-900/90 hover:text-gray-900 transition"
                >
                  {item.text}
                </Link>
              ))}
            </nav>
            <Link href={cta.href} target={cta.isExternal ? "_blank" : "_self"}>
              <button className="w-full rounded-xl px-4 py-3 text-sm font-medium transition border border-white/30 bg-white/20 hover:bg-white/30 text-white">
                {cta.text} <span className="ml-1">→</span>
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { StrapiImage } from "../StrapiImage";

interface MenuItem {
  id?: number;
  label?: string;
  url?: string;
}

interface MenuData {
  id?: number;
  title?: string;
  slug?: string;
  items?: MenuItem[];
}

interface TeamMemberSecondaryMenuBlockProps {
  items: MenuItem[];
  global?: MenuData | null;
}

function getStrapiMediaUrl(url?: string | null) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${url}`;
}

export function TeamMemberSecondaryMenuBlock({
  items,
  global,
}: TeamMemberSecondaryMenuBlockProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [wrapperHeight, setWrapperHeight] = useState(0);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const globalItems = global?.items ?? [];

  const mobileMenuItems = items ?? []; // #mobile

  useEffect(() => {
    const nav = document.getElementById("site-header");
    if (!nav) return;

    nav.style.transition = "transform 0.3s ease";

    const onScroll = () => {
      if (window.scrollY > 250) {
        nav.style.transform = "translateY(-100%)";
      } else {
        nav.style.transform = "translateY(0)";
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      nav.style.transform = "translateY(0)";
    };
  }, []);

  useLayoutEffect(() => {
    const updateHeight = () => {
      setWrapperHeight(wrapperRef.current?.offsetHeight ?? 0);
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, [isOpen]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const checkPinned = () => {
      setIsPinned(sentinel.getBoundingClientRect().top <= 0);
    };

    checkPinned();
    window.addEventListener("scroll", checkPinned, { passive: true });

    return () => window.removeEventListener("scroll", checkPinned);
  }, []);

  if (!items?.length && !globalItems.length) return null;

  return (
    <>
      <div ref={sentinelRef} className="h-px w-full" />

      {isPinned && <div style={{ height: wrapperHeight || 72 }} />}

      <div
        ref={wrapperRef}
        className={`left-0 right-0 z-[70] border-b-1 border-[#F5F4F4] bg-white/10 backdrop-blur-lg ${
          isPinned ? "fixed top-0" : "relative"
        }`}
      >
        <div className="px-6 py-5 md:px-10 md:py-6 lg:px-16 xl:px-20">
          <div className="w-full">
            {/* #mobile - logo left, burger right until lg breakpoint */}
            <div className="flex items-center justify-between gap-6 text-xl text-black">
              <div className="flex items-center gap-6">
                <Link className="flex items-center" href={"/"}>
                  <StrapiImage
                    src={getStrapiMediaUrl("/uploads/Logo_Color_e94b003ceb.svg")}
                    alt={"error.png"}
                    width={200}
                    height={200}
                    className="object-contain"
                  />
                </Link>

                {/* #mobile - desktop links now start from lg, not md */}
                <div className="hidden flex-wrap items-center gap-6 lg:flex">
                  {items.map((item) => {
                    const isHash = item.url?.startsWith("#");
                    const isActivePage =
                      !!item.url && !isHash && pathname === item.url;

                    return (
                      <Link
                        key={String(item.id ?? `${item.label}-${item.url}`)}
                        href={item.url || "#"}
                        className={`font-agenda-regular transition-colors duration-300 ${
                          isActivePage
                            ? "text-[#1E9BFB]"
                            : "text-black/70 hover:text-black"
                        }`}
                        style={{ fontSize: "22px" }}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* #mobile - burger now stays visible until lg breakpoint */}
              <button
                onClick={() => setIsOpen((v) => !v)}
                className="text-black transition-colors lg:hidden"
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
          </div>
        </div>

        {/* #mobile - mobile dropdown now stays active until lg breakpoint */}
        {isOpen && (
          // <div className="border-t border-black/10 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] lg:hidden">
          <div className="lg:hidden">
            <div className="px-6 py-6">
              <nav className="flex flex-col gap-5">
                {mobileMenuItems.map((item) => {
                  const isHash = item.url?.startsWith("#");
                  const isActivePage =
                    !!item.url && !isHash && pathname === item.url;

                  return (
                    <Link
                      key={String(item.id ?? `${item.label}-${item.url}`)}
                      href={item.url || "#"}
                      className={`font-agenda-regular transition-colors duration-300 ${
                        isActivePage
                          ? "text-[#1E9BFB]"
                          : "text-black/70 hover:text-[#1E9BFB]"
                      }`}
                      style={{ fontSize: "22px" }}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Desktop global dropdown now starts from lg breakpoint */}
        {isOpen && globalItems.length > 0 && (
          <div className="hidden bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] lg:block">
            <div className="ml-13 px-6 py-8">
              <nav className="flex flex-col gap-6">
                {globalItems.map((item) => (
                  <Link
                    key={`g-${String(item.id ?? item.label)}-${item.url}`}
                    href={item.url || "#"}
                    className="font-agenda-medium text-[#242A2E] transition hover:text-blue-500"
                    style={{ fontSize: "20px" }}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { InfoBlockProps } from "@/types";
import { StrapiVideo } from "../StrapiVideo";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

export function InfoBlock({
  headline,
  description,
  cta,
  image,
  showCategoryWords,
}: Readonly<InfoBlockProps>) {
  const descRef = useRef<HTMLParagraphElement | null>(null);
  const catRef  = useRef<HTMLDivElement | null>(null);

  const pathname = usePathname();


 useEffect(() => {
  const el = descRef.current;
  if (!el) return;

  // 0) reset content to plain text to avoid double-wrapping after nav
  const original = (el.textContent ?? "").trim() || (description ?? "");
  el.textContent = original;

  // 1) split into words + whitespace (idempotent)
  const tokens = original.match(/\S+|\s+/g) || [];
  el.innerHTML = tokens
    .map((t) => (/\S/.test(t) ? `<span class="desc-word">${t}</span>` : t))
    .join("");

  // 2) build animation in a gsap context scoped to this element
  const ctx = gsap.context(() => {
    const words = el.querySelectorAll<HTMLSpanElement>(".desc-word");

    // set initial styles so it's deterministic after back/forward
    gsap.set(words, { color: "#D1D5DB" });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 70%",
        end: "bottom 30%",
        scrub: true,
        // markers: true, // uncomment to debug
      },
    });

    tl.to(words, {
      color: "#111827",
      stagger: 0.08,
      duration: 0.8,
      ease: "none",
    });
  }, el);

  // 3) refresh ScrollTrigger AFTER this tick and on bfcache restore
  const refresh = () => ScrollTrigger.refresh();
  const raf = requestAnimationFrame(refresh);
  window.addEventListener("pageshow", refresh); // back/forward cache
  window.addEventListener("resize", refresh);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("pageshow", refresh);
    window.removeEventListener("resize", refresh);

    // revert only what we created here (timelines + inline styles)
    ctx.revert();

    // put the DOM back to clean text so we can safely re-init later
    el.textContent = original;
  };
}, [pathname, description]);

  // Right-side category words — synced to the same scroll trigger as the description
  useEffect(() => {
    if (showCategoryWords === "hide") return;
    const container = catRef.current;
    const trigger   = descRef.current;
    if (!container || !trigger) return;

    const words = Array.from(
      container.querySelectorAll<HTMLSpanElement>(".cat-word")
    );
    if (!words.length) return;

    const ctx = gsap.context(() => {
      gsap.set(words, { color: "#D1D5DB" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger,
          start: "top 70%",
          end: "bottom 30%",
          scrub: true,
        },
      });

      words.forEach((word, i) => {
        tl.to(word, { color: "#0090FE", duration: 1 }, i);
      });
    }, container);

    const refresh = () => ScrollTrigger.refresh();
    const raf = requestAnimationFrame(refresh);
    window.addEventListener("pageshow", refresh);
    window.addEventListener("resize", refresh);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pageshow", refresh);
      window.removeEventListener("resize", refresh);
      ctx.revert();
    };
  }, [pathname, showCategoryWords]);

//another useEffect showing pixelbypixel logic
  /*
   
   useEffect(() => {
  const el = descRef.current;
  if (!el || (el as any).__animated) return;
  (el as any).__animated = true;

  // 1) Get visible text (keeps natural wrapping)
  const combined = el.innerText || "";

  // 2) Tokenize into words & whitespace (keep spaces as-is)
  const tokens = combined.match(/\S+|\s+/g) || [];

  // 3) Wrap only the words
  const html = tokens
    .map((t) => (/\S/.test(t) ? `<span class="desc-word">${t}</span>` : t))
    .join("");
  el.innerHTML = html;

  const words = el.querySelectorAll<HTMLSpanElement>(".desc-word");

  // 4) Start color for all words (light gray)
  gsap.set(words, { color: "#D1D5DB" });

  // === CONFIG ===
  const pixelsPerWord = 32;        // ← scroll distance (px) to reveal next word
  const highlightColor = "#111827"; // near-black
  // ==============

  // Total scroll distance maps linearly to number of words
  const totalScroll = Math.max(300, words.length * pixelsPerWord);

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: el,
      start: "top 75%",          // begin when the paragraph nears viewport
      end: `+=${totalScroll}`,   // each ~pixelsPerWord reveals one word
      scrub: true,
      // Optional: snap to each word step (feels very “one-by-one”):
      // snap: 1 / Math.max(1, words.length - 1),
    },
  });

  // 5) Add an instantaneous color set for each word at a distinct timeline time
  words.forEach((w, i) => {
    tl.to(w, { color: highlightColor, duration: 0 }, i);
  });
  // Ensure timeline has a little tail so the last word can be reached
  tl.to({}, { duration: 1 }, words.length);

  return () => {
    tl.kill();
    ScrollTrigger.getAll().forEach((st) => st.kill());
  };
}, []);
  */
  

  return (
    <section className="bg-white overflow-x-clip"> {/* clip any tiny overflow */}
      <div className="w-full px-6 md:px-10 lg:px-16 xl:px-20 py-16 md:py-20">
        {/* Top bar */}
        {/* Top bar */}
<div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-start">
  <div className="inline-flex max-w-full items-center gap-3 flex-wrap">
    <div className="font-agenda-medium sm:text-3xl text-[24px] font-bold leading-tight text-gray-900 tracking-tight m-0">
      {headline}
    </div>

    {/* Decorative SVG graphic */}
    {headline && (
      <svg
        aria-hidden="true"
        viewBox="0 0 120 40"
        className="hidden lg:block h-6 w-20 shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* your existing SVG paths stay here */}
      </svg>
    )}
  </div>

  {cta && (
    <div className="block lg:inline-block">
      <Link
        href={cta.href}
        target={cta.isExternal ? "_blank" : "_self"}
        className="
          group inline-flex items-center gap-2
          text-[20px] md:text-[24px]
          font-agenda-regular uppercase tracking-wide
          text-gray-900 hover:text-[#1E9BFB]
        "
      >
        {cta.text}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        >
          <path d="M7 17L17 7M17 7H7M17 7V17" />
        </svg>
      </Link>
    </div>
  )}
</div>

        {/* Full-width divider */}
        <div className="mt-16 border-t -mx-6 md:-mx-10 lg:-mx-16 xl:-mx-20" style={{ borderColor: "#626262" }} />

        {/* Body */}
        <div className="mt-[104px] grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Left: animated description */}
          <div className="md:col-span-9">
            <p
              ref={descRef}
              className="
                animate font-agenda-regular text-2xl md:text-2xl lg:text-5xl justify-center
                leading-tight text-zinc-800/25 tracking-[-2.4px]
                whitespace-normal break-words [overflow-wrap:anywhere]
              "
            >
              {description}
            </p>
          </div>

          {/* Right: scroll-revealed category words */}
          {showCategoryWords !== "hide" && (
            <div
              ref={catRef}
              className="hidden md:flex md:col-span-3 flex-col justify-start items-end gap-3 pt-3"
            >
              {["CONSULTING", "MANAGEMENT", "TRAINING"].map((word) => (
                <span
                  key={word}
                  className="cat-word font-agenda-medium text-sky-500 text-4xl uppercase"
                >
                  {word}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Media */}
        {image && (
          <div className="mt-10 md:mt-14">
            <div className="relative overflow-hidden rounded-2xl">
              <div className="relative aspect-[4/3] sm:aspect-video md:aspect-[1728/802]">
                <StrapiVideo
                  src={image.url}
                  className="absolute inset-0 h-full w-full object-cover"
                  controls={false}
                  autoPlay
                  loop
                  muted
                />
              </div>
            </div>
          </div>
        )}
      
      </div>
    </section>
  );
}
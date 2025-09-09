




"use client";

import { useEffect, useRef } from "react";
import type { FeaturesBlockProps } from "@/types";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function FeaturesBlock({
  heading,       // e.g. "Key Features"
  description,   // long paragraph
}: FeaturesBlockProps) {
  const descRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const el = descRef.current;
    if (!el || (el as any).__animated) return; // guard (StrictMode)
    (el as any).__animated = true;

    // 1) take visible text
    const combined = el.innerText || "";

    // 2) tokenize into words and whitespace (keeps wrapping intact)
    const tokens = combined.match(/\S+|\s+/g) || [];

    // 3) wrap only words; keep whitespace as-is
    const html = tokens
      .map((t) => (/\S/.test(t) ? `<span class="desc-word">${t}</span>` : t))
      .join("");

    // 4) inject back
    el.innerHTML = html;

    // 5) select words
    const words = el.querySelectorAll<HTMLSpanElement>(".desc-word");

    // 6) animate word-by-word
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 70%",
        end: "bottom 30%",
        scrub: true,
      },
    });

    // start light gray → end near-black
    tl.fromTo(
      words,
      { color: "#D1D5DB" },
      { color: "#111827", stagger: 0.08, duration: 0.8, ease: "none" }
    );

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  const [left, right = ""] = (heading || "").split(" ");

  return (
    <section className="w-full">
      {/* Full-width grid, no centering */}
      <div className="grid w-full grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 px-6 md:px-32 border-b border-gray-200">
        {/* Left column: stacked heading + decorative SVG */}
        <div className="md:col-span-4 py-20">
          <div className="inline-flex items-start gap-3">
            <div className="flex flex-col leading-none">
              <span className="font-agenda-semibold text-8xl text-gray-900">
                {left}
              </span>
              <span className="font-agenda-semibold mt-2 text-8xl text-gray-900">
                {right}
              </span>
            </div>

          
          </div>
        </div>

        {/* Right column: paragraph with vertical divider */}
        <div className="md:col-span-8 md:border-l md:border-gray-200 md:pl-20 md:pt-20 md:pb-20 md:pr-20">
          <p
            ref={descRef}
            className="font-agenda-semibold text-6xl leading-snug text-gray-300 whitespace-normal break-words [overflow-wrap:anywhere]"
          >
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}

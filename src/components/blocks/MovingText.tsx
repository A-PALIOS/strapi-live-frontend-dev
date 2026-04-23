"use client";

import { useEffect, useRef } from "react";
import type { MovingTextProps } from "@/types";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

export function MovingText({
  description,
}: Readonly<MovingTextProps>) {
  const descRef = useRef<HTMLParagraphElement | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const el = descRef.current;
    if (!el) return;

    const original = (el.textContent ?? "").trim() || (description ?? "");
    el.textContent = original;

    const tokens = original.match(/\S+|\s+/g) || [];
    el.innerHTML = tokens
      .map((t) => (/\S/.test(t) ? `<span class="desc-word">${t}</span>` : t))
      .join("");

    const ctx = gsap.context(() => {
      const words = el.querySelectorAll<HTMLSpanElement>(".desc-word");

      gsap.set(words, { color: "#9a9a9a" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 72%",
          end: "bottom 38%",
          scrub: true,
        },
      });

      tl.to(words, {
        color: "#1f1a1c",
        stagger: 0.08,
        duration: 0.8,
        ease: "none",
      });
    }, el);

    const refresh = () => ScrollTrigger.refresh();
    const raf = requestAnimationFrame(refresh);
    window.addEventListener("pageshow", refresh);
    window.addEventListener("resize", refresh);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pageshow", refresh);
      window.removeEventListener("resize", refresh);
      ctx.revert();
      el.textContent = original;
    };
  }, [pathname, description]);

  return (
    <section className="w-full overflow-x-clip">
      <div className="w-full px-6 md:px-10 lg:px-16 xl:px-20 py-10 md:py-10">
        <div className="max-w-[1200px]">
          <p
            ref={descRef}
            className="
              font-agenda-medium
              text-[44px]
              leading-[0.95]
              tracking-[-0.055em]
              text-[#9a9a9a]
              whitespace-normal
              break-words
              [overflow-wrap:anywhere]
              md:text-[62px]
              lg:text-[68px]
            "
          >
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
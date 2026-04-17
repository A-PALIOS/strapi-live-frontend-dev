"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

interface StatementSectionProps {
  headingPrimary: string;
  headingSecondary: string;
  bodyPrimary: string;
  bodySecondary: string;
}

export function StatementSection({
  headingPrimary,
  headingSecondary,
  bodyPrimary,
  bodySecondary,
}: Readonly<StatementSectionProps>) {
  const headingPrimaryRef = useRef<HTMLHeadingElement | null>(null);
  const headingSecondaryRef = useRef<HTMLHeadingElement | null>(null);
  const pathname = usePathname();

  const primaryLines = bodyPrimary.split("\n").filter(Boolean);
  const secondaryLines = bodySecondary.split("\n").filter(Boolean);

  useEffect(() => {
    const setupWordAnimation = (
      el: HTMLHeadingElement | null,
      text: string,
      wordClass: string,
      initialColor: string,
      finalColor: string
    ) => {
      if (!el) return () => {};

      const original = (el.textContent ?? "").trim() || text;
      el.textContent = original;

      const tokens = original.match(/\S+|\s+/g) || [];
      el.innerHTML = tokens
        .map((t) => (/\S/.test(t) ? `<span class="${wordClass}">${t}</span>` : t))
        .join("");

      const ctx = gsap.context(() => {
        const words = el.querySelectorAll<HTMLSpanElement>(`.${wordClass}`);

        gsap.set(words, { color: initialColor });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top 70%",
            end: "bottom 30%",
            scrub: true,
          },
        });

        tl.to(words, {
          color: finalColor,
          stagger: 0.08,
          duration: 0.8,
          ease: "none",
        });
      }, el);

      return () => {
        ctx.revert();
        el.textContent = original;
      };
    };

    const cleanupPrimary = setupWordAnimation(
      headingPrimaryRef.current,
      headingPrimary,
      "statement-primary-word",
      "#9B9B9B",
      "#111827"
    );

    const cleanupSecondary = setupWordAnimation(
      headingSecondaryRef.current,
      headingSecondary,
      "statement-secondary-word",
      "#9B9B9B",
      "#111827"
    );

    const refresh = () => ScrollTrigger.refresh();
    const raf = requestAnimationFrame(refresh);

    window.addEventListener("pageshow", refresh);
    window.addEventListener("resize", refresh);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pageshow", refresh);
      window.removeEventListener("resize", refresh);
      cleanupPrimary();
      cleanupSecondary();
    };
  }, [pathname, headingPrimary, headingSecondary]);

  return (
    <section className="bg-white px-6 py-10 md:px-12 md:py-12">
      <div className="text-right">
        <h2
          ref={headingPrimaryRef}
          className="animate font-agenda-medium text-[34px] md:text-[40px] lg:text-[60px]
                     leading-tight text-[#9B9B9B]
                     whitespace-normal break-words [overflow-wrap:anywhere]"
        >
          {headingPrimary}
        </h2>

        <h2
          ref={headingSecondaryRef}
          className="mt-1 animate font-agenda-medium text-[34px] md:text-[40px] lg:text-[60px]
                     leading-tight text-[#9B9B9B]
                     whitespace-normal break-words [overflow-wrap:anywhere]"
        >
          {headingSecondary}
        </h2>

        <div className="mt-7 text-[#2F2F2F] md:mt-8">
          <p className="text-right text-[16px] leading-[1.28] md:text-[14px] md:leading-[1.3]">
            {primaryLines.map((line, index) => (
              <span
                key={index}
                className={`block ${
                  index === 1
                    ? "ml-4 md:ml-4"
                    : index === primaryLines.length - 1
                    ? "text-right"
                    : "text-right"
                }`}
              >
                {line}
              </span>
            ))}
          </p>

          <p className="mt-6 text-[16px] leading-[1.28] md:mt-7 md:text-[14px] md:leading-[1.3] text-right">
            {secondaryLines.map((line, index) => (
              <span key={index} className="block">
                {line}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
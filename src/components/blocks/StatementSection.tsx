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
        .map((t) =>
          /\S/.test(t)
            ? `<span class="${wordClass}">${t}</span>`
            : t
        )
        .join("");

      const ctx = gsap.context(() => {
        const words =
          el.querySelectorAll<HTMLSpanElement>(`.${wordClass}`);

        gsap.set(words, {
          color: initialColor,
        });

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
    <section
      className="
        w-full
        min-h-screen
        bg-white
        flex
        items-center
        justify-end
        px-6
        md:px-10
        lg:px-16
        xl:px-24
      "
    >
      <div className="w-full max-w-[1100px] text-right">
        <h2
          ref={headingPrimaryRef}
          className="
            animate
            font-agenda-medium
            text-[52px]
            sm:text-[68px]
            md:text-[82px]
            lg:text-[110px]
            xl:text-[96px]
            leading-[0.95]
            tracking-[-0.04em]
            text-[#9B9B9B]
            whitespace-normal
            break-words
          "
        >
          {headingPrimary}
        </h2>

        <h2
          ref={headingSecondaryRef}
          className="
            mt-2
            animate
            font-agenda-medium
            text-[52px]
            sm:text-[68px]
            md:text-[82px]
            lg:text-[110px]
            xl:text-[96px]
            leading-[0.95]
            tracking-[-0.04em]
            text-[#9B9B9B]
            whitespace-normal
            break-words
          "
        >
          {headingSecondary}
        </h2>

      <div className="mt-8 md:mt-10 md:ml-50 ml-30">
  <p
    className="
      mx-auto
      font-agenda-regular
      max-w-[920px]
      text-left
      text-[20px]
      md:text-[26px]
      lg:text-[32px]
      leading-[1.28]
      text-[#2F2F2F]
    "
  >
    {bodyPrimary}
  </p>
</div>
      </div>
    </section>
  );
}
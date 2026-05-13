"use client";

import { useEffect, useRef, useState } from "react";
import type { TwoColumnTextBlockProps } from "@/types";

type TwoColumnTextVariant = "default" | "stackedLabels";

type Props = Readonly<
  TwoColumnTextBlockProps & {
    variant?: TwoColumnTextVariant;
  }
>;

function renderParagraphs(text?: string, isBlack?: boolean) {
  if (!text) return null;

  return text
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map((paragraph, index) => (
      <p
        key={index}
        className={`
          font-agenda-normal
          text-[28px]
          leading-[1.18]
          tracking-[-0.055em]
          md:text-[32px]
          lg:text-[36px]
          ${isBlack ? "text-white" : "text-[#06111f]"}
        `}
      >
        {paragraph.trim()}
      </p>
    ));
}

function renderStackedLabels(leftText?: string, isScrolled?: boolean) {
  if (!leftText) return null;

  return leftText
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map((label, index) => (
      <p
        key={index}
        className={`
          font-agenda-normal
          text-[25px]
          leading-none
          tracking-[-0.055em]
          uppercase
          transition-colors
          duration-500
          ${
            index === 0
              ? isScrolled
                ? "text-[#d65f16]"
                : "text-[#06111f]"
              : "text-[#666666]"
          }
        `}
      >
        {label.trim()}
      </p>
    ));
}

export function TwoColumnText({
  leftText,
  rightText,
  theme,
  variant = "default",
}: Props) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const isBlack = theme === "black";
  const isStackedLabels = variant === "stackedLabels";

  useEffect(() => {
    if (!isStackedLabels) return;

    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();

      setIsScrolled(rect.top < window.innerHeight * 0.45);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [isStackedLabels]);

  return (
    <section
      ref={sectionRef}
      className={`w-full${isBlack ? " bg-black" : ""}`}
    >
      <div className="w-full max-w-[1200px] px-6 md:px-10 lg:px-16 xl:px-20 py-10 md:py-10 sm:px-8 sm:py-10 md:py-10 lg:px-12 lg:py-10">
        {isStackedLabels ? (
          <div className="grid grid-cols-1 gap-y-14 md:grid-cols-[34%_66%] md:gap-x-10 lg:gap-x-14 xl:gap-x-20">
            <div className="space-y-[260px]">
              {renderStackedLabels(leftText, isScrolled)}
            </div>

            <div className="space-y-[80px]">
              {renderParagraphs(rightText, isBlack)}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-y-8 md:grid-cols-2 md:gap-x-10 lg:gap-x-14 xl:gap-x-20">
            <div className="max-w-full space-y-5 md:max-w-[460px] lg:space-y-6">
              {renderParagraphs(leftText, isBlack)}
            </div>

            <div className="max-w-full space-y-5 md:max-w-[460px] lg:space-y-6">
              {renderParagraphs(rightText, isBlack)}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
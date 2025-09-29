"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { StrapiImage } from "../StrapiImage";
import type { HeroSectionDigitalProps } from "@/types";
import BlurText from "../ui/BlurText";

// Lazy-load LiquidEther on the client only
const LiquidEther = dynamic(() => import("../ui/LiquidEther"), { ssr: false });

// Mount only when the section is in view (saves work offscreen)
function useInView(threshold = 0.25) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
}

export function HeroSectionDigital({
  heading,
  subheader,
  cta,
  image,
  logo,
  author,
  publishedAt,
  darken = false,
}: Readonly<HeroSectionDigitalProps>) {
  // Split heading so first word is blue, rest is white
  const [firstWord, ...restWords] = (heading ?? "").split(" ");
  const rest = restWords.join(" ");

  // Respect reduced-motion
  const [prefersReduced, setPrefersReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReduced(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  // Pause when tab is hidden
  const [tabVisible, setTabVisible] = useState(true);
  useEffect(() => {
    const onVis = () => setTabVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // Only mount effect when hero is on screen
  const { ref, inView } = useInView(0.25);

  // 💧 LiquidEther props — wider blue, abstract shapes, lighter compute
  const etherProps = useMemo(
    () => ({
      // Two blues so the blue area occupies more space
      colors: ["#0A0F1F", "#0F79C9", "#1E9BFB"],

      // Performance + look
      resolution: 0.33,        // fewer pixels → faster; keeps big shapes
      isViscous: true,         // smear/elongate blobs (less “ball” looking)
      viscous: 14,             // 10–18 = nice abstract smear
      iterationsViscous: 14,   // lighter solver
      iterationsPoisson: 14,   // lighter solver

      // Mouse feel: wide, gentle strokes → broader motion
      cursorSize: 120,
      mouseForce: 10,

      isBounce: false,

      // Start moving immediately
      autoDemo: true,
      autoSpeed: 0.6,
      autoIntensity: 2.4,
      takeoverDuration: 0,
      autoResumeDelay: 0,
      autoRampDuration: 0,

      className: "w-full h-full",
    }),
    []
  );

  return (
    <section
      ref={ref as any}
      id="heropage"
      data-header="dark"
      className="relative min-h-[78vh] overflow-hidden"
    >
      {/* Background: allow pointer events to reach the canvas */}
      <div className="absolute inset-0 -z-10 bg-black pointer-events-auto">
        {!prefersReduced && tabVisible && inView && <LiquidEther {...etherProps} />}

        {/* Keep overlay transparent to pointer events so mouse reaches the fluid */}
        {darken && (
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/65 pointer-events-none" />
        )}
      </div>

      {/* Content: default to pointer-events-none so the canvas gets the mouse */}
      <div className="relative mx-auto flex h-full max-w-7xl items-center px-6 pt-96 pb-16 lg:px-8 pointer-events-none">
        <div className="max-w-3xl text-white">
          {/* Optional logo (non-interactive, keep pointer-events-none) */}
          {logo && (
            <div className="mb-6">
              <StrapiImage
                src={logo.image.url}
                alt={logo.image.alternativeText || "Logo"}
                className="h-10 w-auto"
                width={120}
                height={120}
              />
            </div>
          )}


          {/* Title */}
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
  <BlurText
    text={firstWord}
    delay={120}
    animateBy="words"
    direction="top"
    className="inline text-[#1E9BFB]"
  />
  {" "}
  <BlurText
    text={rest}
    delay={180}                // slight stagger after the first word
    animateBy="words"
    direction="top"
    className="inline text-white"
  />
</h1>
          {/* Subheader */}
          <p className="mt-6 text-base/7 sm:text-lg/8 text-white/90 w-2xl font-agenda-regular">
            {subheader}
          </p>

          {/* CTA: re-enable pointer events only here so it's clickable */}
          {cta && (
            <Link
              href={cta.href}
              target={cta.isExternal ? "_blank" : "_self"}
              className="pointer-events-auto group ml-auto inline-flex items-center gap-3 text-slate-300 hover:text-white mt-16"
              aria-label={cta.text ?? "Learn more"}
            >
              <span className="text-sm md:text-base font-agenda-semibold">
                {cta.text ?? "Learn More"}
              </span>

              <span className="mr-3 sm:mr-6 grid place-items-center w-7 h-7 md:w-8 md:h-8 rounded-md bg-[#FF8A00] text-white transition-transform duration-200 group-hover:translate-y-0.5">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  className="w-4 h-4"
                >
                  <path d="M11 3h2v12.17l3.59-3.58L18 13l-6 6-6-6 1.41-1.41L11 15.17V3z" />
                </svg>
              </span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { StrapiImage } from "../StrapiImage";
import type { HeroSectionDigitalProps } from "@/types";
import BlurText from "../ui/BlurText";
import Lanyard from "../Lanyard";

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
      {/* subtle radial */}
     

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 py-16 md:grid-cols-2 md:gap-14 lg:py-24">
        {/* Copy */}
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs tracking-wide text-white/80">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-sky-400" />
            Digital Services
          </span>

          {/* <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl"> */}
                    {/* Title */}
          <h2 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
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
</h2>
            {/* Your <span className="text-sky-400">Digital Identity</span>, in motion */}
          {/* </h2> */}

          <p className="mt-4 text-base leading-relaxed text-white/70 sm:text-lg">
            We design interactive experiences that feel alive—branding, product
            UX, web platforms, and immersive content that move people and move
            metrics.
          </p>

          <ul className="mt-6 space-y-3 text-white/80">
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-block h-2 w-2 flex-none rounded-full bg-sky-400" />
              Conversion-focused websites & apps
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-block h-2 w-2 flex-none rounded-full bg-sky-400" />
              Brand systems with interactive motion
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-block h-2 w-2 flex-none rounded-full bg-sky-400" />
              3D & real-time content (WebGL/R3F)
            </li>
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#work"
              className="rounded-2xl bg-sky-400 px-5 py-3 text-sm font-medium text-black shadow-lg shadow-sky-400/20 hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-sky-300"
            >
              View Work
            </a>
            <a
              href="#contact"
              className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              Start a Project
            </a>
          </div>

          <p className="mt-4 text-xs text-white/50">
            Tip: drag the pass on the right — it reacts with physics.
          </p>
        </div>

        {/* 3D Lanyard */}
        <div className="relative">
          {/* Optional soft glow */}
          <div className="pointer-events-none absolute inset-x-6 -top-10 -z-10 h-40 rounded-full bg-sky-400/20 blur-3xl" />
          <Lanyard />
        </div>
      </div>




      {/* Background: allow pointer events to reach the canvas */}
      <div className="absolute inset-0 -z-10 bg-black pointer-events-auto">
        {!prefersReduced && tabVisible && inView && <LiquidEther {...etherProps} />}

        {/* Keep overlay transparent to pointer events so mouse reaches the fluid */}
        {darken && (
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/65 pointer-events-none" />
        )}
      </div>

      {/* Content: default to pointer-events-none so the canvas gets the mouse */}

    </section>
  );
}

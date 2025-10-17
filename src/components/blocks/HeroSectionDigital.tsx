"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { StrapiImage } from "../StrapiImage";
import type { HeroSectionDigitalProps } from "@/types";
import BlurText from "../ui/BlurText";

// Effects
const LiquidEther = dynamic(() => import("../ui/LiquidEther"), { ssr: false });
const Lanyard = dynamic(() => import("../Lanyard"), {
  ssr: false,
  loading: () => null,
});

/** Sticky in-view (keep for Ether/background only) */
function useInView({
  threshold = 0,
  rootMargin = "200px 0px 200px 0px",
  stickyOnceSeen = true,
}: {
  threshold?: number | number[];
  rootMargin?: string;
  stickyOnceSeen?: boolean;
} = {}) {
  const ref = useRef<HTMLElement | null>(null);
  const [inViewRaw, setInViewRaw] = useState(false);
  const onceSeenRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        if (visible) onceSeenRef.current = true;
        setInViewRaw(visible);
      },
      { threshold, rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin]);

  const inView = stickyOnceSeen ? inViewRaw || onceSeenRef.current : inViewRaw;
  return { ref, inView };
}

/** Error boundary (dev resilience) */
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<Error | null>(null);
  const [retries, setRetries] = useState(0);

  // simple boundary via try/catch render
  try {
    if (error) throw error;
    return <>{children}</>;
  } catch (e: any) {
    if (retries < 1) {
      // retry once next tick
      setTimeout(() => setRetries((r) => r + 1), 0);
      return null;
    }
    // after retry, keep silent
    return null;
  }
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

  // Only use inView for Ether (not for Lanyard anymore)
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "200px 0px 200px 0px",
    stickyOnceSeen: true,
  });

  // 💧 Liquid Ether props
  const etherProps = useMemo(
    () => ({
      colors: ["#0A0F1F", "#0F79C9", "#1E9BFB"],
      resolution: 0.33,
      isViscous: true,
      viscous: 14,
      iterationsViscous: 14,
      iterationsPoisson: 14,
      cursorSize: 120,
      mouseForce: 10,
      isBounce: false,
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

  // ===== Hardening: deterministically mount Lanyard AFTER full window load =====
  const [lanyardReady, setLanyardReady] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;

    const makeReady = () => {
      // double-guard with rAF to ensure layout is final
      requestAnimationFrame(() => {
        setLanyardReady(true);
      });
    };

    if (document.readyState === "complete") {
      makeReady();
    } else {
      const onLoad = () => makeReady();
      window.addEventListener("load", onLoad, { once: true });

      // backup: if load never fires (rare), arm a small timeout
      const t = setTimeout(makeReady, 1200);
      return () => {
        window.removeEventListener("load", onLoad);
        clearTimeout(t);
      };
    }
  }, []);

  // Gates (Ether only)
  const canAnimate = !prefersReduced && tabVisible;
  const showEther = canAnimate && inView;

  return (
    <section
      ref={ref as any}
      id="heropage"
      data-header="dark"
      className="relative min-h-[78vh] overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-black pointer-events-auto">
        {showEther && <LiquidEther {...etherProps} />}
        {darken && (
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/65 pointer-events-none" />
        )}
      </div>

      {/* RIGHT (md+): fixed Lanyard, ALWAYS mounts once lanyardReady */}
      <div
        className="
          fixed right-0 top-0 z-20 hidden md:flex
          h-screen w-[42vw] max-w-[720px]
          items-center justify-center
          pointer-events-auto
        "
      >
        <ErrorBoundary>
          {lanyardReady && (
            // If your Lanyard supports paused, you can pass paused={!tabVisible}
            <Lanyard /* paused={!tabVisible} */ />
          )}
        </ErrorBoundary>
      </div>

      {/* LEFT content; pad-right on md+ so it doesn't sit under the fixed Lanyard */}
      <div
        className="
          relative mx-auto flex h-full max-w-7xl items-center
          px-6 pt-96 pb-16 lg:px-8
          pointer-events-none
          md:pr-[44vw]
        "
      >
        <div className="max-w-3xl text-white">
          {/* Optional logo */}
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
            />{" "}
            <BlurText
              text={rest}
              delay={180}
              animateBy="words"
              direction="top"
              className="inline text-white"
            />
          </h1>

          {/* Subheader */}
          <p className="mt-6 text-base/7 sm:text-lg/8 text-white/90 w-2xl font-agenda-regular">
            {subheader}
          </p>

          {/* CTA (clickable) */}
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
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-4 h-4">
                  <path d="M11 3h2v12.17l3.59-3.58L18 13l-6 6-6-6 1.41-1.41L11 15.17V3z" />
                </svg>
              </span>
            </Link>
          )}
        </div>
      </div>

      {/* MOBILE: show Lanyard in flow below content (not fixed) */}
      <div className="md:hidden mt-10 px-6 pb-10">
        <div className="relative z-10 h-[50vh] w-full pointer-events-auto">
          <ErrorBoundary>{lanyardReady && <Lanyard />}</ErrorBoundary>
        </div>
      </div>
    </section>
  );
}

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

/** Sticky in-view (used only for Ether) */
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

/** Simple ErrorBoundary */
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<Error | null>(null);
  if (error) return null;
  try {
    return <>{children}</>;
  } catch (e: any) {
    setError(e);
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
  const [firstWord, ...restWords] = (heading ?? "").split(" ");
  const rest = restWords.join(" ");

  // Reduced motion
  const [prefersReduced, setPrefersReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReduced(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  // Tab visibility
  const [tabVisible, setTabVisible] = useState(true);
  useEffect(() => {
    const onVis = () => setTabVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // For LiquidEther only
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "200px 0px 200px 0px",
    stickyOnceSeen: true,
  });

  // Liquid Ether props
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

  // Ensure Lanyard only loads after window is ready
  const [lanyardReady, setLanyardReady] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const makeReady = () => requestAnimationFrame(() => setLanyardReady(true));
    if (document.readyState === "complete") {
      makeReady();
    } else {
      window.addEventListener("load", makeReady, { once: true });
      const t = setTimeout(makeReady, 1200);
      return () => {
        window.removeEventListener("load", makeReady);
        clearTimeout(t);
      };
    }
  }, []);

  // Track screen size (to hide Lanyard on small phones)
  const [isTabletOrLarger, setIsTabletOrLarger] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const check = () => setIsTabletOrLarger(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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

      {/* RIGHT: show only on tablets & up (≥768px) */}
      {lanyardReady && isTabletOrLarger && (
        <div
          className="
            fixed right-0 top-0 z-20 flex
            h-screen w-[42vw] max-w-[720px]
            items-center justify-center
            pointer-events-auto
          "
        >
          <ErrorBoundary>
            <Lanyard /* paused={!tabVisible} */ />
          </ErrorBoundary>
        </div>
      )}

      {/* LEFT CONTENT */}
      <div
        className="
          relative mx-auto flex h-full max-w-7xl items-center
          px-6 pt-96 pb-16 lg:px-8
          pointer-events-none
          md:pr-[44vw]
        "
      >
        <div className="max-w-3xl text-white">
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

          <p className="mt-6 text-base/7 sm:text-lg/8 text-white/90 w-2xl font-agenda-regular">
            {subheader}
          </p>

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

"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { StrapiImage } from "../StrapiImage";
import type { HeroSectionDigitalCardsProps } from "@/types";
import BlurText from "../ui/BlurText";

const Antigravity = dynamic(() => import("../ui/Antigravity"), {
  ssr: false,
});



function useInView({
  threshold = 0,
  rootMargin = "100px 0px 100px 0px",
  stickyOnceSeen = false,
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

  const inView = stickyOnceSeen
    ? inViewRaw || onceSeenRef.current
    : inViewRaw;

  return { ref, inView };
}

export function HeroSectionDigitalCards({
  heading,
  subheader,
  cta,
  logo,
  darken = false,
}: Readonly<HeroSectionDigitalCardsProps>) {
  const [firstWord, ...restWords] = (heading ?? "").split(" ");
  const rest = restWords.join(" ");

  const [prefersReduced, setPrefersReduced] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);

  const [lanyardReady, setLanyardReady] = useState(false);
  const [lanyardRevealed, setLanyardRevealed] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const [showHint, setShowHint] = useState(false);

  const hintReadyRef = useRef(false);
  const hintRevealedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => {
      setPrefersReduced(mq.matches);
    };

    update();

    mq.addEventListener?.("change", update);

    return () => {
      mq.removeEventListener?.("change", update);
    };
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const onVis = () => {
      setTabVisible(document.visibilityState === "visible");
    };

    onVis();

    document.addEventListener("visibilitychange", onVis);

    return () => {
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "100px 0px 100px 0px",
    stickyOnceSeen: false,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const makeReady = () =>
      requestAnimationFrame(() => setLanyardReady(true));

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

  useEffect(() => {
    if (lanyardRevealed) {
      setChatOpen(true);
    }
  }, [lanyardRevealed]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!lanyardReady || window.innerWidth < 1400) return;

    const show = setTimeout(() => {
      hintReadyRef.current = true;
      setShowHint(true);
    }, 2000);

    const hide = setTimeout(() => setShowHint(false), 9000);

    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [lanyardReady]);

  useEffect(() => {
    if (lanyardRevealed || chatOpen) {
      hintRevealedRef.current = true;
      setShowHint(false);
    }
  }, [lanyardRevealed, chatOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      if (window.scrollY > 180) {
        setShowHint(false);
      } else if (
        hintReadyRef.current &&
        !hintRevealedRef.current
      ) {
        setShowHint(true);
      }
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const canAnimate = !prefersReduced && tabVisible;
  const showAntigravity = canAnimate && inView;

  return (
    <section
      ref={ref as any}
      id="heropage"
      data-header="dark"
      className="relative min-h-[100vh] overflow-hidden pt-20 md:pt-24 lg:pt-28"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-black pointer-events-auto">
        <div className="absolute inset-0 bg-black" />

        {showAntigravity && (
          <div className="absolute inset-0 h-full w-full">
            <Antigravity
                count={1400}
                magnetRadius={8}
                ringRadius={10}
                waveSpeed={1}
                waveAmplitude={0.8}
                particleSize={3}
                lerpSpeed={0.045}
                color="#1E9BFB"
                autoAnimate
                particleVariance={1}
                rotationSpeed={0.15}
                depthFactor={2}
                pulseSpeed={2}
                particleShape="capsule"
                fieldStrength={18}
            />
          </div>
        )}

        {darken && (
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/65 pointer-events-none" />
        )}
      </div>



      {/* Content */}
      <div
        className="relative z-10 w-full px-6 md:px-10 lg:px-16 xl:px-20 py-16 md:py-20 pointer-events-none"
      >
        <div className="max-w-3xl text-white max-[1400px]:max-w-2xl max-[1024px]:max-w-xl">
          {logo && (
            <div className="mb-6 max-[1024px]:mb-5">
              <StrapiImage
                src={logo.image.url}
                alt={logo.image.alternativeText || "Logo"}
                className="h-10 w-auto max-[1024px]:h-9 max-[767px]:h-8"
                width={120}
                height={120}
              />
            </div>
          )}

          <h1
            className="
              text-[44px] leading-[0.95] tracking-[-0.055em]
              whitespace-normal break-words [overflow-wrap:anywhere]
              md:text-[62px] lg:text-[68px]
              font-agenda-medium
            "
          >
            <BlurText
              text={firstWord}
              delay={120}
              animateBy="words"
              direction="top"
              className="inline text-white"
            />{" "}
            <BlurText
              text={rest}
              delay={180}
              animateBy="words"
              direction="top"
              className="inline text-white"
            />
          </h1>

          <p
            className="mt-6 max-w-[1000px] font-agenda-regular"
            style={{ color: "#FFFFFF", fontSize: "clamp(20px, 2.8vw, 40px)", fontWeight: 400, lineHeight: "normal", letterSpacing: "-2px" }}
          >
            {subheader}
          </p>

          {cta && (
            <Link
              href={cta.href}
              target={cta.isExternal ? "_blank" : "_self"}
              className="
                pointer-events-auto group ml-auto mt-16 inline-flex items-center gap-3 text-slate-300 hover:text-white
                max-[1400px]:mt-12
                max-[1024px]:mt-10
                max-[767px]:mt-8
              "
              aria-label={cta.text ?? "Learn more"}
            >
              <span className="text-sm font-agenda-semibold md:text-base">
                {cta.text ?? "Learn More"}
              </span>

              <span className="mr-3 grid h-7 w-7 place-items-center rounded-md bg-[#5227FF] text-white transition-transform duration-200 group-hover:translate-y-0.5 sm:mr-6 md:h-8 md:w-8">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  className="h-4 w-4"
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
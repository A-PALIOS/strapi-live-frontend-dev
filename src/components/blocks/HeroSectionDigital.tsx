"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { StrapiImage } from "../StrapiImage";
import type { HeroSectionDigitalProps } from "@/types";
import BlurText from "../ui/BlurText";

const LiquidEther = dynamic(() => import("../ui/LiquidEther"), { ssr: false });
const Lanyard = dynamic(() => import("../Lanyard"), {
  ssr: false,
  loading: () => null,
});
const DigitalChatbot = dynamic(() => import("./DigitalChatbot"), {
  ssr: false,
  loading: () => null,
});

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

  const [prefersReduced, setPrefersReduced] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [lanyardReady, setLanyardReady] = useState(false);
  const [isTabletOrLarger, setIsTabletOrLarger] = useState(false);

  // only used as gesture signal
  const [lanyardRevealed, setLanyardRevealed] = useState(false);

  // actual chat visibility
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReduced(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    const onVis = () => setTabVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "200px 0px 200px 0px",
    stickyOnceSeen: true,
  });

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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const check = () => setIsTabletOrLarger(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Open chat only when the pull gesture becomes true
  useEffect(() => {
    if (lanyardRevealed) {
      setChatOpen(true);
    }
  }, [lanyardRevealed]);

  const canAnimate = !prefersReduced && tabVisible;
  const showEther = canAnimate && inView;

  return (
    <section
      ref={ref as any}
      id="heropage"
      data-header="dark"
      className="relative min-h-[78vh] overflow-hidden"
    >
      <div className="absolute inset-0 -z-10 bg-black pointer-events-auto">
        {showEther && <LiquidEther {...etherProps} />}
        {darken && (
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/65 pointer-events-none" />
        )}
      </div>

      {lanyardReady && (
        <div
          className="
            fixed right-0 top-0 z-35 flex h-screen items-center justify-center pointer-events-auto
            w-[42vw] max-w-[720px]
            max-[1400px]:w-[38vw]
            max-[1400px]:max-w-[600px]
            lg:max-[1200px]:w-[36vw]
            lg:max-[1200px]:max-w-[520px]
            md:max-[1024px]:w-[34vw]
            md:max-[1024px]:max-w-[440px]
          "
        >
          <Lanyard onRevealChange={setLanyardRevealed} />
          <DigitalChatbot
            isOpen={chatOpen}
            onOpen={() => setChatOpen(true)}
            onClose={() => setChatOpen(false)}
          />
        </div>
      )}

      <div
        className="
          relative mx-auto flex h-full max-w-7xl items-center px-6 pb-16 pt-96 pointer-events-none lg:px-8
          md:pr-[44vw]
          max-[1400px]:pt-72
          max-[1400px]:md:pr-[40vw]
          max-[1200px]:pt-56
          max-[1200px]:md:pr-[38vw]
          max-[1024px]:pt-44
          max-[1024px]:md:pr-[34vw]
          max-[767px]:pt-32
        "
      >
        <div className="max-w-3xl max-[1400px]:max-w-2xl max-[1024px]:max-w-xl text-white">
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
              text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl
              max-[1400px]:text-5xl
              max-[1200px]:text-4xl
              max-[1024px]:text-4xl
              max-[767px]:text-3xl
            "
          >
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

          <p
            className="
              mt-6 max-w-2xl text-base/7 font-agenda-regular text-white/90 sm:text-lg/8
              max-[1400px]:max-w-xl
              max-[1200px]:mt-5 max-[1200px]:max-w-lg
              max-[1024px]:text-base/7
              max-[767px]:mt-4 max-[767px]:text-sm/6
            "
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
              <span className="mr-3 grid h-7 w-7 place-items-center rounded-md bg-[#FF8A00] text-white transition-transform duration-200 group-hover:translate-y-0.5 sm:mr-6 md:h-8 md:w-8">
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
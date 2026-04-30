"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
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

  const [showHint, setShowHint] = useState(false);

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

  useEffect(() => {
    if (!lanyardReady || window.innerWidth < 1400) return;
    const show = setTimeout(() => setShowHint(true), 2000);
    const hide = setTimeout(() => setShowHint(false), 9000);
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, [lanyardReady]);

  useEffect(() => {
    if (lanyardRevealed || chatOpen) setShowHint(false);
  }, [lanyardRevealed, chatOpen]);

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
        <>
          <Lanyard onRevealChange={setLanyardRevealed} />
          <DigitalChatbot
            isOpen={chatOpen}
            onOpen={() => setChatOpen(true)}
            onClose={() => setChatOpen(false)}
          />
        </>
      )}

      {showHint && (
        <>
          <style>{`
            @keyframes lanyardHintIn {
              from { opacity: 0; transform: translateY(14px); }
              to   { opacity: 1; transform: translateY(0);    }
            }
            @keyframes lanyardFloat {
              0%, 100% { transform: translateY(0px);  }
              50%       { transform: translateY(-7px); }
            }
            @keyframes lanyardHintOut {
              from { opacity: 1; }
              to   { opacity: 0; }
            }
          `}</style>

          <div
            className="fixed z-20 pointer-events-none select-none flex flex-col items-center gap-2"
            style={{ right: "22vw", top: "58%" }}
          >
            {/* outer wrapper fades in */}
            <div style={{ animation: "lanyardHintIn 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards" }}>
              {/* inner wrapper floats */}
              <div
                className="flex flex-col items-center gap-2.5"
                style={{ animation: "lanyardFloat 2.8s ease-in-out 0.6s infinite" }}
              >
                {/* glass pill */}
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#07111F]/80 px-4 py-3 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.45),0_0_0_1px_rgba(30,155,251,0.12),0_0_20px_rgba(30,155,251,0.08)]">
                  {/* animated grab icon */}
                  <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#1E9BFB]/20 bg-[#1E9BFB]/10">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#6EC1FF"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <path d="M18 11V6a2 2 0 0 0-4 0v5" />
                      <path d="M14 10V4a2 2 0 0 0-4 0v6" />
                      <path d="M10 10.5V6a2 2 0 0 0-4 0v8" />
                      <path d="M6 14a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4v-2.5" />
                      <path d="M18 11.5V14" />
                    </svg>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold leading-none text-white/90">
                      Pull card down
                    </p>
                    <p className="mt-1 text-[10px] leading-none text-white/45">
                      to Reveal
                    </p>
                  </div>
                </div>

                {/* bouncing chevron */}
                <ChevronDown className="h-4 w-4 animate-bounce text-[#1E9BFB]/60" />
              </div>
            </div>
          </div>
        </>
      )}

      <div
        className="
          relative z-10 mx-auto flex h-full max-w-7xl items-center px-6 pb-16 pt-96 pointer-events-none lg:px-8
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
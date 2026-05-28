"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { StrapiImage } from "../StrapiImage";
import type { HeroSectionDigitalWebProps } from "@/types";
import BlurText from "../ui/BlurText";

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

function ParticleBrackets({
  active,
  forming,
}: {
  active: boolean;
  forming: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const formingRef = useRef(forming);

  useEffect(() => {
    formingRef.current = forming;
  }, [forming]);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = window.devicePixelRatio || 1;
    let morph = 0;

    const rand = (min: number, max: number) =>
      min + Math.random() * (max - min);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = window.devicePixelRatio || 1;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    type Segment =
      | { type: "line"; from: [number, number]; to: [number, number] }
      | {
          type: "curve";
          from: [number, number];
          cp1: [number, number];
          cp2: [number, number];
          to: [number, number];
        };

    const leftBrace: Segment[] = [
      { type: "line", from: [0.82, 0.05], to: [0.5, 0.05] },
      {
        type: "curve",
        from: [0.5, 0.05],
        cp1: [0.18, 0.05],
        cp2: [0.18, 0.2],
        to: [0.23, 0.33],
      },
      {
        type: "curve",
        from: [0.23, 0.33],
        cp1: [0.29, 0.46],
        cp2: [0.02, 0.43],
        to: [0.02, 0.5],
      },
      {
        type: "curve",
        from: [0.02, 0.5],
        cp1: [0.02, 0.57],
        cp2: [0.29, 0.54],
        to: [0.23, 0.67],
      },
      {
        type: "curve",
        from: [0.23, 0.67],
        cp1: [0.18, 0.8],
        cp2: [0.18, 0.95],
        to: [0.5, 0.95],
      },
      { type: "line", from: [0.5, 0.95], to: [0.82, 0.95] },
    ];

    function cubic(t: number, p0: number, p1: number, p2: number, p3: number) {
      const u = 1 - t;
      return (
        u * u * u * p0 +
        3 * u * u * t * p1 +
        3 * u * t * t * p2 +
        t * t * t * p3
      );
    }

    function sampleSegment(segment: Segment, t: number) {
      if (segment.type === "line") {
        return {
          x: segment.from[0] + (segment.to[0] - segment.from[0]) * t,
          y: segment.from[1] + (segment.to[1] - segment.from[1]) * t,
        };
      }

      return {
        x: cubic(t, segment.from[0], segment.cp1[0], segment.cp2[0], segment.to[0]),
        y: cubic(t, segment.from[1], segment.cp1[1], segment.cp2[1], segment.to[1]),
      };
    }

    function sampleBrace(side: -1 | 1, t: number) {
      const index = Math.min(
        leftBrace.length - 1,
        Math.floor(t * leftBrace.length)
      );

      const localT = t * leftBrace.length - index;
      const point = sampleSegment(leftBrace[index], localT);

      return {
        x: side === -1 ? point.x : 1 - point.x,
        y: point.y,
      };
    }

    const particles = Array.from({ length: 1400 }, () => ({
      
      side: (Math.random() > 0.5 ? 1 : -1) as -1 | 1,
      t: Math.random(),
      freeX: Math.random(),
      freeY: Math.random(),
      vx: rand(-0.08, 0.08),
      vy: rand(-0.08, 0.08),
      size: rand(0.8, 1.7),
      alpha: rand(0.55, 1),
      seed: rand(0, 1000),
      spreadX: rand(-18, 18),
      spreadY: rand(-18, 18),
      blue: Math.random() > 0.86,
    }));
const backgroundParticles = Array.from({ length: 1400 }, () => ({
  x: Math.random(),
  y: Math.random(),
  vx: rand(-0.035, 0.035),
  vy: rand(-0.035, 0.035),
  size: rand(0.45, 1.1),
  alpha: rand(0.25, 0.6),
  seed: rand(0, 1000),
}));
    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      morph += ((formingRef.current ? 1 : 0) - morph) * 0.07;

      const isMobile = width < 768;

      const centerX = isMobile ? width * 0.5 : width * 0.5;
      const centerY = height * 0.52;

      const braceW = isMobile ? 200 : 325;
      const braceH = isMobile ? 420 : 540;
      const innerGap = isMobile ? 95 : 135;


      backgroundParticles.forEach((p) => {
      p.x += p.vx / width;
      p.y += p.vy / height;

      if (p.x < 0) p.x = 1;
      if (p.x > 1) p.x = 0;
      if (p.y < 0) p.y = 1;
      if (p.y > 1) p.y = 0;

      const twinkle = 0.45 + Math.sin(time * 0.002 + p.seed) * 0.35;

      ctx.beginPath();
      ctx.fillStyle = `rgba(30, 155, 251, ${p.alpha * twinkle})`;
      ctx.arc(p.x * width, p.y * height, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

      particles.forEach((p) => {
        p.freeX += p.vx / width;
        p.freeY += p.vy / height;

        if (p.freeX < 0) p.freeX = 1;
        if (p.freeX > 1) p.freeX = 0;
        if (p.freeY < 0) p.freeY = 1;
        if (p.freeY > 1) p.freeY = 0;

        const point = sampleBrace(p.side, p.t);

        const leftOriginX = centerX - innerGap / 2 - braceW;
        const rightOriginX = centerX + innerGap / 2;
        const originX = p.side === -1 ? leftOriginX : rightOriginX;
        const originY = centerY - braceH / 2;

        const braceX =
          originX +
          point.x * braceW +
          p.spreadX +
          Math.sin(time * 0.002 + p.seed) * 2;

        const braceY =
          originY +
          point.y * braceH +
          p.spreadY +
          Math.cos(time * 0.002 + p.seed) * 2;

        const freeX =
          p.freeX * width +
          Math.sin(time * 0.0006 + p.seed) * 8;

        const freeY =
          p.freeY * height +
          Math.cos(time * 0.0006 + p.seed) * 8;

        const x = freeX + (braceX - freeX) * morph;
        const y = freeY + (braceY - freeY) * morph;

        const twinkle = 0.55 + Math.sin(time * 0.003 + p.seed) * 0.45;

        const blueAlpha = p.alpha * twinkle * (0.75 + morph * 0.35);

        let color = `rgba(30, 155, 251, ${blueAlpha})`;

        

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(x, y, p.size + morph * 0.45, 0, Math.PI * 2);
        ctx.fill();
      });

      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}

export function HeroSectionDigitalWeb({
  heading,
  subheader,
  cta,
  logo,
  darken = false,
}: Readonly<HeroSectionDigitalWebProps>) {
  const [firstWord, ...restWords] = (heading ?? "").split(" ");
  const rest = restWords.join(" ");

  const [prefersReduced, setPrefersReduced] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
const [ctaHovered, setCtaHovered] = useState(false);
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

  const canAnimate = !prefersReduced && tabVisible;
  const showParticles = canAnimate && inView;

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

<ParticleBrackets active={showParticles} forming={ctaHovered} />
        {darken && (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/65" />
        )}
      </div>

      {/* Content */}
      <div className="pointer-events-none relative z-10 w-full px-6 py-16 md:px-10 md:py-20 lg:px-16 xl:px-20">
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
              whitespace-normal break-words font-agenda-medium
              text-[44px] leading-[0.95] tracking-[-0.055em]
              [overflow-wrap:anywhere]
              md:text-[62px] lg:text-[68px]
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
            style={{
              color: "#FFFFFF",
              fontSize: "clamp(20px, 2.8vw, 40px)",
              fontWeight: 400,
              lineHeight: "normal",
              letterSpacing: "-2px",
            }}
          >
            {subheader}
          </p>

          {cta && (
          <Link
  href={cta.href}
  target={cta.isExternal ? "_blank" : "_self"}
onMouseEnter={() => setCtaHovered(true)}
onMouseLeave={() => setCtaHovered(false)}
  className="pointer-events-auto group ml-auto mt-16 inline-flex items-center gap-3 text-slate-300 hover:text-white"
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
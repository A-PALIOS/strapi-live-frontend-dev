"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { StrapiImage } from "../StrapiImage";
import type { HeroSectionDigitalWebProps } from "@/types";
import BlurText from "../ui/BlurText";

// ─── Shared hook ────────────────────────────────────────────────────────────

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

  const inView = stickyOnceSeen ? inViewRaw || onceSeenRef.current : inViewRaw;
  return { ref, inView };
}

// ─── "brackets" variant — curly braces on black ─────────────────────────────

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
      { type: "curve", from: [0.5, 0.05], cp1: [0.18, 0.05], cp2: [0.18, 0.2], to: [0.23, 0.33] },
      { type: "curve", from: [0.23, 0.33], cp1: [0.29, 0.46], cp2: [0.02, 0.43], to: [0.02, 0.5] },
      { type: "curve", from: [0.02, 0.5], cp1: [0.02, 0.57], cp2: [0.29, 0.54], to: [0.23, 0.67] },
      { type: "curve", from: [0.23, 0.67], cp1: [0.18, 0.8], cp2: [0.18, 0.95], to: [0.5, 0.95] },
      { type: "line", from: [0.5, 0.95], to: [0.82, 0.95] },
    ];

    function cubic(t: number, p0: number, p1: number, p2: number, p3: number) {
      const u = 1 - t;
      return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
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
      const index = Math.min(leftBrace.length - 1, Math.floor(t * leftBrace.length));
      const localT = t * leftBrace.length - index;
      const point = sampleSegment(leftBrace[index], localT);
      return { x: side === -1 ? point.x : 1 - point.x, y: point.y };
    }

    let bSamples: { x: number; y: number }[] = [];

    const buildBSamples = () => {
      const isMobile = width < 768;
      const cx = width * 0.5, cy = height * 0.52;
      const bW = isMobile ? 200 : 325, bH = isMobile ? 420 : 540;
      const gap = isMobile ? 95 : 135;
      const lox = cx - gap / 2 - bW, rox = cx + gap / 2, oy = cy - bH / 2;
      bSamples = [];
      for (let i = 0; i <= 60; i++) {
        const t = i / 60;
        const lp = sampleBrace(-1, t);
        bSamples.push({ x: lox + lp.x * bW, y: oy + lp.y * bH });
        const rp = sampleBrace(1, t);
        bSamples.push({ x: rox + rp.x * bW, y: oy + rp.y * bH });
      }
    };

    const doResize = () => { resize(); buildBSamples(); };
    doResize();
    window.addEventListener("resize", doResize);

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
    }));

    const backgroundParticles = Array.from({ length: 1100 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: rand(-0.035, 0.035),
      vy: rand(-0.035, 0.035),
      size: rand(0.4, 0.9),
      alpha: rand(0.18, 0.45),
      seed: rand(0, 1000),
    }));

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      morph += ((formingRef.current ? 1 : 0) - morph) * 0.07;

      const isMobile = width < 768;
      const centerX = width * 0.5;
      const centerY = height * 0.52;
      const braceW = isMobile ? 200 : 325;
      const braceH = isMobile ? 420 : 540;
      const innerGap = isMobile ? 95 : 135;
      const leftOriginX = centerX - innerGap / 2 - braceW;
      const rightOriginX = centerX + innerGap / 2;
      const originY = centerY - braceH / 2;
      const GLOW_R = 110;

      backgroundParticles.forEach((p) => {
        p.x += p.vx / width;
        p.y += p.vy / height;
        if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
        if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;

        const px = p.x * width;
        const py = p.y * height;
        let minD2 = Infinity;

        if (morph > 0.05 && bSamples.length > 0) {
          for (const s of bSamples) {
            const ddx = s.x - px;
            const ddy = s.y - py;
            const d2 = ddx * ddx + ddy * ddy;
            if (d2 < minD2) minD2 = d2;
          }
        }

        const twinkle = 0.5 + Math.sin(time * 0.002 + p.seed) * 0.3;
        let glowT = 0;
        if (morph > 0.05 && minD2 < Infinity) {
          glowT = morph * Math.max(0, 1 - Math.sqrt(minD2) / GLOW_R);
        }
        const boost = 1 + morph * 0.9;
        ctx.beginPath();
        ctx.fillStyle = `rgba(30, 155, 251, ${Math.min(1, p.alpha * twinkle * boost * (1 + glowT * 3.5))})`;
        ctx.arc(px, py, p.size * (1 + glowT * 0.9), 0, Math.PI * 2);
        ctx.fill();
      });

      particles.forEach((p) => {
        p.freeX += p.vx / width;
        p.freeY += p.vy / height;
        if (p.freeX < 0) p.freeX = 1; if (p.freeX > 1) p.freeX = 0;
        if (p.freeY < 0) p.freeY = 1; if (p.freeY > 1) p.freeY = 0;

        const point = sampleBrace(p.side, p.t);
        const originX = p.side === -1 ? leftOriginX : rightOriginX;
        const braceX = originX + point.x * braceW + p.spreadX + Math.sin(time * 0.002 + p.seed) * 2;
        const braceY = originY + point.y * braceH + p.spreadY + Math.cos(time * 0.002 + p.seed) * 2;
        const freeX = p.freeX * width + Math.sin(time * 0.0006 + p.seed) * 8;
        const freeY = p.freeY * height + Math.cos(time * 0.0006 + p.seed) * 8;
        const x = freeX + (braceX - freeX) * morph;
        const y = freeY + (braceY - freeY) * morph;

        const twinkle = 0.55 + Math.sin(time * 0.003 + p.seed) * 0.45;
        ctx.beginPath();
        ctx.fillStyle = `rgba(30, 155, 251, ${p.alpha * twinkle * (0.75 + morph * 0.35)})`;
        ctx.arc(x, y, p.size + morph * 0.45, 0, Math.PI * 2);
        ctx.fill();
      });

      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", doResize);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}

// ─── "code" variant — rounded box + <> on dark ──────────────────────────────

function BoxChevronParticles({ hovered }: { hovered: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hoveredRef = useRef(hovered);

  useEffect(() => {
    hoveredRef.current = hovered;
  }, [hovered]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0, h = 0, dpr = 1;
    let morph = 0;

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    function sampleBox(t: number, bx: number, by: number, bw: number, bh: number, r: number) {
      const sw = bw - 2 * r;
      const sh = bh - 2 * r;
      const arc = (Math.PI / 2) * r;
      const perim = 2 * sw + 2 * sh + 4 * arc;
      const d = ((t % 1) + 1) % 1 * perim;
      let a = 0;

      if (d < a + sw) return { x: bx + r + (d - a), y: by };
      a += sw;
      if (d < a + arc) { const θ = -Math.PI / 2 + ((d - a) / arc) * (Math.PI / 2); return { x: bx + bw - r + Math.cos(θ) * r, y: by + r + Math.sin(θ) * r }; }
      a += arc;
      if (d < a + sh) return { x: bx + bw, y: by + r + (d - a) };
      a += sh;
      if (d < a + arc) { const θ = ((d - a) / arc) * (Math.PI / 2); return { x: bx + bw - r + Math.cos(θ) * r, y: by + bh - r + Math.sin(θ) * r }; }
      a += arc;
      if (d < a + sw) return { x: bx + bw - r - (d - a), y: by + bh };
      a += sw;
      if (d < a + arc) { const θ = Math.PI / 2 + ((d - a) / arc) * (Math.PI / 2); return { x: bx + r + Math.cos(θ) * r, y: by + bh - r + Math.sin(θ) * r }; }
      a += arc;
      if (d < a + sh) return { x: bx, y: by + bh - r - (d - a) };
      a += sh;
      const θ = Math.PI + ((d - a) / arc) * (Math.PI / 2);
      return { x: bx + r + Math.cos(θ) * r, y: by + r + Math.sin(θ) * r };
    }

    function sampleChevron(t: number, tipX: number, openX: number, cy: number, halfH: number) {
      if (t < 0.5) {
        const lt = t / 0.5;
        return { x: openX + (tipX - openX) * lt, y: cy - halfH + halfH * lt };
      }
      const lt = (t - 0.5) / 0.5;
      return { x: tipX + (openX - tipX) * lt, y: cy + halfH * lt };
    }

    const mkPool = (n: number) =>
      Array.from({ length: n }, () => ({
        t: Math.random(),
        fx: Math.random(), fy: Math.random(),
        vx: rand(-0.055, 0.055), vy: rand(-0.055, 0.055),
        sx: rand(-11, 11), sy: rand(-11, 11),
        size: rand(1.1, 2.5),
        alpha: rand(0.45, 0.92),
        seed: rand(0, 1000),
      }));

    const mkChevPool = (n: number) =>
      Array.from({ length: n }, () => ({
        t: Math.random(),
        fx: Math.random(), fy: Math.random(),
        vx: rand(-0.055, 0.055), vy: rand(-0.055, 0.055),
        sx: rand(-18, 18), sy: rand(-18, 18),
        size: rand(1.1, 2.5),
        alpha: rand(0.35, 0.85),
        seed: rand(0, 1000),
      }));

    const boxPts = mkPool(680);
    const leftPts = mkChevPool(480);
    const rightPts = mkChevPool(480);

    const bgPts = Array.from({ length: 650 }, () => ({
      x: Math.random(), y: Math.random(),
      vx: rand(-0.025, 0.025), vy: rand(-0.025, 0.025),
      size: rand(0.4, 1.2),
      alpha: rand(0.08, 0.32),
      seed: rand(0, 1000),
    }));

    const drawMorphParticle = (
      p: ReturnType<typeof mkPool>[number],
      target: { x: number; y: number },
      time: number
    ) => {
      p.fx += p.vx / w; p.fy += p.vy / h;
      if (p.fx < 0) p.fx = 1; if (p.fx > 1) p.fx = 0;
      if (p.fy < 0) p.fy = 1; if (p.fy > 1) p.fy = 0;

      const tx = target.x + p.sx + Math.sin(time * 0.0017 + p.seed) * 1.8;
      const ty = target.y + p.sy + Math.cos(time * 0.0017 + p.seed) * 1.8;
      const fx = p.fx * w + Math.sin(time * 0.0006 + p.seed) * 7;
      const fy = p.fy * h + Math.cos(time * 0.0006 + p.seed) * 7;
      const x = fx + (tx - fx) * morph;
      const y = fy + (ty - fy) * morph;
      const tw = 0.48 + Math.sin(time * 0.0024 + p.seed) * 0.42;

      ctx.beginPath();
      ctx.fillStyle = `rgba(160, 210, 255, ${p.alpha * tw})`;
      ctx.arc(x, y, p.size, 0, Math.PI * 2);
      ctx.fill();
    };

    const tick = (time: number) => {
      ctx.clearRect(0, 0, w, h);
      morph += ((hoveredRef.current ? 1 : 0) - morph) * 0.052;

      const cx = w * 0.5;
      const cy = h * 0.5;

      const boxW = Math.min(w * 0.58, 700);
      const boxH = Math.min(h * 0.65, 520);
      const bx = cx - boxW / 2;
      const by = cy - boxH / 2;

      const leftTipX  = bx + boxW * 0.18;
      const leftOpenX = bx + boxW * 0.44;
      const rightOpenX = bx + boxW * 0.56;
      const rightTipX  = bx + boxW * 0.82;
      const chevHalfH = boxH * 0.18;

      for (const p of bgPts) {
        p.x += p.vx / w; p.y += p.vy / h;
        if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
        if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;
        const tw = 0.35 + Math.sin(time * 0.0016 + p.seed) * 0.28;
        ctx.beginPath();
        ctx.fillStyle = `rgba(160, 210, 255, ${p.alpha * tw})`;
        ctx.arc(p.x * w, p.y * h, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const p of boxPts) {
        drawMorphParticle(p, sampleBox(p.t, bx, by, boxW, boxH, Math.min(boxW, boxH) * 0.16), time);
      }
      for (const p of leftPts) {
        drawMorphParticle(p, sampleChevron(p.t, leftTipX, leftOpenX, cy, chevHalfH), time);
      }
      for (const p of rightPts) {
        drawMorphParticle(p, sampleChevron(p.t, rightTipX, rightOpenX, cy, chevHalfH), time);
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────

export function HeroSectionDigitalWeb({
  heading,
  subheader,
  cta,
  logo,
  darken = false,
  enum: variant,
}: Readonly<HeroSectionDigitalWebProps>) {
  const [firstWord, ...restWords] = (heading ?? "").split(" ");
  const rest = restWords.join(" ");

  // ── "code" variant state ──
  const [hovered, setHovered] = useState(false);

  // ── "brackets" variant state ──
  const [prefersReduced, setPrefersReduced] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [ctaHovered, setCtaHovered] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReduced(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const onVis = () => setTabVisible(document.visibilityState === "visible");
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "100px 0px 100px 0px",
    stickyOnceSeen: false,
  });

  const canAnimate = !prefersReduced && tabVisible;
  const showParticles = canAnimate && inView;

  // ── "code" variant ────────────────────────────────────────────────────────
  if (variant === "code") {
    return (
      <section
        id="heropage"
        data-header="dark"
        className="relative min-h-[100vh] overflow-hidden bg-[#111111]"
      >
        <BoxChevronParticles hovered={hovered} />

        <div className="pointer-events-none relative z-10 flex min-h-[100vh] flex-col justify-center px-8 md:px-14 lg:px-20 xl:px-28">
          <div className="max-w-xl">
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

            <h1
              className="
                whitespace-normal break-words font-agenda-medium
                text-[44px] leading-[0.95] tracking-[-0.055em]
                [overflow-wrap:anywhere] text-white
                md:text-[62px] lg:text-[68px]
              "
            >
              <BlurText text={firstWord} delay={120} animateBy="words" direction="top" className="inline text-white" />{" "}
              <BlurText text={rest} delay={180} animateBy="words" direction="top" className="inline text-white" />
            </h1>

            <p
              className="mt-6 font-agenda-regular text-white/75"
              style={{ fontSize: "clamp(18px, 2.2vw, 32px)", fontWeight: 400, lineHeight: "normal", letterSpacing: "-1.5px" }}
            >
              {subheader}
            </p>

            {cta && (
              <Link
                href={cta.href}
                target={cta.isExternal ? "_blank" : "_self"}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className="pointer-events-auto group mt-12 inline-flex items-center gap-3 text-white/60 hover:text-white"
              >
                <span className="text-sm font-agenda-semibold md:text-base">{cta.text ?? "Learn More"}</span>
                <span className="grid h-7 w-7 place-items-center rounded-md bg-white text-black transition-transform duration-200 group-hover:translate-y-0.5 md:h-8 md:w-8">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
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

  // ── "brackets" variant ────────────────────────────────────────────────────
  return (
    <section
      ref={ref as any}
      id="heropage"
      data-header="dark"
      className="relative min-h-[100vh] overflow-hidden pt-32 md:pt-36 lg:pt-40"
    >
      <div className="absolute inset-0 -z-10 bg-black pointer-events-auto">
        <div className="absolute inset-0 bg-black" />
        <ParticleBrackets active={showParticles} forming={ctaHovered} />
        {darken && (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/65" />
        )}
      </div>

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
            <BlurText text={firstWord} delay={120} animateBy="words" direction="top" className="inline text-white" />{" "}
            <BlurText text={rest} delay={180} animateBy="words" direction="top" className="inline text-white" />
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
              onMouseEnter={() => setCtaHovered(true)}
              onMouseLeave={() => setCtaHovered(false)}
              className="pointer-events-auto group ml-auto mt-16 inline-flex items-center gap-3 text-slate-300 hover:text-white"
            >
              <span className="text-sm font-agenda-semibold md:text-base">{cta.text ?? "Learn More"}</span>
              <span className="mr-3 grid h-7 w-7 place-items-center rounded-md bg-[#5227FF] text-white transition-transform duration-200 group-hover:translate-y-0.5 sm:mr-6 md:h-8 md:w-8">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
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

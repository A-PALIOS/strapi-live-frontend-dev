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

// ─── "dataflow" variant — flowing wave ribbon + chart panel glyphs ──────────

function DataFlowParticles({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    const container = canvas?.parentElement;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    let w = 0, h = 0, dpr = 1;
    let fade = 0;

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    const resize = () => {
      w = container.clientWidth;
      h = container.clientHeight;
      dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const mouse = { x: 0.5, y: 0.5, inside: false };
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) / rect.width;
      mouse.y = (e.clientY - rect.top) / rect.height;
      mouse.inside = true;
    };
    const onMouseLeave = () => {
      mouse.inside = false;
    };
    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);

    // Path the ribbon flows along, t: 0 (lower-left) → 1 (upper-right)
    const wavePoint = (t: number) => ({
      x: -0.08 + t * 1.18,
      y:
        1.02 -
        t * 0.92 +
        Math.sin(t * Math.PI * 2.3) * 0.11 +
        Math.sin(t * Math.PI * 5.1 + 1.3) * 0.04,
    });

    const waveNormal = (t: number) => {
      const eps = 0.001;
      const a = wavePoint(Math.max(0, t - eps));
      const b = wavePoint(Math.min(1, t + eps));
      const dx = b.x - a.x, dy = b.y - a.y;
      const len = Math.hypot(dx, dy) || 1;
      return { x: -dy / len, y: dx / len };
    };

    const flowParticles = Array.from({ length: 1700 }, () => ({
      t: Math.random(),
      speed: rand(0.00006, 0.00016),
      offset: rand(-1, 1),
      size: rand(1.3, 3.2),
      alpha: rand(0.45, 1),
      seed: rand(0, 1000),
    }));

    const dustParticles = Array.from({ length: 260 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: rand(-0.02, 0.02),
      vy: rand(-0.02, 0.02),
      size: rand(0.4, 1),
      alpha: rand(0.08, 0.28),
      seed: rand(0, 1000),
    }));

    type Panel = {
      x: number; y: number; w: number; h: number;
      kind: "line" | "bars" | "donut" | "table" | "database" | "file" | "tableIcon" | "cloud" | "api";
      seed: number;
      hover: number;
    };

    const panels: Panel[] = [
      { x: 0.07, y: 0.11, w: 0.34, h: 0.24, kind: "line", seed: 10, hover: 0 },
      { x: 0.68, y: 0.16, w: 0.28, h: 0.46, kind: "bars", seed: 40, hover: 0 },
      { x: 0.30, y: 0.42, w: 0.22, h: 0.22, kind: "donut", seed: 70, hover: 0 },
      { x: 0.04, y: 0.46, w: 0.20, h: 0.18, kind: "bars", seed: 55, hover: 0 },
      { x: 0.58, y: 0.68, w: 0.36, h: 0.24, kind: "table", seed: 90, hover: 0 },
      { x: 0.02, y: 0.74, w: 0.14, h: 0.14, kind: "database", seed: 25, hover: 0 },
      { x: 0.20, y: 0.74, w: 0.14, h: 0.14, kind: "tableIcon", seed: 33, hover: 0 },
      { x: 0.44, y: 0.02, w: 0.13, h: 0.13, kind: "file", seed: 60, hover: 0 },
      { x: 0.44, y: 0.19, w: 0.14, h: 0.14, kind: "cloud", seed: 48, hover: 0 },
      { x: 0.40, y: 0.76, w: 0.14, h: 0.14, kind: "api", seed: 66, hover: 0 },
    ];

    const drawRoundedRect = (x: number, y: number, rw: number, rh: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + rw, y, x + rw, y + rh, r);
      ctx.arcTo(x + rw, y + rh, x, y + rh, r);
      ctx.arcTo(x, y + rh, x, y, r);
      ctx.arcTo(x, y, x + rw, y, r);
      ctx.closePath();
    };

    const drawDatabaseIcon = (cx: number, cy: number, size: number) => {
      const rx = size * 0.42, ry = size * 0.15, bodyH = size * 0.62;
      const top = cy - bodyH / 2, bottom = cy + bodyH / 2;
      ctx.beginPath();
      ctx.moveTo(cx - rx, top);
      ctx.lineTo(cx - rx, bottom);
      ctx.moveTo(cx + rx, top);
      ctx.lineTo(cx + rx, bottom);
      ctx.stroke();
      [top, cy, bottom].forEach((y) => {
        ctx.beginPath();
        ctx.ellipse(cx, y, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
      });
    };

    const drawFileIcon = (cx: number, cy: number, size: number) => {
      const fw = size * 0.5, fh = size * 0.64;
      const x = cx - fw / 2, y = cy - fh / 2;
      const fold = fw * 0.3;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + fw - fold, y);
      ctx.lineTo(x + fw, y + fold);
      ctx.lineTo(x + fw, y + fh);
      ctx.lineTo(x, y + fh);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + fw - fold, y);
      ctx.lineTo(x + fw - fold, y + fold);
      ctx.lineTo(x + fw, y + fold);
      ctx.stroke();
      for (let i = 0; i < 3; i++) {
        const ly = y + fh * 0.46 + i * fh * 0.16;
        ctx.beginPath();
        ctx.moveTo(x + fw * 0.16, ly);
        ctx.lineTo(x + fw * 0.84, ly);
        ctx.stroke();
      }
    };

    const drawTableIcon = (cx: number, cy: number, size: number) => {
      const tw = size * 0.62, th = size * 0.5;
      const x = cx - tw / 2, y = cy - th / 2;
      ctx.strokeRect(x, y, tw, th);
      const rowH = th / 3;
      ctx.beginPath();
      ctx.moveTo(x, y + rowH);
      ctx.lineTo(x + tw, y + rowH);
      ctx.moveTo(x, y + rowH * 2);
      ctx.lineTo(x + tw, y + rowH * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + tw * 0.42, y);
      ctx.lineTo(x + tw * 0.42, y + th);
      ctx.stroke();
    };

    const drawCloudIcon = (cx: number, cy: number, size: number) => {
      const baseY = cy + size * 0.16;
      const r1 = size * 0.15, r2 = size * 0.21, r3 = size * 0.16;
      const x1 = cx - size * 0.26, x2 = cx + size * 0.02, x3 = cx + size * 0.28;

      ctx.beginPath();
      ctx.moveTo(x1 - r1, baseY);
      ctx.arc(x1, baseY - r1 * 0.2, r1, Math.PI, Math.PI * 1.85);
      ctx.arc(x2, baseY - r2 * 0.55, r2, Math.PI * 1.1, Math.PI * 1.95);
      ctx.arc(x3, baseY - r3 * 0.2, r3, Math.PI * 1.25, 0);
      ctx.lineTo(x1 - r1, baseY);
      ctx.closePath();
      ctx.stroke();
    };

    const drawApiIcon = (cx: number, cy: number, size: number) => {
      ctx.font = `${Math.max(11, size * 0.34)}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("API", cx, cy);

      const gap = size * 0.44;
      ctx.beginPath();
      ctx.moveTo(cx - gap, cy - size * 0.22);
      ctx.lineTo(cx - gap - size * 0.1, cy);
      ctx.lineTo(cx - gap, cy + size * 0.22);
      ctx.moveTo(cx + gap, cy - size * 0.22);
      ctx.lineTo(cx + gap + size * 0.1, cy);
      ctx.lineTo(cx + gap, cy + size * 0.22);
      ctx.stroke();
    };

    const drawPanel = (panel: Panel, time: number, alpha: number) => {
      const wobbleX = Math.sin(time * 0.0038 + panel.seed) * 8 * panel.hover;
      const wobbleY = Math.cos(time * 0.0032 + panel.seed * 1.3) * 8 * panel.hover;
      const float = Math.sin(time * 0.0012 + panel.seed) * 4 + wobbleY;
      const px = panel.x * w + wobbleX;
      const py = panel.y * h + float;
      const pw = panel.w * w;
      const ph = panel.h * h;

      ctx.save();
      ctx.globalAlpha = alpha;

      const badgeKinds: Panel["kind"][] = ["database", "file", "tableIcon", "cloud", "api"];
      if (badgeKinds.includes(panel.kind)) {
        const cx = px + pw / 2, cy = py + ph / 2;
        const r = Math.min(pw, ph) / 2;

        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(10, 22, 42, ${0.55 + panel.hover * 0.15})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(120, 170, 255, ${0.35 + panel.hover * 0.4})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.strokeStyle = "rgba(150, 205, 255, 0.95)";
        ctx.fillStyle = "rgba(150, 205, 255, 0.95)";
        ctx.lineWidth = 1.4;
        if (panel.kind === "database") {
          drawDatabaseIcon(cx, cy, r * 1.3);
        } else if (panel.kind === "file") {
          drawFileIcon(cx, cy, r * 1.5);
        } else if (panel.kind === "tableIcon") {
          drawTableIcon(cx, cy, r * 1.5);
        } else if (panel.kind === "cloud") {
          drawCloudIcon(cx, cy, r * 1.6);
        } else {
          drawApiIcon(cx, cy, r * 1.4);
        }

        ctx.restore();
        return;
      }

      drawRoundedRect(px, py, pw, ph, 10);
      ctx.fillStyle = `rgba(10, 22, 42, ${0.55 + panel.hover * 0.15})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(120, 170, 255, ${0.35 + panel.hover * 0.4})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.strokeStyle = "rgba(120, 190, 255, 0.9)";
      ctx.fillStyle = "rgba(120, 190, 255, 0.9)";

      const pad = Math.min(pw, ph) * 0.16;

      if (panel.kind === "line") {
        const pts = [0.05, 0.4, 0.2, 0.6, 0.35, 0.9, 0.55, 0.7, 0.8, 0.3, 1, 0.55];
        const linePoints: { x: number; y: number }[] = [];
        for (let i = 0; i < pts.length; i += 2) {
          linePoints.push({
            x: px + pad + pts[i] * (pw - pad * 2),
            y: py + ph - pad - pts[i + 1] * (ph - pad * 2),
          });
        }
        ctx.beginPath();
        linePoints.forEach((p, i) => {
          if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
        });
        ctx.lineWidth = 1.5;
        ctx.stroke();

        linePoints.forEach((p) => {
          ctx.beginPath();
          ctx.fillStyle = "rgba(150, 205, 255, 0.95)";
          ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (panel.kind === "bars") {
        const heights = [0.32, 0.48, 0.4, 0.62, 0.8, 1];
        const padX = pw * 0.1;
        const padTop = ph * 0.1;
        const padBottom = ph * 0.08;
        const usableH = ph - padTop - padBottom;
        const gap = (pw - padX * 2) / heights.length;
        const bw = gap * 0.62;
        heights.forEach((hr, i) => {
          const bh = hr * usableH;
          const bx = px + padX + i * gap + (gap - bw) / 2;
          const by = py + ph - padBottom - bh;
          ctx.globalAlpha = alpha * (0.55 + hr * 0.45);
          ctx.fillRect(bx, by, bw, bh);
        });
        ctx.globalAlpha = alpha;
      } else if (panel.kind === "donut") {
        const cx = px + pw / 2, cy = py + ph / 2;
        const r = Math.min(pw, ph) / 2 - pad * 0.4;
        ctx.lineWidth = Math.max(3, r * 0.22);
        ctx.beginPath();
        ctx.strokeStyle = "rgba(120, 170, 255, 0.25)";
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = "rgba(120, 190, 255, 0.95)";
        ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * 0.78);
        ctx.stroke();
        ctx.fillStyle = "rgba(230, 240, 255, 0.95)";
        ctx.font = `${Math.max(11, r * 0.42)}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("78%", cx, cy);
      } else if (panel.kind === "table") {
        const rows = 4;
        const rowH = (ph - pad * 2) / rows;
        for (let i = 0; i < rows; i++) {
          const ry = py + pad + i * rowH + rowH * 0.5;
          ctx.globalAlpha = alpha * 0.7;
          ctx.fillRect(px + pad, ry - 1, pw - pad * 2.6, 2);
          ctx.globalAlpha = alpha * 0.9;
          ctx.fillRect(px + pw - pad * 1.7, ry - 1, pad * 0.9, 2);
        }
        ctx.globalAlpha = alpha;
      }

      ctx.restore();
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h);
      fade += (1 - fade) * 0.04;

      dustParticles.forEach((p) => {
        p.x += p.vx / w; p.y += p.vy / h;
        if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
        if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;
        const twinkle = 0.5 + Math.sin(time * 0.002 + p.seed) * 0.3;
        ctx.beginPath();
        ctx.fillStyle = `rgba(120, 170, 255, ${p.alpha * twinkle * fade})`;
        ctx.arc(p.x * w, p.y * h, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      flowParticles.forEach((p) => {
        p.t += p.speed * 16;
        if (p.t > 1) p.t -= 1;

        const base = wavePoint(p.t);
        const n = waveNormal(p.t);
        const thickness = 34 * Math.sin(p.t * Math.PI); // taper at both ends
        const ox = p.offset * thickness;
        const x = base.x * w + n.x * ox + Math.sin(time * 0.0015 + p.seed) * 1.5;
        const y = base.y * h + n.y * ox + Math.cos(time * 0.0015 + p.seed) * 1.5;

        const twinkle = 0.55 + Math.sin(time * 0.003 + p.seed) * 0.45;
        const hue = 190 + p.t * 40; // cyan → blue along the flow
        ctx.beginPath();
        ctx.fillStyle = `hsla(${hue}, 90%, 65%, ${p.alpha * twinkle * fade})`;
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      panels.forEach((panel) => {
        const px = panel.x * w, py = panel.y * h, pw = panel.w * w, ph = panel.h * h;
        const margin = 10;
        const isHovered =
          mouse.inside &&
          mouse.x * w >= px - margin &&
          mouse.x * w <= px + pw + margin &&
          mouse.y * h >= py - margin &&
          mouse.y * h <= py + ph + margin;
        panel.hover += ((isHovered ? 1 : 0) - panel.hover) * 0.08;
        drawPanel(panel, time, fade);
      });

      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}

// ─── "dashboard" variant — floating KPI cards + chart panel ─────────────────

function DashboardHeroVisual() {
  const lineD =
    "M0,58 C14,52 22,30 36,32 C50,34 56,18 70,20 C84,22 90,6 100,4";

  return (
    <div className="relative mx-auto h-[420px] w-full max-w-xl sm:h-[460px] lg:h-[540px]">
      <style jsx>{`
        @keyframes dashFloat {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>

      <div className="absolute left-1/2 top-1/2 h-[85%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/20 blur-[90px]" />

      {/* Main panel */}
      <div className="absolute left-[16%] right-0 top-[10%] h-[78%] rounded-2xl border border-blue-400/25 bg-[#0a1330]/90 p-4 shadow-2xl shadow-black/40 backdrop-blur sm:p-5">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1.5">
            <div className="h-2 w-20 rounded-full bg-white/15" />
            <div className="h-2 w-14 rounded-full bg-white/10" />
          </div>
          <div className="flex gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
          </div>
        </div>

        <div className="mt-4 h-[38%] w-full rounded-xl border border-white/5 bg-[#081026]/70 p-3">
          <svg viewBox="0 0 100 60" preserveAspectRatio="none" className="h-full w-full">
            <defs>
              <linearGradient id="heroLineStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#5B8CFF" />
                <stop offset="100%" stopColor="#8B6BFF" />
              </linearGradient>
              <linearGradient id="heroLineFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(91,140,255,0.35)" />
                <stop offset="100%" stopColor="rgba(91,140,255,0)" />
              </linearGradient>
            </defs>
            <path d={`${lineD} L100,60 L0,60 Z`} fill="url(#heroLineFill)" stroke="none" />
            <path d={lineD} fill="none" stroke="url(#heroLineStroke)" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-3">
          <div className="flex h-20 items-end gap-1.5 rounded-xl border border-white/5 bg-[#081026]/70 p-3">
            {[0.4, 0.6, 0.5, 0.75, 1].map((v, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-sm bg-gradient-to-t from-blue-500 to-indigo-400"
                style={{ height: `${v * 100}%` }}
              />
            ))}
          </div>

          <div className="flex h-20 items-center justify-center rounded-xl border border-white/5 bg-[#081026]/70">
            <svg viewBox="0 0 36 36" className="h-14 w-14">
              <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
              <circle
                cx="18"
                cy="18"
                r="15"
                fill="none"
                stroke="url(#heroLineStroke)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${0.78 * 2 * Math.PI * 15} ${2 * Math.PI * 15}`}
                transform="rotate(-90 18 18)"
              />
              <text x="18" y="21" textAnchor="middle" fontSize="9" fill="white">
                78%
              </text>
            </svg>
          </div>

          <div className="flex h-20 flex-col justify-center gap-2 rounded-xl border border-white/5 bg-[#081026]/70 p-3">
            <div className="h-1.5 w-full rounded-full bg-white/15" />
            <div className="h-1.5 w-2/3 rounded-full bg-white/10" />
            <div className="h-1.5 w-full rounded-full bg-white/15" />
            <div className="h-1.5 w-1/2 rounded-full bg-white/10" />
          </div>
        </div>
      </div>

      {/* Floating stat cards */}
      <div
        className="absolute left-0 top-0 w-[42%] rounded-xl border border-blue-400/25 bg-[#0a1330]/95 p-3 shadow-xl shadow-black/40 sm:p-4"
        style={{ animation: "dashFloat 6s ease-in-out infinite" }}
      >
        <div className="text-xs text-white/60 sm:text-sm">Total Projects</div>
        <div className="mt-1 font-agenda-medium text-xl text-white sm:text-2xl">24</div>
        <div className="mt-1 text-xs text-emerald-400 sm:text-sm">↑ +12%</div>
      </div>

      <div
        className="absolute right-0 top-[24%] w-[44%] rounded-xl border border-blue-400/25 bg-[#0a1330]/95 p-3 shadow-xl shadow-black/40 sm:p-4"
        style={{ animation: "dashFloat 7s ease-in-out infinite 1.2s" }}
      >
        <div className="text-xs text-white/60 sm:text-sm">Completion Rate</div>
        <div className="mt-1 font-agenda-medium text-xl text-white sm:text-2xl">78%</div>
        <div className="mt-1 text-xs text-emerald-400 sm:text-sm">↑ +8%</div>
      </div>

      <div
        className="absolute bottom-[6%] left-0 w-[42%] rounded-xl border border-blue-400/25 bg-[#0a1330]/95 p-3 shadow-xl shadow-black/40 sm:p-4"
        style={{ animation: "dashFloat 6.5s ease-in-out infinite 0.6s" }}
      >
        <div className="text-xs text-white/60 sm:text-sm">Active Clients</div>
        <div className="mt-1 font-agenda-medium text-xl text-white sm:text-2xl">56</div>
        <div className="mt-1 text-xs text-emerald-400 sm:text-sm">↑ +14%</div>
      </div>
    </div>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────

export function HeroSectionDigitalWeb({
  heading,
  subheader,
  cta,
  logo,
  author,
  darken = false,
  enum: variant,
}: Readonly<HeroSectionDigitalWebProps>) {
  const [firstWord, ...restWords] = (heading ?? "").split(" ");
  const rest = restWords.join(" ");

  // ── "dashboard" variant heading split — last two words get the gradient ──
  const headingWords = (heading ?? "").trim().split(" ").filter(Boolean);
  const highlightCount = Math.min(2, headingWords.length);
  const dashboardPlain = headingWords.slice(0, headingWords.length - highlightCount).join(" ");
  const dashboardHighlight = headingWords.slice(headingWords.length - highlightCount).join(" ");

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

  // ── "dashboard" variant ───────────────────────────────────────────────────
  if (variant === "dashboard") {
    return (
      <section
        id="heropage"
        data-header="dark"
        className="relative min-h-[100vh] overflow-hidden bg-[#050b16]"
      >
        <div className="relative z-10 grid min-h-[100vh] items-center gap-10 px-6 py-24 md:grid-cols-2 md:px-10 lg:px-16 xl:px-20">
          {/* Left: text */}
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

            <p className="mb-4 font-agenda-semibold text-sm uppercase tracking-[0.35em] text-indigo-300">
              {author || "Dashboards"}
            </p>

            <h1
              className="
                whitespace-normal break-words font-agenda-medium
                text-[44px] leading-[0.95] tracking-[-0.055em]
                [overflow-wrap:anywhere] text-white
                md:text-[62px] lg:text-[68px]
              "
            >
              {dashboardPlain && (
                <>
                  <BlurText text={dashboardPlain} delay={120} animateBy="words" direction="top" className="inline text-white" />{" "}
                </>
              )}
              <BlurText
                text={dashboardHighlight}
                delay={180}
                animateBy="words"
                direction="top"
                className="inline bg-gradient-to-r from-[#5B8CFF] to-[#8B6BFF] bg-clip-text text-blue-500"
              />
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
                className="group mt-12 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#4F6BF6] to-[#7C4DFF] px-7 py-3.5 text-white shadow-lg shadow-blue-900/30 transition-transform duration-200 hover:-translate-y-0.5"
              >
                <span className="text-sm font-agenda-semibold md:text-base">{cta.text ?? "Discuss Your Dashboard Needs"}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-4 w-4">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            )}
          </div>

          {/* Right: floating dashboard mockup — hidden on mobile */}
          <div className="hidden md:block">
            <DashboardHeroVisual />
          </div>
        </div>
      </section>
    );
  }

  // ── "dataflow" variant ────────────────────────────────────────────────────
  if (variant === "dataflow") {
    return (
      <section
        ref={ref as any}
        id="heropage"
        data-header="dark"
        className="relative min-h-[100vh] overflow-hidden bg-[#050b16]"
      >
        <div className="relative z-10 grid min-h-[100vh] items-center gap-10 px-6 py-24 md:grid-cols-2 md:px-10 lg:px-16 xl:px-20">
          {/* Left: text */}
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
                className="group mt-12 inline-flex items-center gap-3 rounded-full bg-[#2563eb] px-6 py-3 text-white transition-transform duration-200 hover:-translate-y-0.5"
              >
                <span className="text-sm font-agenda-semibold md:text-base">{cta.text ?? "Learn More"}</span>
                <span className="grid h-6 w-6 place-items-center rounded-md bg-white/15 transition-transform duration-200 group-hover:translate-x-0.5">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-3.5 w-3.5">
                    <path d="M11 3h2v12.17l3.59-3.58L18 13l-6 6-6-6 1.41-1.41L11 15.17V3z" />
                  </svg>
                </span>
              </Link>
            )}
          </div>

          {/* Right: flowing data wave — hidden on mobile, too dense/cramped to fit well below md */}
          <div className="relative hidden h-[480px] w-full md:block lg:h-[560px]">
            <DataFlowParticles active={showParticles} />
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

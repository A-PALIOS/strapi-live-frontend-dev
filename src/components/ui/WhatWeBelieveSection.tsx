"use client";

import React, { useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";

import { Beaker, Users2, Cog, Cpu } from "lucide-react";
import type { WhatWeBelieveProps, BeliefItem } from "@/types";
// import { Beaker, Users2, Cog, Cpu } from "lucide-react";


// --- 3D-Pin (Aceternity-like) ----------------------------------------
function PinBadge() {
  const prefersReduced = useReducedMotion();
  const rot = useSpring(0, { stiffness: 120, damping: 14 });
  const rotate = useTransform(rot, (v) => `rotate(${v}deg)`);

  useEffect(() => {
    if (prefersReduced) return;
    let frame: number;
    let t = 0;
    const loop = () => {
      t += 0.01;
      rot.set(Math.sin(t) * 4);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [rot, prefersReduced]);

  return (
    <motion.div
      aria-hidden
      style={{ transform: rotate as any }}
      className="relative inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-3 py-1.5 shadow-[0_8px_24px_-12px_rgba(30,155,251,0.35)]"
    >
      <span className="absolute -inset-6" />
      <span className="relative h-2.5 w-2.5 rounded-full bg-gradient-to-tr from-sky-400 to-blue-500 ring-4 ring-sky-300/30" />
      <span className="relative text-xs font-medium tracking-wide text-slate-800">Our Core Beliefs</span>
    </motion.div>
  );
}

// --- Card with magnetic glow / tilt ----------------------------------
 function BeliefCard({
  Icon,
  title,
  blurb,
  tint,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  blurb: string;
  tint: string;
}) {
  const prefersReduced = useReducedMotion();
  const cardRef = useRef<HTMLDivElement | null>(null);

  // mouse coords → spotlight position
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useTransform(my, [0, 1], [10, -10]); // rotateX
  const ry = useTransform(mx, [0, 1], [-12, 12]); // rotateY
  const glowX = useTransform(mx, (v) => `${v * 100}%`);
  const glowY = useTransform(my, (v) => `${v * 100}%`);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = (e.clientY - rect.top) / rect.height;
      mx.set(Math.min(1, Math.max(0, nx)));
      my.set(Math.min(1, Math.max(0, ny)));
    };

    const onLeave = () => {
      mx.set(0.5);
      my.set(0.5);
    };

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave, { passive: true });
    el.addEventListener("pointerdown", onMove, { passive: true }); // touch tap
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointerdown", onMove);
    };
  }, [mx, my]);

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      whileHover={prefersReduced ? {} : { scale: 1.01 }}
      style={prefersReduced ? {} : { rotateX: rx as any, rotateY: ry as any }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
      className={[
        "group relative overflow-hidden rounded-2xl border bg-[linear-gradient(90deg,#1E9BFB_0%,#156DB0_100%)]",
        "border-white/20 p-5 sm:p-6 ",
        "shadow-sm hover:shadow-[0_14px_40px_-24px_rgba(30,155,251,0.45)] transition-shadow",
        "[transform-style:preserve-3d]",
      ].join(" ")}
    >
      {/* background glow following pointer */}
      {!prefersReduced && (
        <motion.span
          style={{ left: glowX as any, top: glowY as any }}
          className={`pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr ${tint} blur-2xl w-48 h-48 opacity-60`}
          aria-hidden
        />
      )}

      {/* glossy edge */}
      <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/20 [mask:linear-gradient(#fff,transparent)]" />

      {/* icon */}
      <div className="relative mb-3 flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 ring-1 ring-white/20">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-white">
          {title}
        </h3>
      </div>

      <p className="relative text-sm leading-6 text-white/90">
        {blurb}
      </p>

      {/* subtle bottom shine */}
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-sky-50/60 to-transparent" />
    </motion.article>
  );
}



// 1) Map your icon keys to Lucide icons
const ICONS: Record<BeliefItem["iconKey"], React.ComponentType<{ className?: string }>> = {
  beaker: Beaker,
  users2: Users2,
  cog: Cog,
  cpu: Cpu,
};

// 2) Narrow the props to just what this block needs
type Props = Pick<WhatWeBelieveProps, "heading" | "title" | "content" | "items">;

export default function WhatWeBelieveSection({ title, content, heading, items }: Props) {
  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* ✨ Removed decorative grid / noise */}

      <div className="relative mx-auto px-4 sm:px-6 sm:py-20">
        <div className="mb-8 sm:mb-12 flex flex-col items-start gap-4">
          <PinBadge />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">
            {title}
          </h2>
          <p className="max-w-2xl text-base sm:text-lg text-slate-600">
            {content ||
              "Our work is guided by a set of core beliefs that shape how we think, collaborate, and deliver value."}
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {items?.map(({ id, title, blurb, iconKey }) => {
            const Icon = ICONS[iconKey] ?? Beaker;
            return (
              <BeliefCard
                key={id}
                Icon={Icon}
                title={title}
                blurb={blurb}
                tint="from-white/35 to-white/0"
              />
            );
          })}
        </div>
      </div>

      {/* ✨ Removed halo accents for pure white background */}
    </section>
  );
}



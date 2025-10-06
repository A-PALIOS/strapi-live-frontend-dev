"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ShieldCheck,
  BarChart3,
  Users2,
  RefreshCw,
  Star,
  HeartHandshake,
} from "lucide-react";

const VALUES = [
  { id: "integrity", title: "Integrity", text: "We act with transparency, honesty, and accountability in every collaboration. Trust is the cornerstone of our long-term relationships.", icon: ShieldCheck, angle: -90 },
  { id: "evidence",  title: "Evidence-Based Thinking", text: "We rely on data, research, and proven methodologies to inform our work—while remaining flexible to real-world complexity.", icon: BarChart3, angle: -30 },
  { id: "collab",    title: "Collaboration", text: "We co-design solutions with our partners, believing that mutual learning and shared ownership lead to better outcomes.", icon: Users2, angle: 15 },
  { id: "adapt",     title: "Adaptability", text: "We are responsive to context and change. We tailor our approach to each project’s unique needs, constraints, and opportunities.", icon: RefreshCw, angle: 90 },
  { id: "quality",   title: "Quality", text: "We uphold high standards of professionalism, structure, and consistency—reflected in our ISO 9001:2015 certification and continuous quality assurance processes.", icon: Star, angle: 150 },
  { id: "social",    title: "Social Value", text: "We are driven by the broader impact of our work, aiming to strengthen public systems and improve people’s well-being through sustainable interventions.", icon: HeartHandshake, angle: -150 },
] as const;

export default function MissionValuesNetwork_Centered() {
  const prefersReduced = useReducedMotion();
  const [active, setActive] = useState<string | null>(null);

  // Visual scale
  const RINGS = [90, 160, 230]; // for the faint backdrop rings (SVG)
  const RADIUS = 230;           // orbit radius (cards + dots + spokes use this)
  const CARD_W = 210;           // compact size you liked

  return (
    <section className="relative w-full max-w-6xl mx-auto px-6 py-20 bg-white text-[#061D2B]">
      <div className="text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-agenda-semibold text-[#0B6EEA]">Mission & Values</h2>
        <p className="text-base md:text-lg text-[#061D2B]/70 mt-2">Our guiding principles for sustainable public impact.</p>
      </div>

      <div className="relative mx-auto aspect-square w-full max-w-[980px]">
        {/* SVG rings only (visual background) */}
        <svg className="absolute inset-0 w-full h-full" viewBox="-320 -320 640 640" aria-hidden="true">
          {RINGS.map((r, i) => (
            <motion.circle
              key={r}
              r={r}
              cx={0}
              cy={0}
              fill="none"
              stroke="#0B6EEA"
              strokeOpacity={0.1}
              strokeWidth={1}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: prefersReduced ? 0 : 0.9 + i * 0.15, delay: 0.05 * i }}
            />
          ))}
        </svg>

        {/* Center hub pill */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45 }}
        >
          <div className="rounded-full px-6 py-3 bg-[#1E9BFB]/10 border border-[#1E9BFB]/30 backdrop-blur-[2px] text-center shadow-sm">
            <div className="text-xs md:text-sm uppercase tracking-widest text-[#0B6EEA]">Mission</div>
            <div className="text-base md:text-lg font-agenda-semibold text-[#061D2B]">Public Impact & Better Outcomes</div>
          </div>
        </motion.div>

        {/* Polar layout layer (CSS transforms for perfect alignment) */}
        <div className="absolute inset-0">
          {/* Origin at exact center */}
          <div className="absolute left-1/2 top-1/2">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              const isActive = active === v.id;

              return (
                <div
                  key={v.id}
                  // 1) rotate to angle, 2) translate outwards by radius
                  style={{ transform: `rotate(${v.angle}deg) translateX(${RADIUS}px)` }}
                  className="absolute"
                >
                  {/* spoke (line) — length = radius */}
                  <div
                    style={{
                      position: "absolute",
                      left: `-${RADIUS}px`,
                      top: "-1px",
                      width: `${RADIUS}px`,
                      height: "2px",
                      transform: "rotate(0deg)",
                      transformOrigin: "right center",
                      opacity: isActive ? 0.9 : 0.45,
                      background: isActive ? "#0B6EEA" : "#1E9BFB",
                    }}
                  />

                  {/* anchor dot (exact card center) */}
                  <div
                    style={{
                      position: "absolute",
                      width: 10,
                      height: 10,
                      borderRadius: "9999px",
                      background: isActive ? "#0B6EEA" : "#1E9BFB",
                      left: -5,
                      top: -5,
                    }}
                  />

                  {/* Counter-rotate so card reads upright, and center it on the dot */}
                  <motion.button
                    type="button"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.1 * i }}
                    onMouseEnter={() => setActive(v.id)}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(v.id)}
                    onBlur={() => setActive(null)}
                    className="outline-none focus-visible:ring-2 focus-visible:ring-[#0B6EEA] rounded-2xl"
                    style={{
                      transform: `rotate(${-v.angle}deg) translate(-50%, -50%)`,
                      transformOrigin: "left top",
                      position: "absolute",
                      left: 0,
                      top: 0,
                      width: CARD_W,
                    }}
                    aria-describedby={`${v.id}-desc`}
                  >
                    <div
                      className="rounded-2xl p-[1.5px]"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(11,110,234,0.28), rgba(11,110,234,0.10))",
                        boxShadow: isActive
                          ? "0 10px 22px rgba(11,110,234,0.18)"
                          : "0 6px 14px rgba(11,110,234,0.12)",
                      }}
                    >
                      <div
                        className="rounded-2xl p-4"
                        style={{
                          background:
                            "linear-gradient(180deg, #0B6EEA 0%, #1479D9 40%, #7CC7FF 100%)",
                          color: "white",
                        }}
                      >
                        <div className="flex items-start gap-2.5">
                          <span className="inline-flex p-2 rounded-xl bg-white/15">
                            <Icon className="w-4 h-4 text-white" />
                          </span>
                          <h3 className="font-agenda-semibold text-[15px] leading-snug">
                            {v.title}
                          </h3>
                        </div>
                        <p
                          id={`${v.id}-desc`}
                          className="mt-2 text-[12.5px] leading-relaxed text-white/95"
                        >
                          {v.text}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

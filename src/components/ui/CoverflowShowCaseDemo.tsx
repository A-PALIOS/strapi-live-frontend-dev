"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Site = {
  id: string;
  title: string;
  subtitle: string;
  tags: string[];
  thumb: string; // image url
  url: string;   // live url
};

const demoSites: Site[] = [
  {
    id: "s1",
    title: "Aegean Health Portal",
    subtitle: "Next.js • Dashboard • Role-based access",
    tags: ["Next.js", "React", "Dashboards"],
    thumb: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=70",
    url: "https://example.com",
  },
  {
    id: "s2",
    title: "Policy Insights Magazine",
    subtitle: "Content platform • Fast search • SEO-first",
    tags: ["React", "CMS", "SEO"],
    thumb: "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?auto=format&fit=crop&w=1200&q=70",
    url: "https://example.com",
  },
  {
    id: "s3",
    title: "EU Project Tracker",
    subtitle: "KPIs • Reports • Export-ready",
    tags: ["React", "KPI", "Analytics"],
    thumb: "https://images.unsplash.com/photo-1553028826-ccdfc0061814?auto=format&fit=crop&w=1200&q=70",
    url: "https://example.com",
  },
  {
    id: "s4",
    title: "Learning Hub",
    subtitle: "Interactive modules • LMS integration",
    tags: ["React", "E-learning", "UX"],
    thumb: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=70",
    url: "https://example.com",
  },
  {
    id: "s5",
    title: "Stakeholder Consultations",
    subtitle: "Feedback loops • Structured forms",
    tags: ["Forms", "Workflows", "Engagement"],
    thumb: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=70",
    url: "https://example.com",
  },
  {
    id: "s6",
    title: "Smart Data Collection",
    subtitle: "Offline-ready • Validation • Sync",
    tags: ["React", "Data", "Mobile"],
    thumb: "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?auto=format&fit=crop&w=1200&q=70",
    url: "https://example.com",
  },
];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function CoverflowShowcaseDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full flex items-center gap-3">
      <button
        onClick={() => setOpen(true)}
        className="rounded-2xl px-5 py-3 bg-black text-white font-medium shadow-lg hover:opacity-90 transition"
      >
        View Websites (Coverflow)
      </button>

      <CoverflowModal
        open={open}
        onClose={() => setOpen(false)}
        sites={demoSites}
      />
    </div>
  );
}

function CoverflowModal({
  open,
  onClose,
  sites,
}: {
  open: boolean;
  onClose: () => void;
  sites: Site[];
}) {
  const [index, setIndex] = useState(0);
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const maxIndex = sites.length - 1;

  // Reset focus index on open (optional)
  useEffect(() => {
    if (open) setIndex(0);
  }, [open]);

  // Keyboard controls
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => clamp(i + 1, 0, maxIndex));
      if (e.key === "ArrowLeft") setIndex((i) => clamp(i - 1, 0, maxIndex));
      if (e.key === "Enter") {
        const current = sites[index];
        window.open(current.url, "_blank", "noopener,noreferrer");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, sites, index, maxIndex]);

  // Wheel to navigate
  useEffect(() => {
    if (!open) return;
    const onWheel = (e: WheelEvent) => {
      // Trackpads can be sensitive; threshold prevents tiny scroll moves
      const threshold = 20;
      if (Math.abs(e.deltaY) < threshold && Math.abs(e.deltaX) < threshold) return;

      const dir = (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) > 0 ? 1 : -1;
      setIndex((i) => clamp(i + dir, 0, maxIndex));
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [open, maxIndex]);

  const current = sites[index];

  // Tune these for your vibe
  const spacing = 170; // px
  const rotate = 55;   // degrees
  const zDrop = 140;   // px
  const sideScale = 0.78;

  const items = useMemo(() => sites.map((s, i) => ({ s, i })), [sites]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div
            ref={backdropRef}
            className="absolute inset-0 bg-black/70 backdrop-blur-xl"
            onMouseDown={(e) => {
              // click outside closes
              if (e.target === backdropRef.current) onClose();
            }}
          />

          {/* Modal content */}
          <div className="relative h-full w-full flex flex-col">
            {/* Top bar */}
            <div className="flex items-center justify-between px-6 md:px-10 py-5">
              <div className="text-white/90">
                <div className="text-lg md:text-xl font-semibold">
                  Websites Showcase
                </div>
                <div className="text-white/60 text-sm">
                  Use ← →, mouse wheel, or click cards • Enter opens site
                </div>
              </div>

              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition rounded-xl px-3 py-2 bg-white/10 hover:bg-white/15"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Coverflow stage */}
            <div className="flex-1 flex items-center justify-center px-6 md:px-10">
              <div
                className="relative w-full max-w-6xl h-[520px] md:h-[560px]"
                style={{
                  perspective: "1200px",
                  transformStyle: "preserve-3d",
                }}
              >
                {items.map(({ s, i }) => {
                  const offset = i - index; // negative left, positive right
                  const abs = Math.abs(offset);

                  const isCenter = offset === 0;
                  const x = offset * spacing;
                  const rY = offset === 0 ? 0 : offset < 0 ? rotate : -rotate;
                  const z = offset === 0 ? 260 : 260 - abs * zDrop;
                  const sc = offset === 0 ? 1 : sideScale;
                  const opacity = abs > 3 ? 0 : 1; // hide far items
                  const pointer = abs > 3 ? "none" : "auto";

                  return (
                    <motion.button
                      key={s.id}
                      type="button"
                      onClick={() => setIndex(i)}
                      className="absolute left-1/2 top-1/2 rounded-3xl overflow-hidden border border-white/10 shadow-2xl outline-none"
                      style={{
                        width: "360px",
                        height: "460px",
                        transform: `translate(-50%, -50%) translateX(${x}px) rotateY(${rY}deg) translateZ(${z}px) scale(${sc})`,
                        transformStyle: "preserve-3d",
                        opacity,
                        pointerEvents: pointer as any,
                        zIndex: isCenter ? 50 : 50 - abs,
                      }}
                      initial={false}
                      animate={{
                        filter: isCenter ? "brightness(1.06)" : "brightness(0.86)",
                      }}
                      transition={{ type: "spring", stiffness: 260, damping: 28 }}
                    >
                      {/* thumbnail */}
                      <div className="relative w-full h-full">
                        <img
                          src={s.thumb}
                          alt={s.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />

                        {/* glossy overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-white/10" />
                        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition duration-300 bg-white/5" />

                        {/* browser-ish top chrome */}
                        <div className="absolute top-0 left-0 right-0 h-10 bg-black/35 backdrop-blur flex items-center gap-2 px-4">
                          <span className="h-2.5 w-2.5 rounded-full bg-white/40" />
                          <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
                          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                          <div className="ml-3 text-xs text-white/65 truncate">
                            {s.url.replace("https://", "")}
                          </div>
                        </div>

                        {/* text */}
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                          <div className="text-white font-semibold text-lg leading-tight">
                            {s.title}
                          </div>
                          <div className="text-white/70 text-sm mt-1">
                            {s.subtitle}
                          </div>

                          <div className="flex flex-wrap gap-2 mt-3">
                            {s.tags.slice(0, 3).map((t) => (
                              <span
                                key={t}
                                className="text-xs text-white/80 bg-white/10 border border-white/10 px-2.5 py-1 rounded-full"
                              >
                                {t}
                              </span>
                            ))}
                          </div>

                          {isCenter && (
                            <motion.div
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-4 flex gap-2"
                            >
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(s.url, "_blank", "noopener,noreferrer");
                                }}
                                className="px-4 py-2 rounded-2xl bg-white text-black font-medium hover:opacity-90 transition"
                              >
                                Open Live
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  alert("Replace with a detail modal / case-study drawer.");
                                }}
                                className="px-4 py-2 rounded-2xl bg-white/10 text-white border border-white/15 hover:bg-white/15 transition"
                              >
                                Details
                              </button>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Bottom info bar */}
            <div className="px-6 md:px-10 pb-7 pt-3">
              <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
                <div className="text-white/75">
                  <div className="text-sm">
                    <span className="text-white font-medium">{current.title}</span>{" "}
                    <span className="text-white/50">•</span>{" "}
                    <span className="text-white/60">{current.subtitle}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="rounded-xl px-3 py-2 bg-white/10 text-white/85 hover:bg-white/15 transition"
                    onClick={() => setIndex((i) => clamp(i - 1, 0, maxIndex))}
                  >
                    ←
                  </button>
                  <div className="text-white/60 text-sm tabular-nums">
                    {index + 1} / {sites.length}
                  </div>
                  <button
                    className="rounded-xl px-3 py-2 bg-white/10 text-white/85 hover:bg-white/15 transition"
                    onClick={() => setIndex((i) => clamp(i + 1, 0, maxIndex))}
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
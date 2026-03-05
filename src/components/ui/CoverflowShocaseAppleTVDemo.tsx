"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

export type Site = {
  id: string;
  title: string;
  subtitle: string;
  tags: string[];
  thumb: string;
  url: string;
  // optional extras
  screenshots?: string[];
  description?: string;
  stack?: string[];
};

const demoSites: Site[] = [
  {
    id: "s1",
    title: "Aegean Health Portal",
    subtitle: "Next.js • Dashboard • Role-based access",
    tags: ["Next.js", "React", "Dashboards"],
    stack: ["Next.js", "React", "Tailwind", "Auth", "Charts"],
    description:
      "A role-based portal with dashboards, analytics, and secure access for different user groups.",
    thumb:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=70",
    screenshots: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=70",
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1400&q=70",
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1400&q=70",
    ],
    url: "https://example.com",
  },
  {
    id: "s2",
    title: "Policy Insights Magazine",
    subtitle: "Content platform • Fast search • SEO-first",
    tags: ["React", "CMS", "SEO"],
    stack: ["React", "Headless CMS", "Search", "SEO"],
    description:
      "A publication experience optimized for discovery: fast search, structured content, and performance.",
    thumb:
      "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?auto=format&fit=crop&w=1400&q=70",
    screenshots: [
      "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?auto=format&fit=crop&w=1400&q=70",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1400&q=70",
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1400&q=70",
    ],
    url: "https://example.com",
  },
  {
    id: "s3",
    title: "EU Project Tracker",
    subtitle: "KPIs • Reports • Export-ready",
    tags: ["React", "KPI", "Analytics"],
    stack: ["React", "Charts", "Exports", "RBAC"],
    description:
      "A project tracker with KPI dashboards, reporting views, and exportable summaries for stakeholders.",
    thumb:
      "https://images.unsplash.com/photo-1553028826-ccdfc0061814?auto=format&fit=crop&w=1400&q=70",
    screenshots: [
      "https://images.unsplash.com/photo-1553028826-ccdfc0061814?auto=format&fit=crop&w=1400&q=70",
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1400&q=70",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=70",
    ],
    url: "https://example.com",
  },
  {
    id: "s4",
    title: "Learning Hub",
    subtitle: "Interactive modules • LMS integration",
    tags: ["React", "E-learning", "UX"],
    stack: ["React", "Video", "Quizzes", "LMS"],
    description:
      "A learning hub with interactive modules, progress tracking, and integrations with existing LMS tools.",
    thumb:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=70",
    screenshots: [
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=70",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=70",
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1400&q=70",
    ],
    url: "https://example.com",
  },
  {
    id: "s5",
    title: "Stakeholder Consultations",
    subtitle: "Feedback loops • Structured forms",
    tags: ["Forms", "Workflows", "Engagement"],
    stack: ["React", "Forms", "Workflows", "Email"],
    description:
      "A consultation platform to collect structured feedback, moderate responses, and produce summaries.",
    thumb:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=70",
    screenshots: [
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=70",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=70",
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1400&q=70",
    ],
    url: "https://example.com",
  },
  {
    id: "s6",
    title: "Smart Data Collection",
    subtitle: "Offline-ready • Validation • Sync",
    tags: ["React", "Data", "Mobile"],
    stack: ["React", "Offline", "Sync", "Validation"],
    description:
      "A lightweight data collection app with offline workflows, validation rules, and sync when online.",
    thumb:
      "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?auto=format&fit=crop&w=1400&q=70",
    screenshots: [
      "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?auto=format&fit=crop&w=1400&q=70",
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1400&q=70",
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1400&q=70",
    ],
    url: "https://example.com",
  },
];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function CoverflowShowcaseAppleTVDemo({
  sites = demoSites,
  buttonText = "View Websites (Apple TV Coverflow)",
  autoplay = true,
  autoplayDelayMs = 3200,
  startIndex = 0,
}: {
  sites?: Site[];
  buttonText?: string;
  autoplay?: boolean;
  autoplayDelayMs?: number;
  startIndex?: number;
}) {
  const [open, setOpen] = useState(false);

  // If there are no sites, don’t render anything (avoid crashes)
  if (!sites || sites.length === 0) return null;

  return (
    <div className="w-full flex items-center gap-3">
      <button
        onClick={() => setOpen(true)}
        className="rounded-2xl px-5 py-3 bg-black text-white font-medium shadow-lg hover:opacity-90 transition"
      >
        {buttonText}
      </button>

      <AppleTVCoverflowModal
        open={open}
        onClose={() => setOpen(false)}
        sites={sites}
        autoplay={autoplay}
        autoplayDelayMs={autoplayDelayMs}
        startIndex={startIndex}
      />
    </div>
  );
}






function AppleTVCoverflowModal({
  open,
  onClose,
  sites,
  autoplay,
  autoplayDelayMs,
  startIndex,
}: {
  open: boolean;
  onClose: () => void;
  sites: Site[];
  autoplay: boolean;
  autoplayDelayMs: number;
  startIndex: number;
}) {
  const safeMax = Math.max(0, sites.length - 1);

  const [index, setIndex] = useState(0);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);

  // Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const maxIndex = safeMax;

  // Idle autoplay
  const [isInteracting, setIsInteracting] = useState(false);
  const idleTimer = useRef<number | null>(null);
  const autoTimer = useRef<number | null>(null);

  const backdropRef = useRef<HTMLDivElement | null>(null);

  // Drag feel
  const dragX = useMotionValue(0);
  const dragXSpring = useSpring(dragX, { stiffness: 220, damping: 24 });

  // Parallax (mouse move)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const tiltX = useTransform(my, [-0.5, 0.5], [8, -8]);
  const tiltY = useTransform(mx, [-0.5, 0.5], [-10, 10]);
  const tiltXSpring = useSpring(tiltX, { stiffness: 120, damping: 18 });
  const tiltYSpring = useSpring(tiltY, { stiffness: 120, damping: 18 });

  const clampLocal = (n: number) => clamp(n, 0, maxIndex);
  const current = sites[clampLocal(index)];

  const currentShots =
    current?.screenshots?.length ? current.screenshots : current?.thumb ? [current.thumb] : [];

  const openLightbox = (i: number) => {
    if (!currentShots.length) return;
    setLightboxIndex(clamp(i, 0, currentShots.length - 1));
    setLightboxOpen(true);
  };
  const closeLightbox = () => setLightboxOpen(false);

  const nextShot = () => {
    if (!currentShots.length) return;
    setLightboxIndex((i) => (i + 1) % currentShots.length);
  };
  const prevShot = () => {
    if (!currentShots.length) return;
    setLightboxIndex((i) => (i - 1 + currentShots.length) % currentShots.length);
  };

  const items = useMemo(() => sites.map((s, i) => ({ s, i })), [sites]);

  function markInteraction() {
    setIsInteracting(true);
    if (idleTimer.current) window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => setIsInteracting(false), 2400);
  }

  // Reset on open using startIndex
  useEffect(() => {
    if (open) {
      const initial = clamp(startIndex ?? 0, 0, maxIndex);
      setIndex(initial);
      setFocusedIndex(initial);
      setDetailsOpen(false);
      setLightboxOpen(false);
      setLightboxIndex(0);
    }
  }, [open, startIndex, maxIndex]);

  // Keyboard controls
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      markInteraction();

      // Lightbox has priority
      if (lightboxOpen) {
        if (e.key === "Escape") {
          closeLightbox();
          return;
        }
        if (e.key === "ArrowRight") {
          nextShot();
          return;
        }
        if (e.key === "ArrowLeft") {
          prevShot();
          return;
        }
      }

      if (e.key === "Escape") {
        if (detailsOpen) setDetailsOpen(false);
        else onClose();
        return;
      }

      if (e.key === "ArrowRight") {
        const next = clamp(focusedIndex + 1, 0, maxIndex);
        setFocusedIndex(next);
        setIndex(next);
        return;
      }
      if (e.key === "ArrowLeft") {
        const prev = clamp(focusedIndex - 1, 0, maxIndex);
        setFocusedIndex(prev);
        setIndex(prev);
        return;
      }

      if (e.key === "Enter") {
        setDetailsOpen(true);
        return;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, detailsOpen, maxIndex, focusedIndex, lightboxOpen, currentShots.length]);

  // Wheel to navigate
  useEffect(() => {
    if (!open) return;

    const onWheel = (e: WheelEvent) => {
      markInteraction();
      const threshold = 18;
      const primary = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(primary) < threshold) return;

      const dir = primary > 0 ? 1 : -1;
      const next = clamp(index + dir, 0, maxIndex);
      setIndex(next);
      setFocusedIndex(next);
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [open, index, maxIndex]);

  // Autoplay when idle
  useEffect(() => {
    if (!open) return;
    if (!autoplay) return;

    if (autoTimer.current) window.clearInterval(autoTimer.current);
    autoTimer.current = window.setInterval(() => {
      if (isInteracting || detailsOpen || lightboxOpen) return;
      setIndex((i) => {
        const next = i >= maxIndex ? 0 : i + 1;
        setFocusedIndex(next);
        return next;
      });
    }, autoplayDelayMs);

    return () => {
      if (autoTimer.current) window.clearInterval(autoTimer.current);
    };
  }, [open, autoplay, autoplayDelayMs, isInteracting, detailsOpen, lightboxOpen, maxIndex]);

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
      if (autoTimer.current) window.clearInterval(autoTimer.current);
    };
  }, []);

  // Drag behavior
  function onDragEnd(_: any, info: { offset: { x: number } }) {
    markInteraction();
    const x = info.offset.x;
    const swipe = 60;

    let next = index;
    if (x < -swipe) next = clamp(index + 1, 0, maxIndex);
    if (x > swipe) next = clamp(index - 1, 0, maxIndex);

    setIndex(next);
    setFocusedIndex(next);
    dragX.set(0);
  }

  function onMouseMoveCenterCard(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    mx.set(px - 0.5);
    my.set(py - 0.5);
  }

  function resetParallax() {
    mx.set(0);
    my.set(0);
  }

  // Coverflow tune
  const spacing = 240; // more visible neighbors
  const rotate = 62;
  const zDrop = 150;
  const sideScale = 0.76;

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
            className="absolute inset-0 bg-black/65 backdrop-blur-2xl"
            onMouseDown={(e) => {
              if (e.target === backdropRef.current) onClose();
            }}
          />

          {/* Ambient background */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.img
              key={current?.id}
              src={current?.thumb}
              alt=""
              className="absolute inset-0 w-full h-full object-cover scale-[1.08]"
              initial={{ opacity: 0, filter: "blur(30px) brightness(0.55)" }}
              animate={{ opacity: 0.92, filter: "blur(40px) brightness(0.55)" }}
              exit={{ opacity: 0, filter: "blur(50px) brightness(0.50)" }}
              transition={{ duration: 0.55 }}
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-black/60" />
          </motion.div>

          <div className="relative h-full w-full flex flex-col">
            {/* Top bar */}
            <div className="flex items-center justify-between px-6 md:px-10 py-5">
              <div className="text-white/90">
                <div className="text-lg md:text-xl font-semibold">Websites Showcase</div>
                <div className="text-white/60 text-sm">
                  Swipe/drag • Wheel • ← → • Enter opens details
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDetailsOpen((v) => !v)}
                  className="text-white/80 hover:text-white transition rounded-xl px-3 py-2 bg-white/10 hover:bg-white/15"
                >
                  {detailsOpen ? "Hide Details" : "Details"}
                </button>

                <button
                  onClick={onClose}
                  className="text-white/80 hover:text-white transition rounded-xl px-3 py-2 bg-white/10 hover:bg-white/15"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Stage */}
            <div className="flex-1 flex items-center justify-center px-6 md:px-10">
              <motion.div
                className="relative w-full max-w-7xl h-[560px] md:h-[600px]"
                style={{ perspective: "1300px", transformStyle: "preserve-3d" }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.08}
                onDragStart={() => markInteraction()}
                onDragEnd={onDragEnd}
                onDrag={(e, info) => {
                  dragX.set(info.offset.x);
                }}
              >
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[720px] h-[220px] blur-3xl bg-white/10 rounded-full pointer-events-none" />

                {items.map(({ s, i }) => {
                  const offset = i - index;
                  const abs = Math.abs(offset);
                  const isCenter = offset === 0;

                  const dragInfluence = dragXSpring.get() / 7;
                  const x = offset * spacing + dragInfluence * (isCenter ? 1 : 0.35);

                  const rY = offset === 0 ? 0 : offset < 0 ? rotate : -rotate;
                  const z = offset === 0 ? 300 : 300 - abs * zDrop;

                  const sc = offset === 0 ? 1 : sideScale;
                  const opacity = abs > 4 ? 0 : 1;
                  const pointer = abs > 4 ? "none" : "auto";

                  // More visible sides
                  const blur = isCenter ? 0 : Math.min(3.5, abs * 1.1);
                  const dim = isCenter ? 1.16 : 0.98;

                  const isFocused = i === focusedIndex;

                  return (
                    <motion.div
                      key={s.id}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          markInteraction();
                          setIndex(i);
                          setFocusedIndex(i);
                        }
                      }}
                      onClick={() => {
                        markInteraction();
                        setIndex(i);
                        setFocusedIndex(i);
                      }}
                      onDoubleClick={() => setDetailsOpen(true)}
                      className="absolute left-1/2 top-1/2 rounded-[28px] overflow-hidden border border-white/10 shadow-2xl outline-none select-none"
                      style={{
                        width: "372px",
                        height: "476px",
                        transform: `translate(-50%, -50%) translateX(${x}px) rotateY(${rY}deg) translateZ(${z}px) scale(${sc})`,
                        transformStyle: "preserve-3d",
                        opacity,
                        pointerEvents: pointer as any,
                        zIndex: isCenter ? 60 : 60 - abs,
                        filter: `blur(${blur}px) brightness(${dim})`,
                      }}
                      initial={false}
                      animate={{
                        boxShadow: isCenter
                          ? "0 40px 90px rgba(0,0,0,0.55)"
                          : "0 18px 50px rgba(0,0,0,0.45)",
                      }}
                      transition={{ type: "spring", stiffness: 260, damping: 28 }}
                    >
                      <div
                        className="relative w-full h-full"
                        onMouseMove={isCenter ? onMouseMoveCenterCard : undefined}
                        onMouseLeave={isCenter ? resetParallax : undefined}
                      >
                        {/* TV focus ring */}
                        {isFocused && (
                          <motion.div
                            className="absolute inset-0 pointer-events-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.18 }}
                          >
                            <div className="absolute inset-0 ring-2 ring-white/60 rounded-[28px]" />
                            <div className="absolute -inset-1 ring-2 ring-white/15 blur-md rounded-[32px]" />
                          </motion.div>
                        )}

                        {/* Parallax layer */}
                        <motion.div
                          className="absolute inset-0"
                          style={
                            isCenter
                              ? {
                                  transformStyle: "preserve-3d",
                                  rotateX: tiltXSpring,
                                  rotateY: tiltYSpring,
                                }
                              : undefined
                          }
                        >
                          {/* Strict predictable crop frame */}
                          <div className="absolute inset-0">
                            <div className="relative h-full w-full overflow-hidden">
                              <img
                                src={s.thumb}
                                alt={s.title}
                                className="absolute inset-0 h-full w-full object-cover object-top"
                                loading="lazy"
                                draggable={false}
                              />
                            </div>
                          </div>

                          {/* Gloss (lighter) */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-white/10" />

                          {/* Browser chrome */}
                          <div className="absolute top-0 left-0 right-0 h-10 bg-black/35 backdrop-blur flex items-center gap-2 px-4">
                            <span className="h-2.5 w-2.5 rounded-full bg-white/40" />
                            <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
                            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                            <div className="ml-3 text-xs text-white/65 truncate">
                              {s.url.replace("https://", "")}
                            </div>
                          </div>

                          {/* Text */}
                          <div className="absolute bottom-0 left-0 right-0 p-5">
                            <div className="text-white font-semibold text-lg leading-tight">{s.title}</div>
                            <div className="text-white/70 text-sm mt-1">{s.subtitle}</div>

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
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ type: "spring", stiffness: 240, damping: 22 }}
                                className="mt-4 flex gap-2"
                                onMouseDown={(e) => e.stopPropagation()}
                              >
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markInteraction();
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
                                    markInteraction();
                                    setDetailsOpen(true);
                                  }}
                                  className="px-4 py-2 rounded-2xl bg-white/10 text-white border border-white/15 hover:bg-white/15 transition"
                                >
                                  Details
                                </button>
                              </motion.div>
                            )}
                          </div>

                          <div className="absolute inset-0 pointer-events-none ring-1 ring-white/10" />
                        </motion.div>
                      </div>

                      {/* Reflection */}
                      <div
                        className="absolute left-0 right-0 -bottom-[220px] h-[220px] pointer-events-none"
                        style={{ transform: "translateZ(-1px)" }}
                      >
                        <div className="relative h-full w-full overflow-hidden">
                          <img
                            src={s.thumb}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover scale-y-[-1] opacity-35"
                            draggable={false}
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/55 to-black/95" />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>

            {/* Bottom bar */}
            <div className="px-6 md:px-10 pb-7 pt-3">
              <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
                <div className="text-white/80">
                  <div className="text-sm">
                    <span className="text-white font-medium">{current.title}</span>{" "}
                    <span className="text-white/45">•</span>{" "}
                    <span className="text-white/60">{current.subtitle}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="rounded-xl px-3 py-2 bg-white/10 text-white/85 hover:bg-white/15 transition"
                    onClick={() => {
                      markInteraction();
                      const prev = clamp(index - 1, 0, maxIndex);
                      setIndex(prev);
                      setFocusedIndex(prev);
                    }}
                  >
                    ←
                  </button>
                  <div className="text-white/60 text-sm tabular-nums">
                    {index + 1} / {sites.length}
                  </div>
                  <button
                    className="rounded-xl px-3 py-2 bg-white/10 text-white/85 hover:bg-white/15 transition"
                    onClick={() => {
                      markInteraction();
                      const next = clamp(index + 1, 0, maxIndex);
                      setIndex(next);
                      setFocusedIndex(next);
                    }}
                  >
                    →
                  </button>
                </div>
              </div>
            </div>

            {/* Autoplay hint pill */}
            <motion.div
              className="absolute bottom-6 left-1/2 -translate-x-1/2"
              initial={{ opacity: 0, y: 12 }}
              animate={{
                opacity: isInteracting || detailsOpen || lightboxOpen ? 0 : 1,
                y: isInteracting || detailsOpen || lightboxOpen ? 12 : 0,
              }}
              transition={{ duration: 0.35 }}
            >
              <div className="text-xs text-white/70 bg-white/10 border border-white/10 rounded-full px-4 py-2 backdrop-blur">
                {autoplay
                  ? "Autoplay is ON when idle • Enter opens Details • Double-click card for Details"
                  : "Autoplay is OFF • Enter opens Details • Double-click card for Details"}
              </div>
            </motion.div>

            {/* DETAILS DRAWER */}
            <AnimatePresence>
              {detailsOpen && (
                <motion.aside
                  className="absolute top-0 right-0 h-full w-full sm:w-[520px] bg-black/35 backdrop-blur-2xl border-l border-white/10"
                  initial={{ x: 520, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 520, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 220, damping: 26 }}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <div className="h-full flex flex-col">
                    <div className="px-6 py-5 flex items-start justify-between">
                      <div>
                        <div className="text-white font-semibold text-xl">{current.title}</div>
                        <div className="text-white/65 text-sm mt-1">{current.subtitle}</div>
                      </div>

                      <button
                        onClick={() => setDetailsOpen(false)}
                        className="text-white/80 hover:text-white transition rounded-xl px-3 py-2 bg-white/10 hover:bg-white/15"
                        aria-label="Close details"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="px-6 pb-4">
                      <div className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">
                        {current.description ||
                          "Add a short description here for each site (value proposition, goal, and outcome)."}
                      </div>

                      {current.stack?.length ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {current.stack.map((t) => (
                            <span
                              key={t}
                              className="text-xs text-white/80 bg-white/10 border border-white/10 px-2.5 py-1 rounded-full"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      ) : null}

                      <div className="mt-5 flex gap-2">
                        <button
                          onClick={() => window.open(current.url, "_blank", "noopener,noreferrer")}
                          className="px-4 py-2 rounded-2xl bg-white text-black font-medium hover:opacity-90 transition"
                        >
                          Open Live
                        </button>
                        <button
                          onClick={() => setDetailsOpen(false)}
                          className="px-4 py-2 rounded-2xl bg-white/10 text-white border border-white/15 hover:bg-white/15 transition"
                        >
                          Close
                        </button>
                      </div>
                    </div>

                    <div className="px-6 pb-6 overflow-y-auto">
                      <div className="text-white/75 text-sm font-medium mb-3">Screenshots</div>

                      <div className="grid grid-cols-2 gap-3">
                        {(currentShots.length ? currentShots : []).map((src, idx) => (
                          <button
                            key={src + idx}
                            type="button"
                            onClick={() => openLightbox(idx)}
                            className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 text-left focus:outline-none focus:ring-2 focus:ring-white/40"
                          >
                            <img
                              src={src}
                              alt={`${current.title} screenshot ${idx + 1}`}
                              className="w-full h-36 object-cover"
                              loading="lazy"
                              draggable={false}
                            />
                          </button>
                        ))}
                      </div>

                      <div className="h-6" />
                    </div>
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>

            {/* LIGHTBOX */}
            <AnimatePresence>
              {lightboxOpen && (
                <motion.div
                  className="fixed inset-0 z-[90] flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onMouseDown={(e) => {
                    if (e.target === e.currentTarget) closeLightbox();
                  }}
                >
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

                  <motion.div
                    className="relative z-[91] w-[92vw] max-w-5xl"
                    initial={{ scale: 0.98, y: 10, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.98, y: 10, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 240, damping: 26 }}
                  >
                    <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-black/30">
                      <img
                        src={currentShots[lightboxIndex]}
                        alt={`${current.title} screenshot ${lightboxIndex + 1}`}
                        className="w-full h-[72vh] object-contain bg-black"
                        draggable={false}
                      />

                      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4">
                        <div className="text-white/80 text-sm">
                          <span className="text-white font-medium">{current.title}</span>{" "}
                          <span className="text-white/40">•</span>{" "}
                          <span className="text-white/60">
                            {lightboxIndex + 1}/{currentShots.length}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={closeLightbox}
                          className="rounded-xl px-3 py-2 bg-white/10 hover:bg-white/15 text-white/85 transition"
                          aria-label="Close lightbox"
                        >
                          ✕
                        </button>
                      </div>

                      {currentShots.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={prevShot}
                            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full px-3 py-2 bg-white/10 hover:bg-white/15 text-white/90 transition"
                            aria-label="Previous image"
                          >
                            ←
                          </button>
                          <button
                            type="button"
                            onClick={nextShot}
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-3 py-2 bg-white/10 hover:bg-white/15 text-white/90 transition"
                            aria-label="Next image"
                          >
                            →
                          </button>
                        </>
                      )}
                    </div>

                    <div className="mt-3 text-center text-white/55 text-xs">
                      Esc closes • ← → navigate • Click outside to close
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
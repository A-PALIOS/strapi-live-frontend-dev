"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ======================================================
// MASTER–DETAIL PROJECTS SHOWCASE (No Cards)
// - Left: fast index (years, categories, quick stats)
// - Right: big live preview that updates on hover/keys
// - Keyboard nav (↑/↓), auto-advance, sticky layout
// - Single-file mockup: drop in and render <ProjectsShowcaseMD />
// ======================================================

export type Project = {
  id: string;
  title: string;
  client?: string;
  year: number;
  category: "Web" | "Mobile" | "AI" | "Infra" | "E‑Commerce" | "Branding";
  tagline: string;
  description: string;
  cover: string; // hero image url
  gallery?: string[];
  metrics?: { label: string; value: string }[];
  tech?: string[];
};

const DATA: Project[] = [
  {
    id: "p1",
    title: "Nimbus Cloud Portal",
    client: "Aether Corp",
    year: 2025,
    category: "Web",
    tagline: "A unified operations surface for global infra.",
    description:
      "A modular, role-aware console with real-time telemetry, RBAC, and guided runbooks powering 50k+ daily ops.",
    cover:
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1556157381-1b94d05f1df1?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop",
    ],
    metrics: [
      { label: "Active Users", value: "50k+" },
      { label: "MTTR", value: "−34%" },
    ],
    tech: ["Next.js", "Node", "Grafana"],
  },
  {
    id: "p2",
    title: "Aurora Mobile Banking",
    client: "Helios Bank",
    year: 2024,
    category: "Mobile",
    tagline: "Secure daily banking with delightful flows.",
    description:
      "Rebuilt IA and auth; added biometrics and instant card provisioning. Stores rating up to 4.9★.",
    cover:
      "https://images.unsplash.com/photo-1516387938699-a93567ec168e?q=80&w=1600&auto=format&fit=crop",
    metrics: [
      { label: "App Rating", value: "4.9★" },
      { label: "MAU", value: "1.2M" },
    ],
    tech: ["React Native", "Go", "Keycloak"],
  },
  {
    id: "p3",
    title: "Mercury Recommender",
    client: "Shoplynx",
    year: 2025,
    category: "AI",
    tagline: "Personalization that respects latency budgets.",
    description:
      "Graph embeddings + bandits served at the edge; real-time A/B increased CTR by 31% and AOV by 23%.",
    cover:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1600&auto=format&fit=crop",
    metrics: [
      { label: "AOV", value: "+23%" },
      { label: "CTR", value: "+31%" },
    ],
    tech: ["PyTorch", "Redis", "Edge Functions"],
  },
  {
    id: "p4",
    title: "Atlas Edge Network",
    client: "GeoMesh",
    year: 2023,
    category: "Infra",
    tagline: "Global CDN + zero-trust network across 42 PoPs.",
    description:
      "Provisioned and automated an edge network with blue/green deploys and self-healing nodes.",
    cover:
      "https://images.unsplash.com/photo-1529101091764-c3526daf38fe?q=80&w=1600&auto=format&fit=crop",
    metrics: [
      { label: "PoPs", value: "42" },
      { label: "Uptime", value: "99.99%" },
    ],
    tech: ["Terraform", "Kubernetes", "WireGuard"],
  },
];

const CATS: Project["category"][] = ["Web", "Mobile", "AI", "Infra", "E‑Commerce", "Branding"];

function cx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export default function ProjectsShowcase() {
  const [activeId, setActiveId] = useState<string>(DATA[0]?.id ?? "");
  const [filter, setFilter] = useState<"All" | Project["category"]>("All");
  const [auto, setAuto] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const list = useMemo(() => (filter === "All" ? DATA : DATA.filter(p => p.category === filter)), [filter]);
  const index = Math.max(0, list.findIndex(p => p.id === activeId));
  const active = list[index] ?? list[0];

  // Auto-advance
  useEffect(() => {
    if (!auto || list.length <= 1) return;
    const t = setInterval(() => {
      const next = list[(index + 1) % list.length];
      setActiveId(next.id);
      // scroll item into view on the left
      const el = document.getElementById(`row-${next.id}`);
      el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }, 5000);
    return () => clearInterval(t);
  }, [auto, index, list]);

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = list[(index + 1) % list.length];
        setActiveId(next.id);
        document.getElementById(`row-${next.id}`)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = list[(index - 1 + list.length) % list.length];
        setActiveId(prev.id);
        document.getElementById(`row-${prev.id}`)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, list]);

  return (
    <div className="relative min-h-screen bg-zinc-950 text-zinc-100">
      <Backdrop />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-0 px-4 md:grid-cols-[minmax(340px,420px)_1fr] md:px-6">
        {/* Left: Index */}
        <aside className="sticky top-0 max-h-dvh overflow-y-auto border-r border-white/10 bg-zinc-950/70 py-6 backdrop-blur">
          <header className="px-2 pb-4">
            <h1 className="text-2xl font-medium tracking-tight">Selected Work</h1>
            <p className="mt-1 text-sm text-zinc-400">Hover or use ↑/↓ keys. Auto-advance is {auto ? "on" : "off"}.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <FilterPill active={filter === "All"} onClick={() => setFilter("All")}>All</FilterPill>
              {CATS.map((c) => (
                <FilterPill key={c} active={filter === c} onClick={() => setFilter(c)}>{c}</FilterPill>
              ))}
              <button
                onClick={() => setAuto(a => !a)}
                className={cx(
                  "ml-auto rounded-full border px-3 py-1.5 text-xs",
                  auto ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200" : "border-white/10 bg-white/5 text-zinc-300"
                )}
              >
                {auto ? "Pause auto" : "Resume auto"}
              </button>
            </div>
          </header>

          <ul ref={containerRef} className="divide-y divide-white/5">
            {list.map((p) => (
              <li
                id={`row-${p.id}`}
                key={p.id}
                onMouseEnter={() => { setActiveId(p.id); setAuto(false); }}
                onMouseLeave={() => setAuto(true)}
                onClick={() => setActiveId(p.id)}
                className={cx(
                  "group cursor-pointer px-3 py-3 transition-colors",
                  active?.id === p.id ? "bg-white/5" : "hover:bg-white/5"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cx(
                    "h-2.5 w-2.5 rounded-full",
                    active?.id === p.id ? "bg-cyan-400" : "bg-zinc-600 group-hover:bg-zinc-400"
                  )} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate text-sm font-medium">{p.title}</p>
                      <span className="shrink-0 text-xs text-zinc-400">{p.year}</span>
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                      <span>{p.category}</span>
                      {p.client && <span className="hidden md:inline">• {p.client}</span>}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </aside>

        {/* Right: Live Preview */}
        <section className="relative min-h-dvh">
          <div className="sticky top-0 h-dvh overflow-hidden">
            <AnimatePresence mode="wait">
              {active && (
                <motion.article
                  key={active.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                  className="flex h-full flex-col"
                >
                  {/* Cover */}
                  <div className="relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <CoverOrPlaceholder title={active.title} category={active.category} cover={""} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-zinc-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                        {active.year} • {active.category} {active.client ? `• ${active.client}` : ""}
                      </div>
                      <h2 className="mt-3 text-3xl font-semibold leading-tight">{active.title}</h2>
                      <p className="mt-1 max-w-3xl text-zinc-300">{active.tagline}</p>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="grid flex-1 grid-cols-1 gap-6 bg-black/20 p-6 md:grid-cols-3">
                    <div className="md:col-span-2">
                      <h3 className="text-sm uppercase tracking-widest text-zinc-400">Overview</h3>
                      <p className="mt-2 leading-relaxed text-zinc-300">{active.description}</p>

                      {active.gallery && active.gallery.length > 0 && (
                        <div className="mt-6 grid grid-cols-2 gap-3">
                          {active.gallery.map((g, i) => (
                            <div key={i} className="overflow-hidden rounded-xl border border-white/10">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={g} alt={active.title + " image " + (i + 1)} className="h-32 w-full object-cover" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      {active.metrics && active.metrics.length > 0 && (
                        <div>
                          <h4 className="text-sm uppercase tracking-widest text-zinc-400">Impact</h4>
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            {active.metrics.map((m) => (
                              <div key={m.label} className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                                <div className="text-lg font-semibold">{m.value}</div>
                                <div className="text-[11px] text-zinc-400">{m.label}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {active.tech && (
                        <div>
                          <h4 className="text-sm uppercase tracking-widest text-zinc-400">Stack</h4>
                          <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-300">
                            {active.tech.map((t) => (
                              <span key={t} className="rounded-md bg-white/5 px-2 py-1">{t}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="pt-2">
                        <a href="#contact" className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/20">
                          Discuss this project
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-80">
                            <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.article>
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </div>
  );
}

function FilterPill({ active, onClick, children }: { active?: boolean; onClick?: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cx(
        "rounded-full border px-3 py-1.5",
        active ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-200" : "border-white/10 bg-white/5 text-zinc-300 hover:border-white/20"
      )}
    >
      <span className="text-xs">{children}</span>
    </button>
  );
}

function CoverOrPlaceholder({ title, category, cover }: { title: string; category: Project["category"]; cover?: string }) {
  if (cover) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={cover} alt={title} className="h-[54vh] w-full object-cover" />;
  }
  const { h1, h2 } = hashTitleToHues(title);
  const initials = getInitials(title);
  return (
    <div className="relative flex h-[54vh] w-full items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            `radial-gradient(circle at 30% 30%, hsl(${h1} 90% 55% / .35), transparent 40%),` +
            `radial-gradient(circle at 70% 70%, hsl(${h2} 90% 55% / .35), transparent 42%),` +
            `linear-gradient(135deg, hsl(${h1} 60% 16%), hsl(${h2} 60% 14%))`,
        }}
      />
      {/* subtle grid overlay */}
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
      <span className="relative z-10 text-6xl font-semibold tracking-tight text-white/90 drop-shadow">{initials}</span>
      <span className="absolute right-4 top-4 rounded-full border border-white/10 bg-black/30 px-2 py-0.5 text-[10px] uppercase tracking-widest text-white/80">{category}</span>
    </div>
  );
}

function hashTitleToHues(s: string) {
  let hash = 0;
  for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
  const h1 = hash % 360;
  const h2 = (hash >>> 7) % 360;
  return { h1, h2 };
}

function getInitials(s: string) {
  return s.trim().split(/ +/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
}

function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute -top-40 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="absolute top-40 left-1/3 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05),transparent_60%)]" />
    </div>
  );
}

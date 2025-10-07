// "use client" is required in Next.js App Router for interactive components
"use client";
import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  HeartPulse,
  Compass,
  ClipboardList,
  Boxes,
  GraduationCap,
  Cpu,
  ArrowRight,
} from "lucide-react";

// Brand palette (from your screenshot)
const BRAND = {
  primary: "#0ea5e9", // cyan
  secondary: "#0b6eea", // deep sky/blue
  dark: "#061d2b", // card inner bg
};

/** Utility: convert #RRGGBB to rgba(r,g,b,a) */
function hexToRgba(hex: string, alpha = 1): string {
  const m = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex);
  if (!m) return hex; // fallback; let CSS handle it
  const r = parseInt(m[1], 16);
  const g = parseInt(m[2], 16);
  const b = parseInt(m[3], 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Services Tilt Hover Showcase
 * - Modern, animated grid of service cards with 3D tilt + parallax layers
 * - Smooth entrance animations on scroll (staggered)
 * - Accessible + keyboard focusable
 * - Tailwind-only styling, no external UI kit required
 *
 * Drop-in usage:
 * <ServicesTiltShowcase />
 * or pass your own data via the `items` prop (see defaultData below for shape)
 */

export default function ServicesShowcase({
  items,
}: {
  items?: ServiceItem[];
}) {
  const data = items ?? defaultData;

// at top of ServicesShowcase
const isTouch = typeof window !== "undefined"
  ? window.matchMedia?.("(hover:none)").matches
  : false;

  return (
    <section className="relative mx-auto max-w-7xl px-6">
      {/* Section header */}


      {/* Grid */}

<motion.ul
  initial={isTouch ? "show" : "hidden"}
  whileInView={isTouch ? undefined : "show"}
  viewport={isTouch ? undefined : { once: true, amount: 0.2 }}
  variants={containerStagger}
  className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
>
        {data.map((item, idx) => (
          <li key={item.title}>
            <TiltCard index={idx} item={item} />
          </li>
        ))}
      </motion.ul>
    </section>
  );
}

/***********************
 * Types & Mock Data
 **********************/

export type ServiceItem = {
  title: string;
  blurb: string;
  icon: React.ElementType;
  stats?: { label: string; value: string }[];
  bullets?: string[];
  cta?: { label: string; href: string }[];
};

const defaultData: ServiceItem[] = [
  {
    title: "Health Policy & Consulting",
    blurb:
      `Health systems must adapt to rising needs, constrained resources, and shifting public expectations. Effective health policy requires not just vision, but data-informed planning, stakeholder engagement, and system-level insight. We support institutions and decision-makers in designing and reforming health systems and policies that are sustainable, inclusive, and person-centered.
We combine strategic analysis with practical implementation expertise, helping our partners understand system dynamics, align interventions with population needs, and develop policies that are both technically sound and politically feasible.
`,
    icon: HeartPulse,
    stats: [
      { label: "Projects", value: "120+" },
      { label: "Countries", value: "14" },
      { label: "Avg. ROI", value: "3.2x" },
    ],
    bullets: [
        "Policy briefs and strategic policy reports", 
        "System and stakeholder mapping",
"Reform roadmaps and implementation frameworks",
"International best practice reviews and benchmarking",
"Technical input for legislative or regulatory proposals",
"Strategic consultation processes and participatory workshops",
"Support for alignment with international or EU policy frameworks",

     
    ],
    cta: [
      { label: "Request a proposal", href: "#" },
      { label: "See case studies", href: "#" },
    ],
  },
  {
    title: "Strategic Planning & Org Development",
    blurb:
      `Whether developing a business plan, redesigning services, or preparing for transformation, healthcare organizations need structured, evidence-based strategies that are operationally feasible and financially sound. We support public and private sector entities in building coherent strategic frameworks that link vision to delivery.
Our approach integrates organizational analysis, resource planning, stakeholder alignment, and performance management—resulting in actionable roadmaps that guide decision-making and implementation. We often contribute directly to the design of business plans, providing content on governance, capacity, cost structures, and development scenarios.
`,
    icon: Compass,
    stats: [
      { label: "Workshops", value: "250+" },
      { label: "Satisfaction", value: "98%" },
    ],
    bullets: [
"Strategic business plans and development roadmaps",
"Organizational diagnostics and resource mapping",
"Governance models and institutional restructuring scenarios",
"Service portfolio redesign and operational planning",
"Strategy-to-KPI frameworks and performance monitoring tools",
"Internal workshops to align leadership, teams, and priorities",
"Support for investment planning, proposals, and compliance",
"Technical support for compliance with accreditation or audit requirements",

    ],
    cta: [
      { label: "Request a proposal", href: "#" },
      { label: "See case studies", href: "#" },
    ],
  },
  {
    title: "Feasibility & Service Design Studies",
    blurb:
      `Designing or restructuring services requires a deep understanding of user needs, system capabilities, and real-world constraints. We support organizations in making informed decisions through structured studies that assess feasibility, model service scenarios, and propose pathways for implementation. Our work bridges strategic intent with operational design, ensuring services are responsive, viable, and sustainable.
We place particular emphasis on how services are accessed and experienced, including the definition and optimization of patient pathways that promote continuity, quality, and appropriate resource use.
`,
    icon: ClipboardList,
    bullets: [
    "Feasibility studies for new or restructured services",  
"Service design proposals and care model scenarios",  
"Functional and spatial planning inputs for health facilities",  
"Population needs assessments and demand forecasting",  
"Patient pathways analysis and redesign",  
"Cost-effectiveness and budget impact analyses",  
"Evaluations of service outcomes, access, and user experience",  
"Policy and operational recommendations based on study findings"

    ],
    cta: [
      { label: "Request a proposal", href: "#" },
      { label: "See case studies", href: "#" },
    ],
  },
  {
    title: "Project Design & Management (EU & National)",
    blurb:
      `Accessing public funding is a strategic opportunity, but also a complex challenge. Organizations often lack the time, expertise, or internal capacity to navigate the design, submission, and implementation of projects funded by European or national programs.
We help our partners transform ideas into fundable, well-structured proposals, supporting them from early concept development through to full implementation. Our services combine technical writing, compliance knowledge, budgeting, and project coordination, ensuring that funding applications are competitive and projects are efficiently executed.
`,
    icon: Boxes,
    bullets: [
  "Concept development and identification of funding opportunities",  
"Technical and narrative drafting of proposals (e.g. NSRF/ESPA, EU4Health, Horizon)",  
"Budget structuring, resource planning, and compliance alignment",  
"Partnership building and stakeholder coordination",  
"Work plan development and risk mitigation strategies",  
"Full project management support (monitoring, reporting, deliverables)",  
"Tools for performance tracking and evaluation",

    ],
    cta: [
      { label: "Request a proposal", href: "#" },
      { label: "See case studies", href: "#" },
    ],
  },
  {
    title: "Capacity Building & Methodology Support",
    blurb:
      `Effective capacity building requires more than knowledge transfer—it needs structured learning design, appropriate technologies, and methodological clarity. We help organizations design and deliver impactful learning experiences that are embedded in real-world objectives.
Our expertise lies in the co-design of blended capacity-building programmes, combining face-to-face and digital formats. We provide technical guidance on methodology, content structure, platform use, and digital interactivity—ensuring that every learning process is coherent, engaging, and aligned with organizational goals.
`,
    icon: GraduationCap,
    bullets: [
      "Design of blended and hybrid capacity-building programmes",  
"Development of implementation frameworks and structured learning pathways",  
"Support in using e-learning platforms (e.g. Moodle, TalentLMS)",  
"Production of interactive digital learning modules and toolkits",  
"Definition of indicators and outcome measurement strategies",  
"Curation of learning resources and digital content libraries",  
"Planning and coordination of workshops and virtual events",  
"Technical input for EU-funded training and upskilling initiatives",
    ],
    cta: [
      { label: "Request a proposal", href: "#" },
      { label: "See case studies", href: "#" },
    ],
  },
  {
    title: "Digital Solutions & Innovation",
    blurb:
      `Many organizations struggle with fragmented tools, administrative complexity, and inefficient workflows. We help address these challenges by designing and customizing digital solutions that respond to real project needs and operational realities.
From project management dashboards to data collection tools and knowledge-sharing platforms, we build user-friendly, scalable applications that improve coordination, transparency, and decision-making. Our solutions are developed in-house and tailored to the processes, capacities, and goals of each partner.
`,
    icon: Cpu,
    bullets: [
     "Design and customization of digital tools for project delivery and reporting",  
"Dashboards for project monitoring, KPIs, and performance metrics",  
"Workflow automation tools and task-tracking platforms",  
"Interactive data collection and survey modules",  
"Internal knowledge hubs and resource-sharing platforms",  
"E-learning integrations and digital content environments",  
"Technical support for implementation and user onboarding",

    ],
    cta: [
      { label: "Request a proposal", href: "#" },
      { label: "See case studies", href: "#" },
    ],
  },
];

/***********************
 * Tilt Card Component
 **********************/

function TiltCard({ item, index }: { item: ServiceItem; index: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // spring for buttery smooth tilt
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), {
    stiffness: 160,
    damping: 15,
    mass: 0.2,
  });
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), {
    stiffness: 160,
    damping: 15,
    mass: 0.2,
  });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height; // 0..1
    x.set(px - 0.5);
    y.set(py - 0.5);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const Icon = item.icon;

  return (
    <motion.div variants={cardItem} className="relative">
      {/* Outer glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-60 blur-2xl"
        style={{
          background: `linear-gradient(135deg, ${hexToRgba(
            BRAND.primary,
            0.25
          )}, ${hexToRgba(BRAND.secondary, 0.25)} 60%, transparent 80%)`,
        }}
      />

      {/* Card */}
      <motion.div
        ref={ref}
        onMouseMove={handleMouse}
        onMouseLeave={reset}
        style={{ rotateX: rx as any, rotateY: ry as any }}
        className="group relative h-full rounded-2xl bg-gradient-to-b from-cyan-600/25 to-sky-900/40 p-0.5 shadow-2xl ring-1 ring-cyan-300/20 backdrop-blur-sm"
      >
        <div
          className="relative h-full rounded-2xl p-5"
          style={{ backgroundColor: hexToRgba(BRAND.dark, 0.8) }}
        >
          {/* Parallax icon badge */}
          <motion.div
            style={{
              translateX: useTransform(ry, [-8, 8], [-6, 6]),
              translateY: useTransform(rx, [-6, 6], [-6, 6]),
            }}
            className="mb-4 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white/80 backdrop-blur"
          >
            <Icon className="h-5 w-5" />
            <span className="text-sm font-medium">Service</span>
          </motion.div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-white md:text-2xl">
            {item.title}
          </h3>

          {/* Blurb */}
          <p className="mt-2 text-sm leading-relaxed text-white/70 text-justify">
            {item.blurb}
          </p>

          {/* Stats (if any) */}
          {!!item.stats?.length && (
            <div className="mt-4 flex flex-wrap gap-2">
              {item.stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-white/80"
                >
                  <span className="mr-1.5 text-base font-semibold text-white">
                    {s.value}
                  </span>
                  <span className="text-xs uppercase tracking-wide text-white/60">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Bullets */}
          {!!item.bullets?.length && (
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              {item.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 flex-none rounded-full bg-white/60" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}

          {/* CTAs */}
          {!!item.cta?.length && (
            <div className="mt-6 flex flex-wrap gap-3">
              {item.cta.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white ring-1 ring-inset ring-white/15 transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/40"
                >
                  {c.label}
                  <ArrowRight className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}

          {/* Hover highlight */}
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: `radial-gradient( 600px circle at var(--mx,50%) var(--my,50%), ${hexToRgba(
                BRAND.primary,
                0.14
              )}, transparent 42% )`,
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

/***********************
 * Motion Variants
 **********************/

const containerStagger: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const cardItem: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

/***********************
 * Optional: Cursor spotlight sync (CSS var)
 * Add this tiny effect globally if you want the hover radial to follow cursor precisely
 **********************/

if (typeof window !== "undefined") {
  const w = window as any;
  if (!w.__servicesSpotlightInit) {
    w.__servicesSpotlightInit = true;
    window.addEventListener("mousemove", (e) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const card = target.closest(".group") as HTMLElement | null;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width) * 100;
      const my = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--mx", `${mx}%`);
      card.style.setProperty("--my", `${my}%`);
    });
  }
}


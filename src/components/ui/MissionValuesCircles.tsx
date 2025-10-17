import { motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useMemo,useState } from "react";
import { CheckCircle2, Brain, Users, Repeat, Award, HeartHandshake } from "lucide-react";

export type ValueItem = {
  id: string;
  title: string;
  body: string;
};

export type MissionValuesCirclesProps = {
  heading?: string;
  subheading?: string;
  values?: ValueItem[];
  accent?: string;
  accentSoft?: string;
  dark?: string;
  className?: string;
};

// const DEFAULT_VALUES: ValueItem[] = [
//   { id: "integrity", title: "Integrity", body: "We act with transparency, honesty, and accountability in every collaboration. Trust is the cornerstone of our long-term relationships." },
//   { id: "evidence", title: "Evidence-Based Thinking", body: "We rely on data, research, and proven methodologies to inform our work—while remaining flexible to real-world complexity." },
//   { id: "collab", title: "Collaboration", body: "We co-design solutions with our partners, believing that mutual learning and shared ownership lead to better outcomes." },
//   { id: "adapt", title: "Adaptability", body: "We are responsive to context and change. We tailor our approach to each project’s unique needs, constraints, and opportunities." },
//   { id: "quality", title: "Quality", body: "We uphold high standards of professionalism, structure, and consistency—reflected in our ISO 9001:2015 certification and continuous quality assurance processes." },
//   { id: "social", title: "Social Value", body: "We are driven by the broader impact of our work, aiming to strengthen public systems and improve people’s well-being through sustainable interventions." },
// ];

export default function MissionValuesCircles({
  heading = "Mission & Values",
  subheading = "What guides our work",
  values = [],
  accent = "#0b5da7",
  accentSoft = "#e7f2fb",
  dark = "#0d1b2a",
  className = "",
}: MissionValuesCirclesProps) {
  const prefersReducedMotion = useReducedMotion();

  const ringStops = useMemo(
    () => [
      { offset: "0%", color: accentSoft },
      { offset: "70%", color: accentSoft },
      { offset: "100%", color: "transparent" },
    ],
    [accentSoft]
  );

  const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };

  const item: Variants = {
    hidden: { opacity: 0, scale: 0.85, y: 12 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 260, damping: 22 },
    },
  };

  return (
    <section
      aria-labelledby="mv-heading"
      className={`relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm ${className}`}
    >
      {/* Decorative rings kept subtle; background remains pure white */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute -top-48 -right-40 h-[520px] w-[520px] opacity-50"
        viewBox="0 0 520 520"
        role="img"
      >
        <defs>
          <linearGradient id="ringFade" x1="0" x2="1" y1="0" y2="0">
            {ringStops.map((s, i) => (
              <stop key={i} offset={s.offset} stopColor={s.color} />
            ))}
          </linearGradient>
        </defs>
        {[120, 180, 240].map((r, i) => (
          <circle
            key={r}
            cx="260"
            cy="260"
            r={r}
            fill="none"
            stroke="url(#ringFade)"
            strokeWidth={i === 0 ? 14 : i === 1 ? 10 : 8}
            strokeDasharray={i === 2 ? "6 10" : undefined}
          />
        ))}
      </svg>

      <div className="mx-auto max-w-6xl">
        <header className="mb-8 sm:mb-12 text-center">
          <p className="text-sm uppercase tracking-widest text-slate-500">{subheading}</p>
          <h2 id="mv-heading" className="mt-2 text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-900">
            {heading}
          </h2>
        </header>

        <motion.ul
          variants={container}
          initial={prefersReducedMotion ? undefined : "hidden"}
          whileInView={prefersReducedMotion ? undefined : "show"}
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-10 md:gap-x-12 md:gap-y-12 place-items-center justify-items-center"
        >
          {values.map((v, idx) => (
            <motion.li key={v.id} variants={item} className="relative">
              <CircleCard index={idx} itemId={v.id} title={v.title} body={v.body} accent={accent} dark={dark} />
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
//NON ANIMATE CIRCLES
// function CircleCard({
//   index,
//   itemId,
//   title,
//   body,
//   accent,
//   dark,
// }: {
//   index: number;
//   itemId: string;
//   title: string;
//   body: string;
//   accent: string;
//   dark: string;
// }) {
//   const gradient = "linear-gradient(90deg,#1E9BFB 0%,#156DB0 100%)";

//   const iconForId: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string; style?: React.CSSProperties }>> = {
//     integrity: CheckCircle2,
//     evidence: Brain,
//     collab: Users,
//     adapt: Repeat,
//     quality: Award,
//     social: HeartHandshake,
//   };
//   const Fallback = CheckCircle2;
//   const Icon = iconForId[itemId] ?? Fallback;

//   return (
//     <div className="flex flex-col items-center">
//       <article className="group relative aspect-square w-48 sm:w-44 md:w-48 lg:w-40 xl:w-44 2xl:w-48 select-none">
//         {/* Gradient ring wrapper */}
//         <div className="h-full w-full rounded-full p-[2px]" style={{ background: gradient }}>
//           {/* Inner white circle */}
//           <div
//             className="relative h-full w-full rounded-full bg-white shadow-sm transition-transform duration-300 group-hover:scale-[1.03]"
//             style={{ outline: `1px solid ${accent}22` }}
//           >
//             {/* Local SVG defs for gradient stroke */}
//             <svg className="absolute h-0 w-0" aria-hidden>
//               <defs>
//                 <linearGradient id={`gradIcon-${index}`} x1="0" x2="1" y1="0" y2="0">
//                   <stop offset="0%" stopColor="#1E9BFB" />
//                   <stop offset="100%" stopColor="#156DB0" />
//                 </linearGradient>
//               </defs>
//             </svg>

//             {/* Icon center */}
//             <div className="absolute inset-0 flex items-center justify-center">
//               <Icon size={36} strokeWidth={2.4} style={{ stroke: `url(#gradIcon-${index})` }} />
//             </div>

//             {/* Hover reveal panel (no movement now) */}
//             <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
//               <div
//                 className="max-w-[230px] rounded-2xl border bg-white/95 p-4 text-center shadow-xl opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
//                 style={{ borderColor: accent + "33", transform: "translateY(0)" }}
//                 role="tooltip"
//               >
//                 <h3
//                   className="text-sm font-semibold"
//                   style={{ background: gradient, WebkitBackgroundClip: "text", color: "transparent" as any }}
//                 >
//                   {title}
//                 </h3>
//                 <p className="mt-2 text-xs leading-relaxed text-slate-600">{body}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </article>

//       {/* Caption under the circle */}
//       <p className="mt-3 line-clamp-1 text-center text-sm font-medium" style={{ color: dark }}>
//         {title}
//       </p>
//     </div>
//   );
// }

function CircleCard({
  index,
  itemId,
  title,
  body,
  accent,
  dark,
}: {
  index: number;
  itemId: string;
  title: string;
  body: string;
  accent: string;
  dark: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false); // ← mobile/tap state
  const floatDelay = (index % 6) * 0.6;
  const gradient = "linear-gradient(90deg,#1E9BFB 0%,#156DB0 100%)";

  const iconForId: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string; style?: React.CSSProperties }>> = {
    integrity: CheckCircle2,
    evidence: Brain,
    collab: Users,
    adapt: Repeat,
    quality: Award,
    social: HeartHandshake,
  };
  const Fallback = CheckCircle2;
  const Icon = iconForId[itemId] ?? Fallback;

  return (
    <div className="flex flex-col items-center">
      <motion.article
        className="group relative aspect-square w-48 sm:w-44 md:w-48 lg:w-40 xl:w-44 2xl:w-48 select-none"
        initial={{ y: 0 }}
        animate={prefersReducedMotion ? undefined : { y: [0, -6, 0, 4, 0] }}
        transition={{ duration: 6 + (index % 5), repeat: Infinity, delay: floatDelay, ease: "easeInOut" }}
      >
        {/* Gradient ring wrapper */}
        <div className="h-full w-full rounded-full p-[2px]" style={{ background: gradient }}>
          {/* Inner white circle */}
          <div
            className="relative h-full w-full rounded-full bg-white shadow-sm transition-transform duration-300 group-hover:scale-[1.03]"
            style={{ outline: `1px solid ${accent}22` }}
          >
            {/* Invisible button to capture taps / keyboard focus */}
            <button
              type="button"
              className="absolute inset-0 rounded-full focus:outline-none"
              aria-label={`Show ${title}`}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            />

            {/* Local SVG defs for gradient stroke */}
            <svg className="absolute h-0 w-0" aria-hidden>
              <defs>
                <linearGradient id={`gradIcon-${index}`} x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#1E9BFB" />
                  <stop offset="100%" stopColor="#156DB0" />
                </linearGradient>
              </defs>
            </svg>

            {/* Icon center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Icon size={36} strokeWidth={2.4} style={{ stroke: `url(#gradIcon-${index})` }} />
            </div>

            {/* Hover/tap reveal panel */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div
                className={[
                  "max-w-[230px] rounded-2xl border bg-white/95 p-4 text-center shadow-xl transition-opacity duration-200",
                  // Hover on desktop:
                  "group-hover:opacity-100 group-focus-within:opacity-100",
                  // Tap on mobile:
                  open ? "opacity-100" : "opacity-0",
                ].join(" ")}
                style={{ borderColor: accent + "33" }}
                role="tooltip"
              >
                <h3
                  className="text-sm font-semibold"
                  style={{ background: gradient, WebkitBackgroundClip: "text", color: "transparent" as any }}
                >
                  {title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">{body}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.article>

      {/* Caption under the circle */}
      <p className="mt-3 line-clamp-1 text-center text-sm font-medium" style={{ color: dark }}>
        {title}
      </p>
    </div>
  );
}

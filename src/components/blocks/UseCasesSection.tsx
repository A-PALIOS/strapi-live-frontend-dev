// app/components/blocks/UseCasesSection.tsx (or src/components/blocks/UseCasesSection.tsx)

import Image from "next/image";
import Link from "next/link";
import type { UseCasesSectionProps } from "@/types";
import { StrapiImage } from "../StrapiImage";

export function UseCasesSection({ data }: { data: UseCasesSectionProps }) {
  const img = data.image;
  console.log("UseCasesSection data:", data);

  return (
    <section className="relative overflow-hidden  bg-[#071426] text-white">
      <div className="mx-auto grid container gap-10 px-6 py-10 md:grid-cols-2 md:items-center">
        {/* Left */}
        <div>
          {data.eyebrow ? (
            <p className="text-sm font-medium text-white/70">{data.eyebrow}</p>
          ) : null}

          <h2 className="mt-2 text-2xl font-semibold leading-snug md:text-3xl">
            {data.title}
          </h2>

          <ul className="mt-6 space-y-3">
            {data.items?.map((item) => (
              <li key={item.id} className="flex items-start gap-3 text-white/85">
                <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10">
                  {item.icon === "none" ? null : (
                    <span className="text-xs leading-none">✓</span>
                  )}
                </span>
                <span className="leading-relaxed">{item.text}</span>
              </li>
            ))}
          </ul>

          {data.cta ? (
  <div className="mt-7">
    <Link
      href={data.cta.href}
      target={data.cta.isExternal ? "_blank" : undefined}
      rel={data.cta.isExternal ? "noreferrer" : undefined}
      className="
        group relative inline-flex items-center justify-center
        rounded-[22px] p-[1px]
        overflow-hidden cursor-pointer
        transition-all duration-500
        hover:scale-[1.04] hover:-translate-y-1
        active:scale-[0.985]
      "
    >
      <span
        className="
          pointer-events-none absolute inset-0 rounded-[22px]
          bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500
          opacity-70 blur-xl
          transition-all duration-500
          group-hover:opacity-100 group-hover:blur-2xl
        "
      />

      <span
        className="
          pointer-events-none absolute inset-0 rounded-[22px]
          bg-[conic-gradient(from_180deg_at_50%_50%,#22d3ee_0deg,#3b82f6_90deg,#8b5cf6_180deg,#3b82f6_270deg,#22d3ee_360deg)]
          animate-[spin_6s_linear_infinite]
        "
      />

      <span
        className="
          relative z-10 inline-flex items-center gap-3
          rounded-[21px]
          px-6 py-3
          bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(7,20,38,0.96))]
          backdrop-blur-xl
          border border-white/10
          text-white
          shadow-[0_20px_50px_rgba(0,0,0,0.45)]
        "
      >
        <span
          className="
            pointer-events-none absolute inset-0 rounded-[21px] overflow-hidden
          "
        >
          <span
            className="
              absolute -left-10 top-0 h-full w-[40%]
              bg-cyan-400/20 blur-2xl
              animate-[pulse_4s_ease-in-out_infinite]
            "
          />
          <span
            className="
              absolute right-0 top-0 h-full w-[35%]
              bg-blue-500/20 blur-2xl
              animate-[pulse_5s_ease-in-out_infinite]
            "
          />
          <span
            className="
              absolute left-1/3 top-0 h-full w-[25%]
              bg-violet-500/20 blur-2xl
              animate-[pulse_6s_ease-in-out_infinite]
            "
          />
        </span>

        <span
          className="
            pointer-events-none absolute inset-x-4 top-0 h-px
            bg-gradient-to-r from-transparent via-white/60 to-transparent
          "
        />

        <span
          className="
            pointer-events-none absolute left-[-30%] top-0 h-full w-[28%]
            skew-x-[-20deg]
            bg-gradient-to-r from-transparent via-white/20 to-transparent
            transition-all duration-1000
            group-hover:left-[120%]
          "
        />

        <span className="relative z-10 text-sm font-semibold tracking-[0.03em]">
          {data.cta.text}
        </span>

        <span
          className="
            relative z-10 flex h-8 w-8 items-center justify-center
            rounded-full
            bg-white/8
            border border-white/10
            shadow-inner shadow-white/5
            transition-all duration-300
            group-hover:bg-white/12 group-hover:translate-x-1
          "
        >
          <span
            aria-hidden
            className="text-base leading-none transition-transform duration-300 group-hover:translate-x-0.5"
          >
            ›
          </span>
        </span>
      </span>
    </Link>
  </div>
) : null}
        </div>

        {/* Right */}
        <div className="relative">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <StrapiImage
              src={img?.url}
              alt={img?.alternativeText || data?.title}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
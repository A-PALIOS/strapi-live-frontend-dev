import Image from "next/image";
import { StrapiImage } from "../StrapiImage";
import Link from "next/link";
import type { CaseHighlightProps } from "@/types";

type Props = {
  data: CaseHighlightProps;
};

export function CaseHighlight({ data }: Props) {
  const { Eyebrow, title, description, cta, image } = data;

  console.log("eyebrow:", data);

  return (
    <section className="relative overflow-hidden  bg-[#071426] text-white">
      {/* subtle border */}
      <div className="absolute inset-0  border border-white/10" />

      <div className="relative mx-auto grid container gap-10 px-6 py-10 md:grid-cols-2 md:items-center">
        {/* LEFT */}
        <div>
          {Eyebrow ? (
            <p className="text-sm font-medium text-white/70">{Eyebrow}</p>
          ) : null}

          <h2 className="mt-3 text-2xl font-semibold leading-tight md:text-3xl">
            {title}
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75 md:text-base">
            {description}
          </p>

         {cta ? (
  <div className="mt-6">
    <Link
      href={cta.href}
      target={cta.isExternal ? "_blank" : undefined}
      rel={cta.isExternal ? "noreferrer" : undefined}
      className="
        group relative inline-flex items-center justify-center
        rounded-[22px] p-[1px]
        overflow-hidden cursor-pointer
        transition-all duration-500
        hover:scale-[1.04] hover:-translate-y-1
        active:scale-[0.985]
      "
    >
      {/* outer glow */}
      <span
        className="
          pointer-events-none absolute inset-0 rounded-[22px]
          bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500
          opacity-70 blur-xl
          transition-all duration-500
          group-hover:opacity-100 group-hover:blur-2xl
        "
      />

      {/* animated border layer */}
      <span
        className="
          pointer-events-none absolute inset-0 rounded-[22px]
          bg-[conic-gradient(from_180deg_at_50%_50%,#22d3ee_0deg,#3b82f6_90deg,#8b5cf6_180deg,#3b82f6_270deg,#22d3ee_360deg)]
          animate-[spin_6s_linear_infinite]
        "
      />

      {/* main body */}
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
        {/* aurora animated background */}
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

        {/* top highlight */}
        <span
          className="
            pointer-events-none absolute inset-x-4 top-0 h-px
            bg-gradient-to-r from-transparent via-white/60 to-transparent
          "
        />

        {/* moving shine */}
        <span
          className="
            pointer-events-none absolute left-[-30%] top-0 h-full w-[28%]
            skew-x-[-20deg]
            bg-gradient-to-r from-transparent via-white/20 to-transparent
            transition-all duration-1000
            group-hover:left-[120%]
          "
        />

        {/* text */}
        <span className="relative z-10 text-sm font-semibold tracking-[0.03em]">
          {cta.text}
        </span>

        {/* icon capsule */}
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

        {/* RIGHT */}
        {image?.url ? (
        <div className="relative">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <StrapiImage
              src={image?.url}
              alt={image?.alternativeText || title}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
        </div>
        ): null}
      </div>
    </section>
  );
}
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
                className="inline-flex items-center gap-2 rounded-full bg-[#1b4dff] px-5 py-2.5 text-sm font-semibold hover:opacity-90"
              >
                {data.cta.text}
                <span aria-hidden>›</span>
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
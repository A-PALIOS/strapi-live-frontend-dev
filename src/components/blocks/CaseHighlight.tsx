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
                className="inline-flex items-center gap-2 rounded-full bg-[#1b4dff] px-5 py-2.5 text-sm font-semibold hover:opacity-90"
              >
                {cta.text}
                <span aria-hidden>›</span>
              </Link>
            </div>
          ) : null}
        </div>

        {/* RIGHT */}
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
      </div>
    </section>
  );
}
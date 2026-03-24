import Link from "next/link";
import { StrapiImage } from "../StrapiImage";
import type { HeroSectionProps } from "@/types";

export function HeroSection({
  heading,
  subheader,
  cta,
  image,
  logo,
  darken = false,
}: Readonly<HeroSectionProps>) {
  return (
    <section
      id="heropage"
      className="bg-[#fffff] pt-20 md:pt-24 lg:pt-28 pb-1 md:pb-1"
    >
      <div className="w-full px-6 md:px-10 lg:px-16 xl:px-20 py-16 md:py-20">
        {/* Top content */}
        <div className="max-w-4xl">
          {logo && (
            <div className="mb-6">
              <StrapiImage
                src={logo.image.url}
                alt={logo.image.alternativeText || "Logo"}
                className="h-10 w-auto object-contain"
                width={120}
                height={40}
              />
            </div>
          )}

          <h1 className="font-agenda-medium text-zinc-800 text-4xl leading-tight sm:text-5xl sm:leading-[1.05] lg:text-6xl lg:leading-[1.05] xl:text-7xl xl:leading-[1.02] 2xl:text-7xl 2xl:leading-[88px]">
  {heading}
</h1>

{subheader && (
  <p className="mt-6 max-w-6xl font-agenda-regular text-zinc-700 text-lg leading-relaxed sm:text-xl sm:leading-relaxed lg:text-2xl lg:leading-[1.5] xl:text-3xl xl:leading-[1.45] 2xl:text-2xl 2xl:leading-[1.4]">
    {subheader}
  </p>
)}

          {cta && (
            <div className="mt-8">
              <Link
                href={cta.href}
                target={cta.isExternal ? "_blank" : "_self"}
                className="inline-flex items-center gap-3 rounded-md bg-[#1E9BFB] px-6 py-3 text-sm font-agenda-semibold text-white transition hover:bg-[#156DB0]"
                aria-label={cta.text ?? "Learn more"}
              >
                <span>{cta.text ?? "Learn More"}</span>
                <span className="grid h-6 w-6 place-items-center rounded-sm bg-white/15">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                    className="h-4 w-4"
                  >
                    <path
                      d="M7 17L17 7M17 7H9M17 7V15"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </Link>
            </div>
          )}
        </div>

        {/* Hero image */}
        {image?.url && (
          <div className="mt-14 md:mt-16">
            <div className="relative overflow-hidden rounded-2xl">
              <StrapiImage
                src={image.url}
                alt={image.alternativeText || "Hero image"}
                className="h-[260px]  object-cover sm:h-[360px] lg:h-[576px]"
                width={1728}
                height={900}
              />

              {darken && (
                <div className="absolute inset-0 bg-black/20" />
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
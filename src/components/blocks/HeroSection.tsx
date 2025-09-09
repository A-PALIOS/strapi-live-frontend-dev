import Link from "next/link";
import { StrapiImage } from "../StrapiImage";
import type { HeroSectionProps } from "@/types";




export function HeroSection({
  // theme,
  heading,
  subheader,
  cta,
  image,
  logo,
  author,
  publishedAt,
  darken = false,
}: Readonly<HeroSectionProps>) {
   // split heading so first word is blue, rest is white
  const [firstWord, ...restWords] = (heading ?? "").split(" ");
  const rest = restWords.join(" ");


  return (
    // <section className="relative bg-white">
       <section className="relative min-h-[78vh]">
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        <StrapiImage
          src={image.url}
          alt={image.alternativeText || "Hero background"}
          className="h-full w-full object-cover"
          width={1920}
          height={1080}
          priority
        />
        {/* Dark/brand overlay */}
        {darken && (
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/65" />
        )}
      </div>

      {/* Content */}
      {/* pt-28 leaves room for your overlaid header; adjust if your header is taller/shorter */}
      <div className="relative mx-auto flex h-full max-w-7xl items-center px-6 pt-96 pb-16 lg:px-8">
        <div className="max-w-3xl text-white">
          {/* (Optional) small logo above text */}
          {logo && (
            <div className="mb-6">
              <StrapiImage
                src={logo.image.url}
                alt={logo.image.alternativeText || "Logo"}
                className="h-10 w-auto"
                width={120}
                height={120}
              />
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            <span className="text-[#1E9BFB]">{firstWord}</span>{" "}
            <span className="text-white">{rest}</span>
          </h1>

          {/* Lead paragraph (optional) */}
        
            <p className="mt-6 text-base/7 sm:text-lg/8 text-white/90 w-2xl">
            {subheader}            
            </p>
        

          {/* CTA (optional) */}
          {cta && (
            <div className="mt-8">
              <Link
                href={cta.href}
                target={cta.isExternal ? "_blank" : "_self"}
                className="inline-flex items-center gap-3 rounded-md bg-[#1E9BFB] px-6 py-3 text-sm font-semibold text-white shadow hover:bg-[#0f8ed6] transition"
              >
                {cta.text}
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-[#1E9BFB]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M7 7h10v10" />
                  </svg>
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
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
       <section id="heropage" data-header="dark" className="relative min-h-[78vh] overflow-hidden">
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
        
            <p className="mt-6 text-base/7 sm:text-lg/8 text-white/90 font-agenda-regular">
            {subheader}            
            </p>
        

          {/* CTA (optional) */}
          {cta && (
  <Link
    href={cta.href}
    target={cta.isExternal ? "_blank" : "_self"}
    className="group ml-auto inline-flex items-center gap-3 text-slate-300 hover:text-white mt-16"
    aria-label={cta.text ?? "Learn more"}
  >
    <span className="text-sm md:text-base font-agenda-semibold">
      {cta.text ?? "Learn More"}
    </span>

    {/* orange square */}
    <span
      className="mr-3 sm:mr-6 grid place-items-center w-7 h-7 md:w-8 md:h-8
                 rounded-md bg-[#FF8A00] text-white
                 transition-transform duration-200 group-hover:translate-y-0.5"
    >
      {/* FULL down arrow (filled) */}
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        className="w-4 h-4"
      >
        <path d="M11 3h2v12.17l3.59-3.58L18 13l-6 6-6-6 1.41-1.41L11 15.17V3z" />
      </svg>
    </span>
  </Link>
)}
        </div>
      </div>
    </section>
  );
}
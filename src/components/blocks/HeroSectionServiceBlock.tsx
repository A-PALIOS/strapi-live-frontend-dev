import Link from "next/link";
import { StrapiImage } from "../StrapiImage";
import type { HeroSectionServiceProps } from "@/types";
function getStrapiMediaUrl(url?: string | null) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${url}`;
}

export function HeroSectionServiceBlock({
  heading,
  subheader,
  cta,
  video,
  logo,
  darken = false,
  headingWidth,
}: Readonly<HeroSectionServiceProps>) {
   const useMinContentWidth = headingWidth === "min-content";
  console.log("Video: ",video);
  return (
    <section
      id="heropage"
      className=" pt-20 md:pt-24 lg:pt-28 pb-1 md:pb-1"
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

           <h1
            style={useMinContentWidth ? { width: "min-content" } : undefined}
            className={`
              text-[44px]
              leading-[0.95]
              tracking-[-0.055em]
              whitespace-normal
              break-words
              [overflow-wrap:anywhere]
              md:text-[62px]
              lg:text-[68px]
              font-agenda-medium
              ${useMinContentWidth ? "w-auto" : "w-full"}
            `}
          >
            {heading}
          </h1>

{subheader && (
  <p className="mt-6 max-w-6xl 
  font-agenda-normal 
  
   text-zinc-700

          text-[18px]
          leading-[1.28]
          tracking-[-0.03em]
          text-[#2c2626]
          sm:text-[19px]
          md:text-[20px]
          lg:text-[21px]



   ">
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
        {video?.url && (
          <div className="mt-14 md:mt-16">
            <div className="relative w-full aspect-[16/9] lg:aspect-[21/9] overflow-hidden rounded-2xl max-w-[1728px] mx-auto">
              <video
              key={video.url}
              className="object-cover"
              autoPlay
              muted
              loop
              playsInline
              controls={false}
            >
              <source src={getStrapiMediaUrl(video.url)} />
            </video>

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
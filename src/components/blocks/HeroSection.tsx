import Link from "next/link";
import { StrapiImage } from "../StrapiImage";
import type { HeroSectionProps } from "@/types";

export function HeroSection({
  heading,
  subheader,
  cta,
  image,
  logo,
  theme,
  darken = false,
    headingWidth,

}: Readonly<HeroSectionProps>) {
    const useMinContentWidth = headingWidth === "min-content";

    const themes = {
    white: "bg-white/40 border-white/20 text-black",
    black: "bg-black border-white/20 text-white",
  };

    const isWhite = theme === "white";

    const backgroundClass = isWhite ? "black" : "white";
    

    // Use the theme value to pick the class, defaulting to 'white' if theme is null
    const currentTheme = themes[theme as keyof typeof themes] || themes.white;


    let navbar_color= "light"
    if(theme=="black"){
      navbar_color="dark"
    }else{
      navbar_color="light"
    }

  return (
    <section
      id="heropage"
      data-header={`${navbar_color}`}
      className={`bg-${theme} pt-20 md:pt-24 lg:pt-28 pb-1 md:pb-1`}
    >
      <div className="w-full px-6 md:px-10 lg:px-16 xl:px-20 py-16 md:py-20">
        {/* Top content */}
        <div className="max-w-6xl">
          {logo && (
  <div className="mt-8 mb-8">
    <div
      className="
        inline-flex items-center gap-4
        px-5 py-4
        rounded-sm
      "
    >
      {/* Static text */}
      <span
        className="
          text-[#4A4A4A]
          text-[34px]
          leading-none
          font-agenda-medium
          uppercase
        "
      >
        CLIENT
      </span>

      {/* Divider */}
      <div className="h-10 w-px bg-[#323C43] font-agenda-regular rotate-[25deg]" />

      {/* Dynamic logo image */}
      <StrapiImage
        src={logo.image.url}
        alt={logo.image.alternativeText || "Client logo"}
        className="h-12 w-auto object-contain"
        width={220}
        height={60}
      />
    </div>
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
              ${theme === "black" ? "text-white":""}
              ${useMinContentWidth ? "w-auto" : "w-full"}
            `}
          >
            {heading}
          </h1>

{subheader && (
  <p
    className="mt-6 max-w-[1000px] font-agenda-regular"
    style={{ color: theme === "black" ? "#FFFFFF" : "#3F4449", fontSize: "clamp(20px, 2.8vw, 40px)", fontWeight: 400, lineHeight: "normal", letterSpacing: "-2px" }}
  >
    {subheader}
  </p>
)}
        </div>

        {/* Hero image */}
        {image?.url && (
          <div className="mt-14 md:mt-16 ">
            <div className={
            `relative overflow-hidden rounded-2xl
            ${theme==="black" ?
              
              "self-stretch  bg-gradient-to-l from-sky-900 via-sky-950 to-slate-950 rounded-lg shadow-[0px_0px_40px_0px_rgba(26,146,236,0.50)] outline outline-1 outline-offset-[-1px] outline-neutral-400 inline-flex justify-start items-center gap-2"
              :"rounded-lg inline-flex justify-start items-center gap-2"
            }
            
            `       
            
            }>
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
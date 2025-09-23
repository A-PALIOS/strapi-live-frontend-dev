"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { StrapiImage } from "../StrapiImage";
import type { HeroSectionMainProps } from "@/types";
import { FlipWords } from "../ui/flip-words";
import { TypewriterEffectSmooth } from "../ui/typewriter-effect";
import Counter from "../ui/counter";

const words = ["management services", "health services", "digital services", "data analytics"];



export function HeroSectionMain({
  heading,
  cta,
  image,
  logo,
  milestones,
  author,
  publishedAt,
  darken = true,
}: Readonly<HeroSectionMainProps>) {
  return (
    <section id="hero" data-header="dark" className="relative">
      {/* Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <StrapiImage
          src={image.url}
          alt={image.alternativeText || "Hero background"}
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        {darken && <div className="absolute inset-0" />}
      </div>

      {/* Content (no horizontal centering) */}
      <div className="relative isolate pt-16 md:pt-52 lg:pt-62 pb-20 md:pb-28">
        {/* left rail container */}
        <div className="w-full text-left pl-6 sm:pl-12 lg:pl-24 xl:pl-28">
          {/* tiny welcome row */}
          <div className="mb-6 flex items-center gap-3 text-slate-300">
            {logo && (
              <StrapiImage
                src={logo.image.url}
                alt={logo.image.alternativeText || "Logo"}
                className="h-10 w-auto"
                width={24}
                height={24}
              />
            )}
            <span className="text-sm text-white md:text-3xl font-agenda-medium">Welcome to CMT Prooptiki</span>
          </div>

          {/* Headline block */}
          {/* line 1 – typewriter */}
          <TypewriterEffectSmooth
            className="font-agenda-semibold text-slate-100 !my-0 leading-[0.95]
                       text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
            words={[{ text: heading || "We have the know how and" }]}
          />

          {/* line 2 – 'the experience in' + flipping word */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 3, duration: 0.35 }}
            className="mt-2"
          >
            <h1 className="text-slate-100 font-ivypresto-light tracking-tight leading-[0.92]
                            text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
              {" "}
              <span className="inline-flex align-baseline">
                <FlipWords className="text-slate-100 leading-[0.92]" words={words} />
              </span>
            </h1>
          </motion.div>

{/* Milestones + Learn More row */}
<div className="mt-50 flex flex-wrap items-center justify-between gap-4">
  {/* Milestones */}
  <ul className="flex flex-wrap items-center gap-4">
    {milestones.map((item, index) => (
      <li key={index} className="inline-flex items-center">
        <span className="font-agenda-semibold rounded-md bg-[#1E9BFB] px-4 py-2 text-white text-base md:text-5xl font-semibold shadow-md">
          <Counter
            number={item.value}
            className="inline-flex items-baseline m-0"
            counterClassName="counter !text-5xl !my-0 !leading-none"
            titleClassName="hidden"
          />
          <sup className="ml-0.5 relative -top-0.5 text-[0.7em]">+</sup>
        </span>
        <span
          className="font-agenda-semibold relative -ml-2 z-[-2000] inline-flex items-center h-[-webkit-fill-available]
                     rounded-lg border border-white/30
                     pt-2.5 pl-[22px] pr-3.5 pb-3.5
                     sm:pr-4 sm:pb-3.5
                     text-white/95 text-sm sm:text-base leading-none"
        >
          {item.label}
        </span>
      </li>
    ))}
  </ul>

 {cta && (
  <Link
    href={cta.href}
    target={cta.isExternal ? "_blank" : "_self"}
    className="group ml-auto inline-flex items-center gap-3 text-slate-300 hover:text-white"
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

  


          {(author || publishedAt) && (
            <div className="mt-4 space-x-3 text-sm text-slate-300">
              {author && <span>By {author}</span>}
              {publishedAt && <span>{publishedAt}</span>}
            </div>
          )}

   
        </div>
      </div>
    </section>
  );
}

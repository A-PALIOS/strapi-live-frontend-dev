"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { InfoBlockProps } from "@/types";
import { StrapiVideo } from "../StrapiVideo";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

export function InfoBlock({
  headline,
  description,
  cta,
  image,
}: Readonly<InfoBlockProps>) {
  const descRef = useRef<HTMLParagraphElement | null>(null);

  const pathname = usePathname();


 useEffect(() => {
  const el = descRef.current;
  if (!el) return;

  // 0) reset content to plain text to avoid double-wrapping after nav
  const original = (el.textContent ?? "").trim() || (description ?? "");
  el.textContent = original;

  // 1) split into words + whitespace (idempotent)
  const tokens = original.match(/\S+|\s+/g) || [];
  el.innerHTML = tokens
    .map((t) => (/\S/.test(t) ? `<span class="desc-word">${t}</span>` : t))
    .join("");

  // 2) build animation in a gsap context scoped to this element
  const ctx = gsap.context(() => {
    const words = el.querySelectorAll<HTMLSpanElement>(".desc-word");

    // set initial styles so it's deterministic after back/forward
    gsap.set(words, { color: "#D1D5DB" });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 70%",
        end: "bottom 30%",
        scrub: true,
        // markers: true, // uncomment to debug
      },
    });

    tl.to(words, {
      color: "#111827",
      stagger: 0.08,
      duration: 0.8,
      ease: "none",
    });
  }, el);

  // 3) refresh ScrollTrigger AFTER this tick and on bfcache restore
  const refresh = () => ScrollTrigger.refresh();
  const raf = requestAnimationFrame(refresh);
  window.addEventListener("pageshow", refresh); // back/forward cache
  window.addEventListener("resize", refresh);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("pageshow", refresh);
    window.removeEventListener("resize", refresh);

    // revert only what we created here (timelines + inline styles)
    ctx.revert();

    // put the DOM back to clean text so we can safely re-init later
    el.textContent = original;
  };
}, [pathname, description]);

//another useEffect showing pixelbypixel logic
  /*
   
   useEffect(() => {
  const el = descRef.current;
  if (!el || (el as any).__animated) return;
  (el as any).__animated = true;

  // 1) Get visible text (keeps natural wrapping)
  const combined = el.innerText || "";

  // 2) Tokenize into words & whitespace (keep spaces as-is)
  const tokens = combined.match(/\S+|\s+/g) || [];

  // 3) Wrap only the words
  const html = tokens
    .map((t) => (/\S/.test(t) ? `<span class="desc-word">${t}</span>` : t))
    .join("");
  el.innerHTML = html;

  const words = el.querySelectorAll<HTMLSpanElement>(".desc-word");

  // 4) Start color for all words (light gray)
  gsap.set(words, { color: "#D1D5DB" });

  // === CONFIG ===
  const pixelsPerWord = 32;        // ← scroll distance (px) to reveal next word
  const highlightColor = "#111827"; // near-black
  // ==============

  // Total scroll distance maps linearly to number of words
  const totalScroll = Math.max(300, words.length * pixelsPerWord);

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: el,
      start: "top 75%",          // begin when the paragraph nears viewport
      end: `+=${totalScroll}`,   // each ~pixelsPerWord reveals one word
      scrub: true,
      // Optional: snap to each word step (feels very “one-by-one”):
      // snap: 1 / Math.max(1, words.length - 1),
    },
  });

  // 5) Add an instantaneous color set for each word at a distinct timeline time
  words.forEach((w, i) => {
    tl.to(w, { color: highlightColor, duration: 0 }, i);
  });
  // Ensure timeline has a little tail so the last word can be reached
  tl.to({}, { duration: 1 }, words.length);

  return () => {
    tl.kill();
    ScrollTrigger.getAll().forEach((st) => st.kill());
  };
}, []);
  */
  

  return (
    <section className="bg-white overflow-x-clip"> {/* clip any tiny overflow */}
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        {/* Top bar */}
        <div className="flex items-start justify-between">
          <div className="inline-flex max-w-full items-center gap-3 flex-wrap">
            <div className="font-agenda-medium text-3xl font-bold leading-tight text-gray-900 tracking-tight m-0">
              {headline}
            </div>

              {/* Decorative SVG graphic */}
            <svg   aria-hidden="true"
      viewBox="0 0 120 40"
      className="h-6 w-20 shrink-0 block"  fill="none" xmlns="http://www.w3.org/2000/svg">

            <g filter="url(#filter0_d_130_275)">
            <path d="M106.065 27.9997C106.065 30.9452 108.453 33.333 111.399 33.333C114.344 33.333 116.732 30.9452 116.732 27.9997C116.732 25.0542 114.344 22.6664 111.399 22.6664C108.453 22.6664 106.065 25.0542 106.065 27.9997ZM86.8987 26.4667L86.8987 25.4667L86.8987 26.4667ZM34.3987 26.4667L34.355 27.4658L34.3769 27.4667H34.3987V26.4667ZM5.3987 26.4667C5.64424 25.4973 5.64448 25.4974 5.64471 25.4974C5.64478 25.4975 5.64501 25.4975 5.64516 25.4976C5.64544 25.4976 5.64571 25.4977 5.64597 25.4978C5.64648 25.4979 5.64693 25.498 5.64732 25.4981C5.6481 25.4983 5.64864 25.4984 5.64896 25.4985C5.64959 25.4987 5.64935 25.4986 5.64836 25.4984C5.64631 25.4978 5.64155 25.4965 5.63492 25.4945C5.6205 25.4903 5.60335 25.4847 5.58817 25.4791C5.56971 25.4722 5.572 25.4718 5.58879 25.4809C5.59797 25.4858 5.62159 25.4991 5.65294 25.5222C5.68156 25.5433 5.73964 25.5894 5.80053 25.6654C5.86104 25.741 5.95186 25.8809 5.98645 26.0824C6.0243 26.3028 5.98066 26.517 5.8856 26.6908C5.80029 26.8468 5.6929 26.9367 5.63602 26.978C5.57653 27.0213 5.53072 27.0414 5.51905 27.0464C5.49811 27.0553 5.5212 27.0431 5.62463 27.0218C5.72112 27.002 5.86215 26.9792 6.06111 26.9561L5.83057 24.9695C5.39017 25.0206 5.01133 25.0885 4.73386 25.207C4.62346 25.2541 4.31541 25.3937 4.1309 25.7311C4.02076 25.9325 3.97288 26.1738 4.01529 26.4208C4.05444 26.6488 4.15863 26.8147 4.23931 26.9155C4.38662 27.0994 4.56318 27.1999 4.63748 27.2401C4.73285 27.2917 4.8248 27.329 4.89094 27.3536C4.96038 27.3795 5.0228 27.3991 5.0668 27.4121C5.08937 27.4188 5.10854 27.4242 5.12311 27.4282C5.13043 27.4302 5.13667 27.4318 5.14171 27.4331C5.14423 27.4338 5.14645 27.4344 5.14836 27.4349C5.14932 27.4351 5.1502 27.4353 5.151 27.4355C5.1514 27.4356 5.15178 27.4357 5.15214 27.4358C5.15232 27.4359 5.15257 27.4359 5.15266 27.436C5.15291 27.436 5.15316 27.4361 5.3987 26.4667ZM11.9261 26.7866C14.149 26.7946 17.0688 26.8451 20.8913 26.9583L20.9505 24.9592C17.1167 24.8457 14.1786 24.7947 11.9333 24.7866L11.9261 26.7866ZM32.83 27.3999C33.3294 27.4212 33.8378 27.4431 34.355 27.4658L34.4424 25.4677C33.9244 25.445 33.4154 25.423 32.9152 25.4017L32.83 27.3999ZM34.3987 27.4667C35.143 27.4667 35.8598 27.3193 36.546 27.0559L35.8294 25.1887C35.348 25.3735 34.8736 25.4667 34.3987 25.4667V27.4667ZM42.3572 21.853C44.3704 19.1152 46.3243 15.6563 48.2601 12.4663L46.5503 11.4288C44.5623 14.7048 42.6893 18.0253 40.7459 20.6682L42.3572 21.853ZM57.4062 2.2446C57.9002 2.08328 58.3959 2.00001 58.8987 2L58.8987 0C58.1702 1.87159e-05 57.4651 0.121404 56.7853 0.343414L57.4062 2.2446ZM58.8987 2C59.481 1.99999 60.0002 2.11153 60.478 2.31482L61.261 0.474452C60.5339 0.165118 59.7483 -2.18153e-05 58.8987 0L58.8987 2ZM65.028 7.95453C66.6233 11.1139 68.3018 15.2484 70.7447 18.7972L72.3921 17.6631C70.0506 14.2617 68.5137 10.4205 66.8133 7.05305L65.028 7.95453ZM84.7839 27.3733C85.4642 27.435 86.1687 27.4667 86.8987 27.4667L86.8987 25.4667C86.2267 25.4667 85.5825 25.4375 84.9644 25.3815L84.7839 27.3733ZM86.8987 27.4667C87.3178 27.4667 87.73 27.4674 88.1354 27.4687L88.1418 25.4687C87.7343 25.4674 87.3199 25.4667 86.8987 25.4667L86.8987 27.4667ZM93.039 27.5189C95.8881 27.5699 98.3125 27.655 100.37 27.7593L100.471 25.7618C98.3896 25.6564 95.9432 25.5706 93.0748 25.5192L93.039 27.5189ZM110.02 28.7006C110.438 28.7802 110.713 28.8457 110.877 28.8887C110.959 28.9101 111.012 28.9259 111.041 28.9348C111.056 28.9393 111.064 28.942 111.067 28.9429C111.068 28.9434 111.068 28.9434 111.066 28.9429C111.066 28.9426 111.065 28.9422 111.063 28.9417C111.062 28.9415 111.062 28.9412 111.061 28.9409C111.06 28.9407 111.06 28.9406 111.059 28.9404C111.059 28.9403 111.059 28.9402 111.059 28.9401C111.059 28.9401 111.058 28.94 111.058 28.94C111.058 28.9399 111.058 28.9399 111.399 27.9997C111.739 27.0595 111.739 27.0595 111.739 27.0594C111.739 27.0594 111.739 27.0593 111.739 27.0593C111.738 27.0592 111.738 27.0591 111.738 27.059C111.737 27.0588 111.737 27.0586 111.736 27.0583C111.735 27.0579 111.734 27.0575 111.732 27.057C111.73 27.0561 111.727 27.055 111.724 27.0539C111.717 27.0516 111.709 27.049 111.7 27.046C111.682 27.0399 111.659 27.0324 111.63 27.0235C111.572 27.0057 111.492 26.9824 111.385 26.9543C111.171 26.8982 110.851 26.8229 110.394 26.7359L110.02 28.7006Z" fill="url(#paint0_linear_130_275)"/>
            </g>
            <defs>
            <filter id="filter0_d_130_275" x="0" y="0" width="120.732" height="41.333" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="4"/>
            <feGaussianBlur stdDeviation="2"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_130_275"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_130_275" result="shape"/>
            </filter>
            <linearGradient id="paint0_linear_130_275" x1="10.4845" y1="3.99997" x2="108.398" y2="26.0771" gradientUnits="userSpaceOnUse">
            <stop offset="0.130208" stopColor="#0090FE"/>
            <stop offset="1" stopColor="#B4D3EF"/>
            </linearGradient>
            </defs>
            </svg>


</div>

          {cta && (
            <Link
              href={cta.href}
              target={cta.isExternal ? "_blank" : "_self"}
              className="group inline-flex items-center gap-2 text-xs md:text-sm font-agenda-semibold uppercase tracking-wide text-gray-900 hover:text-blue-600"
            >
              {cta.text}
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">↗</span>
            </Link>
          )}
        </div>

        {/* Body */}
        <div className="mt-6 grid grid-cols-1 gap-10 md:mt-8 md:grid-cols-12">
          <div className="md:col-span-10">
            <p
              ref={descRef}
              className="
                animate font-agenda-semibold text-3xl md:text-2xl lg:text-3xl
                leading-tight text-gray-300
                whitespace-normal break-words [overflow-wrap:anywhere]
              "
            >
              {description}
            </p>
          </div>
        </div>

        {/* Media */}
        <div className="mt-10 md:mt-14">
          <div className="relative overflow-hidden rounded-2xl shadow-md">
            <div className="relative aspect-[21/9] md:aspect-[2.6/1]">
              {image ? (
                <StrapiVideo
                  src={image.url}
                  className="absolute inset-0 h-full w-full object-cover"
                  controls={false}
                  autoPlay
                  loop
                  muted
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center bg-gray-100">
                  <div className="h-16 w-16 rounded-full bg-white/70 grid place-items-center">
                    <svg className="h-6 w-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M6.5 5.5a1 1 0 011.664-.747l6 4.5a1 1 0 010 1.494l-6 4.5A1 1 0 016.5 14.5v-9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
// "use client";

// import React, { useMemo, useRef, useEffect, useState } from "react";
// import dynamic from "next/dynamic";
// import { Inter, Playfair_Display } from "next/font/google";

// // Fonts (optional; remove if you load them globally)
// const inter = Inter({ subsets: ["latin"], weight: ["400", "600", "800"], variable: "--font-inter" });
// const playfair = Playfair_Display({ subsets: ["latin"], style: ["italic"], weight: ["400", "600"], variable: "--font-playfair" });

// // SSR-safe Flickity import
// const Flickity = dynamic(() => import("react-flickity-component"), { ssr: false });

// export type TimelineItem = {
//   id: string | number;
//   year?: string | number;
//   images: { src: string; alt?: string }[];
//   caption?: string; // can contain <br> (rendered safely with dangerouslySetInnerHTML)
//   variant?: "single" | "double" | "tall"; // single=polaroid, double=overlapped cluster, tall=rotated post
// };

// export type FlickityTimelineProps = {
//   eyebrow?: string;
//   title?: React.ReactNode;
//   intro?: React.ReactNode;
//   items: TimelineItem[];
//   options?: Record<string, any>;
//   className?: string;
// };

// export default function FlickityTimeline({
//   eyebrow,
//   title,
//   intro,
//   items,
//   options,
//   className,
// }: FlickityTimelineProps) {
//   const flktyRef = useRef<any>(null);
//   const listRef = useRef<HTMLDivElement | null>(null);
//   const [selectedIndex, setSelectedIndex] = useState(0);

//   const flickityOptions = useMemo(
//     () => ({
//       cellAlign: "left",
//       contain: true,
//       pageDots: false,
//       prevNextButtons: false, // we use custom buttons
//       wrapAround: false,
//       draggable: true,
//       imagesLoaded: true,
//       setGallerySize: true,
//       selectedAttraction: 0.03,
//       friction: 0.28,
//       ...(options || {}),
//     }),
//     [options]
//   );

//   // Keep selected index in sync to disable arrows at edges
//   useEffect(() => {
//     const inst = flktyRef.current as any;
//     if (!inst) return;

//     const onSelect = () => setSelectedIndex(inst.selectedIndex || 0);
//     inst.on?.("ready", onSelect);
//     inst.on?.("select", onSelect);
//     inst.on?.("settle", onSelect);

//     return () => {
//       inst.off?.("ready", onSelect);
//       inst.off?.("select", onSelect);
//       inst.off?.("settle", onSelect);
//     };
//   }, []);

//   // Custom arrow handlers
//   const prev = () => (flktyRef.current as any)?.previous?.();
//   const next = () => (flktyRef.current as any)?.next?.();

//   const atStart = selectedIndex === 0;
//   const atEnd = selectedIndex === Math.max(0, items.length - 1);

//   // Keyboard nav on the list container
//   useEffect(() => {
//     const el = listRef.current;
//     if (!el) return;
//     const onKey = (e: KeyboardEvent) => {
//       if (e.key === "ArrowLeft") prev();
//       if (e.key === "ArrowRight") next();
//     };
//     el.addEventListener("keydown", onKey);
//     return () => el.removeEventListener("keydown", onKey);
//   }, []);

//   return (
//     <section className={`timeline ${inter.variable} ${playfair.variable} ${className || ""}`}>
//       <div className="container is--timeline-slider">
//         {/* Header / Controls */}
//         <div className="timeline__row-title">
//           <div className="timeline__col-title">
//             {eyebrow && (
//               <div className="timeline__eyebrow">
//                  <svg   aria-hidden="true"
//       viewBox="0 0 120 40"
//       className="h-10 w-20 shrink-0 translate-y-1"  fill="none" xmlns="http://www.w3.org/2000/svg">

//             <g filter="url(#filter0_d_130_275)">
//             <path d="M106.065 27.9997C106.065 30.9452 108.453 33.333 111.399 33.333C114.344 33.333 116.732 30.9452 116.732 27.9997C116.732 25.0542 114.344 22.6664 111.399 22.6664C108.453 22.6664 106.065 25.0542 106.065 27.9997ZM86.8987 26.4667L86.8987 25.4667L86.8987 26.4667ZM34.3987 26.4667L34.355 27.4658L34.3769 27.4667H34.3987V26.4667ZM5.3987 26.4667C5.64424 25.4973 5.64448 25.4974 5.64471 25.4974C5.64478 25.4975 5.64501 25.4975 5.64516 25.4976C5.64544 25.4976 5.64571 25.4977 5.64597 25.4978C5.64648 25.4979 5.64693 25.498 5.64732 25.4981C5.6481 25.4983 5.64864 25.4984 5.64896 25.4985C5.64959 25.4987 5.64935 25.4986 5.64836 25.4984C5.64631 25.4978 5.64155 25.4965 5.63492 25.4945C5.6205 25.4903 5.60335 25.4847 5.58817 25.4791C5.56971 25.4722 5.572 25.4718 5.58879 25.4809C5.59797 25.4858 5.62159 25.4991 5.65294 25.5222C5.68156 25.5433 5.73964 25.5894 5.80053 25.6654C5.86104 25.741 5.95186 25.8809 5.98645 26.0824C6.0243 26.3028 5.98066 26.517 5.8856 26.6908C5.80029 26.8468 5.6929 26.9367 5.63602 26.978C5.57653 27.0213 5.53072 27.0414 5.51905 27.0464C5.49811 27.0553 5.5212 27.0431 5.62463 27.0218C5.72112 27.002 5.86215 26.9792 6.06111 26.9561L5.83057 24.9695C5.39017 25.0206 5.01133 25.0885 4.73386 25.207C4.62346 25.2541 4.31541 25.3937 4.1309 25.7311C4.02076 25.9325 3.97288 26.1738 4.01529 26.4208C4.05444 26.6488 4.15863 26.8147 4.23931 26.9155C4.38662 27.0994 4.56318 27.1999 4.63748 27.2401C4.73285 27.2917 4.8248 27.329 4.89094 27.3536C4.96038 27.3795 5.0228 27.3991 5.0668 27.4121C5.08937 27.4188 5.10854 27.4242 5.12311 27.4282C5.13043 27.4302 5.13667 27.4318 5.14171 27.4331C5.14423 27.4338 5.14645 27.4344 5.14836 27.4349C5.14932 27.4351 5.1502 27.4353 5.151 27.4355C5.1514 27.4356 5.15178 27.4357 5.15214 27.4358C5.15232 27.4359 5.15257 27.4359 5.15266 27.436C5.15291 27.436 5.15316 27.4361 5.3987 26.4667ZM11.9261 26.7866C14.149 26.7946 17.0688 26.8451 20.8913 26.9583L20.9505 24.9592C17.1167 24.8457 14.1786 24.7947 11.9333 24.7866L11.9261 26.7866ZM32.83 27.3999C33.3294 27.4212 33.8378 27.4431 34.355 27.4658L34.4424 25.4677C33.9244 25.445 33.4154 25.423 32.9152 25.4017L32.83 27.3999ZM34.3987 27.4667C35.143 27.4667 35.8598 27.3193 36.546 27.0559L35.8294 25.1887C35.348 25.3735 34.8736 25.4667 34.3987 25.4667V27.4667ZM42.3572 21.853C44.3704 19.1152 46.3243 15.6563 48.2601 12.4663L46.5503 11.4288C44.5623 14.7048 42.6893 18.0253 40.7459 20.6682L42.3572 21.853ZM57.4062 2.2446C57.9002 2.08328 58.3959 2.00001 58.8987 2L58.8987 0C58.1702 1.87159e-05 57.4651 0.121404 56.7853 0.343414L57.4062 2.2446ZM58.8987 2C59.481 1.99999 60.0002 2.11153 60.478 2.31482L61.261 0.474452C60.5339 0.165118 59.7483 -2.18153e-05 58.8987 0L58.8987 2ZM65.028 7.95453C66.6233 11.1139 68.3018 15.2484 70.7447 18.7972L72.3921 17.6631C70.0506 14.2617 68.5137 10.4205 66.8133 7.05305L65.028 7.95453ZM84.7839 27.3733C85.4642 27.435 86.1687 27.4667 86.8987 27.4667L86.8987 25.4667C86.2267 25.4667 85.5825 25.4375 84.9644 25.3815L84.7839 27.3733ZM86.8987 27.4667C87.3178 27.4667 87.73 27.4674 88.1354 27.4687L88.1418 25.4687C87.7343 25.4674 87.3199 25.4667 86.8987 25.4667L86.8987 27.4667ZM93.039 27.5189C95.8881 27.5699 98.3125 27.655 100.37 27.7593L100.471 25.7618C98.3896 25.6564 95.9432 25.5706 93.0748 25.5192L93.039 27.5189ZM110.02 28.7006C110.438 28.7802 110.713 28.8457 110.877 28.8887C110.959 28.9101 111.012 28.9259 111.041 28.9348C111.056 28.9393 111.064 28.942 111.067 28.9429C111.068 28.9434 111.068 28.9434 111.066 28.9429C111.066 28.9426 111.065 28.9422 111.063 28.9417C111.062 28.9415 111.062 28.9412 111.061 28.9409C111.06 28.9407 111.06 28.9406 111.059 28.9404C111.059 28.9403 111.059 28.9402 111.059 28.9401C111.059 28.9401 111.058 28.94 111.058 28.94C111.058 28.9399 111.058 28.9399 111.399 27.9997C111.739 27.0595 111.739 27.0595 111.739 27.0594C111.739 27.0594 111.739 27.0593 111.739 27.0593C111.738 27.0592 111.738 27.0591 111.738 27.059C111.737 27.0588 111.737 27.0586 111.736 27.0583C111.735 27.0579 111.734 27.0575 111.732 27.057C111.73 27.0561 111.727 27.055 111.724 27.0539C111.717 27.0516 111.709 27.049 111.7 27.046C111.682 27.0399 111.659 27.0324 111.63 27.0235C111.572 27.0057 111.492 26.9824 111.385 26.9543C111.171 26.8982 110.851 26.8229 110.394 26.7359L110.02 28.7006Z" fill="url(#paint0_linear_130_275)"/>
//             </g>
//             <defs>
//             <filter id="filter0_d_130_275" x="0" y="0" width="120.732" height="41.333" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
//             <feFlood floodOpacity="0" result="BackgroundImageFix"/>
//             <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
//             <feOffset dy="4"/>
//             <feGaussianBlur stdDeviation="2"/>
//             <feComposite in2="hardAlpha" operator="out"/>
//             <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
//             <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_130_275"/>
//             <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_130_275" result="shape"/>
//             </filter>
//             <linearGradient id="paint0_linear_130_275" x1="10.4845" y1="3.99997" x2="108.398" y2="26.0771" gradientUnits="userSpaceOnUse">
//             <stop offset="0.130208" stopColor="#0090FE"/>
//             <stop offset="1" stopColor="#B4D3EF"/>
//             </linearGradient>
//             </defs>
//             </svg> 
//                 <span>{eyebrow}</span>
//               </div>
//             )}
//             <div className="timeline__title">
//               {title ? <h2 className="h2">{title}</h2> : null}
//               {intro ? <div className="timeline__text">{intro}</div> : null}
//             </div>
//           </div>

//           <div className="timeline__col-arrows">
//             <div className="flickity-arrows is--relative">
//               <button
//                 aria-label="Previous"
//                 className="flickity-arrow"
//                 title="Previous slide"
//                 onClick={prev}
//                 disabled={atStart}
//               >
//                 <ArrowPixel />
//               </button>
//               <button
//                 aria-label="Next"
//                 className="flickity-arrow"
//                 title="Next slide"
//                 onClick={next}
//                 disabled={atEnd}
//               >
//                 <ArrowPixel flipped />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Slider */}
//         <div className="flickity-collection">
//           <Flickity
//             className={"flickity-list"}
//             options={flickityOptions}
//             flickityRef={(c: any) => (flktyRef.current = c)}
//             elementType="div"
//           >
//             {items.map((item) => (
//               <div className="flickity-item" key={item.id}>
//                 {item.year && (
//                   <div className="year">
//                     <span className="year__text">{item.year}</span>
//                     <span className="year__marker" />
//                   </div>
//                 )}

//                 {/* Variants */}
//                 {item.variant === "double" && item.images.length >= 2 ? (
//                   <div className="cluster">
//                     <div className="card piece piece--top">
//                       <img className="card__img" src={item.images[0].src} alt={item.images[0].alt || ""} />
//                     </div>
//                     <div className="card piece piece--bottom">
//                       <img className="card__img" src={item.images[1].src} alt={item.images[1].alt || ""} />
//                     </div>
//                     <div className="sticker" aria-hidden="true" />
//                     {item.caption && (
//                       <div
//                         className="cluster__caption"
//                         dangerouslySetInnerHTML={{ __html: item.caption }}
//                       />
//                     )}
//                   </div>
//                 ) : item.variant === "tall" ? (
//                   <>
//                     <div className="card tall rotate-right">
//                       <img className="card__img" src={item.images[0].src} alt={item.images[0].alt || ""} />
//                     </div>
//                     {item.caption && <p className="card__caption" style={{ marginLeft: 10, maxWidth: 440 }}>{item.caption}</p>}
//                   </>
//                 ) : (
//                   <div className="card card--thick">
//                     <img className="card__img" src={item.images[0].src} alt={item.images[0].alt || ""} />
//                     {item.caption && (
//                       <p
//                         className="card__caption"
//                         dangerouslySetInnerHTML={{ __html: item.caption }}
//                       />
//                     )}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </Flickity>
//         </div>
//       </div>

//       {/* Styles (ported from your HTML) */}
//       <style jsx>{`
//         /* Base + background like screenshot */
//         .timeline {
//           color: #111;
//           /*
//           background:
//             radial-gradient(100% 100% at 50% 0%, rgba(0,0,0,0.04), rgba(0,0,0,0) 40%),
//             repeating-linear-gradient(to right, rgba(17,17,17,0.08) 0 1px, transparent 1px 120px),
//             #f3f3f3;
//             */
//         }
//         .container { max-width: 1400px; margin: 0 auto; padding: clamp(16px, 2vw, 32px); }

//         /* Header */
//         .timeline__row-title { display: grid; grid-template-columns: 1fr auto; gap: 16px; align-items: end; }
//         .timeline__eyebrow { display: flex; align-items: center; gap: .6rem; color: #111; text-transform: uppercase; letter-spacing: .06em; font-weight: 700; }
//         .eyebrow__svg { width: 10px; height: auto; color: #2dd17c; }
//         .h2 { font-family: var(--font-playfair), "Playfair Display", serif; font-style: italic; font-weight: 600; font-size: clamp(28px, 3.2vw, 42px); margin: .25rem 0 .5rem; }
//         .timeline__text { max-width: 72ch; color: #333; font-family: var(--font-inter), Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; }

//         /* Flickity core area */
//         :global(.flickity-viewport) { overflow: hidden; }
//         :global(.flickity-slider) { display: flex; gap: 24px; }
//         .flickity-collection { margin-top: 18px; }
//         .flickity-list { width: 100%; outline: none; }
//         .flickity-list:focus { box-shadow: 0 0 0 2px #0003; border-radius: 8px; }
//         .flickity-item { width: 80%; max-width: 920px; margin-right: 24px; }
//         @media (min-width: 980px) { .flickity-item { width: 60%; } }

//         /* Year label + green square marker with vertical line */
//         .year { position: relative; padding-left: 4px; margin: 24px 0 8px; }
//         .year__text { font-family: var(--font-playfair), "Playfair Display", serif; font-style: italic; font-size: clamp(32px, 4.6vw, 56px); color: #222; }
//         .year__marker {
//           display: inline-block; width: 14px; height: 14px; background: #2da5d1ff; border-radius: 2px;
//           margin-left: 10px; vertical-align: 12px; position: relative;
//         }
//         .year__marker::after {
//           content: ""; position: absolute; left: 50%; top: 14px; transform: translateX(-50%);
//           width: 2px; height: 86px;
//           background: linear-gradient(to bottom, #2da5d1ff 0 12px, rgba(0,0,0,0.08) 12px 100%);
//         }

//         /* Polaroid card */
//         .card { background: #fff; border-radius: 22px; box-shadow: 0 12px 60px rgba(0,0,0,.15); padding: 14px; border: 1px solid #ececec; }
//         .card--thick { padding: 18px; border-radius: 28px; max-width: 720px; }
//         .card__img { border-radius: 16px; display: block; width: 100%; height: auto; }
//         .card__caption {
//           margin: .75rem 4px 2px; font-weight: 800; letter-spacing: .01em; color: #111;
//           font-family: var(--font-inter), Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
//         }

//         /* Overlapped cluster (double) */
//         .cluster { position: relative; height: 480px; }
//         .cluster .piece { position: absolute; width: min(66%, 520px); }
//         .cluster .piece--top { right: 3%; top: -10px; transform: rotate(-9deg); }
//         .cluster .piece--bottom { left: 10%; bottom: -6px; transform: rotate(8deg); }
//         .cluster .sticker { position: absolute; left: 58%; bottom: 24%; width: 20px; height: 16px; background: #2dd17c; border-radius: 2px; transform: rotate(12deg); }
//         .cluster__caption {
//           position: absolute; left: 50%; bottom: -6px; transform: translateX(-50%) rotate(-8deg);
//           font-weight: 800; font-size: clamp(16px, 1.8vw, 22px);
//           font-family: var(--font-inter), Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
//         }

//         /* Tall rotated post */
//         .tall { max-width: 720px; }
//         .rotate-right { transform: rotate(6deg); }

//         /* Controls (custom arrows) */
//         .timeline__col-arrows { display: flex; align-items: center; gap: 8px; }
//         .flickity-arrows { display: flex; gap: 8px; }
//         .flickity-arrow {
//           position: relative; display: inline-flex; align-items: center; justify-content: center;
//           width: 42px; height: 42px; border-radius: 10px; border: 1px solid #e7e7e7; background: #fff;
//           box-shadow: 0 4px 10px rgba(0,0,0,.06); cursor: pointer;
//           transition: transform .12s ease, box-shadow .12s ease, opacity .2s ease;
//         }
//         .flickity-arrow[disabled] { opacity: .45; cursor: not-allowed; }
//         .flickity-arrow:hover:not([disabled]) { transform: translateY(-2px); box-shadow: 0 8px 18px rgba(0,0,0,.12); }

//         /* Pixel arrow svg */
//         .arrow-pixel__svg { width: 22px; height: auto; color: #111; }
//       `}</style>
//     </section>
//   );
// }

// /* Pixel arrow icon (flipped = Next) */
// function ArrowPixel({ flipped = false }: { flipped?: boolean }) {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       viewBox="0 0 24 21"
//       fill="none"
//       className="arrow-pixel__svg"
//       style={{ transform: flipped ? "scaleX(-1)" : undefined }}
//       aria-hidden="true"
//     >
//       <rect y="9" width="3" height="3" fill="currentColor" />
//       <rect x="6" y="9" width="3" height="3" fill="currentColor" />
//       <rect x="3" y="9" width="3" height="3" fill="currentColor" />
//       <rect x="12" y="9" width="3" height="3" fill="currentColor" />
//       <rect x="9" y="9" width="3" height="3" fill="currentColor" />
//       <rect x="18" y="9" width="3" height="3" fill="currentColor" />
//       <rect x="15" y="9" width="3" height="3" fill="currentColor" />
//       <rect x="21" y="9" width="3" height="3" fill="currentColor" />
//       <rect x="18" y="6" width="3" height="3" fill="currentColor" />
//       <rect x="18" y="12" width="3" height="3" fill="currentColor" />
//       <rect x="15" y="3" width="3" height="3" fill="currentColor" />
//       <rect x="15" y="15" width="3" height="3" fill="currentColor" />
//       <rect x="12" width="3" height="3" fill="currentColor" />
//       <rect x="12" y="18" width="3" height="3" fill="currentColor" />
//     </svg>
//   );
// }




"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";

// SSR-safe Flickity import
const Flickity = dynamic(() => import("react-flickity-component"), { ssr: false });

export type TimelineItem = {
  id: string | number;
  year?: string | number;
  images: { src: string; alt?: string }[];
  caption?: string; // can contain <br/>
  variant?: "single" | "double" | "tall";
};

export type FlickityTimelineProps = {
  eyebrow?: string;
  title?: React.ReactNode;
  intro?: React.ReactNode;
  items: TimelineItem[];
  options?: Record<string, any>;
  className?: string;
  size?: "sm" | "md" | "lg";

};



export default function FlickityTimeline({
  eyebrow,
  title,
  intro,
  items,
  options,
  className,
  size
}: FlickityTimelineProps) {
  const flktyRef = useRef<any>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  

  const flickityOptions = useMemo(
    () => ({
      cellAlign: "left",
      contain: true,
      pageDots: false,
      prevNextButtons: false, // custom buttons
      wrapAround: false,
      draggable: true,
      imagesLoaded: true,
      setGallerySize: true,
      selectedAttraction: 0.03,
      friction: 0.28,
      ...(options || {}),
    }),
    [options]
  );

  // Sync selected index (to disable arrows at the ends)
  useEffect(() => {
    const inst = flktyRef.current as any;
    if (!inst) return;
    const onSelect = () => setSelectedIndex(inst.selectedIndex || 0);
    inst.on?.("ready", onSelect);
    inst.on?.("select", onSelect);
    inst.on?.("settle", onSelect);
    return () => {
      inst.off?.("ready", onSelect);
      inst.off?.("select", onSelect);
      inst.off?.("settle", onSelect);
    };
  }, []);

  // Bullet-proof controls (works whether methods live on wrapper or instance)
  const prev = () => {
    const inst = flktyRef.current as any;
    if (!inst) return;
    if (typeof inst.previous === "function") inst.previous();
    else if (typeof inst.select === "function") {
      const i = Math.max(0, (inst.selectedIndex ?? 0) - 1);
      inst.select(i);
    }
  };
  const next = () => {
    const inst = flktyRef.current as any;
    if (!inst) return;
    if (typeof inst.next === "function") inst.next();
    else if (typeof inst.select === "function") {
      const i = Math.min((inst.cells?.length ?? items.length) - 1, (inst.selectedIndex ?? 0) + 1);
      inst.select(i);
    }
  };

  const atStart = selectedIndex === 0;
  const atEnd = selectedIndex === Math.max(0, items.length - 1);

  // Keyboard nav
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, []);

// const presets ={
//  sm: { cellW: "52%", cardMax: "560px", clusterH: "360px", pieceW: "46%", imgRatio: "4/3" },
//   md: { cellW: "60%", cardMax: "680px", clusterH: "420px", pieceW: "50%", imgRatio: "4/3" },
//   lg: { cellW: "70%", cardMax: "780px", clusterH: "480px", pieceW: "54%", imgRatio: "4/3" },
// }
  
const presets = {
  sm: { cellW: "52%", cardMax: "560px", clusterH: "360px", pieceW: "46%", imgRatio: "4/3" },
  md: { cellW: "60%", cardMax: "680px", clusterH: "420px", pieceW: "50%", imgRatio: "4/3" },
  lg: { cellW: "70%", cardMax: "380px", clusterH: "300px", pieceW: "54%", imgRatio: "4/3" },
};
const sz = presets[size ?? "md"];
  return (
    <section className={`timeline ${className || ""}`}  
    style={
    {
      // @ts-ignore – CSS vars
      "--cell-w": sz.cellW,
      "--card-max": sz.cardMax,
      "--cluster-h": sz.clusterH,
      "--piece-w": sz.pieceW,
      "--img-ratio": sz.imgRatio,
    } as React.CSSProperties
  } 
  aria-label={typeof title === "string" ? title : "Company timeline"}>
      <div className="container is--timeline-slider">
        {/* Header / Controls */}
        <div className="timeline__row-title">
          <div className="timeline__col-title">
            {eyebrow && (
              <div className="timeline__eyebrow">
                {/* your gradient logo */}
                <svg aria-hidden="true" viewBox="0 0 120 40" className="h-10 w-20 shrink-0 translate-y-1" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g filter="url(#filter0_d_130_275)">
                    <path d="M106.065 27.9997C106.065 30.9452 108.453 33.333 111.399 33.333C114.344 33.333 116.732 30.9452 116.732 27.9997C116.732 25.0542 114.344 22.6664 111.399 22.6664C108.453 22.6664 106.065 25.0542 106.065 27.9997ZM86.8987 26.4667L86.8987 25.4667L86.8987 26.4667ZM34.3987 26.4667L34.355 27.4658L34.3769 27.4667H34.3987V26.4667ZM5.3987 26.4667C5.64424 25.4973 5.64448 25.4974 5.64471 25.4974C5.64478 25.4975 5.64501 25.4975 5.64516 25.4976C5.64544 25.4976 5.64571 25.4977 5.64597 25.4978C5.64648 25.4979 5.64693 25.498 5.64732 25.4981C5.6481 25.4983 5.64864 25.4984 5.64896 25.4985C5.64959 25.4987 5.64935 25.4986 5.64836 25.4984C5.64631 25.4978 5.64155 25.4965 5.63492 25.4945C5.6205 25.4903 5.60335 25.4847 5.58817 25.4791C5.56971 25.4722 5.572 25.4718 5.58879 25.4809C5.59797 25.4858 5.62159 25.4991 5.65294 25.5222C5.68156 25.5433 5.73964 25.5894 5.80053 25.6654C5.86104 25.741 5.95186 25.8809 5.98645 26.0824C6.0243 26.3028 5.98066 26.517 5.8856 26.6908C5.80029 26.8468 5.6929 26.9367 5.63602 26.978C5.57653 27.0213 5.53072 27.0414 5.51905 27.0464C5.49811 27.0553 5.5212 27.0431 5.62463 27.0218C5.72112 27.002 5.86215 26.9792 6.06111 26.9561L5.83057 24.9695C5.39017 25.0206 5.01133 25.0885 4.73386 25.207C4.62346 25.2541 4.31541 25.3937 4.1309 25.7311C4.02076 25.9325 3.97288 26.1738 4.01529 26.4208C4.05444 26.6488 4.15863 26.8147 4.23931 26.9155C4.38662 27.0994 4.56318 27.1999 4.63748 27.2401C4.73285 27.2917 4.8248 27.329 4.89094 27.3536C4.96038 27.3795 5.0228 27.3991 5.0668 27.4121C5.08937 27.4188 5.10854 27.4242 5.12311 27.4282C5.13043 27.4302 5.13667 27.4318 5.14171 27.4331C5.14423 27.4338 5.14645 27.4344 5.14836 27.4349C5.14932 27.4351 5.1502 27.4353 5.151 27.4355C5.1514 27.4356 5.15178 27.4357 5.15214 27.4358C5.15232 27.4359 5.15257 27.4359 5.15266 27.436C5.15291 27.436 5.15316 27.4361 5.3987 26.4667ZM11.9261 26.7866C14.149 26.7946 17.0688 26.8451 20.8913 26.9583L20.9505 24.9592C17.1167 24.8457 14.1786 24.7947 11.9333 24.7866L11.9261 26.7866Z" fill="url(#paint0_linear_130_275)"/>
                  </g>
                  <defs>
                    <filter id="filter0_d_130_275" x="0" y="0" width="120.732" height="41.333" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                      <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                      <feOffset dy="4"/><feGaussianBlur stdDeviation="2"/>
                      <feComposite in2="SourceAlpha" operator="out"/>
                      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                      <feBlend in="SourceGraphic" result="shape"/>
                    </filter>
                    <linearGradient id="paint0_linear_130_275" x1="10.48" y1="4" x2="108.4" y2="26.08" gradientUnits="userSpaceOnUse">
                      <stop offset="0.13" stopColor="#0090FE"/><stop offset="1" stopColor="#B4D3EF"/>
                    </linearGradient>
                  </defs>
                </svg>
                <span>{eyebrow}</span>
              </div>
            )}
            <div className="timeline__title">
              {title ? <h2 className="h2">{title}</h2> : null}
              {intro ? <div className="timeline__text">{intro}</div> : null}
            </div>
          </div>

          <div className="timeline__col-arrows">
            <div className="flickity-arrows is--relative">
              <button aria-label="Previous" className="flickity-arrow" title="Previous slide" onClick={prev} disabled={atStart}>
                <ArrowPixel />
              </button>
              <button aria-label="Next" className="flickity-arrow" title="Next slide" onClick={next} disabled={atEnd}>
                <ArrowPixel flipped />
              </button>
            </div>
          </div>
        </div>

        {/* Slider */}
        <div className="flickity-collection" ref={listRef} tabIndex={0}>
          <Flickity
            className={"flickity-list"}
            options={flickityOptions}
            flickityRef={(c: any) => (flktyRef.current = (c?.data ? c.data : c))}
            elementType="div"
          >
            {items.map((item) => {
              {console.log(item)}
              const variant: TimelineItem["variant"] =
                item.variant ?? (item.images.length >= 2 ? "double" : "single");

              return (
                <div className="flickity-item" key={item.id}>
                  {item.year && (
                    <div className="year">
                      <span className="year__text">{item.year}</span>
                      <span className="year__marker" />
                    </div>
                  )}

                  {variant === "double" ? (
                    <div className="cluster">
                      <div className="card piece piece--top">
                        <img className="card__img" src={item.images[0]?.src} alt={item.images[0]?.alt || ""} />
                      </div>
                      <div className="card piece piece--bottom">
                        <img className="card__img" src={item.images[1]?.src} alt={item.images[1]?.alt || ""} />
                      </div>
                      <div className="sticker" aria-hidden="true" />
                      {item.caption && (
                        <div className="cluster__caption" dangerouslySetInnerHTML={{ __html: item.caption }} />
                      )}
                    </div>
                  ) : variant === "tall" ? (
                    <>
                      <div className="card tall rotate-right">
                        <img className="card__img" src={item.images[0]?.src} alt={item.images[0]?.alt || ""} />
                      </div>
                      {item.caption && <p className="card__caption" style={{ marginLeft: 10, maxWidth: 440 }}>{item.caption}</p>}
                    </>
                  ) : (
                    <div className="card card--thick">
                      <img className="card__img" src={item.images[0]?.src} alt={item.images[0]?.alt || ""} />
                      {item.caption && <p className="card__caption" dangerouslySetInnerHTML={{ __html: item.caption }} />}
                    </div>
                  )}
                </div>
              );
            })}
          </Flickity>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
      :global(.flickity-viewport){overflow:hidden;min-height:664.859px!important;}
:global(.flickity-slider){display:flex;gap:24px;}

.container{max-width:1400px;margin:0 auto;padding:clamp(16px,2vw,32px);}

.timeline__row-title{display:grid;grid-template-columns:1fr auto;gap:16px;align-items:end;}
.timeline__eyebrow{display:flex;align-items:center;gap:.6rem;color:#111;text-transform:uppercase;letter-spacing:.06em;font-weight:700;}
.h2{font-style:italic;font-weight:600;font-size:clamp(28px,3.2vw,42px);margin:.25rem 0 .5rem;}
.timeline__text{max-width:72ch;color:#333;}

.flickity-collection{margin-top:18px;outline:none;}
.flickity-item{width:var(--cell-w,60%);max-width:var(--card-max,720px);margin-right:24px;}
@media (min-width:980px){.flickity-item{width:var(--cell-w,60%);}}

/* Year label */
.year{position:relative;padding-left:4px;margin:24px 0 8px;}
.year__text{font-style:italic;font-size:clamp(32px,4.6vw,56px);color:#222;}
.year__marker{display:inline-block;width:14px;height:14px;background:#2da5d1;border-radius:2px;margin-left:10px;vertical-align:12px;position:relative;}
.year__marker::after{content:"";position:absolute;left:50%;top:14px;transform:translateX(-50%);width:2px;height:86px;background:linear-gradient(to bottom,#2da5d1 0 12px,rgba(0,0,0,.08) 12px 100%);}

/* Cards */
.card {
  background: #fff;
  border-radius: 22px;
  box-shadow: 13px 2px 12px 0px rgba(0, 0, 0, .15);
  padding: 14px;
  border: 1px solid #ececec;
}
.card--thick{max-width:var(--card-max,720px);}
.card__img{border-radius:16px;display:block;width:100%;height:auto;}
.card__caption{margin:.75rem 4px 2px;font-weight:800;letter-spacing:.01em;color:#111;}

/* Double/cluster layout */
.cluster{position:relative;height:var(--cluster-h,480px);padding-bottom:28px;}
.cluster .piece{position:absolute;width:var(--piece-w,50%);}
.cluster .piece--top{right:8%;top:-6px;transform:rotate(-9deg);z-index:2;}
.cluster .piece--bottom{left:6%;bottom:10px;transform:rotate(7deg);z-index:1;}
.cluster .piece .card__img{aspect-ratio:var(--img-ratio,4/3);object-fit:cover;}
.cluster__caption{position:absolute;left:50%;bottom:-60px;transform:translateX(-50%) rotate(-6deg);font-weight:800;text-align:center;}

/* Tall */
.tall{max-width:var(--card-max,720px);}
.rotate-right{transform:rotate(6deg);}

/* Controls */
.timeline__col-arrows{display:flex;align-items:center;gap:8px;}
.flickity-arrows{display:flex;gap:8px;}
.flickity-arrow{position:relative;display:inline-flex;align-items:center;justify-content:center;width:42px;height:42px;border-radius:10px;border:1px solid #e7e7e7;background:#fff;box-shadow:0 4px 10px rgba(0,0,0,.06);cursor:pointer;transition:transform .12s ease,box-shadow .12s ease,opacity .2s ease;}
.flickity-arrow[disabled]{opacity:.45;cursor:not-allowed;}
.flickity-arrow:hover:not([disabled]){transform:translateY(-2px);box-shadow:0 8px 18px rgba(0,0,0,.12);}

.arrow-pixel__svg{width:22px;height:auto;color:#111;}

      `}</style>
    </section>
  );
}

/* Pixel arrow icon (flipped = Next) */
function ArrowPixel({ flipped = false }: { flipped?: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 21"
      fill="none"
      className="arrow-pixel__svg"
      style={{ transform: flipped ? "scaleX(-1)" : undefined }}
      aria-hidden="true"
    >
      <rect y="9" width="3" height="3" fill="currentColor" />
      <rect x="6" y="9" width="3" height="3" fill="currentColor" />
      <rect x="3" y="9" width="3" height="3" fill="currentColor" />
      <rect x="12" y="9" width="3" height="3" fill="currentColor" />
      <rect x="9" y="9" width="3" height="3" fill="currentColor" />
      <rect x="18" y="9" width="3" height="3" fill="currentColor" />
      <rect x="15" y="9" width="3" height="3" fill="currentColor" />
      <rect x="21" y="9" width="3" height="3" fill="currentColor" />
      <rect x="18" y="6" width="3" height="3" fill="currentColor" />
      <rect x="18" y="12" width="3" height="3" fill="currentColor" />
      <rect x="15" y="3" width="3" height="3" fill="currentColor" />
      <rect x="15" y="15" width="3" height="3" fill="currentColor" />
      <rect x="12" width="3" height="3" fill="currentColor" />
      <rect x="12" y="18" width="3" height="3" fill="currentColor" />
    </svg>
  );
}

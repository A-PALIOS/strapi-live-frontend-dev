// "use client";

// import { motion, AnimatePresence } from "motion/react";
// import { useEffect, useState, useMemo } from "react";
// import { getStrapiMedia } from "../StrapiImage";
// import Image from "next/image";

// type Testimonial = {
//   quote: string;
//   name: string;
//   designation: string;
//   src: string;
// };

// export const AnimatedTestimonials = ({
//   testimonials,
//   autoplay = false,
// }: {
//   testimonials: Testimonial[];
//   autoplay?: boolean;
// }) => {
//   const [active, setActive] = useState(0);

//   const handleNext = () => {
//     setActive((prev) => (prev + 1) % testimonials.length);
//   };

//   const handlePrev = () => {
//     setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
//   };

//   const isActive = (index: number) => index === active;

//   useEffect(() => {
//     if (autoplay) {
//       const interval = setInterval(handleNext, 5000);
//       return () => clearInterval(interval);
//     }
//   }, [autoplay]);

//   const randomRotateY = () => Math.floor(Math.random() * 21) - 10;

//   return (
//     <div className="mx-auto max-w-sm px-4 py-20 font-sans antialiased md:max-w-4xl md:px-8 lg:px-12">
//       <div className="relative grid grid-cols-1 gap-20 md:grid-cols-2">
//         <div>
//           <div className="relative h-80 w-full">
//             <AnimatePresence>
//               {testimonials.map((testimonial, index) => (
//                 <motion.div
//                   key={testimonial.src}
//                   initial={{
//                     opacity: 0,
//                     scale: 0.9,
//                     z: -100,
//                     rotate: randomRotateY(),
//                   }}
//                   animate={{
//                     opacity: isActive(index) ? 1 : 0.7,
//                     scale: isActive(index) ? 1 : 0.95,
//                     z: isActive(index) ? 0 : -100,
//                     rotate: isActive(index) ? 0 : randomRotateY(),
//                     zIndex: isActive(index) ? 40 : testimonials.length + 2 - index,
//                     y: isActive(index) ? [0, -80, 0] : 0,
//                   }}
//                   exit={{
//                     opacity: 0,
//                     scale: 0.9,
//                     z: 100,
//                     rotate: randomRotateY(),
//                   }}
//                   transition={{ duration: 0.4, ease: "easeInOut" }}
//                   className="absolute inset-0 origin-bottom"
//                 >
//                   {(testimonial.src) && (console.log("Image src:",testimonial.src), true) }
//                   {/* eslint-disable-next-line @next/next/no-img-element */}
//                   <Image
//                     src={testimonial?.src}
//                     alt={testimonial.name}
//                     width={500}
//                     height={500}
//                     draggable={false}
//                     className="h-full w-full rounded-3xl object-cover object-center"
//                   />
//                 </motion.div>
//               ))}
//             </AnimatePresence>
//           </div>
//         </div>

//         <div className="flex flex-col justify-between py-4">
//           <motion.div
//             key={active}
//             initial={{ y: 20, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             exit={{ y: -20, opacity: 0 }}
//             transition={{ duration: 0.2, ease: "easeInOut" }}
//           >
//             <h3 className="text-2xl font-bold text-black dark:text-white">
//               {testimonials[active].name}
//             </h3>
//             <p className="text-sm text-gray-500 dark:text-neutral-500">
//               {testimonials[active].designation}
//             </p>

//             {/* widen the quote by removing max-w-xl (or change to a larger max-w if you prefer) */}
//             <motion.p className="text-2xl text-gray-600 italic">
//               “
//               {testimonials[active].quote.split(" ").map((word, index) => (
//                 <motion.span
//                   key={index}
//                   initial={{ filter: "blur(10px)", opacity: 0, y: 5 }}
//                   animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
//                   transition={{ duration: 0.2, ease: "easeInOut", delay: 0.02 * index }}
//                   className="inline-block"
//                 >
//                   {word}&nbsp;
//                 </motion.span>
//               ))}
//               ”
//             </motion.p>
//           </motion.div>

//           {/* Pager lines (replaces arrow buttons) */}
//           <div className="flex items-center gap-3 pt-12 md:pt-0">
//             {testimonials.map((_, index) => {
//               const activeStyle =
//                 "w-10 bg-blue-500 dark:bg-blue-400";
//               const inactiveStyle =
//                 "w-8 bg-gray-300 dark:bg-neutral-700";
//               return (
//                 <button
//                   key={index}
//                   onClick={() => setActive(index)}
//                   aria-label={`Go to testimonial ${index + 1}`}
//                   className={`h-1 rounded-full transition-all duration-300 ${isActive(index) ? activeStyle : inactiveStyle}`}
//                 />
//               );
//             })}
//           </div>

//           {/* Optional: keep keyboard navigation even without visible arrows */}
//           <div className="sr-only">
//             <button onClick={handlePrev} aria-label="Previous testimonial" />
//             <button onClick={handleNext} aria-label="Next testimonial" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };


// "use client";

// import { motion, AnimatePresence } from "motion/react";
// import Image from "next/image";
// import { useMemo, useEffect, useState } from "react";
// import { getStrapiMedia } from "../StrapiImage";

// // simple deterministic hash → [-10, 10]
// function seedRotate(input: string, min = -10, max = 10) {
//   let h = 0;
//   for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) | 0;
//   const range = max - min;
//   // make positive and clamp to range
//   return min + (Math.abs(h) % (range + 1));
// }

// type Testimonial = {
//   quote: string;
//   name: string;
//   designation: string;
//   src: string; // may be relative from Strapi
// };

// export const AnimatedTestimonials = ({
//   testimonials,
//   autoplay = false,
// }: {
//   testimonials: Testimonial[];
//   autoplay?: boolean;
// }) => {
//   const [active, setActive] = useState(0);

//   const seededRotates = useMemo(
//     () =>
//       testimonials.map((t, i) =>
//         // include index so duplicates still differ
//         seedRotate(`${t.src ?? ""}#${i}`)
//       ),
//     [testimonials]
//   );

//   const handleNext = () => setActive((p) => (p + 1) % testimonials.length);
//   const handlePrev = () =>
//     setActive((p) => (p - 1 + testimonials.length) % testimonials.length);

//   useEffect(() => {
//     if (!autoplay) return;
//     const id = setInterval(handleNext, 5000);
//     return () => clearInterval(id);
//   }, [autoplay]);

//   return (
//     <div className="mx-auto max-w-sm px-4 py-20 font-sans antialiased md:max-w-4xl md:px-8 lg:px-12">
//       <div className="relative grid grid-cols-1 gap-20 md:grid-cols-2">
//         <div>
//           <div className="relative h-80 w-full">
//             <AnimatePresence initial={false}>
//               {testimonials.map((t, index) => {
//                 const rotateSeed = seededRotates[index];
//                 const isActive = index === active;

//                 const safeSrc = getStrapiMedia(t.src);
//                 if (!safeSrc) return null;  

//                 return (
//                   <motion.div
//                     key={safeSrc} // ensure this is stable; prefer a real id if you have it
//                     initial={{
//                       opacity: 0,
//                       scale: 0.9,
//                       z: -100,
//                       rotate: rotateSeed, // deterministic
//                     }}
//                     animate={{
//                       opacity: isActive ? 1 : 0.7,
//                       scale: isActive ? 1 : 0.95,
//                       z: isActive ? 0 : -100,
//                       rotate: isActive ? 0 : rotateSeed, // deterministic
//                       zIndex: isActive ? 40 : testimonials.length + 2 - index,
//                       y: isActive ? [0, -80, 0] : 0,
//                     }}
//                     exit={{
//                       opacity: 0,
//                       scale: 0.9,
//                       z: 100,
//                       rotate: rotateSeed, // deterministic
//                     }}
//                     transition={{ duration: 0.4, ease: "easeInOut" }}
//                     className="absolute inset-0 origin-bottom"
//                   >
//                     {/* <Image
//                       src={getStrapiMedia(t.src) ?? t.src}
//                       alt={t.name}
//                       width={500}
//                       height={500}
//                       draggable={false}
//                       className="h-full w-full rounded-3xl object-cover object-center"
//                       priority={index === active}
//                     /> */}
//                     <Image
//                       src={safeSrc}
//                       alt={t.name || 'Testimonial image'}
//                       width={500}
//                       height={500}
//                       className="h-full w-full rounded-3xl object-cover object-center"
//                     />
//                   </motion.div>
//                 );
//               })}
//             </AnimatePresence>
//           </div>
//         </div>

//         <div className="flex flex-col justify-between py-4">
//           <motion.div
//             key={active}
//             initial={{ y: 20, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             exit={{ y: -20, opacity: 0 }}
//             transition={{ duration: 0.2, ease: "easeInOut" }}
//           >
//             <h3 className="text-2xl font-bold text-black dark:text-white">
//               {testimonials[active].name}
//             </h3>
//             <p className="text-sm text-gray-500 dark:text-neutral-500">
//               {testimonials[active].designation}
//             </p>

//             <motion.p className="text-2xl text-gray-600 italic">
//               “
//               {testimonials[active].quote.split(" ").map((word, i) => (
//                 <motion.span
//                   key={i}
//                   initial={{ filter: "blur(10px)", opacity: 0, y: 5 }}
//                   animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
//                   transition={{
//                     duration: 0.2,
//                     ease: "easeInOut",
//                     delay: 0.02 * i,
//                   }}
//                   className="inline-block"
//                 >
//                   {word}&nbsp;
//                 </motion.span>
//               ))}
//               ”
//             </motion.p>
//           </motion.div>

//           <div className="flex items-center gap-3 pt-12 md:pt-0">
//             {testimonials.map((_, index) => (
//               <button
//                 key={index}
//                 onClick={() => setActive(index)}
//                 aria-label={`Go to testimonial ${index + 1}`}
//                 className={`h-1 rounded-full transition-all duration-300 ${
//                   index === active
//                     ? "w-10 bg-blue-500 dark:bg-blue-400"
//                     : "w-8 bg-gray-300 dark:bg-neutral-700"
//                 }`}
//               />
//             ))}
//           </div>

//           <div className="sr-only">
//             <button onClick={handlePrev} aria-label="Previous testimonial" />
//             <button onClick={handleNext} aria-label="Next testimonial" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

"use client";

import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { getStrapiMedia } from "../StrapiImage";

type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
};

// deterministic rotate in [-10, 10]
function seedRotate(input: string, min = -10, max = 10) {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) | 0;
  return min + (Math.abs(h) % (max - min + 1));
}

export const AnimatedTestimonials = ({
  testimonials = [],
  autoplay = false,
}: {
  testimonials?: Testimonial[];
  autoplay?: boolean;
}) => {
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false); // ← hydration gate

  // mount once on client so SSR === first client render (null), then hydrate to real UI
  useEffect(() => setMounted(true), []);

  const len = testimonials.length;
  const seededRotates = useMemo(
    () => testimonials.map((t, i) => seedRotate(`${t.src ?? ""}#${i}`)),
    [testimonials]
  );

  useEffect(() => {
    if (!autoplay || len === 0) return;
    const id = setInterval(() => {
      setActive((p) => (p + 1) % len);
    }, 5000);
    return () => clearInterval(id);
  }, [autoplay, len]);

  // If we're not mounted yet or no items, render nothing to keep SSR and first client paint identical
  if (!mounted || len === 0) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-20 font-sans antialiased md:max-w-7xl md:px-8 lg:px-12">
    
      <div className="relative grid grid-cols-1 gap-20 md:grid-cols-2">
        <div>
          <div className="relative h-80 w-full">
            {/* No SSR for this subtree; we mount it client-side only via the hydration gate above */}
            <AnimatePresence initial={false}>
              {testimonials.map((t, index) => {
                const src = getStrapiMedia(t.src);
                console.log("Image src:", t);
                if (!src) return null;
                const rotateSeed = seededRotates[index];
                const isActive = index === active;
                return (
                  <motion.div
                    key={`slide-${index}`}
                    initial={false}
                    animate={{
                      opacity: isActive ? 1 : 0.7,
                      scale: isActive ? 1 : 0.95,
                      rotate: isActive ? 0 : rotateSeed,
                      zIndex: isActive ? 40 : len + 2 - index,
                      y: 0,
                    }}
                    exit={{ opacity: 0, scale: 0.95, rotate: rotateSeed }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="absolute inset-0 origin-bottom"
                  >
                    <Image
                      src={src}
                      alt={t.name}
                      width={500}
                      height={500}
                      draggable={false}
                      className="h-full w-full rounded-3xl object-cover object-center"
                      priority={isActive}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

       <div className="flex flex-col justify-between py-4">
  <motion.div
    key={active}
    initial={false}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.2, ease: "easeInOut" }}
  >
    <h3 className="text-4xl font-agenda-medium">
      {testimonials[active].name}
    </h3>

    <p className="mt-2 text-lg text-[#242a2e80] dark:text-neutral-500">
      {testimonials[active].designation}
    </p>

    {/* Quote block */}
    <div className="relative mt-3 max-w-[740px] isolation-auto">
      {/* background quotation marks */}
      <span
        aria-hidden
        className="pointer-events-none select-none absolute -top-18 -left-2 text-[160px] leading-none text-[#221D1D]/10"
      style={{fontFamily:"fantasy",fontSize:"309px"}}
      >
        “
      </span>
    

      {/* the quote text */}
      <motion.p
        className="
          mt-11
          relative z-10
          text-2xl leading-[1.35]
          text-[#221D1D]/50
          font-agenda-regular
          line-clamp-6
        "
      >
        {testimonials[active].quote}
      </motion.p>
    </div>
  </motion.div>

          {/* <div className="flex items-center gap-3 pt-12 md:pt-0">
            {testimonials.map((_, index) => (
              <button
                key={`dot-${index}`}
                onClick={() => setActive(index)}
                aria-label={`Go to testimonial ${index + 1}`}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === active
                    ? "w-10 bg-blue-500 dark:bg-blue-400"
                    : "w-8 bg-gray-300 dark:bg-neutral-700"
                }`}
              />
            ))}
          </div> */}

          <div className="flex items-center gap-3 pt-12 md:pt-0">
            {/* Prev button */}
            <button
              onClick={() => setActive((active - 1 + len) % len)}
              aria-label="Previous testimonial"
              className="flex items-center justify-center w-10 h-10 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300 transition dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600"
            >
              ←
            </button>

            {/* Next button */}
            <button
              onClick={() => setActive((active + 1) % len)}
              aria-label="Next testimonial"
              className="flex items-center justify-center w-10 h-10 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition dark:bg-blue-400 dark:hover:bg-blue-500"
            >
              →
            </button>
          </div>

          <div className="sr-only">
            <button
              onClick={() => setActive((p) => (p - 1 + len) % len)}
              aria-label="Previous testimonial"
            />
            <button
              onClick={() => setActive((p) => (p + 1) % len)}
              aria-label="Next testimonial"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

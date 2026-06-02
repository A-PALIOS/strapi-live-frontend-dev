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

  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) | 0;
  }

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
  const [mounted, setMounted] = useState(false);

  // hydration gate
  useEffect(() => {
    setMounted(true);
  }, []);

  const len = testimonials.length;

  const seededRotates = useMemo(
    () =>
      testimonials.map((t, i) =>
        seedRotate(`${t.src ?? ""}#${i}`)
      ),
    [testimonials]
  );

  // autoplay WITHOUT looping
  useEffect(() => {
    if (!autoplay || len === 0) return;

    const id = setInterval(() => {
      setActive((prev) => {
        if (prev >= len - 1) return prev;
        return prev + 1;
      });
    }, 5000);

    return () => clearInterval(id);
  }, [autoplay, len]);

  if (!mounted || len === 0) return null;

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-20 font-sans antialiased md:px-10 lg:px-16 xl:px-20">
      <div className="relative grid grid-cols-1 xl:grid-cols-2">
        {/* IMAGE SIDE */}
        <div>
          <div className="relative aspect-square w-full max-w-[400px]">
            <AnimatePresence initial={false}>
              {testimonials.map((t, index) => {
                const src = getStrapiMedia(t.src);

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
                    exit={{
                      opacity: 0,
                      scale: 0.95,
                      rotate: rotateSeed,
                    }}
                    transition={{
                      duration: 0.35,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 origin-bottom"
                  >
                    <Image
                      src={src}
                      alt={t.name}
                      width={500}
                      height={500}
                      draggable={false}
                      priority={isActive}
                      className="h-full w-full rounded-3xl object-cover object-center"
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* CONTENT SIDE */}
        <div className="flex flex-col justify-between py-4">
          <motion.div
            key={active}
            initial={false}
            animate={{
              y: 0,
              opacity: 1,
            }}
            transition={{
              duration: 0.2,
              ease: "easeInOut",
            }}
          >
            <h3 className="font-agenda-medium sm:pt-0 pt-8 text-center sm:text-left  md:text-4xl text-3xl">
              {testimonials[active].name}
            </h3>

            <p className="text-center sm:text-left text-lg text-[#242a2e80] dark:text-neutral-500">
              {testimonials[active].designation}
            </p>

            {/* Quote */}
            <div className="relative mt-3 max-w-[740px] isolation-auto">
              {/* Large quotation mark */}
              <span
                aria-hidden
                className="pointer-events-none absolute -left-2 -top-18 select-none text-[160px] leading-none text-[#221D1D]/10"
                style={{
                  fontFamily: "fantasy",
                  fontSize: "309px",
                }}
              >
                “
              </span>

              {/* Quote text */}
              <motion.p
                className="
                  relative z-10 mt-11
                  line-clamp-6
                  sm:text-3xl
                  text-xl leading-[1.35]
                  tracking-[-1px]
                  text-[#221D1D]/50
                  font-agenda-regular
                  text-center
                  sm:text-left
                "
              >
                {testimonials[active].quote}
              </motion.p>
            </div>
          </motion.div>

          {/* NAVIGATION */}
          <div className="flex items-center justify-center md:justify-start gap-3 pt-12 md:pt-0">
            {/* PREV */}
            <button
              onClick={() =>
                setActive((prev) => Math.max(prev - 1, 0))
              }
              disabled={active === 0}
              aria-label="Previous testimonial"
              className={`
                flex h-10 w-10 items-center justify-center rounded-md transition
                ${
                  active === 0
                    ? "cursor-not-allowed bg-gray-100 text-gray-300"
                    : "cursor-pointer bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600"
                }
              `}
            >
              ←
            </button>

            {/* NEXT */}
            <button
              onClick={() =>
                setActive((prev) => Math.min(prev + 1, len - 1))
              }
              disabled={active === len - 1}
              aria-label="Next testimonial"
              className={`
                flex h-10 w-10 items-center justify-center rounded-md transition
                ${
                  active === len - 1
                    ? "cursor-not-allowed bg-blue-200 text-white"
                    : "cursor-pointer bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-400 dark:hover:bg-blue-500"
                }
              `}
            >
              →
            </button>
          </div>

          {/* SCREEN READER BUTTONS */}
          <div className="sr-only">
            <button
              onClick={() =>
                setActive((prev) => Math.max(prev - 1, 0))
              }
              aria-label="Previous testimonial"
            />

            <button
              onClick={() =>
                setActive((prev) => Math.min(prev + 1, len - 1))
              }
              aria-label="Next testimonial"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
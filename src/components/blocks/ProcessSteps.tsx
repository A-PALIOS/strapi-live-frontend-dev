"use client";

import Link from "next/link";
import type { ProcessStepsBlockProps } from "@/types";

export function ProcessSteps({
  eyebrow,
  title,
  steps,
}: Readonly<ProcessStepsBlockProps>) {
  if (!steps?.length) return null;

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-[1750px]">
        {(eyebrow || title) && (
          <div className="px-6 py-8 md:px-10">
            {eyebrow ? (
              <p className="mb-2 text-sm uppercase tracking-[0.18em] text-neutral-500">
                {eyebrow}
              </p>
            ) : null}

            {title ? (
              <h2 className="text-3xl font-medium tracking-[-0.03em] text-[#1E1E1E] md:text-5xl">
                {title}
              </h2>
            ) : null}
          </div>
        )}

        <div
          className={`grid grid-cols-1 border border-[#D9D9D9] ${
          steps.length === 6 ? "md:grid-cols-3" : "md:grid-cols-4"
          }`}
        >
          {steps.map((step, index) => {
            const cardClassName = `group relative min-h-[500px] overflow-hidden bg-[#F3F3F3] px-6 py-8 md:min-h-[460px] ${
  index !== steps.length - 1 ? "border-b md:border-b-1 md:border-r" : ""
} border-[#D9D9D9]`;

            const content = (
              <>
                <div
                  className="absolute inset-0 z-0 origin-left scale-x-0 bg-[#F58220] transition-transform duration-500 ease-out group-hover:scale-x-100"
                  aria-hidden="true"
                />

                <div className="relative flex h-full flex-col">
                  <span className="mb-10 text-sm font-medium text-[#4A4A4A] transition-colors duration-300 group-hover:text-white">
                    {step.number}
                  </span>

                  <h3 className="max-w-[220px] text-[30px] leading-[1.02] tracking-[-0.04em] text-[#1E1E1E] transition-colors duration-300 group-hover:text-white md:text-[38px]">
                    {step.title}
                  </h3>

                  <p className="mt-5 max-w-[250px] text-sm leading-[1.45] text-[#4A4A4A] transition-colors duration-300 group-hover:text-white">
                    {step.description}
                  </p>
                </div>
              </>
            );

            if (step.linkUrl) {
              const isExternal = step.linkUrl.startsWith("http");

              return isExternal ? (
                <a
                  key={step.id}
                  href={step.linkUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={cardClassName}
                >
                  {content}
                </a>
              ) : (
                <Link key={step.id} href={step.linkUrl} className={cardClassName}>
                  {content}
                </Link>
              );
            }

            return (
              <article key={step.id} className={cardClassName}>
                {content}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
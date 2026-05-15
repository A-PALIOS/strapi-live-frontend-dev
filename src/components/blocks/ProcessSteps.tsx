"use client";

import Link from "next/link";
import type { ProcessStepsBlockProps } from "@/types";

type ProcessStepsVariant = "default" | "compactImpact";

function renderIvyTitle(text: string) {
  const parts = text.split(/\*([^*]+)\*/);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="font-ivypresto-regular">
        {part}
      </span>
    ) : (
      part
    )
  );
}

type Props = ProcessStepsBlockProps & {
  variant?: ProcessStepsVariant;
};

export function ProcessSteps({
  eyebrow,
  title,
  steps,
  variant = "default",
}: Readonly<Props>) {
  if (!steps?.length) return null;

  const isCompactImpact = variant === "compactImpact";

  const desktopCols = isCompactImpact
    ? "lg:grid-cols-2"
    : steps.length === 6
      ? "lg:grid-cols-3"
      : "lg:grid-cols-4";

  return (
    <section
      className={
        isCompactImpact
          ? "w-full px-6 py-12 md:px-10 lg:px-16 xl:px-20"
          : "w-full bg-white px-6 py-10 md:py-10 md:px-10 lg:px-16 xl:px-20"
      }
    >
      <div className="w-full">
        {(eyebrow || title) && (
          <div
            className={
              isCompactImpact
                ? "mb-8"
                : "px-6 py-8 md:px-10 lg:px-12"
            }
          >
            {eyebrow && (
              <p
                className={
                  isCompactImpact
                    ? "mb-8 text-[24px] font-agenda-medium uppercase tracking-[-0.03em] text-[#05192D]"
                    : "mb-2 text-sm uppercase tracking-[0.18em] text-neutral-500"
                }
              >
                {eyebrow}
              </p>
            )}

            {title && (
              isCompactImpact ? (
                <h2 className="max-w-[900px] font-agenda-medium text-[32px] uppercase leading-[1.08] tracking-[-0.06em] text-[#1E1E1E] md:text-[48px]">
                  {renderIvyTitle(title)}
                </h2>
              ) : (
                <h2 className="text-3xl font-medium tracking-[-0.03em] text-[#1E1E1E] md:text-5xl">
                  {title}
                </h2>
              )
            )}
          </div>
        )}

        <div className={isCompactImpact ? "rounded-[6px] bg-white p-6 md:p-10" : ""}>
          <div
            className={
              isCompactImpact
                ? `grid grid-cols-1 gap-[10px] sm:grid-cols-2 ${desktopCols}`
                : `grid grid-cols-1 border-t border-l border-[#BDBDBD] sm:grid-cols-2 ${desktopCols}`
            }
          >
            {steps.map((step) => {
              const hasLink = Boolean(step.linkUrl);

              const compactContent = (
                <div className="flex h-full flex-col justify-between">
                  <h3 className="font-agenda-medium text-[22px] uppercase leading-[1] tracking-[-0.06em] text-[#05192D] md:text-[32px]">
                    {step.title}
                  </h3>

                  <p className="mt-12 max-w-[330px] font-agenda-regular text-[15px] leading-[1.15] tracking-[-0.05em] text-[#1E1E1E] md:text-[24px]">
                    {step.description}
                  </p>
                </div>
              );

              const defaultContent = (
                <>
                  <div
                    className="
                      absolute inset-0 origin-left scale-x-0
                      bg-[#F58220]
                      transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                      group-hover:scale-x-100
                    "
                    aria-hidden="true"
                  />

                  <div className="relative flex h-full flex-col">
                    {step.number && (
                      <div className="mb-10">
                        <span
                          className="
                            inline-flex h-[72px] w-[72px] items-center justify-center rounded-[6px]
                            font-agenda-regular
                            text-[28px] tracking-[-0.03em]
                            text-[#6A6A6A]
                            transition-all duration-300
                            group-hover:bg-white group-hover:text-[#F58220]
                          "
                        >
                          {step.number}
                        </span>
                      </div>
                    )}

                    <h3
                      className="
                        max-w-[520px]
                        font-agenda-regular
                        text-[28px] leading-[1.05] tracking-[-0.05em]
                        text-[#05192D]
                        transition-colors duration-300
                        sm:text-[32px] lg:text-[46px]
                      "
                    >
                      {step.title}
                    </h3>

                    <p
                      className="
                        mt-8 max-w-[620px]
                        font-agenda-regular
                        text-[20px] leading-[1.18] tracking-[-0.04em]
                        text-[#3F3F3F]
                        transition-colors duration-300
                        sm:text-[22px] lg:text-[30px]
                      "
                    >
                      {step.description}
                    </p>
                  </div>

                  {hasLink && (
                    <span
                      className="
                        pointer-events-none
                        absolute bottom-6 right-6
                        flex h-14 w-14 items-center justify-center rounded-[4px]
                        bg-white text-[#F58220]
                        opacity-0 translate-y-2 scale-95
                        transition-all duration-200 ease-out
                        group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100
                      "
                      aria-hidden="true"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6"
                      >
                        <path d="M7 17L17 7M17 7H7M17 7V17" />
                      </svg>
                    </span>
                  )}
                </>
              );

              const content = isCompactImpact ? compactContent : defaultContent;

              const cardClassName = isCompactImpact
                ? `
                  group relative flex min-h-[150px] overflow-hidden
                  bg-[#F4F4F4]
                  px-6 py-6
                  md:min-h-[170px] md:px-7 md:py-7
                `
                : `
                  group relative flex min-h-[360px] overflow-hidden
                  border-r border-b border-[#BDBDBD]
                  px-5 py-5
                  sm:min-h-[420px] sm:px-7 sm:py-7
                  lg:min-h-[480px] lg:px-8 lg:py-8
                `;

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
      </div>
    </section>
  );
}
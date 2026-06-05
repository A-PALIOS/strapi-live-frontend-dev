import Link from "next/link";
import type { LeadingInstitutionBlockProps } from "@/types";

export function LeadingInstitutionBlock({
  Title,
  Heading,
  description,
  cta,
}: Readonly<LeadingInstitutionBlockProps>) {
  const words = Heading.trim().split(" ");
  const diffIndex = words.findIndex(
    (w) => w.toUpperCase() === "DIFFERENCE"
  );

  const beforeDiff =
    diffIndex >= 0 ? words.slice(0, diffIndex + 1).join(" ") : "";

  const middle =
    diffIndex >= 0
      ? words.slice(diffIndex + 1, -1).join(" ")
      : words.slice(0, -1).join(" ");

  const lastWord = words[words.length - 1] ?? "";

  const descLines = description
    .split(/\r?\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <section className="w-full bg-white px-5 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12 lg:px-14 xl:px-[65px]">
      {Title && (
        <>
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-start">
            <div className="inline-flex max-w-full items-center gap-3 flex-wrap">
              <span className="block text-left font-agenda-medium text-[24px] uppercase text-zinc-800 tracking-[-1.6px] sm:text-xl md:text-2xl lg:text-3xl">
                {Title}
              </span>
            </div>

            {/* CTA */}
            {cta && (
              <div className="block lg:inline-block">
                <Link
                  href={cta.href}
                  target={cta.isExternal ? "_blank" : "_self"}
                  rel={cta.isExternal ? "noreferrer" : undefined}
                  className="group inline-flex items-center gap-2 font-agenda-regular font-normal uppercase leading-none tracking-[-0.2px] text-[#221D1D] transition hover:text-[#1E9BFB] lg:hidden"
                >
                  <span className="text-[20px] md:text-[24px]">{cta.text}</span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="h-6 w-6 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  >
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </Link>
              </div>
            )}
          </div>

          <div
            className="mt-8 border-t -mx-5 sm:mt-10 sm:-mx-8 md:mt-12 md:-mx-10 lg:mt-16 lg:-mx-14 xl:-mx-[65px]"
            style={{ borderColor: "#626262" }}
          />
        </>
      )}

      <div className="mt-8 flex flex-col gap-6 md:mt-10 md:gap-8 lg:flex-row lg:items-stretch lg:justify-between lg:gap-14">
        <div className="w-full text-center uppercase md:text-left lg:w-1/2 tracking-[-1.3px] sm:tracking-[-1.8px] md:tracking-[-2px] lg:tracking-[-2.4px]">
          {beforeDiff && (
            <span className="block font-agenda-medium text-[28px] font-extralight leading-tight text-gray-900 sm:text-4xl md:text-5xl lg:text-7xl">
              {beforeDiff}
            </span>
          )}

          <span className="block font-agenda-medium text-[28px] font-extralight leading-tight text-gray-900 sm:text-4xl md:text-5xl lg:text-7xl">
            {middle && `${middle} `}
            <span className="font-ivypresto-regular font-medium lg:text-6xl">
              {lastWord}
            </span>
          </span>
        </div>

        <div className="w-full flex flex-col lg:w-1/2">
          <div>
            {descLines.map((line, i) => (
              <p
                key={i}
                className="mx-auto mb-1 max-w-[457px] text-center font-agenda-regular text-base leading-tight text-[21px] text-[#8B8B8B] last:mb-0 tracking-[-1.1px]  sm:text-base md:mx-0 md:text-left md:text-xl lg:text-3xl"
              >
                {line}
              </p>
            ))}
          </div>

          {/* Desktop CTA */}
          {cta && (
            <div className="mt-3 hidden justify-center md:mt-14 md:justify-start lg:flex">
              <Link
                href={cta.href}
                target={cta.isExternal ? "_blank" : "_self"}
                rel={cta.isExternal ? "noreferrer" : undefined}
                className="inline-flex items-center gap-2 border-2 border-[#F5F4F4] px-16 py-8 font-agenda-regular text-sm font-medium leading-5 text-zinc-700 transition sm:text-base md:text-lg lg:text-[28px]"
              >
                <span>{cta.text}</span>

                <span className="flex h-7 w-7 items-center justify-center rounded-[2px] bg-[#FB7B1E] sm:h-8 sm:w-8">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    className="h-3.5 w-3.5 -rotate-135 text-white sm:h-4 sm:w-4 md:h-5 md:w-5"
                  >
                    <path d="M11 3h2v12.17l3.59-3.58L18 13l-6 6-6-6 1.41-1.41L11 15.17V3z" />
                  </svg>
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
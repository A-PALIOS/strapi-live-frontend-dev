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
    diffIndex >= 0 ? words.slice(diffIndex + 1, -1).join(" ") : words.slice(0, -1).join(" ");
  const lastWord = words[words.length - 1] ?? "";

  const descLines = description
    .split(/\r?\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <section className="w-full bg-white px-5 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12 lg:px-14 xl:px-[65px]">
      {Title && (
        <>
          <span className="block text-center font-agenda-medium text-lg font-medium uppercase tracking-[0.2em] text-gray-900 sm:text-xl md:text-2xl lg:text-3xl md:text-left">
            {Title}
          </span>

          <div className="mt-4 border-t border-gray-200" />
        </>
      )}

      <div className="mt-8 flex flex-col gap-8 md:mt-10 md:flex-row md:items-start md:justify-between md:gap-10 lg:gap-14">
        <div className="w-full text-center uppercase md:w-1/2 md:text-left">
          {beforeDiff && (
            <span className="block font-agenda-medium text-3xl font-extralight leading-tight tracking-wide text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl">
              {beforeDiff}
            </span>
          )}

          <span className="block font-agenda-medium text-3xl font-extralight leading-tight tracking-wide text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl">
            {middle && `${middle} `}
            <span className="font-ivypresto-regular font-medium tracking-wide">
              {lastWord}
            </span>
          </span>
        </div>

        <div className="w-full md:w-1/2">
          {descLines.map((line, i) => (
            <p
              key={i}
              className="mb-4 font-agenda-regular text-base leading-relaxed text-[#8B8B8B] sm:text-lg md:mb-5 md:text-xl lg:text-2xl"
            >
              {line}
            </p>
          ))}

          {cta && (
            <div className="mt-6">
              <Link
                href={cta.href}
                target={cta.isExternal ? "_blank" : "_self"}
                className="inline-flex items-center gap-3 font-agenda-regular text-lg font-medium text-gray-900 transition hover:opacity-80 sm:text-xl md:text-2xl lg:text-3xl"
              >
                <span>{cta.text}</span>

                <span className="flex h-9 w-9 items-center justify-center bg-[#FB7B1E] sm:h-10 sm:w-10">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    className="h-5 w-5 -rotate-135 text-white sm:h-6 sm:w-6 md:h-7 md:w-7"
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
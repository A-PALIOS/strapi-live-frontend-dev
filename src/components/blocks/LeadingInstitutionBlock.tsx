import Link from "next/link";
import type { LeadingInstitutionBlockProps } from "@/types";

export function LeadingInstitutionBlock({
  Title,
  Heading,
  description,
  cta,
}: Readonly<LeadingInstitutionBlockProps>) {
  // Split words
  const words = Heading.trim().split(" ");
  // Find index of DIFFERENCE (case-insensitive)
  const diffIndex = words.findIndex(
    (w) => w.toUpperCase() === "DIFFERENCE"
  );

  // Break into three parts
  const beforeDiff = words.slice(0, diffIndex + 1).join(" "); // up to DIFFERENCE
  const middle = words.slice(diffIndex + 1, -1).join(" ");    // WE CREATE
  const lastWord = words[words.length - 1];                   // TOGETHER

  console.log("Middle", middle)

  const descLines = description
    .split(/(?=\bALONGSIDE\b|\bHEALTH\b)/i) // keep trigger words at start of new line
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div className="bg-white py-7 px-3 mx-auto max-w-7xl sm:px-6 sm:py-10 md:py-12">
      <span
        className="block font-agenda-medium text-2xl sm:text-3xl font-medium tracking-widest uppercase text-center md:text-left md:ml-10"
        // style={{ marginLeft: "300px" }}
      >
        {Title}
      </span>
      <br />
      <div className="border-t border-gray-200 py-4" />
      <div className="flex flex-col md:flex-row md:items-center mt-8 space-y-8 md:space-y-0 md:space-x-12">
        <div className="tracking-widest uppercase text-center md:text-left md:ml-10">
          <span className="text-6xl font-agenda-medium font-extralight leading-tight tracking-wide text-gray-900">
            {beforeDiff}
          </span>
          <span className="text-6xl font-agenda-medium font-extralight leading-tight tracking-wide text-gray-900 ">
            {" "} {middle} {" "}
            <span className="font-ivypresto-regular tracking-wide font-medium text-6xl">
              {lastWord}
            </span>
          </span>
        </div>
        <div className="md:w-1/2">
          {descLines.map((line, i) => (
            <span
              key={i}
              className="block font-agenda-regular text-2xl text-gray-700 mb-2"
              style={{ color: "#8B8B8B" }}
            >
              {line}
            </span>
          ))}
          {cta && (
            <div className="mt-6">
              <Link
                href={cta.href}
                target={cta.isExternal ? "_blank" : "_self"}
                className="inline-flex items-center font-agenda-regular text-3xl font-medium text-gray-900 hover:opacity-80 transition"
              >
                {cta.text}
                <div style={{ backgroundColor: "#FB7B1E", marginLeft: "10px" }}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    className="w-7 h-7 transform -rotate-135"
                    style={{ color: "#FFFFFF" }}
                  >
                    <path d="M11 3h2v12.17l3.59-3.58L18 13l-6 6-6-6 1.41-1.41L11 15.17V3z" />
                  </svg>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

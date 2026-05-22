import Link from "next/link";
import type { LinkListAboutBlockProps } from "@/types";

export function LinkListAbout({
  heading,
  items,
  cta,
}: Readonly<LinkListAboutBlockProps>) {
  if (!items?.length) return null;

  return (
    <section
      id="services"
      data-header="dark"
      className="relative overflow-hidden"
    >
      <div className="w-full px-6 py-16 md:px-10 md:py-20 lg:px-16 xl:px-20">
        <div
          className="min-h-[500px] w-full rounded-[24px] px-6 py-14 text-white md:px-10 lg:px-14 xl:px-20"
          style={{
            background: `
              linear-gradient(
                25deg,
                #947560 0%,
                #6f7176 25%,
                #4f6e85 50%,
                #2f6d9d 100%
              )
            `,
          }}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between gap-4">
            {heading ? (
              <span
                style={{ letterSpacing: "-1.6px" }}
                className="font-agenda text-[20px] font-normal leading-[24px] uppercase text-[#FEFEFE] md:text-[28px] lg:text-[32px]"
              >
                {heading}
              </span>
            ) : null}

            {cta ? (
              <Link
                href={cta.href}
                target={cta.isExternal ? "_blank" : "_self"}
                rel={cta.isExternal ? "noreferrer" : undefined}
                style={{ lineHeight: "24px", letterSpacing: "-1.2px" }}
                className="group inline-flex items-center gap-2 font-agenda text-[14px] font-normal uppercase text-[#FEFEFE] transition hover:opacity-80 md:text-[18px] lg:text-[24px]"
              >
                <span>{cta.text}</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                >
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </Link>
            ) : null}
          </div>

          <div className="mt-14 h-px bg-white -mx-6 md:-mx-10 lg:-mx-14 xl:-mx-20" />

          {/* Outer border */}
          <div className="mt-10 rounded-[8px] border border-white px-4 py-6 md:mt-20 md:px-8 md:py-8 lg:mt-32 lg:px-14">
            {items.map((item, index) => {
              const isLast = index === items.length - 1;

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  target={item.isExternal ? "_blank" : "_self"}
                  rel={item.isExternal ? "noreferrer" : undefined}
                  className={[
                    "group flex w-full items-start justify-between gap-4 text-left",
                    "transition-opacity duration-300 hover:opacity-80",
                    !isLast ? "mb-6 border-b border-white pb-6" : "",
                  ].join(" ")}
                >
                  <span className="block text-left font-agenda-medium text-[22px] font-medium uppercase leading-normal tracking-[-0.05em] text-[#FEFEFE] md:text-[32px] lg:text-[40px]">
                    {item.title}
                  </span>

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 shrink-0 text-white transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    aria-hidden="true"
                  >
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

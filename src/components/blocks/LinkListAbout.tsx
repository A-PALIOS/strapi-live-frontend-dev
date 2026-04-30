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
          className="min-h-[500px] w-full rounded-[24px] px-6 py-10 text-white md:px-10 md:py-14 lg:px-14 xl:px-20"
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
              <span className="font-agenda-medium text-[11px] uppercase tracking-[0.08em] text-white/90 md:text-[12px]">
                {heading}
              </span>
            ) : null}

            {cta ? (
              <Link
                href={cta.href}
                target={cta.isExternal ? "_blank" : "_self"}
                rel={cta.isExternal ? "noreferrer" : undefined}
                className="group inline-flex items-center gap-2 font-agenda-medium text-[10px] uppercase tracking-[0.08em] text-white/85 transition hover:text-white md:text-[11px]"
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

          <div className="mt-5 h-px w-full bg-white/30" />

          {/* Outer border */}
          <div className="mt-10 border border-white/35 px-6 py-6 md:px-8">
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
                    "transition-colors duration-300 hover:text-white",
                    !isLast ? "mb-6 border-b border-white/30 pb-6" : "",
                  ].join(" ")}
                >
                  <span className="block font-agenda-medium text-[18px] uppercase leading-[1.15] text-white/95 transition group-hover:text-white md:text-[20px]">
                    {item.title}
                  </span>

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 shrink-0 text-white/90 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
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
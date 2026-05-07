"use client";

import Link from "next/link";
import Image from "next/image";
import type { RelevantProjectsBlockProps } from "@/types";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getStrapiMediaUrl(url?: string | null) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${url}`;
}

export function RelevantProjects({
  eyebrow,
  cta,
  projects,
  theme,
}: Readonly<RelevantProjectsBlockProps>) {
  if (!projects?.length) return null;

  const isBlack = theme === "black";

  return (
    <section
      className={`w-full px-6 py-16 md:px-10 md:py-20 lg:px-16 xl:px-20${
        isBlack ? " bg-black" : ""
      }`}
    >
      <div>
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            {eyebrow ? (
              <p
                className={`text-[12px] font-medium uppercase tracking-[0.08em] ${
                  isBlack ? "text-white" : "text-[#1f1f1f]"
                }`}
              >
                {eyebrow}
              </p>
            ) : null}
          </div>

          {cta?.text && cta?.href ? (
            <Link
              href={cta.href}
              target={cta.isExternal ? "_blank" : undefined}
              rel={cta.isExternal ? "noopener noreferrer" : undefined}
              className={`group inline-flex items-center gap-2 text-[13px] ${
                isBlack ? "text-white" : "text-[#1f1f1f]"
              }`}
            >
              <span>{cta.text}</span>
              <span className="flex h-4 w-4 items-center justify-center bg-[#f08a24] text-[10px] text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                ↗
              </span>
            </Link>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-[1px] bg-[#d9d4d0] md:grid-cols-3">
          {projects.map((item) => {
            return (
              <Link
                key={item.id}
                href={item.linkUrl || "#"}
                className="group relative min-h-[420px] overflow-hidden bg-[#b9afa7] md:min-h-[560px]"
              >
                {item.backgroundImage?.url ? (
                  <Image
                    src={getStrapiMediaUrl(item.backgroundImage.url)}
                    alt={
                      item.backgroundImage.alternativeText ||
                      item.title ||
                      "Project image"
                    }
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                ) : null}

                <div className="absolute inset-0 bg-black/25 transition-colors duration-300 group-hover:bg-black/35" />

                <div className="relative z-10 flex h-full flex-col justify-between p-4 md:p-5">
                  <div className="max-w-[170px]">
                    {item.logo?.url ? (
                      <Image
                        src={getStrapiMediaUrl(item.logo.url)}
                        alt={
                          item.logo.alternativeText ||
                          item.title ||
                          "Project logo"
                        }
                        width={170}
                        height={60}
                        className="h-auto w-auto max-h-[52px] object-contain"
                      />
                    ) : null}
                  </div>

                  <div className="max-w-[330px] translate-y-8 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    {item.title ? (
                      <h3 className="mb-3 text-[22px] font-medium uppercase tracking-[-0.03em] text-white md:text-[24px]">
                        {item.title}
                      </h3>
                    ) : null}

                    {!!item.tags?.length && (
                      <div className="mb-4 flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <span
                            key={tag.id}
                            className="rounded-full border border-white/55 px-3 py-1 text-[11px] leading-none text-white"
                          >
                            {tag.label}
                          </span>
                        ))}
                      </div>
                    )}

                    {item.description ? (
                      <p className="max-w-[300px] text-[14px] leading-[1.45] text-white/95">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
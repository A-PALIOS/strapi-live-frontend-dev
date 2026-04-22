"use client";

import Link from "next/link";
import type { RelevantProjectsBlockProps } from "@/types";
import { StrapiImage } from "../StrapiImage";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function RelevantProjects({
  eyebrow,
  cta,
  projects,
}: Readonly<RelevantProjectsBlockProps>) {
  if (!projects?.length) return null;

  const featuredIndex = Math.max(
    0,
    projects.findIndex((item) => item.isFeatured)
  );

  return (
    <section className="w-full px-6 py-16 md:px-10 md:py-20 lg:px-16 xl:px-20">
      <div>
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            {eyebrow ? (
              <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#1f1f1f]">
                {eyebrow}
              </p>
            ) : null}
          </div>

          {cta?.text && cta?.href ? (
            <Link
              href={cta.href}
              target={cta.isExternal ? "_blank" : undefined}
              rel={cta.isExternal ? "noopener noreferrer" : undefined}
              className="group inline-flex items-center gap-2 text-[13px] text-[#1f1f1f]"
            >
              <span>{cta.text}</span>
              <span className="flex h-4 w-4 items-center justify-center bg-[#f08a24] text-[10px] text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                ↗
              </span>
            </Link>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-[1px] bg-[#d9d4d0] md:grid-cols-3">
          {projects.map((item, index) => {
            const isOpen = index === featuredIndex;

            return (
              <Link
                key={item.id}
                href={item.linkUrl || "#"}
                className="group relative min-h-[420px] overflow-hidden bg-[#b9afa7] md:min-h-[560px]"
              >
                {item.backgroundImage?.url ? (
                  <StrapiImage
                    src={item.backgroundImage.url}
                    alt={
                      item.backgroundImage.alternativeText ||
                      item.title ||
                      "Project image"
                    }
                    width={1200}
                    height={1600}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                ) : null}

                <div className="absolute inset-0 bg-black/25 transition-colors duration-300 group-hover:bg-black/35" />

                <div className="relative z-10 flex h-full flex-col justify-between p-4 md:p-5">
                  <div className="max-w-[170px]">
                    {item.logo?.url ? (
                      <StrapiImage
                        src={item.logo.url}
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

                  <div
                    className={cn(
                      "max-w-[330px] transition-all duration-500",
                      isOpen
                        ? "translate-y-0 opacity-100"
                        : "translate-y-8 opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
                    )}
                  >
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
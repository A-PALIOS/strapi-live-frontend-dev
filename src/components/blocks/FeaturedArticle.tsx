"use client";

import type { FeaturedArticleProps } from "@/types";
import { StrapiImage } from "../StrapiImage";

export function FeaturedArticle({
  title,
  image,
  author,
  publishedAt,
}: Readonly<FeaturedArticleProps>) {
  return (
    <section className="w-full px-6 md:px-10 lg:px-16 xl:px-20 pt-32 pb-12 md:pt-36 md:pb-14 xl:pt-40 xl:pb-16">

      {/* Section header */}
      <div className="mb-6 md:mb-8">
        <h1
          className="
            text-[44px] leading-[0.95] tracking-[-0.055em]
            md:text-[62px] lg:text-[68px]
            whitespace-normal break-words [overflow-wrap:anywhere]
          "
        >
          <span className="font-agenda-medium">Insights &amp; Advice from </span>
          <span className="font-ivypresto-regular-italic">Our team</span>
        </h1>

        <p
          className="
            mt-4 md:mt-5 max-w-3xl
            font-agenda-regular text-[18px] leading-[1.28] tracking-[-0.03em]
            md:text-[20px] lg:text-[21px]
          "
        >
          Explore the latest ideas, expert perspectives, and industry thinking shaping the future of
          healthcare and social impact. Discover research-driven insights, emerging trends, and
          practical approaches for a rapidly evolving healthcare landscape.
        </p>
      </div>

      {/* Article card */}
      <article className="relative w-full rounded-lg overflow-hidden">

        {/* Background image */}
        {image && (
          <StrapiImage
            src={image.url}
            alt={image.alternativeText || "Article Image"}
            width={1728}
            height={715}
            className="
              w-full object-cover
              h-[380px] sm:h-[460px] md:h-[560px] lg:h-[640px] xl:h-[715px]
            "
          />
        )}

        {/* Gradient overlay — matches Figma: from-sky-900 via-sky-950/40 to-slate-950/0 */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-900 via-sky-950/40 to-slate-950/0" />

        {/* Content — Figma: px-36 py-24, items-center */}
        <div
          className="
            absolute inset-0 flex items-center
            px-6 py-8 sm:px-10 sm:py-12
            md:px-16 md:py-16
            lg:px-24 lg:py-20
            xl:px-36 xl:py-24
          "
        >
          {/* Inner column — Figma: w-[728px], gap-20 */}
          <div className="flex flex-col justify-center gap-10 md:gap-14 xl:gap-20 w-full max-w-[728px]">

            {/* Heading + title */}
            <div className="flex flex-col gap-4 md:gap-6">

              {/* "Article  of the Day" — two spans aligned to baseline */}
              <div className="flex flex-wrap items-end gap-2 sm:gap-3 md:gap-4">
                {/* Figma: text-blue-200 text-7xl font-normal IvyPresto */}
                <span
                  className="
                    font-ivypresto-regular-italic text-blue-200
                    text-4xl sm:text-5xl md:text-6xl xl:text-7xl
                    leading-none
                  "
                >
                  Article
                </span>

                {/* Figma: text-white text-8xl font-normal Agenda leading-[82px] */}
                <span
                  className="
                    font-agenda-medium text-white
                    text-4xl sm:text-5xl md:text-7xl xl:text-8xl
                    leading-none xl:leading-[82px]
                  "
                >
                  of the Day
                </span>
              </div>

              {/* Article title — Figma: text-white text-3xl font-normal Roboto */}
              <p
                className="
                  font-agenda-regular text-white
                  text-lg sm:text-xl md:text-2xl xl:text-3xl
                  leading-snug
                "
              >
                {title}
              </p>
            </div>

            {/* Author pill — Figma: w-40 h-10 px-2 py-0.5 bg-zinc-100 rounded-[75px] gap-4 */}
            <div className="inline-flex items-center gap-3 bg-zinc-100 rounded-[75px] px-2 py-0.5 w-fit">

              {/* Avatar */}
              <div
                className="w-9 h-9 rounded-full overflow-hidden shrink-0"
                style={{ boxShadow: "-2.54px 0px 3.8px 0px #1E9BFB" }}
              >
                {author.imageAuthor?.url ? (
                  <StrapiImage
                    src={author.imageAuthor.url}
                    alt={author.imageAuthor.alternativeText || author.name}
                    width={36}
                    height={36}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-sky-300 rounded-full" />
                )}
              </div>

              {/* Name + date — Figma: flex-col gap-2 */}
              <div className="flex flex-col">
                {/* Figma: text-sky-500 text-xs Proxima Nova leading-6 */}
                <span className="text-sky-500 text-xs leading-6 whitespace-nowrap">
                  {author.name}
                </span>
                {/* Figma: text-zinc-800/75 text-xs Proxima Nova leading-6 */}
                <span className="text-zinc-800/75 text-xs leading-6 whitespace-nowrap">
                  {formatDate(publishedAt)}
                </span>
              </div>
            </div>

          </div>
        </div>
      </article>
    </section>
  );
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

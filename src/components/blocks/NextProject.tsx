import Link from "next/link";
import type { NextProjectBlock } from "@/types";
import { StrapiImage } from "../StrapiImage";

export function NextProject(block: NextProjectBlock) {
  if (!block?.Image) return null;

  const href = block.cta?.href || "#";
  const isExternal = block.cta?.isExternal;

  const content = (
    <section className="w-full border-t border-[#626262] px-6 py-8 lg:py-10 md:px-10 lg:px-16 xl:px-20 lg:flex lg:justify-center">
      <Link href={href} className="flex flex-row items-center justify-between lg:justify-start gap-2 sm:gap-4 lg:gap-4">
        <h2 className="text-[28px] sm:text-[40px] md:text-[52px] lg:text-[64px] font-agenda-regular uppercase tracking-wide text-[#2f3a42] leading-tight">
          {block.cta?.text || "CONTINUE TO NEXT PROJECT"}
        </h2>

        <div className="relative h-[60px] w-[130px] sm:h-[80px] sm:w-[175px] md:h-[108px] md:w-[235px] shrink-0 overflow-hidden">
          <StrapiImage
            src={block.Image.url}
            alt={block.Image.alternativeText || "Next project"}
            fill
            className="object-cover"
          />
        </div>

        <span className="text-[36px] sm:text-[52px] md:text-[72px] leading-none text-black transition-transform group-hover:translate-x-2 shrink-0">
          →
        </span>
      </Link>
      
    </section>
  );

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group block"
      >
        {content}
      </a>
    );
  }

  return (
    <>
      {content}
    </>
  );
}
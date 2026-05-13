import Link from "next/link";
import type { NextProjectBlock } from "@/types";
import { StrapiImage } from "../StrapiImage";

export function NextProject(block: NextProjectBlock) {
  if (!block?.Image) return null;

  const href = block.cta?.href || "#";
  const isExternal = block.cta?.isExternal;

  const content = (
    <section className="flex items-center justify-center gap-12 border border-neutral-300 px-10 py-20 transition hover:bg-neutral-50">
      <h2 className="text-[34px] font-normal uppercase tracking-wide text-[#2f3a42]">
        {block.cta?.text || "CONTINUE TO NEXT PROJECT"}
      </h2>

      <div className="relative h-[108px] w-[235px] overflow-hidden">
        <StrapiImage
          src={block.Image.url}
          alt={block.Image.alternativeText || "Next project"}
          fill
          className="object-cover"
        />
      </div>

      <span className="text-[72px] leading-none text-black transition-transform group-hover:translate-x-2">
        →
      </span>
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
    <Link href={href} className="group block">
      {content}
    </Link>
  );
}
import type { FlowchartShowcaseBlockProps } from "@/types";
import { StrapiImage } from "../StrapiImage";

export function FlowchartShowcase({
  title,
  image,
}: Readonly<FlowchartShowcaseBlockProps>) {
  if (!image) return null;

  return (
    <section className="relative w-full overflow-hidden bg-[#030912] px-6 py-12 md:px-10 md:py-16 lg:px-16 xl:px-20">
      {title && (
        <h2 className="mb-8 text-2xl font-agenda-medium leading-tight text-white md:text-[32px]">
          {title}
        </h2>
      )}

      <div className="flex w-full justify-center">
        <div className="relative w-full max-w-[1400px]">
          <StrapiImage
            src={image.url}
            alt={image.alternativeText || title || "Automation flowchart"}
            width={1600}
            height={900}
            className="h-auto w-full object-contain"
          />
        </div>
      </div>
    </section>
  );
}
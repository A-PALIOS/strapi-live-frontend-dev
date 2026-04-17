import type { TwoColumnTextBlockProps } from "@/types";

export function TwoColumnText({
  leftText,
  rightText,
}: Readonly<TwoColumnTextBlockProps>) {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-[1400px] px-6 py-10 md:px-10 md:py-14 lg:px-12">
        <div className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2 lg:gap-x-16">
          <p className="max-w-[560px] text-[25px] leading-[1.35] tracking-[-0.02em] text-[#1F2937]">
            {leftText}
          </p>

          <p className="max-w-[560px] text-[25px] leading-[1.35] tracking-[-0.02em] text-[#1F2937]">
            {rightText}
          </p>
        </div>
      </div>
    </section>
  );
}
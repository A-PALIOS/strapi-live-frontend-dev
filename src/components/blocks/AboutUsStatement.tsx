import type { AboutUsStatementBlockProps } from "@/types";

export function AboutUsStatement({
  text,
}: Readonly<AboutUsStatementBlockProps>) {
  const highlightedWord = "From shaping";
  const parts = text.split(new RegExp(`(${highlightedWord})`, "i"));

  return (
    <section className="w-full bg-[#02243A] px-6 py-10 md:px-10 md:py-12">
      <div className="w-full">
       <p className="w-full font-agenda-regular-italic text-[22px] leading-[1.4] tracking-[-0.03em] text-white md:text-[68px] md:leading-[1.28]">
          {parts.map((part, index) =>
            part.toLowerCase() === highlightedWord.toLowerCase() ? (
              <span key={index} className="text-[#2994F2]">
                {part}
              </span>
            ) : (
              <span key={index}>{part}</span>
            )
          )}
        </p>
      </div>
    </section>
  );
}
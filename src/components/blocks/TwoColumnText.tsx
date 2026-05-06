import type { TwoColumnTextBlockProps } from "@/types";

function renderParagraphs(text?: string, isBlack?: boolean) {
  if (!text) return null;

  return text
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map((paragraph, index) => (
      <p
        key={index}
        className={`
          font-agenda-normal
          text-[18px]
          leading-[1.28]
          tracking-[-0.03em]
          sm:text-[19px]
          md:text-[20px]
          lg:text-[21px]
          ${isBlack ? "text-white" : "text-[#2c2626]"}
        `}
      >
        {paragraph.trim()}
      </p>
    ));
}

export function TwoColumnText({
  leftText,
  rightText,
  theme,
}: Readonly<TwoColumnTextBlockProps>) {
  const isBlack = theme === "black";

  return (
    <section className={`w-full${isBlack ? " bg-black" : ""}`}>
      <div className="w-full max-w-[1200px] px-6 md:px-10 lg:px-16 xl:px-20 py-10 md:py-10 sm:px-8 sm:py-10 md:py-10 lg:px-12 lg:py-10">
        <div className="grid grid-cols-1 gap-y-8 md:grid-cols-2 md:gap-x-10 lg:gap-x-14 xl:gap-x-20">
          <div className="max-w-full space-y-5 md:max-w-[460px] lg:space-y-6">
            {renderParagraphs(leftText, isBlack)}
          </div>

          <div className="max-w-full space-y-5 md:max-w-[460px] lg:space-y-6">
            {renderParagraphs(rightText, isBlack)}
          </div>
        </div>
      </div>
    </section>
  );
}
interface StatementSectionProps {
  headingPrimary: string;
  headingSecondary: string;
  bodyPrimary: string;
  bodySecondary: string;
}

export function StatementSection({
  headingPrimary,
  headingSecondary,
  bodyPrimary,
  bodySecondary,
}: Readonly<StatementSectionProps>) {
  const [firstWord, ...restWords] = headingPrimary.trim().split(" ");
  const remainingHeading = restWords.join(" ");

  const primaryLines = bodyPrimary.split("\n").filter(Boolean);
  const secondaryLines = bodySecondary.split("\n").filter(Boolean);

  return (
    <section className="bg-white px-6 py-10 md:px-12 md:py-12">
      <div className="mx-auto max-w-[980px] text-center">
        <h2 className="text-[34px] leading-[0.95] tracking-[-0.05em] md:text-[60px]">
          <span className="font-semibold text-black">{firstWord}</span>{" "}
          <span className="font-normal text-[#9B9B9B]">{remainingHeading}</span>
        </h2>

        <h2 className="mt-1 text-[34px] font-normal leading-[0.95] tracking-[-0.05em] text-[#9B9B9B] md:text-[60px]">
          {headingSecondary}
        </h2>

        <div className="mt-7 text-[#2F2F2F] md:mt-8">
          <p className="mx-auto w-fit text-[16px] leading-[1.28] md:text-[14px] md:leading-[1.3]">
            {primaryLines.map((line, index) => (
    <span
      key={index}
      className={`block ${
        index === 1
          ? "ml-4 md:ml-4"
          : index === primaryLines.length - 1
          ? "text-right"
          : "text-left"
      }`}
    >
      {line}
    </span>
  ))}
          </p>

          <p className="mt-6 text-[16px] leading-[1.28] md:mt-7 md:text-[14px] md:leading-[1.3]">
            {secondaryLines.map((line, index) => (
              <span key={index} className="block">
                {line}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
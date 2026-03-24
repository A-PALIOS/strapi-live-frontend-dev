import type { ExpertiseGridBlockProps } from "@/types";

export function ExpertiseGrid({
  eyebrow,
  items,
}: Readonly<ExpertiseGridBlockProps>) {
  return (
    <section className="w-full bg-white px-6 py-10 md:px-10 md:py-14">
      <div className="w-full">
        {eyebrow && (
          <p className="mb-8 font-agenda-medium text-[14px] uppercase leading-none tracking-[0.02em] text-black md:mb-10">
            {eyebrow}
          </p>
        )}

        <div className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
          {items?.map((item, index) => (
            <article
              key={item.id ?? index}
              className="border-t border-[#cfcfcf] pt-8 md:pt-7"
            >
              <div className="grid grid-cols-[32px_1fr] gap-x-3 md:grid-cols-[44px_1fr] md:gap-x-4">
                <span className="pt-[2px] font-agenda-light text-[15px] leading-none tracking-[-0.03em] text-[#9a9a9a] md:text-[18px]">
                  {item.number}
                </span>

                <div>
                  <h3 className="font-agenda-medium text-[26px] leading-[1] tracking-[-0.045em] text-[#231f20] md:text-[39px]">
                    {item.title}
                  </h3>

                  <p className="mt-3 max-w-[520px] font-agenda-light text-[16px] leading-[1.22] tracking-[-0.035em] text-[#5b5b5b] md:mt-4 md:text-[23px]">
                    {item.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
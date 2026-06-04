import type { CompanyHighlightsBlockProps } from "@/types";
import { StrapiImage } from "../StrapiImage";

function getDotColorClass(color?: string) {
  switch (color) {
    case "green":
      return "bg-green-600";
    case "orange":
      return "bg-orange-500";
    case "red":
      return "bg-red-600";
    case "black":
      return "bg-black";
    case "blue":
    default:
      return "bg-[#2994F2]";
  }
}

export function CompanyHighlights({
  title,
  items,
}: Readonly<CompanyHighlightsBlockProps>) {
  return (
    <section className="w-full">
      <div>
        {title && (
          <h2 className="px-6 py-8 text-center font-agenda-medium text-2xl uppercase tracking-[0.12em] text-black md:px-10">
            {title}
          </h2>
        )}

        <div className="w-full bg-white grid grid-cols-1 border-t border-[#d9d9d9] px-6 lg:px-10 xl:px-16 2xl:px-20 xl:grid-cols-3 xl:min-h-[60vh] /* #mobile */">
          {items?.map((item, index) => (
            <article
              key={item.id ?? index}
              className="
                flex h-full flex-col
                items-center text-center

                min-h-[230px]
                px-6 pt-6 pb-5

                sm:min-h-[250px]
                sm:px-8
                sm:pt-7
                sm:pb-6

                md:min-h-[300px]
                md:px-10
                md:pt-8
                md:pb-7

                lg:min-h-[340px]
                lg:px-12
                lg:pt-10
                lg:pb-8

                xl:min-h-[380px]
                xl:px-14
                xl:pt-12
                xl:pb-10

                2xl:min-h-[258px]
                2xl:px-[18px]
                2xl:pt-[24px]
                2xl:pb-[18px]
                2xl:items-start
                2xl:text-left
                2xl:border-r
                2xl:border-[#d9d9d9]
                last:2xl:border-r-0

                items-align-center

                /* #mobile */
              "
            >
              {item.icon && (
                <div className="flex justify-center xl:justify-start /* #mobile */">
                  <StrapiImage
                    src={item.icon.url}
                    alt={item.icon.alternativeText || "icon"}
                    width={60}
                    height={60}
                    className="
                      h-[52px] w-[52px]
                      sm:h-[58px] sm:w-[58px]
                      md:h-[68px] md:w-[68px]
                      lg:h-[78px] lg:w-[78px]
                      xl:h-[88px] xl:w-[88px]
                      2xl:h-[60px] 2xl:w-[60px]
                      /* #mobile */
                    "
                  />
                </div>
              )}

              <div className="mt-6 xl:mt-auto /* #mobile */">
                <h3
                  className="
                    font-agenda-regular
                    text-[38px]
                    leading-[0.95]
                    tracking-[-0.04em]
                    text-black

                    sm:text-[48px]
                    md:text-[64px]
                    lg:text-[78px]
                    xl:text-[92px]
                    2xl:text-8xl

                    /* #mobile */
                  "
                >
                  {item.value}
                </h3>

                <div className="mt-[8px] space-y-0">
                  <p
                    className="
                      font-agenda-regular
                      text-[14px]
                      uppercase
                      leading-[1.05]
                      tracking-[-0.03em]
                      text-[#3c3c3c]

                      sm:text-[16px]
                      md:text-[22px]
                      lg:text-[28px]
                      xl:text-[32px]
                      2xl:text-4xl

                      /* #mobile */
                    "
                  >
                    {item.title}
                  </p>

                  {item.subtitle && (
                    <p
                      className="
                        font-agenda-regular
                        text-[14px]
                        uppercase
                        leading-[1.05]
                        tracking-[-0.03em]
                        text-[#3c3c3c]

                        sm:text-[16px]
                        md:text-[22px]
                        lg:text-[28px]
                        xl:text-[32px]
                        2xl:text-4xl

                        /* #mobile */
                      "
                    >
                      {item.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
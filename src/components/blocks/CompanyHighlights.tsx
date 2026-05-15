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

        <div className="w-full px-6 md:px-10 lg:px-16 xl:px-20 bg-white grid grid-cols-1 border-t border-[#d9d9d9] md:grid-cols-3 md:min-h-[65vh] lg:min-h-[60vh]">
          {items?.map((item, index) => (
            <article
              key={item.id ?? index}
              className="
                flex h-full min-h-[260px] flex-col
                px-6 pt-6 pb-5
                md:min-h-[258px] md:px-[18px] md:pt-[24px] md:pb-[18px]
                md:border-r md:border-[#d9d9d9]
                last:md:border-r-0
                items-align-center
              "
            >
              {item.icon && (
                <StrapiImage
                  src={item.icon.url}
                  alt={item.icon.alternativeText || "icon"}
                  width={60}
                  height={60}
                />
              )}

              <div className="mt-auto">
                <h3 className="font-agenda-regular text-[30px] leading-[0.95] tracking-[-0.04em] text-black md:text-8xl">
                  {item.value}
                </h3>

                <div className="mt-[8px] space-y-0">
                  <p className="font-agenda-regular text-[13px] uppercase leading-[1.05] tracking-[-0.03em] text-[#3c3c3c] md:text-4xl">
                    {item.title}
                  </p>

                  {item.subtitle && (
                    <p className="font-agenda-regular text-[13px] uppercase leading-[1.05] tracking-[-0.03em] text-[#3c3c3c] md:text-4xl">
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
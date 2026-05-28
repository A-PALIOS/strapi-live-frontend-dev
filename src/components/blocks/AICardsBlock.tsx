import { StrapiImage } from "../StrapiImage";
import type { AICardsBlockProps } from "@/types";

export function AICardsBlock({ Title, Cards, layout }: AICardsBlockProps) {
  const isSixCardsLayout = layout === "six_columns" && Cards?.length === 6;

  const gridClass = isSixCardsLayout
    ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";

  return (
    <section className="w-full bg-[#030912] px-6 md:px-10 lg:px-10 xl:px-11 py-16 md:py-20 text-white">
      <div className={isSixCardsLayout ? "w-full px-4 md:px-6 lg:px-8" : "w-full px-4 md:px-6 lg:px-8"}>
        {Title && (
          <h2
            className={
              isSixCardsLayout
                ? "mb-8 text-2xl font-agenda-medium md:text-[32px] px-3"
                : "mb-6 text-[32px] font-agenda-medium px-3"
            }
          >
            {Title}
          </h2>
        )}

        <div className={`grid ${gridClass} gap-4`}>
          {Cards?.map((card) => {
            const iconUrl = card.Icon_Image?.url;

            if (!isSixCardsLayout) {
              return (
                <div
                  key={card.id}
                  className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur"
                >
                  <div className="mb-3 flex items-center gap-3">
                    {iconUrl ? (
                      <StrapiImage
                        src={iconUrl}
                        alt={
                          card.Icon_Image?.alternativeText ||
                          card?.Title ||
                          "Card icon"
                        }
                        width={50}
                        height={28}
                      />
                    ) : null}

                    <h3 className="text-lg font-medium">{card.Title}</h3>
                  </div>

                  <p className="text-sm opacity-80">{card.description}</p>
                </div>
              );
            }

            return (
              <div
                key={card.id}
                className="
                  relative
                  flex
                  min-h-[210px]
                  flex-col
                  items-center
                  rounded-[20px]
                  border
                  border-[#1B2B45]
                  bg-[linear-gradient(180deg,rgba(14,25,45,0.95)_0%,rgba(8,16,30,0.95)_100%)]
                  px-4
                  py-6
                  text-center
                  shadow-[0_0_30px_rgba(0,0,0,0.25)]
                  transition-all
                  duration-300
                  hover:translate-y-[-2px]
                  hover:border-[#2A4B78]
                "
              >
                <div className="pointer-events-none absolute inset-0 rounded-[20px] bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_60%)]" />

                {iconUrl && (
                  <div
                    className="
                      relative
                      mb-5
                      flex
                      h-[58px]
                      w-[58px]
                      items-center
                      justify-center
                      rounded-2xl
                      border
                      border-white/10
                      bg-white/[0.03]
                      shadow-[0_0_20px_rgba(59,130,246,0.12)]
                    "
                  >
                    <StrapiImage
                      src={iconUrl}
                      alt={
                        card.Icon_Image?.alternativeText ||
                        card.Title ||
                        "Card icon"
                      }
                      width={50}
                      height={28}
                      className="object-contain"
                    />
                  </div>
                )}

                <h3 className="mb-3 text-2xl font-agenda-medium leading-[1.3] text-white">
                  {card.Title}
                </h3>

                <p className="text-lg font-agenda-regular leading-[1.65] text-white/70">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
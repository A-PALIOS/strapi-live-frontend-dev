import Image from "next/image";
import { StrapiImage } from "../StrapiImage";
import type { AICardsBlockProps } from "@/types";

export function AICardsBlock({ Title, Cards }: AICardsBlockProps) {
  return (
    <section className="w-full py-10 bg-[#071426] text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-6">{Title}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Cards?.map((card) => {
            const iconUrl = card.Icon_Image?.url;
            console.log("Card data:", card);

            return (
              <div
                key={card.id}
                className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur"
              >
                <div className="flex items-center gap-3 mb-3">
                  {iconUrl ? (
                    <StrapiImage
                      src={iconUrl}
                      alt={card.Icon_Image?.alternativeText || card?.title || "Card icon"}
                      width={50}
                      height={28}
                    />
                  ) : null}

                  <h3 className="text-lg font-medium">{card.title}</h3>
                </div>

                <p className="text-sm opacity-80">{card.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
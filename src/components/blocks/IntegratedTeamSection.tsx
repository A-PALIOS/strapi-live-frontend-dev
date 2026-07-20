import type { IntegratedTeamSectionProps } from "@/types";
import { StrapiImage } from "../StrapiImage";

export function IntegratedTeamSection({ data }: { data: IntegratedTeamSectionProps }) {
  const img = data.image;

  return (
    <section className="w-full bg-[#030912] px-6 md:px-10 lg:px-10 xl:px-18 py-16 md:py-20 overflow-hidden text-white">
      <div className="grid container gap-10 px-6 py-10 md:grid-cols-2 md:items-center">
        {/* Left */}
        <div>
          {data.eyebrow ? (
            <p className="text-lg font-agenda-medium text-white/70">{data.eyebrow}</p>
          ) : null}

          <h2 className="mt-2 text-2xl font-agenda-medium leading-snug md:text-4xl">
            {data.title}
          </h2>

          {data.description ? (
            <p className="mt-4 max-w-md text-white/70 font-agenda-regular text-lg leading-relaxed">
              {data.description}
            </p>
          ) : null}

          <ul className="mt-8 space-y-6">
            {data.items?.map((item) => {
              const iconUrl = item.icon?.url;

              return (
                <li key={item.id} className="flex items-start gap-4">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/10">
                    {iconUrl ? (
                      <StrapiImage
                        src={iconUrl}
                        alt={item.icon?.alternativeText || item.title}
                        width={28}
                        height={28}
                        className="object-contain"
                      />
                    ) : null}
                  </span>

                  <div>
                    <h3 className="text-lg font-agenda-medium text-white">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-white/70 font-agenda-regular leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right */}
        <div className="relative">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <StrapiImage
              src={img?.url}
              alt={img?.alternativeText || data?.title}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

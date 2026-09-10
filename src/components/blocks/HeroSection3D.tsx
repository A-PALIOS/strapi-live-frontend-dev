import type { HeroSection3DProps } from "@/types";
import ImpactBanner, { type Stage } from "./ImpactBanner";
import ImpactBannerSection2 from "./ImpactBannerSection2";
import ImpactBannerSection3 from "./ImpactBannerSection3";

/**
 * HeroSection3D — Strapi block `blocks.hero-section-3d`.
 *
 * A thin wrapper: it owns the section chrome (padding, theme, the
 * `data-header` hint the site header reads for light/dark nav) and hands the
 * editable copy to one of the banner components, which own the 3D shape and
 * the stage animation.
 *
 * `variant` picks the shape, so the same block can be reused on different
 * pages with a different visual identity:
 *   - "system" (default) -> ImpactBanner: single icosahedron, dark navy
 *   - "impact"           -> ImpactBannerSection2: geodesic orb + orbit rings,
 *                           bright blue
 *   - "sustain"          -> ImpactBannerSection3: torus knot (one continuous
 *                           loop), orange
 *
 * They all take the same `stages` shape and each falls back to its own
 * built-in copy when Strapi has none, so the block never renders empty.
 *
 * To add a shape later: build the banner component and add one entry to
 * BANNER_BY_VARIANT below, plus the value in Strapi's `variant` enum and in
 * HeroSection3DProps.
 */

const BANNER_BY_VARIANT = {
  system: ImpactBanner,
  impact: ImpactBannerSection2,
  sustain: ImpactBannerSection3,
} as const;

type BannerVariant = keyof typeof BANNER_BY_VARIANT;
export function HeroSection3D({
  heading,
  subheader,
  stages,
  autoAdvanceMs,
  theme,
  variant,
}: Readonly<HeroSection3DProps>) {
  const isDark = theme === "black";
  const navbarColor = isDark ? "dark" : "light";

  // Falls back to the icosahedron if Strapi ever sends a variant this build
  // doesn't know about (e.g. a value added to the enum before the code ships),
  // rather than crashing the page on an undefined component.
  const Banner =
    BANNER_BY_VARIANT[(variant ?? "system") as BannerVariant] ?? ImpactBanner;

  // Strapi rows carry an `id` and possibly nulls — normalise to the shape
  // ImpactBanner expects and drop anything the editor left entirely blank.
  const bannerStages: Stage[] = (stages ?? [])
    .filter((s) => s?.headline || s?.eyebrow || s?.sub)
    .map((s) => ({
      number: s.number ?? undefined,
      eyebrow: s.eyebrow ?? "",
      headline: s.headline ?? "",
      sub: s.sub ?? "",
    }));

  return (
    <section
      id="heropage"
      data-header={navbarColor}
      className={`bg-${theme ?? "white"} pt-20 md:pt-24 lg:pt-28 pb-1 md:pb-1`}
    >
      <div className="w-full px-6 md:px-10 lg:px-16 xl:px-20 py-16 md:py-20">
        {(heading || subheader) && (
          <div className="max-w-6xl">
            {heading && (
              <h1
                className={`
                  text-[44px]
                  leading-[0.95]
                  tracking-[-0.055em]
                  break-words
                  md:text-[62px]
                  lg:text-[68px]
                  font-agenda-medium
                  ${isDark ? "text-white" : ""}
                `}
              >
                {heading}
              </h1>
            )}

            {subheader && (
              <p
                className="mt-6 max-w-[1000px] font-agenda-regular xl:tracking-[-2px] tracking-[-1px]"
                style={{
                  color: isDark ? "#FFFFFF" : "#3F4449",
                  fontSize: "clamp(20px, 2.8vw, 40px)",
                  fontWeight: 400,
                  lineHeight: "normal",
                }}
              >
                {subheader}
              </p>
            )}
          </div>
        )}

        <div className={heading || subheader ? "mt-14 md:mt-16" : ""}>
          <div className="relative block w-full overflow-hidden rounded-lg">
            <Banner
              stages={bannerStages}
              autoAdvanceMs={autoAdvanceMs ?? undefined}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection3D;

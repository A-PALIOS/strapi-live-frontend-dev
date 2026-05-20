import { StrapiImage, getStrapiMedia } from "@/components/StrapiImage";
import Image from "next/image";

type LogoProps = {
  src: string;
  alt?: string;
};

type StrapiImageWithLogoProps =
  | ({
      logo?: LogoProps | null;
    } & {
      src: string;
      alt: string;
      className?: string;
      width: number;
      height: number;
      fill?: false;
      quality?: number;
      unoptimized?: boolean;
      sizes?: string;
    })
  | ({
      logo?: LogoProps | null;
    } & {
      src: string;
      alt: string;
      className?: string;
      fill: true;
      width?: never;
      height?: never;
      quality?: number;
      unoptimized?: boolean;
      sizes?: string;
    });

export function StrapiImageWithLogo(
  props: Readonly<StrapiImageWithLogoProps>
) {
  const { logo } = props;

  // IMPORTANT: wrapper must be relative for overlay
  return (
    <div className="relative w-full h-full">
      {/* Original image (unchanged behavior) */}
      <StrapiImage {...props} />

      {/* Logo overlay */}
      {logo?.src && (
        <div className="pointer-events-none absolute left-4 top-4 z-10">
          <div className="relative w-[267px] h-[106px]">
            <Image
              src={getStrapiMedia(logo.src)!}
              alt={logo.alt || "logo"}
              fill
              className="object-contain object-left-top"
              sizes="267px"
            />
          </div>
        </div>
      )}
    </div>
  );
}
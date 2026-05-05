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
        <div className="pointer-events-none absolute left-4 top-4 z-10 ">
        <Image
            src={getStrapiMedia(logo.src)!}
            alt={logo.alt || "logo"}
            width={267}
            height={124}
            // className="w-[30%] max-w-[100px] min-w-[48px] h-auto object-contain"
            // className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain"
        />
        </div>
      )}
    </div>
  );
}
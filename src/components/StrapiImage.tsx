import Image from "next/image";
import { getStrapiURL2 } from "@/utils/get-strapi-url";

type StrapiImageProps =
  | {
      src: string;
      alt: string;
      className?: string;
      width: number;
      height: number;
      fill?: false;
      quality?: number;
      unoptimized?: boolean;
      sizes?: string;
    }
  | {
      src: string;
      alt: string;
      className?: string;
      fill: true;
      width?: never;
      height?: never;
      quality?: number;
      unoptimized?: boolean;
      sizes?: string;
    };

export function StrapiImage(props: Readonly<StrapiImageProps>) {
  const { src, alt, className, quality = 100, unoptimized = false, sizes } = props;
  const imageUrl = getStrapiMedia(src);

  if (!imageUrl) return null;

  if ("fill" in props && props.fill) {
    return (
      <Image
        src={imageUrl}
        alt={alt}
        className={className}
        fill
        quality={quality}
        unoptimized={unoptimized}
        sizes={sizes}
      />
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={alt}
      className={className}
      width={props.width}
      height={props.height}
      quality={quality}
      unoptimized={unoptimized}
      sizes={sizes}
    />
  );
}

export function getStrapiMedia(url: string | null) {
  if (url == null) return null;
  if (url.startsWith("data:")) return url;
  if (url.startsWith("http") || url.startsWith("https") || url.startsWith("//")) return url;
  return getStrapiURL2() + url;
}
import Image from "next/image";
import { getStrapiURL2 } from "@/utils/get-strapi-url";

interface StrapiImageProps {
  src: string;
  alt: string;
  className?: string;
  [key: string]: string | number | boolean | undefined;
}

export function StrapiImage({
  src,
  alt,
  className,
  ...rest
}: Readonly<StrapiImageProps>) {
  const imageUrl = getStrapiMedia(src);

  if (!imageUrl) return null;

  return <Image src={imageUrl} alt={alt} className={className} {...rest} />;
}

export function getStrapiMedia(url: string | null) {
  if (url == null) return null;
  if (url.startsWith("data:")) return url;
  if (url.startsWith("http") || url.startsWith("https")|| url.startsWith("//")) return url;
  return getStrapiURL2() + url;
}
// export function getStrapiMedia(url?: string) {
//   if (!url) return '';
//   // Strapi often returns relative URLs
//   if (url.startsWith('http')) return url;
//   return `${getStrapiURL()}${url}`;
// }

// export function getStrapiMedia(input?: string | null): string | null {
//   if (!input) return null;

//   let raw = String(input).trim();

//   // Guard obviously bad values
//   if (/^(undefined|null)(\/|$)/i.test(raw)) return null;

//   // Accept data/blob as-is
//   if (/^(data|blob):/i.test(raw)) return raw;

//   // Fix accidental "http:/..." or "https:/..."
//   raw = raw.replace(/^https?:\/(?!\/)/i, (m) => (m.startsWith("https") ? "https://" : "http://"));
//   // console.log("getStrapiMedia raw:",raw);
//   try {
//     // If already absolute (http/https), URL() returns it unchanged
//     // If protocol-relative (//cdn...), it adopts the base protocol
//     // If relative (/uploads/...), it resolves against the base
//     const base = getStrapiURL2() + "/";
//     // console.log("getStrapiMedia base:",base);
//     // console.log("getStrapiMedia full:",new URL(raw, base).toString());
//     return new URL(raw, base).toString();
//   } catch {
//     console.log("FAILED");
//     // console.log(`getStrapiMedia() failed to parse URL: ${input}`);
//     return null;
//   }
// }
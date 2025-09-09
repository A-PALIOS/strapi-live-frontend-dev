// components/StrapiVideo.tsx

// import { getStrapiURL } from "@/utils/get-strapi-url";
import { getStrapiURL2 } from "@/utils/get-strapi-url";

interface StrapiVideoProps {
  src: string;
  className?: string;
  controls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  poster?: string;
}

export function StrapiVideo({
  src,
  className = "",
  controls = true,
  autoPlay = false,
  loop = false,
  muted = false,
  poster,
}: Readonly<StrapiVideoProps>) {
  const videoUrl = getStrapiMedia(src);
  if (!videoUrl) return null;

  return (
    <video
      src={videoUrl}
      className={className}
      controls={controls}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      poster={poster}
    >
      Your browser does not support the video tag.
    </video>
  );
}

// function getStrapiMedia(url: string | null) {
//   if (url == null) return null;
//   if (url.startsWith("data:")) return url;
//   if (url.startsWith("http") || url.startsWith("//")) return url;
//   return getStrapiURL() + url;
// }

export function getStrapiMedia(url: string | null) {
  if (url == null) return null;
  if (url.startsWith("data:")) return url;
  if (url.startsWith("http") || url.startsWith("https")|| url.startsWith("//")) return url;
  return getStrapiURL2() + url;
}
import { FullImageProps } from "@/types";
import { StrapiImage } from "@/components/StrapiImage";

export function FullImage({ image }: Readonly<FullImageProps>) {
  return (
    <div className="w-full mb-8">
      <StrapiImage
        src={image.url}
        alt={image.alternativeText || "No alternative text provided"}
        width={1920}
        height={1080}
        className="w-full h-auto rounded-lg object-cover"
      />
    </div>
  );
}

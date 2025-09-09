import ReactMarkdown from "react-markdown";
import { StrapiImage } from "../StrapiImage";
import { ParagraphWithImageProps } from "@/types";

export function ParagraphWithImage({
  content,
  image,
}: Readonly<ParagraphWithImageProps>) {
  return (
    <div className="flex flex-col items-left gap-6 my-8">
      {/* Text Block */}
      <div className="prose max-w-none text-base leading-relaxed text-gray-800 my-6">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>

      {/* Image Block (smaller size) */}
      <div className="w-full max-w-md">
        <StrapiImage
          src={image.url}
          alt={image.alternativeText || "No alternative text provided"}
          width={800}
          height={600}
          className="w-full h-auto object-cover rounded"
        />
      </div>
    </div>
  );
}

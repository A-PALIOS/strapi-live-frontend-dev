import { ImageProps } from "@/types";
import Link from "next/link";
import { StrapiImage } from "./StrapiImage";
import { formatDate } from "@/utils/format-date";

export interface CardProps {
  documentId: string;
  title: string;
  description: string;
  slug: string;
  image: ImageProps;
   imageAuthor?: {
    url: string;
    alternativeText?: string;
  };
  author:string;
  price?: number;
  startDate?: string;
  createdAt: string;
  basePath: string;
}

export function Card({
  title,
  description,
  slug,
  image,
  author,
  imageAuthor,
  // price,
  createdAt,
  startDate,
  basePath,
}: Readonly<CardProps>) {
  return (
    <Link
      href={`/${basePath}/${slug}`}
      className="block rounded-lg overflow-hidden shadow-sm bg-white hover:shadow-md transition-shadow duration-300"
    >
      {/* Image */}
      <div className="w-full h-64 relative">
        <StrapiImage
          src={image.url}
          alt={image.alternativeText || "No alternative text provided"}
          className="w-full h-full object-cover"
          fill
        />
      </div>

      {/* Text content */}
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 leading-snug">
          {title}
        </h3>

        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          {description.slice(0, 144)}...
        </p>

        {/* Author section */}



        {/*figma author section */}
<div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-fit shadow">
  {/* Profile Image with Figma-style cyan shadow */}
  <div
    className="w-11 h-11 mr-3 rounded-full relative"
    style={{
      boxShadow: "-2.54px 0px 3.8px 0px #1E9BFB",
    }}
  >
      {imageAuthor?.url && (

    <StrapiImage
      src={imageAuthor?.url}
      alt={imageAuthor?.alternativeText || "Author"}
      width={44}
      height={44}
      className="w-full h-full rounded-full object-cover"
    />)}
  </div>

  {/* Author Name and Date */}
  <div className="flex flex-col leading-tight">
    <span className="text-[#1E9BFB] font-semibold text-sm">{author}</span>
    <span className="text-gray-600 text-xs mt-0.5">     {formatDate(startDate ?? createdAt)}</span>
  </div>
</div>



  
      </div>
    </Link>
  );
}

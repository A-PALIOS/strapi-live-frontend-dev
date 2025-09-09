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
  categories?: { id: number | string; documentId?: string; name: string }[];
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
  categories,
  // price,
  createdAt,
  startDate,
  basePath,
}: Readonly<CardProps>) {
  const primaryCategory = categories?.[0]?.name ?? null;
  return (
    <Link
      href={`/${basePath}/${slug}`}
      className="block rounded-lg overflow-hidden shadow-sm bg-white hover:shadow-md transition-shadow duration-300"
    >
      {/* Image */}
      <div className="w-full h-64 relative group">
  <StrapiImage
    src={image.url}
    alt={image.alternativeText || "No alternative text provided"}
    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
    fill
  />
 
  {/* subtle image gradient so text stays readable */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/0 to-black/35 pointer-events-none" />
 
  {/* category pill (top-left) */}
  {primaryCategory && (
    <div className="absolute top-3 left-3 z-10">
      <span
        className="
          inline-flex items-center
          px-3 py-1 rounded-full
          font-medium tracking-wide
          text-white/100
          bg-white/20
          backdrop-blur-md
         
          shadow-[0_2px_8px_rgba(0,0,0,0.15)]
          font-agenda-regular
          text-md
        "
      >
        {primaryCategory} 
      </span>
    </div>
  )}
</div>
 
      {/* Text content */}
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 leading-snug font-agenda-regular">
          {title}
        </h3>
 
        {/* <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          {description.slice(0, 144)}...
        </p> */}
 
        {/* Author section */}
 
 
 
        {/*figma author section */}

<div className="flex justify-between">
<div className="flex items-center bg-gray-100 px-4 py-2 w-fit shadow">
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
  {/* {primaryCategory && (
            <span className="text-xs text-gray-600 mr-3 bg-white rounded-full px-2 py-0.5 border">
              {primaryCategory}
            </span>
          )} */}
 
  {/* Author Name and Date */}
  <div className="flex flex-col leading-tight">
    <span className="text-[#1E9BFB] font-semibold text-sm font-agenda-regular">{author}</span>
    <span className="text-gray-600 text-xs mt-0.5 font-agenda-regular">     {formatDate(startDate ?? createdAt)}</span>
  </div>
</div>

{/* Diagonal arrow icon */}
  <div className="flex justify-end items-end mt-4">
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="text-[#1E9BFB]" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 16L16 6M16 6H8M16 6V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
</div>
 
 
 
      </div>
    </Link>
  );
}
 
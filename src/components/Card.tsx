import { ImageProps } from "@/types";
import Link from "next/link";
import { StrapiImage } from "./StrapiImage";
import { formatDate } from "@/utils/format-date";
 
export interface CardProps {
  documentId: string;
  title: string;
  description?: string;
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
      className="flex flex-col rounded-lg overflow-hidden shadow-sm bg-white hover:shadow-md transition-shadow duration-300"
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
      <div className="p-5 pb-8 flex flex-col flex-1 min-h-[280px]">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 leading-snug font-agenda-regular line-clamp-3">
          {title}
        </h3>
 
        {/* <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          {description.slice(0, 144)}...
        </p> */}
 
        {/* Author section */}
 
 
 
        {/*figma author section */}

<div className="flex justify-between mt-auto">
<div className="px-2 py-0.5 bg-zinc-800/5 rounded-[5px] inline-flex justify-start items-center gap-2">
  {imageAuthor?.url && (
    <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0" style={{ boxShadow: "-2.54px 0px 3.8px 0px #1E9BFB" }}>
      <StrapiImage
        src={imageAuthor.url}
        alt={imageAuthor.alternativeText || author}
        width={28}
        height={28}
        className="w-full h-full object-cover"
      />
    </div>
  )}
  <div className="h-9 inline-flex flex-col justify-center items-start gap-[3px]">
    <span className="text-sky-500 text-xs font-normal font-agenda-regular">{author}</span>
    <span className="text-zinc-800 text-xs font-normal font-agenda-regular">{formatDate(startDate ?? createdAt)}</span>
  </div>
</div>

{/* Diagonal arrow icon */}
  <div className="flex justify-end items-end">
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="text-[#1E9BFB]" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 16L16 6M16 6H8M16 6V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
</div>
 
 
 
      </div>
    </Link>
  );
}
 
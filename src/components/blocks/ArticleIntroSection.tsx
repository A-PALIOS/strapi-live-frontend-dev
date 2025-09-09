// import Link from "next/link";
import { StrapiImage } from "../StrapiImage";
import { ArticleProps } from "@/types";




export function ArticleIntroSection({
  title,
  description,
  image,
  imageAuthor,
  author,
  publishedAt,
}: Readonly<ArticleProps>){
  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      {/* Top row with title and author info */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 max-w-3xl leading-snug">
          {title}
        </h1>
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
    <span className="text-gray-600 text-xs mt-0.5">{publishedAt}</span>
  </div>
</div>

      </div>

      {/* Image with decoration and overlay */}
      <div className="relative mt-6">
        {/* Decorative squares */}
    {/* Decorative squares */}
<div className="hidden md:block absolute -top-[21px] -left-[30px] w-[161px] h-[154px] bg-[#ACD1ED] -z-10 rounded" />
<div className="hidden md:block absolute -bottom-[32px] -right-[40px] w-[530px] h-[311px] bg-[#ACD1ED] -z-10 rounded" />

{/* Main image */}
<StrapiImage
  src={image.url}
  alt={image.alternativeText || "Article Image"}
  width={1200}
  height={600}
  className="w-full rounded shadow-lg"
/>

{/* Overlay box */}
<div className="relative mt-4 md:absolute md:bottom-6 md:right-6  p-4 rounded-md w-full md:w-[80%]  text-gray-900 md:text-white">
  <h4 className="font-semibold mb-1 text-left">Description:</h4>
  <p className="text-sm leading-relaxed text-left">
    {description}
  </p>
</div>
      </div>
    </section>
  );
}

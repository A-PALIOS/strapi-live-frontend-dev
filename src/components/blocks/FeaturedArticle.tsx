// "use client";

// import type { FeaturedArticleProps } from "@/types";
// import Link from "next/link";
// import { StrapiImage } from "@/components/StrapiImage";
// import ReactMarkdown from "react-markdown";

// export function FeaturedArticle({
//   headline,
//   link,
//   excerpt,
//   image,
// }: Readonly<FeaturedArticleProps>) {
//   return (
//     <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
//       {/* Top section: Heading + Description */}
//       <div>
//         <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
//           {headline}
//           <span className="text-sky-500">Our team</span>
//         </h2>
//         <p className="mt-2 text-gray-500 max-w-3xl">
//           {excerpt}
//         </p>
//       </div>

//       {/* Featured article card */}
//       <article className="relative w-full h-[300px] md:h-[380px] rounded overflow-hidden">
//         <StrapiImage
//         src={image.url}
//         alt={image.alternativeText || "No alternative text provided"}
//         height={200}
//         width={300}
//         priority
//         />

//         {/* Overlay */}
//         <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm p-6 md:p-10 flex flex-col justify-between text-white">
//           <div className="space-y-2">
//             <h3 className="text-2xl sm:text-3xl font-bold">
//               <span className="text-sky-400">Article</span> of the Day
//             </h3>

//             <p className="text-sm font-semibold">
//               {headline}{" "}
//               {/* <span className="text-sky-400">Our team</span> */}
//             </p>

//             <div className="text-sm leading-relaxed text-gray-200">
//               <ReactMarkdown>{excerpt}</ReactMarkdown>
//             </div>
//           </div>

//           {/* Author and CTA */}
//           <div className="flex items-center justify-between mt-4">
//             <div className="flex items-center gap-3">
//               <div className="h-9 w-9 rounded-full bg-gray-200" />
//               <div className="text-xs">
//                 <p className="font-medium">Jon Doe</p>
//                 <p className="text-gray-400">05/05/2023</p>
//               </div>
//             </div>

//             <Link
//               href={link.href}
//               className="bg-white text-black text-sm px-4 py-2 rounded hover:bg-gray-100 transition"
//             >
//               {link.text} →
//             </Link>
//           </div>
//         </div>
//       </article>
//     </section>
//   );
// }



// "use client";

// import type { FeaturedArticleProps } from "@/types";
// import Link from "next/link";
// import { StrapiImage } from "../StrapiImage";
// import ReactMarkdown from "react-markdown";

// export function FeaturedArticle({
//   title,
//   excerpt,
//   image,
  
//   link,
//   author,
//   publishedAt,
// }: Readonly<FeaturedArticleProps>) {
//   return (
//     <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
//       {/* Header */}
  

//       {/* Featured article card */}
//       <article className="relative w-full h-auto rounded overflow-hidden">
       
//        {image && (<StrapiImage
//             src={image.url}
//             alt={image.alternativeText || "Article Image"}
//             width={1200}
//             height={600}
//             className="w-full rounded shadow-lg"
//             />
//             )}

//         {/* Overlay content */}
//         <div className="absolute inset-0  p-6 md:p-10 text-white">
//           <div className="space-y-2">
//             <h3 className="text-2xl sm:text-3xl font-bold">
//               <span className="text-sky-400">Article</span> of the Day
//             </h3>

//             <p className="text-sm font-semibold">{title}</p>

//             <div className="text-sm leading-relaxed text-gray-200 line-clamp-4">
//               <ReactMarkdown>{excerpt}</ReactMarkdown>
//             </div>
//           </div>

// <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-fit shadow">
//   {/* Profile Image with Figma-style cyan shadow */}
//   <div
//     className="w-11 h-11 mr-3 rounded-full relative"
//     style={{
//       boxShadow: "-2.54px 0px 3.8px 0px #1E9BFB",
//     }}
//   >
//       {author.imageAuthor?.url && (

//     <StrapiImage
//       src={author.imageAuthor?.url}
//       alt={author.imageAuthor?.alternativeText || "Author"}
//       width={44}
//       height={44}
//       className="w-full h-full rounded-full object-cover"
//     />)}
//   </div>

//   {/* Author Name and Date */}
//   <div className="flex flex-col leading-tight">
//     <span className="text-[#1E9BFB] font-semibold text-sm">{author.name}</span>
//     <span className="text-gray-600 text-xs mt-0.5">{publishedAt}</span>
//   </div>
// </div>





//           {/* Author and CTA */}
//           <div className="flex items-center justify-between mt-4">
//             <div className="flex items-center gap-3">
//               {/* {author?.imageAuthor?.url ? (
//                 <StrapiImage
//                   src={author.imageAuthor.url}
//                   alt={author.imageAuthor.alternativeText || author.name}
//                   width={36}
//                   height={36}
//                   className="rounded-full object-cover w-9 h-9"
//                 />
//               ) : (
//                 <div className="w-9 h-9 rounded-full bg-gray-400" />
//               )} */}
//               <div className="text-xs">
//                 {/* <p className="font-medium">{author.name}</p> */}
//                 <p className="text-gray-400">{formatDate(publishedAt)}</p>
//               </div>
//             </div>

//             <Link
//               href={link.href}
//               className="bg-white text-black text-sm px-4 py-2 rounded hover:bg-gray-100 transition"
//             >
//               {link.text} →
//             </Link>
//           </div>
//         </div>
//       </article>
//     </section>
//   );
// }

// // Optional helper to format date
// function formatDate(dateString: string) {
//   const date = new Date(dateString);
//   return date.toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "2-digit",
//     year: "numeric",
//   });
// }



"use client";

import type { FeaturedArticleProps } from "@/types";
import Link from "next/link";
import { StrapiImage } from "../StrapiImage";
import ReactMarkdown from "react-markdown";

export function FeaturedArticle({
  title,
  excerpt,
  image,
  link,
  author,
  publishedAt,
}: Readonly<FeaturedArticleProps>) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <article className="relative w-full h-auto rounded overflow-hidden">
        {/* Image */}
        {image && (
          <StrapiImage
            src={image.url}
            alt={image.alternativeText || "Article Image"}
            width={1200}
            height={600}
            className="w-full object-cover h-full rounded"
          />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/20 text-white p-6 md:p-10 flex flex-col justify-between">
          {/* Top content */}
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-3xl sm:text-4xl font-bold leading-tight">
              <span className="text-[#1E9BFB]">Article</span> of the Day
            </h3>

            <p className="italic text-lg">
             {title}{" "}
              <span className="text-[#1E9BFB] font-medium"></span>
            </p>

            <div className="text-sm text-white leading-relaxed max-w-xl">
              <ReactMarkdown>{excerpt}</ReactMarkdown>
            </div>
          </div>

          {/* Bottom content */}
          <div className="flex justify-between items-end mt-8">
            {/* Author pill */}
            <div className="flex items-center bg-white text-black rounded-full px-4 py-2 shadow-lg">
              <div
                className="w-9 h-9 rounded-full mr-3 overflow-hidden"
                style={{
                  boxShadow: "-2.54px 0px 3.8px 0px #1E9BFB",
                }}
              >
                {author.imageAuthor?.url && (
                  <StrapiImage
                    src={author.imageAuthor.url}
                    alt={author.imageAuthor.alternativeText || "Author"}
                    width={36}
                    height={36}
                    className="object-cover w-full h-full"
                  />
                )}
              </div>
              <div className="text-xs">
                <p className="font-semibold text-[#1E9BFB]">{author.name}</p>
                <p className="text-gray-600">{formatDate(publishedAt)}</p>
              </div>
            </div>

            {/* CTA button */}
            <Link
              href={link.href}
              className="bg-white text-[#1E9BFB] font-medium text-sm px-6 py-2 rounded shadow hover:bg-gray-100 transition inline-flex items-center"
            >
              {link.text}
              <span className="ml-2">➜</span>
            </Link>
          </div>
        </div>
      </article>
    </section>
  );
}

// Date formatter
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

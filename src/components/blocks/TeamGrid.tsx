"use client";

import React, { useState, useEffect } from "react";
import { StrapiImage } from "@/components/StrapiImage";
import { TeamGridProps } from "@/types";
import { CometCard } from "@/components/ui/comet-card";
import Link from "next/link";
import { NewContentList } from "@/components/NewContentList";
import { BlogCard } from "@/components/BlogCard";
import { getCategories2 } from "@/data/loaders";

interface TeamGridPropsExtended extends TeamGridProps {
  page?: string;
  query?: string;
  category?: string;
}

export function TeamGrid({
  Title,
  team_members,
  page,
  query,
  category,
}: Readonly<TeamGridPropsExtended>) {
  const [currentPage2, setCurrentPage2] = useState(1);
  const membersPerPage = 9;
  const [categoryList, setCategoryList] = useState<any[]>([]);

  const totalPages = Math.ceil(team_members.length / membersPerPage);
  const startIndex = (currentPage2 - 1) * membersPerPage;

  const paginatedMembers = team_members.slice(
    startIndex,
    startIndex + membersPerPage
  );

  useEffect(() => {
    let ignore = false;

    async function getCat() {
      try {
        const cat = await getCategories2();
        if (!ignore) setCategoryList(cat);
      } catch (e) {
        console.error("Failed to load categories", e);
      }
    }

    getCat();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div>
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        {Title && (
          <h2 className="mb-10 text-center text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
            {Title}
          </h2>
        )}

<div className="grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
  {paginatedMembers.map((member) => (
    <div key={member.id} className="flex justify-center">
      <CometCard className="w-full max-w-[330px]">
        <Link
          href={`/team/${member.slug}`}
          aria-label={`View ${member.FullName}`}
          className="group block rounded-[14px] bg-white p-[8px]"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          <div
            className="relative overflow-hidden rounded-[8px] bg-[#E9E8E4]"
            style={{ transform: "translateZ(22px)" }}
          >
            <div className="relative aspect-[330/372] w-full">
              {member.ProfileImage?.url && (
                <StrapiImage
                  src={member.ProfileImage.url}
                  alt={
                    member.ProfileImage?.alternativeText ||
                    member.FullName ||
                    "Profile Image"
                  }
                  fill
                  sizes="100vw"

                  quality={100}
                  
                  
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                />
              )}
            </div>
          </div>

          <div
            className="px-[2px] pb-[6px] pt-[12px] text-left"
            style={{ transform: "translateZ(30px)" }}
          >
            <h3 className="font-agenda-medium text-[35px] font-medium leading-[0.96] tracking-[-1.77px] text-[#242A2E]">
              {member.FullName}
            </h3>

            <p className="mt-[6px] font-agenda-regular text-[23.59px] font-normal leading-[0.98] tracking-[-1.18px] text-[#242A2E]/50">
              {member.JobTitle}
            </p>
          </div>
        </Link>
      </CometCard>
    </div>
  ))}
</div>

        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              onClick={() => setCurrentPage2((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage2 === 1}
              className="rounded-md bg-gray-200 px-4 py-2 hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage2(i + 1)}
                className={`rounded px-3 py-1 ${
                  currentPage2 === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage2((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage2 === totalPages}
              className="rounded-md bg-gray-200 px-4 py-2 hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </section>

      {/* <NewContentList
        headline="Recent Insights"
        path="/api/articles"
        component={BlogCard}
        featured
        showSearch
        category={category}
        query={query}
        showPagination
      /> */}
    </div>
  );
}


//TEAM GRID CARD WITH SMALL SHADOW AND POLAROID STYLE

// "use client";

// import React, { useState, useEffect } from "react";
// import { StrapiImage } from "@/components/StrapiImage";
// import { TeamGridProps } from "@/types";
// import { CometCard } from "@/components/ui/comet-card";
// import Link from "next/link";
// import { NewContentList } from "@/components/NewContentList";
// import { BlogCard } from "@/components/BlogCard";
// import { getCategories2 } from "@/data/loaders";

// interface TeamGridPropsExtended extends TeamGridProps {
//   page?: string;
//   query?: string;
//   category?: string;
// }

// export function TeamGrid({
//   Title,
//   team_members,
//   page,
//   query,
//   category,
// }: Readonly<TeamGridPropsExtended>) {
//   const [currentPage2, setCurrentPage2] = useState(1);
//   const membersPerPage = 9;
//   const [categoryList, setCategoryList] = useState<any[]>([]);

//   const totalPages = Math.ceil(team_members.length / membersPerPage);
//   const startIndex = (currentPage2 - 1) * membersPerPage;

//   const paginatedMembers = team_members.slice(
//     startIndex,
//     startIndex + membersPerPage
//   );

//   useEffect(() => {
//     let ignore = false;

//     async function getCat() {
//       try {
//         const cat = await getCategories2();
//         if (!ignore) setCategoryList(cat);
//       } catch (e) {
//         console.error("Failed to load categories", e);
//       }
//     }

//     getCat();
//     return () => {
//       ignore = true;
//     };
//   }, []);

//   return (
//     <div>
//       <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
//         {Title && (
//           <h2 className="mb-10 text-center text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
//             {Title}
//           </h2>
//         )}

// <div className="grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
//   {paginatedMembers.map((member) => (
//     <div key={member.id} className="flex justify-center">
//       <CometCard className="w-full max-w-[330px]">
        
//     <Link
//   href={`/team/${member.slug}`}
//   aria-label={`View ${member.FullName}`}
//   className="group block rounded-[14px] bg-white p-[8px] shadow-[0_3px_14px_rgba(0,0,0,0.05)] transition-shadow duration-300 hover:shadow-[0_10px_28px_rgba(0,0,0,0.08)]"
//   style={{
//     transformStyle: "preserve-3d",
//   }}
// >
//           <div
//             className="relative overflow-hidden rounded-[8px] bg-white"
//             style={{ transform: "translateZ(22px)" }}
//           >
//             <div className="relative aspect-[330/372] w-full">
//               {member.ProfileImage?.url && (
//                 <StrapiImage
//                   src={member.ProfileImage.url}
//                   alt={
//                     member.ProfileImage?.alternativeText ||
//                     member.FullName ||
//                     "Profile Image"
//                   }
//                   width={330}
//                   height={372}
//                   className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
//                 />
//               )}
//             </div>
//           </div>

//           <div
//             className="px-[2px] pb-[6px] pt-[12px] text-left"
//             style={{ transform: "translateZ(30px)" }}
//           >
//             <h3 className="font-agenda-medium text-[35px] font-medium leading-[0.96] tracking-[-1.77px] text-[#242A2E]">
//               {member.FullName}
//             </h3>

//             <p className="mt-[6px] font-agenda-regular text-[23.59px] font-normal leading-[0.98] tracking-[-1.18px] text-[#242A2E]/50">
//               {member.JobTitle}
//             </p>
//           </div>
//         </Link>
//       </CometCard>
//     </div>
//   ))}
// </div>

//         {totalPages > 1 && (
//           <div className="mt-10 flex items-center justify-center gap-4">
//             <button
//               onClick={() => setCurrentPage2((prev) => Math.max(prev - 1, 1))}
//               disabled={currentPage2 === 1}
//               className="rounded-md bg-gray-200 px-4 py-2 hover:bg-gray-300 disabled:opacity-50"
//             >
//               Previous
//             </button>

//             {Array.from({ length: totalPages }, (_, i) => (
//               <button
//                 key={i}
//                 onClick={() => setCurrentPage2(i + 1)}
//                 className={`rounded px-3 py-1 ${
//                   currentPage2 === i + 1
//                     ? "bg-blue-600 text-white"
//                     : "bg-gray-100 hover:bg-gray-200"
//                 }`}
//               >
//                 {i + 1}
//               </button>
//             ))}

//             <button
//               onClick={() =>
//                 setCurrentPage2((prev) => Math.min(prev + 1, totalPages))
//               }
//               disabled={currentPage2 === totalPages}
//               className="rounded-md bg-gray-200 px-4 py-2 hover:bg-gray-300 disabled:opacity-50"
//             >
//               Next
//             </button>
//           </div>
//         )}
//       </section>

//       <NewContentList
//         headline="Recent Insights"
//         path="/api/articles"
//         component={BlogCard}
//         featured
//         showSearch
//         category={category}
//         query={query}
//         showPagination
//       />
//     </div>
//   );
// }
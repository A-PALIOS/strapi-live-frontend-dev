"use client";
import React, { useState, useEffect } from "react";
import { StrapiImage } from "@/components/StrapiImage";
import { TeamGridProps } from "@/types";
import { SocialIcon } from "react-social-icons";
import { CometCard } from "@/components/ui/comet-card";

import Link from "next/link";
// import { ContentList} from "@/components/ContentList"
import { NewContentList } from "@/components/NewContentList";
import { BlogCard } from "@/components/BlogCard";
import NewCategoryFilter from "@/components/NewCategoryFilter";
import {getPageBySlug,getCategories2 } from "@/data/loaders";
import { notFound } from "next/navigation";

// async function loader(slug: string) {
//   const { data } = await getPageBySlug(slug);
//   if (data.length === 0) notFound();
//   return { blocks: data[0]?.blocks };
// }
interface TeamGridPropsExtended extends TeamGridProps {
  page?: string;
  query?: string;
  category?: string;
}
 
export  function TeamGrid({ Title, team_members, page, query, category }: Readonly<TeamGridPropsExtended>) {
  const [currentPage2, setCurrentPage2] = useState(1);
  const membersPerPage = 3;
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const totalPages = Math.ceil(team_members.length / membersPerPage);
 
  const startIndex = (currentPage2 - 1) * membersPerPage;
  const paginatedMembers = team_members.slice(
    startIndex,
    startIndex + membersPerPage
  );

  useEffect(() =>
  {
    async function getCat()
    {
      const cat = await getCategories2()
      setCategoryList(cat)
    }
    getCat()
  })

  // const categoryList = await getCategories();

  // console.log("eeeeeeee: ",currentPage2, totalPages, paginatedMembers);

 
  return (
    <div>
    <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Optional Title */}
      {/* {Title && <h2 className="text-2xl font-bold mb-8 text-center">{Title}</h2>} */}
 
      {/* Team Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {paginatedMembers.map((member) => (
          <div key={member.id} className="text-center">



                                            <CometCard>
                <Link href={`/team/${member.slug}`}
                  // type="button"
                  className="my-10 flex w-80 cursor-pointer flex-col items-stretch rounded-[16px] border-0 bg-[#1F2121] p-2 saturate-0 md:my-20 md:p-4"
                  aria-label="View invite F7RA"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: "none",
                    opacity: 1,
                  }}
                >
                  <div className="mx-2 flex-1">
                    <div className="relative mt-2 aspect-[3/4] w-full">
                    {member.ProfileImage?.url && (
                        <StrapiImage
                          className="abs olute inset-0 h-full w-full rounded-[16px] bg-[#000000] object-cover contrast-75"

                              src={member.ProfileImage.url}
                              alt={
                                member.ProfileImage?.alternativeText ||
                                member.FullName ||
                                "Profile Image"
                              }
                              width={400}
                              height={400}
                              // className="object-cover w-full h-full"
                            />
                      // <img
                      //   loading="lazy"
                      //   className="absolute inset-0 h-full w-full rounded-[16px] bg-[#000000] object-cover contrast-75"
                      //   alt="Invite background"
                      //   src={member.ProfileImage.url}
                      //      style={{
                      //     boxShadow: "rgba(0, 0, 0, 0.05) 0px 5px 6px 0px",
                      //     opacity: 1,
                      //   }}
                      // />
                          )}
                    </div>
                  </div>
                  <div className="mt-2 flex flex-shrink-0 items-center justify-between p-4 font-mono text-white">
                    <div className="text-xs">{member.FullName}</div>
                    <div className="text-xs text-gray-300 opacity-50">{member.JobTitle}</div>
                    {/* {member.LinkedInUrl && (
                        <div className="">
                          <SocialIcon
                            network="linkedin"
                            url={member.LinkedInUrl}
                            style={{ height: 33, width: 33 }}
                          />
                        </div>
                      )} */}
                  </div>
                </Link>
              </CometCard>
            {/* old fashion card code*/}

            {/* Profile Image */}
            {/* {member.ProfileImage?.url && (
              <Link href={`/team/${member.slug}`}>
                <div className="w-full aspect-square mb-4 cursor-pointer hover:opacity-80 transition">
                  <StrapiImage
                    src={member.ProfileImage.url}
                    alt={
                      member.ProfileImage?.alternativeText ||
                      member.FullName ||
                      "Profile Image"
                    }
                    width={400}
                    height={400}
                    className="object-cover w-full h-full"
                  />
                </div>
              </Link>
            )} */}
 
            {/* Name and Title */}
            {/* <h3 className="text-xl font-semibold">{member.FullName}</h3>
            <p className="text-gray-600">{member.JobTitle}</p> */}
 
            {/* LinkedIn */}
            {/* {member.LinkedInUrl && (
              <div className="flex justify-center mt-4">
                <SocialIcon
                  network="linkedin"
                  url={member.LinkedInUrl}
                  style={{ height: 33, width: 33 }}
                />
              </div>
            )} */}
          </div>
        ))}
      </div>
 
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-10 gap-4 items-center">
          <button
            onClick={() => setCurrentPage2((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage2 === 1}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
 
          {/* Page Numbers (optional) */}
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage2(i + 1)}
              className={`px-3 py-1 rounded ${
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
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </section>
    
    <NewCategoryFilter categories={categoryList} />
    
        <NewContentList
      headline="Recent Insights"
      path="/api/articles"
      component={BlogCard}
      featured
      showSearch
      category={category}
      query={query}
      showPagination
    />
    

    </div>
  );
}
 
 
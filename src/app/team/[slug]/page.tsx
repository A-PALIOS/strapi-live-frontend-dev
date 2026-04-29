import { notFound } from "next/navigation";
import { StrapiImage } from "@/components/StrapiImage";
import { SocialIcon } from "react-social-icons";
import { fetchTeamMember, getCategories } from "@/data/loaders";
import { ContentList } from "@/components/ContentList";
import { BlogCard } from "@/components/BlogCard";
import Link from "next/link";
import { TeamMemberSecondaryMenuBlock } from "@/components/blocks/TeamMemberSecondaryMenuBlock";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page: string; query: string; category: string }>;
}

export default async function MemberPage({ params, searchParams }: PageProps) {
  const { page, query, category } = await searchParams;
  await getCategories();
  const member = await fetchTeamMember((await params).slug);
  if (!member) return notFound();

  const secondaryMenus = member.secondary_menus ?? [];
  const menuItems = secondaryMenus[0]?.items ?? [];

  const globalMenu = secondaryMenus[1] ?? null;

  const firstName = member.FullName.split(" ")[0];

  const darken = false;

  return (
    <div>
      <div className="min-h-screen bg-white text-gray-800">
        {/* <div className="relative bg-[#37393c] text-white px-6 py-16 overflow-hidden">
          <svg
            className="absolute bottom-0 left-0 w-full h-40 pointer-events-none"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2196f3" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#2196f3" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <path
              fill="url(#waveGradient)"
              d="M0,288L60,266.7C120,245,240,203,360,192C480,181,600,203,720,200.3C840,190,960,224,1080,208C1200,192,1320,160,1380,144L1440,128V320H1380C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320H0Z"
            />
          </svg>

          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center sm:items-start gap-8 relative z-10 pt-10">
            {member.CoverImage?.url && (
              <div className="w-[400px] h-[600px] overflow-hidden">
                <StrapiImage
                  src={member.CoverImage.url}
                  alt={member.CoverImage.alternativeText || member.FullName}
                  width={400}
                  height={400}
                  className="object-cover w-full h-full"
                />
              </div>
            )}

            <div className="flex-1 pt-4 sm:pt-12">
              <h1 className="text-4xl sm:text-5xl font-bold text-[#2196f3]">
                {member.FullName}
              </h1>
              <p className="text-lg italic mt-2 text-gray-200">{member.JobTitle}</p>
            </div>
          </div>
        </div> */}
        <div className="relative bg-team-member text-white px-6 py-16 overflow-hidden" data-header="dark">
    
    {member.CoverImage?.url && (
      <div className="absolute bottom-0 sm:left-10 md:left-40 lg:left-60 xl:left-70 z-0 w-[400px] h-[600px] overflow-hidden">
        <StrapiImage
          src={member.CoverImage.url}
          alt={member.CoverImage.alternativeText || member.FullName}
          width={400}
          height={600}
          className="object-cover w-full h-full"
        />
      </div>
    )}

    <svg
      className="absolute bottom-0 left-0 w-full h-40 pointer-events-none z-10"
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
    <defs>
  <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" stopColor="#001A2C" stopOpacity="1" />
    <stop offset="60%" stopColor="#005692" stopOpacity="1" />
  </linearGradient>
</defs>
      <path
        fill="url(#waveGradient)"
        d="M0,288L60,266.7C120,245,240,203,360,192C480,181,600,203,720,200.3C840,190,960,224,1080,208C1200,192,1320,160,1380,144L1440,128V320H1380C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320H0Z"
      />
    </svg>

    <div className="relative z-20  mx-auto flex flex-col-reverse items-center md:items-center xl:items-center md:flex-row md:items-start gap-8 pt-10">
      <div className="w-[300px] h-[500px] sm:w-[400px] sm:h-[500px] md:w-[400px] md:h-[500px] lg:w-[500px] lg:h-[500px] xl:w-[700px] xl:h-[500px]" />

      
      <div className="flex-1 pt-4 sm:pt-12">
        <h1 className="text-4xl sm:text-5xl font-bold font-agenda-medium text-[#2196f3] xl:text-[64px] xl:leading-[72px] text-[#A1CFF3]">
          {member.FullName}
        </h1>
        <p className="text-lg  mt-2 font-agenda-light text-gray-200 leading-[40px] xl:text-[32px]">{member.JobTitle}</p>
      </div>
    </div>
  </div>

  <TeamMemberSecondaryMenuBlock items={menuItems} global={globalMenu} />

        <div id="about" className="w-full px-6 md:px-10 lg:px-16 xl:px-20 py-16 md:py-20 scroll-mt-40">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-6">
            <h2 className="text-4xl font-agenda-medium text-[#242A2E] xl:text-[56px] xl:leading-[62px]">
              About {firstName}
            </h2>

            <div className="flex flex-col items-start sm:items-end gap-3">
              {/* <Link
                href="/contact"
                className="bg-gradient-to-r from-blue-500 to-blue-300 text-white px-5 py-2 rounded-md font-medium hover:from-blue-600 hover:to-blue-400 transition text-sm"
              >
                Get in Touch →
              </Link> */}

              <div className="flex items-center gap-2">
                {/* <span className="text-gray-700 text-sm">Social:</span> */}
                {member.LinkedInUrl && (
                <Link
                  href={member.LinkedInUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center font-agenda-regular gap-3 border border-[#dcdcdc] rounded-md px-6 py-3 text-base text-[#1e1e1e] hover:bg-gray-100 transition"
                >
                  <span>Get in Touch</span>

                  <span className="flex items-center justify-center w-8 h-8 bg-[#FB7B1E] text-white text-md font-bold rounded-sm">
                    in
                  </span>
                </Link>
              )}
              </div>
            </div>
          </div>

          {member.Bio && (
            <p className="md:w-[50%] lg:w-[50%] font-agenda-regular text-zinc-800/50 text-[24px] leading-[32px] whitespace-pre-line mb-10">
              {member.Bio}
            </p>
          )}
        </div>
      

      <div id="insights" className="scroll-mt-40">
        <ContentList
          headline="Recent Insights"
          path="/api/articles"
          component={BlogCard}
          featured
          showSearch
          category={category}
          query={query}
          showPagination
          page={page}
        />
      </div>
      </div>
    </div>
  );
}
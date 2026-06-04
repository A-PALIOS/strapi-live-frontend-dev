import { headers } from "next/headers";
import { ArticleProps } from "@/types";
import { getContent } from "@/data/loaders";
import { PaginationComponent } from "@/components/PaginationComponent";
import { Search } from "@/components/Search";

interface ContentListProps {
  headline: string;
  query?: string;
  path: string;
  featured?: boolean;
  sector?: string;
  topic?: string;
  component: React.ComponentType<ArticleProps & { basePath: string }>;
  headlineAlignment?: "center" | "right" | "left";
  showSearch?: boolean;
  page?: string;
  showPagination?: boolean;
  layout?: "grid" | "vertical";
  pageSize?: number;
}

async function loader(
  path: string,
  featured?: boolean,
  query?: string,
  page?: string,
  sector?: string,
  topic?: string,
  pageSize?: number
) {
  const { data, meta } = await getContent(
    path,
    featured,
    query,
    page,
    sector,
    topic,
    pageSize
  );

  return {
    articles: (data as ArticleProps[]) || [],
    pageCount: meta?.pagination?.pageCount || 1,
  };
}

function isPhoneOrTablet(userAgent: string) {
  return /Mobile|Android|iPhone|iPad|iPod|Tablet/i.test(userAgent);
}

export async function ContentList({
  headline,
  path,
  featured,
  sector,
  topic,
  component,
  headlineAlignment = "left",
  showSearch,
  query,
  page,
  showPagination,
  layout = "grid",
  pageSize,
}: Readonly<ContentListProps>) {
  const headersList = await headers();
  const userAgent = headersList.get("user-agent") || "";

  const phoneOrTablet = isPhoneOrTablet(userAgent);

  // Phones + tablets: 1 article per page
  // Desktop: use the normal pageSize
  const effectivePageSize = phoneOrTablet ? 1 : pageSize;

  const { articles, pageCount } = await loader(
    path,
    featured,
    query,
    page,
    sector,
    topic,
    effectivePageSize
  );

  const Component = component;

  const alignmentClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[headlineAlignment];

  return (
    <section className="w-full py-10">
      <div className="px-6 md:px-10 lg:px-16 xl:px-20">
        {/* Mobile + Tablet row */}
        <div className="lg:hidden">
        <div className="mb-6 flex items-end justify-between gap-4 py-5 tracking-[-1.2px]">
          {headline && (
            <h3
              className={`text-[22px] sm:text-[24px] font-bold ${alignmentClass} font-agenda-medium`}
            >
              {headline}
            </h3>
          )}

          {showPagination && <PaginationComponent pageCount={pageCount} />}
          <div
    className="mt-16 border-t border-[#dedede] -mx-6 md:-mx-10"
    style={{ borderColor: "#626262" }}
  />
        </div>
        </div>

        <div className="mb-8 hidden items-baseline justify-between gap-4 lg:flex">
  {headline ? (
    <h3
      className={`text-2xl font-bold sm:text-3xl ${alignmentClass} font-agenda-medium`}
    >
      {headline}
    </h3>
  ) : (
    <div />
  )}

  <div className="flex translate-y-0 items-center gap-4">
    {/* {showSearch && <Search />} */}
    {showPagination && <PaginationComponent pageCount={pageCount} />}
  </div>
</div>
      </div>

      <div
        className={
          layout === "grid"
            ? "grid grid-cols-1 gap-8 px-6 md:px-10 lg:grid-cols-4 lg:px-16 xl:px-20"
            : "flex flex-col gap-6"
        }
      >
        {articles.map((article) => (
          <Component key={article.documentId} {...article} basePath={path} />
        ))}
      </div>
    </section>
  );
}
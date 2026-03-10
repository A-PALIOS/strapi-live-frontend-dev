import { ArticleProps } from "@/types";
import { getContent } from "@/data/loaders";
import { PaginationComponent} from "@/components/PaginationComponent"
import { Search } from "@/components/Search";

interface ContentListProps {
  headline: string;
  query?: string;
  path: string;
  featured?: boolean;
  category?: string; // ✅ NEW
  component: React.ComponentType<ArticleProps & { basePath: string }>;
  headlineAlignment?: "center" | "right" | "left";
  showSearch?:boolean;
  page?:string;
  showPagination?:boolean;
  layout?:"grid" | "vertical"
}

async function loader(path: string ,featured?:boolean,query?:string, page?:string,  category?: string) {
  const { data, meta } = await getContent(path,featured,query ,page,category);
  return {
    articles: (data as ArticleProps[]) || [],
    pageCount:meta?.pagination?.pageCount || 1,
  };
}

export async function ContentList({
  headline,
  path,
  featured,
  category,
  component,
  headlineAlignment = "left",
  showSearch,
  query,
  page,
  showPagination,
  layout = "grid", // <- default to grid layout
}: Readonly<ContentListProps>) {
  const { articles, pageCount } = await loader(path, featured, query, page,category);
  const Component = component;

  const alignmentClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[headlineAlignment];

  return (
    <section className="w-full py-10">
      <div className="px-6 md:px-10 lg:px-16 xl:px-20">
      <h3 className={`text-3xl font-bold mb-8 ${alignmentClass} font-agenda-medium`}>
        {headline || "Featured Articles"}
      </h3>

      {showSearch ? (
        <div className="flex justify-between items-end  mb-6">
          <Search />
          {showPagination && <PaginationComponent pageCount={pageCount} />}

        </div>)
      
      :(<div className="flex align-end justify-end mb-6">
      {showPagination && <PaginationComponent pageCount={pageCount} />}

      </div>)}
      

      </div>

      

      <div
        className={
          layout === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 md:px-10 lg:px-16 xl:px-20"
            : "flex flex-col gap-6"
        }
      >
        {articles.map((article) => (
          <Component key={article.documentId} {...article} basePath={path} />
        ))}
      </div>

      {/* {showPagination && <PaginationComponent pageCount={pageCount} />} */}
    </section>
  );
}


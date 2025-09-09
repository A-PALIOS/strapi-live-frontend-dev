"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArticleProps } from "@/types";
import { getContent2 } from "@/data/loaders";
import { PaginationComponent } from "@/components/PaginationComponent";
import { Search } from "@/components/Search";

interface ContentListProps2 {
  headline: string;
  query?: string;
  path: string;
  featured?: boolean;
  category?: string;
  component: React.ComponentType<ArticleProps & { basePath: string }>;
  headlineAlignment?: "center" | "right" | "left";
  showSearch?: boolean;
  showPagination?: boolean;
  layout?: "grid" | "vertical";
}

export function NewContentList({
  headline,
  path,
  featured,
  category,
  component,
  headlineAlignment = "left",
  showSearch,
  query,
  showPagination,
  layout = "grid",
}: Readonly<ContentListProps2>) {
  const [articles, setArticles] = useState<ArticleProps[]>([]);
  const [pageCount, setPageCount] = useState<number>(1);
  const Component = component;

  const searchParams = useSearchParams();
  const currentPage = searchParams.get("page") || "1"; // ✅ Read from URL
  const searchQuery = searchParams.get("query") || "";
  const categoryQuery = searchParams.get("category") || ""; // ✅ NEW

  useEffect(() => {
    async function loadData() {
      const { data, meta } = await getContent2(path, featured, searchQuery, currentPage,  categoryQuery);
      setArticles(data);
      setPageCount(meta?.pagination?.pageCount || 1);
    }
    loadData();
  }, [path, featured, searchQuery, currentPage, categoryQuery]); // ✅ react to page changes

  const alignmentClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[headlineAlignment];

  console.log("Articles",articles)
  console.log("Path", path)

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-10">
      <h3 className={`text-3xl font-bold mb-8 ${alignmentClass}`}>
        {headline || "Featured Articles"}
      </h3>

      {showSearch && (
        <div>
          <Search />
          <br />
        </div>
      )}

      <div
        className={
          layout === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            : "flex flex-col gap-6"
        }
      >
        {articles.map((article) => (
          <Component key={article.documentId} {...article} basePath={path} />
        ))}
      </div>

      {showPagination && <PaginationComponent pageCount={pageCount} />}
    </section>
  );
}

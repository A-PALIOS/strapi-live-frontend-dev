import { ArticleProps } from "@/types";
import { getContent } from "@/data/loaders";
import { ContentListView } from "@/components/ContentListView";

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
  excludeSlug?: string;
}

async function loader(
  path: string,
  featured?: boolean,
  query?: string,
  page?: string,
  sector?: string,
  topic?: string,
  pageSize?: number,
  excludeSlug?: string
) {
  const { data, meta } = await getContent(
    path,
    featured,
    query,
    page,
    sector,
    topic,
    pageSize,
    excludeSlug
  );

  return {
    articles: (data as ArticleProps[]) || [],
    pageCount: meta?.pagination?.pageCount || 1,
  };
}

export async function ContentList({
  headline,
  path,
  featured,
  sector,
  topic,
  headlineAlignment = "left",
  query,
  page,
  showPagination,
  layout = "grid",
  pageSize,
  excludeSlug,
}: Readonly<ContentListProps>) {
  const { articles, pageCount } = await loader(
    path,
    featured,
    query,
    page,
    sector,
    topic,
    pageSize,
    excludeSlug
  );

  return (
    <ContentListView
      headline={headline}
      headlineAlignment={headlineAlignment}
      layout={layout}
      showPagination={showPagination}
      queryContext={{ path, featured, sector, topic, pageSize, excludeSlug }}
      initialArticles={articles}
      initialPageCount={pageCount}
      defaultPage={page ?? "1"}
      defaultQuery={query ?? ""}
    />
  );
}

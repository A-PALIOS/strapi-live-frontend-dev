import { ContentList } from "@/components/ContentList";
import { BlogCard } from "@/components/BlogCard";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    query?: string;
    category?: string;
  }>;
}

export default async function ContentListBlock({ searchParams }: PageProps) {
  const { page, query, category } = await searchParams;

  return (
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
  );
}

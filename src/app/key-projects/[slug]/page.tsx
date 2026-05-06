import { notFound } from "next/navigation";
import { getKeyProjectBySlug } from "@/data/loaders";
import { BlockRenderer } from "@/components/BlockRenderer";
import { ContentList } from "@/components/ContentList";
import { BlogCard } from "@/components/BlogCard";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    page?: string;
    query?: string;
    category?: string;
  }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page, query, category } = await searchParams;

  const res = await getKeyProjectBySlug(slug);
  const project = res?.data?.[0];

  if (!project) return notFound();

  return (
    <>
    <main>
      <BlockRenderer
        blocks={project.blocks || []}
        secondaryMenus={project.secondary_menus || []}
        searchParams={searchParams}
      />

      
    </main>
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
      </>
  );
}
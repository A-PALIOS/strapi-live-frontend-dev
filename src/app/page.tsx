
// import { BlockRenderer } from "@/components/BlockRenderer";
// import { getHomePage } from "@/data/loaders";
// import { notFound } from "next/navigation";


// async function loader(){
//   const data =await getHomePage();
//   if (!data) notFound();
//   console.log(data);
//   return {...data.data};
// }


// export default async function HomeRoute(){

//   const data = await loader();
//   const blocks = data?.blocks || [];
//   console.log(data);


//   return <BlockRenderer blocks={blocks} />;


// }







import { BlockRenderer } from "@/components/BlockRenderer";
import { getHomePage } from "@/data/loaders";
import { notFound } from "next/navigation";
import { ContentList } from "@/components/ContentList";
import { BlogCard } from "@/components/BlogCard";
 
async function loader() {
  const data = await getHomePage();
  if (!data) notFound();
  return { ...data.data };
}
 
interface PageProps {
  searchParams: Promise<{ page?: string; query?: string; category?: string }>;
}
 
export default async function HomeRoute({ searchParams }: PageProps) {
  const data = await loader();
  const { page, query, category } = await searchParams;
  const blocks = data?.blocks || [];
 
  const isHeader = (block: any) =>
    block.__component === "blocks.hero-section-main";
 
  const headerBlocks = blocks.filter(isHeader);
  const contentBlocks = blocks.filter((block: any) => !isHeader(block));
 
  return (
    <div>
      <BlockRenderer blocks={headerBlocks} />
      <ContentList
        headline="INSIGHTS THAT MATTER"
        path="/api/articles"
        component={BlogCard}
        showSearch
        showPagination
        page={page}
        query={query}
        category={category}
      />
      <BlockRenderer blocks={contentBlocks} />
    </div>
  );
}
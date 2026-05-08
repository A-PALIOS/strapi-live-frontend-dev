import { getArticleOfTheDay,getPageBySlug,getCategories,getTopics } from "@/data/loaders";
import { FeaturedArticle } from "@/components/blocks/FeaturedArticle";

import { notFound } from "next/navigation";
// import { BlockRenderer } from "@/components/BlockRenderer";
import { ContentList} from "@/components/ContentList"
import { BlogCard } from "@/components/BlogCard";
import CategoryFilter from "@/components/CategoryFilter";

// async function loader(slug: string) {
//   const { data } = await getPageBySlug(slug);
//   if (data.length === 0) notFound();
//   return { blocks: data[0]?.blocks };
// }

interface PageProps {
  searchParams: Promise<{ page?: string; query?: string; category?: string; topic?: string }>
}



export default async function BlogRoute({ searchParams }: PageProps) {
  const { page, query, category, topic } = await searchParams;
  const [featured, categoryList, topicList] = await Promise.all([
    getArticleOfTheDay(),
    getCategories(),
    getTopics(),
  ]);
  return <div>
    
    {/* <BlockRenderer blocks={blocks} /> */}
    


      {featured && (
        <FeaturedArticle
  id={featured.id}
  title={featured.title}
  excerpt={featured.description}
  image={featured.image}
    link={{ id:featured.id,href: `/insights/${featured.slug}`,text: "Read more" ,isExternal:false}}  
    author={{
    name: featured.author,
    imageAuthor: featured.imageAuthor,
  }}
  publishedAt={featured.publishedAt}
/>
      )}

      <section className="w-full px-6 md:px-10 lg:px-16 xl:px-20">
  <div className="space-y-2">
    <h2 className="text-2xl sm:text-3xl font-light text-gray-900">
      <span className="italic font-semibold text-[#1E9BFB]">Interested</span>
      <span className="text-[#1E9BFB]">?</span> <span className="font-normal">Read more blog</span>
    </h2>
    <p className="text-gray-500 max-w-xl text-sm">
      Lorem ipsum dolor sit amet consectetur. Viverra velit sem pellentesque arcu vitae. 
      Ultricies mattis felis facilisis ultricies ut
    </p>
  </div>
</section>

  {/* Category filters */}
      <CategoryFilter categories={categoryList} topics={topicList} />

    {/* <ContentList
  headline="Check out our latest  + +articles"
  path="/api/articles"
  component={BlogCard}
  featured
  showSearch
  category={category}
  query={query}
  showPagination
  page={page}
/> */}
<div>
    <ContentList
      headline="Check out our latest articles"
      path="/api/articles"
      component={BlogCard}
      featured
      showSearch
      category={category}
      topic={topic}
      query={query}
      showPagination={false}
      page={page}
      layout="grid"
      pageSize={16}
    />
</div>

  </div>;
}
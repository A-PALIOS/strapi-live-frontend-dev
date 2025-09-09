import { getArticleOfTheDay,getPageBySlug,getCategories } from "@/data/loaders";
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
  searchParams: Promise <{ page?:string; query?:string,category?: string}>
}



export default async function BlogRoute({ searchParams }: PageProps) {
//   const slug = (await params).slug;
  const {page,query,category} =await searchParams;
  // const { blocks } = await loader("blog");
  const featured = await getArticleOfTheDay();
 const categoryList = await getCategories();
  {console.log(featured)}
  {console.log("here are cat",categoryList)}
  return <div>
    
    {/* <BlockRenderer blocks={blocks} /> */}


      {featured && (
        <FeaturedArticle
  id={featured.id}
  title={featured.title}
  excerpt={featured.description}
  image={featured.image}
    link={{ id:featured.id,href: `/blog/${featured.slug}`,text: "Read more" ,isExternal:false}}  
    author={{
    name: featured.author,
    imageAuthor: featured.imageAuthor,
  }}
  publishedAt={featured.publishedAt}
/>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-8" style={{paddingTop:"124px"}}>
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
      <CategoryFilter categories={categoryList} />

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
<ContentList
  headline="Check out our latest articles"
  path="/api/articles"
  component={BlogCard}
  featured
  showSearch
  category={category}
  query={query}
  showPagination={false}   // pagination generally not needed for carousels
  page={page}
  layout="grid"        // ⬅️ enable carousel mode
/>

  </div>;
}
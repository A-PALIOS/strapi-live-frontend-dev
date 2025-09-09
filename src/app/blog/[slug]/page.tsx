import type { ArticleProps, Block } from "@/types";
import { notFound } from "next/navigation";
import { formatDate } from "@/utils/format-date";
import { getContentBySlug } from "@/data/loaders";
// import { HeroSection } from "@/components/blocks/HeroSection";
import { BlockRenderer } from "@/components/BlockRenderer";
import { Card, type CardProps } from "@/components/Card";
import { ContentList } from "@/components/ContentList";
import { ArticleIntroSection } from "@/components/blocks/ArticleIntroSection";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function loader(slug: string) {
  const { data } = await getContentBySlug(slug, "/api/articles");
  const article = data[0];
  if (!article) throw notFound();
  return { article: article as ArticleProps, blocks: article?.blocks };
}

interface ArticleOverviewProps {
  headline: string;
  description: string;
}

function ArticleOverview({
  headline,
  description,
}: Readonly<ArticleOverviewProps>) {
  return (
    <div className="max-w-3xl mx-auto my-12 px-4">
      <h1 className="text-3xl font-semibold mb-4">{headline}</h1>
      <p className="text-gray-700 leading-relaxed">{description}</p>
    </div>
  );
}
interface PageProps {
  searchParams: Promise <{ page?:string; query?:string}>
}

const BlogCard = (props: Readonly<CardProps>) => <Card {...props} basePath="blog" />;

export default async function SingleBlogRoute({ params,searchParams }: PageProps) {
  const slug = (await params).slug;
  const { article, blocks } = await loader(slug);
  const { title, author, publishedAt, description, image,imageAuthor } = article;
  const {page} =await searchParams;

  return (
    <div>
      {/* Hero at the top */}
    <ArticleIntroSection
              title={title}
              description={description}
              image={image}
              author={author}
              imageAuthor={imageAuthor}
              publishedAt={formatDate(publishedAt)} 
              id={0} 
              documentId={""} 
              slug={""} 
              featured={false} 
              createdAt={""} 
              updatedAt={""}/>


      {/* Overview centered under hero */}
      {/* <ArticleOverview headline={title} description={description} /> */}

      {/* Content and Sidebar */}
      <div className="container mx-auto px-4 md:px-6 lg:px-12 mb-24">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Left - Main article blocks */}
          <div className="w-full lg:w-2/3">
            <BlockRenderer blocks={blocks} />
          </div>

          {/* Right - Related content list */}
          <div className="w-full lg:w-1/3 space-y-6">
            <ContentList
              headline="More from our blog"
              path="/api/articles"
              component={BlogCard}
              featured={true}
              showPagination
              layout="vertical"
               page={page}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

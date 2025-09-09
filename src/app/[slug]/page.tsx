import { getPageBySlug } from "@/data/loaders";
import { notFound } from "next/navigation";
import { BlockRenderer } from "@/components/BlockRenderer";

async function loader(slug: string) {
  const response = await getPageBySlug(slug);

  // Check if data exists and is an array
  if (!response || !response.data || !Array.isArray(response.data) || response.data.length === 0) {
    notFound(); // ✅ Safely redirect to 404
  }

  console.log("Fetched slug data:", response);


    const page = response.data[0]; // your API already returns flattened fields (no attributes)


  return { blocks: response.data[0]?.blocks,secondaryMenus: page?.secondary_menus ?? [], };
}


interface PageProps {
  params: Promise<{ slug: string }>
}


export default async function DynamicPageRoute({ params }: PageProps) {
  const slug = (await params).slug;
  const { blocks ,secondaryMenus } = await loader(slug);
  return <BlockRenderer blocks={blocks} secondaryMenus={secondaryMenus}/>;
}
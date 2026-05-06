import { getPageBySlug } from "@/data/loaders";
import { notFound } from "next/navigation";
import { BlockRenderer } from "@/components/BlockRenderer";

async function loader(slugSegments: string[]) {
  const response = await getPageBySlug(slugSegments);

  if (
    !response ||
    !response.data ||
    !Array.isArray(response.data) ||
    response.data.length === 0
  ) {
    notFound();
  }

  const page = response.data[0];

  return {
    blocks: page?.blocks ?? [],
    secondaryMenus: page?.secondary_menus ?? [],
  };
}

interface PageProps {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{
    page?: string;
    query?: string;
    category?: string;
  }>;
}

export default async function DynamicPageRoute({
  params,
  searchParams,
}: PageProps) {
  const slugSegments = (await params).slug;
  const { blocks, secondaryMenus } = await loader(slugSegments);

  return (
    <BlockRenderer
      blocks={blocks}
      secondaryMenus={secondaryMenus}
      searchParams={searchParams}
    />
  );
}
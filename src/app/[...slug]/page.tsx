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
    // Say WHICH of the two very different causes produced this 404:
    //  - "request failed"  -> Strapi rejected/failed the query (see the
    //                         [fetchAPI] line above for the reason)
    //  - "no matching page" -> the query was fine; Strapi has no Page with
    //                         this slug/parent combination (or it's unpublished)
    const reason =
      response && typeof response.status === "number" && !response.data
        ? `request failed (HTTP ${response.status})`
        : "no matching page in Strapi (wrong slug/parent, or not published)";
    console.error(
      `[page 404] /${slugSegments.join("/")} -> ${reason}`
    );
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
    sector?: string;
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
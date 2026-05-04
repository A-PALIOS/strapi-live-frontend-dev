import { notFound } from "next/navigation";
import { getKeyProjectBySlug } from "@/data/loaders";
import { BlockRenderer } from "@/components/BlockRenderer";

export default async function Page({ params }: { params: { slug: string } }) {
  const res = await getKeyProjectBySlug(params.slug);
  const project = res?.data?.[0];

  if (!project) return notFound();

  return (
    <main>
      <BlockRenderer
        blocks={project.blocks || []}
        secondaryMenus={project.secondary_menus || []}
      />
    </main>
  );
}
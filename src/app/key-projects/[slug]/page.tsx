import { notFound } from "next/navigation";
import { getKeyProjectBySlug } from "@/data/loaders";
import { StrapiImage } from "@/components/StrapiImage";

export default async function Page({ params }: { params: { slug: string } }) {
  const res = await getKeyProjectBySlug(params.slug);
  const project = res?.data?.[0];

  if (!project) return notFound();

  return (
    <main className="px-8 py-20">
      <h1 className="text-4xl font-semibold mb-6">
        {project.title}
      </h1>

      {project.image?.url && (
        <div className="relative w-full h-[420px] mb-10">
          <StrapiImage
            src={project.image.url}
            alt={project.image.alternativeText || project.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="mb-6 text-sm uppercase text-gray-500">
        {project.type_of_work?.name} • {project.sector?.name}
      </div>

      <p className="text-lg">
        {project.excerpt}
      </p>
    </main>
  );
}
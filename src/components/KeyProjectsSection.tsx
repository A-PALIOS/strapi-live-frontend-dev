"use client";

import { useMemo, useState } from "react";
import type { KeyProjectsBlockProps, KeyProject } from "@/types";
import { StrapiImage } from "./StrapiImage";

function FeaturedProject({ project }: { project: KeyProject }) {
    console.log("project", project)
  return (
    <a href={project.link || `/key-projects/${project.slug}`} className="block mb-20">
      {project.image?.url && (
        <div className="relative h-[420px] w-full overflow-hidden">
          <StrapiImage
            src={project.image.url}
            alt={project.image.alternativeText || project.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="mt-5">
        <p className="text-sm uppercase text-gray-500">
          {project.type_of_work?.name}
        </p>

        <h2 className="mt-2 text-2xl font-semibold uppercase">
          {project.title}
        </h2>
      </div>
    </a>
  );
}

function SmallProject({ project }: { project: KeyProject }) {
  return (
    <a href={project.link || `/key-projects/${project.slug}`} className="block">
      {project.image?.url && (
        <div className="relative h-[260px] w-full overflow-hidden">
          <StrapiImage
            src={project.image.url}
            alt={project.image.alternativeText || project.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="mt-4">
        <p className="text-xs uppercase text-gray-500">
          {project.type_of_work?.name}
        </p>

        <h3 className="mt-1 text-lg font-semibold uppercase">
          {project.title}
        </h3>
      </div>
    </a>
  );
}

export function KeyProjectsBlock({
  eyebrow,
  title,
  projects = [],
}: KeyProjectsBlockProps) {
  const [selectedType, setSelectedType] = useState("all");
  const [selectedSector, setSelectedSector] = useState("all");

  const typeOptions = useMemo(() => {
    return Array.from(
      new Set(projects.map((p) => p.type_of_work?.name).filter(Boolean))
    ) as string[];
  }, [projects]);

  const sectorOptions = useMemo(() => {
    return Array.from(
      new Set(projects.map((p) => p.sector?.name).filter(Boolean))
    ) as string[];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesType =
        selectedType === "all" || project.type_of_work?.name === selectedType;

      const matchesSector =
        selectedSector === "all" || project.sector?.name === selectedSector;

      return matchesType && matchesSector;
    });
  }, [projects, selectedType, selectedSector]);

  const featured = filteredProjects.filter((p) => p.priority === "featured");
  const others = filteredProjects.filter((p) => p.priority !== "featured");
  console.log("projects", projects)

  return (
    <section className="px-8 py-20">
      {(eyebrow || title) && (
        <div className="mb-12">
          {eyebrow && (
            <p className="mb-2 text-sm uppercase text-gray-500">{eyebrow}</p>
          )}
          {title && <h2 className="text-4xl font-semibold">{title}</h2>}
        </div>
      )}

      <div className="mb-12 flex gap-8 border-b border-gray-300 pb-6">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="bg-transparent text-sm uppercase text-gray-600 outline-none"
        >
          <option value="all">Type of Work</option>
          {typeOptions.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          value={selectedSector}
          onChange={(e) => setSelectedSector(e.target.value)}
          className="bg-transparent text-sm uppercase text-gray-600 outline-none"
        >
          <option value="all">Sector</option>
          {sectorOptions.map((sector) => (
            <option key={sector} value={sector}>
              {sector}
            </option>
          ))}
        </select>
      </div>

      {featured.map((project) => (
        <FeaturedProject key={project.id} project={project} />
      ))}

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        {others.map((project) => (
          <SmallProject key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
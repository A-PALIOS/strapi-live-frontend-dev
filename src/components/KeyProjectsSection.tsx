"use client";

import { useMemo, useState } from "react";
import type { KeyProjectsBlockProps, KeyProject } from "@/types";
import { StrapiImage } from "./StrapiImage";

function FeaturedProject({ project }: { project: KeyProject }) {
  return (
    <a href={project.link || `/key-projects/${project.slug}`} className="block mb-10 lg:mb-20">
      {project.image?.url && (
        <div className="relative h-[260px] sm:h-[340px] lg:h-[420px] w-full overflow-hidden">
          <StrapiImage
            src={project.image.url}
            alt={project.image.alternativeText || project.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="mt-5">
        <p className="text-xs uppercase tracking-widest text-gray-500">
          {project.type_of_work?.name}
        </p>

        <h2 className="mt-2 text-xl font-semibold uppercase tracking-wide">
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
        <div className="relative h-[260px] sm:h-[340px] lg:h-[500px] w-full overflow-hidden">
          <StrapiImage
            src={project.image.url}
            alt={project.image.alternativeText || project.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="mt-4">
        <p className="text-xs uppercase tracking-widest text-gray-500">
          {project.type_of_work?.name}
        </p>

        <h3 className="mt-1 text-base font-semibold uppercase tracking-wide">
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

  const renderList = useMemo(() => {
    type FeaturedItem = { type: "featured"; project: KeyProject };
    type PairItem = { type: "pair"; projects: KeyProject[]; rowIndex: number };
    const result: (FeaturedItem | PairItem)[] = [];
    let buffer: KeyProject[] = [];
    let rowIndex = 0;

    const flushBuffer = () => {
      for (let i = 0; i < buffer.length; i += 2) {
        result.push({ type: "pair", projects: buffer.slice(i, i + 2), rowIndex: rowIndex++ });
      }
      buffer = [];
    };

    for (const project of filteredProjects) {
      if (project.priority === "featured") {
        flushBuffer();
        result.push({ type: "featured", project });
      } else {
        buffer.push(project);
      }
    }
    flushBuffer();
    return result;
  }, [filteredProjects]);

  return (
    <section className="px-4 sm:px-8 py-12 lg:py-20">
      {(eyebrow || title) && (
        <div className="mb-12">
          {eyebrow && (
            <p className="mb-2 text-sm uppercase text-gray-500">{eyebrow}</p>
          )}
          {title && <h2 className="text-4xl font-semibold">{title}</h2>}
        </div>
      )}

      <div className="mb-12 flex items-center gap-8 lg:gap-16 border-b border-gray-300 pb-4 w-full overflow-hidden">
        <div className="relative flex items-center min-w-0 flex-shrink-0">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="appearance-none bg-transparent text-xs uppercase tracking-wider text-gray-600 outline-none cursor-pointer pr-5 max-w-[140px] sm:max-w-none truncate"
          >
            <option value="all">Type of Work</option>
            {typeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <svg className="pointer-events-none absolute right-0 h-3 w-3 text-gray-600 flex-shrink-0" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M1 1l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="relative flex items-center min-w-0 flex-shrink-0">
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="appearance-none bg-transparent text-xs uppercase tracking-wider text-gray-600 outline-none cursor-pointer pr-5 max-w-[120px] sm:max-w-none truncate"
          >
            <option value="all">Sector</option>
            {sectorOptions.map((sector) => (
              <option key={sector} value={sector}>
                {sector}
              </option>
            ))}
          </select>
          <svg className="pointer-events-none absolute right-0 h-3 w-3 text-gray-600 flex-shrink-0" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M1 1l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {renderList.map((item) =>
        item.type === "featured" ? (
          <FeaturedProject key={item.project.id} project={item.project} />
        ) : (
          <div
            key={item.projects[0].id}
            className={`grid grid-cols-1 gap-10 mb-10 lg:gap-0 lg:mb-12 ${item.rowIndex % 2 === 0 ? "lg:grid-cols-[3fr_2fr]" : "lg:grid-cols-[2fr_3fr]"}`}
          >
            {item.projects.map((project) => (
              <SmallProject key={project.id} project={project} />
            ))}
          </div>
        )
      )}
    </section>
  );
}
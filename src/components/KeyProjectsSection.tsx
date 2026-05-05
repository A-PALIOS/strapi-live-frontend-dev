"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import type { KeyProjectsBlockProps, KeyProject } from "@/types";
import { StrapiImage } from "./StrapiImage";
import Link from "next/link";

function FilterDropdown({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: string[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const label = value === "all" ? placeholder : value;

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 font-agenda-regular text-3xl uppercase text-neutral-400 outline-none cursor-pointer"
      >
        {label}
        <svg
          className={`h-4 w-4 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 10 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M1 1l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 z-50 bg-white border border-gray-200 shadow-lg min-w-[220px]">
          <button
            onClick={() => { onChange("all"); setOpen(false); }}
            className={`w-full text-left px-5 py-3 font-agenda-regular text-xl uppercase hover:bg-gray-50 transition-colors ${value === "all" ? "text-stone-800" : "text-neutral-400"}`}
          >
            {placeholder}
          </button>
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full text-left px-5 py-3 font-agenda-regular text-xl uppercase hover:bg-gray-50 transition-colors ${value === opt ? "text-stone-800" : "text-neutral-400"}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FeaturedProject({ project }: { project: KeyProject }) {
  return (
    <Link href={`/key-projects/${project.slug}`} className="block mb-10 lg:mb-20">
      {project.image?.url && (
        <div className="relative h-[70vh] w-full overflow-hidden">
          <StrapiImage
            src={project.image.url}
            alt={project.image.alternativeText || project.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="mt-5">
        <p className="font-agenda-regular text-3xl uppercase text-zinc-600">
          {project.type_of_work?.name}
        </p>

        <h2 className="mt-2 font-agenda-medium text-4xl uppercase leading-10 text-stone-800">
          {project.title}
        </h2>
      </div>
    </Link>
  );
}

function SmallProject({ project }: { project: KeyProject }) {
  return (
    <Link href={`/key-projects/${project.slug}`} className="block">
      {project.image?.url && (
        <div className="relative h-[75vh] w-full overflow-hidden">
          <StrapiImage
            src={project.image.url}
            alt={project.image.alternativeText || project.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="mt-4">
        <p className="font-agenda-regular text-3xl uppercase text-zinc-600">
          {project.type_of_work?.name}
        </p>

        <h3 className="mt-2 font-agenda-medium text-4xl uppercase leading-10 text-stone-800">
          {project.title}
        </h3>
      </div>
    </Link>
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
    <section className="w-full px-6 md:px-10 lg:px-16 xl:px-20 py-16 md:py-20">
      {(eyebrow || title) && (
        <div className="mb-12">
          {eyebrow && (
            <p className="mb-2 text-sm uppercase text-gray-500">{eyebrow}</p>
          )}
          {title && <h2 className="text-4xl font-semibold">{title}</h2>}
        </div>
      )}

      <div className="mb-12 flex items-center flex-col lg:flex-row gap-0 lg:gap-28 border-b border-gray-300 pb-8 w-full">
        <FilterDropdown
          value={selectedType}
          onChange={setSelectedType}
          placeholder="Type of Work"
          options={typeOptions}
        />
        <FilterDropdown
          value={selectedSector}
          onChange={setSelectedSector}
          placeholder="Sector"
          options={sectorOptions}
        />
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
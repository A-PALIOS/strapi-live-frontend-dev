"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";

interface Taxonomy {
  id: number;
  name: string;
}

interface Props {
  categories: Taxonomy[];
  topics: Taxonomy[];
}

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

export default function CategoryFilter({ categories, topics }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [selectedSector, setSelectedSector] = useState("all");

  useEffect(() => {
    setSelectedTopic(searchParams.get("topic") ?? "all");
    setSelectedSector(searchParams.get("category") ?? "all");
  }, [searchParams]);

  const handleChange = (key: "topic" | "category", value: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", "1");
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-full px-6 md:px-10 lg:px-16 xl:px-20 flex items-center gap-28 border-b border-gray-300 pb-8">
      <FilterDropdown
        value={selectedTopic}
        onChange={(v) => { setSelectedTopic(v); handleChange("topic", v); }}
        placeholder="By Topic"
        options={topics.map((t) => t.name)}
      />
      <FilterDropdown
        value={selectedSector}
        onChange={(v) => { setSelectedSector(v); handleChange("category", v); }}
        placeholder="By Sector"
        options={categories.map((c) => c.name)}
      />
    </div>
  );
}

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

interface Category {
  id: number;
  name: string;
}

interface Props {
  categories: Category[];
}

export default function CategoryFilter({ categories }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const current = searchParams.get("category");
    setSelected(current);
  }, [searchParams]);

  const handleFilter = (category: string | null) => {
    const params = new URLSearchParams(window.location.search);
     // ✅ Reset page on category change
    params.set("page", "1");

    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };


  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: Buttons */}
        <div className="flex flex-wrap gap-4 text-sm">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleFilter(cat.name)}
              className={`px-6 py-2 rounded-full border text-sm transition ${
                selected === cat.name
                  ? "border-sky-500 text-sky-500 font-medium"
                  : "border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Right: Dropdown */}
        <select
          onChange={(e) =>
            handleFilter(e.target.value === "all" ? null : e.target.value)
          }
          value={selected || "all"}
          className="px-4 py-2 border rounded-full text-sm text-gray-600"
        >
          <option value="all">Choose Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}

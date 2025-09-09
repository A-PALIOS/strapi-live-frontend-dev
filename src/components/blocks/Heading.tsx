import React from "react";
import type { HeadingProps } from "@/types";

export function Heading({ heading, linkId }: Readonly<HeadingProps>) {
  return (
    <h3
      id={linkId}
      className="text-2xl md:text-3xl font-bold text-gray-900 mb-6"
    >
      {heading}
    </h3>
  );
}
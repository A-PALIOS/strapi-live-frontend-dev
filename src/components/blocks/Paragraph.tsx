import React from "react";
import { ParagraphProps } from "@/types";
import ReactMarkdown from "react-markdown";

export function Paragraph({ content }: Readonly<ParagraphProps>) {
  return (
    <div className="prose max-w-none text-base leading-relaxed text-gray-800 my-6">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}

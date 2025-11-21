import React from "react";
import { ParagraphProps } from "@/types";
import ReactMarkdown from "react-markdown";

export function Paragraph({ content }: Readonly<ParagraphProps>) {
  console.log("Paragraph content:", content);
  return (
    <div className="prose max-w-none text-base leading-relaxed text-gray-800 my-6 article-body">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}

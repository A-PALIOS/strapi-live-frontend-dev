'use client';
import { AboutInfoProps } from "@/types";
import ReactMarkdown from "react-markdown";

export function AboutInfo({ title, content, heading }: Readonly<AboutInfoProps>) {
  const id = heading?.toLowerCase().replace(/\s+/g, "-") || "";

  return (
    <section
      id={id}
      className="scroll-mt-24 w-full py-16 px-6 md:px-12 lg:px-24"
    >

      <div className="w-full">

        <h2 className="text-3xl font-bold text-gray-900 font-agenda-medium mb-6">{title}</h2>
        <div className="text-[#242A2E]/50 leading-relaxed space-y-4 font-agenda-regular text-2xl max-w-2xl text-justify">
              <ReactMarkdown>{content}</ReactMarkdown>
            
        </div>
      </div>
    </section>
  );
}
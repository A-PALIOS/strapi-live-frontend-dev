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
        <h2 className="text-5xl font-bold text-gray-900 mb-6">{title}</h2>
        <div className="text-gray-700 leading-relaxed space-y-4">
              <ReactMarkdown>{content}</ReactMarkdown>
            
        </div>
      </div>
    </section>
  );
}

'use client';
import { MagicBentoProps } from "@/types";
import ReactMarkdown from "react-markdown";
import MagicBento from "../ui/MagicBento";

export function MagicBentoBlock({ title, content, heading }: Readonly<MagicBentoProps>) {
  const id = heading?.toLowerCase().replace(/\s+/g, "-") || "";

  return (
    <section
      id={id}
      className="scroll-mt-24 w-full py-16 px-6 md:px-12 lg:px-24 bg-black"
    >
      
        <MagicBento 
  textAutoHide={true}
  enableStars={true}
  enableSpotlight={true}
  enableBorderGlow={true}
  enableTilt={true}
  enableMagnetism={true}
  clickEffect={true}
  spotlightRadius={300}
  particleCount={140}
  glowColor="62, 143, 214"
/>
      {/* <div className="w-full">
        <h2 className="text-3xl font-bold text-gray-900 font-agenda-medium mb-6">{title}</h2>
        <div className="text-[#242A2E]/50 leading-relaxed space-y-4 font-agenda-regular text-2xl max-w-2xl text-justify">
              <ReactMarkdown>{content}</ReactMarkdown>
            
        </div>
      </div> */}
    </section>
  );
}
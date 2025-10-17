// 'use client';
// import { MissionProps } from "@/types";
// import ReactMarkdown from "react-markdown";
// import dynamic from "next/dynamic";

// const MissionValuesCircles = dynamic(() => import("../ui/MissionValuesCircles"), { ssr: false });


// export function Mission({ title, content, heading }: Readonly<MissionProps>) {
//   const id = heading?.toLowerCase().replace(/\s+/g, "-") || "";

//   return (
//     <section
//       id={id}
//       className="scroll-mt-24 w-full pt-10 px-6 md:px-12 lg:px-24"
//     >
//         <MissionValuesCircles
//       heading={title}
//       subheading="heading"
//       accent="#0b5da7"      // CMT deep blue (override if needed)
//       accentSoft="#e7f2fb"  // soft wash
//       dark="#0d1b2a"        // dark text
//       // values={...}        // optional: pass custom list; defaults to your six values
//     />

//       <div className="w-full">
//         <h2 className="text-3xl font-bold text-gray-900 font-agenda-medium mb-6">{title}</h2>
//         <div className="text-[#242A2E]/50 leading-relaxed space-y-4 font-agenda-regular text-2xl max-w-2xl text-justify">
//               <ReactMarkdown>{content}</ReactMarkdown>
            
//         </div>
//       </div>
//     </section>
//   );
// }


'use client';
import type { MissionProps } from "@/types";
import dynamic from "next/dynamic";

const MissionValuesCircles = dynamic(() => import("../ui/MissionValuesCircles"), { ssr: false });

// tiny helper: Strapi richtext may be HTML; the circles component expects plain text for subheading/body
function stripHtml(input?: string) {
  if (!input) return "";
  return input.replace(/<[^>]*>/g, "").trim();
}

export function Mission({
  title,
  content,
  heading,
  values = [],
}: Readonly<MissionProps>) {
  // build a clean anchor id
  const id = (heading || title || "mission").toLowerCase().replace(/\s+/g, "-");

  // adapt Strapi ValueItem[] (key/title/body) -> MissionValuesCircles values (id/title/body)
  const adaptedValues = values.map(v => ({
    id: v.key,                     // IMPORTANT: use key -> id (drives the icon mapping)
    title: v.title,
    body: stripHtml(v.body),       // keep hover text tidy
  }));

  return (
    <section id={id} className="scroll-mt-24 w-full pt-10 px-6 md:px-12 lg:px-24">
      <MissionValuesCircles
        heading={title}
        subheading={stripHtml(content)} // show a clean one-line subheading
        values={adaptedValues}
        accent="#0b5da7"      // CMT deep blue
        accentSoft="#e7f2fb"  // soft wash
        dark="#0d1b2a"        // dark text
      />
    </section>
  );
}

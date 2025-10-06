'use client';
import { WhatWeBelieveProps } from "@/types";
import ReactMarkdown from "react-markdown";
import WhatWeBelieveSection from "../ui/WhatWeBelieveSection";
// import {BeliefCard} from "../ui/WhatWeBelieveSection"
import React, { useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";



export function WhatWeBelieve({ title, content, heading ,items}: Readonly<WhatWeBelieveProps>) {
  const id = heading?.toLowerCase().replace(/\s+/g, "-") || "";

  return (
    <section
      id={id}
      className="scroll-mt-24 w-full px-6 md:px-12 lg:px-24"
    >
      

      <div className="w-full">
        {/* <h2 className="text-3xl font-bold text-gray-900 font-agenda-medium mb-6">{title}</h2> */}
        {/* <div className="text-[#242A2E]/50 leading-relaxed space-y-4 font-agenda-regular text-2xl max-w-2xl text-justify">
              <ReactMarkdown>{content}</ReactMarkdown>
            
        </div> */}
  {/* decorative grid / noise */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:28px_28px] opacity-[0.06]" />

      <div className="relative mx-auto  px-4 sm:px-6">
     

     <WhatWeBelieveSection title={title} content={content} heading={heading} items={items}/>
      </div>

      {/* halo accents */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(56,189,248,0.18),transparent)] blur-2xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-40 w-60 translate-x-1/4 translate-y-1/4 rounded-full bg-[radial-gradient(closest-side,rgba(30,155,251,0.12),transparent)] blur-2xl" />
      </div>
    </section>
  );
}
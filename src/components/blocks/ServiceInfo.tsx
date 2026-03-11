'use client';
import { ServiceInfoProps } from "@/types";
import ReactMarkdown from "react-markdown";
import ServicesShowcase from "../ui/ServicesShowcase";
import { motion} from "framer-motion";
import { CoverflowShowcaseDemo } from "../ui/CoverflowShowCaseDemo";
import { CoverflowShowcaseAppleTVDemo } from "../ui/CoverflowShocaseAppleTVDemo";
import CardSwap, { Card } from '../ui/CardSwap'
import { StrapiImage } from "../StrapiImage";
// import DashboardPageInteractiveMockup from "../ui/dashboard_page_interactive_mockup";
import Link from "next/link";



export function ServiceInfo({ title, content, heading }: Readonly<ServiceInfoProps>) {
  const id = heading?.toLowerCase().replace(/\s+/g, "-") || "";

  return (
    <section
      id={id}
      className="bg-[#071426] scroll-mt-24 w-full px-6 md:px-12 lg:px-24"
    >


      {/* <DashboardPageInteractiveMockup /> */}





      <div className="w-full">

            
{/* <CoverflowShowcaseDemo /> */}
{/* <CoverflowShowcaseAppleTVDemo/> */}
     <ServicesShowcase/>

      </div>

    </section>
  );
}
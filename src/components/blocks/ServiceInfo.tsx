'use client';
import { ServiceInfoProps } from "@/types";
import ReactMarkdown from "react-markdown";
import ServicesShowcase from "../ui/ServicesShowcase";
import { motion} from "framer-motion";

export function ServiceInfo({ title, content, heading }: Readonly<ServiceInfoProps>) {
  const id = heading?.toLowerCase().replace(/\s+/g, "-") || "";

  return (
    <section
      id={id}
      className="scroll-mt-24 w-full px-6 md:px-12 lg:px-24"
    >

      <div className="w-full">

              <div className="mx-auto mb-10 max-w-3xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-agenda-semibold tracking-tight text-black md:text-4xl"
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-[#242A2E]/50 leading-relaxed space-y-4 font-agenda-regular text-2xl"
        >
         {content}
        </motion.p>
</div>
     <ServicesShowcase/>

      </div>

    </section>
  );
}
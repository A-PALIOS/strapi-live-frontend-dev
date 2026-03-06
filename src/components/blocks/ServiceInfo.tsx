'use client';
import { ServiceInfoProps } from "@/types";
import ReactMarkdown from "react-markdown";
import ServicesShowcase from "../ui/ServicesShowcase";
import { motion} from "framer-motion";
import { CoverflowShowcaseDemo } from "../ui/CoverflowShowCaseDemo";
import { CoverflowShowcaseAppleTVDemo } from "../ui/CoverflowShocaseAppleTVDemo";
import CardSwap, { Card } from '../ui/CardSwap'
import { StrapiImage } from "../StrapiImage";
import Link from "next/link";
const cards = [
  {
    tag: "Smooth",
    image:
      "https://cdn.prod.website-files.com/63654bd86ca1f62de498214b/65296ea1aae72cb48335e0f9_1.jpg",
    alt: "Smooth digital experience",
  },
  {
    tag: "Customizable",
    image:
      "https://cdn.prod.website-files.com/63654bd86ca1f62de498214b/65296ea1aae72cb48335e0f9_1.jpg",
    alt: "Customizable digital experience",
  },
  {
    tag: "Reliable",
    image:
      "https://cdn.prod.website-files.com/63654bd86ca1f62de498214b/65296ea1aae72cb48335e0f9_1.jpg",
    alt: "Reliable digital experience",
  },
  {
    tag: "Interactive",
    image:
      "https://cdn.prod.website-files.com/63654bd86ca1f62de498214b/65296ea1aae72cb48335e0f9_1.jpg",
    alt: "Interactive digital experience",
  },
];


export function ServiceInfo({ title, content, heading }: Readonly<ServiceInfoProps>) {
  const id = heading?.toLowerCase().replace(/\s+/g, "-") || "";

  return (
    <section
      id={id}
      className="bg-black scroll-mt-24 w-full px-6 md:px-12 lg:px-24"
    >

   <section className="relative overflow-hidden bg-[#05010D] text-white">
      <div className="mx-auto grid min-h-[740px] max-w-[1440px] grid-cols-1 items-center gap-10 px-6 py-20 md:px-10 lg:grid-cols-2 lg:gap-6 lg:px-16 xl:px-24 2xl:px-32">
        <div className="relative z-auto max-w-[520px]">
          <p className="mb-4 text-sm uppercase tracking-[0.24em] text-white/45">
            Digital Experiences
          </p>

          <h2 className="max-w-[420px] text-[42px] font-semibold leading-[0.98] tracking-[-0.04em] text-white md:text-[56px]">
            Card stacks have never looked so good
          </h2>

          <p className="mt-6 max-w-[400px] text-[20px] leading-[1.45] text-white/55 md:text-[22px]">
            Just look at it go. Explore websites, products, and digital
            projects through an interactive stacked showcase.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/digital"
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:scale-[1.02] hover:bg-white/90"
            >
              View Websites
            </Link>

            <Link
              href="/contact"
              className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/10"
            >
              Learn More
            </Link>
          </div>
        </div>

        <div className="relative min-h-[580px] w-full">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(97,61,255,0.16),transparent_55%)]" />

          <div className="relative h-[580px] w-full">
            <CardSwap
              width={520}
              height={360}
              cardDistance={64}
verticalDistance={48}
              delay={6000}
              pauseOnHover={false}
              skewAmount={4}
              easing="elastic"
            >
              {cards.map((item, index) => (
              <Card
                    key={index}
                    customClass="shadow-[0_25px_80px_rgba(0,0,0,0.45)]"
                  >
                    <div className="relative h-full w-full bg-black">
                    <div className="absolute right-5 top-5 z-20 rounded-full border border-white/40 bg-[#120D1E]/90 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur-md">
                      {item.tag}
                    </div>

                    <img
                      src={item.image}
                      alt={item.alt}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
                  </div>
                </Card>
              ))}
            </CardSwap>
          </div>
        </div>
      </div>
    </section>




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
{/* <CoverflowShowcaseDemo /> */}
<CoverflowShowcaseAppleTVDemo/>
     <ServicesShowcase/>

      </div>
<div style={{ height: '600px', position: 'relative' }}>
  <CardSwap
    cardDistance={80}
    verticalDistance={70}
    delay={5000}
    pauseOnHover={false}
  >
    <Card>
      <h3>Card 1</h3>
      <p>Your content here</p>
         <img
                          src="https://cdn.prod.website-files.com/63654bd86ca1f62de498214b/65296ea1aae72cb48335e0f9_1.jpg"
                          alt="test"
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
    </Card>
    <Card>
      <h3>Card 2</h3>
      <p>Your content here</p>
         <img
                          src="https://cdn.prod.website-files.com/63654bd86ca1f62de498214b/65296ea1aae72cb48335e0f9_1.jpg"
                          alt="test"
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
    </Card>
    <Card>
      <h3>Card 3</h3>
      <p>Your content here</p>
      <img
                          src="https://cdn.prod.website-files.com/63654bd86ca1f62de498214b/65296ea1aae72cb48335e0f9_1.jpg"
                          alt="test"
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
      
    </Card>
  </CardSwap>
</div>
    </section>
  );
}
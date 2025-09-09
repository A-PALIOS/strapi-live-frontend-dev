// import { ImageProps } from "@/types";
import { StrapiImage } from "@/components/StrapiImage";
 import { AboutSectionProps } from "@/types";
// interface AboutSectionProps {
//   __component: "blocks.about-section";
//   id: number;
//   title: string;
//   description: string;
//   infographic: ImageProps;
// }
 
export function AboutSection({
  title,
  description,
  infographic,
}: Readonly<AboutSectionProps>) {
  return (
    <section className="w-full py-16 px-6 md:px-12 lg:px-24">
      <br />
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
        {/* Vertical Heading (rotated on desktop) */}
        <div className="flex-shrink-0">
          <h2 className="text-5xl font-bold text-gray-900 lg:transform lg:-rotate-90 ">
            {title}
          </h2>
        </div>
 
        {/* Paragraph content */}
        <div className="flex-1 text-gray-700 leading-relaxed space-y-4">
          {description.split("\n").map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      </div>
 
      {/* Infographic */}
      { infographic && infographic.url && (
      <div className="mt-12 w-full bg-gray-100 p-4 flex justify-center items-center min-h-[200px] rounded">
        <StrapiImage
          src={infographic.url}
          alt={infographic.alternativeText || "About infographic"}
          width={800}
          height={400}
          className="object-contain max-h-[300px] w-full"
        />
      </div>
    )}
    </section>
  );
}
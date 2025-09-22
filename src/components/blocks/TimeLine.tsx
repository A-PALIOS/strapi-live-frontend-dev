// import { TimeLineProps } from "@/types";
// import ReactMarkdown from "react-markdown";
// import FlickityTimeline, { TimelineItem } from "../ui/FlickityTimeline";

// // const items: TimelineItem[] = [
// //   { id: 2019, year: 2019, images: [{ src: "https://cdn.prod.website-files.com/67b320fe114d5e148783d276/683415aa9774c58886e13c8a_Yvo%20Tycho%20Founding%20Dapper.avif" }], caption: "Yvo and Tycho started Dapper Rhinos", position: "top" },
// //   { id: "2019b", images: [{ src: "https://cdn.prod.website-files.com/67b320fe114d5e148783d276/683416205c4268e87364373d_IMG_0266.avif" }, { src: "https://cdn.prod.website-files.com/67b320fe114d5e148783d276/6849a809429034496e402fa1_PHOTO-2019-10-15-13-55-56.avif" }], caption: "We hired our first 2 employees" },
// //   { id: 2020, year: 2020, images: [{ src: "https://cdn.prod.website-files.com/67b320fe114d5e148783d276/6834164226bc5e6e586d866d_First%20real%20office.avif" }], caption: "We moved in to our first office", position: "bottom" },
// //   // …add the rest
// // ];




// const items: TimelineItem[] = [
//   {
//     id: "2019-1",
//     year: 2019,
//     variant: "single",
//     images: [{ src: "https://cdn.prod.website-files.com/67b320fe114d5e148783d276/683415aa9774c58886e13c8a_Yvo%20Tycho%20Founding%20Dapper.avif", alt: "Yvo and Tycho started Dapper Rhinos" }],
//     caption: "Yvo and Tycho started<br/>Dapper Rhinos",
//   },
//   {
//     id: "2019-2",
//     variant: "double",
//     images: [
//       { src: "https://cdn.prod.website-files.com/67b320fe114d5e148783d276/683416205c4268e87364373d_IMG_0266.avif", alt: "Team trip" },
//       { src: "https://cdn.prod.website-files.com/67b320fe114d5e148783d276/6849a809429034496e402fa1_PHOTO-2019-10-15-13-55-56.avif", alt: "Casual office" },
//     ],
//     caption: "We hired our first<br/>2 employees",
//   },
//   {
//     id: "2020-1",
//     year: 2020,
//     variant: "single",
//     images: [{ src: "https://cdn.prod.website-files.com/67b320fe114d5e148783d276/6834164226bc5e6e586d866d_First%20real%20office.avif", alt: "We moved in to our first office" }],
//     caption: "We moved in to our first office",
//   },
//   {
//     id: "2021-1",
//     year: 2021,
//     variant: "tall",
//     images: [{ src: "https://cdn.prod.website-files.com/67b320fe114d5e148783d276/6834164226bc5e6e586d866d_First%20real%20office.avif", alt: "LinkedIn wall post" }],
//     caption: "Broke through the wall of our office to expand",
//   },
//    {
//     id: "2022-1",
//     year: 2022,
//     variant: "single",
//     images: [{ src: "https://cdn.prod.website-files.com/67b320fe114d5e148783d276/6834164226bc5e6e586d866d_First%20real%20office.avif", alt: "LinkedIn wall post" }],
//     caption: "This is how legends are made",
//   },
// ];
// export function TimeLine({ title, content, heading }: Readonly<TimeLineProps>) {
//   const id = heading?.toLowerCase().replace(/\s+/g, "-") || "";

//   return (
//     <FlickityTimeline
//       eyebrow={title}
//       title={<span className="font-ivypresto-thin">CMT Prooptiki is an independent management consulting firm, specializing in health & social care consulting</span>}
//       intro={<p>{content}</p>}
//       items={items}
//     />

//   );
// }



import { TimeLineProps } from "@/types";
import ReactMarkdown from "react-markdown";
import FlickityTimeline, { TimelineItem as UITimelineItem } from "../ui/FlickityTimeline";

// Make relative Strapi URLs absolute
const STRAPI_BASE = (process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337").replace(/\/$/, "");
const toAbs = (u?: string | null) => (u && u.startsWith("http") ? u : `${STRAPI_BASE}${u ?? ""}`);

// Your JSON shape: images is an array of files with { url, alternativeText }
type StrapiFlatImage = {
  id: number | string;
  url: string;
  alternativeText?: string | null;
};
type StrapiTimelineItemFlat = {
  id: number | string;
  year?: number | null;
  variant?: "single" | "double" | "tall" | null;
  caption?: string | null;
  images: StrapiFlatImage[]; // <— flat array (NOT .data)
};

function mapItemsFlat(items: StrapiTimelineItemFlat[]): UITimelineItem[] {
  return (items ?? [])
    .map((it, idx) => {
      const imgs = (it.images ?? [])
        .filter(Boolean)
        .map((img) => ({
          src: toAbs(img.url),
          alt: img.alternativeText || "",
        }));

      // infer/fix variant from image count if needed
      let variant: UITimelineItem["variant"] = it.variant ?? (imgs.length >= 2 ? "double" : "single");
      if (variant === "double" && imgs.length < 2) variant = imgs.length ? "single" : "single";

      return {
        id: it.id ?? idx,
        year: it.year ?? undefined,
        variant,
        caption: it.caption ?? undefined,
        images: imgs,
      };
    })
    // keep only slides that have at least one image
    .filter((it) => it.images.length > 0);
}

export function TimeLine({ title, content, heading, items }: Readonly<TimeLineProps>) {
  // items here is the raw Strapi block data; TypeScript-wise it's fine to cast to our flat shape
  const uiItems = mapItemsFlat((items as unknown as StrapiTimelineItemFlat[]) || []);

  return (
    <FlickityTimeline
    size="lg"
      eyebrow={title}
      title={
        <span className="font-ivypresto-thin">
          CMT Prooptiki is an independent management consulting firm, specializing in health &amp; social care consulting
        </span>
      }
      intro={<ReactMarkdown>{content || ""}</ReactMarkdown>}
      items={uiItems}
    />
  );
}

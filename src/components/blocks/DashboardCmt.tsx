import Link from "next/link";
import type { DashboardCmtProps } from "@/types";
import { StrapiImage } from "@/components/StrapiImage";

function isExternalUrl(url: string) {
  return /^https?:\/\//i.test(url);
}

export function DashboardCmt({ items }: Readonly<DashboardCmtProps>) {
  if (!items?.length) return null;

  return (
    <section className="relative overflow-hidden w-full border-b border-white/10 bg-[#030912] text-white">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute left-[8%] top-10 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute right-[10%] top-16 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
      </div>

      <div className="relative w-full px-6 md:px-10 lg:px-10 xl:px-23 py-16 md:py-20">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex items-center rounded-full border border-white bg-white/5 px-4 py-2 text-sm text-white font-agenda-regular backdrop-blur">
            Digital / Live Dashboards
          </div>
          <h2 className="max-w-3xl text-4xl font-agenda-medium leading-tight md:text-6xl">
            <span className="text-white">Take a look at our live dashboards</span>
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-blue-100/85 md:text-lg font-agenda-regular">
            Browse real dashboards we&apos;ve delivered for clients — click through any preview
            to open the live, interactive version.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => {
            const external = isExternalUrl(item.url);
            return (
              <Link
                key={item.id}
                href={item.url}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="group overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.04] transition hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/[0.06]"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-[#07142a]">
                  <StrapiImage
                    src={item.image.url}
                    alt={item.image.alternativeText || "Dashboard screenshot"}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 transition group-hover:opacity-100" />
                </div>
                <div className="flex items-center justify-between px-5 py-4">
                  <span className="text-sm font-agenda-medium text-white/80">
                    View Dashboard
                  </span>
                  <span className="text-white/35 font-agenda-medium transition group-hover:translate-x-1 group-hover:text-cyan-300">
                    →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

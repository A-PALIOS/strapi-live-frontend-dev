// components/IntegrationsSection.tsx
"use client";

const BASE = "https://n8niostorageaccount.blob.core.windows.net/n8nio-strapi-blobs-prod/assets";

// Simple Icons (simpleicons.org) brand glyphs, inlined so they render reliably
// and lightened for visibility on the dark marquee background.
const FIGMA_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F2F2F2"><path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.563 4.539zm-.024-7.51a3.023 3.023 0 0 0-3.019 3.019c0 1.665 1.365 3.019 3.044 3.019 1.705 0 3.093-1.376 3.093-3.068v-2.97H8.148zm7.704 0h-.098c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h.098c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.49-4.49 4.49zm-.097-7.509c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h.098c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-.098z"/></svg>`;
const CANVA_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F2F2F2"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zM6.962 7.68c.754 0 1.337.549 1.405 1.2.069.583-.171 1.097-.822 1.406-.343.171-.48.172-.549.069-.034-.069 0-.137.069-.206.617-.514.617-.926.548-1.508-.034-.378-.308-.618-.583-.618-1.2 0-2.914 2.674-2.674 4.629.103.754.549 1.646 1.509 1.646.308 0 .65-.103.96-.24.5-.264.799-.47 1.097-.8-.073-.885.704-2.046 1.851-2.046.515 0 .926.205.96.583.068.514-.377.582-.514.582s-.378-.034-.378-.17c-.034-.138.309-.07.275-.378-.035-.206-.24-.274-.446-.274-.72 0-1.131.994-1.029 1.611.035.275.172.549.447.549.205 0 .514-.31.617-.755.068-.308.343-.514.583-.514.102 0 .17.034.205.171v.138c-.034.137-.137.548-.102.651 0 .069.034.171.17.171.092 0 .436-.18.777-.459.117-.59.253-1.298.253-1.357.034-.24.137-.48.617-.48.103 0 .171.034.205.171v.138l-.136.617c.445-.583 1.097-.994 1.508-.994.172 0 .309.102.309.274 0 .103 0 .274-.069.446-.137.377-.309.96-.412 1.474 0 .137.035.274.207.274.171 0 .685-.206 1.096-.754l.007-.004c-.002-.068-.007-.134-.007-.202 0-.411.035-.754.104-.994.068-.274.411-.514.617-.514.103 0 .205.069.205.171 0 .035 0 .103-.034.137-.137.446-.24.857-.24 1.269 0 .24.034.582.102.788 0 .034.035.069.07.069.068 0 .548-.445.89-1.028-.308-.206-.48-.549-.48-.96 0-.72.446-1.097.858-1.097.343 0 .617.24.617.72 0 .308-.103.65-.274.96h.102a.77.77 0 0 0 .584-.24.293.293 0 0 1 .134-.117c.335-.425.83-.74 1.41-.74.48 0 .924.205.959.582.068.515-.378.618-.515.618l-.002-.002c-.138 0-.377-.035-.377-.172 0-.137.309-.068.274-.376-.034-.206-.24-.275-.446-.275-.686 0-1.13.891-1.028 1.611.034.275.171.583.445.583.206 0 .515-.308.652-.754.068-.274.343-.514.583-.514.103 0 .17.034.205.171 0 .069 0 .206-.137.652-.17.308-.171.48-.137.617.034.274.171.48.309.583.034.034.068.102.068.102 0 .069-.034.138-.137.138-.034 0-.068 0-.103-.035-.514-.205-.72-.548-.789-.891-.205.24-.445.377-.72.377-.445 0-.89-.411-.96-.926a1.609 1.609 0 0 1 .075-.649c-.203.13-.422.203-.623.203h-.17c-.447.652-.927 1.098-1.27 1.303a.896.896 0 0 1-.377.104c-.068 0-.171-.035-.205-.104-.095-.152-.156-.392-.193-.667-.481.527-1.145.805-1.453.805-.343 0-.548-.206-.582-.55v-.376c.102-.754.377-1.2.377-1.337a.074.074 0 0 0-.069-.07c-.24 0-1.028.824-1.166 1.373l-.103.445c-.068.309-.377.515-.582.515-.103 0-.172-.035-.206-.172v-.137l.046-.233c-.435.31-.87.508-1.075.508-.308 0-.48-.172-.514-.412-.206.274-.445.412-.754.412-.352 0-.696-.24-.862-.593-.244.275-.523.553-.852.764-.48.309-1.028.549-1.68.549-.582 0-1.097-.309-1.371-.583-.412-.377-.651-.96-.686-1.509-.205-1.68.823-3.84 2.4-4.8.378-.205.755-.343 1.132-.343zm9.77 3.291c-.104 0-.172.172-.172.343 0 .274.137.583.309.755a1.74 1.74 0 0 0 .102-.583c0-.343-.137-.515-.24-.515z"/></svg>`;
const svgToDataUri = (svg: string) => `data:image/svg+xml,${encodeURIComponent(svg)}`;

// ─── Icon map: all 26 integrations identified ────────────────────────────────
const ICONS = {
  postgresql:      `${BASE}/integration_1_1810b997f4.svg`,   // #1  PostgreSQL
  n8nTools:        `${BASE}/integration_2_113344eb79.svg`,   // #2  n8n Tools (screwdriver & wrench)
  googleCalendar:  `${BASE}/integration_3_45e95d4ff9.svg`,   // #3  Google Calendar
  microsoftOutlook:`${BASE}/integration_4_cf3a9415a1.svg`,   // #4  Microsoft Outlook
  microsoftAzure:  `${BASE}/integration_7_305f55ecdd.svg`,   // #7  Microsoft Azure / OneDrive
  powerBi:         `${BASE}/integration_8_00794ba736.svg`,   // #8  Microsoft Power BI
  figma:           svgToDataUri(FIGMA_SVG),                  // Figma (Simple Icons)
  slack:           `${BASE}/integration_16_9c0f7c6e53.svg`,  // #16 Slack
  microsoftExcel:  `${BASE}/integration_20_2f391c2e94.svg`,  // #20 Microsoft Excel
  canva:           svgToDataUri(CANVA_SVG),                  // Canva (Simple Icons)
  mysql:           `${BASE}/integration_23_95d19b4191.svg`,  // #23 MySQL
  openai:          `${BASE}/integration_24_a8a7208838.svg`,  // #24 OpenAI
  kafka:           `${BASE}/integration_25_f3164a2781.svg`,  // #25 Apache Kafka
  n8nAutomation:   `${BASE}/integration_26_e4d668a67e.svg`,  // #26 n8n (snowflake/automation)
};

// ─── Row definitions ──────────────────────────────────────────────────────────
const row1 = [
  { name: "OpenAI",            src: ICONS.openai },
  { name: "MySQL",             src: ICONS.mysql },
  { name: "n8n Automation",    src: ICONS.n8nAutomation },
  { name: "Apache Kafka",      src: ICONS.kafka },
  { name: "Microsoft Power BI",src: ICONS.powerBi },
  { name: "Microsoft Outlook", src: ICONS.microsoftOutlook },
  { name: "n8n Tools",         src: ICONS.n8nTools },
  { name: "Microsoft Azure",   src: ICONS.microsoftAzure },
  { name: "Figma",             src: ICONS.figma },
];

const row2 = [
  { name: "Microsoft Excel",   src: ICONS.microsoftExcel },
  { name: "Google Calendar",   src: ICONS.googleCalendar },
  { name: "Slack",             src: ICONS.slack },
  { name: "PostgreSQL",        src: ICONS.postgresql },
  { name: "MySQL",             src: ICONS.mysql },
  { name: "Canva",             src: ICONS.canva },
];

// ─── MarqueeRow component ─────────────────────────────────────────────────────
function MarqueeRow({
  items,
  reverse = false,
}: {
  items: { name: string; src: string }[];
  reverse?: boolean;
}) {
  const doubled = [...items, ...items];

  return (
    <div className="relative overflow-hidden py-2">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-[#0d0d1a] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-[#0d0d1a] to-transparent" />
      <div
        className="flex gap-3"
        style={{
          width: "max-content",
          animation: `${reverse ? "marquee-reverse" : "marquee-forward"} 40s linear infinite`,
        }}
      >
        {doubled.map((item, i) => (
          <div
            key={`${item.name}-${i}`}
            title={item.name}
            className="flex size-14 flex-shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/[0.03] transition-transform duration-200 hover:scale-110 hover:border-white/30"
          >
            <img
              src={item.src}
              alt={item.name}
              width={36}
              height={36}
              className="object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────
export default function IntegrationsSection() {
  return (
    <section className="overflow-hidden bg-[#030912] py-24">
      <div className="mx-auto mb-14 max-w-3xl px-4 text-center">
        <h2 className="text-5xl font-agenda-medium leading-[0.95] tracking-[-0.055em] text-white md:text-6xl">
          Practical technology,{" "}
          <br className="hidden md:block" />
          built around your needs
        </h2>
        <p className="mt-4 font-agenda-regular text-lg text-gray-400">
          Technologies we work with{" "}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <MarqueeRow items={row1} reverse={false} />
        <MarqueeRow items={row2} reverse={true} />
      </div>
      <div className="mx-auto mt-12 max-w-3xl px-4 text-center">
<p className="mt-4 font-agenda-regular text-lg text-gray-400">
          Always the right{" "}
          <span className="text-[#06b6d4]">tool</span> for the right problem.
        </p>
        </div>
      {/* <div className="mt-12 flex justify-center">
        
        <a
          href="#"
          className="rounded-full px-8 py-3 text-base font-semibold text-white transition-all duration-200 hover:scale-105 hover:opacity-90"
          style={{
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)",
            boxShadow: "0 0 30px rgba(99, 102, 241, 0.35)",
          }}
        >
          Browse all integrations
        </a>
      </div> */}

      <style>{`
        @keyframes marquee-forward {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}
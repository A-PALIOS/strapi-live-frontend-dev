// components/IntegrationsSection.tsx
"use client";

const BASE = "https://n8niostorageaccount.blob.core.windows.net/n8nio-strapi-blobs-prod/assets";

// ─── Icon map: all 26 integrations identified ────────────────────────────────
const ICONS = {
  postgresql:      `${BASE}/integration_1_1810b997f4.svg`,   // #1  PostgreSQL
  n8nTools:        `${BASE}/integration_2_113344eb79.svg`,   // #2  n8n Tools (screwdriver & wrench)
  googleCalendar:  `${BASE}/integration_3_45e95d4ff9.svg`,   // #3  Google Calendar
  microsoftOutlook:`${BASE}/integration_4_cf3a9415a1.svg`,   // #4  Microsoft Outlook
  mailchimp:       `${BASE}/integration_5_e0116048f9.svg`,   // #5  Mailchimp
  algolia:         `${BASE}/integration_6_3178149e74.svg`,   // #6  Algolia
  microsoftAzure:  `${BASE}/integration_7_305f55ecdd.svg`,   // #7  Microsoft Azure / OneDrive
  powerBi:         `${BASE}/integration_8_00794ba736.svg`,   // #8  Microsoft Power BI
  relay:           `${BASE}/integration_9_d6b190e0b8.svg`,   // #9  Relay (colorful 3D pieces)
  n8nStream:       `${BASE}/integration_10_97876f19e6.svg`,  // #10 n8n Streamer / Queue
  glitter:         `${BASE}/integration_11_fec2aaf918.svg`,  // #11 Glitter AI (purple sparkles)
  layers:          `${BASE}/integration_12_ff7e22b6e3.svg`,  // #12 Layers
  figma:           `${BASE}/integration_13_ddd94c6f29.svg`,  // #13 Figma
  davinci:         `${BASE}/integration_14_1ce4b20f0b.svg`,  // #14 DaVinci Resolve
  promptArrow:     `${BASE}/integration_15_6c95309bf4.svg`,  // #15 Prompt / Arrow (>)
  slack:           `${BASE}/integration_16_9c0f7c6e53.svg`,  // #16 Slack
  beehiiv:         `${BASE}/integration_17_55cc3454fb.svg`,  // #17 Beehiiv
  camunda:         `${BASE}/integration_18_1fc383c5d1.svg`,  // #18 Camunda
  discord:         `${BASE}/integration_19_d498d4d167.svg`,  // #19 Discord
  microsoftExcel:  `${BASE}/integration_20_2f391c2e94.svg`,  // #20 Microsoft Excel
  pagerduty:       `${BASE}/integration_21_02a1829358.svg`,  // #21 PagerDuty
  canva:           `${BASE}/integration_22_efceea22ad.svg`,  // #22 Canva
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
  { name: "Camunda",           src: ICONS.camunda },
  { name: "Relay",             src: ICONS.relay },
  { name: "Microsoft Power BI",src: ICONS.powerBi },
  { name: "Microsoft Outlook", src: ICONS.microsoftOutlook },
  { name: "Algolia",           src: ICONS.algolia },
  { name: "n8n Stream",        src: ICONS.n8nStream },
  { name: "Layers",            src: ICONS.layers },
  { name: "Glitter AI",        src: ICONS.glitter },
  { name: "Figma",             src: ICONS.figma },
  { name: "n8n Tools",         src: ICONS.n8nTools },
  { name: "Microsoft Azure",   src: ICONS.microsoftAzure },
  { name: "Prompt Arrow",      src: ICONS.promptArrow },
];

const row2 = [
  { name: "Microsoft Excel",   src: ICONS.microsoftExcel },
  { name: "Discord",           src: ICONS.discord },
  { name: "Mailchimp",         src: ICONS.mailchimp },
  { name: "Google Calendar",   src: ICONS.googleCalendar },
  { name: "DaVinci Resolve",   src: ICONS.davinci },
  { name: "n8n Stream",        src: ICONS.n8nStream },
  { name: "Slack",             src: ICONS.slack },
  { name: "PostgreSQL",        src: ICONS.postgresql },
  { name: "PagerDuty",         src: ICONS.pagerduty },
  { name: "Canva",             src: ICONS.canva },
  { name: "Beehiiv",           src: ICONS.beehiiv },
  { name: "MySQL",             src: ICONS.mysql },
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
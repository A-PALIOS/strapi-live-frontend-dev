import {
  CheckCircle2,
  Clock3,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

type AutomationStatIcon = "clock" | "check" | "trend" | "shield";

export interface AutomationStatItem {
  id: number;
  label: string;
  value: string;
  description: string;
  icon?: AutomationStatIcon;
}

export interface AutomationStatsBlockProps {
  items: AutomationStatItem[];
}

const iconMap = {
  clock: Clock3,
  check: CheckCircle2,
  trend: TrendingUp,
  shield: ShieldCheck,
};



export function AutomationStats({
  items,
}: Readonly<AutomationStatsBlockProps>) {


    
  if (!items?.length) return null;

  return (
    <section className="w-full bg-[#030912] px-6 md:px-10 lg:px-16 xl:px-20 py-16 md:py-20">
      <div className="w-full rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-8 shadow-[0_0_60px_rgba(41,148,242,0.08)] backdrop-blur-md md:px-10 lg:px-14">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => {
            const Icon = iconMap[item.icon || "clock"];

            return (
              <div
                key={item.id}
                className="relative flex items-center gap-5 lg:pr-8"
              >
                {index !== 0 && (
                  <div className="absolute -left-4 top-1/2 hidden h-20 w-px -translate-y-1/2 bg-white/10 lg:block" />
                )}

                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[#2994F2]/70 bg-[#2994F2]/10 shadow-[0_0_28px_rgba(41,148,242,0.22)]">
                  <Icon className="h-8 w-8 text-[#2994F2]" strokeWidth={2.2} />
                </div>

                <div>
                  <p className="mb-1 font-agenda-regular text-sm text-white/70">
                    {item.label}
                  </p>

                  <p className="font-agenda-medium text-4xl leading-none tracking-[-0.04em] text-white md:text-5xl">
                    {item.value}
                  </p>

                  <p className="mt-2 max-w-[190px] font-agenda-regular text-sm leading-[1.4] text-white/65">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
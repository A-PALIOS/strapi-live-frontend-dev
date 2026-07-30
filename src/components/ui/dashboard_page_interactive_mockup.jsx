"use client";

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const capabilityCards = [
  {
    title: 'Performance Monitoring',
    text: 'Track KPIs, operational metrics, project milestones, and performance trends in one live environment.',
  },
  {
    title: 'Data Visualization',
    text: 'Turn dense datasets into clear charts, maps, and visual summaries that decision-makers can actually use.',
  },
  {
    title: 'Power BI Dashboards',
    text: 'Connect structured reporting with modern BI tools for advanced filtering, slicing, and executive reporting.',
  },
  {
    title: 'Custom Web Dashboards',
    text: 'Build branded, client-facing dashboards tailored to workflows, teams, and operational logic.',
  },
];

const whyDashboardItems = [
  ['Real-Time Insights', 'Access live indicators, trends, and status updates without waiting for manual reports.'],
  ['Better Decisions', 'Turn complex information into visual intelligence that supports faster action.'],
  ['Automated Reporting', 'Reduce repetitive reporting work with connected, dynamic views.'],
  ['Centralized Information', 'Combine multiple data sources into one clear operational environment.'],
];

const useCases = [
  'Project Monitoring',
  'Healthcare Analytics',
  'Policy & Research Analytics',
  'Organizational Performance',
];

const regionData = {
  'All Regions': { series: [40, 52, 48, 66, 58, 73, 81], bars: [72, 56, 84, 64] },
  Attica: { series: [55, 62, 58, 74, 69, 80, 88], bars: [80, 64, 90, 72] },
  'Central Greece': { series: [30, 38, 42, 50, 47, 58, 63], bars: [58, 44, 66, 50] },
  Crete: { series: [45, 50, 44, 60, 64, 70, 75], bars: [66, 60, 74, 58] },
};

export function HeroSection() {
  const [range, setRange] = React.useState(68);
  const [region, setRegion] = React.useState('All Regions');
  const [activeQuarter, setActiveQuarter] = React.useState(null);
  const { series: heroSeries, bars: heroBars } = regionData[region];

  return (
    <section className="relative overflow-hidden w-full   border-b border-white/10 bg-[#030912]">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute left-[8%] top-10 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute right-[10%] top-16 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
      </div>

      <div className="relative w-full px-6 md:px-10 lg:px-10 xl:px-23 py-16 md:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <h1 className="max-w-3xl text-4xl font-agenda-medium leading-tight md:text-6xl">
              <span className="text-white">Interactive Data Dashboards</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-blue-100/85 md:text-lg font-agenda-regular">
              Transform complex data into clear insights with powerful interactive dashboards designed for teams, executives, and organizations that need better visibility.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#061a38]/80 p-4 shadow-2xl shadow-black/30 backdrop-blur">
            <div className="rounded-[22px] border border-white/10 bg-[#07142a] p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-agenda-regular text-white/50">Live Preview</div>
                  <div className="text-lg text-white font-agenda-medium">Executive Control Center</div>
                </div>
                <div className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-agenda-medium text-emerald-300">
                  Live Data
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-[1.25fr_0.75fr]">
                <div className="rounded-2xl border border-white/10 bg-[#0b2143] p-4">
                  <div className="mb-3 flex items-center font-agenda-regular justify-between text-sm text-white/60">
                    <span>Performance Trend</span>
                    <span>Last 7 periods</span>
                  </div>
                  <div className="flex h-40 items-end gap-3 rounded-xl bg-[#08172f] p-4">
                    {heroSeries.map((v, i) => (
                      <div
                        key={i}
                        className="flex h-full flex-1 cursor-pointer flex-col items-center justify-end gap-2"
                        onMouseEnter={() => setActiveQuarter(i)}
                        onMouseLeave={() => setActiveQuarter(null)}
                      >
                        {activeQuarter === i && (
                          <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] font-agenda-medium text-white">
                            {v}%
                          </span>
                        )}
                        <div
                          className={`w-full rounded-t-lg bg-gradient-to-t transition-all duration-500 ${
                            activeQuarter === i
                              ? 'from-cyan-300 to-sky-200'
                              : 'from-cyan-400 to-blue-500'
                          }`}
                          style={{ height: `${v}%` }}
                        />
                        <span className="text-[10px] font-agenda-regular text-white/45">Q{i + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#0b2143] p-4">
                  <div className="mb-3 text-sm font-agenda-regular text-white/60">Completion Mix</div>
                  <div
                    className="mx-auto mt-5 flex h-36 w-36 items-center justify-center rounded-full p-[10px] transition-[background] duration-500"
                    style={{
                      background: `conic-gradient(#22d3ee ${range}%, rgba(255,255,255,0.08) ${range}% 100%)`,
                    }}
                  >
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-[#0b2143]">
                      <div className="text-center">
                        <div className="text-2xl text-white font-agenda-medium">{range}%</div>
                        <div className="text-sm font-agenda-regular text-white/55">completion</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-2xl border border-white/10 bg-[#0b2143] p-4">
                  <div className="mb-3 text-sm font-agenda-medium text-white/60">Quick Filters</div>
                  <label className="mb-4 flex items-center justify-between text-sm font-agenda-regular text-white/45">
                    <span>Progress target</span>
                    <span className="font-agenda-medium text-white">{range}%</span>
                  </label>
                  <input
                    type="range"
                    min="35"
                    max="100"
                    value={range}
                    onChange={(e) => setRange(Number(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                  <div className="mt-5">
                    <label className="mb-2 block text-xs font-agenda-medium text-white/45">Region</label>
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#07142a] px-3 py-2 text-sm text-white font-agenda-regular outline-none"
                    >
                      {Object.keys(regionData).map((r) => (
                        <option key={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mt-5 rounded-xl bg-cyan-400/10 p-3 text-sm text-cyan-100 font-agenda-medium">
                    Active filter: <span className="font-agenda-medium">{region}</span> · Target {range}%
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#0b2143] p-4">
                  <div className="mb-3 flex items-center justify-between font-agenda-medium text-sm text-white/60">
                    <span>Category Comparison</span>
                    <span>Updated now</span>
                  </div>
                  <div className="space-y-4">
                    {heroBars.map((bar, i) => (
                      <div key={i}>
                        <div className="mb-1 flex font-agenda-regular justify-between text-sm text-white/55">
                          <span>{['Efficiency', 'Adoption', 'Coverage', 'Accuracy'][i]}</span>
                          <span>{bar}%</span>
                        </div>
                        <div className="h-3 rounded-full bg-white/10">
                          <div
                            className="h-3 rounded-full bg-gradient-to-r from-sky-300 via-cyan-400 to-blue-500 transition-all duration-500"
                            style={{ width: `${bar}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CapabilitiesSection() {
  return (
    <section className="bg-[#030912] text-white">
      <div className="w-full px-6 md:px-10 lg:px-10 xl:px-23 py-16 md:py-20">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-agenda-regular uppercase tracking-[0.22em] text-white">
              What we build
            </p>
            <h2 className="mt-2 text-2xl font-agenda-medium md:text-[32px]">
              Dashboard Capabilities
            </h2>
          </div>
          <div className="hidden font-agenda-regular text-sm text-white/50 md:block">
            Designed for clarity, speed, and live exploration
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {capabilityCards.map((card) => (
            <div
              key={card.title}
              className="group rounded-[24px] border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/[0.06]"
            >
              <h3 className="text-xl font-agenda-medium">{card.title}</h3>
              <p className="mt-3 text-sm leading-7 font-agenda-regular text-white/65">{card.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const dashboardShowcase = [
  {
    id: 'ops',
    label: 'Operations',
    title: 'Operational Performance Dashboard',
    text: 'A unified view of targets, completion rates, task flow, and service efficiency.',
    chips: ['KPI tracking', 'Trend analysis', 'Team comparison'],
    engagement: '82%',
    reporting: '-42%',
    donut: [36, 24, 20, 20],
    donutLabels: ['Completed', 'In progress', 'Pending', 'Blocked'],
    summary:
      'Operational indicators show strong task completion, with visible delays in two process areas that require management attention.',
  },
  {
    id: 'map',
    label: 'Statistics',
    title: 'Regional Statistics Dashboard',
    text: 'Explore data geographically with map-based insights, comparisons, and regional filtering.',
    chips: ['Geo analytics', 'Regional filters', 'Time series'],
    engagement: '76%',
    reporting: '-35%',
    donut: [28, 32, 18, 22],
    donutLabels: ['Attica', 'Central Greece', 'Crete', 'Other regions'],
    summary:
      'Regional variation highlights higher performance concentration in priority areas, making geographic comparison easier for planning teams.',
  },
  {
    id: 'exec',
    label: 'Executive',
    title: 'Executive Insights Dashboard',
    text: 'High-level decision support with financial summaries, growth trends, and strategic alerts.',
    chips: ['Executive KPIs', 'Forecasting', 'Automated summaries'],
    engagement: '91%',
    reporting: '-51%',
    donut: [42, 18, 16, 24],
    donutLabels: ['Revenue', 'Growth', 'Retention', 'Cost efficiency'],
    summary:
      'Executive reporting shows upward movement across core metrics, with forecast confidence improving over the next reporting period.',
  },
];

const donutColors = ['#22d3ee', '#3b82f6', '#818cf8', '#7dd3fc'];
const AUTOPLAY_MS = 4500;

export function DashboardShowcaseSection() {
  const [active, setActive] = React.useState(dashboardShowcase[0]);
  const [hoveredSegment, setHoveredSegment] = React.useState(null);
  const [isPaused, setIsPaused] = React.useState(false);

  const selectTab = (item) => {
    setActive(item);
    setHoveredSegment(null);
  };

  React.useEffect(() => {
    if (isPaused) return undefined;
    const id = setInterval(() => {
      setActive((prev) => {
        const idx = dashboardShowcase.findIndex((s) => s.id === prev.id);
        return dashboardShowcase[(idx + 1) % dashboardShowcase.length];
      });
      setHoveredSegment(null);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [isPaused, active.id]);

  const donutGradient = React.useMemo(() => {
    let acc = 0;
    const stops = active.donut.map((v, i) => {
      const start = acc;
      acc += v;
      return `${donutColors[i]} ${start}% ${acc}%`;
    });
    return `conic-gradient(${stops.join(', ')})`;
  }, [active]);

  return (
    <section
      className="bg-[#030912] text-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="w-full px-6 md:px-10 lg:px-10 xl:px-23 py-16 md:py-20">
        <div className="mb-6">
          <p className="text-sm font-agenda-regular uppercase tracking-[0.22em] text-white-300/80">
            Interactive demo
          </p>
          <h2 className="mt-2 text-2xl font-agenda-medium md:text-[32px]">Dashboard Showcase</h2>
          <p className="mt-3 max-w-3xl font-agenda-regular text-white/65">
            Click through the dashboard types below to preview how your users could switch between views, metrics, and analytics in a live environment.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {dashboardShowcase.map((item) => {
            const isActive = active.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => selectTab(item)}
                className={`relative overflow-hidden rounded-full px-5 py-3 text-sm font-agenda-medium transition ${
                  isActive
                    ? 'bg-sky-500 text-[#03203c]'
                    : 'border border-white/10 bg-white/[0.04] text-white/75 hover:bg-white/[0.08]'
                }`}
              >
                <span className="relative z-10">{item.label}</span>
                {isActive && !isPaused && (
                  <motion.span
                    key={active.id}
                    className="absolute inset-x-0 bottom-0 h-[3px] bg-[#03203c]/40"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: AUTOPLAY_MS / 1000, ease: 'linear' }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <div className="text-sm uppercase font-agenda-regular tracking-[0.2em] text-sky-500">
              Selected View
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                <h3 className="mt-3 text-2xl font-agenda-medium">{active.title}</h3>
                <p className="mt-4 text-md leading-7 font-agenda-regular text-white/65">{active.text}</p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {active.chips.map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full border border-cyan-300/15 bg-cyan-400/10 px-3 py-2 text-md text-cyan-100 font-agenda-regular"
                    >
                      {chip}
                    </span>
                  ))}
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-[#0a1b35] p-4">
                    <div className="text-md font-agenda-regular text-white/45">Engagement</div>
                    <div className="mt-2 text-3xl font-agenda-medium text-sky-500">
                      {active.engagement}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-[#0a1b35] p-4">
                    <div className="text-md font-agenda-regular text-white/45">Reporting time</div>
                    <div className="mt-2 text-3xl font-agenda-medium text-sky-500">
                      {active.reporting}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#06152b] p-5 shadow-2xl shadow-black/20">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                className="grid gap-4 md:grid-cols-[1.08fr_0.92fr]"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                <div className="rounded-[22px] border border-white/10 bg-[#091d3d] p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="text-md font-agenda-regular text-white/60">Primary View</div>
                    <div className="text-md font-agenda-regular text-white/60">Interactive preview</div>
                  </div>

                  {active.id === 'map' ? (
                    <StatisticsPreview />
                  ) : active.id === 'exec' ? (
                    <ExecutivePreview />
                  ) : (
                    <OperationsPreview />
                  )}
                </div>

                <div className="space-y-4">
                  <div className="rounded-[22px] border border-white/10 bg-[#091d3d] p-4">
                    <div className="mb-3 text-md font-agenda-regular text-white/60">Distribution</div>
                    <div className="flex items-center gap-5">
                      <div
                        className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full p-[12px] transition-[background] duration-500"
                        style={{ background: donutGradient }}
                      >
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-[#091d3d] text-center">
                          <div className="text-lg font-agenda-medium text-white">
                            {hoveredSegment !== null ? `${active.donut[hoveredSegment]}%` : active.label}
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 space-y-2">
                        {active.donut.map((v, i) => (
                          <div
                            key={i}
                            className={`flex items-center justify-between rounded-lg px-2 py-1 text-sm font-agenda-regular transition ${
                              hoveredSegment === i ? 'bg-white/10' : ''
                            }`}
                            onMouseEnter={() => setHoveredSegment(i)}
                            onMouseLeave={() => setHoveredSegment(null)}
                          >
                            <span className="flex items-center gap-2 text-white/70">
                              <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: donutColors[i] }}
                              />
                              {active.donutLabels[i]}
                            </span>
                            <span className="font-agenda-medium text-white">{v}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="rounded-[22px] border font-agenda-regular border-white/10 bg-[#091d3d] p-4">
                    <div className="mb-3 text-md text-white/60">Smart Summary</div>
                    <p className="text-sm leading-7 text-white/65">{active.summary}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
export function OperationsPreview() {
  const progress = [72, 54, 88, 63];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-[#030912] p-4">
        <div className="mb-4 flex items-center justify-between font-agenda-regular text-md text-white/60">
          <span>Project Timeline</span>
          <span>Live progress</span>
        </div>
        <div className="space-y-3">
          {progress.map((v, i) => (
            <div key={i} className="grid grid-cols-[80px_1fr_52px] items-center gap-3 text-sm">
              <span className="text-white/55 font-agenda-regular text-md">Task {i + 1}</span>
              <div className="h-3 rounded-full bg-white/10">
                <div className="h-3 rounded-full bg-gradient-to-r from-cyan-300 to-blue-500" style={{ width: `${v}%` }} />
              </div>
              <span className="text-right text-white/70 font-agenda-regular">{v}%</span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-white/10 bg-[#07152c] p-4">
          <div className="text-md font-agenda-regular text-white/45">Open risks</div>
          <div className="mt-2 text-3xl font-agenda-medium text-sky-500">07</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#07152c] p-4">
          <div className="text-md font-agenda-regular text-white/45">On-track items</div>
          <div className="mt-2 text-3xl font-agenda-medium text-sky-500">31</div>
        </div>
      </div>
    </div>
  );
}

export function StatisticsPreview() {
  const mapStats = [52, 67, 83];

  return (
    <div className="relative h-[280px] overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_30%_25%,rgba(64,196,255,0.2),transparent_22%),linear-gradient(180deg,#11264e,#0a1630)]">
      <div className="absolute left-[18%] top-[18%] h-16 w-12 rounded-[40%] bg-cyan-300/60 blur-[1px]" />
      <div className="absolute left-[27%] top-[33%] h-20 w-14 rounded-[45%] bg-sky-300/50" />
      <div className="absolute left-[43%] top-[30%] h-24 w-20 rounded-[42%] bg-blue-400/55" />
      <div className="absolute left-[60%] top-[25%] h-14 w-12 rounded-[40%] bg-cyan-200/60" />
      <div className="absolute left-[54%] top-[47%] h-20 w-16 rounded-[45%] bg-indigo-400/55" />
      <div className="absolute left-[34%] top-[55%] h-14 w-12 rounded-[40%] bg-sky-200/55" />
      <div className="absolute right-4 top-4 rounded-xl font-agenda-regular border border-white/10 bg-[#091d3d]/90 p-3 text-md text-white/70">
        <div>Regional Score</div>
        <div className="mt-1 text-lg font-agenda-medium text-sky-500">88.6</div>
      </div>
      <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-3">
        {mapStats.map((n, i) => (
          <div key={i} className="rounded-xl font-agenda-regular border border-white/10 bg-[#091d3d]/85 p-3 text-center">
            <div className="text-[13px] text-white/45">Region {i + 1}</div>
            <div className="mt-1 text-lg  text-white">{n}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ExecutivePreview() {
  const executiveCards = ['Revenue', 'Growth', 'Efficiency'];
  const executiveValues = ['€1.2M', '+18%', '94%'];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {executiveCards.map((name, i) => (
          <div key={name} className="rounded-2xl border border-white/10 bg-[#07152c] p-4">
            <div className="text-md font-agenda-regular text-white/45">{name}</div>
            <div className="mt-2 text-2xl font-agenda-medium text-sky-500">{executiveValues[i]}</div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-white/10 bg-[#07152c] p-4">
        <div className="mb-4 flex items-center font-agenda-regular justify-between text-md text-white/60">
          <span>Forecast Curve</span>
          <span>12 months</span>
        </div>
        <div className="relative h-40 overflow-hidden rounded-xl bg-[#0b2143]">
          <svg viewBox="0 0 300 140" className="h-full w-full">
            <defs>
              <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(56,189,248,0.5)" />
                <stop offset="100%" stopColor="rgba(56,189,248,0.02)" />
              </linearGradient>
            </defs>
            <path d="M0 120 C40 110, 60 95, 90 88 S140 72, 170 65 S220 42, 260 36 S285 28, 300 18" fill="none" stroke="#48d9ff" strokeWidth="4" />
            <path d="M0 140 L0 120 C40 110, 60 95, 90 88 S140 72, 170 65 S220 42, 260 36 S285 28, 300 18 L300 140 Z" fill="url(#lineFill)" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function WhyDashboardsSection() {
  return (
    <section className="bg-[#030912] text-white">
      <div className="w-full px-6 md:px-10 lg:px-10 xl:px-23 py-16 md:py-20">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-md font-agenda-regular uppercase tracking-[0.22em] text-sky-500">
              Why dashboards matter
            </p>
            <h2 className="mt-2 text-2xl font-agenda-medium md:text-[32px]">
              Built for clarity and better decisions
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {whyDashboardItems.map(([title, text]) => (
                <div key={title} className="rounded-2xl bg-[#0a1b35] p-4">
                  <h3 className="font-agenda-medium text-lg">{title}</h3>
                  <p className="mt-2 text-md font-agenda-regular leading-7 text-white/65">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm font-agenda-regular uppercase tracking-[0.22em] text-sky-500">
              Common use cases
            </p>
            <h2 className="mt-2 text-2xl font-agenda-medium md:text-[32px]">
              Where these dashboards create value
            </h2>
            <div className="mt-6 space-y-4">
              {useCases.map((item, i) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-2xl bg-[#0a1b35] px-5 py-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center font-agenda-medium justify-center rounded-full bg-cyan-400/10 text-cyan-300">
                      0{i + 1}
                    </div>
                    <span className="font-agenda-medium">{item}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CtaSection() {
  return (
    <section className="bg-[#030912] text-white">
      <div className="w-full px-6 md:px-10 lg:px-10 xl:px-23 py-16 md:py-20">
        <div className="rounded-[32px] border border-cyan-300/10 bg-[linear-gradient(135deg,rgba(27,139,255,0.18),rgba(10,27,53,0.95))] p-8 text-center md:p-12">
          <p className="text-sm uppercase font-agenda-regular tracking-[0.24em] text-sky-500">
            Get started
          </p>
          <h2 className="mt-3 text-2xl font-agenda-medium md:text-[32px]">
            Turn your data into a live decision-making tool
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/70 leading-8 font-agenda-regular">
            Get a branded, interactive dashboard that connects your data sources, automates
            reporting, and gives your team the real-time visibility they need to act faster.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="mailto:media@artius.gr"
              className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-white/90 transition hover:bg-white/10 font-agenda-medium"
            >
              Contact Our Team
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function DashboardPageInteractiveMockup() {
  return (
    <div className="min-h-screen bg-[#02152d] text-white">
      <HeroSection />
      <CapabilitiesSection />
      <DashboardShowcaseSection />
      <WhyDashboardsSection />
      <CtaSection />
    </div>
  );
}

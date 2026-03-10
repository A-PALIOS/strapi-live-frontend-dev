"use client";

import React, { use } from 'react';
import { AboutInfo } from '../blocks/AboutInfo';

const capabilityCards = [
  {
    title: 'Performance Monitoring',
    text: 'Track KPIs, operational metrics, project milestones, and performance trends in one live environment.',
    stat: '24 KPIs',
  },
  {
    title: 'Data Visualization',
    text: 'Turn dense datasets into clear charts, maps, and visual summaries that decision-makers can actually use.',
    stat: '8 Views',
  },
  {
    title: 'Power BI Dashboards',
    text: 'Connect structured reporting with modern BI tools for advanced filtering, slicing, and executive reporting.',
    stat: 'Live BI',
  },
  {
    title: 'Custom Web Dashboards',
    text: 'Build branded, client-facing dashboards tailored to workflows, teams, and operational logic.',
    stat: 'Custom UX',
  },
];

const heroMetrics = [
  { label: 'Live widgets', value: '18' },
  { label: 'Connected sources', value: '6' },
  { label: 'Auto reports', value: '12' },
  { label: 'Decision alerts', value: '9' },
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

export function HeroSection() {
  const [range, setRange] = React.useState(68);
  const [region, setRegion] = React.useState('All Regions');
  const heroSeries = [40, 52, 48, 66, 58, 73, 81];
  const heroBars = [72, 56, 84, 64];

  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(49,109,255,0.28),transparent_38%),linear-gradient(180deg,#072252_0%,#02152d_75%)]">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute left-[8%] top-10 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute right-[10%] top-16 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-4 inline-flex items-center rounded-full border border-cyan-300/25 bg-white/5 px-4 py-2 text-sm text-cyan-200 backdrop-blur">
              Digital / Dashboard Solutions
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
              Interactive <span className="text-cyan-300">Data Dashboards</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-blue-100/85 md:text-lg">
              Transform complex data into clear insights with powerful interactive dashboards designed for teams, executives, and organizations that need better visibility.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button className="rounded-full bg-[#1b8bff] px-6 py-3 font-semibold text-white shadow-lg shadow-blue-900/40 transition hover:scale-[1.02]">
                Request a Demo
              </button>
              <button className="rounded-full border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white/90 backdrop-blur transition hover:bg-white/10">
                Explore Examples
              </button>
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-2 gap-4 md:grid-cols-4">
              {heroMetrics.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <div className="text-2xl font-semibold text-cyan-300">{item.value}</div>
                  <div className="mt-1 text-sm text-white/65">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#061a38]/80 p-4 shadow-2xl shadow-black/30 backdrop-blur">
            <div className="rounded-[22px] border border-white/10 bg-[#07142a] p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-sm text-white/50">Live Preview</div>
                  <div className="text-lg font-semibold">Executive Control Center</div>
                </div>
                <div className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-medium text-emerald-300">
                  Live Data
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-[1.25fr_0.75fr]">
                <div className="rounded-2xl border border-white/10 bg-[#0b2143] p-4">
                  <div className="mb-3 flex items-center justify-between text-sm text-white/60">
                    <span>Performance Trend</span>
                    <span>Last 7 periods</span>
                  </div>
                  <div className="flex h-40 items-end gap-3 rounded-xl bg-[#08172f] p-4">
                    {heroSeries.map((v, i) => (
                      <div key={i} className="flex flex-1 flex-col items-center justify-end gap-2">
                        <div
                          className="w-full rounded-t-lg bg-gradient-to-t from-cyan-400 to-blue-500"
                          style={{ height: `${v}%` }}
                        />
                        <span className="text-[10px] text-white/45">Q{i + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#0b2143] p-4">
                  <div className="mb-3 text-sm text-white/60">Completion Mix</div>
                  <div className="mx-auto mt-5 flex h-36 w-36 items-center justify-center rounded-full border-[18px] border-cyan-400/80 border-r-blue-500 border-b-indigo-500 border-l-sky-200/80">
                    <div className="text-center">
                      <div className="text-2xl font-semibold">{range}%</div>
                      <div className="text-xs text-white/55">completion</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-2xl border border-white/10 bg-[#0b2143] p-4">
                  <div className="mb-3 text-sm text-white/60">Quick Filters</div>
                  <label className="mb-4 block text-xs text-white/45">Progress target</label>
                  <input
                    type="range"
                    min="35"
                    max="100"
                    value={range}
                    onChange={(e) => setRange(Number(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                  <div className="mt-5">
                    <label className="mb-2 block text-xs text-white/45">Region</label>
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#07142a] px-3 py-2 text-sm text-white outline-none"
                    >
                      <option>All Regions</option>
                      <option>Attica</option>
                      <option>Central Greece</option>
                      <option>Crete</option>
                    </select>
                  </div>
                  <div className="mt-5 rounded-xl bg-cyan-400/10 p-3 text-sm text-cyan-100">
                    Active filter: <span className="font-semibold">{region}</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#0b2143] p-4">
                  <div className="mb-3 flex items-center justify-between text-sm text-white/60">
                    <span>Category Comparison</span>
                    <span>Updated now</span>
                  </div>
                  <div className="space-y-4">
                    {heroBars.map((bar, i) => (
                      <div key={i}>
                        <div className="mb-1 flex justify-between text-xs text-white/55">
                          <span>{['Efficiency', 'Adoption', 'Coverage', 'Accuracy'][i]}</span>
                          <span>{bar}%</span>
                        </div>
                        <div className="h-3 rounded-full bg-white/10">
                          <div
                            className="h-3 rounded-full bg-gradient-to-r from-sky-300 via-cyan-400 to-blue-500"
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
    <section className="bg-[#02152d] text-white">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-cyan-300/80">
              What we build
            </p>
            <h2 className="mt-2 text-3xl font-semibold">
              Dashboard Capabilities
            </h2>
          </div>
          <div className="hidden text-sm text-white/50 md:block">
            Designed for clarity, speed, and live exploration
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {capabilityCards.map((card) => (
            <div
              key={card.title}
              className="group rounded-[24px] border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/[0.06]"
            >
              <div className="mb-4 inline-flex rounded-xl bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">
                {card.stat}
              </div>
              <h3 className="text-xl font-semibold">{card.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/65">{card.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DashboardShowcaseSection() {
  const showcase = [
    {
      id: 'ops',
      label: 'Operations',
      title: 'Operational Performance Dashboard',
      text: 'A unified view of targets, completion rates, task flow, and service efficiency.',
      chips: ['KPI tracking', 'Trend analysis', 'Team comparison'],
      engagement: '82%',
      reporting: '-42%',
      donut: [36, 24, 20, 20],
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
      summary:
        'Executive reporting shows upward movement across core metrics, with forecast confidence improving over the next reporting period.',
    },
  ];

  const [active, setActive] = React.useState(showcase[0]);

  return (
    <section className="bg-[#02152d] text-white">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.22em] text-cyan-300/80">
            Interactive demo
          </p>
          <h2 className="mt-2 text-3xl font-semibold">Dashboard Showcase</h2>
          <p className="mt-3 max-w-3xl text-white/65">
            Click through the dashboard types below to preview how your users could switch between views, metrics, and analytics in a live environment.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {showcase.map((item) => {
            const isActive = active.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActive(item)}
                className={`rounded-full px-5 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-cyan-400 text-[#03203c]'
                    : 'border border-white/10 bg-white/[0.04] text-white/75 hover:bg-white/[0.08]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <div className="text-sm uppercase tracking-[0.2em] text-cyan-300/80">
              Selected View
            </div>
            <h3 className="mt-3 text-2xl font-semibold">{active.title}</h3>
            <p className="mt-4 text-sm leading-7 text-white/65">{active.text}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {active.chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-cyan-300/15 bg-cyan-400/10 px-3 py-2 text-xs text-cyan-100"
                >
                  {chip}
                </span>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-[#0a1b35] p-4">
                <div className="text-xs text-white/45">Engagement</div>
                <div className="mt-2 text-3xl font-semibold text-cyan-300">
                  {active.engagement}
                </div>
              </div>
              <div className="rounded-2xl bg-[#0a1b35] p-4">
                <div className="text-xs text-white/45">Reporting time</div>
                <div className="mt-2 text-3xl font-semibold text-cyan-300">
                  {active.reporting}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#06152b] p-5 shadow-2xl shadow-black/20">
            <div className="grid gap-4 md:grid-cols-[1.08fr_0.92fr]">
              <div className="rounded-[22px] border border-white/10 bg-[#091d3d] p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-sm text-white/60">Primary View</div>
                  <div className="text-xs text-cyan-300">Interactive preview</div>
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
                  <div className="mb-3 text-sm text-white/60">Distribution</div>
                  <div className="grid grid-cols-2 gap-3">
                    {active.donut.map((v, i) => (
                      <div key={i} className="rounded-2xl bg-[#07152c] p-4">
                        <div className="text-xs text-white/45">Segment {i + 1}</div>
                        <div className="mt-2 text-2xl font-semibold text-cyan-300">
                          {v}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-[22px] border border-white/10 bg-[#091d3d] p-4">
                  <div className="mb-3 text-sm text-white/60">Smart Summary</div>
                  <p className="text-sm leading-7 text-white/65">{active.summary}</p>
                </div>
              </div>
            </div>
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
      <div className="rounded-2xl border border-white/10 bg-[#07152c] p-4">
        <div className="mb-4 flex items-center justify-between text-sm text-white/60">
          <span>Project Timeline</span>
          <span>Live progress</span>
        </div>
        <div className="space-y-3">
          {progress.map((v, i) => (
            <div key={i} className="grid grid-cols-[80px_1fr_52px] items-center gap-3 text-sm">
              <span className="text-white/55">Task {i + 1}</span>
              <div className="h-3 rounded-full bg-white/10">
                <div className="h-3 rounded-full bg-gradient-to-r from-cyan-300 to-blue-500" style={{ width: `${v}%` }} />
              </div>
              <span className="text-right text-white/70">{v}%</span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-white/10 bg-[#07152c] p-4">
          <div className="text-xs text-white/45">Open risks</div>
          <div className="mt-2 text-3xl font-semibold text-cyan-300">07</div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#07152c] p-4">
          <div className="text-xs text-white/45">On-track items</div>
          <div className="mt-2 text-3xl font-semibold text-cyan-300">31</div>
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
      <div className="absolute right-4 top-4 rounded-xl border border-white/10 bg-[#091d3d]/90 p-3 text-xs text-white/70">
        <div>Regional Score</div>
        <div className="mt-1 text-lg font-semibold text-cyan-300">88.6</div>
      </div>
      <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-3">
        {mapStats.map((n, i) => (
          <div key={i} className="rounded-xl border border-white/10 bg-[#091d3d]/85 p-3 text-center">
            <div className="text-[10px] text-white/45">Region {i + 1}</div>
            <div className="mt-1 text-lg font-semibold text-white">{n}</div>
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
            <div className="text-xs text-white/45">{name}</div>
            <div className="mt-2 text-2xl font-semibold text-cyan-300">{executiveValues[i]}</div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-white/10 bg-[#07152c] p-4">
        <div className="mb-4 flex items-center justify-between text-sm text-white/60">
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
    <section className="bg-[#02152d] text-white">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm uppercase tracking-[0.22em] text-cyan-300/80">
              Why dashboards matter
            </p>
            <h2 className="mt-2 text-3xl font-semibold">
              Built for clarity and better decisions
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {whyDashboardItems.map(([title, text]) => (
                <div key={title} className="rounded-2xl bg-[#0a1b35] p-4">
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/65">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm uppercase tracking-[0.22em] text-cyan-300/80">
              Common use cases
            </p>
            <h2 className="mt-2 text-3xl font-semibold">
              Where these dashboards create value
            </h2>
            <div className="mt-6 space-y-4">
              {useCases.map((item, i) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-2xl bg-[#0a1b35] px-5 py-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-300">
                      0{i + 1}
                    </div>
                    <span className="font-medium">{item}</span>
                  </div>
                  <span className="text-white/35">→</span>
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
    <section className="bg-[#02152d] text-white">
      <div className="mx-auto max-w-7xl px-6 pb-20 pt-6 lg:px-10">
        <div className="rounded-[32px] border border-cyan-300/10 bg-[linear-gradient(135deg,rgba(27,139,255,0.18),rgba(10,27,53,0.95))] p-8 text-center md:p-12">
          <p className="text-sm uppercase tracking-[0.24em] text-cyan-300/80">
            Call to action
          </p>
          <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
            See your data in action
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/70 leading-8">
            This live mockup shows how your Dashboard page could feel on the site:
            premium, interactive, and aligned with the rest of your Digital section.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button className="rounded-full bg-[#1b8bff] px-6 py-3 font-semibold text-white transition hover:scale-[1.02]">
              Request a Demo
            </button>
            <button className="rounded-full border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white/90 transition hover:bg-white/10">
              Contact Our Team
            </button>
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

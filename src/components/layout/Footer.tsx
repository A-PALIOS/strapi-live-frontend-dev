





"use client";
import Link from "next/link";
import { StrapiImage } from "../StrapiImage";
import type { FooterProps } from "@/types";
import {
  Mail,
  MapPin,
  Phone,
  Linkedin,
  Facebook,
  Twitter,
  Youtube,
  Globe,
} from "lucide-react";
import { JSX } from "react";
import { AnimatedTooltip } from "../ui/animated-tooltip";
import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";
 
type TooltipPerson = {
  id: number;
  name: string;
  designation: string;
  image: string;
};

const iconMap: Record<string, JSX.Element> = {
  mail: <Mail className="w-4 h-4" />,
  email: <Mail className="w-4 h-4" />,
  message: <Mail className="w-4 h-4" />,

  "map-pin": <MapPin className="w-4 h-4" />,
  location: <MapPin className="w-4 h-4" />,
  address: <MapPin className="w-4 h-4" />,
  pin: <MapPin className="w-4 h-4" />,
  map: <MapPin className="w-4 h-4" />,

  phone: <Phone className="w-4 h-4" />,
  tel: <Phone className="w-4 h-4" />,
  call: <Phone className="w-4 h-4" />,

  linkedin: <Linkedin className="w-4 h-4" />,
  facebook: <Facebook className="w-4 h-4" />,
  twitter: <Twitter className="w-4 h-4" />,
  x: <Twitter className="w-4 h-4" />, // treat "x" as twitter
  youtube: <Youtube className="w-4 h-4" />,

  globe: <Globe className="w-4 h-4" />,
};

export function Footer({ data }: { data: FooterProps }) {
  if (!data) return null;

  const {
    logo,
    description,
    copyrightText,
    newsletterTitle,
    newsletterInputPlaceholder,
    newsletterButtonLabel,
    column,
    socialLink,
    bottomLink,
    contactBackground
  } = data;

  const [people, setPeople] = useState<TooltipPerson[]>([]);
 
  useEffect(() => {
    const ac = new AbortController();
 
    const toAbsolute = (url?: string | null) => {
      if (!url) return "";
      return url.startsWith("http") ? url : `${API_URL}${url}`;
    };
 
    (async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/team-members?populate=*`,
          {
            signal: ac.signal,
            headers: { Accept: "application/json" },
            cache: "no-store",
          }
        );
        if (!res.ok) throw new Error(`Strapi ${res.status}`);
 
        const payload = await res.json();
 
        // Handle both Strapi shapes
        const rows: any[] = Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload)
          ? payload
          : [];
 
        const mapped: TooltipPerson[] = rows
          .map((row) => {
            const id = row?.id;
            const attrs = row?.attributes ?? row;
            const fullName = attrs?.FullName ?? "";
            const jobTitle = attrs?.JobTitle ?? "";
 
            const img = attrs?.ProfileImage;
            const file =
              img?.formats?.small?.url ??
              img?.formats?.thumbnail?.url ??
              img?.url ??
              "";
 
            return {
              id,
              name: fullName,
              designation: jobTitle,
              image: toAbsolute(file),
            } as TooltipPerson;
          })
          .filter((p) => p.id && p.name && p.image);
 
        setPeople(mapped);
      } catch (err) {
        if ((err as any)?.name !== "AbortError") {
          console.error("Failed to load team-members:", err);
          setPeople([]);
        }
      }
    })();
 
    return () => ac.abort();
  }, []);

  return (
   <footer id="footer" data-header="dark" className="mt-16 text-gray-800">
  {/* HERO STRIP */}
  <div
    className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 text-white shadow-lg"
    style={{
      background: "linear-gradient(90deg, #1E9BFB 0%, #156DB0 100%)",
      boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.18)",
    }}
  >
    <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-2 items-start md:items-center gap-10 md:gap-14">
      {/* Left: Headline */}
      <div className="relative">
        <h2 className="leading-tight tracking-tight">
          <span className="font-agenda-medium block text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
            Partner with Us to
          </span>
          <span className="font-agenda-medium block text-3xl sm:text-4xl md:text-5xl lg:text-6xl mt-1.5">
            Create Lasting <span className="font-ivypresto-regular">Solutions</span>
          </span>
        </h2>

        {/* decorative SVG: hidden on small screens, positioned safely on md+ */}
        <svg
          viewBox="0 0 120 40"
          className="pointer-events-none absolute -top-4 right-0 lg: hidden xl:block w-28 h-20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M102.065 27.9997C102.065 30.9452 104.453 33.333 107.399 33.333C110.344 33.333 112.732 30.9452 112.732 27.9997C112.732 25.0542 110.344 22.6664 107.399 22.6664C104.453 22.6664 102.065 25.0542 102.065 27.9997ZM82.8987 26.4667L82.8987 25.4667L82.8987 26.4667ZM30.3987 26.4667L30.355 27.4658L30.3769 27.4667H30.3987V26.4667ZM1.3987 26.4667C1.64424 25.4973 1.64448 25.4974 1.64471 25.4974C1.64478 25.4975 1.64501 25.4975 1.64516 25.4976C1.64544 25.4976 1.64571 25.4977 1.64597 25.4978C1.64648 25.4979 1.64693 25.498 1.64732 25.4981C1.6481 25.4983 1.64864 25.4984 1.64896 25.4985C1.64959 25.4987 1.64935 25.4986 1.64836 25.4984C1.64631 25.4978 1.64155 25.4965 1.63492 25.4945C1.6205 25.4903 1.60335 25.4847 1.58817 25.4791C1.56971 25.4722 1.572 25.4718 1.58879 25.4809C1.59797 25.4858 1.62159 25.4991 1.65294 25.5222C1.68156 25.5433 1.73964 25.5894 1.80053 25.6654C1.86104 25.741 1.95186 25.8809 1.98645 26.0824C2.0243 26.3028 1.98066 26.517 1.8856 26.6908C1.80029 26.8468 1.6929 26.9367 1.63602 26.978C1.57653 27.0213 1.53072 27.0414 1.51905 27.0464C1.49811 27.0553 1.5212 27.0431 1.62463 27.0218C1.72112 27.002 1.86215 26.9792 2.06111 26.9561L1.94584 25.9628L1.83057 24.9695C1.39017 25.0206 1.01133 25.0885 0.73386 25.207C0.623462 25.2541 0.315407 25.3937 0.130898 25.7311C0.020762 25.9325 -0.0271238 26.1738 0.0152926 26.4208C0.0544397 26.6488 0.15863 26.8147 0.23931 26.9155C0.386617 27.0994 0.563179 27.1999 0.637482 27.2401C0.732851 27.2917 0.824798 27.329 0.890944 27.3536C0.960385 27.3795 1.0228 27.3991 1.0668 27.4121C1.08937 27.4188 1.10854 27.4242 1.12311 27.4282C1.13043 27.4302 1.13667 27.4318 1.14171 27.4331C1.14423 27.4338 1.14645 27.4344 1.14836 27.4349C1.14932 27.4351 1.1502 27.4353 1.151 27.4355C1.1514 27.4356 1.15178 27.4357 1.15214 27.4358C1.15232 27.4359 1.15257 27.4359 1.15266 27.436C1.15291 27.436 1.15316 27.4361 1.3987 26.4667ZM7.92967 25.7866L7.92607 26.7866C10.149 26.7946 13.0688 26.8451 16.8913 26.9583L16.9209 25.9588L16.9505 24.9592C13.1167 24.8457 10.1786 24.7947 7.93328 24.7866L7.92967 25.7866ZM28.8726 26.4008L28.83 27.3999C29.3294 27.4212 29.8378 27.4431 30.355 27.4658L30.3987 26.4667L30.4424 25.4677C29.9244 25.445 29.4154 25.423 28.9152 25.4017L28.8726 26.4008ZM30.3987 26.4667V27.4667C31.143 27.4667 31.8598 27.3193 32.546 27.0559L32.1877 26.1223L31.8294 25.1887C31.348 25.3735 30.8736 25.4667 30.3987 25.4667V26.4667ZM37.5515 21.2606L38.3572 21.853C40.3704 19.1152 42.3243 15.6563 44.2601 12.4663L43.4052 11.9475L42.5503 11.4288C40.5623 14.7048 38.6893 18.0253 36.7459 20.6682L37.5515 21.2606ZM53.0958 1.294L53.4062 2.2446C53.9002 2.08328 54.3959 2.00001 54.8987 2L54.8987 1L54.8987 0C54.1702 1.87159e-05 53.4651 0.121404 52.7853 0.343414L53.0958 1.294ZM54.8987 1L54.8987 2C55.481 1.99999 56.0002 2.11153 56.478 2.31482L56.8695 1.39463L57.261 0.474452C56.5339 0.165118 55.7483 -2.18153e-05 54.8987 0L54.8987 1ZM61.9207 7.50379L61.028 7.95453C62.6233 11.1139 64.3018 15.2484 66.7447 18.7972L67.5684 18.2302L68.3921 17.6631C66.0506 14.2617 64.5137 10.4205 62.8133 7.05305L61.9207 7.50379ZM80.8741 26.3774L80.7839 27.3733C81.4642 27.435 82.1687 27.4667 82.8987 27.4667L82.8987 26.4667L82.8987 25.4667C82.2267 25.4667 81.5825 25.4375 80.9644 25.3815L80.8741 26.3774ZM82.8987 26.4667L82.8987 27.4667C83.3178 27.4667 83.73 27.4674 84.1354 27.4687L84.1386 26.4687L84.1418 25.4687C83.7343 25.4674 83.3199 25.4667 82.8987 25.4667L82.8987 26.4667ZM89.0569 26.519L89.039 27.5189C91.8881 27.5699 94.3125 27.655 96.3699 27.7593L96.4205 26.7605L96.4711 25.7618C94.3896 25.6564 91.9432 25.5706 89.0748 25.5192L89.0569 26.519ZM106.207 27.7182L106.02 28.7006C106.438 28.7802 106.713 28.8457 106.877 28.8887C106.959 28.9101 107.012 28.9259 107.041 28.9348C107.056 28.9393 107.064 28.942 107.067 28.9429C107.068 28.9434 107.068 28.9434 107.066 28.9429C107.066 28.9426 107.065 28.9422 107.063 28.9417C107.062 28.9415 107.062 28.9412 107.061 28.9409C107.06 28.9407 107.06 28.9406 107.059 28.9404C107.059 28.9403 107.059 28.9402 107.059 28.9401C107.059 28.9401 107.058 28.94 107.058 28.94C107.058 28.9399 107.058 28.9399 107.399 27.9997C107.739 27.0595 107.739 27.0595 107.739 27.0594C107.739 27.0594 107.739 27.0593 107.739 27.0593C107.738 27.0592 107.738 27.0591 107.738 27.059C107.737 27.0588 107.737 27.0586 107.736 27.0583C107.735 27.0579 107.734 27.0575 107.732 27.057C107.73 27.0561 107.727 27.055 107.724 27.0539C107.717 27.0516 107.709 27.049 107.7 27.046C107.682 27.0399 107.659 27.0324 107.63 27.0235C107.572 27.0057 107.492 26.9824 107.385 26.9543C107.171 26.8982 106.851 26.8229 106.394 26.7359L106.207 27.7182Z" fill="url(#paint0_linear_1012_713)"/>
          <defs>
            <linearGradient id="paint0_linear_1012_713" x1="6.48447" y1="3.99997" x2="104.398" y2="26.0771" gradientUnits="userSpaceOnUse">
              <stop offset="0.130208" stopColor="#0090FE"/>
              <stop offset="1" stopColor="#B4D3EF"/>
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Right: Form */}
      <form className="w-full max-w-xl md:ml-auto space-y-5">
        {/* Company size */}
        <div className="relative">
          <label className="sr-only" htmlFor="company-size">Company size</label>
          <select
            id="company-size"
            className="w-full bg-transparent border-b border-white/70 placeholder-white text-white outline-none appearance-none pb-2 pr-8"
            defaultValue="small"
          >
            <option value="small" className="text-black">Small</option>
            <option value="medium" className="text-black">Medium</option>
            <option value="large" className="text-black">Large</option>
          </select>
          <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 pr-1">▾</span>
        </div>

        {/* Email */}
        <div>
          <label className="sr-only" htmlFor="footer-email">Email</label>
          <input
            id="footer-email"
            type="email"
            placeholder="Email"
            className="w-full bg-transparent border-b border-white/70 placeholder-white text-white outline-none pb-2"
          />
        </div>

        {/* CTA input bar */}
        <div className="relative">
          <label className="sr-only" htmlFor="footer-message">Message</label>
          <input
            id="footer-message"
            type="text"
            placeholder="Let’s talk"
            className="h-12 sm:h-14 md:h-16 w-full rounded-md bg-white text-black font-agenda-regular text-lg sm:text-xl placeholder-black/70 pl-4 sm:pl-5 pr-14 sm:pr-16 outline-none"
          />
          <button
            type="submit"
            aria-label="Submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-md bg-[#1E9BFB] hover:bg-[#156DB0] transition flex items-center justify-center"
          >
            <span className="text-white text-xl leading-none">→</span>
          </button>
        </div>
      </form>
    </div>
  </div>

  {/* ===== DARK SECTION OVER FULL-BLEED IMAGE ===== */}
  <section className="relative">
    {/* background image */}
    {contactBackground?.url && (
      <StrapiImage
        src={contactBackground.url}
        alt={contactBackground.alternativeText || "background"}
        width={2000}
        height={1200}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
    )}

    {/* black panel with guttered sides */}
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="rounded-md bg-[#0F2633]/90 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
        {/* LINKS GRID */}
        <div className="px-5 sm:px-6 md:px-8 lg:px-10 py-8 sm:py-10 text-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10">
            {column?.map((col) => (
              <div key={col.title}>
                <h4 className="mb-3 text-base sm:text-lg font-semibold text-white/90">{col.title}</h4>
                <ul className="space-y-2 text-white/75">
                  {col.link?.map((l) =>
                    l.href ? (
                      <li key={l.id}>
                        <Link
                          href={l.href}
                          target={l.isExternal ? "_blank" : "_self"}
                          className="transition hover:text-white"
                        >
                          {l.text}
                        </Link>
                      </li>
                    ) : null
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* divider */}
        <div className="h-px bg-white/15" />

        {/* CTA strip INSIDE the black panel */}
        <div className="px-5 sm:px-6 md:px-8 lg:px-10 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 md:gap-10">
              {/* avatar cluster */}
              <div className="flex flex-row items-center justify-center sm:justify-start">
                <AnimatedTooltip items={people} />
              </div>

              {/* text */}
              <p className="mt-3 sm:mt-0 text-center sm:text-left text-base sm:text-lg md:text-xl font-agenda-medium tracking-wide text-white/90">
                Let’s explore how we can support your goals together.
              </p>
            </div>

            {/* button */}
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[#1E9BFB] px-4 py-2.5 sm:px-5 sm:py-3 font-medium text-white hover:bg-[#156DB0] transition"
            >
              Contact us
              <span className="inline-grid place-items-center h-6 w-6 rounded bg-white text-[#1E9BFB] text-sm leading-none">
                →
              </span>
            </Link>
          </div>
        </div>

        {/* divider */}
        <div className="h-px bg-white/15" />

        {/* CONTACT ROW (logo + address/email/phone) */}
        <div className="px-5 sm:px-6 md:px-8 lg:px-10 py-6 text-white">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              {logo?.image?.url && (
                <StrapiImage
                  src={logo.image.url}
                  alt={logo.image.alternativeText || ""}
                  width={170}
                  height={56}
                  className="opacity-95"
                />
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:auto-cols-fr md:grid-flow-col gap-4 sm:gap-6">
              {bottomLink?.map((item) => {
                const iconKey = String(item.icon || "").toLowerCase();
                return (
                  <Link
                    key={item.id}
                    href={item.url || "#"}
                    className="flex items-center gap-2 text-white/90 transition hover:text-white"
                  >
                    <span>{iconMap[iconKey] ?? <Globe className="h-4 w-4" />}</span>
                    <span className="text-sm md:text-base">{item.text}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* divider */}
        <div className="h-px bg-white/15" />

        {/* BOTTOM BAR */}
        <div className="px-5 sm:px-6 md:px-8 lg:px-10 py-6 text-white">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <p className="text-center md:text-left text-xs sm:text-sm text-white/60">
              © {new Date().getFullYear()} {copyrightText || "Your Company Name"}. All rights reserved.
            </p>

            <div className="flex items-center justify-center gap-2.5 sm:gap-3">
              {socialLink?.map((s) => {
                const iconKey = String(s.icon || "").toLowerCase();
                return s.url ? (
                  <Link
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    aria-label={iconKey}
                    className="rounded p-2 bg-white/10 hover:bg-white/20 transition"
                  >
                    {iconMap[iconKey] ?? <Globe className="h-4 w-4" />}
                  </Link>
                ) : null;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</footer>

  );
}

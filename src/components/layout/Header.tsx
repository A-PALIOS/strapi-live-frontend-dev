"use client";
import type { LinkProps, LogoProps } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { StrapiImage } from "../StrapiImage";
import { useState, useEffect } from "react";
 
interface HeaderProps {
  data: {
    logo: LogoProps;
    navigation: LinkProps[];
    cta: LinkProps;
  };
   overlay?: boolean; // 👈 new

}
 
export function Header({ data }: HeaderProps) {

  const pathname = usePathname();
  const overlay: boolean = pathname !== "/";

  const [isOpen, setIsOpen] = useState(false);
 
  if (!data) return null;
 
  const { logo, navigation, cta} = data;
 
  return (
 <header id="site-header" className={`w-full z-50 transition-colors duration-300 ${ overlay ? "fixed top-0 bg-transparent" : "fixed top-0 left-0 bg-transparent "}`} >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between rounded-md navbar-blur" style={{background: "#FFFFFFFF", marginTop: "20px", boxShadow: "0 8px 20px rgba(0, 0, 0, 0.25)"}}>
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <StrapiImage
            src={logo.image.url}
            alt={logo.image.alternativeText || "Logo"}
            width={120}
            height={120}
            className="h-10 w-auto ImageLogo transition"
          />
        </Link>
 
        <span className="text-sm font-medium text-gray-700 seperation" style={{color: "black", fontFamily: "agenda", fontStyle: "normal", fontSize: "25px", marginLeft: "12px", marginRight: "12px"}}>|</span>
 
        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8  navbar navbar-expand-lg navbar-light" >
          {navigation.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              target={item.isExternal ? "_blank" : "_self"}
              className="navigationDesk text-[#23292E] font-agenda-medium hover:text-blue-500 transition"
              style={{ fontSize: "22px" }}
            >
              {item.text}
            </Link>
          ))}
        </nav>
        </div>
 
        {/* CTA Button */}
        <div className="hidden md:block" style={{marginTop: "20px", marginRight: "100px"}}>
          <Link href={cta.href} target={cta.isExternal ? "_blank" : "_self"}>
            <button
  className="flex items-center gap-3 rounded-md bg-[#1E9BFB] px-6 py-3 text-base  text-white shadow hover:bg-[#0f8ed6] transition contact" style={{height: "74px"}}
>
  <span id = "ContactFont"  style = {{color: "white", fontFamily: "agenda", fontStyle: "normal", fontSize: "18px"}}>{cta.text}</span>
  <span className="flex items-center justify-center w-7 h-7 bg-white rounded-md">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4 text-[#1E9BFB]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M7 7h10v10" />
    </svg>
  </span>
</button>
 
 
 
          </Link>
        </div>
 
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-700 hover:text-blue-600 focus:outline-none"
          aria-label="Toggle menu"
         
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>
 
      {/* Mobile Menu Items */}
      {isOpen && (
        <div className="md:hidden px-6 pb-4">
          <nav className="flex flex-col gap-4 mb-4">
            {navigation.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                target={item.isExternal ? "_blank" : "_self"}
                className="text-base font-medium text-gray-800 hover:text-blue-500 transition"
              >
                {item.text}
              </Link>
            ))}
          </nav>
          <Link href={cta.href} target={cta.isExternal ? "_blank" : "_self"}>
            <button className="w-full text-blue-500 border border-blue-500 rounded-full px-4 py-2 text-sm font-medium hover:bg-blue-50 transition">
              {cta.text} <span className="ml-1">→</span>
            </button>
          </Link>
        </div>
      )}
    </header>
   
   
  );
}
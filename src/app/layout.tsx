import type { Metadata } from "next";
import Script from "next/script";
import { Roboto } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import "flickity/css/flickity.css";

import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getGlobalSettings } from "@/data/loaders";
import { NavProgressProvider } from '../components/NavProgressProvider';
import DapperTransition from '../components/DapperTransition';
import { CookieConsent } from '@/components/ui/CookieConsent';
// import { StickyMenu } from "@/components/StickyMenu";

const roboto = Roboto({
  variable: "--font-sans", // Updated to match your globals.css usage
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cmtprooptiki.gr"),
  title: "CMT Prooptiki",
  description: "We Have the know-how and the experience",
  icons: {
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    images: [{ url: "/apple-touch-icon.png" }],
  },
};

async function loader() {
  try {
    const { data } = await getGlobalSettings();
    return { header: data?.header ?? null, footer: data?.footer ?? null };
  } catch {
    return { header: null, footer: null };
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { header, footer } = await loader();
  return (
    <html lang="en">
            <head>
              <link rel="canonical" href="https://cmtprooptiki.gr" />

<link rel="stylesheet" href="https://use.typekit.net/wtb8azc.css"/>
      <link rel="stylesheet" href="https://use.typekit.net/vfu6mno.css"/>
 
       <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Playfair+Display:ital,wght@1,400;1,600&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="https://unpkg.com/flickity@2/dist/flickity.min.css" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000" />
            </head>

      <body
        className={`${roboto.variable} ${geistMono.variable} antialiased`}
      >
        <NavProgressProvider>
        <Header data={header} />
        <DapperTransition />
        {/* <StickyMenu /> */}
        <main >
          {children}
        </main>
        </NavProgressProvider>
        <Footer data={footer} />
        <CookieConsent />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-X2Q6YHTTWW"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-X2Q6YHTTWW');
          `}
        </Script>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import ClientHeader from "@/components/ClientHeader";
import Footer from "@/components/Footer";
import NewsletterSection from "@/components/NewsletterSection";
import InstagramSection from "@/components/InstagramSection";
import ErrorBoundaryWrapper from "@/components/ErrorBoundary";
import CookieConsent from "@/components/CookieConsent";
import Script from "next/script";
import { Suspense } from "react";
import VisitNotifier from "@/components/VisitNotifier";
import FacebookPixel from "@/components/FacebookPixel";
import { AdminRouteCheck, PublicRouteOnly, AdminRouteOnly, CheckoutRouteOnly } from "@/components/AdminRouteCheck";
import GlobalErrorReporter from "@/components/GlobalErrorReporter";
import TidioChat from "@/components/TidioChat";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cokaro - Power Your Outdoor and Home Projects With Confidence",
  description: "Shop lawn mowers, power tools, portable generators, and garden essentials at Cokaro. Reliable outdoor equipment for every task. Fast shipping, fair prices, and secure checkout.",
  keywords: "Cokaro, lawn mowers, power tools, portable generators, garden equipment, outdoor power equipment, ride mowers, garden essentials, outdoor tools, home improvement, power equipment",
  authors: [{ name: "Cokaro" }],
  creator: "Cokaro",
  publisher: "Cokaro",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://cokaro.com"),
  openGraph: {
    title: "Cokaro - Power Your Outdoor and Home Projects With Confidence",
    description: "Shop lawn mowers, power tools, portable generators, and garden essentials at Cokaro. Reliable outdoor equipment for every task.",
    url: "https://cokaro.com",
    siteName: "Cokaro",
    images: [
      {
        url: "/g7x.jpeg",
        width: 1200,
        height: 630,
        alt: "Cokaro - Outdoor Power Equipment & Garden Essentials",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cokaro - Power Your Outdoor and Home Projects With Confidence",
    description: "Shop lawn mowers, power tools, portable generators, and garden essentials at Cokaro. Reliable outdoor equipment for every task.",
    images: ["/g7x.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "aGkqoI_eCG0h2qF377pXezPaxovx1V-MeOiyeYD5Ngg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="preload" href="/logosvg.svg" as="image" type="image/svg+xml" />
        {/* Facebook Domain Verification */}
        <meta name="facebook-domain-verification" content="k3ytyf6hqaa462mz10uzwnmugj0d0o" />
        <meta name="msvalidate.01" content="75494FC1101908256EEEA046C47C3264" />
      </head>
      <body suppressHydrationWarning className={`${dmSans.variable} font-sans antialiased text-[#262626]`}>
        <GlobalErrorReporter />
        <Suspense fallback={null}>
          <FacebookPixel />
        </Suspense>
        <PublicRouteOnly>
          <VisitNotifier />
        </PublicRouteOnly>
        {/* Organization Schema */}
        <AdminRouteCheck>
          <Script
            id="organization-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Cokaro",
                "url": "https://cokaro.com",
                "logo": "https://cokaro.com/logosvg.svg",
                "description": "Cokaro - Power Your Outdoor and Home Projects With Confidence. Discover reliable lawn mowers, power tools, generators, and garden essentials.",
                "sameAs": [
                  "https://www.tiktok.com/@deel_depot",
                  "https://www.instagram.com/deel_depot/",
                  "https://fr.pinterest.com/deel_depot/_profile/"
                ],
                "contactPoint": {
                  "@type": "ContactPoint",
                  "contactType": "customer service",
                  "email": "contact@cokaro.com",
                  "telephone": "+19129231747",
                  "areaServed": ["GB", "US"]
                },
                "address": [
                  {
                    "@type": "PostalAddress",
                    "streetAddress": "20 Matlock Cl",
                    "addressLocality": "London",
                    "addressRegion": "Greater London",
                    "postalCode": "SE24 0BB",
                    "addressCountry": "GB"
                  },
                  {
                    "@type": "PostalAddress",
                    "streetAddress": "1249 Coney Island Ave",
                    "addressLocality": "Brooklyn",
                    "addressRegion": "NY",
                    "postalCode": "11230",
                    "addressCountry": "US"
                  }
                ]
              })
            }}
          />
        </AdminRouteCheck>

        {/* WebSite Schema */}
        <AdminRouteCheck>
          <Script
            id="website-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "Cokaro",
                "url": "https://cokaro.com",
                "description": "Cokaro - Power Your Outdoor and Home Projects With Confidence. Discover reliable lawn mowers, power tools, generators, and garden essentials.",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": "https://cokaro.com/api/products/search?q={search_term_string}"
                  },
                  "query-input": "required name=search_term_string"
                }
              })
            }}
          />
        </AdminRouteCheck>

        <ErrorBoundaryWrapper>
          {/* Public website with header, footer, etc. */}
          <PublicRouteOnly>
            <div className="min-h-screen flex flex-col">
              <Suspense fallback={null}>
                <ClientHeader />
              </Suspense>
              <main className="flex-grow">
                {children}
              </main>
              <Suspense fallback={null}>
                <InstagramSection />
              </Suspense>
              <NewsletterSection />
              <div className="h-4 bg-white md:h-6" aria-hidden="true" />
              <Footer />
            </div>
            <CookieConsent />
          </PublicRouteOnly>

          {/* Checkout page - navbar only, no distractions */}
          <CheckoutRouteOnly>
            <div className="min-h-screen flex flex-col">
              <Suspense fallback={null}>
                <ClientHeader />
              </Suspense>
              <main className="flex-grow">
                {children}
              </main>
            </div>
          </CheckoutRouteOnly>

          {/* Admin dashboard - clean, no public UI */}
          <AdminRouteOnly>
            {children}
          </AdminRouteOnly>
        </ErrorBoundaryWrapper>

        <AdminRouteCheck>
          <Script
            src="https://analyticsapp-five.vercel.app/tracker.js"
            strategy="afterInteractive"
            async
          />
        </AdminRouteCheck>
        <TidioChat />
        <SpeedInsights />
      </body>
    </html>
  );
}

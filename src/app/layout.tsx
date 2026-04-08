import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import LenisProvider from "@/components/providers/lenis-provider";
import Footer from "@/components/layout/Footer";

const springTransition = { type: "spring" as const, stiffness: 350, damping: 30 };

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Maple Leaf Trading Ltd. | Premium B2B Merchandising",
  description: "Sophisticated branding, commercial signage, and custom apparel solutions based in Canada. Serving Vancouver and nationwide.",
  keywords: ["Custom Embroidery Vancouver", "Commercial Signage Canada", "B2B Merchandising", "Maple Leaf Trading"],
  authors: [{ name: "Maple Leaf Trading Ltd." }],
  robots: "index, follow",
};

import UnifiedNav from "@/components/layout/UnifiedNav";
import PageTransitions from "@/components/providers/page-transitions";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Maple Leaf Trading Ltd.",
    "image": "https://mapleleaf-trading.ca/logo.png",
    "@id": "",
    "url": "https://mapleleaf-trading.ca",
    "telephone": "+16040000000",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Business Way",
      "addressLocality": "Vancouver",
      "addressRegion": "BC",
      "postalCode": "V6B 1A1",
      "addressCountry": "CA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 49.2827,
      "longitude": -123.1207
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "09:00",
      "closes": "17:00"
    },
    "sameAs": [
      "https://www.facebook.com/mapleleaf-trading",
      "https://www.instagram.com/mapleleaf-trading"
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-[#0F1117] selection:bg-primary/30`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <QueryProvider>
            <LenisProvider>
              <UnifiedNav />
              <PageTransitions>
                <div className="relative z-10 flex flex-col min-h-screen transition-all">
                  {children}
                  <Footer />
                </div>
              </PageTransitions>
            </LenisProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

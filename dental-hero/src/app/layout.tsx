import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Lumière Dental | Premium Modern Dentistry",
    template: "%s | Lumière Dental",
  },
  description: "Advanced dentistry meets luxury design. Experience modern dental care with precision technology, personalized treatment, and exceptional results in New York.",
  keywords: ["dentist", "dental", "cosmetic dentistry", "dental implants", "veneers", "teeth whitening", "smile makeover", "New York dentist", "premium dental care"],
  authors: [{ name: "Lumière Dental" }],
  creator: "Lumière Dental",
  publisher: "Lumière Dental",
  metadataBase: new URL("https://lumieredental.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://lumieredental.com",
    siteName: "Lumière Dental",
    title: "Lumière Dental | Premium Modern Dentistry",
    description: "Advanced dentistry meets luxury design. Experience modern dental care with precision technology and personalized treatment.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Lumière Dental - Premium Modern Dentistry",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumière Dental | Premium Modern Dentistry",
    description: "Advanced dentistry meets luxury design. Experience modern dental care with precision technology and personalized treatment.",
    images: ["/og-image.jpg"],
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
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: "Lumière Dental",
    image: "https://lumieredental.com/logo.png",
    url: "https://lumieredental.com",
    telephone: "+1234567890",
    email: "hello@lumieredental.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Dental Avenue, Suite 200",
      addressLocality: "New York",
      addressRegion: "NY",
      postalCode: "10001",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 40.7128,
      longitude: -74.006,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "14:00",
      },
    ],
    priceRange: "$$$",
    areaServed: {
      "@type": "City",
      name: "New York",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Dental Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "MedicalProcedure",
            name: "Smile Makeover",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "MedicalProcedure",
            name: "Dental Implants",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "MedicalProcedure",
            name: "Veneers",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "MedicalProcedure",
            name: "Teeth Whitening",
          },
        },
      ],
    },
  };

  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

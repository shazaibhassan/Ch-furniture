import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Toaster } from "sonner";
import { getSettings } from "@/lib/settings";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ch-furniture.vercel.app";

// Dynamic, SEO-friendly metadata pulled from editable Settings.
export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings().catch(() => null);
  const title = s?.seoTitle || "CH FURNITURE | Premium Wooden Furniture Manufacturer in Sialkot, Pakistan";
  const description =
    s?.seoDescription ||
    "CH FURNITURE manufactures premium custom wooden furniture in Sialkot, Pakistan.";
  const keywords = s?.seoKeywords || "";
  const ogImage = s?.ogImageUrl || `${SITE_URL}/og-default.jpg`;

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: "%s | CH FURNITURE" },
    description,
    keywords: keywords.split(",").map((k) => k.trim()).filter(Boolean),
    authors: [{ name: "CH FURNITURE" }],
    openGraph: {
      type: "website",
      title,
      description,
      siteName: "CH FURNITURE",
      url: SITE_URL,
      images: [{ url: ogImage, width: 1200, height: 630, alt: "CH FURNITURE" }],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
    alternates: { canonical: SITE_URL },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["FurnitureStore", "LocalBusiness"],
    name: "CH FURNITURE",
    description: "Premium custom wooden furniture manufacturer based in Sialkot, Pakistan. We craft sofas, beds, dining sets, wardrobes, carved furniture, and custom pieces.",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    telephone: "+92-341-6309652",
    email: "info@chfurniture.com",
    priceRange: "$$",
    currenciesAccepted: "PKR",
    paymentAccepted: "Cash, Bank Transfer",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Mohala Sardaaran, Near HBL Bank, Kalaswala",
      addressLocality: "Pasrur",
      addressRegion: "Sialkot, Punjab",
      addressCountry: "PK",
      postalCode: "51310",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "32.2608",
      longitude: "74.6618",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
      opens: "09:00",
      closes: "20:00",
    },
    sameAs: [],
  };

  return (
    <html lang="en" className={`${display.variable} ${sans.variable} dark`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Toaster
          theme="dark"
          position="bottom-center"
          toastOptions={{ style: { background: "#2B2118", color: "#EDE6DA", border: "1px solid rgba(176,141,87,0.3)" } }}
        />
      </body>
    </html>
  );
}

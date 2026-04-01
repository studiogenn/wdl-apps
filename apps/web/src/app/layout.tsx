import type { Metadata } from "next";
import { Zilla_Slab, DM_Sans } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { DraftBanner } from "@/components/editor/draft-banner";
import { PostHogProvider } from "@/components/analytics/posthog-provider";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { FacebookPixel } from "@/components/analytics/facebook-pixel";
import "./globals.css";

const zillaSlab = Zilla_Slab({
  variable: "--font-zilla-slab",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "We Deliver Laundry | Pickup & Delivery Within 24 Hours",
    template: "%s | We Deliver Laundry",
  },
  description:
    "Professional laundry pickup and delivery service. Washed, folded, and returned within 24 hours. Free delivery for weekly customers.",
  metadataBase: new URL("https://wedeliverlaundry.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "We Deliver Laundry",
    images: [
      {
        url: "/logo/og-image.png",
        width: 1080,
        height: 1080,
        alt: "We Deliver Laundry",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${zillaSlab.variable} ${dmSans.variable}`}
    >
      <body>
        <PostHogProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <DraftBanner />
        </PostHogProvider>
        <GoogleAnalytics />
        <FacebookPixel />
      </body>
    </html>
  );
}

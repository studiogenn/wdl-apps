import type { Metadata } from "next";
import type { JsonType } from "posthog-js";
import { Zilla_Slab, DM_Sans } from "next/font/google";
import { headers } from "next/headers";
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const visitorId = headersList.get("x-wdl-visitor-id") || undefined;
  const abVariant = headersList.get("x-wdl-ab-variant") || undefined;
  const flagsRaw = headersList.get("x-wdl-flags");
  const payloadsRaw = headersList.get("x-wdl-flag-payloads");

  const bootstrapFlags = flagsRaw
    ? (JSON.parse(decodeURIComponent(flagsRaw)) as Record<string, string | boolean>)
    : undefined;
  const bootstrapPayloads = payloadsRaw
    ? (JSON.parse(decodeURIComponent(payloadsRaw)) as Record<string, JsonType>)
    : undefined;

  return (
    <html
      lang="en"
      className={`${zillaSlab.variable} ${dmSans.variable}`}
    >
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-T53NGMDS');`,
          }}
        />
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-T53NGMDS"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <PostHogProvider
          visitorId={visitorId}
          abVariant={abVariant}
          bootstrapFlags={bootstrapFlags}
          bootstrapPayloads={bootstrapPayloads}
        >
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

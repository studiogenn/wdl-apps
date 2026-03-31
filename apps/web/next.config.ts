import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname, ".."),
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wedeliverlaundry.com",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
  async rewrites() {
    return [
      // Proxy PostHog through our domain to avoid ad blockers
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
      {
        source: "/ingest/decide",
        destination: "https://us.i.posthog.com/decide",
      },
    ];
  },
  async headers() {
    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    ];
    return [
      {
        // Account pages need iframes for CleanCloud payment widget
        source: "/account/:path*",
        headers: securityHeaders,
      },
      {
        // All other pages get full clickjacking protection
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          ...securityHeaders,
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Old route -> new route redirects
      { source: "/my-account", destination: "/account", permanent: true },
      { source: "/services-pricing", destination: "/wash-fold", permanent: true },
      { source: "/who-we-are", destination: "/our-story", permanent: true },
      { source: "/locations", destination: "/service-areas", permanent: true },
      { source: "/locations/:slug", destination: "/service-areas", permanent: true },
      { source: "/commercial", destination: "/commercial-laundry", permanent: true },
      { source: "/commercial/:slug", destination: "/commercial-laundry", permanent: true },
      { source: "/how-it-works", destination: "/#how-it-works", permanent: true },
      { source: "/affiliates", destination: "/refer-a-friend", permanent: true },
      // Legacy WordPress redirects
      { source: "/spa-salon-laundry-service", destination: "/commercial-laundry", permanent: true },
      { source: "/hotels-laundry-service", destination: "/commercial-laundry", permanent: true },
      { source: "/airbnb-laundry-service", destination: "/commercial-laundry", permanent: true },
      { source: "/apartments-laundry-service", destination: "/commercial-laundry", permanent: true },
      { source: "/b2b-landing-page", destination: "/commercial-laundry", permanent: true },
      { source: "/price-plans", destination: "/wash-fold", permanent: true },
      // Regional
      { source: "/new-jersey-laundry-pickup-delivery", destination: "/areas/new-jersey", permanent: true },
      { source: "/new-york-city-pickup-delivery", destination: "/areas/new-york", permanent: true },
      { source: "/tribeca-manhattan-ny", destination: "/service-areas", permanent: true },
      // Functional
      { source: "/contact-us-2", destination: "/contact", permanent: true },
      { source: "/how-to-order-tutorial", destination: "/how-to-order", permanent: true },
      { source: "/affiliate-partners", destination: "/refer-a-friend", permanent: true },
      // Legal
      { source: "/privacy-policy-v2", destination: "/privacy", permanent: true },
      { source: "/terms-of-service", destination: "/terms", permanent: true },
      { source: "/tos-v2-copy", destination: "/terms", permanent: true },
    ];
  },
};

export default nextConfig;

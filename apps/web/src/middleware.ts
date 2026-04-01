import { NextRequest, NextResponse } from "next/server";
import { getPostHogServer } from "@/lib/posthog-server";
import { resolveLocation } from "@/lib/geo";
import { FLAG_KEYS } from "@/lib/feature-flags";

// CF worker sets ab_visitor_id; fall back to legacy wdl_visitor_id or generate new
const AB_VISITOR_COOKIE = "ab_visitor_id";
const LEGACY_VISITOR_COOKIE = "wdl_visitor_id";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function generateVisitorId(): string {
  return crypto.randomUUID();
}

export async function middleware(request: NextRequest) {
  const abVisitorId = request.cookies.get(AB_VISITOR_COOKIE)?.value;
  const legacyVisitorId = request.cookies.get(LEGACY_VISITOR_COOKIE)?.value;
  const visitorId = abVisitorId || legacyVisitorId || generateVisitorId();
  const isNewVisitor = !abVisitorId && !legacyVisitorId;

  const city = request.headers.get("x-vercel-ip-city") || "";
  const region = request.headers.get("x-vercel-ip-country-region") || "";
  const country = request.headers.get("x-vercel-ip-country") || "";

  const resolved = resolveLocation(city, region, country);
  const matchedLocation = resolved?.location.slug || "";

  let flags: Record<string, string | boolean> = {};
  let flagPayloads: Record<string, unknown> = {};

  try {
    const posthog = getPostHogServer();
    const allFlags = await posthog.getAllFlags(visitorId, {
      personProperties: {
        city,
        region,
        country,
        matched_location: matchedLocation,
        is_returning: isNewVisitor ? "false" : "true",
      },
    });

    flags = allFlags;

    const payloadPromises = Object.keys(allFlags).map(async (key) => {
      const payload = await posthog.getFeatureFlagPayload(key, visitorId);
      return [key, payload] as const;
    });
    const payloadEntries = await Promise.all(payloadPromises);
    flagPayloads = Object.fromEntries(
      payloadEntries.filter(([, v]) => v !== undefined)
    );
  } catch {
    // Flag evaluation failed — continue with defaults
  }

  const pathname = request.nextUrl.pathname;
  let response: NextResponse;

  const newAccountEnabled = flags[FLAG_KEYS.NEW_ACCOUNT] === true;

  if (newAccountEnabled && (pathname === "/account" || pathname === "/account/manage")) {
    const url = request.nextUrl.clone();
    url.pathname = "/account/dashboard";
    response = NextResponse.rewrite(url);
  } else if (pathname === "/account") {
    // Signup flow A/B test: rewrite /account to the assigned variant
    const variant = flags[FLAG_KEYS.SIGNUP_FLOW];

    if (variant === "quick") {
      const url = request.nextUrl.clone();
      url.pathname = "/account/quick";
      response = NextResponse.rewrite(url);
    } else if (variant === "guided") {
      const url = request.nextUrl.clone();
      url.pathname = "/account/guided";
      response = NextResponse.rewrite(url);
    } else {
      response = NextResponse.next();
    }
  } else {
    response = NextResponse.next();
  }

  // Set visitor ID cookie (only for direct Vercel access without CF worker)
  if (isNewVisitor) {
    response.cookies.set(AB_VISITOR_COOKIE, visitorId, {
      maxAge: COOKIE_MAX_AGE,
      path: "/",
      httpOnly: false,
      sameSite: "lax",
    });
  }

  // A/B variant assigned by CF worker (passed as request header on proxy)
  const abVariant = request.headers.get("X-AB-Variant") || "";

  // Set response headers for downstream components
  // Encode values to ASCII-safe strings for edge runtime header compatibility
  response.headers.set("x-wdl-visitor-id", visitorId);
  response.headers.set("x-wdl-ab-variant", abVariant);
  response.headers.set("x-wdl-geo-city", encodeURIComponent(city));
  response.headers.set("x-wdl-geo-region", encodeURIComponent(region));
  response.headers.set("x-wdl-geo-country", encodeURIComponent(country));
  response.headers.set("x-wdl-matched-location", matchedLocation);
  response.headers.set("x-wdl-flags", encodeURIComponent(JSON.stringify(flags)));
  response.headers.set("x-wdl-flag-payloads", encodeURIComponent(JSON.stringify(flagPayloads)));

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|images|favicon\\.ico|api|ingest).*)",
  ],
};

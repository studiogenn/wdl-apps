import { NextRequest, NextResponse } from "next/server";
import { resolveLocation } from "@/lib/geo";

export async function middleware(request: NextRequest) {
  const city = request.headers.get("x-vercel-ip-city") || "";
  const region = request.headers.get("x-vercel-ip-country-region") || "";
  const country = request.headers.get("x-vercel-ip-country") || "";

  const resolved = resolveLocation(city, region, country);
  const matchedLocation = resolved?.location.slug || "";

  const response = NextResponse.next();

  response.headers.set("x-wdl-geo-city", encodeURIComponent(city));
  response.headers.set("x-wdl-geo-region", encodeURIComponent(region));
  response.headers.set("x-wdl-geo-country", encodeURIComponent(country));
  response.headers.set("x-wdl-matched-location", matchedLocation);

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|images|favicon\\.ico|api|ingest).*)",
  ],
};

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const WEBHOOK_URL = process.env.BEHEMOUTH_API_URL
  ? `${process.env.BEHEMOUTH_API_URL.replace(/\/+$/, "")}/webhooks/ingest/commercial`
  : "https://arkad.studio/webhooks/ingest/commercial";
const INGEST_API_KEY = process.env.INGEST_API_KEY || "";

const leadSchema = z.object({
  contact_name: z.string().min(1, "Contact name is required"),
  company_name: z.string().min(1, "Company name is required"),
  email: z.string().email("Invalid email address"),
  location: z.string().min(1, "Location is required"),
  lbs_per_week: z.enum(["under_50", "50_200", "200_500", "500_plus"]),
  vertical: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = leadSchema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.issues[0]?.message ?? "Invalid input";
      return NextResponse.json({ success: false, error: firstError }, { status: 400 });
    }

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": INGEST_API_KEY,
      },
      body: JSON.stringify({
        ...result.data,
        source: "commercial_landing_page",
        submitted_at: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`Commercial lead webhook failed: ${response.status} ${text}`);
      return NextResponse.json({ success: false, error: "Failed to submit" }, { status: 502 });
    }

    const data = await response.json().catch(() => ({}));
    return NextResponse.json({ success: true, event_id: data.event_id });
  } catch (error) {
    console.error("Commercial lead error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

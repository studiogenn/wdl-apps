import { NextRequest, NextResponse } from "next/server";

const INGEST_URL = process.env.BEHEMOUTH_API_URL
  ? `${process.env.BEHEMOUTH_API_URL.replace(/\/+$/, "")}/webhooks/ingest/website`
  : "https://arkad.studio/webhooks/ingest/website";
const INGEST_API_KEY = process.env.INGEST_API_KEY || "";

const GHL_WEBHOOK_URL =
  "https://services.leadconnectorhq.com/hooks/kYL3p6cPkbGZcnO5aLCt/webhook-trigger/4c8a4ee6-8558-4f75-bf12-bddab1749869";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { first_name, last_name, email } = body;
    if (!first_name || !last_name || !email) {
      return NextResponse.json(
        { error: "first_name, last_name, and email are required" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const response = await fetch(INGEST_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": INGEST_API_KEY,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`Ingest webhook failed: ${response.status} ${text}`);
      return NextResponse.json(
        { error: "Failed to submit form" },
        { status: 502 }
      );
    }

    const data = await response.json();

    // Send commercial leads to GHL webhook (fire and forget)
    if (body.form_type === "commercial_inquiry") {
      fetch(GHL_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name,
          last_name,
          email,
          phone: body.phone || "",
          location: body.location || "",
          message: body.message || "",
          source: "commercial-laundry-page",
        }),
      }).catch((err) => console.error("GHL webhook error:", err));
    }

    return NextResponse.json({ status: "submitted", event_id: data.event_id });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

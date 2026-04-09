import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { leads } from "@/lib/db/schema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { first_name, last_name, email, phone, message } = body;
    if (!first_name || !last_name || !email) {
      return NextResponse.json(
        { error: "first_name, last_name, and email are required" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const db = getDb();
    const [lead] = await db
      .insert(leads)
      .values({
        type: "website_contact",
        firstName: first_name,
        lastName: last_name,
        email,
        phone: phone ?? null,
        message: message ?? null,
        source: "website_contact_form",
        metadata: body,
      })
      .returning({ id: leads.id });

    return NextResponse.json({ status: "submitted", event_id: lead?.id });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

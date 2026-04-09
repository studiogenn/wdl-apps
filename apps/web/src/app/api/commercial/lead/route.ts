import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { leads } from "@/lib/db/schema";

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

    const db = getDb();
    const [lead] = await db
      .insert(leads)
      .values({
        type: "commercial_lead",
        firstName: result.data.contact_name,
        email: result.data.email,
        location: result.data.location,
        companyName: result.data.company_name,
        lbsPerWeek: result.data.lbs_per_week,
        vertical: result.data.vertical ?? null,
        source: "commercial_landing_page",
        metadata: { ...result.data, submitted_at: new Date().toISOString() },
      })
      .returning({ id: leads.id });

    return NextResponse.json({ success: true, event_id: lead?.id });
  } catch (error) {
    console.error("Commercial lead error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { getsql } from "@/lib/db/connection";

const windowsSchema = z.object({
  routeId: z.number().int().positive(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = windowsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      );
    }

    const sql = getsql();

    const rows = await sql`
      SELECT
        date,
        window_start AS "windowStart",
        window_end AS "windowEnd"
      FROM operations.agent_available_windows
      WHERE route_id = ${parsed.data.routeId}
        AND window_type = 'pickup'
        AND date >= CURRENT_DATE
      ORDER BY date, window_start
    `;

    // Group by date
    const byDate = new Map<string, { windowStart: string; windowEnd: string }[]>();
    for (const row of rows) {
      const key = (row.date as Date).toISOString().split("T")[0];
      if (!byDate.has(key)) byDate.set(key, []);
      byDate.get(key)!.push({
        windowStart: row.windowStart as string,
        windowEnd: row.windowEnd as string,
      });
    }

    const dates = Array.from(byDate.entries()).map(([date, windows]) => ({
      date,
      slots: windows.map((w) => `${w.windowStart}–${w.windowEnd}`),
    }));

    return NextResponse.json({ success: true, data: { dates } });
  } catch {
    return NextResponse.json(
      { success: false, error: "Unable to load available windows." },
      { status: 500 },
    );
  }
}

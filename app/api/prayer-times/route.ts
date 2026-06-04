import { NextResponse } from "next/server";
import { getPrayerTimes } from "@/lib/quran";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const city = url.searchParams.get("city") || "Jakarta";
    const country = url.searchParams.get("country") || "Indonesia";
    const data = await getPrayerTimes(city, country);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to load prayer times" }, { status: 500 });
  }
}

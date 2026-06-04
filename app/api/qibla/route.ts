import { NextResponse } from "next/server";
import { getQibla } from "@/lib/quran";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const lat = Number(url.searchParams.get("lat"));
    const lng = Number(url.searchParams.get("lng"));
    const data = await getQibla(lat, lng);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to load qibla" }, { status: 500 });
  }
}

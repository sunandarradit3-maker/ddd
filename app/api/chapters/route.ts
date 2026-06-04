import { NextResponse } from "next/server";
import { getChapters } from "@/lib/quran";

export async function GET() {
  try {
    const data = await getChapters();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to load chapters" }, { status: 500 });
  }
}

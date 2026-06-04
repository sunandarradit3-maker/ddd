import { NextResponse } from "next/server";
import { getJuz } from "@/lib/quran";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await getJuz(id);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to load juz" }, { status: 500 });
  }
}

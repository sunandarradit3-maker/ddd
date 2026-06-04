import { NextResponse } from "next/server";
import { getTafsir } from "@/lib/quran";

export async function GET(_: Request, { params }: { params: Promise<{ surahId: string; ayahNumber: string }> }) {
  try {
    const { surahId, ayahNumber } = await params;
    const data = await getTafsir(Number(surahId), Number(ayahNumber));
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to load tafsir" }, { status: 500 });
  }
}

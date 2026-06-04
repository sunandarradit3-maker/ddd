import { NextResponse } from "next/server";
import { askQuran } from "@/lib/quran";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const question = String(body.question || "");
    if (!question.trim()) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }
    const data = await askQuran(question);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to answer" }, { status: 500 });
  }
}

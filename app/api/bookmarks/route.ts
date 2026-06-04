import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const userId = getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await prisma.bookmark.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const userId = getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const saved = await prisma.bookmark.create({
    data: {
      userId,
      type: body.type,
      refId: body.refId,
      title: body.title,
    },
  });
  return NextResponse.json(saved);
}

export async function DELETE(req: Request) {
  const userId = getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { refId } = await req.json();
  await prisma.bookmark.deleteMany({ where: { userId, refId } });
  return NextResponse.json({ ok: true });
}

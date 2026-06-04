import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { setSession } from "@/lib/session";

export async function POST(req: Request) {
  const body = await req.json();
  const email = String(body.email || "").toLowerCase().trim();
  const name = String(body.name || "").trim();
  const password = String(body.password || "");

  if (!email || !password) return NextResponse.json({ error: "Email and password required" }, { status: 400 });

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return NextResponse.json({ error: "Email already used" }, { status: 409 });

  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash: hashPassword(password),
    },
  });

  setSession(user.id);
  return NextResponse.json({ id: user.id, email: user.email, name: user.name });
}

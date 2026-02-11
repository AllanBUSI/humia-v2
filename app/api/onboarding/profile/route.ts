import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { firstName, lastName, jobTitle, phone } = await request.json();

  await prisma.user.update({
    where: { id: session.user.id },
    data: { firstName, lastName, jobTitle, phone },
  });

  return NextResponse.json({ ok: true });
}

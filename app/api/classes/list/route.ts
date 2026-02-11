import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const classes = await prisma.classroom.findMany({
    where: { ownerId: session.user.id },
    select: { id: true, name: true, color: true, schoolId: true, school: { select: { name: true } } },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(classes);
}

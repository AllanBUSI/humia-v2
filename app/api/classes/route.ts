import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const classes = await prisma.classroom.findMany({
    where: { ownerId: session.user.id },
    include: {
      school: { select: { name: true } },
      _count: { select: { students: true, sessions: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(classes);
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { schoolId, name, level, year, color } = await request.json();

  if (!schoolId || !name) {
    return NextResponse.json(
      { error: "L'établissement et le nom sont requis" },
      { status: 400 }
    );
  }

  const school = await prisma.school.findFirst({
    where: { id: schoolId, ownerId: session.user.id },
  });
  if (!school) {
    return NextResponse.json({ error: "Établissement introuvable" }, { status: 404 });
  }

  const classroom = await prisma.classroom.create({
    data: {
      ownerId: session.user.id,
      schoolId,
      name,
      level: level || null,
      year: year || null,
      color: color || "#7c3aed",
    },
  });

  return NextResponse.json(classroom);
}

export async function DELETE(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await request.json();

  await prisma.classroom.deleteMany({
    where: { id, ownerId: session.user.id },
  });

  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getUserRole, getOwnerId } from "@/lib/roles";

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userRole = await getUserRole(session.user.id);
  const ownerId = getOwnerId(userRole);

  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get("studentId");
  const classroomId = searchParams.get("classroomId");

  const where: Record<string, unknown> = { ownerId };
  if (studentId) where.studentId = studentId;
  if (classroomId) {
    where.student = { classroomId };
  }

  const grades = await prisma.grade.findMany({
    where,
    include: {
      student: {
        select: {
          firstName: true,
          lastName: true,
          classroom: { select: { name: true, color: true } },
        },
      },
      author: { select: { firstName: true, lastName: true } },
    },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(grades);
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userRole = await getUserRole(session.user.id);
  const ownerId = getOwnerId(userRole);

  const { studentId, value, maxValue, subject, comment, date } = await request.json();

  if (!studentId || value === undefined) {
    return NextResponse.json(
      { error: "L'élève et la note sont requis" },
      { status: 400 }
    );
  }

  // Verify student belongs to this org
  const student = await prisma.student.findFirst({
    where: { id: studentId, ownerId },
  });
  if (!student) {
    return NextResponse.json({ error: "Élève introuvable" }, { status: 404 });
  }

  const grade = await prisma.grade.create({
    data: {
      ownerId,
      authorId: session.user.id,
      studentId,
      value: parseFloat(value),
      maxValue: maxValue ? parseFloat(maxValue) : 20,
      subject: subject || null,
      comment: comment || null,
      date: date ? new Date(date) : new Date(),
    },
  });

  return NextResponse.json(grade);
}

export async function DELETE(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userRole = await getUserRole(session.user.id);
  const ownerId = getOwnerId(userRole);

  const { id } = await request.json();

  await prisma.grade.deleteMany({
    where: { id, ownerId },
  });

  return NextResponse.json({ ok: true });
}

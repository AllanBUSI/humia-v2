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
  if (classroomId) where.classroomId = classroomId;

  const correspondences = await prisma.correspondence.findMany({
    where,
    include: {
      student: { select: { firstName: true, lastName: true } },
      classroom: { select: { name: true, color: true } },
      author: { select: { firstName: true, lastName: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(correspondences);
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userRole = await getUserRole(session.user.id);
  const ownerId = getOwnerId(userRole);

  const { studentId, classroomId, content, type } = await request.json();

  if (!studentId || !classroomId || !content) {
    return NextResponse.json(
      { error: "L'élève, la classe et le contenu sont requis" },
      { status: 400 }
    );
  }

  const student = await prisma.student.findFirst({
    where: { id: studentId, ownerId },
  });
  if (!student) {
    return NextResponse.json({ error: "Élève introuvable" }, { status: 404 });
  }

  const correspondence = await prisma.correspondence.create({
    data: {
      ownerId,
      authorId: session.user.id,
      studentId,
      classroomId,
      content,
      type: type || "note",
    },
  });

  return NextResponse.json(correspondence);
}

export async function DELETE(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userRole = await getUserRole(session.user.id);
  const ownerId = getOwnerId(userRole);

  const { id } = await request.json();

  await prisma.correspondence.deleteMany({
    where: { id, ownerId },
  });

  return NextResponse.json({ ok: true });
}

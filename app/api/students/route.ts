import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const classroomId = searchParams.get("classroomId");

  const students = await prisma.student.findMany({
    where: {
      ownerId: session.user.id,
      ...(classroomId ? { classroomId } : {}),
    },
    include: {
      classroom: {
        select: { name: true, color: true, school: { select: { name: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(students);
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { classroomId, firstName, lastName, email, phone, notes } = await request.json();

  if (!classroomId || !firstName || !lastName) {
    return NextResponse.json(
      { error: "La classe, le prénom et le nom sont requis" },
      { status: 400 }
    );
  }

  const classroom = await prisma.classroom.findFirst({
    where: { id: classroomId, ownerId: session.user.id },
  });
  if (!classroom) {
    return NextResponse.json({ error: "Classe introuvable" }, { status: 404 });
  }

  if (email) {
    const existing = await prisma.student.findUnique({
      where: { classroomId_email: { classroomId, email } },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Un élève avec cet email existe déjà dans cette classe" },
        { status: 409 }
      );
    }
  }

  const student = await prisma.student.create({
    data: {
      ownerId: session.user.id,
      classroomId,
      firstName,
      lastName,
      email: email || null,
      phone: phone || null,
      notes: notes || null,
    },
  });

  return NextResponse.json(student);
}

export async function DELETE(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await request.json();

  await prisma.student.deleteMany({
    where: { id, ownerId: session.user.id },
  });

  return NextResponse.json({ ok: true });
}

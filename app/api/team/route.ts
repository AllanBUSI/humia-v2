import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const members = await prisma.teamMember.findMany({
    where: { ownerId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(members);
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { email, name, role } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  // Check if member already exists
  const existing = await prisma.teamMember.findUnique({
    where: { ownerId_email: { ownerId: session.user.id, email } },
  });

  if (existing) {
    return NextResponse.json({ error: "Ce membre existe déjà dans votre équipe" }, { status: 409 });
  }

  const member = await prisma.teamMember.create({
    data: {
      ownerId: session.user.id,
      email,
      name: name || null,
      role: role || "member",
      status: "pending",
    },
  });

  return NextResponse.json(member);
}

export async function DELETE(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await request.json();

  await prisma.teamMember.deleteMany({
    where: { id, ownerId: session.user.id },
  });

  return NextResponse.json({ ok: true });
}

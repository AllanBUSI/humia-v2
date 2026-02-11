import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Verify ownership
  const existing = await prisma.school.findFirst({
    where: { id, ownerId: session.user.id },
  });

  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { name, address, city, postalCode, phone, email, siret, logoUrl } =
    await request.json();

  const school = await prisma.school.update({
    where: { id },
    data: { name, address, city, postalCode, phone, email, siret, logoUrl },
  });

  return NextResponse.json(school);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Verify ownership
  const existing = await prisma.school.findFirst({
    where: { id, ownerId: session.user.id },
  });

  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.school.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}

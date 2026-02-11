import { prisma } from "@/lib/prisma";

export type UserRole = "admin" | "responsable" | "formateur" | "coordinateur";

export type UserWithRole = {
  id: string;
  role: string;
  parentId: string | null;
};

/**
 * Returns the effective ownerId for data queries.
 * Admin: their own id
 * Responsable/Formateur: their parentId (the admin who invited them)
 */
export function getOwnerId(user: UserWithRole): string {
  if (user.role === "admin") return user.id;
  return user.parentId || user.id;
}

/**
 * Fetches user role info from the database
 */
export async function getUserRole(userId: string): Promise<UserWithRole> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true, parentId: true },
  });
  if (!user) throw new Error("User not found");
  return user;
}

/**
 * For formateur role: find their linked Trainer record
 */
export async function getTrainerForUser(userId: string) {
  return prisma.trainer.findUnique({
    where: { userId },
  });
}

export function isAdmin(role: string) {
  return role === "admin";
}

export function isResponsable(role: string) {
  return role === "responsable";
}

export function isFormateur(role: string) {
  return role === "formateur";
}

export function canManageSchools(role: string) {
  return role === "admin";
}

export function isCoordinateur(role: string) {
  return role === "coordinateur";
}

export function canManageTeam(role: string) {
  return role === "admin" || role === "responsable" || role === "coordinateur";
}

import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { requireUser } from "./auth/server";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

export async function getBusiness() {
  const user = await requireUser();
  if (!user) return null;

  return db.business.findUnique({
    where: { userId: user.id },
    include: { connections: true },
  });
}

/** Pages render concurrently with layouts, so each page guards itself. */
export async function requireBusiness() {
  const user = await requireUser();
  if (!user) redirect("/auth/sign-in");

  const business = await getBusiness();
  if (!business) redirect("/onboarding");
  return business;
}

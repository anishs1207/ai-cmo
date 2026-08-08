import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

/** MVP is single-workspace: return the one business, if onboarded. */
export async function getBusiness() {
  return db.business.findFirst({
    orderBy: { createdAt: "desc" },
    include: { connections: true },
  });
}

/** Pages render concurrently with layouts, so each page guards itself. */
export async function requireBusiness() {
  const business = await getBusiness();
  if (!business) redirect("/onboarding");
  return business;
}

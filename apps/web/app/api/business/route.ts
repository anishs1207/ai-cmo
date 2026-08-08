import { NextResponse } from "next/server";
import { db, getBusiness } from "../../../lib/db";

export async function PATCH(req: Request) {
  const business = await getBusiness();
  if (!business) return NextResponse.json({ error: "No business onboarded" }, { status: 404 });

  const { kb } = (await req.json()) as { kb: Record<string, unknown> };
  if (!kb) return NextResponse.json({ error: "Missing kb" }, { status: 400 });

  await db.business.update({
    where: { id: business.id },
    data: {
      kbJson: JSON.stringify(kb),
      name: typeof kb.businessName === "string" && kb.businessName ? kb.businessName : business.name,
    },
  });

  return NextResponse.json({ ok: true });
}

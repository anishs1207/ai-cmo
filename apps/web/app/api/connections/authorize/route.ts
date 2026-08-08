import { NextResponse } from "next/server";
import { db, getBusiness } from "../../../../lib/db";
import { startAuthorization, type Platform } from "../../../../lib/composio";

export async function POST(req: Request) {
  try {
    const business = await getBusiness();
    if (!business) return NextResponse.json({ error: "No business onboarded" }, { status: 404 });

    const { platform } = (await req.json()) as { platform: Platform };
    if (!["facebook", "instagram", "reddit"].includes(platform)) {
      return NextResponse.json({ error: "Unknown platform" }, { status: 400 });
    }

    const { accountId, redirectUrl } = await startAuthorization(platform, business.id);

    await db.connection.upsert({
      where: { businessId_platform: { businessId: business.id, platform } },
      create: { businessId: business.id, platform, composioAccountId: accountId, status: "pending" },
      update: { composioAccountId: accountId, status: "pending" },
    });

    return NextResponse.json({ redirectUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Authorization failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

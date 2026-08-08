import { NextResponse } from "next/server";
import { db, getBusiness } from "../../../../lib/db";
import {
  composioUserId,
  fetchAccountMeta,
  isConnectionActive,
  type Platform,
} from "../../../../lib/composio";

export async function GET(req: Request) {
  const business = await getBusiness();
  if (!business) return NextResponse.json({ error: "No business onboarded" }, { status: 404 });

  const platform = new URL(req.url).searchParams.get("platform") as Platform | null;
  if (!platform) return NextResponse.json({ error: "Missing platform" }, { status: 400 });

  const connection = await db.connection.findUnique({
    where: { businessId_platform: { businessId: business.id, platform } },
  });
  if (!connection?.composioAccountId) return NextResponse.json({ status: "none" });
  if (connection.status === "active") {
    return NextResponse.json({ status: "active", label: connection.accountLabel });
  }

  const active = await isConnectionActive(connection.composioAccountId);
  if (!active) return NextResponse.json({ status: "pending" });

  try {
    const userId = composioUserId(platform, business.id);
    const meta = await fetchAccountMeta(platform, userId);
    await db.connection.update({
      where: { id: connection.id },
      data: { status: "active", externalId: meta.externalId, accountLabel: meta.label },
    });
    return NextResponse.json({ status: "active", label: meta.label });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not read account details";
    await db.connection.update({ where: { id: connection.id }, data: { status: "error" } });
    return NextResponse.json({ status: "error", error: message });
  }
}

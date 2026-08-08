import { NextResponse } from "next/server";
import { db, getBusiness } from "../../../../lib/db";
import {
  isRedditConfigured,
  redditSharedUserId,
  startAuthorization,
  type Platform,
} from "../../../../lib/composio";

export async function POST(req: Request) {
  try {
    const business = await getBusiness();
    if (!business) return NextResponse.json({ error: "No business onboarded" }, { status: 404 });

    const { platform } = (await req.json()) as { platform: Platform };
    if (!["facebook", "instagram", "reddit"].includes(platform)) {
      return NextResponse.json({ error: "Unknown platform" }, { status: 400 });
    }

    if (platform === "reddit") {
      const userId = redditSharedUserId();
      console.log("\n========================================");
      console.log("REDDIT_SHARED_USER_ID — add to apps/web/.env:");
      console.log(`REDDIT_SHARED_USER_ID=${userId}`);
      console.log("Then connect Reddit in Composio for this user ID.");
      console.log("========================================\n");

      const active = isRedditConfigured();
      await db.connection.upsert({
        where: { businessId_platform: { businessId: business.id, platform } },
        create: {
          businessId: business.id,
          platform,
          status: active ? "active" : "pending",
          accountLabel: active ? "Shared Reddit account" : null,
        },
        update: {
          status: active ? "active" : "pending",
          ...(active ? { accountLabel: "Shared Reddit account" } : {}),
        },
      });

      return NextResponse.json({ userId, redirectUrl: null, configured: active });
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

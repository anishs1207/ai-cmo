import { NextResponse } from "next/server";
import { db, getBusiness } from "../../../lib/db";
import { generateCampaignPosts, newLinkCode } from "../../../lib/campaign";
import { EMPTY_KB, type BusinessKB } from "../../../lib/kb";
import type { Platform } from "../../../lib/composio";
import { ORGANIC_PLATFORMS } from "../../../lib/composio";

export async function POST(req: Request) {
  try {
    const business = await getBusiness();
    if (!business) return NextResponse.json({ error: "No business onboarded" }, { status: 404 });
    if (!business.kbJson) return NextResponse.json({ error: "Knowledge base missing" }, { status: 400 });

    const { name, objective, platforms, count } = (await req.json()) as {
      name: string;
      objective?: string;
      platforms: Platform[];
      count: number;
    };

    if (!name?.trim()) return NextResponse.json({ error: "Name required" }, { status: 400 });
    if (!platforms?.length) return NextResponse.json({ error: "Pick at least one platform" }, { status: 400 });

    const allowed = platforms.filter((p): p is Platform =>
      ORGANIC_PLATFORMS.includes(p as (typeof ORGANIC_PLATFORMS)[number]),
    );
    if (allowed.length === 0) {
      return NextResponse.json({ error: "No supported platforms selected" }, { status: 400 });
    }

    const kb: BusinessKB = { ...EMPTY_KB, ...JSON.parse(business.kbJson) };

    const pastInsights = await db.insight.findMany({
      where: { businessId: business.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { summary: true },
    });

    const generated = await generateCampaignPosts({
      kb,
      objective: objective?.trim() || "Drive traffic to the website",
      platforms: allowed,
      postsPerPlatform: Math.min(Math.max(count || 1, 1), 5),
      pastInsights: pastInsights.map((i) => i.summary),
    });

    if (generated.length === 0) {
      return NextResponse.json({ error: "The model returned no posts. Try again." }, { status: 502 });
    }

    const destination = business.websiteUrl || "";

    const campaign = await db.campaign.create({
      data: {
        businessId: business.id,
        name: name.trim(),
        objective: objective?.trim() || null,
        status: "draft",
      },
    });

    for (const g of generated) {
      const post = await db.post.create({
        data: {
          campaignId: campaign.id,
          platform: g.platform,
          title: g.title ?? null,
          subreddit: g.subreddit ?? null,
          body: g.body,
          hashtags: g.hashtags ?? null,
          imageUrl: null,
          rationale: g.rationale,
        },
      });
      if (destination) {
        await db.trackedLink.create({
          data: {
            code: newLinkCode(),
            businessId: business.id,
            postId: post.id,
            destination,
          },
        });
      }
    }

    return NextResponse.json({ id: campaign.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Campaign generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

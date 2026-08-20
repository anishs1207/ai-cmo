import { NextRequest, NextResponse } from "next/server";
import { listMetaCampaigns, getMetaCampaignInsights, toggleMetaCampaignStatus } from "../../../../lib/mcp/meta";
import { listYouTubeCampaigns, getYouTubeCampaignStats, toggleYouTubeCampaignStatus } from "../../../../lib/mcp/google";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const metaCampaigns = listMetaCampaigns();
    const metaInsights = getMetaCampaignInsights();
    const youtubeCampaigns = listYouTubeCampaigns();
    const youtubeStats = getYouTubeCampaignStats();

    return NextResponse.json({
      meta: {
        campaigns: metaCampaigns,
        insights: metaInsights,
        totalSpend: metaInsights.reduce((sum, i) => sum + i.spend, 0),
        totalImpressions: metaInsights.reduce((sum, i) => sum + i.impressions, 0),
        totalPurchases: metaInsights.reduce((sum, i) => sum + i.purchases, 0),
      },
      youtube: {
        campaigns: youtubeCampaigns,
        stats: youtubeStats,
        totalSpend: youtubeStats.reduce((sum, s) => sum + s.cost, 0),
        totalViews: youtubeStats.reduce((sum, s) => sum + s.views, 0),
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { platform, campaignId, status } = body;

    if (platform === "meta") {
      const updated = toggleMetaCampaignStatus(campaignId, status);
      return NextResponse.json({ success: !!updated, campaign: updated });
    } else if (platform === "youtube" || platform === "google") {
      const updated = toggleYouTubeCampaignStatus(campaignId, status);
      return NextResponse.json({ success: !!updated, campaign: updated });
    }

    return NextResponse.json({ error: "Invalid platform specified" }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

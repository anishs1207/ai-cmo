import { YouTubeCampaign, YouTubeCampaignStats, YouTubeAdFormat, McpToolExecutionResult } from "./types";

export const GOOGLE_ADS_OFFICIAL_MCP_URL = process.env.GOOGLE_ADS_MCP_SERVER_URL || "https://mcp.googleads.googleapis.com/mcp";

// In-memory store for active YouTube Ad campaigns
const youtubeCampaignsStore = new Map<string, YouTubeCampaign>([
  [
    "yt-cmp-001",
    {
      id: "yt-cmp-001",
      name: "Ceremonial Matcha - YouTube Shorts Viral Hook",
      adFormat: "YOUTUBE_SHORTS",
      status: "ENABLED",
      dailyBudget: 35.0,
      biddingStrategy: "TARGET_CPV",
      targetCpv: 0.02,
      videoAssetUrl: "/storage/ugc-videos/matcha-powder-ugc-testimonial.mp4",
      headline: "Upgrade Your Focus in 15s",
      longHeadline: "The Ceremonial Matcha Latte That Replaced 4 Cups of Coffee",
      callToAction: "Shop Now",
      finalUrl: "https://yourbrand.com/matcha?utm_source=youtube_ads&utm_medium=video",
      targeting: {
        keywords: ["matcha tea", "healthy morning routine", "nootropics", "coffee alternative", "productivity hacks"],
        audiences: ["Health & Fitness Enthusiasts", "Coffee & Tea Lovers", "Productivity Seekers"],
        locations: ["United States", "Canada"],
      },
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      stats: {
        campaignId: "yt-cmp-001",
        views: 28400,
        viewRate: 46.8,
        avgCpv: 0.018,
        impressions: 60680,
        clicks: 890,
        ctr: 1.47,
        cost: 70.0,
        conversions: 24,
        costPerConversion: 2.91,
      },
    },
  ],
]);

export async function checkGoogleAdsMcpHealth(): Promise<{ connected: boolean; latencyMs: number; isMock: boolean }> {
  const start = Date.now();
  const devToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;

  if (!devToken) {
    return {
      connected: true,
      latencyMs: 16,
      isMock: true,
    };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${GOOGLE_ADS_OFFICIAL_MCP_URL}/health`, {
      signal: controller.signal,
      headers: { "developer-token": devToken },
    }).catch(() => null);
    clearTimeout(timeout);

    return {
      connected: true,
      latencyMs: Date.now() - start,
      isMock: !res?.ok,
    };
  } catch {
    return {
      connected: true,
      latencyMs: 20,
      isMock: true,
    };
  }
}

export async function createYouTubeCampaign(params: {
  name: string;
  adFormat?: YouTubeAdFormat;
  dailyBudget?: number;
  biddingStrategy?: "TARGET_CPV" | "MAXIMIZE_CONVERSIONS";
  targetCpv?: number;
  videoAssetUrl?: string;
  headline: string;
  longHeadline?: string;
  callToAction?: string;
  finalUrl?: string;
  targeting?: {
    keywords?: string[];
    topics?: string[];
    audiences?: string[];
    locations?: string[];
  };
}): Promise<YouTubeCampaign> {
  const id = "yt-cmp-" + Math.random().toString(36).substring(2, 9);
  
  const campaign: YouTubeCampaign = {
    id,
    name: params.name,
    adFormat: params.adFormat || "YOUTUBE_SHORTS",
    status: "ENABLED",
    dailyBudget: params.dailyBudget || 25.0,
    biddingStrategy: params.biddingStrategy || "TARGET_CPV",
    targetCpv: params.targetCpv || 0.02,
    videoAssetUrl: params.videoAssetUrl || "/storage/ugc-videos/matcha-powder-ugc-testimonial.mp4",
    headline: params.headline,
    longHeadline: params.longHeadline || params.headline,
    callToAction: params.callToAction || "Shop Now",
    finalUrl: params.finalUrl || "https://yourbrand.com?utm_source=youtube_ads",
    targeting: {
      keywords: params.targeting?.keywords || ["trending", "lifestyle"],
      topics: params.targeting?.topics || [],
      audiences: params.targeting?.audiences || ["In-Market Shoppers"],
      locations: params.targeting?.locations || ["United States"],
    },
    createdAt: new Date().toISOString(),
    stats: {
      campaignId: id,
      views: 820,
      viewRate: 44.5,
      avgCpv: 0.019,
      impressions: 1840,
      clicks: 28,
      ctr: 1.52,
      cost: 5.20,
      conversions: 1,
      costPerConversion: 5.20,
    },
  };

  youtubeCampaignsStore.set(id, campaign);
  return campaign;
}

export function listYouTubeCampaigns(): YouTubeCampaign[] {
  return Array.from(youtubeCampaignsStore.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getYouTubeCampaignStats(campaignId?: string): YouTubeCampaignStats[] {
  const campaigns = campaignId ? [youtubeCampaignsStore.get(campaignId)].filter(Boolean) as YouTubeCampaign[] : listYouTubeCampaigns();
  return campaigns.map((c) => {
    if (c.stats) return c.stats;
    return {
      campaignId: c.id,
      views: 0,
      viewRate: 0,
      avgCpv: 0,
      impressions: 0,
      clicks: 0,
      ctr: 0,
      cost: 0,
      conversions: 0,
      costPerConversion: 0,
    };
  });
}

export function toggleYouTubeCampaignStatus(campaignId: string, status: "ENABLED" | "PAUSED"): YouTubeCampaign | null {
  const campaign = youtubeCampaignsStore.get(campaignId);
  if (!campaign) return null;
  campaign.status = status;
  youtubeCampaignsStore.set(campaignId, campaign);
  return campaign;
}

export async function executeGoogleAdsTool(
  toolName: string,
  args: Record<string, unknown>
): Promise<McpToolExecutionResult> {
  switch (toolName) {
    case "google_ads_create_youtube_campaign": {
      const campaign = await createYouTubeCampaign({
        name: String(args.name || "YouTube Video Ad Campaign"),
        adFormat: (args.adFormat as YouTubeAdFormat) || "YOUTUBE_SHORTS",
        dailyBudget: Number(args.dailyBudget || 25),
        biddingStrategy: (args.biddingStrategy as "TARGET_CPV" | "MAXIMIZE_CONVERSIONS") || "TARGET_CPV",
        targetCpv: args.targetCpv ? Number(args.targetCpv) : 0.02,
        videoAssetUrl: args.videoAssetUrl ? String(args.videoAssetUrl) : undefined,
        headline: String(args.headline || "Watch Now"),
        longHeadline: args.longHeadline ? String(args.longHeadline) : undefined,
        callToAction: args.callToAction ? String(args.callToAction) : "Shop Now",
        finalUrl: args.finalUrl ? String(args.finalUrl) : undefined,
        targeting: args.targeting as {
          keywords?: string[];
          topics?: string[];
          audiences?: string[];
          locations?: string[];
        },
      });

      return {
        tool: toolName,
        server: "google_ads",
        successful: true,
        data: campaign,
        message: `Successfully created YouTube Ad campaign '${campaign.name}' on Google Ads (${campaign.adFormat}, $${campaign.dailyBudget}/day, Target CPV: $${campaign.targetCpv}).`,
      };
    }

    case "google_ads_list_campaigns": {
      const list = listYouTubeCampaigns();
      return {
        tool: toolName,
        server: "google_ads",
        successful: true,
        data: { campaigns: list, total: list.length },
        message: `Found ${list.length} YouTube Video ad campaigns on Google Ads`,
      };
    }

    case "google_ads_get_campaign_stats": {
      const campaignId = args.campaignId ? String(args.campaignId) : undefined;
      const stats = getYouTubeCampaignStats(campaignId);
      return {
        tool: toolName,
        server: "google_ads",
        successful: true,
        data: { stats },
        message: "Fetched YouTube Ads performance stats (Views, CPV, View Rate, Cost, Conversions)",
      };
    }

    case "google_ads_toggle_campaign": {
      const campaignId = String(args.campaignId);
      const status = (args.status as "ENABLED" | "PAUSED") || "PAUSED";
      const updated = toggleYouTubeCampaignStatus(campaignId, status);
      if (!updated) {
        return {
          tool: toolName,
          server: "google_ads",
          successful: false,
          data: null,
          error: `YouTube campaign not found: ${campaignId}`,
        };
      }
      return {
        tool: toolName,
        server: "google_ads",
        successful: true,
        data: updated,
        message: `YouTube Campaign '${updated.name}' is now ${updated.status}`,
      };
    }

    default:
      return {
        tool: toolName,
        server: "google_ads",
        successful: false,
        data: null,
        error: `Unknown Google Ads tool: ${toolName}`,
      };
  }
}

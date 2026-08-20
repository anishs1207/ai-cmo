export type McpServerName = "higgsfield" | "meta_ads" | "google_ads";

export interface McpServerStatus {
  name: McpServerName;
  displayName: string;
  officialUrl: string;
  connected: boolean;
  isMock: boolean;
  latencyMs: number;
  availableTools: string[];
  description: string;
}

export interface McpToolDefinition {
  name: string;
  server: McpServerName;
  description: string;
  parameters: {
    type: "object";
    properties: Record<string, {
      type: string;
      description: string;
      enum?: string[];
      items?: Record<string, unknown>;
    }>;
    required: string[];
  };
}

export interface McpToolExecutionResult<T = unknown> {
  tool: string;
  server: McpServerName;
  successful: boolean;
  data: T;
  error?: string | null;
  message?: string;
}

// -----------------------------------------------------------------------------
// Higgsfield AI UGC Video Types
// -----------------------------------------------------------------------------
export type UgcVideoStyle = 
  | "founder_story"
  | "customer_testimonial"
  | "unboxing_review"
  | "pain_point_solution"
  | "tiktok_viral_hook"
  | "cinematic_commercial";

export type UgcAspectRatio = "9:16" | "16:9" | "1:1";

export interface UgcVideoJob {
  id: string;
  prompt: string;
  script?: string;
  style: UgcVideoStyle;
  aspectRatio: UgcAspectRatio;
  durationSeconds: number;
  status: "pending" | "processing" | "completed" | "failed";
  progressPercent: number;
  videoUrl?: string;
  localPath?: string;
  thumbnailUrl?: string;
  soulModeEnabled?: boolean;
  createdAt: string;
  completedAt?: string;
  metadata?: {
    model: string;
    motionIntensity: number;
    hookHeadline?: string;
    targetAudience?: string;
  };
}

export interface SavedVideoAsset {
  id: string;
  filename: string;
  localPath: string;
  publicUrl: string;
  title: string;
  prompt: string;
  style: UgcVideoStyle;
  aspectRatio: UgcAspectRatio;
  durationSeconds: number;
  sizeBytes: number;
  createdAt: string;
  thumbnailUrl?: string;
}

// -----------------------------------------------------------------------------
// Meta (Facebook & Instagram) Ads Types
// -----------------------------------------------------------------------------
export type MetaObjective = 
  | "OUTCOME_SALES" 
  | "OUTCOME_TRAFFIC" 
  | "OUTCOME_LEADS" 
  | "OUTCOME_ENGAGEMENT"
  | "OUTCOME_AWARENESS";

export type MetaPlacement = 
  | "facebook_feed"
  | "facebook_reels"
  | "facebook_video_feeds"
  | "facebook_stories"
  | "instagram_feed"
  | "instagram_reels"
  | "instagram_stories"
  | "instagram_explore";

export interface MetaCampaign {
  id: string;
  name: string;
  objective: MetaObjective;
  status: "ACTIVE" | "PAUSED" | "ARCHIVED";
  dailyBudget: number; // in USD
  currency: string;
  placements: MetaPlacement[];
  platforms: ("facebook" | "instagram")[];
  targetAudience: {
    countries: string[];
    ageMin: number;
    ageMax: number;
    interests: string[];
  };
  creative: {
    videoUrl?: string;
    headline: string;
    primaryText: string;
    callToAction: string;
    destinationUrl: string;
  };
  createdAt: string;
  updatedAt: string;
  insights?: MetaCampaignInsights;
}

export interface MetaCampaignInsights {
  campaignId: string;
  impressions: number;
  reach: number;
  clicks: number;
  spend: number;
  ctr: number; // Click-through rate %
  cpc: number; // Cost per click $
  cpm: number; // Cost per 1000 impressions $
  roas: number; // Return on Ad Spend (e.g. 3.4x)
  purchases: number;
  conversionValue: number;
  costPerPurchase: number;
  platformBreakdown: {
    facebook: { spend: number; impressions: number; clicks: number; purchases: number };
    instagram: { spend: number; impressions: number; clicks: number; purchases: number };
  };
}

// -----------------------------------------------------------------------------
// Google Ads (YouTube Ads) Types
// -----------------------------------------------------------------------------
export type YouTubeAdFormat = 
  | "SKIPPABLE_IN_STREAM" 
  | "NON_SKIPPABLE_IN_STREAM" 
  | "YOUTUBE_SHORTS" 
  | "IN_FEED_VIDEO";

export interface YouTubeCampaign {
  id: string;
  name: string;
  adFormat: YouTubeAdFormat;
  status: "ENABLED" | "PAUSED" | "REMOVED";
  dailyBudget: number;
  biddingStrategy: "TARGET_CPV" | "MAXIMIZE_CONVERSIONS";
  targetCpv?: number;
  videoAssetUrl: string;
  headline: string;
  longHeadline?: string;
  callToAction: string;
  finalUrl: string;
  targeting: {
    keywords?: string[];
    topics?: string[];
    audiences?: string[];
    locations: string[];
  };
  createdAt: string;
  stats?: YouTubeCampaignStats;
}

export interface YouTubeCampaignStats {
  campaignId: string;
  views: number;
  viewRate: number; // View rate %
  avgCpv: number; // Average Cost Per View $
  impressions: number;
  clicks: number;
  ctr: number;
  cost: number;
  conversions: number;
  costPerConversion: number;
}

// -----------------------------------------------------------------------------
// Chat & Agent Interaction Types
// -----------------------------------------------------------------------------
export interface McpChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  toolInvocations?: {
    toolName: string;
    server: McpServerName;
    args: Record<string, unknown>;
    result?: McpToolExecutionResult;
    status: "running" | "completed" | "failed";
  }[];
  generatedVideo?: UgcVideoJob | SavedVideoAsset;
  metaCampaign?: MetaCampaign;
  youtubeCampaign?: YouTubeCampaign;
  campaignInsights?: MetaCampaignInsights | YouTubeCampaignStats;
}

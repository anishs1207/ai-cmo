import { notFound } from "next/navigation";
import { db } from "../../../../lib/db";
import { refreshRedditViews } from "../../../../lib/views";
import { CampaignDetail } from "./CampaignDetail";

export const dynamic = "force-dynamic";

export default async function CampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  await refreshRedditViews({ campaignId: id }).catch(() => 0);

  const campaign = await db.campaign.findUnique({
    where: { id },
    include: {
      posts: {
        orderBy: { createdAt: "asc" },
      },
      insights: { orderBy: { createdAt: "desc" } },
      business: true,
    },
  });
  if (!campaign) notFound();

  return (
    <CampaignDetail
      campaign={{
        id: campaign.id,
        name: campaign.name,
        objective: campaign.objective,
        status: campaign.status,
        createdAt: campaign.createdAt.toISOString(),
      }}
      websiteUrl={campaign.business.websiteUrl}
      posts={campaign.posts.map((p) => ({
        id: p.id,
        platform: p.platform,
        title: p.title,
        subreddit: p.subreddit,
        body: p.body,
        hashtags: p.hashtags,
        imageUrl: p.imageUrl,
        rationale: p.rationale,
        status: p.status,
        error: p.error,
        scheduledAt: p.scheduledAt?.toISOString() ?? null,
        publishedAt: p.publishedAt?.toISOString() ?? null,
        externalUrl: p.externalUrl,
        viewCount: p.viewCount,
      }))}
      insights={campaign.insights.map((i) => ({
        id: i.id,
        summary: i.summary,
        detail: i.detail,
        createdAt: i.createdAt.toISOString(),
      }))}
    />
  );
}

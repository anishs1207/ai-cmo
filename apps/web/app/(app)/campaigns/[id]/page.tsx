import { notFound } from "next/navigation";
import { db } from "../../../../lib/db";
import { CampaignDetail } from "./CampaignDetail";

export const dynamic = "force-dynamic";

export default async function CampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campaign = await db.campaign.findUnique({
    where: { id },
    include: {
      posts: {
        orderBy: { createdAt: "asc" },
        include: { link: { include: { _count: { select: { clicks: true } } } } },
      },
      insights: { orderBy: { createdAt: "desc" } },
      business: true,
    },
  });
  if (!campaign) notFound();

  const appUrl = process.env.APP_URL || "http://localhost:3001";

  return (
    <CampaignDetail
      campaign={{
        id: campaign.id,
        name: campaign.name,
        objective: campaign.objective,
        status: campaign.status,
        createdAt: campaign.createdAt.toISOString(),
      }}
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
        clicks: p.link?._count.clicks ?? 0,
        trackedUrl: p.link ? `${appUrl}/r/${p.link.code}` : null,
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

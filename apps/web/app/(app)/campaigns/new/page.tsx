import { isRedditConfigured, ORGANIC_PLATFORMS } from "../../../../lib/composio";
import { db, requireBusiness } from "../../../../lib/db";
import { NewCampaignForm } from "./NewCampaignForm";

export const dynamic = "force-dynamic";

export default async function NewCampaignPage() {
  const business = await requireBusiness();
  const connectedPlatforms = isRedditConfigured() ? [...ORGANIC_PLATFORMS] : [];

  const insights = await db.insight.findMany({
    where: { businessId: business.id },
    orderBy: { createdAt: "desc" },
    take: 3,
    select: { summary: true },
  });

  return (
    <>
      <div className="page-head rise">
        <div>
          <h1 className="display">New campaign</h1>
          <p>Pick channels and an objective. Ripple writes every post from your knowledge base.</p>
        </div>
      </div>
      <NewCampaignForm connectedPlatforms={connectedPlatforms} learnings={insights.map((i) => i.summary)} />
    </>
  );
}

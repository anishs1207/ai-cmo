import Link from "next/link";
import { db, requireBusiness } from "../../../lib/db";
import { StatusChip } from "../../../components/StatusChip";
import { PlatformBadge } from "../../../components/icons";
import { formatShortDate } from "../../../lib/dates";

export const dynamic = "force-dynamic";

export default async function CampaignsPage() {
  const business = await requireBusiness();
  const campaigns = await db.campaign.findMany({
    where: { businessId: business.id },
    orderBy: { createdAt: "desc" },
    include: {
      posts: true,
    },
  });

  return (
    <>
      <div className="page-head rise">
        <div>
          <h1 className="display">Campaigns</h1>
          <p>Each campaign is a batch of AI-written posts across your channels. Ripple shows Reddit views when available.</p>
        </div>
        <Link href="/campaigns/new" className="btn btn-primary">
          New campaign
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="card empty-state rise">
          <h3 className="title-3">No campaigns yet</h3>
          <p className="caption" style={{ margin: "4px 0 18px" }}>
            Ripple will write platform-native posts from your knowledge base and publish them for you.
          </p>
          <Link href="/campaigns/new" className="btn btn-primary" style={{ margin: "0 auto" }}>
            Create your first campaign
          </Link>
        </div>
      ) : (
        <div className="stack">
          {campaigns.map((c) => {
            const withViews = c.posts.filter((p) => p.viewCount != null);
            const views = withViews.reduce((n, p) => n + (p.viewCount ?? 0), 0);
            const published = c.posts.filter((p) => p.status === "published").length;
            const platforms = [...new Set(c.posts.map((p) => p.platform))];
            return (
              <Link key={c.id} href={`/campaigns/${c.id}`} className="card card-pad rise spread" style={{ padding: "18px 20px" }}>
                <div>
                  <div className="row" style={{ gap: 10 }}>
                    <span className="title-3">{c.name}</span>
                    <StatusChip status={c.status} />
                  </div>
                  <div className="caption" style={{ marginTop: 4 }}>
                    {published}/{c.posts.length} posts published · {formatShortDate(c.createdAt)}
                  </div>
                </div>
                <div className="row" style={{ gap: 16 }}>
                  <span className="row" style={{ gap: 4 }}>
                    {platforms.map((p) => (
                      <PlatformBadge key={p} platform={p} size={22} />
                    ))}
                  </span>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>
                      {withViews.length === 0 ? "—" : views}
                    </div>
                    <div className="caption" style={{ fontSize: 11 }}>views</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}

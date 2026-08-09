import Link from "next/link";
import { ORGANIC_PLATFORMS } from "../../../lib/platforms";
import { db, requireBusiness } from "../../../lib/db";
import { publishDueScheduled } from "../../../lib/publish";
import { AreaChart } from "../../../components/AreaChart";
import { PlatformBadge } from "../../../components/icons";
import { StatusChip } from "../../../components/StatusChip";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const business = await requireBusiness();

  // Lazy scheduler: publish anything whose scheduled time has passed.
  await publishDueScheduled().catch(() => 0);

  const [clicks, posts, campaigns, latestInsight] = await Promise.all([
    db.click.findMany({
      where: { link: { businessId: business.id } },
      orderBy: { ts: "asc" },
      include: { link: { include: { post: { select: { platform: true } } } } },
    }),
    db.post.findMany({
      where: { campaign: { businessId: business.id } },
      orderBy: { createdAt: "desc" },
      include: { link: { include: { _count: { select: { clicks: true } } } }, campaign: true },
    }),
    db.campaign.findMany({ where: { businessId: business.id } }),
    db.insight.findFirst({ where: { businessId: business.id }, orderBy: { createdAt: "desc" } }),
  ]);

  const now = new Date();
  const dayMs = 86_400_000;
  const days = 14;
  const series = Array.from({ length: days }, (_, i) => {
    const d = new Date(now.getTime() - (days - 1 - i) * dayMs);
    const key = d.toISOString().slice(0, 10);
    return {
      label: d.toLocaleDateString("en", { month: "short", day: "numeric" }),
      value: clicks.filter((c) => c.ts.toISOString().slice(0, 10) === key).length,
    };
  });

  const clicks7d = clicks.filter((c) => now.getTime() - c.ts.getTime() < 7 * dayMs).length;
  const clicksPrev7d = clicks.filter((c) => {
    const age = now.getTime() - c.ts.getTime();
    return age >= 7 * dayMs && age < 14 * dayMs;
  }).length;
  const delta = clicksPrev7d === 0 ? null : Math.round(((clicks7d - clicksPrev7d) / clicksPrev7d) * 100);

  const published = posts.filter((p) => p.status === "published");
  const byPlatform = ORGANIC_PLATFORMS.map((platform) => ({
    platform,
    clicks: clicks.filter((c) => c.link.post?.platform === platform).length,
    posts: published.filter((p) => p.platform === platform).length,
  }));
  const maxPlatform = Math.max(1, ...byPlatform.map((b) => b.clicks));

  const stats = [
    { label: "Visitors sent", value: clicks.length, sub: "all-time tracked clicks" },
    {
      label: "Visitors · 7 days",
      value: clicks7d,
      sub: delta === null ? "no prior week to compare" : `${delta >= 0 ? "+" : ""}${delta}% vs previous week`,
      good: delta !== null && delta >= 0,
    },
    { label: "Posts published", value: published.length, sub: `${posts.length} created in total` },
    { label: "Campaigns", value: campaigns.length, sub: `${campaigns.filter((c) => c.status === "live").length} live` },
  ];

  return (
    <>
      <div className="page-head rise">
        <div>
          <h1 className="display">Welcome, {business.name}</h1>
          <p>Traffic your organic content is sending home — and how this week compares.</p>
        </div>
        <Link href="/campaigns/new" className="btn btn-primary">
          New campaign
        </Link>
      </div>

      <div className="grid-4" style={{ marginBottom: 14 }}>
        {stats.map((s) => (
          <div key={s.label} className="card card-pad rise">
            <div className="micro">{s.label}</div>
            <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.02em", margin: "6px 0 2px" }}>
              {s.value}
            </div>
            <div className="caption" style={{ color: s.good ? "var(--green)" : undefined }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: "2fr 1fr", marginBottom: 14 }}>
        <div className="card card-pad rise">
          <div className="spread" style={{ marginBottom: 12 }}>
            <h2 className="title-3">Visitors over time</h2>
            <span className="caption">last 14 days</span>
          </div>
          <AreaChart data={series} />
        </div>

        <div className="card card-pad rise">
          <h2 className="title-3" style={{ marginBottom: 16 }}>By channel</h2>
          <div className="stack" style={{ gap: 18 }}>
            {byPlatform.map((b) => (
              <div key={b.platform}>
                <div className="spread" style={{ marginBottom: 6 }}>
                  <span className="row" style={{ gap: 8 }}>
                    <PlatformBadge platform={b.platform} size={20} />
                    <span style={{ fontSize: 13, fontWeight: 600, textTransform: "capitalize" }}>{b.platform}</span>
                  </span>
                  <span className="caption">
                    {b.clicks} clicks · {b.posts} posts
                  </span>
                </div>
                <div style={{ height: 6, borderRadius: 999, background: "rgba(0,0,0,0.06)", overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${(b.clicks / maxPlatform) * 100}%`,
                      minWidth: b.clicks > 0 ? 8 : 0,
                      borderRadius: 999,
                      background: "var(--accent)",
                      transition: "width 600ms var(--ease-out)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {latestInsight && (
            <div
              style={{
                marginTop: 22,
                padding: "12px 14px",
                borderRadius: 10,
                background: "var(--violet-bg)",
              }}
            >
              <div className="micro" style={{ color: "var(--violet)", marginBottom: 4 }}>
                Latest learning
              </div>
              <div style={{ fontSize: 12.5, lineHeight: 1.5 }}>{latestInsight.summary}</div>
            </div>
          )}
        </div>
      </div>

      <div className="card rise" style={{ overflow: "hidden" }}>
        <div className="spread" style={{ padding: "16px 20px 4px" }}>
          <h2 className="title-3">Recent posts</h2>
          <Link href="/campaigns" className="caption" style={{ fontWeight: 600, color: "var(--accent)" }}>
            View all campaigns
          </Link>
        </div>
        {posts.length === 0 ? (
          <div className="empty-state">
            <h3 className="title-3">No posts yet</h3>
            <p className="caption">Create your first campaign and Ripple will write and publish for you.</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Post</th>
                <th>Campaign</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Clicks</th>
              </tr>
            </thead>
            <tbody>
              {posts.slice(0, 8).map((p) => (
                <tr key={p.id}>
                  <td>
                    <span className="row">
                      <PlatformBadge platform={p.platform} size={24} />
                      <span
                        style={{
                          maxWidth: 380,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          display: "inline-block",
                        }}
                      >
                        {p.title || p.body}
                      </span>
                    </span>
                  </td>
                  <td className="caption">{p.campaign.name}</td>
                  <td>
                    <StatusChip status={p.status} />
                  </td>
                  <td style={{ textAlign: "right", fontWeight: 600 }}>{p.link?._count.clicks ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

import { db } from "./db";
import { executeTool, redditSharedUserId } from "./composio";

const STALE_MS = 15 * 60 * 1000;

/** Refresh Reddit view counts for published posts. Skips posts refreshed within STALE_MS unless forced. */
export async function refreshRedditViews(opts: {
  businessId?: string;
  campaignId?: string;
  force?: boolean;
}): Promise<number> {
  const posts = await db.post.findMany({
    where: {
      platform: "reddit",
      status: "published",
      externalId: { not: null },
      ...(opts.campaignId ? { campaignId: opts.campaignId } : {}),
      ...(opts.businessId ? { campaign: { businessId: opts.businessId } } : {}),
    },
    select: { id: true, externalId: true, viewsUpdatedAt: true },
  });

  const now = Date.now();
  let updated = 0;

  for (const post of posts) {
    if (
      !opts.force &&
      post.viewsUpdatedAt &&
      now - post.viewsUpdatedAt.getTime() < STALE_MS
    ) {
      continue;
    }
    const thingId = toThingId(post.externalId);
    if (!thingId) continue;

    try {
      const viewCount = await fetchRedditViewCount(thingId);
      await db.post.update({
        where: { id: post.id },
        data: {
          viewCount, // may be null when Reddit does not expose views
          viewsUpdatedAt: new Date(),
        },
      });
      updated++;
    } catch {
      // Leave previous values; don't block page loads on Reddit flakiness.
    }
  }

  return updated;
}

async function fetchRedditViewCount(thingId: string): Promise<number | null> {
  const res = await executeTool("REDDIT_RETRIEVE_SPECIFIC_COMMENT", redditSharedUserId(), {
    id: thingId,
  });
  if (!res.successful) return null;

  const root = unwrap(res.data);
  const things = asArray(root.things) ?? asArray(root.children) ?? [root];
  for (const thing of things) {
    if (!thing || typeof thing !== "object") continue;
    const rec = thing as Record<string, unknown>;
    const data =
      rec.data && typeof rec.data === "object" && !Array.isArray(rec.data)
        ? (rec.data as Record<string, unknown>)
        : rec;
    const vc = data.view_count ?? data.viewCount ?? data.views;
    if (typeof vc === "number" && Number.isFinite(vc) && vc >= 0) return Math.floor(vc);
    if (typeof vc === "string" && /^\d+$/.test(vc)) return parseInt(vc, 10);
  }
  return null;
}

function toThingId(externalId: string | null): string | null {
  if (!externalId) return null;
  if (/^t3_/i.test(externalId)) return externalId;
  if (/^[a-z0-9]+$/i.test(externalId)) return `t3_${externalId}`;
  return null;
}

function unwrap(data: Record<string, unknown>): Record<string, unknown> {
  const inner = data.data;
  if (inner && typeof inner === "object" && !Array.isArray(inner)) {
    return inner as Record<string, unknown>;
  }
  return data;
}

function asArray(v: unknown): unknown[] | null {
  return Array.isArray(v) ? v : null;
}

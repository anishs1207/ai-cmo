import { db } from "./db";
import { composioUserId, executeTool, isRedditConfigured, type Platform } from "./composio";

export function trackedUrl(code: string, platform: string): string {
  const base = process.env.APP_URL || "http://localhost:3001";
  return `${base}/r/${code}?s=${platform}`;
}

/** Publish a draft post to its platform via Composio. Updates DB state. */
export async function publishPost(postId: string): Promise<{ ok: boolean; error?: string }> {
  const post = await db.post.findUnique({
    where: { id: postId },
    include: { link: true, campaign: { include: { business: { include: { connections: true } } } } },
  });
  if (!post) return { ok: false, error: "Post not found" };
  if (post.status === "published") return { ok: true };

  const business = post.campaign.business;
  const platform = post.platform as Platform;
  const connection = business.connections.find((c) => c.platform === platform);

  if (platform === "reddit") {
    if (!isRedditConfigured()) return { ok: false, error: "reddit is not configured" };
  } else if (!connection || connection.status !== "active") {
    return { ok: false, error: `${platform} is not connected` };
  }

  const userId = composioUserId(platform, business.id);
  // Plain site URL in the post — no Ripple /r hop (trust on Reddit).
  const url = business.websiteUrl?.trim() || "";

  await db.post.update({ where: { id: post.id }, data: { status: "publishing", error: null } });

  try {
    let externalId: string | null = null;
    let externalUrl: string | null = null;

    if (platform === "reddit") {
      if (!post.subreddit) throw new Error("No subreddit set");
      const res = await executeTool("REDDIT_CREATE_REDDIT_POST", userId, {
        subreddit: post.subreddit,
        title: post.title ?? post.body.slice(0, 280),
        kind: "self",
        text: `${post.body}\n\n${url ? `Link: ${url}` : ""}`.trim(),
      });
      if (!res.successful) throw new Error(res.error || "Reddit post failed");
      const data = unwrap(res.data);
      externalId = normalizeRedditThingId(str(data, "name") ?? str(data, "id"));
      externalUrl = str(data, "permalink")
        ? `https://reddit.com${str(data, "permalink")}`
        : (str(data, "url") ?? null);
    }

    if (platform === "facebook") {
      if (!connection?.externalId) throw new Error("Facebook Page not connected");
      const message = [post.body, post.hashtags].filter(Boolean).join("\n\n");
      const res = await executeTool("FACEBOOK_CREATE_POST", userId, {
        page_id: connection.externalId,
        message,
        ...(url ? { link: url } : {}),
        published: true,
      });
      if (!res.successful) throw new Error(res.error || "Facebook post failed");
      const data = unwrap(res.data);
      externalId = str(data, "id");
      externalUrl = externalId ? `https://facebook.com/${externalId}` : null;
    }

    if (platform === "instagram") {
      if (!connection?.externalId) throw new Error("Instagram account not connected");
      if (!post.imageUrl) throw new Error("Instagram requires an image URL");
      const caption = [post.body, url ? `Link in bio / ${url}` : "", post.hashtags]
        .filter(Boolean)
        .join("\n\n");
      const container = await executeTool("INSTAGRAM_POST_IG_USER_MEDIA", userId, {
        ig_user_id: connection.externalId,
        image_url: post.imageUrl,
        caption,
      });
      if (!container.successful) throw new Error(container.error || "IG container failed");
      const containerData = unwrap(container.data);
      const creationId = str(containerData, "id");
      if (!creationId) throw new Error("IG container returned no id");
      const pub = await executeTool("INSTAGRAM_POST_IG_USER_MEDIA_PUBLISH", userId, {
        ig_user_id: connection.externalId,
        creation_id: creationId,
      });
      if (!pub.successful) throw new Error(pub.error || "IG publish failed");
      const pubData = unwrap(pub.data);
      externalId = str(pubData, "id");
    }

    await db.post.update({
      where: { id: post.id },
      data: { status: "published", publishedAt: new Date(), externalId, externalUrl },
    });
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Publish failed";
    await db.post.update({
      where: { id: post.id },
      data: { status: "failed", error: message.slice(0, 500) },
    });
    return { ok: false, error: message };
  }
}

/** Publish any scheduled posts whose time has come. Called lazily from dashboard loads. */
export async function publishDueScheduled(): Promise<number> {
  const due = await db.post.findMany({
    where: { status: "scheduled", scheduledAt: { lte: new Date() } },
    select: { id: true },
  });
  let count = 0;
  for (const p of due) {
    const res = await publishPost(p.id);
    if (res.ok) count++;
  }
  return count;
}

function unwrap(data: Record<string, unknown>): Record<string, unknown> {
  const inner = data.data;
  if (inner && typeof inner === "object" && !Array.isArray(inner)) {
    return inner as Record<string, unknown>;
  }
  return data;
}

function str(obj: Record<string, unknown>, key: string): string | null {
  const v = obj[key];
  return typeof v === "string" && v ? v : typeof v === "number" ? String(v) : null;
}

/** Prefer Reddit fullname `t3_…` so later view fetches work. */
function normalizeRedditThingId(raw: string | null): string | null {
  if (!raw) return null;
  if (/^t3_/i.test(raw)) return raw;
  if (/^[a-z0-9]+$/i.test(raw)) return `t3_${raw}`;
  return raw;
}

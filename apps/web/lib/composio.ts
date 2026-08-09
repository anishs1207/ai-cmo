import { Composio } from "@composio/core";
import type { Platform } from "./platforms";

export type { Platform } from "./platforms";
export { ORGANIC_PLATFORMS } from "./platforms";

let client: Composio | null = null;

export function composio() {
  if (!client) {
    const apiKey = process.env.COMPOSIO_API_KEY;
    if (!apiKey) throw new Error("COMPOSIO_API_KEY missing. Add it to apps/web/.env");
    client = new Composio({ apiKey });
  }
  return client;
}

/** Composio user id for the app-owned Reddit account (set in .env after one-time setup). */
export function redditSharedUserId(): string {
  return process.env.REDDIT_SHARED_USER_ID || "ripple-shared-reddit";
}

export function isRedditConfigured(): boolean {
  return Boolean(process.env.REDDIT_SHARED_USER_ID?.trim());
}

/**
 * Reddit posts for ALL businesses go through one app-owned account.
 * Facebook/Instagram are connected per business (userId = businessId).
 */
export function composioUserId(platform: Platform, businessId: string): string {
  if (platform === "reddit") return redditSharedUserId();
  return businessId;
}

export async function startAuthorization(platform: Platform, businessId: string) {
  const userId = composioUserId(platform, businessId);
  const request = await composio().toolkits.authorize(userId, platform);
  return { accountId: request.id, redirectUrl: request.redirectUrl ?? null };
}

export async function isConnectionActive(accountId: string): Promise<boolean> {
  try {
    const account = await composio().connectedAccounts.get(accountId);
    return account.status === "ACTIVE";
  } catch {
    return false;
  }
}

type ExecResult = { successful: boolean; data: Record<string, unknown>; error?: string | null };

export async function executeTool(
  slug: string,
  userId: string,
  args: Record<string, unknown>,
): Promise<ExecResult> {
  const res = await composio().tools.execute(slug, {
    userId,
    arguments: args,
    dangerouslySkipVersionCheck: true,
  });
  return {
    successful: res.successful,
    data: (res.data ?? {}) as Record<string, unknown>,
    error: res.error,
  };
}

/** Fetch platform account metadata after OAuth completes (page id, ig user id, labels). */
export async function fetchAccountMeta(platform: Platform, userId: string) {
  if (platform === "facebook") {
    const res = await executeTool("FACEBOOK_GET_USER_PAGES", userId, {});
    if (!res.successful) throw new Error(res.error || "Could not list Facebook pages");
    const pages = extractArray(res.data, ["data"]);
    const page = pages[0] as { id?: string; name?: string } | undefined;
    if (!page?.id) throw new Error("No Facebook Page found on this account. Create a Page first.");
    return { externalId: page.id, label: page.name ?? "Facebook Page" };
  }
  if (platform === "instagram") {
    const res = await executeTool("INSTAGRAM_GET_USER_INFO", userId, { ig_user_id: "me" });
    if (!res.successful) throw new Error(res.error || "Could not fetch Instagram account");
    const info = (res.data.data ?? res.data) as { id?: string; user_id?: string; username?: string };
    const id = info.id ?? info.user_id;
    if (!id) throw new Error("No Instagram Business account found. Convert to a Business/Creator account.");
    return { externalId: String(id), label: info.username ? `@${info.username}` : "Instagram" };
  }
  // reddit: no extra metadata needed
  return { externalId: null, label: "Shared Reddit account" };
}

function extractArray(data: Record<string, unknown>, keys: string[]): unknown[] {
  let cur: unknown = data;
  for (const k of keys) {
    if (cur && typeof cur === "object" && k in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[k];
    }
  }
  if (Array.isArray(cur)) return cur;
  // some responses nest one level deeper: { data: { data: [...] } }
  if (cur && typeof cur === "object" && Array.isArray((cur as Record<string, unknown>).data)) {
    return (cur as Record<string, unknown>).data as unknown[];
  }
  return [];
}

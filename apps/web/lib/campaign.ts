import { db } from "./db";
import { generateJson, generateText } from "./gemini";
import type { BusinessKB } from "./kb";
import type { Platform } from "./composio";

type GeneratedPost = {
  platform: Platform;
  title?: string; // reddit only
  subreddit?: string; // reddit only
  body: string;
  hashtags?: string;
  rationale: string;
};

const STRATEGIST = `You are a world-class organic growth marketer: MBA in marketing, 15 years running organic social for DTC and SaaS brands, expert in storytelling, hooks and community-native content. You write content that sounds human and native to each platform, never like an ad. Your single goal: drive qualified visitors to the business's link.`;

export async function generateCampaignPosts(input: {
  kb: BusinessKB;
  objective: string;
  platforms: Platform[];
  postsPerPlatform: number;
  pastInsights: string[];
}): Promise<GeneratedPost[]> {
  const { kb, objective, platforms, postsPerPlatform, pastInsights } = input;

  const platformRules = [
    platforms.includes("instagram") &&
      `INSTAGRAM: caption 100-300 chars with a strong first-line hook, then value, then soft CTA. Provide 8-12 niche hashtags in "hashtags" (space separated, with #). Warm, visual, human voice.`,
    platforms.includes("facebook") &&
      `FACEBOOK: 2-4 short paragraphs. Story-first: relatable problem -> insight -> how the product helps -> CTA to check the link. Conversational, no hashtag spam (max 3 hashtags).`,
    platforms.includes("reddit") &&
      `REDDIT: pick a REAL active subreddit from the suggested list (or a better one you know). Write like a genuine community member sharing experience/value — NOT an ad. Title must be curiosity-driving, native to the subreddit, no clickbait caps. Body gives real value/story first; mention of the product must feel organic (e.g. "I've been using/building..."). Never violate the vibe of self-promotion-hostile subs; prefer subs that allow sharing projects (e.g. contain "somebodymakethis", "sideproject", niche hobby subs). Do NOT include the link in body; system appends it.`,
  ]
    .filter(Boolean)
    .join("\n");

  const insightBlock = pastInsights.length
    ? `\nLEARNINGS FROM PAST CAMPAIGNS (apply these — they came from real performance data):\n${pastInsights.map((s, i) => `${i + 1}. ${s}`).join("\n")}`
    : "";

  const prompt = `BUSINESS KNOWLEDGE BASE:
${JSON.stringify(kb, null, 2)}

CAMPAIGN OBJECTIVE: ${objective || "Drive traffic to the website"}
${insightBlock}

PLATFORM RULES:
${platformRules}

TASK: Generate exactly ${postsPerPlatform} post(s) for EACH of these platforms: ${platforms.join(", ")}.
Each post must use a DIFFERENT angle (pull from audienceSegments / contentThemes / keyBenefits — e.g. pain-point story, contrarian take, behind-the-scenes, social proof, how-to value post).

Return JSON: an array of objects:
{
  "platform": "instagram" | "facebook" | "reddit",
  "title": string,        // reddit only, <=300 chars; omit otherwise
  "subreddit": string,    // reddit only, real subreddit name WITHOUT r/ prefix; omit otherwise
  "body": string,         // the post content (no links)
  "hashtags": string,     // instagram/facebook only, space-separated with #; omit for reddit
  "rationale": string     // 1 sentence: the angle + why it should convert for this audience
}`;

  const posts = await generateJson<GeneratedPost[]>(prompt, STRATEGIST);
  return posts.filter((p) => platforms.includes(p.platform));
}

export function newLinkCode(): string {
  return Math.random().toString(36).slice(2, 8);
}

/** Analyze a finished/live campaign's real click data and store learnings for future generations. */
export async function analyzeCampaign(campaignId: string) {
  const campaign = await db.campaign.findUnique({
    where: { id: campaignId },
    include: {
      business: true,
      posts: { include: { link: { include: { clicks: true } } } },
    },
  });
  if (!campaign) throw new Error("Campaign not found");

  const published = campaign.posts.filter((p) => p.status === "published");
  if (published.length === 0) throw new Error("No published posts to analyze yet");

  const rows = published.map((p) => ({
    platform: p.platform,
    subreddit: p.subreddit ?? undefined,
    title: p.title ?? undefined,
    body: p.body.slice(0, 400),
    hashtags: p.hashtags ?? undefined,
    publishedAt: p.publishedAt,
    clicks: p.link?.clicks.length ?? 0,
    clicksByDay: bucketByDay(p.link?.clicks.map((c) => c.ts) ?? []),
  }));

  const analysis = await generateJson<{ summary: string; detail: string; learnings: string[] }>(
    `You are a growth analyst reviewing an ORGANIC social campaign's real performance so the next campaign performs better.

CAMPAIGN: ${campaign.name}
OBJECTIVE: ${campaign.objective ?? "traffic"}

PER-POST PERFORMANCE (clicks = real tracked link clicks to the business site):
${JSON.stringify(rows, null, 2)}

Return JSON:
{
  "summary": string,      // one headline sentence: the single most important takeaway
  "detail": string,       // markdown report: what worked, what flopped, per-platform verdicts, concrete next-step recommendations
  "learnings": string[]   // 3-6 short, reusable rules for the NEXT campaign, e.g. "Reddit value-first posts in r/X outperform promotional angles 4:1"
}
Be honest: with low click counts, say the data is thin and hedge accordingly.`,
  );

  const insight = await db.insight.create({
    data: {
      businessId: campaign.businessId,
      campaignId: campaign.id,
      summary: analysis.summary,
      detail:
        analysis.detail +
        (analysis.learnings.length
          ? `\n\n**Rules for next campaign:**\n${analysis.learnings.map((l) => `- ${l}`).join("\n")}`
          : ""),
    },
  });

  return { insight, learnings: analysis.learnings };
}

function bucketByDay(dates: Date[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const d of dates) {
    const key = d.toISOString().slice(0, 10);
    out[key] = (out[key] ?? 0) + 1;
  }
  return out;
}

export { generateText };

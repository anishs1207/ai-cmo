import { NextResponse } from "next/server";
import { db } from "../../../../../lib/db";
import { generateJson } from "../../../../../lib/gemini";
import { EMPTY_KB, type BusinessKB } from "../../../../../lib/kb";

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    const { instruction } = (await req.json().catch(() => ({}))) as { instruction?: string };

    const post = await db.post.findUnique({
      where: { id },
      include: { campaign: { include: { business: true } } },
    });
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
    if (post.status === "published" || post.status === "publishing") {
      return NextResponse.json({ error: "Published posts cannot be rewritten" }, { status: 409 });
    }

    const business = post.campaign.business;
    const kb: BusinessKB = business.kbJson ? { ...EMPTY_KB, ...JSON.parse(business.kbJson) } : EMPTY_KB;

    const insights = await db.insight.findMany({
      where: { businessId: business.id },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { summary: true },
    });

    const rewritten = await generateJson<{
      title?: string;
      subreddit?: string;
      body: string;
      hashtags?: string;
      rationale: string;
    }>(
      `You are a world-class organic growth marketer. Rewrite this ${post.platform} post to convert better. Keep it native to the platform, human, never ad-like.

BUSINESS KB:
${JSON.stringify(kb, null, 2)}

CAMPAIGN OBJECTIVE: ${post.campaign.objective ?? "Drive traffic"}
${insights.length ? `LEARNINGS FROM REAL PERFORMANCE DATA:\n${insights.map((i) => `- ${i.summary}`).join("\n")}` : ""}

CURRENT POST:
${post.title ? `title: ${post.title}` : ""}
${post.subreddit ? `subreddit: r/${post.subreddit}` : ""}
body: ${post.body}
${post.hashtags ? `hashtags: ${post.hashtags}` : ""}

${instruction?.trim() ? `USER'S REWRITE INSTRUCTION (top priority): ${instruction.trim()}` : "Take a sharper angle: stronger hook, clearer value, softer sell."}

Return JSON:
{
  "title": string,      // reddit only (<=300 chars), omit otherwise
  "subreddit": string,  // reddit only, real subreddit without r/ prefix, omit otherwise
  "body": string,       // no links; system appends tracked link
  "hashtags": string,   // instagram/facebook only, omit for reddit
  "rationale": string   // 1 sentence: what you changed and why
}`,
    );

    await db.post.update({
      where: { id },
      data: {
        title: rewritten.title ?? post.title,
        subreddit: rewritten.subreddit?.replace(/^r\//i, "") ?? post.subreddit,
        body: rewritten.body,
        hashtags: rewritten.hashtags ?? post.hashtags,
        rationale: rewritten.rationale,
        status: "draft",
        error: null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Rewrite failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { db } from "../../../../../lib/db";
import { publishPost } from "../../../../../lib/publish";

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const result = await publishPost(id);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 502 });

  // First successful publish flips campaign to live
  const post = await db.post.findUnique({ where: { id }, select: { campaignId: true } });
  if (post) {
    await db.campaign.updateMany({
      where: { id: post.campaignId, status: "draft" },
      data: { status: "live" },
    });
  }
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const post = await db.post.findUnique({ where: { id } });
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
  if (post.status === "published" || post.status === "publishing") {
    return NextResponse.json({ error: "Published posts cannot be edited" }, { status: 409 });
  }

  const body = (await req.json()) as Partial<{
    title: string;
    subreddit: string;
    body: string;
    hashtags: string;
    imageUrl: string;
  }>;

  if (typeof body.body === "string" && !body.body.trim()) {
    return NextResponse.json({ error: "Post body cannot be empty" }, { status: 400 });
  }

  await db.post.update({
    where: { id },
    data: {
      ...(body.title !== undefined ? { title: body.title.trim() || null } : {}),
      ...(body.subreddit !== undefined
        ? { subreddit: body.subreddit.trim().replace(/^r\//i, "") || null }
        : {}),
      ...(body.body !== undefined ? { body: body.body } : {}),
      ...(body.hashtags !== undefined ? { hashtags: body.hashtags.trim() || null } : {}),
      ...(body.imageUrl !== undefined ? { imageUrl: body.imageUrl.trim() || null } : {}),
    },
  });

  return NextResponse.json({ ok: true });
}

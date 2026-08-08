import { NextResponse } from "next/server";
import { db } from "../../../lib/db";

/**
 * Tracked link redirect: logs the click, then forwards to the business site
 * with UTM parameters so their own analytics attribute the visit too.
 */
export async function GET(req: Request, ctx: { params: Promise<{ code: string }> }) {
  const { code } = await ctx.params;
  const link = await db.trackedLink.findUnique({
    where: { code },
    include: { post: { select: { platform: true, campaignId: true } } },
  });
  if (!link) return new NextResponse("Not found", { status: 404 });

  const url = new URL(req.url);
  const source = url.searchParams.get("s") || link.post?.platform || "organic";

  await db.click
    .create({
      data: {
        linkId: link.id,
        referrer: req.headers.get("referer"),
        userAgent: req.headers.get("user-agent"),
      },
    })
    .catch(() => null);

  const dest = new URL(link.destination.startsWith("http") ? link.destination : `https://${link.destination}`);
  dest.searchParams.set("utm_source", source);
  dest.searchParams.set("utm_medium", "organic-social");
  dest.searchParams.set("utm_campaign", link.post?.campaignId ?? "ripple");

  return NextResponse.redirect(dest.toString(), 302);
}

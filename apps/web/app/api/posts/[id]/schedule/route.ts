import { NextResponse } from "next/server";
import { db } from "../../../../../lib/db";

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const { at } = (await req.json()) as { at: string };

  const when = new Date(at);
  if (Number.isNaN(when.getTime())) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }
  if (when.getTime() < Date.now()) {
    return NextResponse.json({ error: "Pick a time in the future" }, { status: 400 });
  }

  await db.post.update({
    where: { id },
    data: { status: "scheduled", scheduledAt: when, error: null },
  });

  return NextResponse.json({ ok: true });
}

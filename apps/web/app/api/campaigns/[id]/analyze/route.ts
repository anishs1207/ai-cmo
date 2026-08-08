import { NextResponse } from "next/server";
import { analyzeCampaign } from "../../../../../lib/campaign";

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    const { insight } = await analyzeCampaign(id);
    return NextResponse.json({ id: insight.id, summary: insight.summary });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getSavedVideos, saveVideoLocally } from "../../../../lib/mcp/storage";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const videos = getSavedVideos();
    return NextResponse.json({ videos, total: videos.length });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const saved = await saveVideoLocally(body);
    return NextResponse.json({ success: true, video: saved });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

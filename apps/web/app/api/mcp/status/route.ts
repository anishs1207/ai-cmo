import { NextResponse } from "next/server";
import { getAllMcpServersStatus } from "../../../../lib/mcp/client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const servers = await getAllMcpServersStatus();
    return NextResponse.json({ servers, timestamp: new Date().toISOString() });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

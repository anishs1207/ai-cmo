import { NextRequest, NextResponse } from "next/server";
import { executeMcpTool, MCP_TOOLS } from "../../../../lib/mcp/client";

export async function GET() {
  return NextResponse.json({ tools: MCP_TOOLS });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tool, args } = body;

    if (!tool || typeof tool !== "string") {
      return NextResponse.json({ error: "Tool name is required" }, { status: 400 });
    }

    const result = await executeMcpTool(tool, args || {});
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

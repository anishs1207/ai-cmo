import { NextRequest, NextResponse } from "next/server";
import { actorFrom, apiError } from "../../../../../lib/api";
import { listAuditEvents } from "../../../../../lib/workspaces";

type Context = { params: Promise<{ workspaceId: string }> };

export async function GET(request: NextRequest, context: Context) {
  try {
    const { workspaceId } = await context.params;
    return NextResponse.json({
      events: await listAuditEvents(actorFrom(request), workspaceId),
    });
  } catch (error) {
    return apiError(error);
  }
}

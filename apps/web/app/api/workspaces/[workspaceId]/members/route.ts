import { NextRequest, NextResponse } from "next/server";
import { actorFrom, apiError, validName } from "../../../../../lib/api";
import {
  addMember,
  WorkspaceError,
  type WorkspaceRole,
} from "../../../../../lib/workspaces";

type Context = { params: Promise<{ workspaceId: string }> };

export async function POST(request: NextRequest, context: Context) {
  try {
    const { workspaceId } = await context.params;
    const body = (await request.json()) as Record<string, unknown>;
    if (body.role !== "ADMIN" && body.role !== "VIEWER") {
      throw new WorkspaceError("Role must be ADMIN or VIEWER", 400);
    }
    if (typeof body.id !== "string" || !body.id.trim()) {
      throw new WorkspaceError("Member id is required", 400);
    }
    const workspace = await addMember(actorFrom(request), workspaceId, {
      id: body.id.trim(),
      name: validName(body.name),
      role: body.role as Exclude<WorkspaceRole, "OWNER">,
    });
    return NextResponse.json({ workspace }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}

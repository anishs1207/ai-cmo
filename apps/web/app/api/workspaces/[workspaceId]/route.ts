import { NextRequest, NextResponse } from "next/server";
import {
  actorFrom,
  apiError,
  validBusinessModel,
  validName,
} from "../../../../lib/api";
import { getWorkspace, updateWorkspace } from "../../../../lib/workspaces";

type Context = { params: Promise<{ workspaceId: string }> };

export async function GET(request: NextRequest, context: Context) {
  try {
    const { workspaceId } = await context.params;
    return NextResponse.json({
      workspace: await getWorkspace(actorFrom(request), workspaceId),
    });
  } catch (error) {
    return apiError(error);
  }
}

export async function PATCH(request: NextRequest, context: Context) {
  try {
    const { workspaceId } = await context.params;
    const body = (await request.json()) as Record<string, unknown>;
    const input = {
      ...(body.name === undefined ? {} : { name: validName(body.name) }),
      ...(body.businessModel === undefined
        ? {}
        : { businessModel: validBusinessModel(body.businessModel) }),
    };
    return NextResponse.json({
      workspace: await updateWorkspace(actorFrom(request), workspaceId, input),
    });
  } catch (error) {
    return apiError(error);
  }
}

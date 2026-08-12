import { NextRequest, NextResponse } from "next/server";
import {
  actorFrom,
  apiError,
  validBusinessModel,
  validName,
} from "../../../lib/api";
import { createWorkspace, listWorkspaces } from "../../../lib/workspaces";

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      workspaces: await listWorkspaces(actorFrom(request)),
    });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const workspace = await createWorkspace(actorFrom(request), {
      name: validName(body.name),
      businessModel: validBusinessModel(body.businessModel),
    });
    return NextResponse.json({ workspace }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}

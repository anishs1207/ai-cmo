import { NextRequest, NextResponse } from "next/server";
import { WorkspaceError, type Actor, type BusinessModel } from "./workspaces";

export function actorFrom(request: NextRequest): Actor {
  const id = request.headers.get("x-actor-id")?.trim();
  const name = request.headers.get("x-actor-name")?.trim();
  if (!id || !name) throw new WorkspaceError("Authentication required", 401);
  return { id, name };
}

export function validName(value: unknown) {
  if (
    typeof value !== "string" ||
    value.trim().length < 2 ||
    value.length > 80
  ) {
    throw new WorkspaceError("Name must be between 2 and 80 characters", 400);
  }
  return value.trim();
}

export function validBusinessModel(value: unknown): BusinessModel {
  if (value !== "ECOMMERCE" && value !== "SAAS") {
    throw new WorkspaceError("Business model must be ECOMMERCE or SAAS", 400);
  }
  return value;
}

export function apiError(error: unknown) {
  if (error instanceof WorkspaceError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status },
    );
  }
  console.error(error);
  return NextResponse.json(
    { error: "Unexpected server error" },
    { status: 500 },
  );
}

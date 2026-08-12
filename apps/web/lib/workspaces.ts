import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

export type WorkspaceRole = "OWNER" | "ADMIN" | "VIEWER";
export type BusinessModel = "ECOMMERCE" | "SAAS";
export type Actor = { id: string; name: string };
export type Membership = Actor & { role: WorkspaceRole; joinedAt: string };
export type Workspace = {
  id: string;
  name: string;
  businessModel: BusinessModel;
  createdAt: string;
  updatedAt: string;
  members: Membership[];
};
export type AuditEvent = {
  id: string;
  workspaceId: string;
  actorId: string;
  actorName: string;
  action: string;
  occurredAt: string;
  details: Record<string, string>;
};
type Store = { workspaces: Workspace[]; auditEvents: AuditEvent[] };
type Permission = "read" | "edit" | "manage_members";

const dataDirectory =
  process.env.VIBE_DATA_DIR ?? path.join(process.cwd(), ".data");
const storePath = path.join(dataDirectory, "workspaces.json");
let writeQueue = Promise.resolve();

export class WorkspaceError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

const permissions: Record<WorkspaceRole, ReadonlySet<Permission>> = {
  OWNER: new Set(["read", "edit", "manage_members"]),
  ADMIN: new Set(["read", "edit"]),
  VIEWER: new Set(["read"]),
};

async function loadStore(): Promise<Store> {
  try {
    return JSON.parse(await readFile(storePath, "utf8")) as Store;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return { workspaces: [], auditEvents: [] };
    }
    throw error;
  }
}

async function saveStore(store: Store) {
  await mkdir(dataDirectory, { recursive: true });
  const temporaryPath = `${storePath}.${randomUUID()}.tmp`;
  await writeFile(temporaryPath, JSON.stringify(store, null, 2), "utf8");
  await rename(temporaryPath, storePath);
}

async function mutate<T>(
  operation: (store: Store) => T | Promise<T>,
): Promise<T> {
  let result!: T;
  const pending = writeQueue.then(async () => {
    const store = await loadStore();
    result = await operation(store);
    await saveStore(store);
  });
  writeQueue = pending.catch(() => undefined);
  await pending;
  return result;
}

function findWorkspace(store: Store, workspaceId: string) {
  const workspace = store.workspaces.find((item) => item.id === workspaceId);
  if (!workspace) throw new WorkspaceError("Workspace not found", 404);
  return workspace;
}

function authorize(workspace: Workspace, actor: Actor, permission: Permission) {
  const membership = workspace.members.find((member) => member.id === actor.id);
  // Do not reveal whether another tenant exists.
  if (!membership) throw new WorkspaceError("Workspace not found", 404);
  if (!permissions[membership.role].has(permission)) {
    throw new WorkspaceError("You do not have permission for this action", 403);
  }
  return membership;
}

function appendAudit(
  store: Store,
  workspace: Workspace,
  actor: Actor,
  action: string,
  details: Record<string, string> = {},
) {
  store.auditEvents.push({
    id: randomUUID(),
    workspaceId: workspace.id,
    actorId: actor.id,
    actorName: actor.name,
    action,
    occurredAt: new Date().toISOString(),
    details,
  });
}

export async function listWorkspaces(actor: Actor) {
  const store = await loadStore();
  return store.workspaces.filter((workspace) =>
    workspace.members.some((member) => member.id === actor.id),
  );
}

export async function getWorkspace(actor: Actor, workspaceId: string) {
  const store = await loadStore();
  const workspace = findWorkspace(store, workspaceId);
  authorize(workspace, actor, "read");
  return workspace;
}

export async function createWorkspace(
  actor: Actor,
  input: { name: string; businessModel: BusinessModel },
) {
  return mutate((store) => {
    const now = new Date().toISOString();
    const workspace: Workspace = {
      id: randomUUID(),
      name: input.name,
      businessModel: input.businessModel,
      createdAt: now,
      updatedAt: now,
      members: [{ ...actor, role: "OWNER", joinedAt: now }],
    };
    store.workspaces.push(workspace);
    appendAudit(store, workspace, actor, "workspace.created", {
      name: input.name,
      businessModel: input.businessModel,
    });
    return workspace;
  });
}

export async function updateWorkspace(
  actor: Actor,
  workspaceId: string,
  input: Partial<Pick<Workspace, "name" | "businessModel">>,
) {
  return mutate((store) => {
    const workspace = findWorkspace(store, workspaceId);
    authorize(workspace, actor, "edit");
    if (input.name) workspace.name = input.name;
    if (input.businessModel) workspace.businessModel = input.businessModel;
    workspace.updatedAt = new Date().toISOString();
    appendAudit(store, workspace, actor, "workspace.updated", {
      fields: Object.keys(input).join(","),
    });
    return workspace;
  });
}

export async function addMember(
  actor: Actor,
  workspaceId: string,
  input: Actor & { role: Exclude<WorkspaceRole, "OWNER"> },
) {
  return mutate((store) => {
    const workspace = findWorkspace(store, workspaceId);
    authorize(workspace, actor, "manage_members");
    if (workspace.members.some((member) => member.id === input.id)) {
      throw new WorkspaceError("This user is already a member", 409);
    }
    workspace.members.push({ ...input, joinedAt: new Date().toISOString() });
    workspace.updatedAt = new Date().toISOString();
    appendAudit(store, workspace, actor, "workspace.member_added", {
      memberId: input.id,
      role: input.role,
    });
    return workspace;
  });
}

export async function listAuditEvents(actor: Actor, workspaceId: string) {
  const store = await loadStore();
  const workspace = findWorkspace(store, workspaceId);
  authorize(workspace, actor, "read");
  return store.auditEvents.filter((event) => event.workspaceId === workspaceId);
}

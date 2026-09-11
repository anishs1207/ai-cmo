import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const WAITLIST_DIR = path.join(process.cwd(), "public", "storage");
const WAITLIST_FILE = path.join(WAITLIST_DIR, "waitlist.json");

function ensureWaitlistStorage() {
  if (!fs.existsSync(WAITLIST_DIR)) {
    fs.mkdirSync(WAITLIST_DIR, { recursive: true });
  }
  if (!fs.existsSync(WAITLIST_FILE)) {
    fs.writeFileSync(WAITLIST_FILE, JSON.stringify([], null, 2));
  }
}

interface WaitlistEntry {
  id: string;
  email: string;
  website?: string;
  joinedAt: string;
  position: number;
}

function getWaitlist(): WaitlistEntry[] {
  ensureWaitlistStorage();
  try {
    const data = fs.readFileSync(WAITLIST_FILE, "utf-8");
    return JSON.parse(data) as WaitlistEntry[];
  } catch {
    return [];
  }
}

export async function GET() {
  const list = getWaitlist();
  const baseCount = 1420;
  return NextResponse.json({
    totalCount: baseCount + list.length,
    recentCount: list.length,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, website } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const list = getWaitlist();

    const existing = list.find((e) => e.email === cleanEmail);
    if (existing) {
      return NextResponse.json({
        success: true,
        alreadyJoined: true,
        position: existing.position,
        message: "You're already on the priority list! We'll reach out soon.",
      });
    }

    const baseCount = 1420;
    const position = baseCount + list.length + 1;
    const entry: WaitlistEntry = {
      id: "wait-" + Math.random().toString(36).substring(2, 9),
      email: cleanEmail,
      website: typeof website === "string" ? website.trim() : undefined,
      joinedAt: new Date().toISOString(),
      position,
    };

    list.push(entry);
    fs.writeFileSync(WAITLIST_FILE, JSON.stringify(list, null, 2));

    return NextResponse.json({
      success: true,
      position,
      totalCount: position,
      message: "You're on the list! Welcome to Bart.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

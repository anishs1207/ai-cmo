"use server";

import { requireUser } from "../../lib/auth/server";
import { db } from "../../lib/db";
import { extractKB } from "../../lib/kb";
import { scrapeSite } from "../../lib/scrape";

export type IntakeResult = { ok: true } | { ok: false; error: string };

export async function submitIntake(input: {
  websiteUrl?: string;
  description?: string;
  promote?: string;
}): Promise<IntakeResult> {
  const user = await requireUser();
  if (!user) return { ok: false, error: "Sign in required" };

  const existing = await db.business.findUnique({ where: { userId: user.id } });
  if (existing) return { ok: false, error: "You already have a business set up." };

  const websiteUrl = input.websiteUrl?.trim() || "";
  const description = input.description?.trim() || "";
  const promote = input.promote?.trim() || "";

  if (!websiteUrl && !description) {
    return { ok: false, error: "Provide a website link or a description." };
  }

  let websiteText: string | undefined;
  if (websiteUrl) {
    try {
      websiteText = await scrapeSite(websiteUrl);
    } catch {
      if (!description) {
        return {
          ok: false,
          error: "Could not read that website. Check the URL or add a description instead.",
        };
      }
    }
  }

  try {
    const kb = await extractKB({
      websiteUrl: websiteUrl || undefined,
      websiteText,
      description: description || undefined,
      promote: promote || undefined,
    });

    await db.business.create({
      data: {
        userId: user.id,
        name: kb.businessName || "My business",
        websiteUrl: websiteUrl || null,
        description: description || null,
        promote: promote || null,
        kbJson: JSON.stringify(kb),
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Intake failed";
    return { ok: false, error: message };
  }

  return { ok: true };
}

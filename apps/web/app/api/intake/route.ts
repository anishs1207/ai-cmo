import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { scrapeSite } from "../../../lib/scrape";
import { extractKB } from "../../../lib/kb";

export async function POST(req: Request) {
  try {
    const { websiteUrl, description, promote } = (await req.json()) as {
      websiteUrl?: string;
      description?: string;
      promote?: string;
    };

    if (!websiteUrl?.trim() && !description?.trim()) {
      return NextResponse.json({ error: "Provide a website link or a description." }, { status: 400 });
    }

    let websiteText: string | undefined;
    if (websiteUrl?.trim()) {
      try {
        websiteText = await scrapeSite(websiteUrl.trim());
      } catch {
        if (!description?.trim()) {
          return NextResponse.json(
            { error: "Could not read that website. Check the URL or add a description instead." },
            { status: 422 },
          );
        }
      }
    }

    const kb = await extractKB({
      websiteUrl: websiteUrl?.trim() || undefined,
      websiteText,
      description: description?.trim() || undefined,
      promote: promote?.trim() || undefined,
    });

    const business = await db.business.create({
      data: {
        name: kb.businessName || "My business",
        websiteUrl: websiteUrl?.trim() || null,
        description: description?.trim() || null,
        promote: promote?.trim() || null,
        kbJson: JSON.stringify(kb),
      },
    });

    return NextResponse.json({ id: business.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Intake failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

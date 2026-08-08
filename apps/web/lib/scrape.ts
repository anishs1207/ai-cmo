/** Fetch a public page and reduce it to readable plain text. */
export async function scrapeSite(url: string): Promise<string> {
  const target = url.startsWith("http") ? url : `https://${url}`;
  const res = await fetch(target, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; RippleBot/1.0; marketing context)" },
    signal: AbortSignal.timeout(15_000),
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`Could not fetch ${target} (HTTP ${res.status})`);
  const html = await res.text();
  return htmlToText(html).slice(0, 40_000);
}

function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<\/(p|div|section|article|li|h[1-6]|tr|br)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n+/g, "\n")
    .trim();
}

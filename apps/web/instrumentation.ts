/**
 * Background scheduler: flushes scheduled posts whose time has passed,
 * once per minute, for the lifetime of the server process.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const g = globalThis as unknown as { __rippleScheduler?: ReturnType<typeof setInterval> };
  if (g.__rippleScheduler) return; // dev hot-reload guard

  const { publishDueScheduled } = await import("./lib/publish");

  g.__rippleScheduler = setInterval(() => {
    publishDueScheduled().catch((err) => {
      console.error("[scheduler] flush failed:", err instanceof Error ? err.message : err);
    });
  }, 60_000);
}

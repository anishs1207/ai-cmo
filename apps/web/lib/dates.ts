/** Deterministic short date for SSR — avoids locale hydration mismatches. */
export function formatShortDate(input: Date | string): string {
  const d = typeof input === "string" ? new Date(input) : input;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

export function formatDateTime(input: Date | string): string {
  const d = typeof input === "string" ? new Date(input) : input;
  return `${formatShortDate(d)} ${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")} UTC`;
}

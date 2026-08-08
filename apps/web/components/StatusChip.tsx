export function StatusChip({ status }: { status: string }) {
  const map: Record<string, string> = {
    published: "chip-green",
    scheduled: "chip-violet",
    publishing: "chip-amber",
    failed: "chip-red",
    draft: "chip-gray",
    live: "chip-green",
    completed: "chip-gray",
    active: "chip-green",
    pending: "chip-amber",
  };
  return (
    <span className={`chip ${map[status] ?? "chip-gray"}`}>
      <span className="dot" />
      {status}
    </span>
  );
}

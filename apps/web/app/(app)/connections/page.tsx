import { isRedditConfigured } from "../../../lib/composio";
import { requireBusiness } from "../../../lib/db";
import { ConnectionsGrid } from "./ConnectionsGrid";

export const dynamic = "force-dynamic";

export default async function ConnectionsPage() {
  const business = await requireBusiness();

  const connections = ["instagram", "facebook", "reddit"].map((platform) => {
    const c = business.connections.find((x) => x.platform === platform);
    if (platform === "reddit" && isRedditConfigured()) {
      return { platform, status: "active", label: "Shared Reddit account" };
    }
    return {
      platform,
      status: c?.status ?? "none",
      label: c?.accountLabel ?? null,
    };
  });

  return (
    <>
      <div className="page-head rise">
        <div>
          <h1 className="display">Connections</h1>
          <p>Connect your channels once. Ripple publishes for you from then on.</p>
        </div>
      </div>
      <ConnectionsGrid initial={connections} />
    </>
  );
}

import { redirect } from "next/navigation";
import { isRedditConfigured } from "../../lib/composio";
import { getBusiness } from "../../lib/db";
import { Sidebar } from "../../components/Sidebar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const business = await getBusiness();
  if (!business) redirect("/onboarding");

  const connected = isRedditConfigured() ? 1 : 0;

  return (
    <div className="shell">
      <Sidebar businessName={business.name} connected={connected} />
      <main className="main">
        <div className="content">{children}</div>
      </main>
    </div>
  );
}

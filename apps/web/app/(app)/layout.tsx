import { redirect } from "next/navigation";
import { getBusiness } from "../../lib/db";
import { Sidebar } from "../../components/Sidebar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const business = await getBusiness();
  if (!business) redirect("/onboarding");

  const connected = business.connections.filter((c) => c.status === "active").length;

  return (
    <div className="shell">
      <Sidebar businessName={business.name} connected={connected} />
      <main className="main">
        <div className="content">{children}</div>
      </main>
    </div>
  );
}

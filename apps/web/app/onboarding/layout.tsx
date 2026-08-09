import { redirect } from "next/navigation";
import { getBusiness } from "../../lib/db";

export const dynamic = "force-dynamic";

export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const business = await getBusiness();
  // Send returning users into the app. Prefer /kb so a just-finished intake
  // lands on the knowledge base instead of bouncing through dashboard.
  if (business) redirect("/kb");
  return children;
}

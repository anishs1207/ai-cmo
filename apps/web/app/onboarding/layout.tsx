import { redirect } from "next/navigation";
import { getBusiness } from "../../lib/db";

export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const business = await getBusiness();
  if (business) redirect("/");
  return children;
}

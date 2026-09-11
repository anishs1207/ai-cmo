import { auth } from "../../../lib/auth/server";
import { WaitlistHero } from "../../../components/marketing/WaitlistHero";

export const dynamic = "force-dynamic";

export default async function WaitlistPage() {
  let signedIn = false;
  try {
    const { data: session } = await auth.getSession();
    signedIn = Boolean(session?.user);
  } catch {
    signedIn = false;
  }

  return <WaitlistHero signedIn={signedIn} />;
}

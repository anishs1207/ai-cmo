import { createNeonAuth } from "@neondatabase/auth/next/server";

export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET!,
    sameSite: "lax",
  },
});

export async function requireUser() {
  const { data: session } = await auth.getSession();
  if (!session?.user) return null;
  return session.user;
}

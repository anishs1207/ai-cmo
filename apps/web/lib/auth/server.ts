import { createNeonAuth } from "@neondatabase/auth/next/server";

const secret = process.env.NEON_AUTH_COOKIE_SECRET || "default_dev_secret_32_characters_long_12345";
const baseUrl = process.env.NEON_AUTH_BASE_URL || "http://localhost:3001/api/auth";

export const auth = createNeonAuth({
  baseUrl,
  cookies: {
    secret,
    sameSite: "lax",
  },
});

export async function requireUser() {
  try {
    const { data: session } = await auth.getSession();
    if (!session?.user) return null;
    return session.user;
  } catch {
    return null;
  }
}

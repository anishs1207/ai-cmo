import { auth } from "./lib/auth/server";
import { NextRequest } from "next/server";

const authMiddleware = auth.middleware({
  loginUrl: "/auth/sign-in",
});

export default function proxy(request: NextRequest) {
  if (request.headers.has("Next-Action")) return;

  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/auth") || pathname.startsWith("/r/")) return;
  if (pathname.startsWith("/api/auth")) return;

  return authMiddleware(request);
}

export const config = {
  matcher: [
    "/",
    "/onboarding",
    "/campaigns/:path*",
    "/kb",
    "/kb/:path*",
    "/account/:path*",
    "/api/:path*",
  ],
};

// import { auth } from "./lib/auth/server";
// import { NextRequest } from "next/server";

// const authMiddleware = auth.middleware({
//   loginUrl: "/auth/sign-in",
// });

// export default async function proxy(request: NextRequest) {
//   if (request.headers.has("Next-Action")) return;

//   const { pathname } = request.nextUrl;
//   if (pathname === "/" || pathname === "/waitlist" || pathname.startsWith("/waitlist")) return;
//   if (pathname.startsWith("/auth") || pathname.startsWith("/r/")) return;
//   if (pathname.startsWith("/api/")) return;

//   if (!process.env.NEON_AUTH_BASE_URL || !process.env.NEON_AUTH_COOKIE_SECRET) {
//     // In dev / unconfigured auth mode, allow navigation to proceed cleanly
//     return;
//   }

//   try {
//     return await authMiddleware(request);
//   } catch {
//     return;
//   }
// }

// export const config = {
//   // Do NOT match /api/* — Neon Auth middleware reads the body on authenticated
//   // POSTs (session cache only applies to GET), which breaks fetch() to route
//   // handlers with "Failed to fetch". API routes auth via requireUser()/getBusiness().
//   matcher: [
//     "/",
//     "/waitlist",
//     "/dashboard",
//     "/dashboard/:path*",
//     "/onboarding",
//     "/campaigns/:path*",
//     "/kb",
//     "/kb/:path*",
//     "/account/:path*",
//   ],
// };

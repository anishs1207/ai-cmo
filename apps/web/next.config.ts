import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";

const nextConfig: NextConfig = {
  // Dependencies are hoisted to the monorepo root. Pinning Turbopack's root
  // prevents it from intermittently losing the `next` package during HMR.
  turbopack: {
    root: fileURLToPath(new URL("../..", import.meta.url)),
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

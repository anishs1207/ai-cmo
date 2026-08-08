"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { createAuthClient } from "@neondatabase/auth/next";
import { NeonAuthUIProvider } from "@neondatabase/auth-ui";

const authClient = createAuthClient();

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <NeonAuthUIProvider
      authClient={authClient}
      navigate={router.push}
      replace={router.replace}
      onSessionChange={() => router.refresh()}
      social={{ providers: ["google"] }}
      redirectTo="/"
      Link={Link}
    >
      {children}
    </NeonAuthUIProvider>
  );
}

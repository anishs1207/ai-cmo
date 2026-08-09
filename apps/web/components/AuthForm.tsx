"use client";

import { useEffect, useState } from "react";
import { AuthView } from "@neondatabase/auth-ui";

export function AuthForm({ path }: { path: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="card card-pad" style={{ minHeight: 280, opacity: 0.7 }}>
        <div className="caption">Loading…</div>
      </div>
    );
  }

  return <AuthView path={path} />;
}

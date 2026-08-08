"use client";

import { useEffect, useState } from "react";

type Toast = { id: number; message: string; kind: "success" | "error" };

let nextId = 1;
let listener: ((t: Toast) => void) | null = null;

/** Sonner-style API: call from anywhere, no context needed. */
export function toast(message: string, kind: "success" | "error" = "success") {
  listener?.({ id: nextId++, message, kind });
}

const AUTO_DISMISS_MS = 3800;

export function Toaster() {
  const [toasts, setToasts] = useState<(Toast & { leaving?: boolean })[]>([]);

  useEffect(() => {
    listener = (t) => {
      setToasts((ts) => [...ts.slice(-2), t]);
      setTimeout(() => dismiss(t.id), AUTO_DISMISS_MS);
    };
    return () => {
      listener = null;
    };
  }, []);

  function dismiss(id: number) {
    // mark leaving, remove after exit transition (exit faster than enter)
    setToasts((ts) => ts.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    setTimeout(() => setToasts((ts) => ts.filter((t) => t.id !== id)), 220);
  }

  return (
    <div className="toaster" aria-live="polite">
      {toasts.map((t) => (
        <button
          key={t.id}
          className={`toast-item ${t.kind} ${t.leaving ? "leaving" : ""}`}
          onClick={() => dismiss(t.id)}
        >
          <span className={`toast-dot ${t.kind}`} />
          {t.message}
        </button>
      ))}
    </div>
  );
}

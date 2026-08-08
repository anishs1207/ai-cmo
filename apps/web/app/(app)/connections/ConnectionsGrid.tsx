"use client";

import { useEffect, useRef, useState } from "react";
import { PlatformBadge } from "../../../components/icons";
import { toast } from "../../../components/toast";

type Conn = { platform: string; status: string; label: string | null };

const copy: Record<string, { title: string; desc: string }> = {
  instagram: {
    title: "Instagram",
    desc: "Publishes image posts with captions and hashtags to your Business/Creator account.",
  },
  facebook: {
    title: "Facebook",
    desc: "Publishes posts with your tracked link to your Facebook Page.",
  },
  reddit: {
    title: "Reddit",
    desc: "Ripple posts to target subreddits through its own managed account — nothing to set up on your side.",
  },
};

export function ConnectionsGrid({ initial }: { initial: Conn[] }) {
  const [conns, setConns] = useState(initial);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => stopPoll(), []);

  function stopPoll() {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = null;
  }

  async function connect(platform: string) {
    setBusy(platform);
    setError(null);
    try {
      const res = await fetch("/api/connections/authorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not start authorization");

      if (data.redirectUrl) window.open(data.redirectUrl, "_blank", "noopener");

      setConns((cs) => cs.map((c) => (c.platform === platform ? { ...c, status: "pending" } : c)));

      // Poll until Composio reports the account as active.
      stopPoll();
      pollRef.current = setInterval(async () => {
        const v = await fetch(`/api/connections/verify?platform=${platform}`);
        const vd = await v.json();
        if (vd.status === "active") {
          stopPoll();
          setBusy(null);
          setConns((cs) =>
            cs.map((c) => (c.platform === platform ? { ...c, status: "active", label: vd.label } : c)),
          );
          toast(`${platform[0]!.toUpperCase()}${platform.slice(1)} connected`);
        }
        if (vd.status === "error") {
          stopPoll();
          setBusy(null);
          setError(vd.error || "Connection failed");
          setConns((cs) => cs.map((c) => (c.platform === platform ? { ...c, status: "error" } : c)));
        }
      }, 3000);
    } catch (err) {
      setBusy(null);
      setError(err instanceof Error ? err.message : "Could not start authorization");
    }
  }

  return (
    <>
      {error && <div className="error-note rise" style={{ marginBottom: 14 }}>{error}</div>}
      <div className="stack">
        {conns.map((c) => {
          const meta = copy[c.platform]!;
          const active = c.status === "active";
          const pending = busy === c.platform || c.status === "pending";
          return (
            <div key={c.platform} className="card card-pad rise spread" style={{ padding: "18px 20px" }}>
              <div className="row" style={{ gap: 14 }}>
                <PlatformBadge platform={c.platform} size={38} />
                <div>
                  <div className="row" style={{ gap: 8 }}>
                    <span className="title-3">{meta.title}</span>
                    {active && (
                      <span className="chip chip-green">
                        <span className="dot" />
                        {c.label || "connected"}
                      </span>
                    )}
                    {c.status === "error" && (
                      <span className="chip chip-red">
                        <span className="dot" />
                        error
                      </span>
                    )}
                  </div>
                  <div className="caption" style={{ marginTop: 3, maxWidth: 520 }}>{meta.desc}</div>
                </div>
              </div>

              {active ? (
                <button className="btn btn-secondary btn-sm" onClick={() => connect(c.platform)}>
                  Reconnect
                </button>
              ) : (
                <button className="btn btn-primary" onClick={() => connect(c.platform)} disabled={pending}>
                  {pending && <span className="spinner" />}
                  {pending ? "Waiting for approval…" : "Connect"}
                </button>
              )}
            </div>
          );
        })}
      </div>
      <p className="caption rise" style={{ marginTop: 18 }}>
        Authorization opens in a new tab via Composio&apos;s secure OAuth. Come back here after approving —
        the status updates automatically.
      </p>
    </>
  );
}

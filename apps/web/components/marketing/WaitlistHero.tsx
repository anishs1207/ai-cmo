"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface WaitlistHeroProps {
  signedIn?: boolean;
}

export function WaitlistHero({ signedIn = false }: WaitlistHeroProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error";
    message?: string;
    position?: number;
  }>({ type: "idle" });

  const [waitlistCount, setWaitlistCount] = useState(1428);

  useEffect(() => {
    fetch("/api/waitlist")
      .then((res) => res.json())
      .then((data) => {
        if (data.totalCount) setWaitlistCount(data.totalCount);
      })
      .catch(() => 0);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading) return;

    setLoading(true);
    setStatus({ type: "idle" });

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatus({
          type: "success",
          message: data.message || "You're on the list!",
          position: data.position,
        });
        setEmail("");
        if (data.totalCount) setWaitlistCount(data.totalCount);
      } else {
        setStatus({
          type: "error",
          message: data.error || "Failed to join waitlist. Please try again.",
        });
      }
    } catch {
      setStatus({
        type: "error",
        message: "Network error. Please try again in a moment.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background:
          "radial-gradient(85% 65% at 50% -15%, rgba(214, 222, 157, 0.55) 0%, transparent 60%), radial-gradient(50% 40% at 100% 90%, rgba(101, 107, 55, 0.08) 0%, transparent 50%), var(--bg-marketing)",
        color: "var(--text)",
        padding: "0 24px",
      }}
    >
      {/* Top Minimal Navigation */}
      <header
        style={{
          maxWidth: 1120,
          width: "100%",
          margin: "0 auto",
          padding: "24px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
            color: "var(--text)",
          }}
        >
          <span
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "var(--ink)",
              color: "var(--soft-olive)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 16,
              letterSpacing: "-0.04em",
            }}
          >
            B
          </span>
          <span style={{ fontWeight: 650, fontSize: "1.2rem", letterSpacing: "-0.02em" }}>
            Bart
          </span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {signedIn ? (
            <Link
              href="/dashboard"
              className="btn btn-primary"
              style={{ padding: "8px 18px", fontSize: 13 }}
            >
              Open Dashboard
            </Link>
          ) : (
            <Link
              href="/auth/sign-in"
              style={{
                fontSize: 13.5,
                fontWeight: 500,
                color: "var(--text-2)",
                padding: "6px 14px",
                borderRadius: 8,
                transition: "color 160ms var(--ease-out)",
              }}
            >
              Sign in →
            </Link>
          )}
        </div>
      </header>

      {/* Main Hero Container */}
      <main
        style={{
          maxWidth: 680,
          width: "100%",
          margin: "auto",
          textAlign: "center",
          padding: "48px 0 64px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Subtle AI CMO Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 14px",
            borderRadius: 999,
            background: "rgba(62, 66, 41, 0.07)",
            border: "1px solid var(--border)",
            marginBottom: 28,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--green)",
              boxShadow: "0 0 6px rgba(61, 122, 74, 0.6)",
            }}
          />
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.02em",
              color: "var(--ink)",
              textTransform: "uppercase",
            }}
          >
            AI CMO
          </span>
          <span style={{ color: "var(--border-strong)" }}>·</span>
          <span style={{ fontSize: 12, color: "var(--text-2)", fontWeight: 500 }}>
            Private Beta
          </span>
        </div>

        {/* Hero Title */}
        <h1
          style={{
            fontSize: "clamp(2.5rem, 6.5vw, 4.25rem)",
            fontWeight: 600,
            lineHeight: 1.06,
            letterSpacing: "-0.035em",
            color: "var(--ink)",
            marginBottom: 20,
          }}
        >
          Your autonomous marketing engine.
        </h1>

        {/* 2-line Minimalist Description */}
        <div
          style={{
            maxWidth: 540,
            fontSize: "clamp(1.05rem, 2.2vw, 1.25rem)",
            lineHeight: 1.55,
            color: "var(--text-2)",
            letterSpacing: "-0.01em",
            marginBottom: 36,
          }}
        >
          <p style={{ margin: "0 0 8px" }}>
            An autonomous AI CMO that turns your product into compounding organic and paid growth.
          </p>
          <p style={{ margin: 0, opacity: 0.9 }}>
            From UGC creative generation to multi-channel execution — marketing that learns what actually converts.
          </p>
        </div>

        {/* Minimalist Waitlist Form */}
        <div style={{ width: "100%", maxWidth: 440, marginBottom: 20 }}>
          {status.type === "success" ? (
            <div
              className="rise"
              style={{
                padding: "16px 20px",
                borderRadius: 12,
                background: "var(--surface)",
                border: "1px solid var(--green)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
              }}
            >
              <div style={{ fontSize: 20 }}>✓</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "var(--green)" }}>
                {status.message}
              </div>
              {status.position && (
                <div className="caption" style={{ color: "var(--text-2)", fontSize: 13 }}>
                  You are <strong>#{status.position.toLocaleString()}</strong> on the priority access list.
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ position: "relative", width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "#ffffff",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: "6px 6px 6px 16px",
                  boxShadow: "0 4px 16px rgba(62, 66, 41, 0.08)",
                  transition: "border-color 160ms var(--ease-out)",
                }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your work email..."
                  required
                  style={{
                    flex: 1,
                    border: "none",
                    background: "transparent",
                    color: "var(--ink)",
                    fontSize: 14.5,
                    outline: "none",
                    padding: "6px 0",
                  }}
                />
                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="btn btn-primary"
                  style={{
                    padding: "10px 20px",
                    borderRadius: 8,
                    fontSize: 13.5,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  {loading ? "Joining..." : "Join Waitlist"}
                </button>
              </div>

              {status.type === "error" && (
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 12.5,
                    color: "var(--red)",
                    textAlign: "left",
                    paddingLeft: 4,
                  }}
                >
                  {status.message}
                </div>
              )}
            </form>
          )}
        </div>

        {/* Social Proof Counter */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 12.5,
            color: "var(--text-3)",
            fontWeight: 500,
          }}
        >
          <span>✨</span>
          <span>{waitlistCount.toLocaleString()}+ founders waiting for access</span>
        </div>
      </main>

      {/* Sleek Minimal Footer */}
      <footer
        style={{
          maxWidth: 1120,
          width: "100%",
          margin: "0 auto",
          padding: "24px 0",
          borderTop: "1px solid rgba(207, 211, 168, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 12.5,
          color: "var(--text-3)",
        }}
      >
        <div>Bart · Autonomous AI CMO</div>
        <div style={{ display: "flex", gap: 16 }}>
          <span>Calm · Craft · Confident</span>
        </div>
      </footer>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlatformBadge } from "../../../../components/icons";
import { ORGANIC_PLATFORMS } from "../../../../lib/platforms";

export function NewCampaignForm({
  connectedPlatforms,
  learnings,
}: {
  connectedPlatforms: string[];
  learnings: string[];
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [objective, setObjective] = useState("");
  const [platforms, setPlatforms] = useState<string[]>(connectedPlatforms);
  const [count, setCount] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggle(p: string) {
    setPlatforms((ps) => (ps.includes(p) ? ps.filter((x) => x !== p) : [...ps, p]));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (platforms.length === 0) {
      setError("Pick at least one connected channel.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, objective, platforms, count }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      router.push(`/campaigns/${data.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
      setLoading(false);
    }
  }

  if (connectedPlatforms.length === 0) {
    return (
      <div className="card empty-state rise">
        <h3 className="title-3">Reddit is not configured yet</h3>
        <p className="caption" style={{ margin: "4px 0 0" }}>
          Ask your workspace admin to set <code>REDDIT_SHARED_USER_ID</code> in the server environment and connect
          Reddit in Composio.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="stack" style={{ maxWidth: 640 }}>
      <div className="card card-pad rise">
        <label className="field">
          <span>Campaign name</span>
          <input
            className="input"
            placeholder="e.g. Summer launch push"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label className="field">
          <span>Objective</span>
          <textarea
            className="textarea"
            style={{ minHeight: 70 }}
            placeholder="What should this campaign push? e.g. drive signups for the free trial, promote the new collection..."
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
          />
        </label>

        <div className="field">
          <span>Channels</span>
          <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
            {ORGANIC_PLATFORMS.map((p) => {
              const connected = connectedPlatforms.includes(p);
              const selected = platforms.includes(p);
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => connected && toggle(p)}
                  disabled={!connected}
                  className="btn"
                  style={{
                    height: 40,
                    paddingLeft: 10,
                    background: selected ? "rgba(101,107,55,0.12)" : "var(--surface)",
                    border: `1.5px solid ${selected ? "var(--text-2)" : "var(--border-strong)"}`,
                    color: selected ? "var(--accent-deep)" : "var(--text-2)",
                    opacity: connected ? 1 : 0.4,
                  }}
                >
                  <PlatformBadge platform={p} size={22} />
                  <span style={{ textTransform: "capitalize" }}>{p}</span>
                  {!connected && <span className="caption" style={{ fontSize: 10.5 }}>not connected</span>}
                </button>
              );
            })}
          </div>
        </div>

        <label className="field">
          <span>Posts per channel</span>
          <select className="select" value={count} onChange={(e) => setCount(Number(e.target.value))}>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "post" : "posts"} — {n} different angle{n > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </label>

      </div>

      {learnings.length > 0 && (
        <div className="card card-pad rise" style={{ background: "var(--violet-bg)", border: "none" }}>
          <div className="micro" style={{ color: "var(--violet)", marginBottom: 8 }}>
            Applying learnings from past campaigns
          </div>
          {learnings.map((l, i) => (
            <div key={i} style={{ fontSize: 12.5, lineHeight: 1.6 }}>
              · {l}
            </div>
          ))}
        </div>
      )}

      {error && <div className="error-note rise">{error}</div>}

      <div className="row rise" style={{ justifyContent: "flex-end" }}>
        <button type="submit" className="btn btn-primary" style={{ height: 42, padding: "0 22px" }} disabled={loading}>
          {loading && <span className="spinner" />}
          {loading ? "Writing your posts…" : "Generate campaign"}
        </button>
      </div>
    </form>
  );
}

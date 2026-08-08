"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlatformBadge } from "../../../../components/icons";
import { StatusChip } from "../../../../components/StatusChip";
import { toast } from "../../../../components/toast";
import { formatShortDate, formatDateTime } from "../../../../lib/dates";

type PostVM = {
  id: string;
  platform: string;
  title: string | null;
  subreddit: string | null;
  body: string;
  hashtags: string | null;
  imageUrl: string | null;
  rationale: string | null;
  status: string;
  error: string | null;
  scheduledAt: string | null;
  publishedAt: string | null;
  externalUrl: string | null;
  clicks: number;
  trackedUrl: string | null;
};

type InsightVM = { id: string; summary: string; detail: string; createdAt: string };

export function CampaignDetail({
  campaign,
  posts,
  insights,
}: {
  campaign: { id: string; name: string; objective: string | null; status: string; createdAt: string };
  posts: PostVM[];
  insights: InsightVM[];
}) {
  const router = useRouter();
  const [analyzing, setAnalyzing] = useState(false);
  const [openInsight, setOpenInsight] = useState<string | null>(insights[0]?.id ?? null);

  const totalClicks = posts.reduce((n, p) => n + p.clicks, 0);
  const publishedCount = posts.filter((p) => p.status === "published").length;

  async function analyze() {
    setAnalyzing(true);
    try {
      const res = await fetch(`/api/campaigns/${campaign.id}/analyze`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      toast("Analysis ready — learnings will shape the next campaign");
      router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Analysis failed", "error");
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <>
      <div className="page-head rise">
        <div>
          <div className="row" style={{ gap: 10 }}>
            <h1 className="display">{campaign.name}</h1>
            <StatusChip status={campaign.status} />
          </div>
          <p>
            {campaign.objective || "Drive traffic"} · {publishedCount}/{posts.length} published ·{" "}
            <b>{totalClicks} clicks</b>
          </p>
        </div>
        <button className="btn btn-secondary" onClick={analyze} disabled={analyzing || publishedCount === 0}>
          {analyzing && <span className="spinner spinner-dark" />}
          {analyzing ? "Analyzing…" : "Analyze performance"}
        </button>
      </div>

      {insights.length > 0 && (
        <div
          className="card rise"
          style={{ marginBottom: 18, overflow: "hidden", background: "var(--violet-bg)", border: "none" }}
        >
          {insights.map((ins) => (
            <div key={ins.id} style={{ padding: "14px 20px", borderBottom: "1px solid rgba(110,86,207,0.12)" }}>
              <button
                className="spread"
                onClick={() => setOpenInsight(openInsight === ins.id ? null : ins.id)}
                style={{ width: "100%", background: "none", border: 0, padding: 0, textAlign: "left" }}
              >
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--violet)" }}>
                  Agent analysis · {formatShortDate(ins.createdAt)}
                </span>
                <span className="caption">{openInsight === ins.id ? "hide" : "show"}</span>
              </button>
              <div style={{ fontSize: 13, marginTop: 6 }}>{ins.summary}</div>
              {openInsight === ins.id && (
                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    fontFamily: "inherit",
                    fontSize: 12.5,
                    lineHeight: 1.6,
                    margin: "10px 0 0",
                    color: "var(--text-2)",
                  }}
                >
                  {ins.detail}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="stack">
        {posts.map((p) => (
          <PostCard key={p.id} post={p} onChanged={() => router.refresh()} />
        ))}
      </div>
    </>
  );
}

function PostCard({ post, onChanged }: { post: PostVM; onChanged: () => void }) {
  const editable = post.status === "draft" || post.status === "failed" || post.status === "scheduled";
  const [mode, setMode] = useState<"view" | "edit" | "rewrite" | "schedule">("view");
  const [busy, setBusy] = useState<"publish" | "save" | "rewrite" | "schedule" | null>(null);

  const [draft, setDraft] = useState({
    title: post.title ?? "",
    subreddit: post.subreddit ?? "",
    body: post.body,
    hashtags: post.hashtags ?? "",
    imageUrl: post.imageUrl ?? "",
  });
  const [instruction, setInstruction] = useState("");
  const [at, setAt] = useState("");

  async function call(
    kind: "publish" | "save" | "rewrite" | "schedule",
    url: string,
    body?: unknown,
    okMessage?: string,
  ) {
    setBusy(kind);
    try {
      const res = await fetch(url, {
        method: kind === "save" ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      if (okMessage) toast(okMessage);
      setMode("view");
      onChanged();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Request failed", "error");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="card rise" style={{ overflow: "hidden" }}>
      <div className="spread" style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)" }}>
        <div className="row" style={{ gap: 10 }}>
          <PlatformBadge platform={post.platform} size={28} />
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600, textTransform: "capitalize" }}>
              {post.platform}
              {post.subreddit && (
                <span style={{ color: "var(--text-2)", fontWeight: 500, textTransform: "none" }}>
                  {" "}· r/{post.subreddit}
                </span>
              )}
            </div>
            {post.rationale && <div className="caption" style={{ fontSize: 11.5 }}>{post.rationale}</div>}
          </div>
        </div>
        <div className="row" style={{ gap: 10 }}>
          <span style={{ fontWeight: 700 }}>{post.clicks}</span>
          <span className="caption" style={{ fontSize: 11 }}>clicks</span>
          <StatusChip status={post.status} />
        </div>
      </div>

      <div style={{ padding: "16px 20px" }}>
        {mode === "edit" ? (
          <div className="stack" style={{ gap: 10 }}>
            {post.platform === "reddit" && (
              <div className="grid-2" style={{ gap: 10 }}>
                <label className="field" style={{ margin: 0 }}>
                  <span>Title</span>
                  <input
                    className="input"
                    value={draft.title}
                    onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  />
                </label>
                <label className="field" style={{ margin: 0 }}>
                  <span>Subreddit</span>
                  <input
                    className="input"
                    value={draft.subreddit}
                    onChange={(e) => setDraft({ ...draft, subreddit: e.target.value })}
                  />
                </label>
              </div>
            )}
            <label className="field" style={{ margin: 0 }}>
              <span>Post body</span>
              <textarea
                className="textarea"
                style={{ minHeight: 120 }}
                value={draft.body}
                onChange={(e) => setDraft({ ...draft, body: e.target.value })}
              />
            </label>
            {post.platform !== "reddit" && (
              <label className="field" style={{ margin: 0 }}>
                <span>Hashtags</span>
                <input
                  className="input"
                  value={draft.hashtags}
                  onChange={(e) => setDraft({ ...draft, hashtags: e.target.value })}
                />
              </label>
            )}
            {post.platform === "instagram" && (
              <label className="field" style={{ margin: 0 }}>
                <span>Image URL</span>
                <input
                  className="input"
                  value={draft.imageUrl}
                  onChange={(e) => setDraft({ ...draft, imageUrl: e.target.value })}
                />
              </label>
            )}
          </div>
        ) : (
          <>
            {post.title && <div style={{ fontWeight: 650, marginBottom: 8, fontSize: 14.5 }}>{post.title}</div>}
            <div style={{ whiteSpace: "pre-wrap", fontSize: 13.5, lineHeight: 1.6 }}>{post.body}</div>
            {post.hashtags && (
              <div style={{ marginTop: 10, fontSize: 12.5, color: "var(--accent-deep)" }}>{post.hashtags}</div>
            )}
            {post.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.imageUrl}
                alt=""
                style={{ marginTop: 12, maxHeight: 180, borderRadius: 10, border: "1px solid var(--border)" }}
              />
            )}
            {post.error && <div className="error-note" style={{ marginTop: 12 }}>{post.error}</div>}
          </>
        )}
      </div>

      <div
        className="spread"
        style={{ padding: "12px 20px", background: "var(--surface-2)", borderTop: "1px solid var(--border)", flexWrap: "wrap" }}
      >
        <div className="caption" style={{ fontSize: 11.5 }}>
          {post.trackedUrl && (
            <>
              tracked link: <span style={{ fontFamily: "monospace" }}>{post.trackedUrl}</span>
            </>
          )}
          {post.scheduledAt && post.status === "scheduled" && (
            <> · goes live {formatDateTime(post.scheduledAt)}</>
          )}
          {post.externalUrl && (
            <>
              {" · "}
              <a href={post.externalUrl} target="_blank" rel="noreferrer" style={{ color: "var(--accent)", fontWeight: 600 }}>
                view live post
              </a>
            </>
          )}
        </div>

        {editable && (
          <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
            {mode === "edit" && (
              <>
                <button className="btn btn-ghost btn-sm" onClick={() => setMode("view")} disabled={busy !== null}>
                  Cancel
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => call("save", `/api/posts/${post.id}`, draft, "Post updated")}
                  disabled={busy !== null}
                >
                  {busy === "save" && <span className="spinner" />}
                  Save changes
                </button>
              </>
            )}

            {mode === "rewrite" && (
              <>
                <input
                  className="input"
                  style={{ width: 280, height: 30, padding: "0 10px", fontSize: 12 }}
                  placeholder="Optional: tell the agent what to change…"
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  autoFocus
                />
                <button className="btn btn-ghost btn-sm" onClick={() => setMode("view")} disabled={busy !== null}>
                  Cancel
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() =>
                    call("rewrite", `/api/posts/${post.id}/rewrite`, { instruction }, "Rewritten with a sharper angle")
                  }
                  disabled={busy !== null}
                >
                  {busy === "rewrite" && <span className="spinner" />}
                  {busy === "rewrite" ? "Rewriting…" : "Rewrite"}
                </button>
              </>
            )}

            {mode === "schedule" && (
              <>
                <input
                  type="datetime-local"
                  className="input"
                  style={{ width: 210, height: 30, padding: "0 8px", fontSize: 12 }}
                  value={at}
                  onChange={(e) => setAt(e.target.value)}
                />
                <button className="btn btn-ghost btn-sm" onClick={() => setMode("view")} disabled={busy !== null}>
                  Cancel
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => call("schedule", `/api/posts/${post.id}/schedule`, { at }, "Scheduled")}
                  disabled={busy !== null || !at}
                >
                  {busy === "schedule" && <span className="spinner spinner-dark" />}
                  Set
                </button>
              </>
            )}

            {mode === "view" && (
              <>
                <button className="btn btn-ghost btn-sm" onClick={() => setMode("edit")} disabled={busy !== null}>
                  Edit
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => setMode("rewrite")} disabled={busy !== null}>
                  ✦ Rewrite
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => setMode("schedule")} disabled={busy !== null}>
                  Schedule
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => call("publish", `/api/posts/${post.id}/publish`, undefined, "Published")}
                  disabled={busy !== null}
                >
                  {busy === "publish" && <span className="spinner" />}
                  {busy === "publish" ? "Publishing…" : post.status === "failed" ? "Retry publish" : "Publish now"}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

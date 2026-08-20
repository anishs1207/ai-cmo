"use client";

import React, { useState } from "react";
import { UgcVideoJob, SavedVideoAsset } from "../../lib/mcp/types";

interface UgcVideoCardProps {
  video: UgcVideoJob | SavedVideoAsset;
  onSaveSuccess?: () => void;
}

export function UgcVideoCard({ video, onSaveSuccess }: UgcVideoCardProps) {
  const [saving, setSaving] = useState(false);
  const [savedLocally, setSavedLocally] = useState(Boolean(video.localPath));

  const videoSrc = ("videoUrl" in video && video.videoUrl)
    ? video.videoUrl
    : ("publicUrl" in video && video.publicUrl)
    ? video.publicUrl
    : "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";

  const handleSaveLocally = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const res = await fetch("/api/mcp/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "title" in video ? video.title : video.prompt.slice(0, 40),
          prompt: video.prompt,
          videoUrl: videoSrc,
          style: video.style,
          aspectRatio: video.aspectRatio,
          durationSeconds: video.durationSeconds,
          thumbnailUrl: video.thumbnailUrl,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSavedLocally(true);
        if (onSaveSuccess) onSaveSuccess();
      }
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="card rise"
      style={{
        marginTop: 12,
        marginBottom: 12,
        overflow: "hidden",
        border: "1px solid var(--border)",
        background: "var(--card)",
      }}
    >
      <div
        className="spread"
        style={{
          padding: "10px 14px",
          background: "rgba(62, 66, 41, 0.05)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="row" style={{ gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 16 }}>🎬</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>
            Higgsfield AI UGC Video
          </span>
          <span
            style={{
              fontSize: 10.5,
              padding: "2px 8px",
              borderRadius: 6,
              background: "var(--soft-olive)",
              color: "var(--ink)",
              fontWeight: 600,
              textTransform: "capitalize",
            }}
          >
            {video.style.replace(/_/g, " ")}
          </span>
          <span
            style={{
              fontSize: 10.5,
              padding: "2px 6px",
              borderRadius: 4,
              background: "rgba(0,0,0,0.06)",
              color: "var(--muted)",
            }}
          >
            {video.aspectRatio} · {video.durationSeconds}s
          </span>
        </div>

        <div className="row" style={{ gap: 8 }}>
          <button
            onClick={handleSaveLocally}
            disabled={saving}
            className="btn btn-secondary"
            style={{
              padding: "4px 10px",
              fontSize: 11.5,
              background: savedLocally ? "rgba(61, 122, 74, 0.15)" : undefined,
              borderColor: savedLocally ? "var(--green)" : undefined,
              color: savedLocally ? "var(--green)" : "var(--ink)",
            }}
          >
            {saving ? "Saving..." : savedLocally ? "✓ Saved Locally" : "💾 Save Locally"}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 16, padding: 14 }}>
        {/* Video Player */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            minHeight: 180,
            maxHeight: 280,
            borderRadius: 8,
            overflow: "hidden",
            background: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <video
            src={videoSrc}
            poster={video.thumbnailUrl}
            controls
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: video.aspectRatio === "9:16" ? "contain" : "cover",
            }}
          />
        </div>

        {/* Video Details */}
        <div className="stack" style={{ gap: 10, justifyContent: "center" }}>
          <div>
            <div className="micro" style={{ color: "var(--muted)", marginBottom: 3 }}>
              PROMPT / SCRIPT ANGLE
            </div>
            <div style={{ fontSize: 13, color: "var(--ink)", lineHeight: 1.45 }}>
              {video.prompt}
            </div>
          </div>

          {"script" in video && video.script && (
            <div
              style={{
                padding: "8px 10px",
                background: "rgba(0,0,0,0.03)",
                borderRadius: 6,
                fontSize: 12,
                color: "var(--muted)",
                fontStyle: "italic",
              }}
            >
              &ldquo;{video.script}&rdquo;
            </div>
          )}

          <div
            className="row spread"
            style={{
              paddingTop: 8,
              borderTop: "1px dashed var(--border)",
              fontSize: 11.5,
              color: "var(--muted)",
            }}
          >
            <span>Model: <strong>Higgsfield DoP v2</strong></span>
            <span>Soul Mode: <strong>Active</strong></span>
            {video.localPath && (
              <span title={video.localPath} style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                📁 Local: {video.localPath.split(/[\\/]/).pop()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

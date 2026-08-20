"use client";

import React, { useState, useEffect } from "react";
import { SavedVideoAsset, UgcVideoJob, UgcVideoStyle, UgcAspectRatio } from "../../lib/mcp/types";
import { UgcVideoCard } from "./UgcVideoCard";

export function UgcStudio() {
  const [savedVideos, setSavedVideos] = useState<SavedVideoAsset[]>([]);
  const [prompt, setPrompt] = useState("");
  const [script, setScript] = useState("");
  const [style, setStyle] = useState<UgcVideoStyle>("customer_testimonial");
  const [aspectRatio, setAspectRatio] = useState<UgcAspectRatio>("9:16");
  const [duration, setDuration] = useState(15);
  const [generating, setGenerating] = useState(false);
  const [latestJob, setLatestJob] = useState<UgcVideoJob | null>(null);

  const fetchVideos = async () => {
    try {
      const res = await fetch("/api/mcp/videos");
      const data = await res.json();
      if (data.videos) setSavedVideos(data.videos);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || generating) return;

    setGenerating(true);
    try {
      const res = await fetch("/api/mcp/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: "higgsfield_generate_ugc_video",
          args: {
            prompt,
            script: script.trim() || undefined,
            style,
            aspectRatio,
            durationSeconds: duration,
            autoSaveLocally: true,
          },
        }),
      });

      const data = await res.json();
      if (data.successful && data.data) {
        setLatestJob(data.data as UgcVideoJob);
        fetchVideos();
      }
    } catch {
      // ignore
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="stack" style={{ gap: 20 }}>
      {/* Creator Form Card */}
      <div className="card card-pad rise">
        <div className="spread" style={{ marginBottom: 14 }}>
          <div>
            <h2 className="title-3">Higgsfield AI UGC Video Studio</h2>
            <p className="caption">
              Generate photorealistic UGC ads with director camera movement and auto-save locally to disk.
            </p>
          </div>
          <span className="chip" style={{ background: "var(--soft-olive)", color: "var(--ink)", fontWeight: 600 }}>
            Higgsfield DoP v2 Engine
          </span>
        </div>

        <form onSubmit={handleGenerate} className="stack" style={{ gap: 14 }}>
          <div>
            <label className="micro" style={{ display: "block", marginBottom: 4 }}>
              SCENE & PRODUCT PROMPT
            </label>
            <textarea
              className="input"
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Enthusiastic creator in modern kitchen unboxing ceremonial grade matcha, preparing latte with bamboo whisk, smiling to camera with radiant morning energy"
              required
            />
          </div>

          <div>
            <label className="micro" style={{ display: "block", marginBottom: 4 }}>
              VOICEOVER / SELFIE SCRIPT (OPTIONAL)
            </label>
            <input
              type="text"
              className="input"
              value={script}
              onChange={(e) => setScript(e.target.value)}
              placeholder="e.g. If you're tired of the 2 PM coffee crash, this 100% ceremonial matcha changed my entire morning routine..."
            />
          </div>

          <div className="grid-3" style={{ gap: 12 }}>
            <div>
              <label className="micro" style={{ display: "block", marginBottom: 4 }}>
                UGC STYLE ANGLE
              </label>
              <select
                className="input"
                value={style}
                onChange={(e) => setStyle(e.target.value as UgcVideoStyle)}
              >
                <option value="customer_testimonial">Customer Testimonial (Authentic Selfie)</option>
                <option value="unboxing_review">Unboxing & First Impression</option>
                <option value="pain_point_solution">Pain Point & Instant Relief</option>
                <option value="tiktok_viral_hook">TikTok / Reels Viral Hook</option>
                <option value="founder_story">Founder Behind-the-Scenes</option>
                <option value="cinematic_commercial">Cinematic Brand Commercial</option>
              </select>
            </div>

            <div>
              <label className="micro" style={{ display: "block", marginBottom: 4 }}>
                ASPECT RATIO
              </label>
              <select
                className="input"
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as UgcAspectRatio)}
              >
                <option value="9:16">9:16 (IG Reels / TikTok / YouTube Shorts)</option>
                <option value="16:9">16:9 (YouTube In-Stream / Desktop FB)</option>
                <option value="1:1">1:1 (Square Feed)</option>
              </select>
            </div>

            <div>
              <label className="micro" style={{ display: "block", marginBottom: 4 }}>
                DURATION
              </label>
              <select
                className="input"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
              >
                <option value={15}>15 Seconds (High CTR Hook)</option>
                <option value={30}>30 Seconds (Full Story & Demo)</option>
                <option value={60}>60 Seconds (Deep Explainer)</option>
              </select>
            </div>
          </div>

          <div className="row spread" style={{ marginTop: 6, alignItems: "center" }}>
            <span className="caption" style={{ color: "var(--muted)" }}>
              ⚡ Automatically downloaded and saved locally in <code>/public/storage/ugc-videos/</code>
            </span>
            <button type="submit" disabled={generating || !prompt.trim()} className="btn btn-primary">
              {generating ? "Generating UGC Video via Higgsfield..." : "🎬 Generate & Save Video Locally"}
            </button>
          </div>
        </form>
      </div>

      {/* Latest Generation Output */}
      {latestJob && (
        <div className="stack" style={{ gap: 8 }}>
          <h3 className="title-3">Latest Generated Video</h3>
          <UgcVideoCard video={latestJob} onSaveSuccess={fetchVideos} />
        </div>
      )}

      {/* Saved Videos Gallery */}
      <div className="card card-pad rise">
        <div className="spread" style={{ marginBottom: 16 }}>
          <h3 className="title-3">Locally Saved UGC Video Assets ({savedVideos.length})</h3>
          <span className="caption">Available for Meta (FB/IG) and Google (YouTube) Ads</span>
        </div>

        {savedVideos.length === 0 ? (
          <div className="empty-state">
            <p className="caption">No videos saved yet. Generate your first UGC video above.</p>
          </div>
        ) : (
          <div className="stack" style={{ gap: 12 }}>
            {savedVideos.map((vid) => (
              <UgcVideoCard key={vid.id} video={vid} onSaveSuccess={fetchVideos} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

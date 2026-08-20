"use client";

import React, { useState, useEffect } from "react";
import { YouTubeCampaign, YouTubeAdFormat } from "../../lib/mcp/types";
import { YouTubeAdsCard } from "./YouTubeAdsCard";

export function YouTubeAdsManager() {
  const [campaigns, setCampaigns] = useState<YouTubeCampaign[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [budget, setBudget] = useState(25);
  const [adFormat, setAdFormat] = useState<YouTubeAdFormat>("YOUTUBE_SHORTS");
  const [headline, setHeadline] = useState("");
  const [longHeadline, setLongHeadline] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch("/api/mcp/campaigns");
      const data = await res.json();
      if (data.youtube?.campaigns) setCampaigns(data.youtube.campaigns);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !headline.trim() || creating) return;

    setCreating(true);
    try {
      const res = await fetch("/api/mcp/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: "google_ads_create_youtube_campaign",
          args: {
            name,
            adFormat,
            dailyBudget: budget,
            headline,
            longHeadline: longHeadline.trim() || undefined,
            callToAction: "Shop Now",
            biddingStrategy: "TARGET_CPV",
            targetCpv: 0.02,
          },
        }),
      });

      const data = await res.json();
      if (data.successful) {
        setShowCreate(false);
        setName("");
        setHeadline("");
        setLongHeadline("");
        fetchCampaigns();
      }
    } catch {
      // ignore
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="stack" style={{ gap: 20 }}>
      {/* Header Summary */}
      <div className="card card-pad rise">
        <div className="spread" style={{ alignItems: "center" }}>
          <div>
            <div className="row" style={{ gap: 8, alignItems: "center" }}>
              <h2 className="title-3">Google Ads (YouTube Video Campaigns)</h2>
              <span className="chip" style={{ background: "rgba(255, 0, 0, 0.12)", color: "#cc0000", fontWeight: 600 }}>
                Google Ads MCP
              </span>
            </div>
            <p className="caption" style={{ marginTop: 4 }}>
              Directly deploy YouTube Shorts and In-Stream video ad campaigns connected to your Higgsfield UGC assets.
            </p>
          </div>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="btn btn-primary"
          >
            {showCreate ? "Close Form" : "+ New YouTube Campaign"}
          </button>
        </div>
      </div>

      {/* Campaign Creation Form */}
      {showCreate && (
        <div className="card card-pad rise" style={{ border: "1px solid var(--accent)" }}>
          <h3 className="title-3" style={{ marginBottom: 12 }}>
            Launch New YouTube Video Ad Campaign
          </h3>
          <form onSubmit={handleCreate} className="stack" style={{ gap: 14 }}>
            <div className="grid-2" style={{ gap: 12 }}>
              <div>
                <label className="micro" style={{ display: "block", marginBottom: 4 }}>
                  CAMPAIGN NAME
                </label>
                <input
                  type="text"
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. YouTube Shorts Viral Hook - Matcha Starter"
                  required
                />
              </div>

              <div>
                <label className="micro" style={{ display: "block", marginBottom: 4 }}>
                  YOUTUBE AD FORMAT
                </label>
                <select
                  className="input"
                  value={adFormat}
                  onChange={(e) => setAdFormat(e.target.value as YouTubeAdFormat)}
                >
                  <option value="YOUTUBE_SHORTS">YouTube Shorts (Vertical 9:16 Video)</option>
                  <option value="SKIPPABLE_IN_STREAM">Skippable In-Stream Video</option>
                  <option value="IN_FEED_VIDEO">In-Feed Video Ad</option>
                  <option value="NON_SKIPPABLE_IN_STREAM">Non-Skippable In-Stream (15s)</option>
                </select>
              </div>
            </div>

            <div className="grid-2" style={{ gap: 12 }}>
              <div>
                <label className="micro" style={{ display: "block", marginBottom: 4 }}>
                  DAILY BUDGET ($ USD)
                </label>
                <input
                  type="number"
                  className="input"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  min={5}
                  max={10000}
                  required
                />
              </div>

              <div>
                <label className="micro" style={{ display: "block", marginBottom: 4 }}>
                  BID STRATEGY
                </label>
                <div className="row" style={{ gap: 8, paddingTop: 6 }}>
                  <span className="chip" style={{ background: "var(--soft-olive)", color: "var(--ink)", fontWeight: 600 }}>
                    Target CPV: $0.02 / view
                  </span>
                  <span className="chip" style={{ background: "rgba(0,0,0,0.06)", color: "var(--muted)" }}>
                    Maximize Conversions
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="micro" style={{ display: "block", marginBottom: 4 }}>
                AD HEADLINE
              </label>
              <input
                type="text"
                className="input"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Clean Energy with Zero Crash"
                required
              />
            </div>

            <div>
              <label className="micro" style={{ display: "block", marginBottom: 4 }}>
                LONG HEADLINE / DESCRIPTION
              </label>
              <input
                type="text"
                className="input"
                value={longHeadline}
                onChange={(e) => setLongHeadline(e.target.value)}
                placeholder="e.g. Try our organic ceremonial matcha latte starter kit with authentic bamboo whisk."
              />
            </div>

            <div className="row spread" style={{ marginTop: 6, alignItems: "center" }}>
              <span className="caption">
                ⚡ Directly pushes video campaign to Google Ads API / MCP Server
              </span>
              <button type="submit" disabled={creating} className="btn btn-primary">
                {creating ? "Launching YouTube Ad..." : "📺 Launch YouTube Campaign"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Campaigns List */}
      <div className="stack" style={{ gap: 14 }}>
        <h3 className="title-3">Live YouTube Campaigns ({campaigns.length})</h3>
        {campaigns.length === 0 ? (
          <div className="empty-state">
            <p className="caption">No YouTube campaigns created yet.</p>
          </div>
        ) : (
          campaigns.map((c) => (
            <YouTubeAdsCard key={c.id} campaign={c} onStatusChange={fetchCampaigns} />
          ))
        )}
      </div>
    </div>
  );
}

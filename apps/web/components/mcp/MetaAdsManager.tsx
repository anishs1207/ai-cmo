"use client";

import React, { useState, useEffect } from "react";
import { MetaCampaign, MetaObjective } from "../../lib/mcp/types";
import { MetaAdsCard } from "./MetaAdsCard";

export function MetaAdsManager() {
  const [campaigns, setCampaigns] = useState<MetaCampaign[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [budget, setBudget] = useState(40);
  const [objective, setObjective] = useState<MetaObjective>("OUTCOME_SALES");
  const [headline, setHeadline] = useState("");
  const [primaryText, setPrimaryText] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchCampaigns = async () => {
    try {
      const res = await fetch("/api/mcp/campaigns");
      const data = await res.json();
      if (data.meta?.campaigns) setCampaigns(data.meta.campaigns);
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
          tool: "meta_ads_create_campaign",
          args: {
            name,
            objective,
            dailyBudget: budget,
            platforms: ["facebook", "instagram"],
            headline,
            primaryText,
            callToAction: "SHOP_NOW",
          },
        }),
      });

      const data = await res.json();
      if (data.successful) {
        setShowCreate(false);
        setName("");
        setHeadline("");
        setPrimaryText("");
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
              <h2 className="title-3">Meta Ads Manager (Facebook & Instagram)</h2>
              <span className="chip" style={{ background: "rgba(24, 119, 242, 0.12)", color: "#1877f2", fontWeight: 600 }}>
                Meta MCP Server
              </span>
            </div>
            <p className="caption" style={{ marginTop: 4 }}>
              Autonomous ad campaign deployment across Facebook Feed, Video Feeds, Instagram Reels, and Stories.
            </p>
          </div>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="btn btn-primary"
          >
            {showCreate ? "Close Form" : "+ New Meta Campaign"}
          </button>
        </div>
      </div>

      {/* Campaign Creation Form */}
      {showCreate && (
        <div className="card card-pad rise" style={{ border: "1px solid var(--accent)" }}>
          <h3 className="title-3" style={{ marginBottom: 12 }}>
            Launch New Facebook & Instagram Campaign
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
                  placeholder="e.g. Summer Matcha Bundle - IG Reels & FB Feed"
                  required
                />
              </div>

              <div>
                <label className="micro" style={{ display: "block", marginBottom: 4 }}>
                  OBJECTIVE
                </label>
                <select
                  className="input"
                  value={objective}
                  onChange={(e) => setObjective(e.target.value as MetaObjective)}
                >
                  <option value="OUTCOME_SALES">Sales / Conversions (Recommended)</option>
                  <option value="OUTCOME_TRAFFIC">Traffic & Website Clicks</option>
                  <option value="OUTCOME_LEADS">Lead Generation</option>
                  <option value="OUTCOME_ENGAGEMENT">Post Engagement & Video Views</option>
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
                  TARGET PLACEMENTS
                </label>
                <div className="row" style={{ gap: 8, paddingTop: 6 }}>
                  <span className="chip" style={{ background: "rgba(24, 119, 242, 0.12)", color: "#1877f2", fontWeight: 600 }}>
                    ✓ Facebook Feed & Reels
                  </span>
                  <span className="chip" style={{ background: "rgba(225, 48, 108, 0.12)", color: "#e1306c", fontWeight: 600 }}>
                    ✓ Instagram Feed, Reels & Stories
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
                placeholder="e.g. Stop the 2 PM Coffee Crash — Pure Morning Energy"
                required
              />
            </div>

            <div>
              <label className="micro" style={{ display: "block", marginBottom: 4 }}>
                PRIMARY TEXT / BODY COPY
              </label>
              <textarea
                className="input"
                rows={2}
                value={primaryText}
                onChange={(e) => setPrimaryText(e.target.value)}
                placeholder="e.g. Crafted with organic ceremonial grade green tea leaves. 6+ hours of clean focus without jitters or anxiety. Try our starter kit today with free shipping!"
                required
              />
            </div>

            <div className="row spread" style={{ marginTop: 6, alignItems: "center" }}>
              <span className="caption">
                ⚡ Automatically connected to official Meta Marketing MCP tools
              </span>
              <button type="submit" disabled={creating} className="btn btn-primary">
                {creating ? "Launching via Meta MCP..." : "🚀 Launch on Facebook & Instagram"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Campaigns List */}
      <div className="stack" style={{ gap: 14 }}>
        <h3 className="title-3">Live Active Campaigns ({campaigns.length})</h3>
        {campaigns.length === 0 ? (
          <div className="empty-state">
            <p className="caption">No Meta campaigns created yet.</p>
          </div>
        ) : (
          campaigns.map((c) => (
            <MetaAdsCard key={c.id} campaign={c} onStatusChange={fetchCampaigns} />
          ))
        )}
      </div>
    </div>
  );
}

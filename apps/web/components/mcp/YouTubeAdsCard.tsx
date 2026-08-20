"use client";

import React, { useState } from "react";
import { YouTubeCampaign, YouTubeCampaignStats } from "../../lib/mcp/types";

interface YouTubeAdsCardProps {
  campaign: YouTubeCampaign;
  onStatusChange?: (id: string, status: "ENABLED" | "PAUSED") => void;
}

export function YouTubeAdsCard({ campaign, onStatusChange }: YouTubeAdsCardProps) {
  const [status, setStatus] = useState(campaign.status);
  const [toggling, setToggling] = useState(false);

  const stats: YouTubeCampaignStats = campaign.stats || {
    campaignId: campaign.id,
    views: 14200,
    viewRate: 42.5,
    avgCpv: 0.019,
    impressions: 33400,
    clicks: 420,
    ctr: 1.25,
    cost: 35.0,
    conversions: 8,
    costPerConversion: 4.37,
  };

  const handleToggle = async () => {
    if (toggling) return;
    setToggling(true);
    const newStatus = status === "ENABLED" ? "PAUSED" : "ENABLED";
    try {
      const res = await fetch("/api/mcp/campaigns", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform: "youtube", campaignId: campaign.id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus(newStatus);
        if (onStatusChange) onStatusChange(campaign.id, newStatus);
      }
    } catch {
      // ignore
    } finally {
      setToggling(false);
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
          <span style={{ fontSize: 16 }}>📺</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>
            {campaign.name}
          </span>
          <span
            style={{
              fontSize: 10.5,
              padding: "2px 8px",
              borderRadius: 6,
              background: "rgba(255, 0, 0, 0.12)",
              color: "#cc0000",
              fontWeight: 600,
            }}
          >
            YouTube {campaign.adFormat.replace(/_/g, " ")}
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
            Google Ads MCP
          </span>
        </div>

        <div className="row" style={{ gap: 8, alignItems: "center" }}>
          <span
            style={{
              fontSize: 11,
              padding: "3px 8px",
              borderRadius: 999,
              background: status === "ENABLED" ? "rgba(61, 122, 74, 0.12)" : "rgba(138, 106, 31, 0.12)",
              color: status === "ENABLED" ? "var(--green)" : "var(--amber)",
              fontWeight: 600,
            }}
          >
            {status}
          </span>
          <button
            onClick={handleToggle}
            disabled={toggling}
            className="btn btn-secondary"
            style={{ padding: "3px 8px", fontSize: 11 }}
          >
            {status === "ENABLED" ? "Pause" : "Resume"}
          </button>
        </div>
      </div>

      <div style={{ padding: 14 }}>
        {/* Ad Headline */}
        <div style={{ marginBottom: 12, padding: "8px 12px", background: "rgba(0,0,0,0.02)", borderRadius: 6 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--ink)", marginBottom: 2 }}>
            &ldquo;{campaign.headline}&rdquo;
          </div>
          {campaign.longHeadline && (
            <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{campaign.longHeadline}</div>
          )}
        </div>

        {/* Live Metrics Grid */}
        <div className="grid-4" style={{ gap: 10, marginBottom: 12 }}>
          <div style={{ padding: "8px 10px", background: "var(--app-canvas)", borderRadius: 6 }}>
            <div className="micro">VIDEO VIEWS</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--ink)", marginTop: 2 }}>
              {stats.views.toLocaleString()}
            </div>
            <div className="caption" style={{ fontSize: 10.5 }}>{stats.viewRate.toFixed(1)}% View Rate</div>
          </div>

          <div style={{ padding: "8px 10px", background: "var(--app-canvas)", borderRadius: 6 }}>
            <div className="micro">AVG CPV</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--green)", marginTop: 2 }}>
              ${stats.avgCpv.toFixed(3)}
            </div>
            <div className="caption" style={{ fontSize: 10.5 }}>Target: ${campaign.targetCpv?.toFixed(2) || "0.02"}</div>
          </div>

          <div style={{ padding: "8px 10px", background: "var(--app-canvas)", borderRadius: 6 }}>
            <div className="micro">IMPRESSIONS</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--ink)", marginTop: 2 }}>
              {stats.impressions.toLocaleString()}
            </div>
            <div className="caption" style={{ fontSize: 10.5 }}>{stats.clicks} clicks · {stats.ctr.toFixed(2)}% CTR</div>
          </div>

          <div style={{ padding: "8px 10px", background: "var(--app-canvas)", borderRadius: 6 }}>
            <div className="micro">TOTAL COST</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--ink)", marginTop: 2 }}>
              ${stats.cost.toFixed(2)}
            </div>
            <div className="caption" style={{ fontSize: 10.5 }}>{stats.conversions} conversions</div>
          </div>
        </div>

        <div
          className="row spread"
          style={{
            paddingTop: 8,
            borderTop: "1px dashed var(--border)",
            fontSize: 11.5,
            color: "var(--muted)",
          }}
        >
          <span>Daily Budget: <strong>${campaign.dailyBudget}/day</strong></span>
          <span>Bidding: <strong>{campaign.biddingStrategy.replace(/_/g, " ")}</strong></span>
          <span>Format: <strong>{campaign.adFormat.replace(/_/g, " ")}</strong></span>
        </div>
      </div>
    </div>
  );
}

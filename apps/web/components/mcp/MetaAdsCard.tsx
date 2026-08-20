"use client";

import React, { useState } from "react";
import { MetaCampaign, MetaCampaignInsights } from "../../lib/mcp/types";

interface MetaAdsCardProps {
  campaign: MetaCampaign;
  onStatusChange?: (id: string, status: "ACTIVE" | "PAUSED") => void;
}

export function MetaAdsCard({ campaign, onStatusChange }: MetaAdsCardProps) {
  const [status, setStatus] = useState(campaign.status);
  const [toggling, setToggling] = useState(false);

  const insights: MetaCampaignInsights = campaign.insights || {
    campaignId: campaign.id,
    impressions: 24500,
    reach: 18200,
    clicks: 740,
    spend: 60.0,
    ctr: 3.02,
    cpc: 0.081,
    cpm: 2.45,
    roas: 4.25,
    purchases: 16,
    conversionValue: 255.0,
    costPerPurchase: 3.75,
    platformBreakdown: {
      facebook: { spend: 22.0, impressions: 8500, clicks: 230, purchases: 5 },
      instagram: { spend: 38.0, impressions: 16000, clicks: 510, purchases: 11 },
    },
  };

  const handleToggle = async () => {
    if (toggling) return;
    setToggling(true);
    const newStatus = status === "ACTIVE" ? "PAUSED" : "ACTIVE";
    try {
      const res = await fetch("/api/mcp/campaigns", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform: "meta", campaignId: campaign.id, status: newStatus }),
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
          <span style={{ fontSize: 16 }}>🚀</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>
            {campaign.name}
          </span>
          <span
            style={{
              fontSize: 10.5,
              padding: "2px 8px",
              borderRadius: 6,
              background: "rgba(24, 119, 242, 0.12)",
              color: "#1877f2",
              fontWeight: 600,
            }}
          >
            Facebook
          </span>
          <span
            style={{
              fontSize: 10.5,
              padding: "2px 8px",
              borderRadius: 6,
              background: "rgba(225, 48, 108, 0.12)",
              color: "#e1306c",
              fontWeight: 600,
            }}
          >
            Instagram
          </span>
        </div>

        <div className="row" style={{ gap: 8, alignItems: "center" }}>
          <span
            style={{
              fontSize: 11,
              padding: "3px 8px",
              borderRadius: 999,
              background: status === "ACTIVE" ? "rgba(61, 122, 74, 0.12)" : "rgba(138, 106, 31, 0.12)",
              color: status === "ACTIVE" ? "var(--green)" : "var(--amber)",
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
            {status === "ACTIVE" ? "Pause" : "Resume"}
          </button>
        </div>
      </div>

      <div style={{ padding: 14 }}>
        {/* Creative copy snippet */}
        <div style={{ marginBottom: 12, padding: "8px 12px", background: "rgba(0,0,0,0.02)", borderRadius: 6 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--ink)", marginBottom: 2 }}>
            &ldquo;{campaign.creative.headline}&rdquo;
          </div>
          <div style={{ fontSize: 11.5, color: "var(--muted)", lineHeight: 1.4 }}>
            {campaign.creative.primaryText}
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid-4" style={{ gap: 10, marginBottom: 12 }}>
          <div style={{ padding: "8px 10px", background: "var(--app-canvas)", borderRadius: 6 }}>
            <div className="micro">TOTAL SPEND</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--ink)", marginTop: 2 }}>
              ${insights.spend.toFixed(2)}
            </div>
            <div className="caption" style={{ fontSize: 10.5 }}>${campaign.dailyBudget}/day budget</div>
          </div>

          <div style={{ padding: "8px 10px", background: "var(--app-canvas)", borderRadius: 6 }}>
            <div className="micro">ROAS</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--green)", marginTop: 2 }}>
              {insights.roas.toFixed(2)}x
            </div>
            <div className="caption" style={{ fontSize: 10.5 }}>${insights.conversionValue.toFixed(0)} revenue</div>
          </div>

          <div style={{ padding: "8px 10px", background: "var(--app-canvas)", borderRadius: 6 }}>
            <div className="micro">IMPRESSIONS</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--ink)", marginTop: 2 }}>
              {insights.impressions.toLocaleString()}
            </div>
            <div className="caption" style={{ fontSize: 10.5 }}>{insights.clicks} clicks · {insights.ctr.toFixed(2)}% CTR</div>
          </div>

          <div style={{ padding: "8px 10px", background: "var(--app-canvas)", borderRadius: 6 }}>
            <div className="micro">PURCHASES</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--ink)", marginTop: 2 }}>
              {insights.purchases}
            </div>
            <div className="caption" style={{ fontSize: 10.5 }}>${insights.costPerPurchase.toFixed(2)} CPA</div>
          </div>
        </div>

        {/* Platform Breakdown */}
        {insights.platformBreakdown && (
          <div
            className="row spread"
            style={{
              paddingTop: 8,
              borderTop: "1px dashed var(--border)",
              fontSize: 11.5,
              color: "var(--muted)",
            }}
          >
            <span>
              <strong>Instagram:</strong> ${insights.platformBreakdown.instagram.spend.toFixed(0)} spend · {insights.platformBreakdown.instagram.purchases} sales
            </span>
            <span>
              <strong>Facebook:</strong> ${insights.platformBreakdown.facebook.spend.toFixed(0)} spend · {insights.platformBreakdown.facebook.purchases} sales
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

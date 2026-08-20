"use client";

import React, { useState } from "react";
import { McpServerStatusBar } from "./McpServerStatus";
import { McpChat } from "./McpChat";
import { UgcStudio } from "./UgcStudio";
import { MetaAdsManager } from "./MetaAdsManager";
import { YouTubeAdsManager } from "./YouTubeAdsManager";
import { McpDiagnostics } from "./McpDiagnostics";

type Tab = "chat" | "ugc_studio" | "meta_ads" | "youtube_ads" | "diagnostics" | "organic";

interface DashboardClientViewProps {
  businessName: string;
  organicContent: React.ReactNode;
}

export function DashboardClientView({ businessName, organicContent }: DashboardClientViewProps) {
  const [activeTab, setActiveTab] = useState<Tab>("chat");

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "chat", label: "MCP Copilot", icon: "🤖" },
    { id: "ugc_studio", label: "AI UGC Studio (Higgsfield)", icon: "🎬" },
    { id: "meta_ads", label: "Meta Ads (FB & IG)", icon: "🚀" },
    { id: "youtube_ads", label: "YouTube Ads (Google)", icon: "📺" },
    { id: "organic", label: "Organic Overview", icon: "📈" },
    { id: "diagnostics", label: "MCP Diagnostics", icon: "⚡" },
  ];

  return (
    <>
      <div className="page-head rise">
        <div>
          <h1 className="display">Marketing Autopilot — {businessName}</h1>
          <p>
            Connected MCP Client for Higgsfield AI, Meta Ads (Facebook & Instagram), and Google Ads (YouTube).
          </p>
        </div>
      </div>

      {/* Official MCP Server Status Bar */}
      <McpServerStatusBar />

      {/* Tab Navigation Navigation Bar */}
      <div
        className="row"
        style={{
          gap: 8,
          marginBottom: 18,
          borderBottom: "1px solid var(--border)",
          paddingBottom: 8,
          overflowX: "auto",
        }}
      >
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: "8px",
                background: active ? "var(--ink)" : "transparent",
                color: active ? "#ffffff" : "var(--ink)",
                border: active ? "1px solid var(--ink)" : "1px solid transparent",
                fontSize: 13,
                fontWeight: active ? 600 : 500,
                cursor: "pointer",
                transition: "all 160ms var(--ease-out)",
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      {activeTab === "chat" && <McpChat />}
      {activeTab === "ugc_studio" && <UgcStudio />}
      {activeTab === "meta_ads" && <MetaAdsManager />}
      {activeTab === "youtube_ads" && <YouTubeAdsManager />}
      {activeTab === "organic" && organicContent}
      {activeTab === "diagnostics" && <McpDiagnostics />}
    </>
  );
}

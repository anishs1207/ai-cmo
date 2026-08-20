"use client";

import React, { useEffect, useState } from "react";
import { McpServerStatus } from "../../lib/mcp/types";

export function McpServerStatusBar() {
  const [servers, setServers] = useState<McpServerStatus[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/mcp/status");
      const data = await res.json();
      if (data.servers) setServers(data.servers);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading && servers.length === 0) {
    return (
      <div className="card card-pad row spread" style={{ padding: "10px 16px", marginBottom: 16 }}>
        <span className="caption">Connecting to official MCP Servers (Higgsfield, Meta Ads, Google Ads)...</span>
      </div>
    );
  }

  return (
    <div
      className="card card-pad"
      style={{
        padding: "12px 18px",
        marginBottom: 18,
        background: "var(--card)",
        borderColor: "var(--border)",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <div className="row" style={{ gap: 8, alignItems: "center" }}>
        <span
          style={{
            display: "inline-block",
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "var(--green)",
            boxShadow: "0 0 8px rgba(61, 122, 74, 0.6)",
          }}
        />
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>MCP Client Engine:</span>
        <span className="caption" style={{ color: "var(--muted)" }}>
          Official Server Connections Active
        </span>
      </div>

      <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
        {servers.map((s) => (
          <div
            key={s.name}
            title={`${s.displayName}\nOfficial URL: ${s.officialUrl}\nTools: ${s.availableTools.join(", ")}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 10px",
              borderRadius: "999px",
              background: s.connected ? "rgba(61, 122, 74, 0.1)" : "rgba(181, 74, 74, 0.1)",
              border: `1px solid ${s.connected ? "rgba(61, 122, 74, 0.25)" : "rgba(181, 74, 74, 0.25)"}`,
              fontSize: 12,
              fontWeight: 500,
              color: s.connected ? "var(--green)" : "var(--red)",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: s.connected ? "var(--green)" : "var(--red)",
              }}
            />
            <span>
              {s.name === "higgsfield"
                ? "Higgsfield MCP"
                : s.name === "meta_ads"
                ? "Meta (FB & IG) MCP"
                : "Google (YouTube) MCP"}
            </span>
            <span style={{ opacity: 0.7, fontSize: 10.5 }}>{s.latencyMs}ms</span>
          </div>
        ))}
      </div>
    </div>
  );
}

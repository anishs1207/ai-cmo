"use client";

import React, { useState, useEffect } from "react";
import { McpServerStatus, McpToolDefinition } from "../../lib/mcp/types";

export function McpDiagnostics() {
  const [servers, setServers] = useState<McpServerStatus[]>([]);
  const [tools, setTools] = useState<McpToolDefinition[]>([]);
  const [selectedTool, setSelectedTool] = useState<string>("");
  const [toolArgs, setToolArgs] = useState<string>("{}");
  const [executing, setExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<unknown>(null);

  const fetchDiagnostics = async () => {
    try {
      const [sRes, tRes] = await Promise.all([
        fetch("/api/mcp/status"),
        fetch("/api/mcp/tools"),
      ]);
      const sData = await sRes.json();
      const tData = await tRes.json();
      if (sData.servers) setServers(sData.servers);
      if (tData.tools) {
        setTools(tData.tools);
        if (tData.tools.length > 0 && !selectedTool) {
          setSelectedTool(tData.tools[0].name);
          setToolArgs(JSON.stringify({ prompt: "Sample UGC video prompt" }, null, 2));
        }
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchDiagnostics();
  }, []);

  const handleToolSelect = (toolName: string) => {
    setSelectedTool(toolName);
    if (toolName.includes("higgsfield_generate")) {
      setToolArgs(JSON.stringify({ prompt: "High converting customer review UGC video", style: "customer_testimonial", durationSeconds: 15 }, null, 2));
    } else if (toolName.includes("meta_ads_create")) {
      setToolArgs(JSON.stringify({ name: "Test Meta Campaign", dailyBudget: 30, platforms: ["facebook", "instagram"], headline: "Viral Hook", primaryText: "Amazing product" }, null, 2));
    } else if (toolName.includes("google_ads_create")) {
      setToolArgs(JSON.stringify({ name: "Test YouTube Campaign", dailyBudget: 25, headline: "Watch Now", adFormat: "YOUTUBE_SHORTS" }, null, 2));
    } else {
      setToolArgs("{}");
    }
  };

  const handleTestExecute = async () => {
    if (!selectedTool || executing) return;
    setExecuting(true);
    setExecutionResult(null);
    try {
      let parsedArgs = {};
      try {
        parsedArgs = JSON.parse(toolArgs);
      } catch {
        // use empty
      }

      const res = await fetch("/api/mcp/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: selectedTool, args: parsedArgs }),
      });
      const data = await res.json();
      setExecutionResult(data);
    } catch (err: unknown) {
      setExecutionResult({ error: err instanceof Error ? err.message : "Execution failed" });
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="stack" style={{ gap: 20 }}>
      <div className="card card-pad rise">
        <h2 className="title-3" style={{ marginBottom: 4 }}>
          Official MCP Server Diagnostics
        </h2>
        <p className="caption" style={{ marginBottom: 16 }}>
          Live connection testing and tool execution console for Higgsfield AI, Meta Ads, and Google Ads MCPs.
        </p>

        <div className="grid-3" style={{ gap: 14 }}>
          {servers.map((s) => (
            <div
              key={s.name}
              style={{
                padding: 14,
                borderRadius: 8,
                background: "var(--app-canvas)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="spread" style={{ marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{s.displayName}</span>
                <span
                  style={{
                    fontSize: 10.5,
                    padding: "2px 6px",
                    borderRadius: 4,
                    background: s.connected ? "rgba(61, 122, 74, 0.15)" : "rgba(181, 74, 74, 0.15)",
                    color: s.connected ? "var(--green)" : "var(--red)",
                    fontWeight: 600,
                  }}
                >
                  {s.connected ? "CONNECTED" : "OFFLINE"}
                </span>
              </div>
              <div className="caption" style={{ fontSize: 11, marginBottom: 8, color: "var(--muted)" }}>
                {s.officialUrl}
              </div>
              <div className="caption" style={{ fontSize: 11 }}>
                Latency: <strong>{s.latencyMs}ms</strong> · Tools: <strong>{s.availableTools.length}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card card-pad rise">
        <h3 className="title-3" style={{ marginBottom: 12 }}>
          MCP Tool Execution Console
        </h3>

        <div className="stack" style={{ gap: 12 }}>
          <div>
            <label className="micro" style={{ display: "block", marginBottom: 4 }}>
              SELECT MCP TOOL ({tools.length} AVAILABLE)
            </label>
            <select
              className="input"
              value={selectedTool}
              onChange={(e) => handleToolSelect(e.target.value)}
            >
              {tools.map((t) => (
                <option key={t.name} value={t.name}>
                  [{t.server.toUpperCase()}] {t.name} — {t.description.slice(0, 60)}...
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="micro" style={{ display: "block", marginBottom: 4 }}>
              ARGUMENTS JSON
            </label>
            <textarea
              className="input"
              rows={4}
              value={toolArgs}
              onChange={(e) => setToolArgs(e.target.value)}
              style={{ fontFamily: "monospace", fontSize: 12 }}
            />
          </div>

          <div>
            <button
              onClick={handleTestExecute}
              disabled={executing || !selectedTool}
              className="btn btn-primary"
            >
              {executing ? "Executing Tool..." : "⚡ Execute MCP Tool"}
            </button>
          </div>

          {executionResult !== null && (
            <div style={{ marginTop: 10 }}>
              <div className="micro" style={{ marginBottom: 4 }}>EXECUTION OUTPUT:</div>
              <pre
                style={{
                  padding: 12,
                  borderRadius: 8,
                  background: "var(--sidebar)",
                  color: "var(--sidebar-fg)",
                  fontSize: 12,
                  overflowX: "auto",
                  maxHeight: 280,
                }}
              >
                {JSON.stringify(executionResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

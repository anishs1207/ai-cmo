"use client";

import React, { useState, useRef, useEffect } from "react";
import { McpChatMessage } from "../../lib/mcp/types";
import { UgcVideoCard } from "./UgcVideoCard";
import { MetaAdsCard } from "./MetaAdsCard";
import { YouTubeAdsCard } from "./YouTubeAdsCard";

const INITIAL_MESSAGES: McpChatMessage[] = [
  {
    id: "msg-init-1",
    role: "assistant",
    content: "👋 Welcome to the **Ripple Autonomous Marketing Copilot**.\n\nI act as an official **MCP Client** connected to:\n- **Higgsfield AI MCP**: AI UGC video generation with Soul Mode and automatic local storage.\n- **Meta Ads MCP**: Multi-placement ad campaigns across both **Facebook and Instagram**.\n- **Google Ads MCP**: YouTube video and Shorts advertising with CPV optimization.\n\nWhat would you like to build or launch today?",
    timestamp: new Date().toISOString(),
  },
];

const SUGGESTIONS = [
  "🎬 Generate a customer testimonial UGC video for organic matcha and save it locally",
  "🚀 Launch a $40/day ad campaign on Facebook & Instagram with high-converting copy",
  "📺 Launch a YouTube Shorts ad on Google Ads with $25/day budget",
  "📊 Show live ROAS and performance tracking across all campaigns",
];

export function McpChat() {
  const [messages, setMessages] = useState<McpChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: McpChatMessage = {
      id: "msg-usr-" + Date.now(),
      role: "user",
      content: query,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/mcp/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query, history: messages }),
      });

      const data: McpChatMessage = await res.json();
      setMessages((prev) => [...prev, data]);
    } catch {
      const errorMsg: McpChatMessage = {
        id: "msg-err-" + Date.now(),
        role: "assistant",
        content: "⚠️ An error occurred connecting to the MCP client. Please check server logs or retry.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="card rise"
      style={{
        display: "flex",
        flexDirection: "column",
        height: 640,
        background: "var(--card)",
        border: "1px solid var(--border)",
        overflow: "hidden",
      }}
    >
      {/* Chat Header */}
      <div
        className="spread"
        style={{
          padding: "12px 18px",
          background: "rgba(62, 66, 41, 0.05)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="row" style={{ gap: 10, alignItems: "center" }}>
          <span style={{ fontSize: 18 }}>🤖</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>
              MCP Marketing Copilot
            </div>
            <div className="caption" style={{ fontSize: 11 }}>
              Official Higgsfield, Meta (FB & IG), and Google Ads Client
            </div>
          </div>
        </div>

        <button
          onClick={() => setMessages(INITIAL_MESSAGES)}
          className="btn btn-secondary"
          style={{ padding: "4px 10px", fontSize: 11 }}
        >
          Clear chat
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "18px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {messages.map((m) => {
          const isUser = m.role === "user";
          return (
            <div
              key={m.id}
              style={{
                alignSelf: isUser ? "flex-end" : "flex-start",
                maxWidth: isUser ? "80%" : "92%",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: isUser ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                  background: isUser ? "var(--ink)" : "var(--app-canvas)",
                  color: isUser ? "#ffffff" : "var(--ink)",
                  border: isUser ? "none" : "1px solid var(--border)",
                  fontSize: 13.5,
                  lineHeight: 1.55,
                  whiteSpace: "pre-wrap",
                }}
              >
                {m.content}
              </div>

              {/* Tool Invocations Badge List */}
              {m.toolInvocations && m.toolInvocations.length > 0 && (
                <div className="row" style={{ gap: 6, flexWrap: "wrap", marginTop: 2 }}>
                  {m.toolInvocations.map((t, idx) => (
                    <span
                      key={idx}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "2px 8px",
                        borderRadius: 999,
                        background: "rgba(62, 66, 41, 0.08)",
                        fontSize: 11,
                        color: "var(--muted)",
                        fontWeight: 500,
                      }}
                    >
                      <span style={{ color: "var(--green)" }}>⚡</span>
                      <span>
                        [{t.server.toUpperCase()}] {t.toolName}
                      </span>
                    </span>
                  ))}
                </div>
              )}

              {/* Rich Interactive Cards */}
              {m.generatedVideo && <UgcVideoCard video={m.generatedVideo} />}
              {m.metaCampaign && <MetaAdsCard campaign={m.metaCampaign} />}
              {m.youtubeCampaign && <YouTubeAdsCard campaign={m.youtubeCampaign} />}
            </div>
          );
        })}

        {loading && (
          <div
            style={{
              alignSelf: "flex-start",
              padding: "10px 14px",
              borderRadius: "12px",
              background: "var(--app-canvas)",
              border: "1px solid var(--border)",
              fontSize: 12.5,
              color: "var(--muted)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "var(--accent)",
                animation: "pulse 1.2s infinite ease-in-out",
              }}
            />
            <span>Executing MCP tools (Higgsfield / Meta Ads / Google Ads)...</span>
          </div>
        )}
      </div>

      {/* Suggestion Prompts */}
      <div
        style={{
          padding: "8px 18px",
          background: "rgba(62, 66, 41, 0.02)",
          borderTop: "1px solid var(--border)",
          display: "flex",
          gap: 8,
          overflowX: "auto",
          whiteSpace: "nowrap",
        }}
      >
        {SUGGESTIONS.map((s, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(s)}
            disabled={loading}
            style={{
              padding: "4px 10px",
              borderRadius: 999,
              background: "var(--app-canvas)",
              border: "1px solid var(--border)",
              fontSize: 11.5,
              color: "var(--ink)",
              cursor: "pointer",
              transition: "all 160ms var(--ease-out)",
            }}
            onMouseOver={(e) => (e.currentTarget.style.borderColor = "var(--ink)")}
            onMouseOut={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div
        style={{
          padding: "12px 18px",
          background: "var(--card)",
          borderTop: "1px solid var(--border)",
          display: "flex",
          gap: 10,
          alignItems: "flex-end",
        }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask MCP Copilot to generate UGC videos, launch Facebook/Instagram ads, or create YouTube campaigns..."
          rows={2}
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid var(--border)",
            background: "var(--app-canvas)",
            color: "var(--ink)",
            fontSize: 13,
            fontFamily: "inherit",
            resize: "none",
            outline: "none",
          }}
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="btn btn-primary"
          style={{ height: 42, padding: "0 18px", fontSize: 13 }}
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

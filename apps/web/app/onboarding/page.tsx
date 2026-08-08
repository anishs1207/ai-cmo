"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const steps = [
  "Reading your website",
  "Extracting brand voice and audience",
  "Finding where your customers hang out",
  "Assembling your marketing knowledge base",
];

export default function Onboarding() {
  const router = useRouter();
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [description, setDescription] = useState("");
  const [promote, setPromote] = useState("");
  const [loading, setLoading] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!websiteUrl.trim() && !description.trim()) {
      setError("Give me at least a website link or a description.");
      return;
    }
    setError(null);
    setLoading(true);
    const ticker = setInterval(() => setStepIdx((i) => Math.min(i + 1, steps.length - 1)), 4500);
    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ websiteUrl, description, promote }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      router.push("/kb");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    } finally {
      clearInterval(ticker);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background:
          "radial-gradient(80% 60% at 50% -10%, rgba(10,132,255,0.09) 0%, rgba(10,132,255,0) 70%), var(--bg)",
      }}
    >
      <div style={{ width: "min(560px, 100%)" }}>
        <div className="rise" style={{ textAlign: "center", marginBottom: 28 }}>
          <span
            className="brand-mark"
            style={{ width: 44, height: 44, borderRadius: 12, fontSize: 21, margin: "0 auto 14px", display: "grid" }}
          >
            R
          </span>
          <h1 className="display" style={{ fontSize: 32 }}>
            Tell Ripple about your business
          </h1>
          <p style={{ color: "var(--text-2)", margin: "10px auto 0", maxWidth: 420, fontSize: 14.5 }}>
            Ripple reads your site, learns your brand, then writes and publishes organic content that
            brings people back to you.
          </p>
        </div>

        {!loading ? (
          <form onSubmit={submit} className="card card-pad rise" style={{ padding: 26 }}>
            <label className="field">
              <span>Website or store link</span>
              <input
                className="input"
                placeholder="https://yourstore.com"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                autoFocus
              />
              <small>Shopify, landing page, anything public. We scrape it for context.</small>
            </label>

            <label className="field">
              <span>Describe your business (optional)</span>
              <textarea
                className="textarea"
                placeholder="What you sell, who it's for, what makes it different..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>

            <label className="field">
              <span>What do you want to promote? (optional)</span>
              <input
                className="input"
                placeholder="e.g. our new summer collection, the free trial..."
                value={promote}
                onChange={(e) => setPromote(e.target.value)}
              />
            </label>

            {error && <div className="error-note" style={{ marginBottom: 14 }}>{error}</div>}

            <button type="submit" className="btn btn-primary" style={{ width: "100%", height: 42 }}>
              Build my marketing brain
            </button>
          </form>
        ) : (
          <div className="card card-pad rise" style={{ padding: 32, textAlign: "center" }}>
            <span className="spinner spinner-dark" style={{ width: 22, height: 22, margin: "0 auto 18px", display: "block" }} />
            <div key={stepIdx} className="rise" style={{ fontWeight: 600, fontSize: 15 }}>
              {steps[stepIdx]}…
            </div>
            <div className="caption" style={{ marginTop: 8 }}>
              Usually takes 15–30 seconds
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

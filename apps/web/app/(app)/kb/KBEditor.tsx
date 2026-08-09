"use client";

import { useState } from "react";
import type { BusinessKB } from "../../../lib/kb";
import { AutoTextarea } from "../../../components/AutoTextarea";
import { toast } from "../../../components/toast";

const textFields: { key: keyof BusinessKB; label: string; long?: boolean }[] = [
  { key: "businessName", label: "Business name" },
  { key: "overview", label: "Overview", long: true },
  { key: "whatItDoes", label: "What it does & how it helps", long: true },
  { key: "targetAudience", label: "Target audience", long: true },
  { key: "usp", label: "Unique selling proposition", long: true },
  { key: "pricing", label: "Pricing & offers", long: true },
  { key: "brandTone", label: "Brand tone", long: true },
  { key: "brandVoice", label: "Brand voice", long: true },
  { key: "brandPersonality", label: "Brand personality", long: true },
  { key: "brandIdentity", label: "Brand identity", long: true },
];

const listFields: { key: keyof BusinessKB; label: string; hint?: string }[] = [
  { key: "audienceSegments", label: "Audience segments" },
  { key: "keyBenefits", label: "Key benefits" },
  { key: "competitors", label: "Competitors" },
  { key: "objections", label: "Common objections" },
  { key: "testimonials", label: "Testimonials & reviews" },
  { key: "suggestedSubreddits", label: "Target subreddits", hint: "no r/ prefix, one per line" },
  { key: "contentThemes", label: "Content themes" },
];

function cleanKb(kb: BusinessKB): BusinessKB {
  const next = { ...kb };
  for (const f of listFields) {
    next[f.key] = (kb[f.key] as string[]).map((s) => s.trim()).filter(Boolean) as never;
  }
  for (const f of textFields) {
    if (typeof next[f.key] === "string") {
      next[f.key] = (next[f.key] as string).trim() as never;
    }
  }
  return next;
}

export function KBEditor({ initial }: { initial: BusinessKB }) {
  const [kb, setKb] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof BusinessKB>(key: K, value: BusinessKB[K]) {
    setKb((k) => ({ ...k, [key]: value }));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    setError(null);
    const payload = cleanKb(kb);
    try {
      const res = await fetch("/api/business", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kb: payload }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Save failed");
      setKb(payload);
      setSaved(true);
      toast("Knowledge base saved");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
      toast("Could not save knowledge base", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="stack">
      <div className="grid-2">
        <div className="card card-pad rise">
          <h2 className="title-3" style={{ marginBottom: 16 }}>
            Business & brand
          </h2>
          {textFields.map((f) => (
            <label key={f.key} className="field">
              <span>{f.label}</span>
              {f.long ? (
                <AutoTextarea
                  minRows={f.key === "overview" || f.key === "whatItDoes" ? 4 : 3}
                  value={kb[f.key] as string}
                  onChange={(e) => set(f.key, e.target.value as never)}
                />
              ) : (
                <input
                  className="input"
                  value={kb[f.key] as string}
                  onChange={(e) => set(f.key, e.target.value as never)}
                />
              )}
            </label>
          ))}
        </div>

        <div className="card card-pad rise">
          <h2 className="title-3" style={{ marginBottom: 16 }}>
            Audience, proof & angles
          </h2>
          {listFields.map((f) => (
            <label key={f.key} className="field">
              <span>{f.label}</span>
              <AutoTextarea
                minRows={3}
                value={(kb[f.key] as string[]).join("\n")}
                onChange={(e) => set(f.key, e.target.value.split("\n") as never)}
              />
              {f.hint && <small>{f.hint}</small>}
            </label>
          ))}
        </div>
      </div>

      {error && <div className="error-note">{error}</div>}

      <div className="row" style={{ justifyContent: "flex-end" }}>
        {saved && <span className="chip chip-green">Saved</span>}
        <button className="btn btn-primary" onClick={save} disabled={saving}>
          {saving && <span className="spinner" />}
          {saving ? "Saving" : "Save knowledge base"}
        </button>
      </div>
    </div>
  );
}

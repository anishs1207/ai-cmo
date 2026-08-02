"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";

type Status = "Active" | "Scheduled" | "Paused";

type Campaign = {
  id: string;
  name: string;
  url: string;
  objective: string;
  audience: string;
  budget: number;
  start: string;
  copy: string;
  headline: string;
  video: string;
  status: Status;
};

type Metrics = {
  impressions: number;
  clicks: number;
  spend: number;
  purchases: number;
  revenue: number;
};

const key = "afterword-campaigns",
  cash = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export default function Home() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]),
    [stats, setStats] = useState<Record<string, Metrics>>({}),
    [open, setOpen] = useState(false),
    [ready, setReady] = useState(false),
    [toast, setToast] = useState("");

  useEffect(() => {
    try {
      setCampaigns(JSON.parse(localStorage.getItem(key) || "[]") as Campaign[]);
    } catch {
      localStorage.removeItem(key);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(key, JSON.stringify(campaigns));
    setStats(
      Object.fromEntries(
        campaigns.map((c) => {
          const live = c.status === "Active" ? 1 : 0,
            i = live * Math.floor(9000 + Math.random() * 24000),
            clicks = Math.floor(i * (0.018 + Math.random() * 0.025)),
            spend = live * c.budget * (0.35 + Math.random() * 0.55),
            p = Math.floor(clicks * 0.04);
          return [
            c.id,
            {
              impressions: i,
              clicks,
              spend,
              purchases: p,
              revenue: p * (28 + Math.random() * 64),
            },
          ];
        }),
      ),
    );
  }, [campaigns, ready]);

  useEffect(() => {
    const timer = setInterval(
      () =>
        setStats((old) => {
          const next = { ...old };
          campaigns
            .filter((c) => c.status === "Active")
            .forEach((c) => {
              const s = next[c.id] || {
                impressions: 0,
                clicks: 0,
                spend: 0,
                purchases: 0,
                revenue: 0,
              },
                i = Math.floor(25 + Math.random() * 140),
                p = Math.random() > 0.72 ? 1 : 0;
              next[c.id] = {
                impressions: s.impressions + i,
                clicks: s.clicks + Math.floor(i * 0.03),
                spend: s.spend + Math.random() * 2.4,
                purchases: s.purchases + p,
                revenue: s.revenue + p * 55,
              };
            });
          return next;
        }),
      3000,
    );
    return () => clearInterval(timer);
  }, [campaigns]);

  const total = useMemo(
    () =>
      Object.values(stats).reduce(
        (a, s) => ({
          impressions: a.impressions + s.impressions,
          clicks: a.clicks + s.clicks,
          spend: a.spend + s.spend,
          purchases: a.purchases + s.purchases,
          revenue: a.revenue + s.revenue,
        }),
        { impressions: 0, clicks: 0, spend: 0, purchases: 0, revenue: 0 },
      ),
    [stats],
  );

  const save = (c: Campaign) => {
    setCampaigns((x) => [c, ...x]);
    setOpen(false);
    setToast("Campaign created successfully");
    setTimeout(() => setToast(""), 2500);
  },
    toggle = (id: string) =>
      setCampaigns((x) =>
        x.map((c) =>
          c.id === id
            ? { ...c, status: c.status === "Active" ? "Paused" : "Active" }
            : c,
        ),
      );

  return (
    <div className="shell">
      <aside>
        <div className="logo">
          <b>after</b>word.
        </div>
        <button className="create" onClick={() => setOpen(true)}>
          ＋ Create campaign
        </button>
        <small>WORKSPACE</small>
        <button className="nav active">◫ &nbsp; Overview</button>
        <button className="nav">◉ &nbsp; Campaigns</button>
        <button className="nav">▣ &nbsp; Creatives</button>
        <button className="nav">◎ &nbsp; Audiences</button>
        <small>MANAGE</small>
        <button className="nav">⌁ &nbsp; Integrations</button>
        <button className="nav">⚙ &nbsp; Settings</button>
        <div className="connection">
          <b>f</b>
          <span>
            <strong>Meta Ads</strong>
            <em>● Connected</em>
          </span>
        </div>
        <div className="profile">
          <i>AM</i>
          <span>
            <strong>Alex Morgan</strong>
            <em>Workspace admin</em>
          </span>
        </div>
      </aside>
      <main>
        <header>
          <div>
            <small>WORKSPACE</small>
            <strong>Campaign overview</strong>
          </div>
          <button>♢</button>
        </header>
        <section className="content">
          <div className="welcome">
            <div>
              <h1>Good morning, Alex.</h1>
              <p>Here&apos;s how your Meta campaigns are performing.</p>
            </div>
            <button className="primary" onClick={() => setOpen(true)}>
              ＋ New campaign
            </button>
          </div>
          <div className="metrics">
            <Metric
              label="Total spend"
              value={cash.format(total.spend)}
              note="Across all campaigns"
            />
            <Metric
              label="Return on ad spend"
              value={`${(total.spend ? total.revenue / total.spend : 0).toFixed(2)}×`}
              note={`${cash.format(total.revenue)} revenue`}
            />
            <Metric
              label="Impressions"
              value={total.impressions.toLocaleString()}
              note={`${total.clicks} clicks`}
            />
            <Metric
              label="Click-through rate"
              value={`${(total.impressions ? (total.clicks / total.impressions) * 100 : 0).toFixed(2)}%`}
              note={`${total.purchases} purchases`}
            />
          </div>
          {campaigns.length === 0 ? (
            <div className="card empty">
              <h2>Launch your first campaign</h2>
              <p>
                Add your website, upload an ad video, and define who should see
                it.
              </p>
              <button className="primary" onClick={() => setOpen(true)}>
                Create campaign
              </button>
            </div>
          ) : (
            <>
              <div className="charts">
                <div className="card graph">
                  <div className="title">
                    <div>
                      <h2>Performance</h2>
                      <p>Live campaign activity</p>
                    </div>
                  </div>
                  <svg viewBox="0 0 700 230" preserveAspectRatio="none">
                    {[45, 90, 135, 180].map((y) => (
                      <line
                        className="grid"
                        key={y}
                        x1="0"
                        x2="700"
                        y1={y}
                        y2={y}
                      />
                    ))}
                    <path
                      className="area"
                      d="M0 190 C80 170 105 188 170 145 S270 160 340 105 S445 125 510 75 S620 96 700 35 L700 230 L0 230Z"
                    />
                    <path
                      className="line"
                      d="M0 190 C80 170 105 188 170 145 S270 160 340 105 S445 125 510 75 S620 96 700 35"
                    />
                  </svg>
                </div>
                <div className="card placement">
                  <div className="title">
                    <div>
                      <h2>Placement</h2>
                      <p>Spend distribution</p>
                    </div>
                  </div>
                  <div className="donut">
                    <span>
                      <strong>{cash.format(total.spend)}</strong>
                      <small>Total spend</small>
                    </span>
                  </div>
                  <p>
                    <span>Facebook feed</span>
                    <b>48%</b>
                  </p>
                  <p>
                    <span>Instagram reels</span>
                    <b>34%</b>
                  </p>
                  <p>
                    <span>Instagram stories</span>
                    <b>18%</b>
                  </p>
                </div>
              </div>
              <div className="card table">
                <div className="title">
                  <div>
                    <h2>Campaigns</h2>
                    <p>{campaigns.length} total</p>
                  </div>
                </div>
                <div className="scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>CAMPAIGN</th>
                        <th>STATUS</th>
                        <th>BUDGET</th>
                        <th>SPEND</th>
                        <th>IMPRESSIONS</th>
                        <th>CTR</th>
                        <th>ROAS</th>
                        <th>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campaigns.map((c) => {
                        const s = stats[c.id] || {
                          impressions: 0,
                          clicks: 0,
                          spend: 0,
                          purchases: 0,
                          revenue: 0,
                        };
                        return (
                          <tr key={c.id}>
                            <td>
                              <div className="campaign">
                                <i>▶</i>
                                <span>
                                  <strong>{c.name}</strong>
                                  <small>
                                    {c.objective} · {c.video}
                                  </small>
                                </span>
                              </div>
                            </td>
                            <td>
                              <span className={`status ${c.status}`}>
                                ● {c.status}
                              </span>
                            </td>
                            <td>{cash.format(c.budget)}/day</td>
                            <td>{cash.format(s.spend)}</td>
                            <td>{s.impressions.toLocaleString()}</td>
                            <td>
                              {s.impressions
                                ? `${((s.clicks / s.impressions) * 100).toFixed(2)}%`
                                : "—"}
                            </td>
                            <td>
                              {s.spend
                                ? `${(s.revenue / s.spend).toFixed(2)}×`
                                : "—"}
                            </td>
                            <td>
                              <button onClick={() => toggle(c.id)}>
                                {c.status === "Active" ? "Pause" : "Activate"}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </section>
      </main>
      {open && <Creator close={() => setOpen(false)} save={save} />}{" "}
      {toast && <div className="toast">✓ {toast}</div>}
    </div>
  );
}

function Metric({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="metric">
      <span>{label}</span>
      <svg viewBox="0 0 70 18">
        <path d="M0 15 L10 11 L20 13 L30 7 L40 10 L50 4 L60 7 L70 1" />
      </svg>
      <h2>{value}</h2>
      <small>{note}</small>
    </div>
  );
}

function Creator({
  close,
  save,
}: {
  close: () => void;
  save: (c: Campaign) => void;
}) {
  const [video, setVideo] = useState<File | null>(null)
  const [preview, setPreview] = useState("")
  const [error, setError] = useState("");

  useEffect(() => {
    if (!video) return;
    const u = URL.createObjectURL(video);
    setPreview(u);
    return () => URL.revokeObjectURL(u);
  }, [video]);

  const choose = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("video/"))
      return setError("Choose a valid video file.");
    if (f.size > 104857600) return setError("Video must be under 100 MB.");
    setVideo(f);
    setError("");
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget),
      url = String(f.get("url")),
      start = String(f.get("start"));
    try {
      const u = new URL(url);
      if (!["http:", "https:"].includes(u.protocol)) throw 0;
    } catch {
      return setError("Enter a valid website URL.");
    }
    if (!video) return setError("Upload an ad video.");
    /* Meta API (disabled): POST /{ad_account_id}/campaigns, /adsets, /advideos, /adcreatives, /ads; GET /{campaign_id}/insights */ save(
      {
        id: crypto.randomUUID(),
        name: String(f.get("name")),
        url,
        objective: String(f.get("objective")),
        audience: String(f.get("audience")),
        budget: Number(f.get("budget")),
        start,
        copy: String(f.get("copy")),
        headline: String(f.get("headline")),
        video: video.name,
        status:
          new Date(start).getTime() > Date.now() + 60000
            ? "Scheduled"
            : "Active",
      },
    );
  };

  return (
    <div className="backdrop">
      <form className="modal" onSubmit={submit}>
        <div className="modalHead">
          <div>
            <small>NEW META AD</small>
            <h2>Create campaign</h2>
            <p>Set up your creative, audience, budget, and schedule.</p>
          </div>
          <button type="button" onClick={close}>
            ×
          </button>
        </div>
        <div className="body">
          <h3>
            <b>01</b> Destination
          </h3>
          <div className="fields">
            <label>
              Campaign name
              <input name="name" required placeholder="Summer product launch" />
            </label>
            <label>
              Website URL
              <input
                name="url"
                required
                type="url"
                placeholder="https://yourstore.com/product"
              />
            </label>
          </div>
          <h3>
            <b>02</b> Ad creative
          </h3>
          {!video ? (
            <label className="drop">
              <input hidden type="file" accept="video/*" onChange={choose} />↑
              <b>Upload your ad video</b>
              <small>MP4, MOV or WebM · Max 100 MB</small>
            </label>
          ) : (
            <div className="preview">
              <video src={preview} controls />
              <span>
                <strong>{video.name}</strong>
                <small>{(video.size / 1048576).toFixed(1)} MB</small>
                <button type="button" onClick={() => setVideo(null)}>
                  Remove video
                </button>
              </span>
            </div>
          )}
          <div className="fields copy">
            <label>
              Primary text
              <textarea name="copy" required rows={3} />
            </label>
            <label>
              Headline
              <input name="headline" required maxLength={40} />
            </label>
          </div>
          <h3>
            <b>03</b> Campaign setup
          </h3>
          <div className="fields">
            <label>
              Objective
              <select name="objective">
                <option>Sales</option>
                <option>Leads</option>
                <option>Traffic</option>
                <option>Awareness</option>
              </select>
            </label>
            <label>
              Daily budget (USD)
              <input name="budget" required type="number" min="1" step=".01" />
            </label>
            <label>
              Audience
              <input
                name="audience"
                required
                placeholder="Wellness-focused professionals"
              />
            </label>
            <label>
              Start date & time
              <input
                name="start"
                required
                type="datetime-local"
                defaultValue={new Date(Date.now() + 300000)
                  .toISOString()
                  .slice(0, 16)}
              />
            </label>
          </div>
          {error && <p className="formError">! {error}</p>}
        </div>
        <footer>
          <span>Saved locally in this browser.</span>
          <div>
            <button type="button" onClick={close}>
              Cancel
            </button>{" "}
            <button className="primary">Launch campaign →</button>
          </div>
        </footer>
      </form>
    </div>
  );
}

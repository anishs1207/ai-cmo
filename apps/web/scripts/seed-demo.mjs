// Demo seed for local UI verification. Run: node scripts/seed-demo.mjs
// Wipe with: npx prisma db push --force-reset
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const kb = {
  businessName: "Loom & Leaf",
  overview: "Loom & Leaf sells organic, small-batch herbal teas blended for focus, sleep and calm.",
  whatItDoes: "Direct-to-consumer tea blends that replace caffeine crashes with steady plant-based energy.",
  targetAudience: "Health-conscious professionals 25-40 who want better sleep and calmer focus without caffeine.",
  audienceSegments: ["burned-out tech workers", "yoga & wellness enthusiasts", "new parents chasing sleep", "grad students"],
  competitors: ["Tea Drops", "Art of Tea", "Yogi Tea"],
  usp: "Single-origin herbs, blended to order weekly — never warehouse-aged like supermarket tea.",
  pricing: "$18 per tin (25 servings), subscription saves 20%.",
  testimonials: ["Replaced my 3pm coffee entirely — the Focus blend is unreal. — Maya R."],
  brandTone: "warm, grounded, quietly confident",
  brandVoice: "a knowledgeable friend who takes wellness seriously but never preaches",
  brandPersonality: "calm, honest, botanical",
  brandIdentity: "Earthy minimalism: cream, sage and terracotta, hand-drawn botanical illustrations.",
  keyBenefits: ["steady focus without jitters", "deeper sleep in 2 weeks", "compostable packaging"],
  objections: ["Does herbal tea actually do anything?", "Why pay $18 for tea?"],
  suggestedSubreddits: ["tea", "HerbalMedicine", "Sleephackers", "productivity", "AsianBeauty"],
  contentThemes: ["ingredient deep-dives", "founder story", "sleep science", "desk rituals"],
};

const business = await db.business.create({
  data: {
    name: kb.businessName,
    websiteUrl: "https://loomandleaf.example.com",
    description: "Organic herbal tea DTC brand.",
    promote: "The Focus blend subscription",
    kbJson: JSON.stringify(kb),
    connections: {
      create: [
        { platform: "facebook", status: "active", accountLabel: "Loom & Leaf Page", externalId: "1234567890" },
        { platform: "reddit", status: "active", accountLabel: "Shared Reddit account" },
      ],
    },
  },
});

const campaign = await db.campaign.create({
  data: { businessId: business.id, name: "Focus blend launch", objective: "Drive subscriptions for the Focus blend", status: "live" },
});

const posts = [
  {
    platform: "reddit",
    subreddit: "productivity",
    title: "I replaced my afternoon coffee with an herbal blend for 30 days — here's what actually changed",
    body: "Around 3pm I used to hit a wall...\n\nSwitched to a lemon-balm + gotu kola blend and tracked my deep work hours. Sharing the data and what surprised me.",
    rationale: "Value-first self-experiment angle; r/productivity rewards data-driven posts.",
    status: "published",
    publishedAt: new Date(Date.now() - 9 * 864e5),
  },
  {
    platform: "facebook",
    body: "Meet the blend that ended our founder's coffee habit.\n\nSteady focus, zero jitters, and it smells like a garden after rain. This week only: 20% off your first tin.",
    hashtags: "#herbaltea #focus #wellness",
    rationale: "Founder story + offer; FB audiences convert on discounts.",
    status: "published",
    publishedAt: new Date(Date.now() - 6 * 864e5),
  },
  {
    platform: "reddit",
    subreddit: "tea",
    title: "What we learned blending 200 test batches of a 'focus' tisane",
    body: "We spent a year testing ratios of lemon balm, tulsi and gotu kola. Some genuinely surprising findings about steep time...",
    rationale: "Craft/expertise angle native to r/tea.",
    status: "draft",
  },
];

let dayOffsets = [
  [9, 3], [8, 7], [7, 12], [6, 18], [5, 14], [4, 9], [3, 16], [2, 22], [1, 11], [0, 6],
];

for (const [i, p] of posts.entries()) {
  const post = await db.post.create({ data: { campaignId: campaign.id, ...p } });
  const link = await db.trackedLink.create({
    data: { code: `demo${i}${Math.random().toString(36).slice(2, 6)}`, businessId: business.id, postId: post.id, destination: "https://loomandleaf.example.com" },
  });
  if (p.status === "published") {
    for (const [daysAgo, n] of dayOffsets) {
      const share = i === 0 ? 0.7 : 0.3;
      for (let k = 0; k < Math.round(n * share); k++) {
        await db.click.create({
          data: {
            linkId: link.id,
            ts: new Date(Date.now() - daysAgo * 864e5 - Math.random() * 864e5 * 0.8),
            referrer: i === 0 ? "https://reddit.com" : "https://facebook.com",
          },
        });
      }
    }
  }
}

await db.insight.create({
  data: {
    businessId: business.id,
    campaignId: campaign.id,
    summary: "Value-first Reddit posts in r/productivity drove 2.3x more clicks than promotional Facebook posts.",
    detail: "## What worked\n- Self-experiment framing on Reddit\n\n## What flopped\n- Discount-led FB copy\n\n**Rules for next campaign:**\n- Lead with data, not discounts",
  },
});

console.log("Seeded demo business:", business.id);
await db.$disconnect();

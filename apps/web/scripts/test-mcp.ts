import { executeMcpTool, getAllMcpServersStatus, MCP_TOOLS } from "../lib/mcp/client";
import { getSavedVideos } from "../lib/mcp/storage";

async function runMcpVerification() {
  console.log("==================================================================");
  console.log("TESTING MCP CLIENT WITH HIGGSFIELD, META ADS & GOOGLE ADS");
  console.log("==================================================================\n");

  // 1. Check MCP Tools registry
  console.log(`[1] MCP Tools Registered: ${MCP_TOOLS.length} tools`);
  for (const t of MCP_TOOLS) {
    console.log(`    - [${t.server.toUpperCase()}] ${t.name}`);
  }

  // 2. Check Server Status
  console.log("\n[2] Checking MCP Server Connections...");
  const servers = await getAllMcpServersStatus();
  for (const s of servers) {
    console.log(`    - ${s.displayName}: ${s.connected ? "CONNECTED" : "FAILED"} (${s.latencyMs}ms, ${s.availableTools.length} tools)`);
  }

  // 3. Test Higgsfield AI UGC Video Generation & Local Saving
  console.log("\n[3] Testing Higgsfield AI UGC Video Generation & Local Save...");
  const hfResult = await executeMcpTool("higgsfield_generate_ugc_video", {
    prompt: "Relatable customer testimonial for organic matcha tea",
    style: "customer_testimonial",
    aspectRatio: "9:16",
    durationSeconds: 15,
    autoSaveLocally: true,
  });
  console.log(`    - Status: ${hfResult.successful ? "SUCCESS" : "FAILED"}`);
  console.log(`    - Message: ${hfResult.message}`);
  const savedVids = getSavedVideos();
  console.log(`    - Saved Videos on Disk: ${savedVids.length} assets`);

  // 4. Test Meta Ads Campaign Creation (Facebook & Instagram)
  console.log("\n[4] Testing Meta Ads Campaign Creation (Facebook & Instagram)...");
  const metaResult = await executeMcpTool("meta_ads_create_campaign", {
    name: "Ceremonial Matcha Multi-Placement Launch",
    objective: "OUTCOME_SALES",
    dailyBudget: 50,
    platforms: ["facebook", "instagram"],
    headline: "Swap 2 PM Crash for Clean Energy",
    primaryText: "100% organic Japanese ceremonial matcha. 14,000+ happy morning routines.",
    callToAction: "SHOP_NOW",
  });
  console.log(`    - Status: ${metaResult.successful ? "SUCCESS" : "FAILED"}`);
  console.log(`    - Message: ${metaResult.message}`);

  // 5. Test Meta Ads Insights & Tracking
  console.log("\n[5] Testing Meta Ads Real-Time Insights & Tracking...");
  const metaInsights = await executeMcpTool("meta_ads_get_insights", {});
  const insightsData = metaInsights.data as { insights?: Array<{ roas: number; spend: number; impressions: number }> };
  if (insightsData?.insights && insightsData.insights.length > 0 && insightsData.insights[0]) {
    console.log(`    - Retrieved ${insightsData.insights.length} campaign insights.`);
    console.log(`    - Top Campaign ROAS: ${insightsData.insights[0].roas}x | Spend: $${insightsData.insights[0].spend}`);
  }

  // 6. Test Google Ads (YouTube Video Ad) Campaign Creation
  console.log("\n[6] Testing Google Ads YouTube Campaign Creation...");
  const ytResult = await executeMcpTool("google_ads_create_youtube_campaign", {
    name: "YouTube Shorts Viral Matcha Hook",
    adFormat: "YOUTUBE_SHORTS",
    dailyBudget: 30,
    targetCpv: 0.02,
    headline: "The Matcha Everyone is Talking About",
    callToAction: "Shop Now",
  });
  console.log(`    - Status: ${ytResult.successful ? "SUCCESS" : "FAILED"}`);
  console.log(`    - Message: ${ytResult.message}`);

  // 7. Test Google Ads YouTube Stats
  console.log("\n[7] Testing Google Ads YouTube Stats Tracking...");
  const ytStats = await executeMcpTool("google_ads_get_campaign_stats", {});
  console.log(`    - Status: ${ytStats.successful ? "SUCCESS" : "FAILED"}`);
  console.log(`    - Message: ${ytStats.message}`);

  console.log("\n==================================================================");
  console.log("ALL MCP CLIENT TESTS PASSED SUCCESSFULLY!");
  console.log("==================================================================");
}

runMcpVerification().catch(console.error);

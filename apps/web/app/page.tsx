"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";

// Simulated logs for each template
const TERMINAL_LOGS: Record<"coder" | "leadgen" | "researcher", Array<{ text: string; type: 'system' | 'info' | 'success' | 'warn' | 'code' | 'slack' }>> = {
  coder: [
    { text: "⚡ OpenClaw Daemon v2.1.0 starting up...", type: "system" },
    { text: "ℹ️ Loading configuration from `openclaw.config.json`...", type: "info" },
    { text: "ℹ️ Hooked into Slack channel: #dev-alerts", type: "info" },
    { text: "🔧 Local engine detected: WebGPU Llama-3.1-8B-Instruct (q4f16_1-MLC)", type: "info" },
    { text: "⚡ Allocating WebGPU device memory & pipeline caches...", type: "system" },
    { text: "📥 [MLC] Fetching model weight chunks...", type: "info" },
    { text: "📥 [MLC] Progress: 12% [chunk_1_of_32]", type: "info" },
    { text: "📥 [MLC] Progress: 48% [chunk_15_of_32]", type: "info" },
    { text: "📥 [MLC] Progress: 85% [chunk_27_of_32]", type: "info" },
    { text: "📥 [MLC] Progress: 100% [All chunks cached locally]", type: "success" },
    { text: "🧠 WebGPU MLC Engine initialized in 1.45s.", type: "success" },
    { text: "🚀 Objective: Scan repository, identify issue in `src/tokenizer.ts` and repair failing tests.", type: "system" },
    { text: "📁 [SHELL] Executing command: `npm run test`", type: "code" },
    { text: "❌ TEST FAILURE: Tokenizer fails on multi-byte chunk boundaries (Expected 128, got 0)", type: "warn" },
    { text: "🔍 [LLM] Analyzing AST of `src/tokenizer.ts`... detected race condition in async stream buffer pipeline.", type: "info" },
    { text: "✏️ [LLM] Generating self-healing code patch for race condition...", type: "info" },
    { text: "💾 Applying hot-fix to local filesystem `src/tokenizer.ts`...", type: "success" },
    { text: "📁 [SHELL] Executing command: `npm run test` (verifying fix...)", type: "code" },
    { text: "✅ ALL TESTS PASSED: Tokenizer (12 passed, 0 failed, duration: 14.2ms)", type: "success" },
    { text: "🐙 [SHELL] Executing command: `git commit -am 'fix: resolve buffer allocation race in tokenizer'`", type: "code" },
    { text: "💬 [SLACK] Post to #dev-alerts: '✅ Tokenizer issue auto-repaired. Tests passing (12/12). Committed to main branch.'", type: "slack" },
    { text: "💤 Core task accomplished. Entering standby mode...", type: "system" }
  ],
  leadgen: [
    { text: "⚡ OpenClaw Daemon v2.1.0 starting up...", type: "system" },
    { text: "ℹ️ Hooked into Discord Webhook: #marketing-leads", type: "info" },
    { text: "🔧 Engine: Claude 3.5 Sonnet (Cloud API Gateway)", type: "info" },
    { text: "🚀 Objective: Scrape YC Launch HN list, product directories, and Twitter for 'automated operation' tooling demands.", type: "system" },
    { text: "🌐 Scraping Hacker News launch feed...", type: "info" },
    { text: "🌐 Searching Twitter/X API with key filters...", type: "info" },
    { text: "✅ Analysis complete. Found 2 high-affinity matching requests.", type: "success" },
    { text: "📊 [LLM] Inspecting Prospect 1: Founder at DevFlow asking for 'background scraping systems' (HN)", type: "info" },
    { text: "📊 [LLM] Inspecting Prospect 2: Tech Lead at ScaleDev looking for 'Slack-integrated AI workstreams' (Twitter)", type: "info" },
    { text: "✏️ [LLM] Drafting bespoke, customized outreach templates for both founders...", type: "info" },
    { text: "💾 Porting lead profiles to local `leads/prospect_portfolio_v1.json`", type: "success" },
    { text: "💬 [DISCORD] Post to #marketing-leads: '🚀 2 new high-affinity leads discovered! Outreach proposals drafted. View /leads to approve outgoing send.'", type: "slack" },
    { text: "💤 Search routine completed. Entering standby (re-checking in 1 hour)...", type: "system" }
  ],
  researcher: [
    { text: "⚡ OpenClaw Daemon v2.1.0 starting up...", type: "system" },
    { text: "ℹ️ Hooked into Slack channel: #research-alerts", type: "info" },
    { text: "🔧 Engine: Gemini 1.5 Pro (Cloud API Gateway)", type: "info" },
    { text: "🚀 Objective: Scan arXiv daily feed for SOTA papers matching 'agentic engineering' & 'long-running loops'.", type: "system" },
    { text: "🌐 Querying arXiv API index...", type: "info" },
    { text: "📚 Found Match: 'Continuous Runtime Loops in Multi-Agent Pipelines' (arXiv:26.1102)", type: "success" },
    { text: "📚 Found Match: 'In-Browser Local LLM Orchestration via WebGPU' (arXiv:26.1408)", type: "success" },
    { text: "🧠 [LLM] Parsing paper bodies and generating concise executive summaries...", type: "info" },
    { text: "💡 Key Architecture Extracted: 'Adaptive local weight-caching to survive client network loss' (implemented into core)", type: "info" },
    { text: "💬 [SLACK] Post to #research-alerts: '📚 Processed 2 new arXiv research papers. Extracted fallback caching architecture. Saved to MEMORY.md.'", type: "slack" },
    { text: "💤 Feed processing finished. Entering idle mode...", type: "system" }
  ]
};

export default function Page() {
  // Simulator State
  const [selectedTemplate, setSelectedTemplate] = useState<"coder" | "leadgen" | "researcher">("coder");
  const [selectedEngine, setSelectedEngine] = useState<"webgpu" | "claude" | "gemini">("webgpu");
  const [terminalState, setTerminalState] = useState<"idle" | "running" | "done">("idle");
  const [terminalLines, setTerminalLines] = useState<Array<{ text: string; type: 'system' | 'info' | 'success' | 'warn' | 'code' | 'slack' }>>([]);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(80); // ms delay per line
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Configurator State
  const [configName, setConfigName] = useState("Claw-Runner-01");
  const [configChannel, setConfigChannel] = useState("#dev-alerts");
  const [configObjective, setConfigObjective] = useState("Scan repository, find TypeScript test breaks, write fixes and alert team.");
  const [configTools, setConfigTools] = useState({
    codeWriter: true,
    webgpu: true,
    slack: true,
    search: false,
    arxiv: false
  });
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [activeAgents, setActiveAgents] = useState<Array<{ name: string; channel: string; objective: string; tools: string[]; engine: string }>>([
    {
      name: "OpenClaw-LeadFinder",
      channel: "#leads",
      objective: "Scan YC list & Twitter for lead leads.",
      tools: ["search", "slack"],
      engine: "Claude 3.5 Sonnet"
    }
  ]);
  const [slackAlerts, setSlackAlerts] = useState<Array<{ sender: string; channel: string; msg: string; time: string }>>([
    {
      sender: "OpenClaw-LeadFinder",
      channel: "#leads",
      msg: "🚀 2 new high-affinity leads discovered! Outreach proposals drafted.",
      time: "10 mins ago"
    }
  ]);

  // Calculator State
  const [tasksCount, setTasksCount] = useState<number>(15);
  const [hoursPerTask, setHoursPerTask] = useState<number>(4);
  const [hourlyRate, setHourlyRate] = useState<number>(80);

  // Waitlist State
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [isWaitlistSubmitting, setIsWaitlistSubmitting] = useState(false);
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalLines]);

  // Handle run terminal simulation
  const runSimulation = () => {
    if (terminalState === "running") return;
    
    setTerminalState("running");
    setTerminalLines([]);

    const fullLogs = [...TERMINAL_LOGS[selectedTemplate]];
    
    // Modify log entry slightly if engine is not WebGPU (adjust WebGPU mentions)
    const filteredLogs = fullLogs.map(log => {
      if (selectedEngine !== "webgpu") {
        if (log.text.includes("WebGPU Llama-3.1-8B-Instruct")) {
          return { ...log, text: `🔧 Cloud Engine selected: ${selectedEngine === "claude" ? "Claude 3.5 Sonnet (Anthropic API)" : "Gemini 1.5 Pro (Google Developer)"}` };
        }
        if (log.text.includes("Allocating WebGPU") || log.text.includes("[MLC]") || log.text.includes("WebGPU MLC Engine")) {
          return { ...log, text: `☁️ Establishing encrypted HTTPS stream tunnel to provider API... [Verified]`, type: "success" as const };
        }
      }
      return log;
    }).filter((log, idx, arr) => {
      // Remove duplicate consecutive "Establishing..." lines to keep output clean
      if (selectedEngine !== "webgpu" && log.text.includes("Establishing encrypted") && arr[idx - 1]?.text.includes("Establishing encrypted")) {
        return false;
      }
      return true;
    });

    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < filteredLogs.length) {
        const line = filteredLogs[currentIdx];
        if (line) {
          setTerminalLines(prev => [...prev, line]);
        }
        currentIdx++;
      } else {
        clearInterval(interval);
        setTerminalState("done");
      }
    }, simulationSpeed);

    return () => clearInterval(interval);
  };

  // Run automatically on mount or template/engine swap
  useEffect(() => {
    runSimulation();
  }, [selectedTemplate, selectedEngine]);

  // Handle configuration deployment
  const handleDeployAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (isProvisioning) return;

    setIsProvisioning(true);
    setTimeout(() => {
      const toolNames = Object.entries(configTools)
        .filter(([_, enabled]) => enabled)
        .map(([key]) => key);

      const newAgent = {
        name: configName,
        channel: configChannel,
        objective: configObjective,
        tools: toolNames,
        engine: selectedEngine === "webgpu" ? "Llama 3.1 Local (WebGPU)" : selectedEngine === "claude" ? "Claude 3.5" : "Gemini 1.5 Pro"
      };

      setActiveAgents(prev => [newAgent, ...prev]);
      
      const newSlackAlert = {
        sender: configName,
        channel: configChannel,
        msg: `⚡ Autonomous Loop activated. Successfully attached to channel ${configChannel}. Goal: ${configObjective.substring(0, 50)}...`,
        time: "Just now"
      };
      setSlackAlerts(prev => [newSlackAlert, ...prev]);

      setIsProvisioning(false);
      // Trigger temporary visual scroll
    }, 1500);
  };

  // Calculate savings
  const savings = useMemo(() => {
    const weeklyHoursSaved = tasksCount * hoursPerTask;
    const yearlyHoursSaved = weeklyHoursSaved * 52;
    const weeklyCostSaved = weeklyHoursSaved * hourlyRate;
    const yearlyCostSaved = weeklyCostSaved * 52;
    return {
      weeklyHoursSaved,
      yearlyHoursSaved,
      weeklyCostSaved,
      yearlyCostSaved
    };
  }, [tasksCount, hoursPerTask, hourlyRate]);

  // Waitlist submit
  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail || isWaitlistSubmitting) return;

    setIsWaitlistSubmitting(true);
    setTimeout(() => {
      setIsWaitlistSubmitting(false);
      setWaitlistSubmitted(true);
      setWaitlistEmail("");
    }, 1200);
  };

  // Dynamic YAML Preview
  const generatedYaml = useMemo(() => {
    const enabledToolsList = Object.entries(configTools)
      .filter(([_, enabled]) => enabled)
      .map(([name]) => `    - ${name}`)
      .join("\n");

    return `# OpenClaw Agent Specification
agent:
  name: "${configName}"
  engine: "${selectedEngine === 'webgpu' ? 'llama-3.1-8b-webgpu' : selectedEngine === 'claude' ? 'claude-3.5-sonnet' : 'gemini-1.5-pro'}"
  trigger:
    cron: "*/30 * * * *" # Every 30 mins
  slack:
    channel: "${configChannel}"
    mentions: true
  objective: "${configObjective}"
  tools:
${enabledToolsList || "    - (none)"}
  persistence: "24x7_always_on"`;
  }, [configName, configChannel, configObjective, configTools, selectedEngine]);

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-[#2a8af6]/30 overflow-x-hidden relative">
      
      {/* Dynamic Background Gradients */}
      <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-[#e92a67]/5 via-[#a853ba]/5 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-bl from-[#2a8af6]/5 via-[#a853ba]/5 to-transparent blur-[150px] pointer-events-none" />
      
      {/* Navigation Header */}
      <nav className="border-b border-slate-900 bg-[#07090e]/80 backdrop-blur-xl sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-[#e92a67] via-[#a853ba] to-[#2a8af6] p-[1.5px] shadow-[0_0_15px_rgba(168,83,186,0.3)]">
              <div className="w-full h-full bg-[#07090e] rounded-[7px] flex items-center justify-center font-bold text-xs text-white tracking-widest">
                OC
              </div>
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                OpenClaw
              </span>
              <span className="ml-1.5 text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[#a853ba]/10 text-[#a853ba] border border-[#a853ba]/20 uppercase tracking-widest font-bold">
                by Bart Labs
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-slate-400 font-medium">
            <a href="#simulator" className="hover:text-white transition-colors">Interactive Demo</a>
            <a href="#configurator" className="hover:text-white transition-colors">Configurator</a>
            <a href="#roi-calculator" className="hover:text-white transition-colors">ROI Calculator</a>
            <a href="#features" className="hover:text-white transition-colors">Platform Features</a>
          </div>

          <div>
            <a 
              href="#waitlist"
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-[#2a8af6] to-[#a853ba] text-white hover:shadow-[0_0_20px_rgba(42,138,246,0.4)] transition-all inline-flex items-center gap-1.5"
            >
              Join 24/7 Waitlist
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-24 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950 border border-slate-900 mb-6 text-xs text-slate-400 font-mono">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          WebGPU Local Inference + 24/7 Autonomous Loops Ready
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-[1.1] mb-6">
          Deploy Autonomous{" "}
          <span className="bg-gradient-to-r from-[#2a8af6] via-[#a853ba] to-[#e92a67] bg-clip-text text-transparent">
            AI-Native Software Agents
          </span>{" "}
          Directly into Slack & Discord
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto font-light leading-relaxed mb-10">
          Meet OpenClaw: The agent-first environment for lead generation, self-healing code, and continuous background operations. Run zero-cost local inference via browser WebGPU or scale with API clouds.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#simulator"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-medium text-sm bg-white text-slate-950 hover:bg-slate-200 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all flex items-center justify-center gap-2"
          >
            Launch Interactive Simulator
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </a>
          <a
            href="#configurator"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-medium text-sm bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-center gap-2"
          >
            Configure Custom Agent
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
          </a>
        </div>

        {/* Floating Brand Badges */}
        <div className="mt-16 pt-12 border-t border-slate-900/50 flex flex-wrap justify-center items-center gap-x-12 gap-y-6 text-xs font-mono text-slate-500 uppercase tracking-widest">
          <span>⚡ Local WebGPU Compute</span>
          <span>🔒 Privacy-First Sandbox</span>
          <span>🤖 Multi-Model Agnostic</span>
          <span>💬 Human-in-the-Loop Approved</span>
        </div>
      </header>

      {/* Simulator Section (Live Demo Console) */}
      <section id="simulator" className="max-w-7xl mx-auto px-6 py-16 md:py-24 relative z-10 scroll-mt-16">
        <div className="grid lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Controls Panel (Left) */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div>
              <div className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-[#2a8af6]/10 text-[#2a8af6] border border-[#2a8af6]/20 mb-4 uppercase tracking-wider">
                01 . Live Demo
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
                Watch OpenClaw Autonomy in Real Time
              </h2>
              <p className="text-slate-400 leading-relaxed font-light mb-8">
                Select a template objective and an LLM engine. Watch how OpenClaw initializes local WebGPU contexts, executes local system commands, processes outcomes, self-heals compiler faults, and outputs alerts directly to Slack.
              </p>
              
              {/* Objective Selector */}
              <div className="space-y-3 mb-6">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Select Agent Template</label>
                <button
                  onClick={() => setSelectedTemplate("coder")}
                  className={`w-full p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 ${
                    selectedTemplate === "coder"
                      ? "bg-slate-900/80 border-[#2a8af6]/60 shadow-[0_0_15px_rgba(42,138,246,0.1)]"
                      : "bg-slate-950/40 border-slate-900 hover:border-slate-800 hover:bg-slate-950/80"
                  }`}
                >
                  <div className={`mt-0.5 p-2 rounded-lg ${selectedTemplate === "coder" ? "bg-[#2a8af6]/10 text-[#2a8af6]" : "bg-slate-900 text-slate-400"}`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                  </div>
                  <div>
                    <h3 className={`font-semibold text-sm ${selectedTemplate === "coder" ? "text-white" : "text-slate-300"}`}>Self-Healing Tokenizer Code</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-normal">Runs local unit tests, writes TS buffer corrections, and reports success in Slack.</p>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedTemplate("leadgen")}
                  className={`w-full p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 ${
                    selectedTemplate === "leadgen"
                      ? "bg-slate-900/80 border-[#a853ba]/60 shadow-[0_0_15px_rgba(168,83,186,0.1)]"
                      : "bg-slate-950/40 border-slate-900 hover:border-slate-800 hover:bg-slate-950/80"
                  }`}
                >
                  <div className={`mt-0.5 p-2 rounded-lg ${selectedTemplate === "leadgen" ? "bg-[#a853ba]/10 text-[#a853ba]" : "bg-slate-900 text-slate-400"}`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
                  </div>
                  <div>
                    <h3 className={`font-semibold text-sm ${selectedTemplate === "leadgen" ? "text-white" : "text-slate-300"}`}>Lead Scraping & Tailored Briefs</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-normal">Monitors Twitter, HN, and communities. Extracts target founders and writes outreach emails.</p>
                  </div>
                </button>

                <button
                  onClick={() => setSelectedTemplate("researcher")}
                  className={`w-full p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 ${
                    selectedTemplate === "researcher"
                      ? "bg-slate-900/80 border-[#e92a67]/60 shadow-[0_0_15px_rgba(233,42,103,0.1)]"
                      : "bg-slate-950/40 border-slate-900 hover:border-slate-800 hover:bg-slate-950/80"
                  }`}
                >
                  <div className={`mt-0.5 p-2 rounded-lg ${selectedTemplate === "researcher" ? "bg-[#e92a67]/10 text-[#e92a67]" : "bg-slate-900 text-slate-400"}`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  </div>
                  <div>
                    <h3 className={`font-semibold text-sm ${selectedTemplate === "researcher" ? "text-white" : "text-slate-300"}`}>arXiv SOTA Paper Ingestion</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-normal">Scans ML papers daily, summarizes key patterns, and appends to private memory bases.</p>
                  </div>
                </button>
              </div>

              {/* Engine Selector */}
              <div className="space-y-2 mb-6">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Select LLM Engine</label>
                <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-900">
                  <button
                    onClick={() => setSelectedEngine("webgpu")}
                    className={`py-2 rounded-lg font-mono text-[11px] font-bold transition-all ${
                      selectedEngine === "webgpu"
                        ? "bg-[#2a8af6]/10 text-[#2a8af6] border border-[#2a8af6]/30 shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Local WebGPU
                  </button>
                  <button
                    onClick={() => setSelectedEngine("claude")}
                    className={`py-2 rounded-lg font-mono text-[11px] font-bold transition-all ${
                      selectedEngine === "claude"
                        ? "bg-[#a853ba]/10 text-[#a853ba] border border-[#a853ba]/30 shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Claude 3.5
                  </button>
                  <button
                    onClick={() => setSelectedEngine("gemini")}
                    className={`py-2 rounded-lg font-mono text-[11px] font-bold transition-all ${
                      selectedEngine === "gemini"
                        ? "bg-[#e92a67]/10 text-[#e92a67] border border-[#e92a67]/30 shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Gemini 1.5
                  </button>
                </div>
              </div>
            </div>

            {/* Run Button and details */}
            <div className="pt-4 border-t border-slate-900">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-slate-500">Speed Multiplier</span>
                <div className="flex gap-1">
                  {[
                    { label: "0.5x", val: 160 },
                    { label: "1x", val: 80 },
                    { label: "2x", val: 30 }
                  ].map(sp => (
                    <button
                      key={sp.label}
                      onClick={() => setSimulationSpeed(sp.val)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
                        simulationSpeed === sp.val
                          ? "bg-slate-800 text-white border-slate-700"
                          : "bg-transparent text-slate-500 border-transparent hover:text-slate-300"
                      }`}
                    >
                      {sp.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={runSimulation}
                disabled={terminalState === "running"}
                className={`w-full py-3.5 rounded-xl text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${
                  terminalState === "running"
                    ? "bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed"
                    : "bg-white text-slate-950 hover:bg-slate-200"
                }`}
              >
                {terminalState === "running" ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Executing Agent...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                    Run Agent Session
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Terminal View (Right) */}
          <div className="lg:col-span-8 bg-[#030508] border border-slate-900 rounded-2xl flex flex-col overflow-hidden shadow-2xl relative min-h-[500px]">
            {/* Header */}
            <div className="bg-[#07090e] px-4 py-3 border-b border-slate-900/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40 inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40 inline-block" />
                <span className="text-xs font-mono text-slate-500 ml-2">openclaw@bart-daemon:~/sandbox</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-950 text-slate-500 border border-slate-900">
                  Engine: {selectedEngine.toUpperCase()}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${terminalState === "running" ? "bg-green-500 animate-pulse" : "bg-slate-600"}`} />
                  <span className="text-[11px] font-mono text-slate-400 capitalize">{terminalState}</span>
                </div>
              </div>
            </div>

            {/* Simulated Shell Area */}
            <div className="flex-1 p-5 font-mono text-xs overflow-y-auto leading-relaxed space-y-2.5 max-h-[480px]">
              {terminalLines.length === 0 && (
                <div className="text-slate-600 text-center py-20 flex flex-col items-center justify-center">
                  <svg className="w-12 h-12 stroke-current opacity-40 mb-3" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <p>OpenClaw Daemon Ready.</p>
                  <p className="text-[10px] mt-1">Select preferences and click "Run Agent Session" to witness the execution stream.</p>
                </div>
              )}

              {terminalLines.map((line, idx) => {
                let colorClass = "text-slate-300";
                let prefix = "";

                if (line.type === "system") {
                  colorClass = "text-[#a853ba] font-semibold";
                  prefix = "» ";
                } else if (line.type === "info") {
                  colorClass = "text-slate-400";
                  prefix = "⚙ ";
                } else if (line.type === "success") {
                  colorClass = "text-emerald-400";
                  prefix = "✔ ";
                } else if (line.type === "warn") {
                  colorClass = "text-rose-400 font-bold";
                  prefix = "⚠ ";
                } else if (line.type === "code") {
                  colorClass = "text-blue-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-900/50 block";
                  prefix = "$ ";
                } else if (line.type === "slack") {
                  colorClass = "text-[#2a8af6] font-semibold bg-[#2a8af6]/5 border border-[#2a8af6]/10 px-3 py-2 rounded-xl block shadow-sm";
                  prefix = "💬 SLACK INTEGRATION: ";
                }

                return (
                  <div key={idx} className={`whitespace-pre-wrap ${colorClass}`}>
                    {prefix}{line.text}
                  </div>
                );
              })}

              {terminalState === "running" && (
                <div className="inline-flex items-center text-slate-500 font-mono text-xs">
                  <span className="w-2 h-4 bg-slate-400 animate-blink" />
                </div>
              )}
              
              <div ref={terminalEndRef} />
            </div>

            {/* Output Panel Info Footer */}
            <div className="bg-[#05070a] border-t border-slate-900/80 px-4 py-2.5 text-[10px] font-mono text-slate-500 flex justify-between">
              <span>SANDBOX DIRECTORY: /tmp/claw-instance-219a</span>
              <span>MEMORY CONTEXT: LOCAL</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Configurator Section */}
      <section id="configurator" className="max-w-7xl mx-auto px-6 py-16 md:py-24 relative z-10 scroll-mt-16 border-t border-slate-900/30">
        <div className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-[#a853ba]/10 text-[#a853ba] border border-[#a853ba]/20 mb-4 uppercase tracking-wider">
          02 . Visual Provisioner
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
          Build and Scaffold Your Agent Instance
        </h2>
        <p className="text-slate-400 text-lg font-light leading-relaxed max-w-3xl mb-12">
          Toggle capabilities, establish objectives, and instantly formulate the underlying OpenClaw JSON/YAML specifications. Test-run your agents by provisioning them in real-time below.
        </p>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Settings Panel (Left) */}
          <form onSubmit={handleDeployAgent} className="lg:col-span-5 bg-slate-950/40 border border-slate-900 p-6 rounded-2xl flex flex-col justify-between">
            <div className="space-y-5">
              <h3 className="text-lg font-bold text-white border-b border-slate-900 pb-3">Agent Blueprints</h3>
              
              {/* Agent Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Agent Identifier</label>
                <input
                  type="text"
                  value={configName}
                  onChange={(e) => setConfigName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-[#a853ba]/50 font-mono"
                  placeholder="e.g. CodePatrol-Agent"
                  required
                />
              </div>

              {/* Slack channel destination */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Target Notification Hub (Slack/Discord)</label>
                <input
                  type="text"
                  value={configChannel}
                  onChange={(e) => setConfigChannel(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-[#a853ba]/50 font-mono"
                  placeholder="e.g. #ops-alerts"
                  required
                />
              </div>

              {/* Objective Textarea */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Primary Objective Statement</label>
                <textarea
                  value={configObjective}
                  onChange={(e) => setConfigObjective(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-[#a853ba]/50 leading-relaxed font-light"
                  rows={3}
                  placeholder="What is this agent's operational mandate?"
                  required
                />
              </div>

              {/* Tools Toggles */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Enabled Toolsets & Sandboxes</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  <button
                    type="button"
                    onClick={() => setConfigTools(prev => ({ ...prev, codeWriter: !prev.codeWriter }))}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                      configTools.codeWriter 
                        ? "bg-[#2a8af6]/5 border-[#2a8af6]/40 text-white" 
                        : "bg-transparent border-slate-900 text-slate-500 hover:border-slate-800"
                    }`}
                  >
                    <span className="text-xs font-bold">Write & Run Code</span>
                    <span className={`w-2.5 h-2.5 rounded-full ${configTools.codeWriter ? "bg-[#2a8af6] shadow-[0_0_10px_rgba(42,138,246,0.5)]" : "bg-slate-800"}`} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setConfigTools(prev => ({ ...prev, webgpu: !prev.webgpu }))}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                      configTools.webgpu 
                        ? "bg-[#a853ba]/5 border-[#a853ba]/40 text-white" 
                        : "bg-transparent border-slate-900 text-slate-500 hover:border-slate-800"
                    }`}
                  >
                    <span className="text-xs font-bold">Local WebGPU Sandbox</span>
                    <span className={`w-2.5 h-2.5 rounded-full ${configTools.webgpu ? "bg-[#a853ba] shadow-[0_0_10px_rgba(168,83,186,0.5)]" : "bg-slate-800"}`} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setConfigTools(prev => ({ ...prev, slack: !prev.slack }))}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                      configTools.slack 
                        ? "bg-[#e92a67]/5 border-[#e92a67]/40 text-white" 
                        : "bg-transparent border-slate-900 text-slate-500 hover:border-slate-800"
                    }`}
                  >
                    <span className="text-xs font-bold">Slack Posting</span>
                    <span className={`w-2.5 h-2.5 rounded-full ${configTools.slack ? "bg-[#e92a67] shadow-[0_0_10px_rgba(233,42,103,0.5)]" : "bg-slate-800"}`} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setConfigTools(prev => ({ ...prev, search: !prev.search }))}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                      configTools.search 
                        ? "bg-[#2a8af6]/5 border-[#2a8af6]/40 text-white" 
                        : "bg-transparent border-slate-900 text-slate-500 hover:border-slate-800"
                    }`}
                  >
                    <span className="text-xs font-bold">Google Web Search</span>
                    <span className={`w-2.5 h-2.5 rounded-full ${configTools.search ? "bg-[#2a8af6] shadow-[0_0_10px_rgba(42,138,246,0.5)]" : "bg-slate-800"}`} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setConfigTools(prev => ({ ...prev, arxiv: !prev.arxiv }))}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                      configTools.arxiv 
                        ? "bg-[#a853ba]/5 border-[#a853ba]/40 text-white" 
                        : "bg-transparent border-slate-900 text-slate-500 hover:border-slate-800"
                    }`}
                  >
                    <span className="text-xs font-bold">arXiv Database Scan</span>
                    <span className={`w-2.5 h-2.5 rounded-full ${configTools.arxiv ? "bg-[#a853ba] shadow-[0_0_10px_rgba(168,83,186,0.5)]" : "bg-slate-800"}`} />
                  </button>

                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-900">
              <button
                type="submit"
                disabled={isProvisioning}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#a853ba] to-[#e92a67] text-white font-bold text-sm shadow-md hover:shadow-[0_0_20px_rgba(168,83,186,0.3)] transition-all flex items-center justify-center gap-2"
              >
                {isProvisioning ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Provisioning Agent Instance...
                  </>
                ) : (
                  <>
                    <svg className="w-4.5 h-4.5 fill-none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Provision & Deploy Agent
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Code Spec & Sandbox Simulation (Right) */}
          <div className="lg:col-span-7 grid sm:grid-cols-12 gap-6">
            
            {/* Spec (Left Column) */}
            <div className="sm:col-span-6 bg-[#030508] border border-slate-900 rounded-2xl flex flex-col overflow-hidden relative shadow-md">
              <div className="bg-[#07090e] px-4 py-3 border-b border-slate-900 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500">config.yaml (Auto-Generated)</span>
                <span className="text-[10px] font-mono text-[#a853ba]">READY</span>
              </div>
              <pre className="flex-1 p-4 font-mono text-[10px] text-slate-400 overflow-x-auto leading-relaxed bg-[#030508]">
                <code>{generatedYaml}</code>
              </pre>
            </div>

            {/* Simulated Slack/Active Feed (Right Column) */}
            <div className="sm:col-span-6 flex flex-col gap-5">
              
              {/* Active Agents Monitor */}
              <div className="bg-[#030508] border border-slate-900 rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Active Loop Monitor</h4>
                
                <div className="space-y-2 max-h-[140px] overflow-y-auto">
                  {activeAgents.map((ag, idx) => (
                    <div key={idx} className="bg-slate-950 p-2.5 rounded-xl border border-slate-900 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <h5 className="font-mono text-[11px] font-bold text-white truncate">{ag.name}</h5>
                        </div>
                        <p className="text-[9px] text-slate-400 truncate mt-0.5">{ag.objective}</p>
                      </div>
                      <div className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-900 text-slate-500 uppercase shrink-0">
                        {ag.tools.length} Tools
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Slack Notification Simulator Feed */}
              <div className="flex-1 bg-[#030508] border border-slate-900 rounded-2xl p-4 flex flex-col">
                <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#2a8af6] flex items-center gap-1">
                    <span className="inline-block w-2.5 h-2.5 bg-[#2a8af6] rounded-[3px] font-bold text-[8px] text-[#030508] text-center leading-normal">S</span>
                    Slack Channel Feed
                  </h4>
                  <span className="text-[9px] font-mono text-slate-500">Live webhook alerts</span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto max-h-[180px] pr-1">
                  {slackAlerts.map((sa, idx) => (
                    <div key={idx} className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-900 text-left">
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className="font-bold text-slate-300 font-mono">@{sa.sender}</span>
                        <span className="text-slate-500">{sa.time}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono leading-relaxed bg-slate-900/50 p-2 rounded-lg border border-slate-900">
                        <span className="text-[#2a8af6] font-bold">{sa.channel}: </span>
                        {sa.msg}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ROI & Automation Calculator Section */}
      <section id="roi-calculator" className="max-w-7xl mx-auto px-6 py-16 md:py-24 relative z-10 scroll-mt-16 border-t border-slate-900/30">
        <div className="bg-gradient-to-br from-slate-950/80 to-[#07090e]/80 border border-slate-900 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Subtle glowing orb in card */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-[#2a8af6]/5 to-[#a853ba]/5 blur-[80px] pointer-events-none" />

          <div className="grid lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Copy (Left) */}
            <div className="lg:col-span-5">
              <div className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-[#2a8af6]/10 text-[#2a8af6] border border-[#2a8af6]/20 mb-4 uppercase tracking-wider">
                03 . ROI Metrics
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
                Calculate Your Automation Dividend
              </h2>
              <p className="text-slate-400 leading-relaxed font-light mb-6">
                Manual tasks and constant context switching drain engineering morale and company budgets. Drag the sliders to estimate how many manual operations OpenClaw's autonomous loops can fully offload, and compute the immediate return on investment.
              </p>
              <div className="text-xs text-slate-500 font-mono leading-relaxed p-3 bg-slate-950 rounded-xl border border-slate-900 inline-block">
                * Based on an estimated industry average developer cost of <strong>${hourlyRate}/hour</strong>.
              </div>
            </div>

            {/* Calculations & Sliders (Right) */}
            <div className="lg:col-span-7 grid md:grid-cols-2 gap-8 items-stretch">
              
              {/* Sliders (Left Column) */}
              <div className="space-y-6 flex flex-col justify-center bg-slate-950/60 p-6 rounded-2xl border border-slate-900">
                {/* Sliders 1 */}
                <div>
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    <span>Manual tasks / week</span>
                    <span className="text-[#2a8af6] font-mono text-sm">{tasksCount}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={tasksCount}
                    onChange={(e) => setTasksCount(Number(e.target.value))}
                    className="w-full accent-[#2a8af6] cursor-pointer bg-slate-800 rounded-lg h-1"
                  />
                  <div className="flex justify-between text-[10px] text-slate-600 mt-1">
                    <span>1 task</span>
                    <span>100 tasks</span>
                  </div>
                </div>

                {/* Sliders 2 */}
                <div>
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    <span>Time saved per task</span>
                    <span className="text-[#a853ba] font-mono text-sm">{hoursPerTask} hrs</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    step="0.5"
                    value={hoursPerTask}
                    onChange={(e) => setHoursPerTask(Number(e.target.value))}
                    className="w-full accent-[#a853ba] cursor-pointer bg-slate-800 rounded-lg h-1"
                  />
                  <div className="flex justify-between text-[10px] text-slate-600 mt-1">
                    <span>1 hour</span>
                    <span>12 hours</span>
                  </div>
                </div>

                {/* Sliders 3 */}
                <div>
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    <span>Hourly Engineering Rate</span>
                    <span className="text-[#e92a67] font-mono text-sm">${hourlyRate}/hr</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="200"
                    step="5"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    className="w-full accent-[#e92a67] cursor-pointer bg-slate-800 rounded-lg h-1"
                  />
                  <div className="flex justify-between text-[10px] text-slate-600 mt-1">
                    <span>$40</span>
                    <span>$200</span>
                  </div>
                </div>
              </div>

              {/* Numbers Display (Right Column) */}
              <div className="flex flex-col gap-4">
                {/* Card 1 */}
                <div className="bg-[#030508]/80 border border-slate-900 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-center flex-1">
                  <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-tr from-[#2a8af6]/5 to-[#a853ba]/5 blur-[25px]" />
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Weekly Hours Salvaged</span>
                  <div className="text-3xl md:text-4xl font-extrabold text-white mt-2 font-mono bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                    {savings.weeklyHoursSaved} hrs
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1.5 leading-normal">
                    Equivalent to {Math.round((savings.weeklyHoursSaved / 40) * 10) / 10} full-time engineer(s) capacity.
                  </p>
                </div>

                {/* Card 2 */}
                <div className="bg-[#030508]/80 border border-slate-900 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-center flex-1">
                  <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-tr from-[#a853ba]/5 to-[#e92a67]/5 blur-[25px]" />
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Annual Capital Retained</span>
                  <div className="text-3xl md:text-4xl font-extrabold text-emerald-400 mt-2 font-mono bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                    ${savings.yearlyCostSaved.toLocaleString()}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1.5 leading-normal">
                    Reallocate {savings.yearlyHoursSaved.toLocaleString()} hours back to building core product features.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-16 md:py-24 relative z-10 scroll-mt-16 border-t border-slate-900/30">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-[#e92a67]/10 text-[#e92a67] border border-[#e92a67]/20 mb-4 uppercase tracking-wider">
            04 . Core Pillars
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
            Architected for Complete Autonomy
          </h2>
          <p className="text-slate-400 text-lg font-light leading-relaxed">
            Unlike simple chatbots, OpenClaw is designed to be a continuous operation worker, equipped with secure local compute and state memory.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-slate-950/40 border border-slate-900/80 rounded-2xl p-6 hover:border-slate-800 transition-colors">
            <div className="p-3 bg-[#2a8af6]/10 text-[#2a8af6] border border-[#2a8af6]/20 rounded-xl w-fit mb-5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="font-bold text-lg text-white mb-2">Persistent 24/7 Loops</h3>
            <p className="text-slate-400 text-sm font-light leading-relaxed">
              Define objectives once. OpenClaw runs in continuous background containers, checking code status, verifying servers, or crawling web data hourly.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-950/40 border border-slate-900/80 rounded-2xl p-6 hover:border-slate-800 transition-colors">
            <div className="p-3 bg-[#a853ba]/10 text-[#a853ba] border border-[#a853ba]/20 rounded-xl w-fit mb-5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h3 className="font-bold text-lg text-white mb-2">Local WebGPU Compute</h3>
            <p className="text-slate-400 text-sm font-light leading-relaxed">
              Privacy-first and fully local. Harness your machine's local GPU directly inside the browser using MLC Web-LLM. Run heavy inference models with zero cloud expenses.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-950/40 border border-slate-900/80 rounded-2xl p-6 hover:border-slate-800 transition-colors">
            <div className="p-3 bg-[#e92a67]/10 text-[#e92a67] border border-[#e92a67]/20 rounded-xl w-fit mb-5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9l-1.9 1.9-.1.1m0 0a2 2 0 01-2.1-.2L3 17a2 2 0 01-1-1.7V10a2 2 0 012-2h10a2 2 0 012 2v3.5a2.5 2.5 0 005 0V8z" /></svg>
            </div>
            <h3 className="font-bold text-lg text-white mb-2">Omnichannel Slack/Discord Hook</h3>
            <p className="text-slate-400 text-sm font-light leading-relaxed">
              Integrate seamlessly. OpenClaw hooks directly into your team communications, waiting for chat commands, providing daily logs, and asking for visual confirmation.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-slate-950/40 border border-slate-900/80 rounded-2xl p-6 hover:border-slate-800 transition-colors">
            <div className="p-3 bg-[#2a8af6]/10 text-[#2a8af6] border border-[#2a8af6]/20 rounded-xl w-fit mb-5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
            </div>
            <h3 className="font-bold text-lg text-white mb-2">Self-Healing Tokenizer</h3>
            <p className="text-slate-400 text-sm font-light leading-relaxed">
              Equipped with deep execution sandboxes. Detects typescript errors, failing unit tests, writes patch files, runs compilers, and auto-commits directly to repository streams.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-slate-950/40 border border-slate-900/80 rounded-2xl p-6 hover:border-slate-800 transition-colors">
            <div className="p-3 bg-[#a853ba]/10 text-[#a853ba] border border-[#a853ba]/20 rounded-xl w-fit mb-5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </div>
            <h3 className="font-bold text-lg text-white mb-2">arXiv & Literature Digest</h3>
            <p className="text-slate-400 text-sm font-light leading-relaxed">
              Maintains competitive cutting-edge context. Feeds daily arXiv search records, processes abstracts, synthesizes methodologies, and updates vector index maps.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-slate-950/40 border border-slate-900/80 rounded-2xl p-6 hover:border-slate-800 transition-colors">
            <div className="p-3 bg-[#e92a67]/10 text-[#e92a67] border border-[#e92a67]/20 rounded-xl w-fit mb-5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <h3 className="font-bold text-lg text-white mb-2">Strict Sandbox Isolation</h3>
            <p className="text-slate-400 text-sm font-light leading-relaxed">
              Safety-first approach. All generated code and command parameters execute inside highly secure, restricted virtual machines, isolating local hardware completely.
            </p>
          </div>
        </div>
      </section>

      {/* Waitlist Call to Action */}
      <section id="waitlist" className="max-w-4xl mx-auto px-6 py-20 relative z-10 text-center scroll-mt-16">
        <div className="relative rounded-3xl bg-slate-950/80 border border-slate-900 p-8 md:p-14 overflow-hidden shadow-2xl">
          {/* Back glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-gradient-to-tr from-[#2a8af6]/10 to-[#a853ba]/10 blur-[60px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
              Step Into the Agent-First Era
            </h2>
            <p className="text-slate-400 font-light leading-relaxed mb-10">
              Get early developer beta access to the OpenClaw Dashboard. Establish persistent Docker hosts, audit agent behaviors via visual streams, and monitor WebGPU cluster nodes.
            </p>

            {waitlistSubmitted ? (
              <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-6 text-center shadow-lg">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h4 className="font-bold text-white text-base">You are on the list!</h4>
                <p className="text-xs text-slate-400 mt-1">We've registered your email for OpenClaw Beta priority access. Watch your inbox!</p>
              </div>
            ) : (
              <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-3.5 max-w-lg mx-auto">
                <input
                  type="email"
                  value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  className="flex-1 px-4 py-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-[#2a8af6]/50 placeholder-slate-500"
                  placeholder="Enter your work email"
                  required
                />
                <button
                  type="submit"
                  disabled={isWaitlistSubmitting}
                  className="px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#2a8af6] to-[#a853ba] text-white hover:shadow-[0_0_20px_rgba(42,138,246,0.3)] transition-all flex items-center justify-center gap-1.5 shrink-0"
                >
                  {isWaitlistSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Request Beta Access
                      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </>
                  )}
                </button>
              </form>
            )}

            <p className="text-[10px] text-slate-600 mt-4 font-mono">
              NO CREDIT CARD REQUIRED. OPEN-SOURCE ENGINE FULLY ACCESSIBLE ON GITHUB.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#04060a] relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-white tracking-tight">OpenClaw</span>
            <span className="text-slate-600">|</span>
            <span>© 2026 Bart Labs. All rights reserved.</span>
          </div>

          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Use</a>
            <a href="https://github.com/google-gemini/gemini-cli" className="hover:text-slate-300 transition-colors">Gemini CLI Github</a>
            <a href="https://docs.openclaw.ai/" className="hover:text-slate-300 transition-colors">OpenClaw Docs</a>
          </div>
        </div>
      </footer>
      
    </div>
  );
}

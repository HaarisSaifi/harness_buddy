// ==============================================================================
// 🚀 HARNESS BUDDY: MULTI-AGENT LIVE FLEET HEALTH CHECK
// Loads keys from .env file or environment variables.
// ==============================================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env if present
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const k = trimmed.substring(0, idx).trim();
      const v = trimmed.substring(idx + 1).trim();
      if (!process.env[k]) process.env[k] = v;
    }
  }
}

const xkiroKey = process.env.XKIRO_API_KEY || "";
const rawXkiroBase = process.env.XKIRO_BASE_URL || "https://api.xkiro.com/v1";
const xkiroBase = rawXkiroBase.endsWith('/chat/completions') ? rawXkiroBase : `${rawXkiroBase.replace(/\/$/, '')}/chat/completions`;

const dahlKey = process.env.DAHL_API_KEY || "";
const rawDahlBase = process.env.DAHL_BASE_URL || "https://inference.dahl.global/v1";
const dahlBase = rawDahlBase.endsWith('/chat/completions') ? rawDahlBase : `${rawDahlBase.replace(/\/$/, '')}/chat/completions`;

const nvidiaKey = process.env.NVIDIA_API_KEY || "";
const rawNvidiaBase = process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1";
const nvidiaBase = rawNvidiaBase.endsWith('/chat/completions') ? rawNvidiaBase : `${rawNvidiaBase.replace(/\/$/, '')}/chat/completions`;

console.log("===============================================================================");
console.log("             🚀 HARNESS BUDDY: MULTI-AGENT FLEET HEALTH CHECK                  ");
console.log("===============================================================================\n");

if (!xkiroKey && !dahlKey && !nvidiaKey) {
  console.log("⚠️  NO API KEYS DETECTED IN ENVIRONMENT OR .env FILE!\n");
  console.log("👉 How to configure your keys:");
  console.log("   1. Copy '.env.example' to '.env'");
  console.log("   2. Add your API key(s):");
  console.log("      - XKIRO_API_KEY=your_xkiro_key_here  (Get free from https://api.xkiro.com)");
  console.log("      - DAHL_API_KEY=your_dahl_key_here    (Get 100M free tokens from https://inference.dahl.global)");
  console.log("   3. Run 'node test-connection.mjs' again.\n");
  process.exit(0);
}

const agentFleet = [];

if (xkiroKey) {
  agentFleet.push(
    {
      role: "01. Chief Master Orchestrator (1M Brain)",
      provider: "xKiro Flagship",
      endpoint: xkiroBase,
      key: xkiroKey,
      model: "qwen/qwen3.8-max:free",
      desc: "1 Million Context Flagship Reasoning & Swarm Orchestration"
    },
    {
      role: "03. Full-Stack Software Engineer & Logic",
      provider: "xKiro Mistral",
      endpoint: xkiroBase,
      key: xkiroKey,
      model: "mistralai/codestral-2508",
      desc: "Core Logic, Backend Architecture, Compilers & Refactor"
    },
    {
      role: "04. Codebase Onboarder & Multimodal Vision",
      provider: "xKiro MiniMax",
      endpoint: xkiroBase,
      key: xkiroKey,
      model: "minimax/minimax-m3:free",
      desc: "1M Context Multimodal Vision, Image-to-Code & Large Repo Scan"
    },
    {
      role: "05. Frontend UI/UX Designer & CSS Master",
      provider: "xKiro Designer",
      endpoint: xkiroBase,
      key: xkiroKey,
      model: "qwen/qwen3.7-max:free",
      desc: "Stunning Modern Web UI, CSS Glassmorphism & UX Polish"
    },
    {
      role: "06. Dedicated Code Specialist & Refactorer",
      provider: "xKiro Coder",
      endpoint: xkiroBase,
      key: xkiroKey,
      model: "qwen/qwen3-coder-plus:free",
      desc: "Targeted Bug Fixing, Algorithm Design & Unit Testing"
    },
    {
      role: "07. DevOps, Terminal & OS Automator",
      provider: "xKiro DevOps",
      endpoint: xkiroBase,
      key: xkiroKey,
      model: "mistralai/devstral-medium",
      desc: "PowerShell Scripts, Git Control & Automation Pipelines"
    }
  );
}

if (dahlKey) {
  agentFleet.splice(1, 0, {
    role: "02. Real DeepSeek V4 Brain (100M Free Tokens)",
    provider: "Dahl Inference",
    endpoint: dahlBase,
    key: dahlKey,
    model: "deepseek-ai/DeepSeek-V4-Flash-0731",
    desc: "DeepSeek Official V4 Architecture (High-Speed Inference)"
  });
}

if (nvidiaKey) {
  agentFleet.push(
    {
      role: "08. Z.ai GLM 5.3 (753B Heavy Logic Brain)",
      provider: "NVIDIA NIM",
      endpoint: nvidiaBase,
      key: nvidiaKey,
      model: "z-ai/glm-5.3",
      desc: "753B Sparse Attention MoE with Reasoning & Tool Calling"
    },
    {
      role: "09. Moonshot Kimi K3 (2.8T Agentic Brain)",
      provider: "NVIDIA NIM",
      endpoint: nvidiaBase,
      key: nvidiaKey,
      model: "moonshotai/kimi-k3",
      desc: "2.8T Hybrid KDA+MLA Multimodal MoE for Long-Horizon Agent Coding"
    }
  );
}

async function testAgent(agent) {
  try {
    const res = await fetch(agent.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${agent.key}`
      },
      body: JSON.stringify({
        model: agent.model,
        messages: [{ role: "user", content: "Reply with: READY" }],
        max_tokens: 15
      })
    });
    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || data.error?.message || "No response";

    if (res.ok && reply && !reply.toLowerCase().includes("error")) {
      console.log(`✅ [${agent.role}]`);
      console.log(`   ├─ Provider: ${agent.provider} | Model: ${agent.model}`);
      console.log(`   ├─ Capability: ${agent.desc}`);
      console.log(`   └─ Live Signal: "${reply.replace(/\n/g, ' ').slice(0, 60)}"\n`);
      return true;
    } else {
      console.log(`❌ [${agent.role}] -> ${agent.model}: ${reply}\n`);
      return false;
    }
  } catch (err) {
    console.log(`❌ [${agent.role}] -> ${agent.model}: ${err.message}\n`);
    return false;
  }
}

async function run() {
  let passed = 0;
  for (const agent of agentFleet) {
    const ok = await testAgent(agent);
    if (ok) passed++;
  }

  console.log("===============================================================================");
  if (passed === agentFleet.length && agentFleet.length > 0) {
    console.log(`🎉 PERFECT SCORE! ALL ${passed}/${agentFleet.length} AGENTS ARE 100% OPERATIONAL & READY TO WORK!`);
  } else {
    console.log(`⚠️ ${passed}/${agentFleet.length} agents passed.`);
  }
  console.log("===============================================================================");
}

run();

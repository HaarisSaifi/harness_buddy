import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load root .env
const rootEnvPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(rootEnvPath)) {
  const lines = fs.readFileSync(rootEnvPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const k = trimmed.substring(0, idx).trim();
      const v = trimmed.substring(idx + 1).trim();
      if (!process.env[k]) process.env[k] = v;
    }
  }
}

const XKIRO_API_KEY = process.env.XKIRO_API_KEY || "";
const XKIRO_BASE_URL = (process.env.XKIRO_BASE_URL || "https://api.xkiro.com/v1").replace(/\/$/, '');

const DAHL_API_KEY = process.env.DAHL_API_KEY || "";
const DAHL_BASE_URL = (process.env.DAHL_BASE_URL || "https://inference.dahl.global/v1").replace(/\/$/, '');

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY || "";
const NVIDIA_BASE_URL = (process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1").replace(/\/$/, '');

const AGENTROUTER_API_KEY = process.env.AGENTROUTER_API_KEY || "";
const AGENTROUTER_BASE_URL = (process.env.AGENTROUTER_BASE_URL || "https://agentrouter.org/v1").replace(/\/$/, '');

const PORT = parseInt(process.env.PORT || "3080", 10);
let activeWorkspace = fs.existsSync('d:\\mamu court') ? 'd:\\mamu court' : path.join(__dirname, '..');

// Load agent personas from ../agents/
function loadPersona(fileName) {
  const p = path.join(__dirname, '..', 'agents', fileName);
  if (fs.existsSync(p)) {
    return fs.readFileSync(p, 'utf8');
  }
  return "";
}

const PONYTAIL_SENIOR_STANDARDS = `
[SENIOR PRINCIPAL SOFTWARE ARCHITECT & CODER DIRECTIVE]:
You are operating under the strictest senior-engineer standards (Ponytail + Zero-Hallucination Framework).
1. YAGNI (You Ain't Gonna Need It): Eliminate bloated boilerplate, unnecessary abstractions, and redundant helper classes. Produce clean, laser-focused, production-grade solutions.
2. Complete Executable Code: NEVER use placeholders like '// TODO', '// add logic here', or '// write rest of function'. Always write 100% complete, working code.
3. Defensive Engineering: Include explicit type safety (TypeScript / Python hints), error handling (try/catch, edge cases, input validation), and zero unhandled promises.
4. Native Power: Prefer standard library and platform-native capabilities (Modern Fetch, Crypto, Web APIs) over bloating node_modules.
5. Accuracy & Craftsmanship: Your code must survive production workloads under high concurrency. Explain key architectural decisions concisely.
`;

const FALLBACK_CHAINS = {
  "claude-opus-5": [
    { provider: "xkiro", model: "qwen/qwen3.8-max:free", name: "Qwen 3.8 Max Flagship" },
    { provider: "xkiro", model: "mistralai/codestral-2508", name: "Mistral Codestral" }
  ],
  "gpt-6-astra": [
    { provider: "xkiro", model: "qwen/qwen3.8-max:free", name: "Qwen 3.8 Max Flagship" },
    { provider: "xkiro", model: "qwen/qwen3-coder-plus:free", name: "Qwen 3 Coder Plus" }
  ],
  "deepseek-v4-flash": [
    { provider: "xkiro", model: "qwen/qwen3.8-max:free", name: "Qwen 3.8 Max Flagship" },
    { provider: "xkiro", model: "mistralai/codestral-2508", name: "Mistral Codestral" }
  ],
  "deepseek/deepseek-v4-pro": [
    { provider: "xkiro", model: "qwen/qwen3.8-max:free", name: "Qwen 3.8 Max Flagship" },
    { provider: "xkiro", model: "qwen/qwen3-coder-plus:free", name: "Qwen 3 Coder Plus" },
    { provider: "xkiro", model: "mistralai/codestral-2508", name: "Mistral Codestral" }
  ],
  "deepseek/deepseek-v4.1-flash:free": [
    { provider: "xkiro", model: "qwen/qwen3.8-max:free", name: "Qwen 3.8 Max Flagship" },
    { provider: "xkiro", model: "mistralai/codestral-2508", name: "Mistral Codestral" }
  ],
  "qwen/qwen3.8-max:free": [
    { provider: "xkiro", model: "qwen/qwen3.5-397b-a17b:free", name: "Qwen 3.5 397B MoE" },
    { provider: "xkiro", model: "mistralai/codestral-2508", name: "Mistral Codestral" }
  ],
  "moonshotai/kimi-k3": [
    { provider: "xkiro", model: "qwen/qwen3.8-max:free", name: "Qwen 3.8 Max Flagship" },
    { provider: "xkiro", model: "mistralai/codestral-2508", name: "Mistral Codestral" }
  ],
  "z-ai/glm-5.3": [
    { provider: "xkiro", model: "qwen/qwen3-coder-plus:free", name: "Qwen 3 Coder Plus" },
    { provider: "xkiro", model: "mistralai/codestral-2508", name: "Mistral Codestral" }
  ],
  "deepseek-ai/DeepSeek-V4-Flash-0731": [
    { provider: "dahl", model: "MiniMaxAI/MiniMax-M2.7", name: "MiniMax M2.7" },
    { provider: "xkiro", model: "qwen/qwen3.8-max:free", name: "Qwen 3.8 Max Flagship" }
  ]
};

const AGENTS = [
  {
    id: "claude-opus-5",
    name: "Claude Opus 5 (Elite)",
    icon: "orchestrator",
    badge: "Frontier Logic",
    model: "claude-opus-5",
    provider: "agentrouter",
    role: "Master Architecture, Deep Refactoring & Clean Logic",
    desc: "Anthropic's top frontier reasoning model on Agent Router. Unrivaled for multi-file refactoring and flawless code.",
    systemPrompt: loadPersona("04-fullstack-engineer.md")
  },
  {
    id: "gpt-6-astra",
    name: "GPT-6 Astra (Elite)",
    icon: "deepseek",
    badge: "Next-Gen AI",
    model: "gpt-6-astra",
    provider: "agentrouter",
    role: "Autonomous Engineering, Microservices & Deep Algorithms",
    desc: "Next-generation reasoning flagship on Agent Router. Solves complex algorithmic challenges and distributed topologies.",
    systemPrompt: loadPersona("01-chief-orchestrator.md")
  },
  {
    id: "deepseek-v4-pro",
    name: "DeepSeek V4 Pro",
    icon: "deepseek",
    badge: "1.6T MoE • xKiro",
    model: "deepseek/deepseek-v4-pro",
    provider: "xkiro",
    role: "1.6T MoE Flagship Architecture & Engineering",
    desc: "1.6 Trillion parameter flagship MoE with 49B activated params. Master of system architecture, distributed engineering, and deep refactoring.",
    systemPrompt: loadPersona("01-chief-orchestrator.md")
  },
  {
    id: "chief-orchestrator",
    name: "Qwen 3.8 Max Lead",
    icon: "orchestrator",
    badge: "1M Context",
    model: "qwen/qwen3.8-max:free",
    provider: "xkiro",
    role: "Task Decomposition & Agent Swarm Router",
    desc: "Alibaba's 1 Million context flagship model. Breaks complex requests into strict modular contracts and oversees swarm execution.",
    systemPrompt: loadPersona("01-chief-orchestrator.md")
  },
  {
    id: "qwen-coder-plus",
    name: "Qwen Coder Specialist",
    icon: "code",
    badge: "Specialized Coder",
    model: "qwen/qwen3-coder-plus:free",
    provider: "xkiro",
    role: "Deep Algorithmic Coding, Complex Refactor & Testing",
    desc: "Specialized coding powerhouse trained specifically on millions of codebases, AST optimizations, and edge-case unit tests.",
    systemPrompt: loadPersona("04-fullstack-engineer.md")
  },
  {
    id: "deepseek-v4-1",
    name: "DeepSeek V4.1 Flash",
    icon: "deepseek",
    badge: "552B MoE • xKiro",
    model: "deepseek/deepseek-v4.1-flash:free",
    provider: "xkiro",
    role: "Next-Gen Causal MoE Architecture & Logic",
    desc: "552B parameter MoE with 8B active params, native multimodal support, and 1M context window.",
    systemPrompt: loadPersona("01-chief-orchestrator.md")
  },
  {
    id: "deepseek-v4",
    name: "DeepSeek V4 (Dahl)",
    icon: "deepseek",
    badge: "100M Tokens",
    model: "deepseek-ai/DeepSeek-V4-Flash-0731",
    provider: "dahl",
    role: "System Architecture, Mathematical Logic & AST Analysis",
    desc: "Official DeepSeek V4 architecture for system design, distributed data structures, and mathematical algorithms.",
    systemPrompt: "You are the DeepSeek V4 Architecture Brain running on Harness Buddy. You deliver elite, concise, highly analytical system architecture designs and programming logic."
  },
  {
    id: "kimi-k3",
    name: "Moonshot Kimi K3",
    icon: "kimi",
    badge: "2.8T MoE • 1M",
    model: "moonshotai/kimi-k3",
    provider: "nvidia",
    role: "Long-Horizon Agentic Coding & Repository Scanning",
    desc: "2.8 Trillion parameter multimodal MoE with hybrid KDA+MLA attention for deep codebase analysis and agentic execution.",
    systemPrompt: loadPersona("01-chief-orchestrator.md")
  },
  {
    id: "glm-5-3",
    name: "Z.ai GLM 5.3",
    icon: "glm",
    badge: "753B MoE",
    model: "z-ai/glm-5.3",
    provider: "nvidia",
    role: "Complex Reasoning, Algorithms & Tool Calling",
    desc: "753B parameter text MoE with DeepSeek-style sparse attention, native FP8 weights, and advanced reasoning.",
    systemPrompt: "You are GLM 5.3, a premier reasoning and software engineering model. Deliver precise, production-grade solutions."
  },
  {
    id: "fullstack-engineer",
    name: "Codestral Fast Coder",
    icon: "code",
    badge: "Sub-Second Speed",
    model: "mistralai/codestral-2508",
    provider: "xkiro",
    role: "Core Backend, REST/GraphQL APIs & Rapid Prototyping",
    desc: "Sub-second 836ms coding engine for rapid backend development, REST endpoints, database schemas, and unit tests.",
    systemPrompt: loadPersona("04-fullstack-engineer.md")
  },
  {
    id: "frontend-designer",
    name: "UI/UX Designer",
    icon: "layout",
    badge: "CSS & UX",
    model: "qwen/qwen3.7-max:free",
    provider: "xkiro",
    role: "Modern Frontend, Design Systems & Interaction Polish",
    desc: "Produces minimalist, accessible, responsive web interfaces, modern typography, and pixel-perfect layouts.",
    systemPrompt: loadPersona("03-frontend-ui-builder.md")
  },
  {
    id: "devops-automator",
    name: "DevOps & CLI Automator",
    icon: "terminal",
    badge: "493ms Speed",
    model: "mistralai/devstral-medium",
    provider: "xkiro",
    role: "Terminal Automation, CI/CD & Git Workflows",
    desc: "Automates command-line workflows, file system management, build pipelines, and Git version control.",
    systemPrompt: loadPersona("02-devops-os-automator.md")
  }
];

// Helper to send JSON
function sendJSON(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

// MIME types for static files
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon'
};

const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // 1. API: List Agents Fleet
  if (pathname === '/api/fleet' && req.method === 'GET') {
    return sendJSON(res, 200, {
      success: true,
      agents: AGENTS.map(({ systemPrompt, ...rest }) => rest),
      keysConfigured: {
        xkiro: !!XKIRO_API_KEY,
        dahl: !!DAHL_API_KEY,
        nvidia: !!NVIDIA_API_KEY,
        agentrouter: !!AGENTROUTER_API_KEY
      }
    });
  }

  // 2. API: Live Health Check
  if (pathname === '/api/health' && req.method === 'GET') {
    return sendJSON(res, 200, {
      status: "online",
      port: PORT,
      agentsCount: AGENTS.length,
      keysStatus: {
        xkiro: !!XKIRO_API_KEY,
        dahl: !!DAHL_API_KEY,
        nvidia: !!NVIDIA_API_KEY,
        agentrouter: !!AGENTROUTER_API_KEY
      },
      time: new Date().toISOString()
    });
  }

  // 3. API: Workspace File Explorer & Folder Connection
  if (pathname === '/api/workspace' && req.method === 'GET') {
    const customDir = parsedUrl.searchParams.get('dir');
    if (customDir && fs.existsSync(customDir)) {
      activeWorkspace = path.resolve(customDir);
    }
    try {
      const items = fs.readdirSync(activeWorkspace, { withFileTypes: true });
      const files = items
        .filter(i => !i.name.startsWith('.') && i.name !== 'node_modules' && i.name !== '__pycache__')
        .map(i => ({
          name: i.name,
          isDir: i.isDirectory()
        }));
      return sendJSON(res, 200, { success: true, root: activeWorkspace, files });
    } catch(e) {
      return sendJSON(res, 500, { error: e.message });
    }
  }

  // 3b. API: Switch Connected Project Workspace
  if (pathname === '/api/workspace/set' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { dir } = JSON.parse(body || '{}');
        if (dir && fs.existsSync(dir)) {
          activeWorkspace = path.resolve(dir);
          return sendJSON(res, 200, { success: true, root: activeWorkspace });
        }
        return sendJSON(res, 400, { error: `Directory "${dir}" does not exist on disk.` });
      } catch(e) {
        return sendJSON(res, 500, { error: e.message });
      }
    });
    return;
  }

  // 3c. API: Read File Content from Connected Workspace
  if (pathname === '/api/workspace/file' && req.method === 'GET') {
    const relFile = parsedUrl.searchParams.get('file');
    if (!relFile) return sendJSON(res, 400, { error: "Filename required" });
    const fullPath = path.join(activeWorkspace, relFile);
    try {
      if (!fs.existsSync(fullPath)) return sendJSON(res, 404, { error: "File not found" });
      const stat = fs.statSync(fullPath);
      if (stat.size > 150000) return sendJSON(res, 400, { error: "File too large to preview (>150KB)" });
      const content = fs.readFileSync(fullPath, 'utf8');
      return sendJSON(res, 200, { success: true, file: relFile, content });
    } catch(e) {
      return sendJSON(res, 500, { error: e.message });
    }
  }

  // 4. API: Multi-Agent Chat Execution
  if (pathname === '/api/chat' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { agentId, messages } = JSON.parse(body || '{}');
        const agent = AGENTS.find(a => a.id === agentId) || AGENTS[0];

        let endpoint = `${XKIRO_BASE_URL}/chat/completions`;
        let apiKey = XKIRO_API_KEY;

        if (agent.provider === 'dahl') {
          endpoint = `${DAHL_BASE_URL}/chat/completions`;
          apiKey = DAHL_API_KEY;
        } else if (agent.provider === 'nvidia') {
          endpoint = `${NVIDIA_BASE_URL}/chat/completions`;
          apiKey = NVIDIA_API_KEY;
        } else if (agent.provider === 'agentrouter') {
          endpoint = `${AGENTROUTER_BASE_URL}/chat/completions`;
          apiKey = AGENTROUTER_API_KEY;
        }

        if (!apiKey) {
          return sendJSON(res, 400, {
            error: `API key for provider '${agent.provider}' is not set in .env file. Please add it to start chatting with ${agent.name}.`
          });
        }

        // Build workspace context injection
        let workspaceContext = "";
        try {
          if (fs.existsSync(activeWorkspace)) {
            const wItems = fs.readdirSync(activeWorkspace, { withFileTypes: true });
            const wFiles = wItems
              .filter(i => !i.name.startsWith('.') && i.name !== 'node_modules' && i.name !== '__pycache__')
              .map(i => i.isDirectory() ? `${i.name}/` : i.name);
            workspaceContext = `\n\n[CONNECTED PROJECT WORKSPACE]:
Directory: ${activeWorkspace}
Files & Folders: ${wFiles.slice(0, 40).join(', ')}
You are directly connected to this project directory. Tailor all architectural decisions, dependencies, and code modifications precisely to this codebase.`;
          }
        } catch(e) {}

        // Build messages payload with persona & Ponytail standards & workspace context
        const formattedMessages = [];
        const personaText = agent.systemPrompt || `You are ${agent.name} (${agent.role}).`;
        formattedMessages.push({
          role: "system",
          content: `${personaText}\n\n${PONYTAIL_SENIOR_STANDARDS}${workspaceContext}\n\nYou are ${agent.name} (${agent.role}). Deliver elite, deeply capable, mathematically sound and clean solutions in Hindi, Hinglish, or English as requested.`
        });
        
        if (Array.isArray(messages)) {
          formattedMessages.push(...messages);
        }

        // Helper to query model endpoint
        async function queryEndpoint(prov, mdl) {
          let ep = `${XKIRO_BASE_URL}/chat/completions`;
          let k = XKIRO_API_KEY;
          const customHeaders = {
            "Content-Type": "application/json"
          };

          if (prov === 'dahl') {
            ep = `${DAHL_BASE_URL}/chat/completions`;
            k = DAHL_API_KEY;
          } else if (prov === 'nvidia') {
            ep = `${NVIDIA_BASE_URL}/chat/completions`;
            k = NVIDIA_API_KEY;
          } else if (prov === 'agentrouter') {
            ep = `${AGENTROUTER_BASE_URL}/chat/completions`;
            k = AGENTROUTER_API_KEY;
            customHeaders["User-Agent"] = "RooCode/0.15.0";
          }

          if (!k) return { ok: false, status: 400, error: `Key missing for provider: ${prov}` };
          customHeaders["Authorization"] = `Bearer ${k}`;

          try {
            const resp = await fetch(ep, {
              method: "POST",
              headers: customHeaders,
              body: JSON.stringify({
                model: mdl,
                messages: formattedMessages,
                temperature: 0.25,
                max_tokens: 3200
              })
            });
            const d = await resp.json().catch(() => ({}));
            if (resp.ok && d.choices?.[0]?.message?.content) {
              return { ok: true, content: d.choices[0].message.content, model: mdl };
            }
            return { ok: false, status: resp.status, error: d.error?.message || `Status ${resp.status}` };
          } catch(err) {
            return { ok: false, status: 500, error: err.message };
          }
        }

        // 1. Try Primary Model
        let result = await queryEndpoint(agent.provider, agent.model);
        let executedModel = agent.model;
        let failoverNotice = null;

        // 2. Intelligent Auto-Fallback Loop
        if (!result.ok) {
          const fallbacks = FALLBACK_CHAINS[agent.model] || [
            { provider: "xkiro", model: "qwen/qwen3.8-max:free", name: "Qwen 3.8 Max" },
            { provider: "xkiro", model: "qwen/qwen3-coder-plus:free", name: "Qwen 3 Coder Plus" }
          ];

          for (const fb of fallbacks) {
            console.log(`[FAILOVER] Primary model '${agent.model}' failed (${result.error}). Trying fallback '${fb.model}'...`);
            const fbResult = await queryEndpoint(fb.provider, fb.model);
            if (fbResult.ok) {
              result = fbResult;
              executedModel = fb.model;
              failoverNotice = `Auto-routed to ${fb.name} (${fb.model}) for zero-downtime execution.`;
              break;
            }
          }
        }

        if (!result.ok) {
          return sendJSON(res, result.status || 500, {
            error: `All execution chains failed: ${result.error}`
          });
        }

        return sendJSON(res, 200, {
          success: true,
          agentId: agent.id,
          agentName: agent.name,
          model: executedModel,
          requestedModel: agent.model,
          failoverNotice,
          reply: result.content
        });
      } catch (err) {
        return sendJSON(res, 500, { error: err.message });
      }
    });
    return;
  }

  // 5. Static File Serving
  let filePath = path.join(__dirname, 'public', pathname === '/' ? 'index.html' : pathname);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(__dirname, 'public', 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  try {
    const content = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  } catch(e) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end("404 Not Found");
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log("======================================================================");
  console.log(`🚀 HARNESS BUDDY: MASTER AI AGENT STUDIO`);
  console.log(`📡 Studio Live at: http://127.0.0.1:${PORT}`);
  console.log(`🛡️ 7/7 Agent Personas Ready to Chat & Execute`);
  console.log("======================================================================");
});

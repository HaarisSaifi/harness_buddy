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

const PORT = parseInt(process.env.PORT || "3080", 10);

// Load agent personas from ../agents/
function loadPersona(fileName) {
  const p = path.join(__dirname, '..', 'agents', fileName);
  if (fs.existsSync(p)) {
    return fs.readFileSync(p, 'utf8');
  }
  return "";
}

const AGENTS = [
  {
    id: "chief-orchestrator",
    name: "Chief Master Orchestrator",
    emoji: "🕸️",
    badge: "1.6T / 1M Brain",
    model: "qwen/qwen3.8-max:free",
    provider: "xkiro",
    role: "Master Task Planner, Topology Architect & Swarm Coordinator",
    desc: "Breaks complex problems into step-by-step engineering plans, assigns tasks to sub-agents, and verifies output quality.",
    systemPrompt: loadPersona("01-chief-orchestrator.md")
  },
  {
    id: "deepseek-v4",
    name: "Real DeepSeek V4 Brain",
    emoji: "⚡",
    badge: "Official DeepSeek",
    model: "deepseek-ai/DeepSeek-V4-Flash-0731",
    provider: "dahl",
    role: "Deep Mathematical Reasoning, System Architecture & Code Indexing",
    desc: "100 Million Free Tokens on Dahl Global. Ultra-fast inference for architecture design, algorithms, and logic evaluation.",
    systemPrompt: "You are the official DeepSeek V4 Brain running on Harness Buddy. You deliver elite, concise, highly analytical system architecture designs and programming logic."
  },
  {
    id: "fullstack-engineer",
    name: "Full-Stack Software Engineer",
    emoji: "💻",
    badge: "Core Logic & APIs",
    model: "mistralai/codestral-2508",
    provider: "xkiro",
    role: "Backend Architect, Compilers, Database & Algorithms",
    desc: "Master of robust backend systems, REST/GraphQL APIs, distributed state, compilers, and complex refactoring.",
    systemPrompt: loadPersona("04-fullstack-engineer.md")
  },
  {
    id: "codebase-onboarder",
    name: "Codebase Onboarder & Vision",
    emoji: "👁️",
    badge: "1M Multimodal Vision",
    model: "minimax/minimax-m3:free",
    provider: "xkiro",
    role: "UI Image-to-Code, Wireframes & Giant Repository Scanning",
    desc: "Can ingest 300+ file codebases in a single 1M context window and convert UI screenshots directly into clean code.",
    systemPrompt: loadPersona("05-codebase-onboarder.md")
  },
  {
    id: "frontend-designer",
    name: "Frontend UI/UX Designer",
    emoji: "🎨",
    badge: "Modern CSS & UX",
    model: "qwen/qwen3.7-max:free",
    provider: "xkiro",
    role: "World-Class Web Interfaces, Glassmorphism & Micro-Animations",
    desc: "Produces breathtaking responsive layouts, Tailwind/CSS variables, dark modes, and dynamic user interfaces.",
    systemPrompt: loadPersona("03-frontend-ui-builder.md")
  },
  {
    id: "code-specialist",
    name: "Dedicated Code Specialist",
    emoji: "🔧",
    badge: "Bug Fix & Tests",
    model: "qwen/qwen3-coder-plus:free",
    provider: "xkiro",
    role: "Pinpoint Bug Fixing, Unit Test Suites (Vitest/Jest) & Performance",
    desc: "Targeted code repair, algorithm optimization, and automated test coverage generator.",
    systemPrompt: "You are the Dedicated Code Specialist. You specialize in pinpoint bug fixing, edge-case analysis, and writing comprehensive unit tests (Vitest/Jest/PyTest)."
  },
  {
    id: "devops-automator",
    name: "DevOps & OS Automator",
    emoji: "⚙️",
    badge: "Terminal & Git",
    model: "mistralai/devstral-medium",
    provider: "xkiro",
    role: "PowerShell Automation, Git Workflow & CI/CD Pipelines",
    desc: "Handles system commands, automation scripts, branch management, and workspace pipeline automation.",
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
        dahl: !!DAHL_API_KEY
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
        dahl: !!DAHL_API_KEY
      },
      time: new Date().toISOString()
    });
  }

  // 3. API: Workspace File Explorer
  if (pathname === '/api/workspace' && req.method === 'GET') {
    const rootDir = path.join(__dirname, '..');
    try {
      const items = fs.readdirSync(rootDir, { withFileTypes: true });
      const files = items
        .filter(i => !i.name.startsWith('.') && i.name !== 'node_modules')
        .map(i => ({
          name: i.name,
          isDir: i.isDirectory()
        }));
      return sendJSON(res, 200, { success: true, root: rootDir, files });
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
        }

        if (!apiKey) {
          return sendJSON(res, 400, {
            error: `API key for provider '${agent.provider}' is not set in .env file. Please add it to start chatting with ${agent.name}.`
          });
        }

        // Build messages payload with persona
        const formattedMessages = [];
        if (agent.systemPrompt) {
          formattedMessages.push({
            role: "system",
            content: `${agent.systemPrompt}\n\nYou are ${agent.name} (${agent.role}). Respond with helpful, deeply capable, concise and structured answers in Hindi, Hinglish, or English as preferred by the user.`
          });
        }
        if (Array.isArray(messages)) {
          formattedMessages.push(...messages);
        }

        const aiResponse = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: agent.model,
            messages: formattedMessages,
            temperature: 0.3,
            max_tokens: 3000
          })
        });

        const data = await aiResponse.json();
        if (!aiResponse.ok) {
          return sendJSON(res, aiResponse.status, {
            error: data.error?.message || `Gateway returned status ${aiResponse.status}`
          });
        }

        const reply = data.choices?.[0]?.message?.content || "No response generated.";
        return sendJSON(res, 200, {
          success: true,
          agentId: agent.id,
          agentName: agent.name,
          model: agent.model,
          reply
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

# 🚀 Harness Buddy (Super OS Engine)
> **Autonomous Multi-Agent Coding Swarm & Workspace Time-Machine**  
> *Powered by DeepSeek V4, Qwen 3.8 Max (1M), Mistral Codestral, MiniMax M3 Vision, OpenCode & ShadowVault.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20.0.0-green.svg)](https://nodejs.org/)
[![Context Window](https://img.shields.io/badge/Context%20Window-1%20Million%20Tokens-purple.svg)]()
[![Free Tier Ready](https://img.shields.io/badge/API-100%25%20Free%20Tier%20Ready-success.svg)]()

---

## 🌟 Overview

**Harness Buddy** transforms your local workspace into a high-performance, autonomous software engineering agency. By combining **7 specialized agent personas**, **150+ domain agency swarms**, **interactive terminal coding (OpenCode)**, and an **autonomous workspace time-machine (ShadowVault)**, Harness Buddy lets you design, build, refactor, and self-heal complex codebases without breaking a sweat.

---

## 👥 The 7 Core Agent Roles (Who Does What?)

Harness Buddy uses a strict **least-privilege, role-specialized swarm architecture**. Instead of asking a single generalist model to do everything, tasks are routed to the brain that excels at that specific domain:

| # | Agent Persona | Model / Brain | Context | Primary Role & Responsibilities |
|---|---|---|---|---|
| **01** | **Chief Master Orchestrator** | `qwen/qwen3.8-max:free` | **1M Tokens** | **Task Decomposition & Swarm Router:** Breaks down high-level user requests into actionable contracts, enforces inter-agent pipelines, and evaluates output quality before presenting it to you. |
| **02** | **Real DeepSeek V4 Brain** | `deepseek-ai/DeepSeek-V4-Flash-0731` | **128K Tokens** | **Architecture & System Analysis:** Official DeepSeek V4 architecture with 100M free tokens via Dahl Global. Delivers lightning-fast system design and mathematical logic. |
| **03** | **Full-Stack Software Engineer** | `mistralai/codestral-2508` | **256K Tokens** | **Core Backend & Complex Logic:** Specialized in database schemas, REST/GraphQL APIs, distributed logic, state machines, and high-performance algorithms. |
| **04** | **Codebase Onboarder & Vision** | `minimax/minimax-m3:free` | **1M Tokens** | **Multimodal Vision & Giant Repos:** Analyzes screenshots, wireframes, and design mockups to produce production code. Scans 300+ file repositories in a single prompt. |
| **05** | **Frontend UI/UX Designer** | `qwen/qwen3.7-max:free` | **1M Tokens** | **Modern UI, CSS & Glassmorphism:** Crafts stunning, responsive web frontends, micro-animations, Tailwind/vanilla CSS layouts, and polished UX. |
| **06** | **Dedicated Code Specialist** | `qwen/qwen3-coder-plus:free` | **1M Tokens** | **Deep Bug Fixing & Unit Testing:** Focuses on pinpoint refactoring, edge cases, Jest/Vitest unit test suites, and eliminating technical debt. |
| **07** | **DevOps & OS Automator** | `mistralai/devstral-medium` | **256K Tokens** | **Terminal, PowerShell & Git:** Automates command-line workflows, file system management, build scripts, CI/CD setups, and Git version control. |

---

## 🏢 150+ Agency Domain Swarms (`agency-agents/`)

Beyond coding, Harness Buddy includes over **150 pre-configured, production-grade agent prompts** located in the [`agency-agents/`](agency-agents/) directory:

- 📊 **Finance & Accounting:** Financial analysis, risk assessment, valuation models.
- 🎯 **Marketing & Growth:** SEO strategy, programmatic landing pages, ad copywriting.
- 🔒 **Security & Penetration Testing:** Dependency audits, OWASP top 10 auditing, secret detection.
- 🎮 **Game Development:** Physics scripting, game mechanics, level design.
- 🗺️ **GIS & Spatial Computing:** Geospatial data processing, coordinate systems.
- 🧪 **QA & Test Engineering:** End-to-end test pipelines, stress test generators.

---

## 🛡️ ShadowVault: Autonomous Workspace Time-Machine

Located in [`shadow-vault/`](shadow-vault/), **ShadowVault** runs a silent, continuous file snapshot engine in the background:
- 🕒 **Forensic Timeline:** Tracks every single file addition, modification, and deletion across your watched directories.
- ♻️ **1-Click File Recovery:** Accidental `rm -rf` or git hard reset? ShadowVault restores deleted files instantly.
- 🧠 **AI Code Healer:** Recovers truncated or broken code fragments and uses AST-level AI reasoning (`repairCorruptedCode`) to reconstruct clean syntax.
- 🖥️ **Live Web Dashboard:** Visit `http://localhost:4567` to monitor changes visually.

---

## ⚡ 1-Click Quickstart Guide

### 1. Prerequisites
- **[Node.js](https://nodejs.org/)** (v20.x or higher)
- **Git**

### 2. Clone the Repository
```bash
git clone --recurse-submodules https://github.com/HaarisSaifi/harness_buddy.git
cd harness_buddy
```

### 3. Setup Your API Keys (Zero-Cost / 100% Free Tier)
1. Copy the example environment file:
   ```bash
   # Windows Command Prompt:
   copy .env.example .env

   # Linux / macOS / Git Bash:
   cp .env.example .env
   ```
2. Open `.env` and paste your free API keys:
   - **`XKIRO_API_KEY`**: Get your free key from [xKiro AI Platform](https://api.xkiro.com). (Powers Qwen 3.8 Max, Codestral, MiniMax M3 Vision).
   - **`DAHL_API_KEY`**: Get **100 Million Free Tokens** from [Dahl Global](https://inference.dahl.global). (Powers official DeepSeek V4).

### 4. Verify Live Health
Run the automated fleet health check:
```bash
node test-connection.mjs
```
You should see all 7/7 agents report `✅ [READY]`.

---

## 🎯 How to Launch

| Method | Command / Action | Description |
|---|---|---|
| **1-Click OpenCode Terminal** | Double-click `start-opencode.bat` (or run `opencode`) | Interactive terminal AI coding interface. Type natural language prompts to build features, inspect files, or refactor code. |
| **ShadowVault Dashboard** | Double-click `start-shadow-vault.bat` | Launches continuous file watcher and opens forensic dashboard at `http://localhost:4567`. |
| **DeepSeek Web Control Center** | Double-click `start-dsh-web.bat` | Starts official DeepSeek Web UI server at `http://127.0.0.1:3080`. |

---

## 🔑 How to Use Your Own Custom Models & Providers

You are **not locked into any provider**. You can use OpenAI, OpenRouter, Anthropic, Groq, or local Ollama:

### 1. Changing Models via `.env`
Simply edit `.env`:
```env
# Point to OpenRouter, OpenAI, or local vLLM/Ollama
XKIRO_BASE_URL=https://openrouter.ai/api/v1
XKIRO_API_KEY=sk-or-v1-your-key-here

DEFAULT_MODEL=anthropic/claude-3.7-sonnet
CODER_MODEL=deepseek/deepseek-coder
```

### 2. Terminal Model Switching in OpenCode
In [`opencode.json`](opencode.json), multiple model aliases are pre-configured:
```bash
# Switch to Codestral for heavy logic:
opencode run -m xkiro/codestral "Refactor authentication middleware"

# Switch to Qwen 3.8 Max for 1M context:
opencode run -m xkiro/qwen3.8-max "Analyze entire codebase"

# Switch to official DeepSeek V4:
opencode run -m dahl/deepseek-v4 "Design microservice architecture"
```

---

## 💡 Practical Workflows & Superchargers

1. **The "Night Swarm" (Autonomous Overnight Coder):**
   - Provide OpenCode a high-level task: *"Scan this repository, implement 3 new features, generate full unit tests with Vitest, and fix all lint errors."*
   - Let the agent pipeline execute autonomously while you sleep.
2. **Screenshot-to-Code Pipeline:**
   - Drop a screenshot into your project folder.
   - Use MiniMax M3 + Qwen 3.7 Designer: *"Inspect screenshot.png and convert it into responsive, accessible HTML and Tailwind CSS."*
3. **Safety Net Self-Healing:**
   - Keep ShadowVault running in the background. If any agent or command breaks code or deletes files, recover instantly via `http://localhost:4567`.

---

## 📁 Repository Structure

```
harness_buddy/
├── agents/                      # Curated 7-agent specialized personas
│   ├── 01-chief-orchestrator.md
│   ├── 02-devops-os-automator.md
│   ├── 03-frontend-ui-builder.md
│   ├── 04-fullstack-engineer.md
│   ├── 05-codebase-onboarder.md
│   └── 06-git-manager.md
│
├── agency-agents/               # 150+ Full catalog of domain agent swarms
├── shadow-vault/                # Workspace time-machine & AST AI recovery daemon
│   ├── core/                   # Vault store, watcher, forensic carver & reasoner
│   └── public/                 # Real-time web forensic dashboard
│
├── dsh-engine/                  # DeepSeek Harness official agent microkernel
├── models.config.json           # Unified role and model architecture config
├── opencode.json                # OpenCode multi-model provider configuration
├── test-connection.mjs          # 1-Click live fleet health verification script
├── start-opencode.bat           # 1-Click launcher for OpenCode terminal
├── start-shadow-vault.bat       # 1-Click launcher for ShadowVault time-machine
├── start-dsh-web.bat            # 1-Click launcher for DeepSeek Web Control Center
├── .env.example                 # Clean environment template (No keys committed)
├── LICENSE                      # MIT License
└── README.md                    # Master Documentation
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).  
Copyright (c) 2026 Haaris Saifi.

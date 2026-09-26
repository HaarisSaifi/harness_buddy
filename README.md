# 🚀 Harness Buddy (Super OS Engine)
> **Autonomous Multi-Agent Coding Swarm, Frontier Model Hub & Workspace Time-Machine**  
> *Powered by Claude Opus 5, GPT-6 Astra, DeepSeek V4, Qwen 3.8 Max (1M), Kimi K3 (2.8T), GLM 5.3 (753B), Codestral, OpenCode & ShadowVault.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20.0.0-green.svg)](https://nodejs.org/)
[![Context Window](https://img.shields.io/badge/Context%20Window-1%20Million%20Tokens-purple.svg)]()
[![Zero-Downtime Fallback](https://img.shields.io/badge/Engine-Zero--Downtime%20Failover-success.svg)]()
[![Free Tier Ready](https://img.shields.io/badge/API-100%25%20Free%20Tier%20Ready-emerald.svg)]()

---

## 🌟 Overview

**Harness Buddy** transforms your local workspace into a high-performance, autonomous software engineering agency. By combining **12 specialized agent personas**, **150+ domain agency swarms**, an **intelligent zero-downtime failover engine**, **interactive terminal coding (OpenCode)**, and an **autonomous workspace time-machine (ShadowVault)**, Harness Buddy lets you design, build, refactor, and self-heal complex codebases without breaking a sweat.

---

## 👥 The 12 Agent Brain Fleet (Who Does What?)

Harness Buddy uses a strict **least-privilege, role-specialized swarm architecture**. Tasks are routed to the model and persona that excels at that specific domain:

| # | Agent Persona | Model / Brain | Provider | Context | Primary Domain & Superpower |
|---|---|---|---|---|---|
| **01** | **Claude Opus 5 (Elite)** | `claude-opus-5` | **Agent Router** | **1M Tokens** | **Master Architecture & Human-Level Refactoring:** Unrivaled frontier reasoning for complex multi-file refactoring, abstract data types, and defensive design. |
| **02** | **GPT-6 Astra (Elite)** | `gpt-6-astra` | **Agent Router** | **1M Tokens** | **Next-Gen Autonomous Reasoning:** Distributed systems topology, high-throughput microservices, and mathematical logic. |
| **03** | **DeepSeek V4 Pro** | `deepseek/deepseek-v4-pro` | **xKiro** | **1M Tokens** | **1.6T MoE Flagship Architecture:** 49B activated parameters for deep codebase indexing and distributed engineering. |
| **04** | **Qwen 3.8 Max Lead** | `qwen/qwen3.8-max:free` | **xKiro** | **1M Tokens** | **Task Decomposition & Swarm Router:** Breaks down complex user requirements into modular contracts and orchestrates the agent swarm. |
| **05** | **Qwen Coder Specialist** | `qwen/qwen3-coder-plus:free` | **xKiro** | **1M Tokens** | **Deep Algorithmic Coding & Unit Tests:** AST-level optimizations, edge-case unit testing, and eliminating technical debt. |
| **06** | **DeepSeek V4.1 Flash** | `deepseek/deepseek-v4.1-flash:free` | **xKiro** | **1M Tokens** | **552B Next-Gen MoE Architecture:** Fast causal MoE with native multimodal logic and 8B active parameters. |
| **07** | **DeepSeek V4 (Official)** | `deepseek-ai/DeepSeek-V4-Flash-0731` | **Dahl Global** | **128K Tokens** | **Official DeepSeek V4 Engine:** 100 Million free tokens for rapid mathematical logic and architectural design. |
| **08** | **Moonshot Kimi K3** | `moonshotai/kimi-k3` | **NVIDIA NIM** | **1M Tokens** | **2.8T MoE Agentic Brain:** Hybrid KDA+MLA attention for long-horizon agentic execution and whole-repo scanning. |
| **09** | **Z.ai GLM 5.3** | `z-ai/glm-5.3` | **NVIDIA NIM** | **1M Tokens** | **753B Heavy Logic & Reasoning:** DeepSeek-style sparse attention, native FP8 weights, and advanced tool calling. |
| **10** | **Codestral Fast Coder** | `mistralai/codestral-2508` | **xKiro** | **256K Tokens** | **Sub-Second Core Backend:** Sub-second response engine for REST/GraphQL APIs, schemas, and rapid prototyping. |
| **11** | **UI/UX Designer** | `qwen/qwen3.7-max:free` | **xKiro** | **1M Tokens** | **Modern Frontend & Design Systems:** Minimalist CSS, responsive web components, and pixel-perfect layouts. |
| **12** | **DevOps & CLI Automator** | `mistralai/devstral-medium` | **xKiro** | **256K Tokens** | **Terminal, PowerShell & Git Workflows:** Automates terminal scripts, CI/CD pipelines, and Git version control. |

---

## 🛡️ Zero-Downtime Intelligent Fallback Engine

Never worry about rate-limits, quota errors, or provider outages again. Harness Buddy includes a built-in **Intelligent Auto-Fallback Engine**:
- If a primary model (`claude-opus-5`, `gpt-6-astra`, `deepseek-v4-pro`) encounters a temporary rate limit or quota issue, the request is **instantly and transparently routed** to `Qwen 3.8 Max Flagship (1M Context)` or `Codestral`.
- Zero crashed chats. Zero broken terminals. 100% uptime guaranteed.

---

## 🔑 Where & How to Get API Keys (Free & High-Tier)

You do **NOT** need to pay thousands of dollars for frontier AI models. Follow these official sources:

### 1. 🌐 Agent Router (Frontier Tier: Claude Opus 5 & GPT-6 Astra)
Access top-tier frontier models through Agent Router's aggregated infrastructure:
- **Sign Up Link**: [Agent Router Platform](https://agentrouter.org) *(Use referral invitation for free credits and high-tier model access)*
- **Models Available**: `claude-opus-5`, `gpt-6-astra`, `deepseek-v4-flash`, `claude-3-7-sonnet`.
- **Setup**: In your Agent Router Console -> **Tokens**, create an API key, set Quota to **Unlimited**, and select **All Models**.
- Put in `.env`:
  ```env
  AGENTROUTER_API_KEY=your_agentrouter_key
  AGENTROUTER_BASE_URL=https://agentrouter.org/v1
  ```

### 2. ⚡ xKiro AI Platform (Free Tier: 1M Context Flagships)
- **Get Free Key**: [xKiro Developer Portal](https://api.xkiro.com)
- **Models Available**: `qwen/qwen3.8-max:free` (1M Context), `mistralai/codestral-2508`, `minimax/minimax-m3:free`, `qwen/qwen3-coder-plus:free`.
- Put in `.env`:
  ```env
  XKIRO_API_KEY=your_xkiro_key
  XKIRO_BASE_URL=https://api.xkiro.com/v1
  ```

### 3. 🧠 Dahl Global (100 Million Free Tokens for DeepSeek V4)
- **Get Free Key**: [Dahl Global Inference](https://inference.dahl.global)
- **Benefit**: 100 Million free tokens for official DeepSeek V4 architecture.
- Put in `.env`:
  ```env
  DAHL_API_KEY=your_dahl_key
  DAHL_BASE_URL=https://inference.dahl.global/v1
  ```

### 4. 🚀 NVIDIA NIM Cloud (Free Enterprise MoE Endpoints)
- **Get Free Key**: [NVIDIA NIM Developer](https://build.nvidia.com)
- **Models Available**: `moonshotai/kimi-k3` (2.8T MoE), `z-ai/glm-5.3` (753B MoE).
- Put in `.env`:
  ```env
  NVIDIA_API_KEY=your_nvidia_api_key
  NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
  ```

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

### 3. Setup Your Environment
```bash
# Windows:
copy .env.example .env

# Linux / macOS:
cp .env.example .env
```
Open `.env` and paste any of your API keys from the section above.

### 4. Verify Live Fleet Health
```bash
node test-connection.mjs
```

---

## 🎯 Launch Modes

| Mode | Launcher | Description |
|---|---|---|
| **Harness Studio Web UI** | `start-dsh-web.bat` (or `cd dsh-studio && node server.js`) | Ultra-classic ChatGPT-grade web interface at `http://127.0.0.1:3080` with 12 agent personas, Ponytail senior standards, and zero-downtime failover. |
| **Interactive Terminal Coder** | `start-opencode.bat` (or run `opencode`) | Command-line interface with direct filesystem access. Reads code, fixes bugs, runs tests, and refactors local files automatically. |
| **ShadowVault Time-Machine** | `start-shadow-vault.bat` | Background daemon tracking all file modifications with 1-click recovery and AST self-healing at `http://localhost:4567`. |

---

## 📁 Repository Structure

```
harness_buddy/
├── agents/                      # Curated agent specialized personas
├── agency-agents/               # 150+ Full catalog of domain agency swarms
├── dsh-studio/                  # Master AI Agent Studio (Web Dashboard)
│   ├── public/                  # Minimalist glassmorphic dark-mode interface
│   └── server.js                # Core API, multi-agent router & failover engine
├── shadow-vault/                # Workspace time-machine & AST AI recovery daemon
├── dsh-engine/                  # DeepSeek Harness official agent microkernel
├── models.config.json           # Unified role and model architecture config
├── opencode.json                # OpenCode multi-model provider configuration
├── test-connection.mjs          # Live fleet health verification script
├── start-opencode.bat           # 1-Click launcher for OpenCode terminal
├── start-shadow-vault.bat       # 1-Click launcher for ShadowVault time-machine
├── start-dsh-web.bat            # 1-Click launcher for Harness Studio
├── .env.example                 # Clean environment template (No secrets committed)
├── LICENSE                      # MIT License
└── README.md                    # Master Documentation
```

---

## 📄 License

This project is licensed under the **[MIT License](LICENSE)**.  
Copyright (c) 2026 Haaris Saifi. All rights reserved.

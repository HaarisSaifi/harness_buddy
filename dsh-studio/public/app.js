// ==============================================================================
// 🚀 DEEPSEEK HARNESS — ULTRA-CLASSIC DEVELOPER STUDIO FRONTEND
// Precision Vector Icons, Modern Typography, Minimalist & Instant UX
// ==============================================================================

// Vector SVG Icon Definitions (Clean, Sharp, Minimalist)
const ICONS = {
  orchestrator: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
  deepseek: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l8 4.5v9L12 20l-8-4.5v-9L12 2z"/><path d="M12 8v8"/><path d="M8 10l8 4"/><path d="M8 14l8-4"/></svg>`,
  kimi: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>`,
  glm: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="15" x2="23" y2="15"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="15" x2="4" y2="15"/></svg>`,
  code: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  vision: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  layout: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>`,
  wrench: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
  terminal: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`,
  user: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  bot: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>`
};

function getAgentIcon(agent) {
  const key = agent?.icon || '';
  return ICONS[key] || ICONS.bot;
}

let agents = [];
let activeAgent = null;
const conversations = {}; // agentId -> array of { role, content, time }

const dom = {
  sidebar: document.getElementById('sidebar'),
  btnSidebarCollapse: document.getElementById('btn-sidebar-collapse'),
  btnSidebarToggle: document.getElementById('btn-sidebar-toggle'),
  agentsList: document.getElementById('agents-list'),
  fleetStatusText: document.getElementById('fleet-status-text'),
  fleetCountText: document.getElementById('fleet-count-text'),

  headerAgentIcon: document.getElementById('header-agent-icon'),
  activeName: document.getElementById('active-agent-name'),
  activeBadge: document.getElementById('active-agent-badge'),
  activeRole: document.getElementById('active-agent-role'),
  activeModel: document.getElementById('active-agent-model'),
  dockContextTag: document.getElementById('dock-context-tag'),

  scrollContainer: document.getElementById('scroll-container'),
  messagesContainer: document.getElementById('messages-container'),
  welcomeHero: document.getElementById('welcome-hero'),

  chatForm: document.getElementById('chat-form'),
  userInput: document.getElementById('user-input'),
  btnSend: document.getElementById('btn-send'),
  btnClearChat: document.getElementById('btn-clear-chat'),
  activeWorkspaceName: document.getElementById('active-workspace-name'),
  workspaceIndicator: document.getElementById('workspace-indicator')
};

let currentWorkspaceRoot = "";

// 1. Initialize Studio
async function initStudio() {
  try {
    const res = await fetch('/api/fleet');
    const data = await res.json();
    if (data.success && data.agents.length > 0) {
      agents = data.agents;
      dom.fleetCountText.textContent = `${agents.length} Models`;
      renderAgentsList();
      selectAgent(agents[0]);
    }
  } catch (err) {
    console.error("Failed to load agent fleet:", err);
    dom.fleetStatusText.textContent = "Offline";
  }

  // Load Connected Workspace Folder
  try {
    const wsRes = await fetch('/api/workspace');
    const wsData = await wsRes.json();
    if (wsData.success && wsData.root) {
      currentWorkspaceRoot = wsData.root;
      const parts = wsData.root.replace(/\\/g, '/').split('/').filter(Boolean);
      const base = parts[parts.length - 1] || wsData.root;
      if (dom.activeWorkspaceName) {
        dom.activeWorkspaceName.textContent = base;
        dom.workspaceIndicator.title = `Connected Folder: ${wsData.root} (${wsData.files?.length || 0} files). Click to switch project!`;
      }
    }
  } catch(e) {
    console.warn("Failed to load workspace:", e);
  }

  // Workspace Switcher on Click
  if (dom.workspaceIndicator) {
    dom.workspaceIndicator.addEventListener('click', async () => {
      const nextDir = prompt("Enter Absolute Path of Project Folder to Connect:", currentWorkspaceRoot);
      if (nextDir && nextDir.trim() && nextDir.trim() !== currentWorkspaceRoot) {
        try {
          const setRes = await fetch('/api/workspace/set', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dir: nextDir.trim() })
          });
          const setData = await setRes.json();
          if (setData.success) {
            currentWorkspaceRoot = setData.root;
            const parts = setData.root.replace(/\\/g, '/').split('/').filter(Boolean);
            dom.activeWorkspaceName.textContent = parts[parts.length - 1] || setData.root;
            dom.workspaceIndicator.title = `Connected Folder: ${setData.root}`;
            alert(`✅ Successfully connected to: ${setData.root}\nAgents will now reference this project codebase!`);
          } else {
            alert(`❌ Error: ${setData.error}`);
          }
        } catch(err) {
          alert(`❌ Failed to switch directory: ${err.message}`);
        }
      }
    });
  }

  setupEventListeners();
}

// 2. Render Sidebar Navigation Items
function renderAgentsList() {
  dom.agentsList.innerHTML = '';
  agents.forEach(agent => {
    const btn = document.createElement('button');
    btn.className = `agent-nav-item ${activeAgent?.id === agent.id ? 'active' : ''}`;
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-label', `Select ${agent.name}`);

    btn.innerHTML = `
      <div class="agent-nav-icon">
        ${getAgentIcon(agent)}
      </div>
      <div class="agent-nav-details">
        <div class="agent-nav-header">
          <span class="agent-nav-title">${agent.name}</span>
          <span class="agent-nav-badge">${agent.badge || ''}</span>
        </div>
        <div class="agent-nav-role">${agent.role || ''}</div>
      </div>
    `;

    btn.addEventListener('click', () => {
      selectAgent(agent);
      // On mobile, close sidebar after selection
      if (window.innerWidth <= 860) {
        dom.sidebar.classList.remove('open');
      }
    });

    dom.agentsList.appendChild(btn);
  });
}

// 3. Select Active Agent
function selectAgent(agent) {
  if (!agent) return;
  activeAgent = agent;
  renderAgentsList();

  dom.headerAgentIcon.innerHTML = getAgentIcon(agent);
  dom.activeName.textContent = agent.name;
  dom.activeBadge.textContent = agent.badge || '1M Context';
  dom.activeRole.textContent = agent.role;
  dom.activeModel.textContent = agent.model;
  dom.dockContextTag.textContent = `Active: ${agent.name} (${agent.badge || '1M'})`;

  renderMessages();
  dom.userInput.focus();
}

// 4. Render Conversation History
function renderMessages() {
  const history = conversations[activeAgent.id] || [];

  if (history.length === 0) {
    dom.messagesContainer.innerHTML = '';
    dom.messagesContainer.appendChild(dom.welcomeHero);
    return;
  }

  // Remove hero if still in container
  if (dom.welcomeHero.parentNode) {
    dom.welcomeHero.remove();
  }

  dom.messagesContainer.innerHTML = '';
  history.forEach(msg => appendMessageToDOM(msg));
  scrollToBottom();
}

function appendMessageToDOM(msg) {
  const isUser = msg.role === 'user';
  const row = document.createElement('div');
  row.className = `message-row ${isUser ? 'user' : 'ai'}`;

  const avatarContent = isUser ? ICONS.user : getAgentIcon(activeAgent);
  const authorName = isUser ? 'You' : activeAgent.name;
  const time = msg.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  row.innerHTML = `
    <div class="msg-avatar">${avatarContent}</div>
    <div class="msg-body">
      <div class="msg-header">
        <span class="msg-author">${authorName}</span>
        <span class="msg-time">${time}</span>
      </div>
      <div class="msg-bubble">
        <div class="msg-content">${isUser ? escapeHtml(msg.content).replace(/\n/g, '<br>') : formatMarkdown(msg.content)}</div>
      </div>
    </div>
  `;

  // Attach code copy listeners
  row.querySelectorAll('.btn-copy-code').forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.closest('.code-block-wrapper').querySelector('pre code').textContent;
      navigator.clipboard.writeText(code).then(() => {
        const textSpan = btn.querySelector('span');
        const orig = textSpan ? textSpan.textContent : 'Copy';
        if (textSpan) textSpan.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          if (textSpan) textSpan.textContent = orig;
          btn.classList.remove('copied');
        }, 1600);
      });
    });
  });

  dom.messagesContainer.appendChild(row);
}

// 5. Send Message to Backend API
async function sendMessage(text) {
  const cleanText = text.trim();
  if (!cleanText || !activeAgent) return;

  if (!conversations[activeAgent.id]) {
    conversations[activeAgent.id] = [];
  }

  // 1. Add user message
  const userMsg = {
    role: 'user',
    content: cleanText,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
  conversations[activeAgent.id].push(userMsg);

  if (dom.welcomeHero.parentNode) dom.welcomeHero.remove();
  appendMessageToDOM(userMsg);
  scrollToBottom();

  dom.userInput.value = '';
  adjustTextareaHeight();
  dom.btnSend.disabled = true;

  // 2. Add Typing Pulse Indicator
  const typingIndicator = document.createElement('div');
  typingIndicator.className = 'message-row ai';
  typingIndicator.id = 'typing-indicator';
  typingIndicator.innerHTML = `
    <div class="msg-avatar">${getAgentIcon(activeAgent)}</div>
    <div class="msg-body">
      <div class="msg-header">
        <span class="msg-author">${activeAgent.name}</span>
        <span class="msg-time">Generating...</span>
      </div>
      <div class="msg-bubble">
        <div class="typing-bubble">
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
        </div>
      </div>
    </div>
  `;
  dom.messagesContainer.appendChild(typingIndicator);
  scrollToBottom();

  try {
    const payloadMessages = conversations[activeAgent.id].map(m => ({
      role: m.role,
      content: m.content
    }));

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agentId: activeAgent.id,
        messages: payloadMessages
      })
    });

    const data = await res.json();
    typingIndicator.remove();

    if (res.ok && data.success) {
      const aiMsg = {
        role: 'assistant',
        content: data.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      conversations[activeAgent.id].push(aiMsg);
      appendMessageToDOM(aiMsg);
    } else {
      const errorMsg = {
        role: 'assistant',
        content: `**API Gateway Error (${res.status}):**\n\`${data.error || 'The model did not return a response.'}\``,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      appendMessageToDOM(errorMsg);
    }
  } catch (err) {
    typingIndicator.remove();
    const errorMsg = {
      role: 'assistant',
      content: `**Connection Error:**\n\`${err.message}\``,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    appendMessageToDOM(errorMsg);
  } finally {
    updateSendButtonState();
    scrollToBottom();
  }
}

// 6. Fast & Precision Markdown Formatter
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatMarkdown(text) {
  if (!text) return '';

  // 1. Preserve Code Blocks
  const codeBlocks = [];
  let processed = text.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
    const idx = codeBlocks.length;
    codeBlocks.push({ lang: lang || 'code', code: code.trim() });
    return `__CODE_BLOCK_${idx}__`;
  });

  // 2. Escape basic HTML tags in text
  processed = escapeHtml(processed);

  // 3. Tables support
  processed = processed.replace(/((?:^\|.+?\|(?:\r?\n|$))+)/gm, (tableMatch) => {
    const lines = tableMatch.trim().split(/\r?\n/).filter(l => l.trim().startsWith('|'));
    if (lines.length < 2) return tableMatch;

    const isSep = (line) => /^\|(\s*:?-+:?\s*\|)+$/.test(line);
    let sepIdx = -1;
    for (let i = 1; i < lines.length; i++) {
      if (isSep(lines[i])) { sepIdx = i; break; }
    }
    if (sepIdx === -1) return tableMatch;

    const parseRow = (line) => line.split('|').slice(1, -1).map(c => c.trim());
    const headerCols = parseRow(lines[0]);
    const bodyRows = lines.slice(sepIdx + 1).map(parseRow);

    const thead = `<thead><tr>${headerCols.map(c => `<th>${c}</th>`).join('')}</tr></thead>`;
    const tbody = `<tbody>${bodyRows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>`;
    return `<table>${thead}${tbody}</table>`;
  });

  // 4. Headers
  processed = processed
    .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // 5. Bold & Italic
  processed = processed
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');

  // 6. Inline code
  processed = processed.replace(/`([^`]+)`/g, '<code>$1</code>');

  // 7. Lists
  processed = processed.replace(/^\s*[-*]\s+(.*$)/gim, '<li>$1</li>');
  processed = processed.replace(/(<li>.*<\/li>)/gims, '<ul>$1</ul>');
  processed = processed.replace(/<\/ul>\s*<ul>/g, '');

  // 8. Blockquotes
  processed = processed.replace(/^>\s+(.*$)/gim, '<blockquote>$1</blockquote>');

  // 9. Paragraphs
  const paras = processed.split(/\n\s*\n/).map(p => {
    p = p.trim();
    if (!p) return '';
    if (p.startsWith('<h') || p.startsWith('<ul>') || p.startsWith('<table>') || p.startsWith('<blockquote>') || p.startsWith('__CODE_BLOCK_')) {
      return p;
    }
    return `<p>${p.replace(/\n/g, '<br>')}</p>`;
  }).join('\n');

  // 10. Re-insert Code Blocks with IDE Headers & Copy Action
  return paras.replace(/__CODE_BLOCK_(\d+)__/g, (m, idx) => {
    const item = codeBlocks[parseInt(idx, 10)];
    if (!item) return '';
    return `
      <div class="code-block-wrapper">
        <div class="code-header">
          <span class="code-lang">${escapeHtml(item.lang)}</span>
          <button class="btn-copy-code" type="button" aria-label="Copy code">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span>Copy</span>
          </button>
        </div>
        <pre><code>${escapeHtml(item.code)}</code></pre>
      </div>
    `;
  });
}

// 7. Event Listeners & UI Helpers
function setupEventListeners() {
  // Chat form submit
  dom.chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage(dom.userInput.value);
  });

  // Textarea input handling
  dom.userInput.addEventListener('input', () => {
    adjustTextareaHeight();
    updateSendButtonState();
  });

  // Keyboard navigation: Enter sends, Shift+Enter new line, Ctrl+Enter sends
  dom.userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Allow newline
        return;
      }
      e.preventDefault();
      sendMessage(dom.userInput.value);
    }
  });

  // Clear conversation button
  dom.btnClearChat.addEventListener('click', () => {
    if (activeAgent && conversations[activeAgent.id]?.length > 0) {
      conversations[activeAgent.id] = [];
      renderMessages();
    }
  });

  // Prompt suggestion cards
  document.querySelectorAll('.prompt-card').forEach(card => {
    card.addEventListener('click', () => {
      const prompt = card.getAttribute('data-prompt');
      if (prompt) {
        dom.userInput.value = prompt;
        adjustTextareaHeight();
        updateSendButtonState();
        sendMessage(prompt);
      }
    });
  });

  // Sidebar toggles
  if (dom.btnSidebarCollapse) {
    dom.btnSidebarCollapse.addEventListener('click', () => {
      dom.sidebar.classList.toggle('collapsed');
    });
  }

  if (dom.btnSidebarToggle) {
    dom.btnSidebarToggle.addEventListener('click', () => {
      dom.sidebar.classList.toggle('open');
    });
  }
}

function adjustTextareaHeight() {
  dom.userInput.style.height = 'auto';
  dom.userInput.style.height = `${Math.min(dom.userInput.scrollHeight, 200)}px`;
}

function updateSendButtonState() {
  dom.btnSend.disabled = dom.userInput.value.trim().length === 0;
}

function scrollToBottom() {
  dom.scrollContainer.scrollTop = dom.scrollContainer.scrollHeight;
}

// Boot Studio
document.addEventListener('DOMContentLoaded', initStudio);

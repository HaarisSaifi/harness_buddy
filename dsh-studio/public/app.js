// ==============================================================================
// 🚀 HARNESS BUDDY: MASTER AI AGENT STUDIO FRONTEND
// ==============================================================================

let agents = [];
let activeAgent = null;
const conversations = {}; // agentId -> array of { role, content, time }

const dom = {
  agentsList: document.getElementById('agents-list'),
  activeAvatar: document.getElementById('active-agent-avatar'),
  activeName: document.getElementById('active-agent-name'),
  activeBadge: document.getElementById('active-agent-badge'),
  activeRole: document.getElementById('active-agent-role'),
  activeModel: document.getElementById('active-agent-model'),
  messagesContainer: document.getElementById('messages-container'),
  welcomeHero: document.getElementById('welcome-hero'),
  chatForm: document.getElementById('chat-form'),
  userInput: document.getElementById('user-input'),
  btnSend: document.getElementById('btn-send'),
  btnClearChat: document.getElementById('btn-clear-chat')
};

// 1. Initialize Studio
async function initStudio() {
  try {
    const res = await fetch('/api/fleet');
    const data = await res.json();
    if (data.success && data.agents.length > 0) {
      agents = data.agents;
      renderAgentsList();
      selectAgent(agents[0]);
    }
  } catch (err) {
    console.error("Failed to load agent fleet:", err);
  }
}

// 2. Render Sidebar Agent Fleet
function renderAgentsList() {
  dom.agentsList.innerHTML = '';
  agents.forEach(agent => {
    const item = document.createElement('div');
    item.className = `agent-nav-item ${activeAgent?.id === agent.id ? 'active' : ''}`;
    item.innerHTML = `
      <div class="nav-emoji">${agent.emoji}</div>
      <div class="nav-text">
        <div class="nav-title-row">
          <span class="nav-title">${agent.name}</span>
          <span class="nav-badge">${agent.badge}</span>
        </div>
        <div class="nav-role">${agent.role}</div>
      </div>
    `;
    item.addEventListener('click', () => selectAgent(agent));
    dom.agentsList.appendChild(item);
  });
}

// 3. Select Active Agent
function selectAgent(agent) {
  activeAgent = agent;
  renderAgentsList();

  dom.activeAvatar.textContent = agent.emoji;
  dom.activeName.textContent = agent.name;
  dom.activeBadge.textContent = agent.badge;
  dom.activeRole.textContent = agent.role;
  dom.activeModel.textContent = agent.model;

  renderMessages();
}

// 4. Render Conversation Messages
function renderMessages() {
  const history = conversations[activeAgent.id] || [];
  
  if (history.length === 0) {
    dom.messagesContainer.innerHTML = '';
    dom.messagesContainer.appendChild(dom.welcomeHero);
    return;
  }

  // Detach welcome hero if present
  if (dom.welcomeHero.parentNode) {
    dom.welcomeHero.remove();
  }

  dom.messagesContainer.innerHTML = '';
  history.forEach(msg => {
    appendMessageToDOM(msg);
  });
  scrollToBottom();
}

function appendMessageToDOM(msg) {
  const isUser = msg.role === 'user';
  const row = document.createElement('div');
  row.className = `message-row ${isUser ? 'user' : 'ai'}`;

  const avatar = isUser ? '👤' : (activeAgent ? activeAgent.emoji : '🤖');
  const authorName = isUser ? 'You' : (activeAgent ? activeAgent.name : 'AI Agent');

  row.innerHTML = `
    <div class="msg-avatar">${avatar}</div>
    <div class="msg-bubble">
      <div class="msg-header">
        <span class="msg-author">${authorName}</span>
        <span class="msg-time">${msg.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      <div class="msg-content">${formatMarkdown(msg.content)}</div>
    </div>
  `;

  // Attach copy listeners to code blocks inside
  row.querySelectorAll('.btn-copy-code').forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.closest('.code-block-wrapper').querySelector('pre').textContent;
      navigator.clipboard.writeText(code).then(() => {
        const orig = btn.innerHTML;
        btn.innerHTML = '✓ Copied!';
        setTimeout(() => btn.innerHTML = orig, 1800);
      });
    });
  });

  dom.messagesContainer.appendChild(row);
}

// 5. Send Message to AI API
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

  // 2. Add Typing Indicator
  const typingIndicator = document.createElement('div');
  typingIndicator.className = 'message-row ai';
  typingIndicator.id = 'typing-indicator';
  typingIndicator.innerHTML = `
    <div class="msg-avatar">${activeAgent.emoji}</div>
    <div class="msg-bubble typing-bubble">
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
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
        content: `⚠️ **Error:** ${data.error || 'Failed to fetch AI response'}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      appendMessageToDOM(errorMsg);
    }
  } catch (err) {
    typingIndicator.remove();
    const errorMsg = {
      role: 'assistant',
      content: `⚠️ **Connection Error:** ${err.message}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    appendMessageToDOM(errorMsg);
  } finally {
    dom.btnSend.disabled = false;
    scrollToBottom();
  }
}

// 6. Simple Markdown Formatter with Code Syntax Styling
function formatMarkdown(text) {
  if (!text) return '';

  let html = text
    // Escape HTML characters
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Triple backticks code blocks
  html = html.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
    const language = lang || 'code';
    return `
      <div class="code-block-wrapper">
        <div class="code-header">
          <span class="code-lang">${language}</span>
          <button class="btn-copy-code">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            Copy
          </button>
        </div>
        <pre><code>${code.trim()}</code></pre>
      </div>
    `;
  });

  // Inline code `code`
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Bold & Italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Bullet points
  html = html.replace(/^\s*[-*]\s+(.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/gms, '<ul>$1</ul>');

  // Paragraphs
  const paragraphs = html.split(/\n{2,}/).map(p => {
    if (p.startsWith('<div') || p.startsWith('<h') || p.startsWith('<ul')) return p;
    return `<p>${p.replace(/\n/g, '<br>')}</p>`;
  });

  return paragraphs.join('');
}

function scrollToBottom() {
  dom.messagesContainer.scrollTop = dom.messagesContainer.scrollHeight;
}

function adjustTextareaHeight() {
  dom.userInput.style.height = 'auto';
  dom.userInput.style.height = Math.min(dom.userInput.scrollHeight, 150) + 'px';
}

// Event Listeners
dom.chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  sendMessage(dom.userInput.value);
});

dom.userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage(dom.userInput.value);
  }
});

dom.userInput.addEventListener('input', adjustTextareaHeight);

dom.btnClearChat.addEventListener('click', () => {
  if (activeAgent) {
    conversations[activeAgent.id] = [];
    renderMessages();
  }
});

// Prompt Chips Click Handlers
document.querySelectorAll('.prompt-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    const prompt = chip.getAttribute('data-prompt');
    if (prompt) {
      sendMessage(prompt);
    }
  });
});

// Start
initStudio();

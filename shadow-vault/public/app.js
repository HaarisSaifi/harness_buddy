/* =========================================================
   ShadowVault — Frontend Controller v2.0
   No inline handlers. Content-aware preview. Custom dialogs.
   ========================================================= */

// ---- State ----
const state = {
  view: 'deleted',            // 'deleted' | 'timeline'
  selectedWorkspace: null,
  deletedFiles: [],
  events: [],
  workspaces: [],
  searchQuery: '',
  currentModalFile: null,
  lastRestoredPath: null,
  connecting: false,
  scanInFlight: false
};

// ---- Escape HTML for safe innerHTML ----
const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

// ---- SVG icon helpers ----
const ICONS = {
  file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 2v6h6"/></svg>',
  image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>',
  video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M10 9l5 3-5 3V9z"/></svg>',
  code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 9l-4 3 4 3M16 9l4 3-4 3M13 5l-2 14"/></svg>',
  doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>',
  archive: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 9h8M8 13h5"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>'
};

function typeIconFor(ext) {
  const e = (ext || '').toLowerCase().replace('.', '');
  if (['png','jpg','jpeg','webp','gif','svg','bmp','ico'].includes(e)) return ICONS.image;
  if (['mp4','mkv','mov','avi','webm'].includes(e)) return ICONS.video;
  if (['js','mjs','ts','py','html','css','json','bat','sh','ps1','c','cpp','java','rb','go','rs','sql','xml','yml','yaml'].includes(e)) return ICONS.code;
  if (['pdf','doc','docx','txt','md','rtf','odt'].includes(e)) return ICONS.doc;
  if (['zip','rar','7z','tar','gz','iso'].includes(e)) return ICONS.archive;
  return ICONS.file;
}
function tintFor(ext, deleted) {
  if (deleted) return 't-danger';
  const e = (ext || '').toLowerCase().replace('.', '');
  if (['png','jpg','jpeg','gif','svg','bmp','ico','mp4','mkv','mov','avi'].includes(e)) return 't-warn';
  if (['js','mjs','ts','py','html','css','json','bat','md'].includes(e)) return 't-acc';
  if (['pdf','zip','rar','7z','txt','doc','docx'].includes(e)) return 't-ok';
  return 't-acc';
}

const fmtSize = (bytes) => {
  const b = Number(bytes) || 0;
  if (b >= 1024 * 1024 * 1024) return (b / 1024 / 1024 / 1024).toFixed(2) + ' GB';
  if (b >= 1024 * 1024) return (b / 1024 / 1024).toFixed(1) + ' MB';
  if (b >= 1024) return (b / 1024).toFixed(1) + ' KB';
  return b + ' B';
};
const timeAgo = (iso) => {
  if (!iso) return '';
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return Math.floor(s / 60) + 'm ago';
  if (s < 86400) return Math.floor(s / 3600) + 'h ago';
  return Math.floor(s / 86400) + 'd ago';
};

// ---- DOM refs ----
const $ = (id) => document.getElementById(id);
const els = {
  status: $('watcher-status-text'), statusPill: $('status-pill'), connectivity: $('connectivity-text'),
  activeFolder: $('active-folder-label'), feed: $('feed-container'), counter: $('event-counter'),
  feedTitle: $('feed-title'), badgeDeleted: $('badge-deleted-count'), badgeTimeline: $('badge-timeline-count'),
  workspaceList: $('workspace-list'), chips: $('quick-folder-chips'),
  search: $('search-input'), clearSearch: $('btn-clear-search'),
  toast: $('toast'), toastTitle: $('toast-title'),
  dialog: $('dialog'), dialogMsg: $('dialog-message'),
  resultModal: $('result-modal'), resultTitle: $('result-title'), resultBody: $('result-body'),
  previewModal: $('preview-modal'), modalFilename: $('modal-filename'), modalFilepath: $('modal-filepath'), modalBody: $('modal-body'),
  aiChat: $('ai-chat-box'), aiInput: $('ai-prompt-input'),
  foot: $('foot-health')
};

// ---- WebSocket ----
function setupWebSocket() {
  if (els.statusPill._connecting) return;
  const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
  const socket = new WebSocket(`${protocol}//${location.host}`);
  els.statusPill._connecting = true;

  socket.onopen = () => {
    els.statusPill._connecting = false;
    setOnline();
  };
  socket.onmessage = async (event) => {
    try {
      const msg = JSON.parse(event.data);
      if (msg.type === 'FILE_EVENT') {
        state.events.unshift(msg.data);
        if (state.events.length > 300) state.events.pop();
        refreshAll();
      }
    } catch (e) { /* ignore */ }
  };
  socket.onclose = () => {
    els.statusPill._connecting = false;
    setStatus('offline', 'Reconnecting…');
    setTimeout(setupWebSocket, 3000);
  };
  socket.onerror = () => { try { socket.close(); } catch (e) {} };
}

function setStatus(mode, text) {
  els.statusPill.classList.remove('offline', 'idle');
  if (mode === 'offline') els.statusPill.classList.add('offline');
  else if (mode === 'idle') els.statusPill.classList.add('idle');
  els.status.innerText = text;
}
function setOnline() {
  els.statusPill.classList.remove('offline', 'idle');
  els.status.innerText = 'Active protection';
  els.connectivity.innerText = '· live';
}

// ---- Data loading ----
async function loadWorkspaces() {
  try {
    const res = await fetch('/api/workspaces');
    const data = await res.json();
    state.workspaces = data.workspaces || [];
    renderWorkspaces();
    renderChips();
    refreshHealth();
  } catch (e) { showCrudeError('Workspaces load failed'); }
}

async function loadDeleted() {
  const url = state.selectedWorkspace
    ? `/api/deleted-files?workspace=${encodeURIComponent(state.selectedWorkspace)}`
    : '/api/deleted-files';
  try {
    const res = await fetch(url);
    const data = await res.json();
    state.deletedFiles = data.deleted || [];
    els.badgeDeleted.innerText = state.deletedFiles.length;
    if (state.view === 'deleted') renderFeed();
  } catch (e) { els.badgeDeleted.innerText = '0'; }
}

async function loadTimeline() {
  const url = state.selectedWorkspace
    ? `/api/timeline?workspace=${encodeURIComponent(state.selectedWorkspace)}`
    : '/api/timeline';
  try {
    const res = await fetch(url);
    const data = await res.json();
    state.events = data.events || [];
    els.badgeTimeline.innerText = state.events.length;
    if (state.view === 'timeline') renderFeed();
  } catch (e) { els.badgeTimeline.innerText = '0'; }
}

function refreshAll() { loadDeleted(); loadTimeline(); loadWorkspaces(); }

// ---- Rendering: workspaces & chips ----
function renderWorkspaces() {
  els.workspaceList.innerHTML = state.workspaces.length ? '' : '<div class="empty-state"><p style="padding:20px;">No workspaces added yet.</p></div>';
  state.workspaces.forEach(ws => {
    const el = document.createElement('div');
    el.className = 'workspace-item' + (state.selectedWorkspace === ws.path ? ' active' : '') + (ws.deletedCount > 0 ? ' has-deleted' : '');
    const count = ws.deletedCount > 0 ? `${ws.deletedCount} deleted` : `${ws.eventsCount} events`;
    el.innerHTML = `
      <div class="ws-top"><span class="ws-name">${esc(ws.name)}</span><span class="ws-count">${count}</span></div>
      <span class="ws-path" title="${esc(ws.path)}">${esc(ws.path)}</span>`;
    el.onclick = () => selectFolder(ws.path);
    els.workspaceList.appendChild(el);
  });
}

function renderChips() {
  els.chips.innerHTML = '';
  const all = document.createElement('div');
  all.className = 'chip' + (state.selectedWorkspace === null ? ' active' : '');
  all.innerHTML = `<span class="chip-dot"></span><span>All workspaces</span>`;
  all.onclick = () => selectFolder(null);
  els.chips.appendChild(all);

  state.workspaces.forEach(ws => {
    const chip = document.createElement('div');
    chip.className = 'chip' + (state.selectedWorkspace === ws.path ? ' active' : '');
    chip.innerHTML = `
      <span class="chip-dot"></span><span>${esc(ws.name)}</span>
      ${ws.deletedCount > 0 ? `<span class="chip-badge">${ws.deletedCount}</span>` : ''}`;
    chip.onclick = () => selectFolder(ws.path);
    els.chips.appendChild(chip);
  });
}

function selectFolder(path) {
  state.selectedWorkspace = path;
  els.activeFolder.innerText = path ? path.replace(/\\/g, ' / ') : 'All protected workspaces';
  renderWorkspaces(); renderChips();
  loadDeleted(); loadTimeline();
}

// ---- Feed rendering ----
function renderFeed() {
  let list = state.view === 'deleted' ? state.deletedFiles : state.events;
  if (state.view === 'deleted') els.feedTitle.innerText = 'Deleted files';
  else els.feedTitle.innerText = 'History';

  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    list = list.filter(f => (f.relativePath || '').toLowerCase().includes(q) || (f.filePath || '').toLowerCase().includes(q));
  }

  els.counter.innerText = `${list.length} ${state.view === 'deleted' ? 'deleted' : 'snapshot'}${list.length === 1 ? '' : 's'}`;
  els.feed.innerHTML = '';

  if (list.length === 0) {
    els.feed.innerHTML = state.view === 'deleted'
      ? `
        <div class="empty-state">
          <div class="empty-icon">${ICONS.doc}</div>
          <h4>No missing files</h4>
          <p>${state.searchQuery ? 'Koi result nahi mila search ke liye.' : 'Sabhi files safe aur intact hain. Agar kisi file delete hogi, to turant yahan aa jaayegi.'}</p>
        </div>`
      : `
        <div class="empty-state">
          <div class="empty-icon">${ICONS.file}</div>
          <h4>No activity yet</h4>
          <p>Abhi koi file event record nahi hua is scope me.</p>
        </div>`;
    return;
  }

  list.forEach((item) => {
    if (state.view === 'deleted') renderDeletedCard(item);
    else renderEventCard(item);
  });
}

function renderDeletedCard(item) {
  const icon = typeIconFor(item.extension);
  const tint = tintFor(item.extension, true);
  const card = document.createElement('div');
  card.className = 'file-card';
  card.innerHTML = `
    <div class="file-icon ${tint}">${icon}</div>
    <div class="file-body">
      <div class="file-name">${esc(item.relativePath)}</div>
      <div class="file-meta">
        <span class="mono">${esc(item.dir)}</span>
        <span class="tag">·</span>
        <span class="tag" style="color:var(--danger);font-weight:600;">${fmtSize(item.size)}</span>
        <span class="tag">·</span>
        <span class="tag">${timeAgo(item.deletedAt)}</span>
      </div>
    </div>
    <div class="file-actions">
      ${item.hash ? `<button class="btn btn-mini btn-ghost" data-preview-hash="${esc(item.hash)}" data-preview-name="${esc(item.relativePath)}" data-preview-path="${esc(item.filePath)}">Preview</button>` : ''}
      <button class="btn btn-mini btn-rescue" data-restore-path="${esc(item.filePath)}" data-restore-hash="${esc(item.hash || '')}">Restore</button>
    </div>`;
  bindCardActions(card);
  els.feed.appendChild(card);
}

function renderEventCard(item) {
  const icon = typeIconFor(item.extension);
  const tint = tintFor(item.extension, false);
  const card = document.createElement('div');
  card.className = 'file-card';
  const type = item.eventType === 'deleted' ? 'danger' : item.eventType === 'created' ? 'ok' : item.eventType === 'restored' ? 'acc' : 'acc';
  card.innerHTML = `
    <div class="file-icon ${tint}">${icon}</div>
    <div class="file-body">
      <div class="file-name">${esc(item.relativePath)}</div>
      <div class="file-meta">
        <span class="mono">${esc(item.filePath)}</span>
        <span class="tag">·</span>
        <span class="tag" style="color:${type === 'danger' ? 'var(--danger)' : type === 'ok' ? 'var(--ok)' : 'var(--acc)'};font-weight:600;text-transform:capitalize;">${item.eventType}</span>
        <span class="tag">·</span>
        <span class="tag">${fmtSize(item.size)}</span>
        <span class="tag">·</span>
        <span class="tag">${timeAgo(item.timestamp)}</span>
      </div>
    </div>
    <div class="file-actions">
      ${item.hash ? `<button class="btn btn-mini btn-ghost" data-preview-hash="${esc(item.hash)}" data-preview-name="${esc(item.relativePath)}" data-preview-path="${esc(item.filePath)}">Preview</button>` : ''}
      ${item.hash ? `<button class="btn btn-mini btn-rescue" data-restore-path="${esc(item.filePath)}" data-restore-hash="${esc(item.hash)}">Restore</button>` : ''}
    </div>`;
  bindCardActions(card);
  els.feed.appendChild(card);
}

function bindCardActions(card) {
  const pv = card.querySelector('[data-preview-hash]');
  if (pv) pv.onclick = () => previewBlob(pv.dataset.previewHash, pv.dataset.previewName, pv.dataset.previewPath);
  const rt = card.querySelector('[data-restore-path]');
  if (rt) rt.onclick = () => restoreSingle(rt.dataset.restorePath, rt.dataset.restoreHash || null);
}

// ---- Restore single (with custom confirm) ----
async function restoreSingle(filePath, hash) {
  const ok = await confirmDialog(
    'Restore this file?',
    `File ko exact original path par wapas restore karein?\n\n${filePath}`,
    'Restore'
  );
  if (!ok) return;

  try {
    const res = await fetch('/api/restore/file', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filePath, hash })
    });
    const data = await res.json();
    if (data.success) {
      state.lastRestoredPath = filePath;
      showToast('File restored', filePath);
      refreshAll();
    } else {
      showToast('Restore failed', data.error || 'Unknown error', 'error');
    }
  } catch (err) {
    showToast('Restore error', err.message, 'error');
  }
}

// ---- Smart rescue (restore all) ----
const btnRescue = $('btn-quick-rescue');
btnRescue.onclick = async () => {
  const scope = state.selectedWorkspace ? state.selectedWorkspace.replace(/\\/g, ' / ') : 'All protected workspaces';
  const ok = await confirmDialog(
    '1-Click Smart Rescue',
    `Scope: ${scope}\n\nIsse saari missing/deleted files unke exact original path par restore ho jayengi. System un files ko nahi hataayega jo abhi disk par safe hain.`,
    'Start rescue'
  );
  if (!ok) return;

  btnRescue.disabled = true;
  const original = btnRescue.innerHTML;
  btnRescue.innerHTML = '<span class="spinner" style="width:16px;height:16px;border-width:2px;"></span> Restoring…';
  try {
    const res = await fetch('/api/restore-all-deleted', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workspace: state.selectedWorkspace })
    });
    const data = await res.json();
    if (data.success) {
      showResultModal('Rescue complete', buildRescueResults(data.result.details));
      showToast(`Rescued ${data.result.totalRestored} file${data.result.totalRestored === 1 ? '' : 's'}`, scope, data.result.totalRestored ? 'ok' : 'warn');
    } else {
      showToast('Rescue error', data.error || 'Unknown error', 'error');
    }
  } catch (err) {
    showToast('Rescue error', err.message, 'error');
  } finally {
    btnRescue.disabled = false;
    btnRescue.innerHTML = original;
    refreshAll();
  }
};

function buildRescueResults(details) {
  if (!details || !details.length) return '<p style="color:var(--tx-md);">Nothing to restore.</p>';
  const rows = details.map(d => {
    const cls = d.status === 'restored' ? 'ok' : d.status === 'skipped' ? 'skip' : 'err';
    return `<div class="result-row"><span class="r-name" title="${esc(d.filePath)}">${esc(d.filePath)}</span><span class="r-status ${cls}">${d.status || 'error'}</span></div>`;
  }).join('');
  const restored = details.filter(d => d.status === 'restored').length;
  const skipped = details.filter(d => d.status === 'skipped').length;
  const failed = details.filter(d => d.status === 'error').length;
  return `<p style="margin-bottom:12px;color:var(--tx-md);font-size:13px;">${restored} restored · ${skipped} safe (na deny) · ${failed} failed</p>${rows}`;
}

// ---- Preview (content-aware) ----
async function previewBlob(hash, name, fullPath) {
  state.currentModalFile = { hash, name, fullPath };
  els.modalFilename.innerText = name;
  els.modalFilepath.innerText = fullPath || '';
  els.modalBody.innerHTML = '<div class="spinner"></div>';
  showOverlay(els.previewModal, true);

  try {
    const res = await fetch(`/api/preview-blob?hash=${encodeURIComponent(hash)}`);
    const contentType = res.headers.get('Content-Type') || '';
    if (contentType.startsWith('image/')) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      els.modalBody.innerHTML = `<img src="${url}" alt="Preview" onclick="this.requestFullscreen?.()">`;
    } else if (contentType.startsWith('video/')) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      els.modalBody.innerHTML = `<video src="${url}" controls></video>`;
    } else {
      const text = await res.text();
      els.modalBody.innerText = text;
    }
  } catch (err) {
    els.modalBody.innerHTML = `<p style="color:var(--danger);">Error loading preview: ${esc(err.message)}</p>`;
  }
}

// ---- Toast ----
let toastTimer = null;
function showToast(title, detail, tone = 'ok') {
  els.toast.classList.remove('warn', 'error');
  if (tone === 'warn') els.toast.classList.add('warn');
  else if (tone === 'error') els.toast.classList.add('error');
  els.toastTitle.innerText = title;
  $('toast-path').innerText = detail || '';
  els.toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.remove('show'), 6000);
}

// ---- Custom confirm dialog ----
function confirmDialog(title, message, confirmLabel = 'Confirm') {
  return new Promise(resolve => {
    $('dialog-title').innerText = title;
    els.dialogMsg.innerText = message;
    const btn = $('dialog-confirm');
    btn.innerText = confirmLabel;
    showOverlay(els.dialog, true);

    const cleanup = (val) => {
      showOverlay(els.dialog, false);
      btn.onclick = null; $('dialog-cancel').onclick = null;
      overlays.removeEventListener('click', onOuter);
      resolve(val);
    };
    const onOuter = (e) => { if (e.target === els.dialog) cleanup(false); };
    btn.onclick = () => cleanup(true);
    $('dialog-cancel').onclick = () => cleanup(false);
    overlays.addEventListener('click', onOuter);
  });
}

// ---- Result modal ----
function showResultModal(title, html) {
  els.resultTitle.innerText = title;
  els.resultBody.className = 'modal-body';
  els.resultBody.innerHTML = html;
  showOverlay(els.resultModal, true);
  $('btn-result-close').onclick = () => showOverlay(els.resultModal, false);
}

// ---- Overlay helpers ----
const overlays = document.querySelector('#toast').parentNode;
function showOverlay(el, show) {
  if (show) {
    el.hidden = false;
    requestAnimationFrame(() => el.classList.add('show'));
  } else {
    el.classList.remove('show');
    setTimeout(() => { el.hidden = true; }, 260);
  }
}

// ---- Actions: add folder / deep scan ----
const btnBrowse = $('btn-browse-folder');
const btnBrowseSide = $('btn-browse-folder-side');
async function triggerFolderPicker() {
  try {
    const res = await fetch('/api/browse-folder', { method: 'POST' });
    const data = await res.json();
    if (data.success && data.selectedPath) {
      await loadWorkspaces();
      selectFolder(data.selectedPath);
      showToast('Workspace added', data.selectedPath);
    }
  } catch (err) {
    showToast('Browse error', err.message, 'error');
  }
}
btnBrowse.onclick = triggerFolderPicker;
btnBrowseSide.onclick = triggerFolderPicker;

const btnScan = $('btn-deep-scan');
btnScan.onclick = async () => {
  const target = await promptDialog('Deep scan', 'Kis folder/drive ka sector scan karna hai?', state.selectedWorkspace || 'd:\\deepseek-harness');
  if (target === null) return;
  state.scanInFlight = true;
  btnScan.disabled = true;
  const orig = btnScan.innerHTML;
  btnScan.innerHTML = '<span class="spinner" style="width:16px;height:16px;border-width:2px;"></span> Scanning…';
  try {
    const res = await fetch('/api/forensic-scan', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetDir: target })
    });
    const data = await res.json();
    els.resultTitle.innerText = 'Deep scan complete';
    els.resultBody.className = 'modal-body summary';
    els.resultBody.innerHTML = `
      <p style="color:var(--tx-md);font-size:13px;margin-bottom:14px;font-family:Inter,sans-serif;">Scanned <span style="color:var(--acc);font-weight:600;">${esc(data.scannedPath || '')}</span> · ${data.totalFound} files · ${data.recycleBin.length} items in Recycle Bin</p>`;
    showOverlay(els.resultModal, true);
    $('btn-result-close').onclick = () => showOverlay(els.resultModal, false);
  } catch (err) {
    showToast('Scan error', err.message, 'error');
  } finally {
    state.scanInFlight = false;
    btnScan.disabled = false;
    btnScan.innerHTML = orig;
  }
};

// ---- Simple prompt dialog (reuses confirm dialog) ----
function promptDialog(title, message, initial = '') {
  return new Promise(resolve => {
    $('dialog-title').innerText = title;
    els.dialogMsg.style.display = 'none';
    const input = document.createElement('input');
    input.type = 'text';
    input.value = initial;
    input.style.cssText = 'width:100%;padding:11px 14px;border-radius:10px;border:1px solid var(--line-strong);background:var(--bg-2);color:var(--tx-hi);font-size:13px;outline:none;margin-top:6px;';
    const wrapper = document.createElement('div');
    wrapper.appendChild(input);
    els.dialogMsg.parentNode.insertBefore(wrapper, els.dialogMsg);
    const btn = $('dialog-confirm'); btn.innerText = 'Scan';
    showOverlay(els.dialog, true);
    input.focus();

    const cleanup = (val) => {
      showOverlay(els.dialog, false);
      wrapper.remove(); els.dialogMsg.style.display = '';
      btn.onclick = null; $('dialog-cancel').onclick = null;
      overlays.removeEventListener('click', onOuter);
      resolve(val);
    };
    const onOuter = (e) => { if (e.target === els.dialog) cleanup(null); };
    btn.onclick = () => cleanup(input.value || null);
    $('dialog-cancel').onclick = () => cleanup(null);
    input.onkeydown = (e) => { if (e.key === 'Enter') cleanup(input.value || null); if (e.key === 'Escape') cleanup(null); };
    overlays.addEventListener('click', onOuter);
  });
}

// ---- AI Copilot ----
$('ai-chat-form').onsubmit = async (e) => {
  e.preventDefault();
  const text = els.aiInput.value.trim();
  if (!text) return;
  els.aiInput.value = '';
  addAiMsg('user', esc(text));
  const thinking = addAiMsg('ai', '<em>Analyzing workspace journal & recovery options…</em>');

  try {
    const res = await fetch('/api/ai/ask', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: text, workspace: state.selectedWorkspace })
    });
    const data = await res.json();
    thinking.innerHTML = `<span class="chat-author">ShadowVault Copilot</span>${formatAi(esc(data.analysis || 'No response.'))}`;
  } catch (err) {
    thinking.innerHTML = `Error: ${esc(err.message)}`;
  }
};

$('btn-ai-suggest').onclick = async () => {
  const thinking = addAiMsg('ai', '<em>Searching deleted files & generating recovery plan…</em>');
  try {
    const res = await fetch('/api/ai/suggest', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workspace: state.selectedWorkspace })
    });
    const data = await res.json();
    const cands = (data.candidates || []).slice(0, 6);
    let html = `<span class="chat-author">ShadowVault Copilot</span>${formatAi(esc(data.analysis || 'No deleted files found.'))}`;
    if (cands.length) {
      html += '<div style="margin-top:10px;display:flex;flex-direction:column;gap:6px;">' + cands.map(c =>
        `<button class="btn btn-mini btn-ghost" style="justify-content:flex-start;text-align:left;" data-suggest-name="${esc(c.relativePath)}" data-suggest-path="${esc(c.filePath)}" data-suggest-hash="${esc(c.hash || '')}">↻ ${esc(c.relativePath)}</button>`
      ).join('') + '</div>';
    }
    thinking.innerHTML = html;
    thinking.querySelectorAll('[data-suggest-path]').forEach(b => {
      b.onclick = () => restoreSingle(b.dataset.suggestPath, b.dataset.suggestHash || null);
    });
  } catch (err) {
    thinking.innerHTML = `Error: ${esc(err.message)}`;
  }
};

function addAiMsg(cls, html) {
  const el = document.createElement('div');
  el.className = `chat-msg ${cls}`;
  el.innerHTML = html;
  els.aiChat.appendChild(el);
  els.aiChat.scrollTop = els.aiChat.scrollHeight;
  return el;
}
function formatAi(text) { return text.replace(/\n/g, '<br>'); }

// ---- Search (debounced) ----
let searchTimer = null;
els.search.oninput = (e) => {
  const val = e.target.value;
  els.clearSearch.hidden = val.length === 0;
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    state.searchQuery = val.trim().toLowerCase();
    renderFeed();
  }, 220);
};
els.clearSearch.onclick = () => {
  els.search.value = '';
  els.clearSearch.hidden = true;
  state.searchQuery = '';
  renderFeed();
};

// ---- Tabs ----
function switchView(view) {
  state.view = view;
  $('tab-deleted').classList.toggle('active', view === 'deleted');
  $('tab-timeline').classList.toggle('active', view === 'timeline');
  renderFeed();
}
$('tab-deleted').onclick = () => switchView('deleted');
$('tab-timeline').onclick = () => switchView('timeline');

// ---- Toast actions ----
$('btn-toast-open-explorer').onclick = async () => {
  if (state.lastRestoredPath) {
    await fetch('/api/open-folder', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filePath: state.lastRestoredPath })
    });
  }
};
$('btn-toast-close').onclick = () => els.toast.classList.remove('show');

// ---- Modal close buttons ----
$('btn-close-modal').onclick = () => showOverlay(els.previewModal, false);
$('btn-modal-restore').onclick = async () => {
  if (state.currentModalFile) {
    showOverlay(els.previewModal, false);
    await restoreSingle(state.currentModalFile.fullPath, state.currentModalFile.hash);
  }
};
// Click outside to close modals
[els.previewModal, els.resultModal].forEach(m => {
  m.addEventListener('click', (e) => { if (e.target === m) showOverlay(m, false); });
});

// ---- Health footer ----
async function refreshHealth() {
  try {
    const res = await fetch('/api/health');
    const data = await res.json();
    els.foot.innerText = `ShadowVault v2.0 · ${data.watchedPaths} workspaces · ${data.journalEntries} snapshots · ${new Date(data.time).toLocaleTimeString()}`;
  } catch (e) { /* ignore */ }
}
setInterval(refreshHealth, 30000);

// ---- Kickoff ----
window.addEventListener('load', () => {
  setupWebSocket();
  loadWorkspaces();
  loadDeleted();
  loadTimeline();
  refreshHealth();
});
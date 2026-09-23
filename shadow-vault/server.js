import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from local or parent directory
const parentEnv = path.join(__dirname, '..', '.env');
const localEnv = path.join(__dirname, '.env');
if (fs.existsSync(parentEnv)) {
  dotenv.config({ path: parentEnv });
} else if (fs.existsSync(localEnv)) {
  dotenv.config({ path: localEnv });
} else {
  dotenv.config();
}

import { VaultStore } from './core/vault.js';
import { WorkspaceWatcher } from './core/watcher.js';
import { ForensicCarver } from './core/forensic-carver.js';
import { AIReasoner } from './core/ai-reasoner.js';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Core Subsystems
const vault = new VaultStore(path.join(__dirname, 'vault-store'));
const carver = new ForensicCarver(vault);
const ai = new AIReasoner(vault);

// Broadcast file event to all connected WebSocket clients
function broadcastEvent(entry) {
  const payload = JSON.stringify({ type: 'FILE_EVENT', data: entry });
  wss.clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(payload);
    }
  });
}

const watcher = new WorkspaceWatcher(vault, broadcastEvent);
watcher.start();

// Auto-add common user workspaces
const initialPaths = [
  'd:\\deepseek-harness',
  'd:\\sameer bill',
  'd:\\agents-agency',
  'd:\\Iwt',
  'd:\\agency'
];
const cfg = vault.getConfig();
let cfgUpdated = false;
for (const p of initialPaths) {
  if (fs.existsSync(p) && !cfg.watchedPaths.includes(p)) {
    cfg.watchedPaths.push(p);
    watcher.watchPath(p);
    cfgUpdated = true;
  }
}
if (cfgUpdated) vault.saveConfig(cfg);

// ----------------- REST API Endpoints -----------------

// 1. Get Config & Watched Workspaces
app.get('/api/workspaces', (req, res) => {
  const config = vault.getConfig();
  const workspaces = (config.watchedPaths || []).map(p => {
    const exists = fs.existsSync(p);
    const deletedCount = vault.getDeletedFiles(p).length;
    return {
      path: p,
      name: path.basename(p) || p,
      exists,
      eventsCount: vault.getWorkspaceTimeline(p).length,
      deletedCount
    };
  });
  res.json({ workspaces, ignorePatterns: config.ignorePatterns });
});

// 2. Open Native Windows Folder Picker Dialog
app.post('/api/browse-folder', (req, res) => {
  const psScript = `
Add-Type -AssemblyName System.Windows.Forms
$fbd = New-Object System.Windows.Forms.FolderBrowserDialog
$fbd.Description = "Select Folder or Drive to Scan and Recover"
$fbd.ShowNewFolderButton = $true
if ($fbd.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) {
    Write-Output $fbd.SelectedPath
}
`;
  exec(`powershell -ExecutionPolicy Bypass -Command "${psScript.replace(/\n/g, ' ')}"`, (err, stdout, stderr) => {
    const selectedPath = (stdout || '').trim();
    if (selectedPath && fs.existsSync(selectedPath)) {
      const config = vault.getConfig();
      if (!config.watchedPaths.includes(selectedPath)) {
        config.watchedPaths.push(selectedPath);
        vault.saveConfig(config);
        watcher.watchPath(selectedPath);
      }
      return res.json({ success: true, selectedPath, watchedPaths: config.watchedPaths });
    }
    res.json({ success: false, message: 'No folder selected or cancelled' });
  });
});

// 3. Open Restored Folder in Windows Explorer
app.post('/api/open-folder', (req, res) => {
  const { folderPath, filePath } = req.body;
  const target = filePath || folderPath;
  if (!target) return res.status(400).json({ error: 'Target path required' });

  if (filePath && fs.existsSync(filePath)) {
    exec(`explorer /select,"${filePath}"`);
  } else if (folderPath && fs.existsSync(folderPath)) {
    exec(`explorer "${folderPath}"`);
  } else if (target) {
    const dir = fs.existsSync(target) ? (fs.statSync(target).isDirectory() ? target : path.dirname(target)) : path.dirname(target);
    if (fs.existsSync(dir)) exec(`explorer "${dir}"`);
  }
  res.json({ success: true });
});

// 4. Add Workspace Path directly
app.post('/api/workspaces/add', (req, res) => {
  const { targetPath } = req.body;
  if (!targetPath || !fs.existsSync(targetPath)) {
    return res.status(400).json({ error: 'Invalid or non-existent path' });
  }

  const config = vault.getConfig();
  if (!config.watchedPaths.includes(targetPath)) {
    config.watchedPaths.push(targetPath);
    vault.saveConfig(config);
    watcher.watchPath(targetPath);
  }
  res.json({ success: true, watchedPaths: config.watchedPaths });
});

// 5. Get List of Deleted Files
app.get('/api/deleted-files', (req, res) => {
  const { workspace } = req.query;
  const deleted = vault.getDeletedFiles(workspace || null);
  res.json({ total: deleted.length, deleted });
});

// 6. Restore All Deleted Files in Bulk (1-Click Smart Rescue)
app.post('/api/restore-all-deleted', (req, res) => {
  const { workspace } = req.body;
  try {
    const result = vault.restoreAllDeleted(workspace || null);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Get Workspace Timeline Events
app.get('/api/timeline', (req, res) => {
  const { workspace, limit = 100 } = req.query;
  const events = vault.getWorkspaceTimeline(workspace).slice(0, parseInt(limit));
  res.json({ total: events.length, events });
});

// 8. Restore a Single File (with optional custom destination)
app.post('/api/restore/file', (req, res) => {
  const { filePath, hash, destinationPath } = req.body;
  if (!filePath) return res.status(400).json({ error: 'filePath required' });

  try {
    const result = vault.restoreFile(filePath, hash, destinationPath);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 9. Deep Forensic Disk Scan
app.post('/api/forensic-scan', (req, res) => {
  const { targetDir } = req.body;
  const scanPath = targetDir || 'd:\\deepseek-harness';
  const files = carver.scanDirectoryDeep(scanPath, 4);
  const recycleItems = carver.inspectRecycleBin();
  res.json({ scannedPath: scanPath, totalFound: files.length, files, recycleBin: recycleItems });
});

// 10. AI Natural Language Recovery Assistant
app.post('/api/ai/ask', async (req, res) => {
  const { prompt, workspace } = req.body;
  if (!prompt) return res.status(400).json({ error: 'prompt is required' });

  const result = await ai.processRecoveryPrompt(prompt, workspace);
  res.json(result);
});

// 10.5 AI Smart Recovery Suggestions (1-Click Candidates + Plain Summary)
app.post('/api/ai/suggest', async (req, res) => {
  const { workspace } = req.body;
  const result = await ai.suggestRecovery(workspace || null);
  res.json(result);
});

// 10.6 Server Health / Stats
app.get('/api/health', (req, res) => {
  const config = vault.getConfig();
  res.json({
    ok: true,
    podVersion: '2.0',
    watchedPaths: (config.watchedPaths || []).length,
    journalEntries: vault.getJournal().length,
    time: new Date().toISOString()
  });
});

// 11. Preview File Content / Media Blob
app.get('/api/preview-blob', (req, res) => {
  const { hash } = req.query;
  if (!hash) return res.status(400).send('Hash required');

  const buf = vault.readBlob(hash);
  if (!buf) return res.status(404).send('Blob not found');

  const fileType = carver.detectFileType(buf);
  res.setHeader('Content-Type', fileType.mime);
  if (fileType.mime.startsWith('image/') || fileType.mime.startsWith('video/') || fileType.mime.startsWith('audio/')) {
    res.setHeader('Cache-Control', 'public, max-age=3600');
  }
  res.send(buf);
});

const PORT = process.env.PORT || 4567;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n===============================================================`);
  console.log(`🚀 SHADOW-VAULT AI (AUTONOMOUS TIME-MACHINE & RESCUE ENGINE)`);
  console.log(`📡 Dashboard Live at: http://localhost:${PORT}`);
  console.log(`🛡️ Actively Protecting Workspaces & Files`);
  console.log(`===============================================================\n`);
});

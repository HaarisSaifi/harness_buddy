import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import zlib from 'zlib';

export class VaultStore {
  constructor(baseDir = path.resolve('./vault-store')) {
    this.baseDir = baseDir;
    this.blobsDir = path.join(this.baseDir, 'blobs');
    this.journalFile = path.join(this.baseDir, 'journal.json');
    this.configPath = path.join(this.baseDir, 'config.json');
    this.journal = [];
    this.isDirty = false;
    this.saveTimer = null;
    this.init();
  }

  init() {
    if (!fs.existsSync(this.baseDir)) fs.mkdirSync(this.baseDir, { recursive: true });
    if (!fs.existsSync(this.blobsDir)) fs.mkdirSync(this.blobsDir, { recursive: true });
    
    if (fs.existsSync(this.journalFile)) {
      try {
        const raw = fs.readFileSync(this.journalFile, 'utf-8');
        this.journal = JSON.parse(raw).entries || [];
      } catch {
        this.journal = [];
      }
    } else {
      this.journal = [];
      fs.writeFileSync(this.journalFile, JSON.stringify({ entries: [] }, null, 2), 'utf-8');
    }

    if (!fs.existsSync(this.configPath)) {
      const defaultConfig = {
        watchedPaths: [
          'd:\\deepseek-harness',
          'd:\\Iwt',
          'd:\\agency',
          'd:\\sameer bill'
        ],
        ignorePatterns: [
          '**/node_modules/**',
          '**/.git/**',
          '**/.next/**',
          '**/dist/**',
          '**/build/**',
          '**/vault-store/**',
          '**/.shadow_vault/**',
          '**/tempmediaStorage/**'
        ],
        maxBlobSizeMB: 50
      };
      fs.writeFileSync(this.configPath, JSON.stringify(defaultConfig, null, 2), 'utf-8');
    }
  }

  getConfig() {
    try {
      return JSON.parse(fs.readFileSync(this.configPath, 'utf-8'));
    } catch {
      return { watchedPaths: [], ignorePatterns: [] };
    }
  }

  saveConfig(cfg) {
    fs.writeFileSync(this.configPath, JSON.stringify(cfg, null, 2), 'utf-8');
  }

  getJournal() {
    return this.journal;
  }

  scheduleJournalSave() {
    if (this.saveTimer) return;
    this.saveTimer = setTimeout(() => {
      this.saveTimer = null;
      try {
        fs.writeFileSync(this.journalFile, JSON.stringify({ entries: this.journal }, null, 2), 'utf-8');
      } catch (err) {
        console.error('Error saving journal:', err.message);
      }
    }, 1000);
  }

  computeHash(buffer) {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  storeBlob(buffer) {
    const hash = this.computeHash(buffer);
    const blobSubdir = path.join(this.blobsDir, hash.substring(0, 2));
    const blobPath = path.join(blobSubdir, hash);

    if (!fs.existsSync(blobSubdir)) {
      fs.mkdirSync(blobSubdir, { recursive: true });
    }

    if (!fs.existsSync(blobPath)) {
      try {
        const compressed = zlib.deflateSync(buffer);
        fs.writeFileSync(blobPath, compressed);
      } catch (err) {
        console.error('Blob compression error:', err.message);
      }
    }

    return { hash, size: buffer.length };
  }

  readBlob(hash) {
    if (!hash) return null;
    const blobPath = path.join(this.blobsDir, hash.substring(0, 2), hash);
    if (!fs.existsSync(blobPath)) return null;
    try {
      const compressed = fs.readFileSync(blobPath);
      return zlib.inflateSync(compressed);
    } catch {
      return null;
    }
  }

  readBlobVerified(hash) {
    const buffer = this.readBlob(hash);
    if (!buffer || !hash) return null;
    if (this.computeHash(buffer) !== hash) return null;
    return buffer;
  }

  recordEvent({ filePath, eventType, contentBuffer = null }) {
    const timestamp = new Date().toISOString();
    const cfg = this.getConfig();
    const maxBytes = (cfg.maxBlobSizeMB || 50) * 1024 * 1024;
    let size = 0;
    let hash = null;

    if (contentBuffer && contentBuffer.length > 0) {
      size = contentBuffer.length;
      if (size < maxBytes) {
        const blobInfo = this.storeBlob(contentBuffer);
        hash = blobInfo.hash;
      }
    } else if (eventType !== 'deleted' && fs.existsSync(filePath)) {
      try {
        const st = fs.statSync(filePath);
        size = st.size;
        if (size < maxBytes) {
          const buf = fs.readFileSync(filePath);
          const blobInfo = this.storeBlob(buf);
          hash = blobInfo.hash;
        }
      } catch {}
    }

    const entry = {
      id: crypto.randomUUID(),
      timestamp,
      filePath: path.resolve(filePath),
      relativePath: path.basename(filePath),
      dir: path.dirname(path.resolve(filePath)),
      eventType, // 'created', 'modified', 'deleted', 'restored'
      hash,
      size,
      extension: path.extname(filePath).toLowerCase()
    };

    this.journal.push(entry);
    if (this.journal.length > 15000) {
      this.journal.shift();
    }

    this.scheduleJournalSave();
    return entry;
  }

  getFileHistory(targetPath) {
    const norm = path.resolve(targetPath).toLowerCase();
    return this.journal
      .filter(e => e.filePath.toLowerCase() === norm)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  getWorkspaceTimeline(dirPath = null) {
    if (!dirPath) {
      return this.journal.slice().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    const normDir = path.resolve(dirPath).toLowerCase();
    return this.journal
      .filter(e => e.filePath.toLowerCase().startsWith(normDir))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  getDeletedFiles(targetDir = null) {
    const normDir = targetDir ? path.resolve(targetDir).toLowerCase() : null;
    const fileMap = new Map();

    for (const e of this.journal) {
      if (normDir && !e.filePath.toLowerCase().startsWith(normDir)) continue;
      if (!fileMap.has(e.filePath)) {
        fileMap.set(e.filePath, []);
      }
      fileMap.get(e.filePath).push(e);
    }

    const deletedList = [];
    for (const [fPath, events] of fileMap.entries()) {
      events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      const latest = events[0];
      const existsOnDisk = fs.existsSync(fPath);

      if (latest.eventType === 'deleted' || !existsOnDisk) {
        const lastGoodEvent = events.find(ev => ev.hash && ev.eventType !== 'deleted');
        if (lastGoodEvent) {
          deletedList.push({
            filePath: fPath,
            relativePath: path.basename(fPath),
            dir: path.dirname(fPath),
            deletedAt: latest.timestamp,
            hash: lastGoodEvent.hash,
            size: lastGoodEvent.size || 0,
            extension: lastGoodEvent.extension || path.extname(fPath),
            versionsCount: events.filter(ev => ev.hash).length
          });
        }
      }
    }

    return deletedList.sort((a, b) => new Date(b.deletedAt) - new Date(a.deletedAt));
  }

  restoreFile(filePath, targetHash = null, destinationPath = null) {
    const dest = destinationPath ? path.resolve(destinationPath) : path.resolve(filePath);
    let hashToUse = targetHash;

    if (!hashToUse) {
      const history = this.getFileHistory(filePath);
      const validEntry = history.find(h => h.hash && h.eventType !== 'deleted');
      if (!validEntry) throw new Error(`No snapshot found for ${filePath}`);
      hashToUse = validEntry.hash;
    }

    const buffer = this.readBlobVerified(hashToUse);
    if (!buffer) throw new Error(`Snapshot data is missing or its integrity check failed.`);

    const parentDir = path.dirname(dest);
    if (!fs.existsSync(parentDir)) fs.mkdirSync(parentDir, { recursive: true });

    fs.writeFileSync(dest, buffer);
    this.recordEvent({ filePath: dest, eventType: 'restored', contentBuffer: buffer });
    return { success: true, path: dest, size: buffer.length };
  }

  restoreAllDeleted(targetDir = null) {
    const deletedFiles = this.getDeletedFiles(targetDir);
    const results = [];

    for (const item of deletedFiles) {
      try {
        // Safety: never overwrite a file that currently exists with newer content than the deleted snapshot.
        if (fs.existsSync(item.filePath)) {
          const history = this.getFileHistory(item.filePath);
          const newerGood = history.find(h => h.eventType !== 'deleted' && h.hash && new Date(h.timestamp) > new Date(item.deletedAt));
          if (newerGood) {
            results.push({ filePath: item.filePath, status: 'skipped', reason: 'A newer version already exists on disk' });
            continue;
          }
        }
        const buffer = this.readBlobVerified(item.hash);
        if (buffer) {
          const parentDir = path.dirname(item.filePath);
          if (!fs.existsSync(parentDir)) fs.mkdirSync(parentDir, { recursive: true });
          fs.writeFileSync(item.filePath, buffer);
          this.recordEvent({ filePath: item.filePath, eventType: 'restored', contentBuffer: buffer });
          results.push({ filePath: item.filePath, status: 'restored', size: buffer.length });
        }
      } catch (err) {
        results.push({ filePath: item.filePath, status: 'error', error: err.message });
      }
    }

    return { totalRestored: results.filter(r => r.status === 'restored').length, details: results };
  }

  restoreWorkspaceToTimestamp(targetDir, timestampIso) {
    const normDir = path.resolve(targetDir).toLowerCase();
    const targetDate = new Date(timestampIso);

    const relevantEvents = this.journal
      .filter(e => e.filePath.toLowerCase().startsWith(normDir) && new Date(e.timestamp) <= targetDate)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    const fileStates = new Map();
    for (const event of relevantEvents) {
      if (event.eventType === 'deleted') {
        fileStates.delete(event.filePath);
      } else if (event.hash) {
        fileStates.set(event.filePath, event);
      }
    }

    const results = [];
    for (const [filePath, entry] of fileStates.entries()) {
      try {
        const buffer = this.readBlobVerified(entry.hash);
        if (buffer) {
          const parentDir = path.dirname(filePath);
          if (!fs.existsSync(parentDir)) fs.mkdirSync(parentDir, { recursive: true });
          fs.writeFileSync(filePath, buffer);
          results.push({ path: filePath, status: 'restored', size: buffer.length });
        }
      } catch (err) {
        results.push({ path: filePath, status: 'error', error: err.message });
      }
    }

    return { totalRestored: results.filter(r => r.status === 'restored').length, details: results };
  }
}

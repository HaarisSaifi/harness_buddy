import chokidar from 'chokidar';
import path from 'path';
import fs from 'fs';

export class WorkspaceWatcher {
  constructor(vaultStore, onEventCallback = null) {
    this.vault = vaultStore;
    this.onEventCallback = onEventCallback;
    this.watchers = new Map();
    this.debounceTimers = new Map();
  }

  start() {
    const config = this.vault.getConfig();
    const pathsToWatch = config.watchedPaths || [];
    for (const p of pathsToWatch) {
      this.watchPath(p);
    }
  }

  watchPath(targetPath) {
    if (!fs.existsSync(targetPath)) return;
    const norm = path.resolve(targetPath);
    if (this.watchers.has(norm)) return;

    const config = this.vault.getConfig();
    const ignores = config.ignorePatterns || [];

    const watcher = chokidar.watch(norm, {
      ignored: ignores,
      persistent: true,
      ignoreInitial: true, // Non-blocking: only track live changes/deletions
      awaitWriteFinish: {
        stabilityThreshold: 200,
        pollInterval: 100
      }
    });

    watcher
      .on('add', (filePath) => this.handleFileEvent(filePath, 'created'))
      .on('change', (filePath) => this.handleFileEvent(filePath, 'modified'))
      .on('unlink', (filePath) => this.handleFileEvent(filePath, 'deleted'))
      .on('error', (error) => console.error(`Watcher error on ${norm}:`, error));

    this.watchers.set(norm, watcher);
    console.log(`[ShadowVault Watcher] Now actively protecting: ${norm}`);
  }

  unwatchPath(targetPath) {
    const norm = path.resolve(targetPath);
    const watcher = this.watchers.get(norm);
    if (watcher) {
      watcher.close();
      this.watchers.delete(norm);
      console.log(`[ShadowVault Watcher] Stopped protecting: ${norm}`);
    }
  }

  handleFileEvent(filePath, eventType) {
    const key = `${filePath}:${eventType}`;
    if (this.debounceTimers.has(key)) {
      clearTimeout(this.debounceTimers.get(key));
    }

    // CRITICAL: for create/modify, snapshot content IMMEDIATELY (don't wait for
    // debounce) so that if the file is deleted a moment later, we already own a
    // recoverable blob. Waiting means a quick create->delete loses the data.
    const record = (skipDebounce = false) => {
      try {
        const entry = this.vault.recordEvent({ filePath, eventType });
        if (this.onEventCallback) {
          this.onEventCallback(entry);
        }
      } catch (err) {
        console.error(`Error recording event for ${filePath}:`, err);
      }
    };

    if (eventType === 'deleted') {
      // No content left to snapshot; record immediately.
      record(true);
      return;
    }

    if (eventType === 'created') {
      // Eager content snapshot so a quick subsequent delete stays recoverable.
      record(true);
      return;
    }

    // modified: debounce to collapse rapid writes, still reads content on record.
    const timer = setTimeout(() => {
      this.debounceTimers.delete(key);
      record();
    }, 150);
    this.debounceTimers.set(key, timer);
  }

  stopAll() {
    for (const [p, w] of this.watchers.entries()) {
      w.close();
    }
    this.watchers.clear();
  }
}

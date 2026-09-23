import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export class ForensicCarver {
  constructor(vaultStore) {
    this.vault = vaultStore;
    this.magicSignatures = [
      { ext: 'png', mime: 'image/png', magic: Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]) },
      { ext: 'jpg', mime: 'image/jpeg', magic: Buffer.from([0xFF, 0xD8, 0xFF]) },
      { ext: 'webp', mime: 'image/webp', magic: Buffer.from([0x52, 0x49, 0x46, 0x46]) },
      { ext: 'pdf', mime: 'application/pdf', magic: Buffer.from([0x25, 0x50, 0x44, 0x46]) },
      { ext: 'zip', mime: 'application/zip', magic: Buffer.from([0x50, 0x4B, 0x03, 0x04]) },
      { ext: 'mp4', mime: 'video/mp4', magic: Buffer.from([0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70]) }
    ];
  }

  detectFileType(buffer) {
    if (!buffer || buffer.length < 8) return { ext: 'bin', mime: 'application/octet-stream' };

    for (const sig of this.magicSignatures) {
      if (buffer.subarray(0, sig.magic.length).equals(sig.magic)) {
        return { ext: sig.ext, mime: sig.mime };
      }
    }

    // Check if valid UTF-8 Text / Code
    try {
      const text = buffer.toString('utf-8');
      if (!/[\x00-\x08\x0E-\x1F]/.test(text.slice(0, 1000))) {
        if (text.includes('<!DOCTYPE html') || text.includes('<html')) return { ext: 'html', mime: 'text/html' };
        if (text.includes('import ') || text.includes('export ') || text.includes('const ') || text.includes('function ')) return { ext: 'js', mime: 'text/javascript' };
        if (text.includes('def ') || text.includes('import os') || text.includes('class ')) return { ext: 'py', mime: 'text/x-python' };
        if (text.trim().startsWith('{') || text.trim().startsWith('[')) return { ext: 'json', mime: 'application/json' };
        return { ext: 'txt', mime: 'text/plain' };
      }
    } catch {}

    return { ext: 'bin', mime: 'application/octet-stream' };
  }

  scanDirectoryDeep(targetDir, maxDepth = 4, currentDepth = 0) {
    if (!fs.existsSync(targetDir) || currentDepth > maxDepth) return [];
    let discovered = [];

    try {
      const items = fs.readdirSync(targetDir, { withFileTypes: true });
      for (const item of items) {
        const fullPath = path.join(targetDir, item.name);

        if (item.isDirectory()) {
          if (!['node_modules', '.git', '.next', 'vault-store', '$Recycle.Bin'].includes(item.name)) {
            discovered = discovered.concat(this.scanDirectoryDeep(fullPath, maxDepth, currentDepth + 1));
          }
        } else if (item.isFile()) {
          try {
            const stats = fs.statSync(fullPath);
            discovered.push({
              path: fullPath,
              name: item.name,
              size: stats.size,
              modified: stats.mtime,
              extension: path.extname(item.name).toLowerCase()
            });
          } catch {}
        }
      }
    } catch (err) {
      console.warn(`Cannot read directory ${targetDir}:`, err.message);
    }

    return discovered;
  }

  inspectRecycleBin() {
    // Windows Recycle Bin inspection
    const results = [];
    const drives = ['C:', 'D:'];
    for (const d of drives) {
      const rbPath = `${d}\\$Recycle.Bin`;
      if (fs.existsSync(rbPath)) {
        try {
          const subdirs = fs.readdirSync(rbPath);
          for (const s of subdirs) {
            const userRb = path.join(rbPath, s);
            try {
              if (fs.statSync(userRb).isDirectory()) {
                const files = fs.readdirSync(userRb);
                for (const f of files) {
                  const fPath = path.join(userRb, f);
                  try {
                    const st = fs.statSync(fPath);
                    results.push({
                      recyclePath: fPath,
                      name: f,
                      size: st.size,
                      modified: st.mtime
                    });
                  } catch {}
                }
              }
            } catch {}
          }
        } catch {}
      }
    }
    return results;
  }
}

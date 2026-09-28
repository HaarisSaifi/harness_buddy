import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
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

const AGENTROUTER_API_KEY = process.env.AGENTROUTER_API_KEY || "";
const AGENTROUTER_BASE_URL = (process.env.AGENTROUTER_BASE_URL || "https://agentrouter.org/v1").replace(/\/$/, '');
const BRIDGE_PORT = parseInt(process.env.CLAUDE_BRIDGE_PORT || "3085", 10);

const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key, anthropic-version, anthropic-beta'
    });
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // Health check
  if (pathname === '/health' || pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: "online",
      bridge: "AgentRouter <-> Claude Code Bridge",
      target: AGENTROUTER_BASE_URL,
      keyConfigured: !!AGENTROUTER_API_KEY
    }));
    return;
  }

  // Handle Anthropic Messages API (/v1/messages or /messages)
  if ((pathname === '/v1/messages' || pathname === '/messages') && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');

        // Extract client key or fallback to configured Agent Router key
        const clientKey = req.headers['x-api-key'] || (req.headers['authorization'] || '').replace(/^Bearer\s+/i, '') || AGENTROUTER_API_KEY;
        const anthropicVersion = req.headers['anthropic-version'] || '2023-06-01';

        const targetModel = process.env.CLAUDE_TARGET_MODEL || payload.model;
        console.log(`[CLAUDE BRIDGE] Request model: "${payload.model}" -> Upstream model: "${targetModel}" | Stream: ${!!payload.stream}`);
        payload.model = targetModel;

        // Target URL
        const targetUrl = `${AGENTROUTER_BASE_URL}/messages`;

        const upstreamHeaders = {
          'Content-Type': 'application/json',
          'x-api-key': clientKey,
          'Authorization': `Bearer ${clientKey}`,
          'anthropic-version': anthropicVersion,
          // CRITICAL: Agent Router WAF bypass fingerprint
          'User-Agent': 'RooCode/0.15.0'
        };

        if (req.headers['anthropic-beta']) {
          upstreamHeaders['anthropic-beta'] = req.headers['anthropic-beta'];
        }

        const upstreamResp = await fetch(targetUrl, {
          method: 'POST',
          headers: upstreamHeaders,
          body: JSON.stringify(payload)
        });

        console.log(`[CLAUDE BRIDGE] Upstream Status: ${upstreamResp.status} ${upstreamResp.statusText}`);

        // Pass status and headers to client
        const respHeaders = {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': upstreamResp.headers.get('content-type') || 'application/json'
        };

        res.writeHead(upstreamResp.status, respHeaders);

        // If streaming, pipe raw chunks
        if (upstreamResp.body) {
          const reader = upstreamResp.body.getReader();
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            res.write(value);
          }
        }
        res.end();
      } catch (err) {
        console.error(`[CLAUDE BRIDGE ERROR]:`, err.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: {
            type: "bridge_error",
            message: `Claude Bridge Error: ${err.message}`
          }
        }));
      }
    });
    return;
  }

  // Handle /v1/models
  if (pathname === '/v1/models' || pathname === '/models') {
    try {
      const resp = await fetch(`${AGENTROUTER_BASE_URL}/models`, {
        headers: {
          'Authorization': `Bearer ${AGENTROUTER_API_KEY}`,
          'User-Agent': 'RooCode/0.15.0'
        }
      });
      const data = await resp.text();
      res.writeHead(resp.status, { 'Content-Type': 'application/json' });
      res.end(data);
    } catch(err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // Fallback 404
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

server.listen(BRIDGE_PORT, '127.0.0.1', () => {
  console.log("======================================================================");
  console.log(`🚀 AGENTROUTER <-> CLAUDE CODE TRANSPARENT BRIDGE`);
  console.log(`📡 Bridge Active at: http://127.0.0.1:${BRIDGE_PORT}`);
  console.log(`🛡️ Cloudflare WAF Bypass (RooCode Fingerprint): ACTIVE`);
  console.log(`🔗 Upstream Target: ${AGENTROUTER_BASE_URL}`);
  console.log("======================================================================");
});

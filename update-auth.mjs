import fs from 'fs';
import path from 'path';
import os from 'os';

const authPath = path.join(os.homedir(), '.local', 'share', 'opencode', 'auth.json');
const configPath = path.join(os.homedir(), '.config', 'opencode', 'opencode.jsonc');

const authData = {
  "opencode": {
    "type": "api",
    "key": process.env.OPENCODE_API_KEY || "your_opencode_api_key"
  },
  "zen": {
    "type": "api",
    "key": process.env.ZEN_API_KEY || "your_zen_api_key"
  },
  "openai": {
    "type": "api",
    "key": process.env.XKIRO_API_KEY || process.env.OPENAI_API_KEY || "your_xkiro_or_openai_api_key"
  }
};

fs.writeFileSync(authPath, JSON.stringify(authData, null, 2));
console.log("✅ Successfully updated auth.json at:", authPath);

const configData = {
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "openai": {
      "options": {
        "baseURL": "https://api.xkiro.com/v1"
      }
    }
  }
};

fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));
console.log("✅ Successfully updated opencode.jsonc at:", configPath);

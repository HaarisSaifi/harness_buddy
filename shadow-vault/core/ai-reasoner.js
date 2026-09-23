import fs from 'fs';
import path from 'path';

export class AIReasoner {
  constructor(vaultStore, config = {}) {
    this.vault = vaultStore;
    this.apiKey = config.apiKey || process.env.SHADOW_VAULT_AI_KEY || process.env.XKIRO_API_KEY || process.env.OPENAI_API_KEY || "";
    this.baseURL = config.baseURL || process.env.SHADOW_VAULT_AI_URL || "https://api.xkiro.com/v1/chat/completions";
    this.model = config.model || process.env.SHADOW_VAULT_AI_MODEL || "qwen/qwen3.8-max:free";
  }

  async queryLLM(messages, temperature = 0.2) {
    if (!this.apiKey) {
      return "Note: AI assistant is not configured. Add your API key via the SHADOW_VAULT_AI_KEY environment variable (or a .env file in the project folder) to enable AI-powered recovery suggestions.";
    }

    try {
      const response = await fetch(this.baseURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          temperature,
          max_tokens: 1500
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`AI Gateway Error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || "No response generated.";
    } catch (err) {
      console.error("AI Reasoner Error:", err.message);
      return `AI Assistance Notice: ${err.message}`;
    }
  }

  async processRecoveryPrompt(userPrompt, targetWorkspace = null) {
    const journal = this.vault.getWorkspaceTimeline(targetWorkspace).slice(0, 50);

    const systemPrompt = `You are ShadowVault AI, an autonomous forensic file recovery & workspace time-machine intelligence.
The user wants to recover deleted files, undo a bad change, or investigate lost data in their project.
Given the user's natural language request (which might be in Hindi, Hinglish, or English) and recent file event logs, analyze the intent and provide:
1. Exact list of candidate files to restore.
2. Estimated time/version.
3. Step-by-step recovery recommendation or confirmation.
Keep your response concise, empathetic, and actionable.

RECENT ACTIVITY JOURNAL (LAST 50 EVENTS):
${JSON.stringify(journal.map(j => ({ file: j.relativePath, full: j.filePath, event: j.eventType, time: j.timestamp, size: j.size })), null, 2)}
`;

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ];

    const reply = await this.queryLLM(messages);
    return {
      success: true,
      analysis: reply,
      recentEventsCount: journal.length
    };
  }

  async suggestRecovery(targetWorkspace = null) {
    const deleted = this.vault.getDeletedFiles(targetWorkspace).slice(0, 15);
    if (deleted.length === 0) return { success: true, analysis: "No deleted files were found. Everything looks safe.", candidates: [] };

    const listText = deleted.map(d => `- ${d.filePath}  (deleted ${d.deletedAt}, ${d.size} bytes)`).join('\n');
    const messages = [
      {
        role: "system",
        content: "You are ShadowVault AI. Based on the deleted files list below, give a short (2-3 sentence) plain-language summary in Hindi/Hinglish explaining what was lost, and which files are most important to restore. Do NOT invent file names."
      },
      { role: "user", content: `Deleted files:\n${listText}` }
    ];

    const reply = await this.queryLLM(messages);
    return { success: true, analysis: reply, candidates: deleted };
  }

  async repairCorruptedCode(brokenCodeSnippet, language = "javascript") {
    const messages = [
      {
        role: "system",
        content: `You are an expert compiler & AST reconstructor. The following ${language} code snippet was partially recovered from disk and may have missing brackets, broken imports, or truncated statements. Output ONLY the clean, perfectly valid and fixed code block without extra markdown commentary.`
      },
      {
        role: "user",
        content: brokenCodeSnippet
      }
    ];

    const fixed = await this.queryLLM(messages, 0.1);
    return fixed.replace(/^```[a-z]*\n/i, '').replace(/\n```$/, '');
  }
}

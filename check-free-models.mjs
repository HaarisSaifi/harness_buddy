const apiKey = process.env.XKIRO_API_KEY || "";
const baseURL = "https://api.xkiro.com/v1/chat/completions";

const candidateModels = [
  "deepseek/deepseek-v4-pro",
  "z-ai/glm-5.3-flash",
  "z-ai/glm-4.7-flash",
  "z-ai/glm-4.5-flash",
  "qwen/qwen3.8-max",
  "qwen/qwen3.7-max",
  "qwen/qwen-2.5-coder-32b-instruct"
];

async function checkFreeModels() {
  console.log("Checking candidate free models on xKiro...\n");
  for (const model of candidateModels) {
    try {
      const res = await fetch(baseURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: [{ role: "user", content: "Hi" }],
          max_tokens: 10
        })
      });
      if (res.ok) {
        const data = await res.json();
        console.log(`✅ [FREE & WORKING]: ${model} -> "${data.choices?.[0]?.message?.content?.trim()}"`);
      } else {
        const err = await res.json().catch(() => ({}));
        console.log(`❌ [FAILED]: ${model} -> ${err?.error?.message || res.status}`);
      }
    } catch (e) {
      console.log(`❌ [ERROR]: ${model} -> ${e.message}`);
    }
  }
}

checkFreeModels();

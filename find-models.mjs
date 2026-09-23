const apiKey = process.env.XKIRO_API_KEY || "";
async function listModels() {
  const res = await fetch("https://api.xkiro.com/v1/models", {
    headers: { "Authorization": `Bearer ${apiKey}` }
  });
  const data = await res.json();
  const glmModels = (data.data || []).filter(m => m.id.toLowerCase().includes("glm") || m.id.toLowerCase().includes("z-ai") || m.id.toLowerCase().includes("z.ai"));
  console.log("Matched GLM/Z.ai Models:", JSON.stringify(glmModels.map(m => m.id), null, 2));
}
listModels();

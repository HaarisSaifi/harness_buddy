const apiKey = process.env.XKIRO_API_KEY || "";
const baseURL = "https://api.xkiro.com/v1";

async function findWorkingFreeModels() {
  const res = await fetch(`${baseURL}/models`, {
    headers: { "Authorization": `Bearer ${apiKey}` }
  });
  const data = await res.json();
  const models = data.data || [];
  console.log(`Total models available on xKiro: ${models.length}`);
  
  const working = [];
  for (const m of models) {
    try {
      const chatRes = await fetch(`${baseURL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: m.id,
          messages: [{ role: "user", content: "hi" }],
          max_tokens: 5
        })
      });
      if (chatRes.ok) {
        console.log(`✅ [WORKING FREE]: ${m.id}`);
        working.push(m.id);
      }
    } catch(e) {}
  }
  console.log("\nALL CONFIRMED WORKING FREE MODELS:", JSON.stringify(working, null, 2));
}

findWorkingFreeModels();

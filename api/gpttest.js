const axios = require('axios');

const meta = {
  name: "gpt-4o-2024-08-06",
  version: "0.0.2",
  description: "GPT-4o avec texte, vision et génération d'image",
  author: "rtm tafitaniaina",
  method: "get",
  category: "Chatgpt",
  path: "/rtm?prompt=&mode=&img="
};

async function onStart({ res, req }) {
  const { prompt, mode, img } = req.query;

  if (!prompt) {
    return res.status(400).json({ status: false, error: 'prompt is required' });
  }

  const model = "openai/gpt-4o-2024-08-06";
  const uid = "0";
  let url = `https://ai-router-production.up.railway.app/openrouter?prompt=${encodeURIComponent(prompt)}&uid=${uid}&model=${model}`;

  if (mode === 'vision') {
    if (!img) return res.status(400).json({ status: false, error: 'Image URL is required for vision mode' });
    url += `&img=${encodeURIComponent(img)}`;
  }

  if (mode === 'generate') {
    // on change de modèle pour la génération d’image (DALL·E 3)
    const dalleModel = "openai/dall-e-3";
    url = `https://ai-router-production.up.railway.app/openrouter?prompt=${encodeURIComponent(prompt)}&uid=${uid}&model=${dalleModel}`;
  }

  try {
    const response = await axios.get(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const result = response.data?.response || response.data;
    res.json({ response: result });
  } catch (error) {
    console.error("Erreur GPT-4 router:", error.response?.data || error.message);
    res.status(500).json({ status: false, error: 'Erreur lors de la requête vers GPT-4o.' });
  }
}

module.exports = { meta, onStart };

const axios = require('axios');

const meta = {
  name: "gpt-4o-pro",
  version: "0.0.1",
  description: "Un endpoint qui appelle GPT-4 via ai-router-production",
  author: "rtm tafitaniaina",
  method: "get",
  category: "Chatgpt",
  path: "/rtm1?prompt="
};

async function onStart({ res, req }) {
  const { prompt } = req.query;

  if (!prompt) {
    return res.status(400).json({ status: false, error: 'prompt is required' });
  }

  // Model verrouillé sur GPT-4
  const model = "openai/gpt-4o";
  const uid = "0"; // UID par défaut ou fixe si besoin
  const url = `https://ai-router-production.up.railway.app/openrouter?prompt=${encodeURIComponent(prompt)}&uid=${uid}&model=${model}`;

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
    res.status(500).json({ status: false, error: 'Erreur lors de la requête vers GPT-4.' });
  }
}

module.exports = { meta, onStart };

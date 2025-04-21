const axios = require('axios');

const meta = {
  name: "gpt4o-pro",
  version: "1.0.0",
  description: "Endpoint GPT-4o Pro avec raisonnement, recherche web et date en temps réel",
  author: "rtm",
  method: "get",
  category: "ai",
  path: "/gpt4o-pro?query="
};

async function onStart({ res, req }) {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ status: false, error: "Paramètre 'query' requis." });
  }

  const config = {
    method: 'post',
    url: 'https://gpt.tiptopuni.com/api/siliconflow/v1/chat/completions',
    timeout: 20000, // 20 sec timeout pour éviter les 504
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Origin': 'https://gpt.tiptopuni.com',
      'Referer': 'https://gpt.tiptopuni.com/',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    },
    data: JSON.stringify({
      model: 'Pro/gpt-4o', // modèle GPT-4o Pro
      stream: false,
      temperature: 0.8,
      top_p: 0.9,
      frequency_penalty: 0.4,
      presence_penalty: 0.6,
      messages: [
        {
          role: 'user',
          content: query
        }
      ]
    })
  };

  try {
    const response = await axios(config);
    const aiResponse = response.data.choices?.[0]?.message?.content;

    if (!aiResponse) {
      return res.status(500).json({ status: false, error: "Réponse de l'IA introuvable." });
    }

    res.json({ response: aiResponse });
  } catch (error) {
    console.error("Erreur GPT-4o Pro:", error.message);
    return res.status(504).json({ status: false, error: "Erreur serveur distant. Réessaie plus tard." });
  }
}

module.exports = { meta, onStart };

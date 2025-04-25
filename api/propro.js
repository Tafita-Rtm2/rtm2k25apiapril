const axios = require('axios');

const meta = {
  name: "gpt-4o-tiptopuni",
  version: "0.0.1",
  description: "GPT-4o via gpt.tiptopuni.com en rappel",
  author: "rtm tafitaniaina",
  method: "get",
  category: "gpt4o",
  path: "/gpt4o?prompt="
};

async function onStart({ res, req }) {
  const { prompt } = req.query;

  if (!prompt) {
    return res.status(400).json({ status: false, error: 'prompt is required' });
  }

  try {
    // Ici on envoie la question au site gpt.tiptopuni.com
    const response = await axios.post('https://gpt.tiptopuni.com/api/siliconflow/v1/chat/completions', {
      messages: [
        { role: "user", content: prompt }
      ],
      model: "gpt-4o",
      temperature: 0.7
    }, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      }
    });

    // Maintenant on récupère la réponse de GPT-4o
    const reply = response.data?.choices?.[0]?.message?.content || "Pas de réponse.";

    res.json({ response: reply });

  } catch (error) {
    console.error("Erreur GPT-4o TipTopUni:", error.response?.data || error.message);
    res.status(500).json({ status: false, error: 'Erreur lors de la requête vers GPT-4o TipTopUni.' });
  }
}

module.exports = { meta, onStart };

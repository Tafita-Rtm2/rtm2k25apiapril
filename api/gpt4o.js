const axios = require('axios');

const meta = {
  name: "gpt4o-openai",
  version: "1.0.0",
  description: "Appelle GPT-4o via SiliconFlow API sur gpt.tiptopuni.com",
  author: "ton-nom-ici",
  method: "get",
  category: "ai",
  path: "/gpt4o?query="
};

async function onStart({ res, req }) {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ status: false, error: 'query est requis' });
  }

  const payload = {
    messages: [{ role: 'user', content: query }],
    stream: false,
    model: "OpenAI/gpt-4o",  // très important : exact d'après ta capture
    temperature: 0.7,
    presence_penalty: 0.6,
    frequency_penalty: 0.4,
    top_p: 0.9
  };

  try {
    const response = await axios.post("https://gpt.tiptopuni.com/api/siliconflow/v1/chat/completions", payload, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Origin": "https://gpt.tiptopuni.com",
        "Referer": "https://gpt.tiptopuni.com/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0 Safari/537.36"
      }
    });

    const aiResponse = response.data.choices?.[0]?.message?.content;
    if (!aiResponse) {
      return res.status(500).json({ status: false, error: 'Réponse vide de GPT-4o.' });
    }

    res.json({ response: aiResponse });

  } catch (error) {
    console.error("Erreur GPT-4o:", error.response?.data || error.message);
    res.status(500).json({ status: false, error: 'Erreur lors de l’appel GPT-4o.' });
  }
}

module.exports = { meta, onStart };

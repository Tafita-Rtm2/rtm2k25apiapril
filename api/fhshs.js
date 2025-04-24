const axios = require('axios');

const meta = {
  name: "gpt-4o-openai",
  version: "1.0.0",
  description: "Endpoint GPT-4o via siliconflow tiptopuni",
  author: "rtm taftaniaina",
  method: "get",
  category: "chat",
  path: "/gpt4o?query="
};

async function onStart({ res, req }) {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ status: false, error: 'query is required' });
  }

  const messages = [{ role: 'user', content: query }];

  // Paramètres ajustables
  const stream = req.query.stream === 'true';
  const model = req.query.model || 'gpt-4o'; // Nom exact selon tiptopuni (tu peux ajuster)
  const temperature = parseFloat(req.query.temperature) || 0.7;
  const presence_penalty = parseFloat(req.query.presence_penalty) || 0.5;
  const frequency_penalty = parseFloat(req.query.frequency_penalty) || 0.5;
  const top_p = parseFloat(req.query.top_p) || 0.9;

  const payload = JSON.stringify({
    messages,
    stream,
    model,
    temperature,
    presence_penalty,
    frequency_penalty,
    top_p
  });

  const config = {
    method: 'post',
    url: 'https://gpt.tiptopuni.com/api/siliconflow/v1/chat/completions',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Origin': 'https://gpt.tiptopuni.com',
      'Referer': 'https://gpt.tiptopuni.com/',
      'User-Agent': 'Mozilla/5.0'
    },
    data: payload
  };

  try {
    const response = await axios(config);
    const aiResponse = response.data.choices?.[0]?.message?.content;
    if (!aiResponse) {
      return res.status(500).json({ status: false, error: 'AI response not found in API response.' });
    }
    res.json({ response: aiResponse });
  } catch (error) {
    console.error("Erreur API GPT-4o:", error.response?.data || error.message);
    res.status(500).json({ status: false, error: 'Erreur lors de l’appel à GPT-4o.' });
  }
}

module.exports = { meta, onStart };

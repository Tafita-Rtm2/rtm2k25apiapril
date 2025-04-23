const axios = require('axios');

const meta = {
  name: "gpt4o",
  version: "0.0.1",
  description: "Un endpoint utilisant GPT-4o via l’API SiliconFlow",
  author: "Jr Busaco and AjiroDesu (modifié par ChatGPT)",
  method: "get",
  category: "ai",
  path: "/gpt4o?query="
};

async function onStart({ res, req }) {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ status: false, error: 'query is required' });
  }

  const messages = [{ role: 'user', content: query }];
  const stream = req.query.stream === 'true';
  const model = 'OpenAI/gpt-4o'; // modèle GPT-4o ici
  const temperature = req.query.temperature ? parseFloat(req.query.temperature) : 0.8;
  const presence_penalty = req.query.presence_penalty ? parseFloat(req.query.presence_penalty) : 0.6;
  const frequency_penalty = req.query.frequency_penalty ? parseFloat(req.query.frequency_penalty) : 0.4;
  const top_p = req.query.top_p ? parseFloat(req.query.top_p) : 0.9;

  const payload = JSON.stringify({
    messages,
    stream,
    model,
    temperature,
    presence_penalty,
    frequency_penalty,
    top_p,
  });

  const config = {
    method: 'post',
    url: 'https://gpt.tiptopuni.com/api/siliconflow/v1/chat/completions',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Origin': 'https://gpt.tiptopuni.com',
      'Referer': 'https://gpt.tiptopuni.com/',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
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
    console.error("Error during GPT-4o call:", error.message);
    res.status(500).json({ status: false, error: 'An error occurred while fetching GPT-4o completions.' });
  }
}

module.exports = { meta, onStart };

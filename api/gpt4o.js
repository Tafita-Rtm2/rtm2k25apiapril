const { Hercai } = require('hercai');

const meta = {
  name: "gpt4",
  version: "1.0.0",
  description: "Chat avec GPT-4 via Hercai",
  author: "Tafitaniaina",
  method: "get",
  category: "ai",
  path: "/gpt4?query="
};

async function onStart({ req, res }) {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ status: false, error: "Le paramètre ?query= est requis" });
  }

  try {
    const herc = new Hercai();
    const response = await herc.question({ model: "v3-32k", content: query });

    if (!response || !response.reply) {
      return res.status(500).json({ status: false, error: "Réponse vide de Hercai" });
    }

    res.json({
      status: true,
      response: response.reply
    });
  } catch (error) {
    console.error("Erreur API Hercai:", error);
    res.status(500).json({ status: false, error: "Erreur interne", message: error.message });
  }
}

module.exports = { meta, onStart };

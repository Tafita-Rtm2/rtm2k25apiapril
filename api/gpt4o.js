const { Hercai } = require('hercai');

const meta = {
  name: "gpt4",
  version: "1.0.0",
  description: "Chat avec GPT-4 via Hercai (model v3-32k)",
  author: "Tafitaniaina",
  method: "get",
  category: "ai",
  path: "/gpt4?query="
};

async function onStart({ req, res }) {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({
      status: false,
      error: "Le paramètre ?query= est requis"
    });
  }

  try {
    const herc = new Hercai();
    const result = await herc.question({
      model: "v3-32k",
      content: query
    });

    if (!result || !result.reply) {
      return res.status(500).json({
        status: false,
        error: "Réponse vide de Hercai"
      });
    }

    res.json({
      operator: "AjiroDesu",
      success: 1,
      progress: 1000,
      text: "Finished",
      message: "Réponse générée avec succès",
      reply: result.reply
    });

  } catch (err) {
    console.error("Erreur API Hercai:", err);
    res.status(500).json({
      status: false,
      error: "Erreur lors de l'appel à l'API Hercai",
      message: err.message
    });
  }
}

module.exports = { meta, onStart };

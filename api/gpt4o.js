const axios = require('axios');

const meta = {
  name: "gpt4o-pro",
  version: "1.0.0",
  description: "Endpoint GPT‑4o Pro avec raisonement, recherche web et date temps réel",
  author: "Votre Nom",
  method: "get",
  category: "ai",
  path: "/deepseek?query="
};

async function onStart({ req, res }) {
  // 1. Validation du paramètre
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ status: false, error: 'Le paramètre `query` est requis.' });
  }

  // 2. Date/heure courante ISO
  const currentDate = new Date().toISOString();

  // 3. Recherche web (stub) – à remplacer par votre implémentation
  let searchResults = [];
  try {
    searchResults = await webSearch(query);  // Retourne un tableau d’objets { title, snippet, url }
  } catch (e) {
    console.error('Erreur recherche web :', e);
  }

  // 4. Construction des messages pour GPT‑4o Pro
  const systemMsg1 = {
    role: 'system',
    content: `Vous êtes GPT‑4o Pro, un assistant à raisonnement avancé et accès web. Date/heure actuelle : ${currentDate}.`
  };
  const systemMsg2 = {
    role: 'system',
    content: 'Résultats de recherche :\n' +
      searchResults.map((r, i) => `${i+1}. ${r.snippet} (${r.url})`).join('\n')
  };
  const userMsg = { role: 'user', content: query };

  const messages = [ systemMsg1, systemMsg2, userMsg ];

  // 5. Appel au modèle GPT‑4o Pro via votre endpoint Siliconflow
  try {
    const aiResp = await axios.post(
      'https://gpt.tiptopuni.com/api/siliconflow/v1/chat/completions',
      {
        model: 'gpt-4o-pro',
        messages,
        temperature: 0.7
      },
      {
        headers: {
          'Content-Type': 'application/json'
          // ajoutez ici vos headers si nécessaire
        }
      }
    );

    const aiContent = aiResp.data.choices?.[0]?.message?.content;
    if (!aiContent) {
      return res.status(500).json({ status: false, error: 'Réponse IA introuvable.' });
    }

    // 6. Retour JSON
    res.json({
      response: aiContent,
      searchUsed: searchResults
    });

  } catch (err) {
    console.error('Erreur AI :', err.response?.data || err.message);
    res.status(500).json({ status: false, error: 'Erreur lors de l’appel à l’IA.' });
  }
}

// Fonction stub de recherche web : implémentez ici Bing, Google, ou autre
async function webSearch(q) {
  // Exemple de structure retournée :
  // return [
  //   { title: 'Titre 1', snippet: 'Extrait 1', url: 'https://...' },
  //   { title: 'Titre 2', snippet: 'Extrait 2', url: 'https://...' },
  // ];
  return [];
}

module.exports = { meta, onStart };

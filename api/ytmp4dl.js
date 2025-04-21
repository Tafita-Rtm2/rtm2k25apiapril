const axios = require("axios");

module.exports = {
  meta: {
    name: "YouTube Mp4 Downloader",
    version: "1.0.0",
    author: "TonNom",
    method: "get",
    description: "Télécharger des vidéos YouTube en MP4 (choix qualité)",
    path: "/ytmp4dl?url=&quality=",
    category: "downloader"
  },

  onStart: async function ({ req, res }) {
    const youtubeUrl = req.query.url;
    const quality = req.query.quality || "360"; // par défaut 360p

    if (!youtubeUrl) {
      return res.status(400).json({ error: "URL YouTube requise." });
    }

    const headers = {
      accept: "*/*",
      "accept-language": "fr-FR,fr;q=0.9",
      "user-agent": "Mozilla/5.0",
      referer: "https://ytmate.lc",
    };

    try {
      const infoUrl = `https://ytmate.lc/api/ajaxSearch/index?query=${encodeURIComponent(youtubeUrl)}&vt=mp4`;
      const info = await axios.get(infoUrl, { headers });

      const result = info.data;

      if (!result || !result.links || !result.links.mp4) {
        return res.status(404).json({ error: "Lien de téléchargement non trouvé." });
      }

      // Récupération du lien avec la qualité demandée
      const qualityKeys = Object.keys(result.links.mp4);
      const chosenQuality = qualityKeys.includes(quality) ? quality : qualityKeys[0];
      const downloadLink = result.links.mp4[chosenQuality].url;

      res.json({
        videoTitle: result.title,
        quality: chosenQuality,
        download: downloadLink
      });

    } catch (error) {
      console.error("Erreur dans ytmp4dl:", error.message);
      res.status(500).json({ error: "Erreur serveur", details: error.message });
    }
  }
};

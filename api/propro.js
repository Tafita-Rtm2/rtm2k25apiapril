const puppeteer = require('puppeteer');

const meta = {
  name: "gpt4o-capture",
  version: "0.0.1",
  description: "Capture réponse GPT-4o depuis site web avec Puppeteer",
  author: "rtm tafitaniaina",
  method: "get",
  category: "gpt",
  path: "/api/gpt4o?prompt="
};

async function onStart({ req, res }) {
  const { prompt } = req.query;
  if (!prompt) {
    return res.status(400).json({ status: false, error: 'prompt is required' });
  }

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto('https://gpt.tiptopuni.com/#/chat', { waitUntil: 'networkidle2' });

    await page.waitForSelector('textarea');

    await page.type('textarea', prompt);

    await page.click('button:has-text("Envoyer")');

    await page.waitForTimeout(4000); // Attendre la réponse

    const reply = await page.evaluate(() => {
      const botMessages = Array.from(document.querySelectorAll('.chat-message.bot'));
      if (botMessages.length === 0) return null;
      return botMessages[botMessages.length - 1].innerText;
    });

    await browser.close();

    if (!reply) {
      return res.status(500).json({ status: false, error: 'No reply received.' });
    }

    res.json({ status: true, response: reply });

  } catch (error) {
    if (browser) await browser.close();
    console.error("Erreur GPT-4o Puppeteer:", error.message);
    res.status(500).json({ status: false, error: error.message });
  }
}

module.exports = { meta, onStart };

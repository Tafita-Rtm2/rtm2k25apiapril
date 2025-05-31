const puppeteer = require('puppeteer');
const express = require('express');
const app = express();

const meta = {
  name: "aidoc-gpt",
  version: "1.0.0",
  description: "Fetches response from aidocmaker.com/chat using ChatGPT-4o interface",
  author: "Adapted by ChatGPT",
  method: "get",
  category: "ai",
  path: "/aidocgpt?query="
};

async function onStart({ req, res }) {
  const { query } = req.query;
  if (!query) return res.status(400).json({ status: false, error: 'query is required' });

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto('https://www.aidocmaker.com/chat', { waitUntil: 'networkidle2' });

    // Tape le message dans le champ texte
    await page.waitForSelector('textarea');
    await page.type('textarea', query);
    await page.keyboard.press('Enter');

    // Attendre que la réponse arrive (zone de chat qui se remplit)
    await page.waitForFunction(() => {
      const elems = document.querySelectorAll('.prose > p');
      return elems.length > 0 && elems[elems.length - 1].innerText.trim().length > 10;
    }, { timeout: 20000 });

    // Récupère la dernière réponse
    const response = await page.evaluate(() => {
      const elems = document.querySelectorAll('.prose > p');
      return elems[elems.length - 1].innerText.trim();
    });

    await browser.close();
    return res.json({ status: true, response });

  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ status: false, error: 'Failed to get response from aidocmaker.com' });
  }
}

module.exports = { meta, onStart };

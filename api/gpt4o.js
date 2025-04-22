const { Hercai } = require('hercai');

exports.config = {
    name: 'gpt4',
    author: 'Joshua Apostol',
    description: 'chat with the Gpt4',
    method: 'get',
    category: 'ai',
    link: ['/gpt4?query=hi']
};

exports.initialize = async function ({ req, res }) {
    try {
        const query = req.query.query;
        if (!query) {
            return res.status(400).json({ error: "Add ?query=your_query_here" });
        }

        const herc = new Hercai();
        const response = await herc.question({ model: "v3-32k", content: query });
        res.json({ response: response.reply });
    } catch (error) {
        res.status(500).json({ error: "Failed to interact with the Turbo model" });
    }
};

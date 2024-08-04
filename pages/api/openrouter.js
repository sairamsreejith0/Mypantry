// pages/api/openrouter.js

export default async function handler(req, res) {
    const { OPENROUTER_API_KEY } = process.env;

    if (req.method === 'POST') {
        const { content } = req.body;
        const body = JSON.stringify({
            model: "openai/gpt-4",
            messages: [
                { role: "user", content: content }
            ],
            max_tokens: 300 
        });

        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: body
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            res.status(200).json(data);
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

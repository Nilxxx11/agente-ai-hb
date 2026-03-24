export default async function handler(req, res) {
    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();

        console.log("Respuesta OpenRouter:", data); // 👈 clave

        return res.status(response.status).json(data);

    } catch (error) {
        console.error("Error backend:", error);
        return res.status(500).json({ error: { message: "Error interno" } });
    }
}

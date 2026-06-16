import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { messages, systemContext } = req.body;

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: 'messages array is required and must not be empty.' });
        }

        const systemPrompt = `You are DentAI, a helpful assistant for a dental clinic web app called DentistAI. You have access to the logged-in user's profile and appointment data provided below. Answer questions about their appointments, profile, clinic hours, services, and help them navigate the app. Be concise, friendly, and professional. Always address the user by their first name if available. Context: ${systemContext || 'No user context available.'}`;

        // Build the full messages array with system message first
        const fullMessages = [
            { role: 'system', content: systemPrompt },
            ...messages,
        ];

        const chatCompletion = await groq.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            messages: fullMessages,
            max_tokens: 1000,
            temperature: 0.7,
        });

        const reply = chatCompletion.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';

        return res.status(200).json({ reply });
    } catch (error) {
        console.error('Chat API error:', error);

        if (error.status === 401) {
            return res.status(500).json({ error: 'Invalid Groq API key.' });
        }

        if (error.status === 429) {
            return res.status(429).json({ error: 'Rate limit exceeded. Please try again shortly.' });
        }

        return res.status(500).json({ error: error.message || 'Internal server error.' });
    }
}

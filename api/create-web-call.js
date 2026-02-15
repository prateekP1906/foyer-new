import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client (outside handler for reuse)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
// Note: In Vercel, env vars are accessed via process.env automatically
// We only initialize if keys are present to avoid errors during build time if envs are missing
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

export default async function handler(req, res) {
    // Enable CORS for this endpoint
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const response = await fetch('https://api.retellai.com/v2/create-web-call', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.RETELL_API_KEY}`
            },
            body: JSON.stringify({
                agent_id: process.env.RETELL_AGENT_ID
            })
        });

        if (!response.ok) {
            throw new Error(`Retell API error: ${response.statusText}`);
        }

        const data = await response.json();
        res.status(200).json(data);

    } catch (error) {
        console.error('Error creating web call:', error);
        res.status(500).json({ error: error.message });
    }
}
